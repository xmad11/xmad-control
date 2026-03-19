/* ═══════════════════════════════════════════════════════════════════════════════
   TASK SUPERVISOR
   Queue management, concurrency control, and retry orchestration

   Responsibility:
   - Manage task queue with priority ordering
   - Execute tasks concurrently with configurable limits
   - Handle retries with exponential backoff
   - Track task progress and status
   - Emit events for observability
   - Resource governance with memory monitoring

   MUST NOT:
   - Execute tasks directly (delegates to skales-bridge)
   - Make strategic decisions about task content
   ═══════════════════════════════════════════════════════════════════════════════ */

import type {
  AgentTask,
  AgentTaskProgress,
  AgentTaskResult,
  TaskPriority,
} from "@/types/agent-task"
import { type TaskEventType, taskEvents } from "./events"
import { runSkalesTask } from "./skales-bridge"

/* ═══════════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════════ */

const DEFAULT_CONCURRENCY = 3
const MAX_CONCURRENCY = 10
const DEFAULT_TIMEOUT_MS = 30000
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 1000

// Memory thresholds for resource governance
const MEMORY_WARNING_THRESHOLD = 0.75 // 75% used
const MEMORY_CRITICAL_THRESHOLD = 0.85 // 85% used
const MEMORY_CHECK_INTERVAL_MS = 5000 // Check every 5s

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INTERNAL STATE
   ═══════════════════════════════════════════════════════════════════════════════ */

interface QueuedTask {
  task: AgentTask
  priority: number
  addedAt: number
  retries: number
}

interface ActiveTask {
  task: AgentTask
  startedAt: number
  abortController: AbortController
}

interface TaskSupervisorState {
  queue: QueuedTask[]
  active: Map<string, ActiveTask>
  completed: Map<string, AgentTaskResult>
  failed: Map<string, { error: string; retries: number }>
  concurrency: number
  isRunning: boolean
}

const state: TaskSupervisorState = {
  queue: [],
  active: new Map(),
  completed: new Map(),
  failed: new Map(),
  concurrency: DEFAULT_CONCURRENCY,
  isRunning: false,
}

/* ═══════════════════════════════════════════════════════════════════════════════
   RESOURCE GOVERNANCE
   ═══════════════════════════════════════════════════════════════════════════════ */

interface MemoryStatus {
  used: number
  total: number
  percentage: number
  level: "safe" | "warning" | "critical"
}

/**
 * Get current memory usage (Node.js runtime only)
 */
function getMemoryStatus(): MemoryStatus {
  const used = process.memoryUsage().heapUsed
  const total = process.memoryUsage().heapTotal
  const percentage = used / total

  let level: "safe" | "warning" | "critical" = "safe"
  if (percentage >= MEMORY_CRITICAL_THRESHOLD) {
    level = "critical"
  } else if (percentage >= MEMORY_WARNING_THRESHOLD) {
    level = "warning"
  }

  return { used, total, percentage, level }
}

/**
 * Resource governance loop - monitors memory and adjusts concurrency
 */
let governanceInterval: ReturnType<typeof setInterval> | null = null

function startResourceGovernance(): void {
  if (governanceInterval) return

  governanceInterval = setInterval(() => {
    const memStatus = getMemoryStatus()

    if (memStatus.level === "critical") {
      // Pause low-priority tasks by reducing concurrency to 1
      if (state.concurrency > 1) {
        const prevConcurrency = state.concurrency
        state.concurrency = 1
        taskEvents.emit("task:warning" as TaskEventType, {
          taskId: "governor",
          warning: `Memory critical (${Math.round(memStatus.percentage * 100)}%), reduced concurrency from ${prevConcurrency} to 1`,
        })
      }

      // Clear completed tasks to free memory
      if (state.completed.size > 100) {
        const keysToKeep = Array.from(state.completed.keys()).slice(-50)
        state.completed = new Map(keysToKeep.map((k) => [k, state.completed.get(k)!]))
      }
    } else if (memStatus.level === "warning") {
      // Reduce concurrency by half
      const targetConcurrency = Math.max(1, Math.floor(DEFAULT_CONCURRENCY / 2))
      if (state.concurrency > targetConcurrency) {
        state.concurrency = targetConcurrency
      }
    } else {
      // Restore normal concurrency
      if (state.concurrency < DEFAULT_CONCURRENCY) {
        state.concurrency = DEFAULT_CONCURRENCY
      }
    }
  }, MEMORY_CHECK_INTERVAL_MS)
}

function stopResourceGovernance(): void {
  if (governanceInterval) {
    clearInterval(governanceInterval)
    governanceInterval = null
  }
}

/**
 * Get current resource status
 */
export function getResourceStatus(): MemoryStatus & { concurrency: number; queueSize: number } {
  return {
    ...getMemoryStatus(),
    concurrency: state.concurrency,
    queueSize: state.queue.length,
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   QUEUE MANAGEMENT
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Add a task to the queue with priority ordering
 */
export function enqueueTask(task: AgentTask): string {
  const priority = PRIORITY_WEIGHTS[task.meta?.priority ?? "medium"]
  const queuedTask: QueuedTask = {
    task,
    priority,
    addedAt: Date.now(),
    retries: 0,
  }

  // Insert in priority order (higher priority first)
  let insertIndex = state.queue.findIndex((qt) => qt.priority < priority)
  if (insertIndex === -1) insertIndex = state.queue.length
  state.queue.splice(insertIndex, 0, queuedTask)

  taskEvents.emit("task:queued", {
    taskId: task.id,
    type: task.type,
    goal: task.goal,
    priority: task.meta?.priority ?? "medium",
    queuePosition: insertIndex + 1,
  })

  // Start processing if not already running
  if (!state.isRunning) {
    processQueue()
  }

  return task.id
}

/**
 * Remove a task from the queue
 */
export function dequeueTask(taskId: string): boolean {
  const index = state.queue.findIndex((qt) => qt.task.id === taskId)
  if (index === -1) return false

  state.queue.splice(index, 1)
  taskEvents.emit("task:cancelled", { taskId, reason: "removed_from_queue" })
  return true
}

/**
 * Get current queue status
 */
export function getQueueStatus(): {
  pending: number
  active: number
  completed: number
  failed: number
} {
  return {
    pending: state.queue.length,
    active: state.active.size,
    completed: state.completed.size,
    failed: state.failed.size,
  }
}

/**
 * Get task progress
 */
export function getTaskProgress(taskId: string): AgentTaskProgress | null {
  // Check active tasks
  const active = state.active.get(taskId)
  if (active) {
    return {
      taskId,
      status: "running",
      progress: 50, // Would need bridge callback for accurate progress
      step: "Executing",
      timestamp: new Date().toISOString(),
    }
  }

  // Check completed tasks
  const completed = state.completed.get(taskId)
  if (completed) {
    return {
      taskId,
      status: completed.success ? "completed" : "failed",
      progress: 100,
      step: completed.success ? "Done" : `Failed: ${completed.error}`,
      timestamp: new Date().toISOString(),
    }
  }

  // Check queue position
  const queueIndex = state.queue.findIndex((qt) => qt.task.id === taskId)
  if (queueIndex !== -1) {
    return {
      taskId,
      status: "pending",
      progress: 0,
      step: `Queued (position ${queueIndex + 1})`,
      timestamp: new Date().toISOString(),
    }
  }

  return null
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EXECUTION ENGINE
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Process the queue with concurrency control
 */
async function processQueue(): Promise<void> {
  if (state.isRunning) return
  state.isRunning = true

  // Start resource governance
  startResourceGovernance()

  try {
    while (state.queue.length > 0 || state.active.size > 0) {
      // Fill available slots (respects dynamic concurrency from governance)
      while (state.active.size < state.concurrency && state.queue.length > 0) {
        const queuedTask = state.queue.shift()
        if (!queuedTask) break

        executeTask(queuedTask)
      }

      // Wait a bit before checking again
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  } finally {
    state.isRunning = false
    stopResourceGovernance()
  }
}

/**
 * Execute a single task with retry handling
 */
async function executeTask(queuedTask: QueuedTask): Promise<void> {
  const { task, retries } = queuedTask
  const abortController = new AbortController()

  state.active.set(task.id, {
    task,
    startedAt: Date.now(),
    abortController,
  })

  taskEvents.emit("task:started", {
    taskId: task.id,
    type: task.type,
    goal: task.goal,
    retryAttempt: retries,
  })

  try {
    const result = await runSkalesTask(task, {
      timeoutMs: task.constraints?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      onProgress: (step) => {
        taskEvents.emit("task:progress", {
          taskId: task.id,
          step,
          progress: 50,
        })
      },
      onError: (error) => {
        taskEvents.emit("task:warning", {
          taskId: task.id,
          warning: error,
        })
      },
    })

    state.active.delete(task.id)

    if (result.success) {
      state.completed.set(task.id, result)
      taskEvents.emit("task:completed", {
        taskId: task.id,
        result,
        durationMs: result.durationMs,
      })
    } else {
      // Check if we should retry
      const maxRetries = task.constraints?.maxRetries ?? MAX_RETRIES
      if (retries < maxRetries) {
        await scheduleRetry(queuedTask)
      } else {
        state.failed.set(task.id, {
          error: result.error ?? "Unknown error",
          retries,
        })
        taskEvents.emit("task:failed", {
          taskId: task.id,
          error: result.error ?? "Max retries exceeded",
          retries,
        })
      }
    }
  } catch (err) {
    state.active.delete(task.id)
    const errorMessage = (err as Error).message

    // Check if we should retry
    const maxRetries = task.constraints?.maxRetries ?? MAX_RETRIES
    if (retries < maxRetries) {
      await scheduleRetry({ ...queuedTask, retries: retries + 1 })
    } else {
      state.failed.set(task.id, { error: errorMessage, retries })
      taskEvents.emit("task:failed", {
        taskId: task.id,
        error: errorMessage,
        retries,
      })
    }
  }
}

/**
 * Schedule a retry with exponential backoff
 */
async function scheduleRetry(queuedTask: QueuedTask): Promise<void> {
  const { task, retries } = queuedTask
  const delay = RETRY_BASE_DELAY_MS * 2 ** retries

  taskEvents.emit("task:retry", {
    taskId: task.id,
    retryAttempt: retries + 1,
    delayMs: delay,
  })

  await new Promise((resolve) => setTimeout(resolve, delay))

  // Re-add to queue with same priority
  const priority = PRIORITY_WEIGHTS[task.meta?.priority ?? "medium"]
  const retryTask: QueuedTask = {
    ...queuedTask,
    priority,
    retries: retries + 1,
  }

  // Insert at front of queue for retries
  state.queue.unshift(retryTask)

  if (!state.isRunning) {
    processQueue()
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONFIGURATION API
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Set concurrency limit
 */
export function setConcurrency(limit: number): void {
  state.concurrency = Math.min(Math.max(1, limit), MAX_CONCURRENCY)
}

/**
 * Cancel all tasks
 */
export function cancelAllTasks(): void {
  // Cancel queued tasks
  for (const qt of state.queue) {
    taskEvents.emit("task:cancelled", {
      taskId: qt.task.id,
      reason: "cancel_all",
    })
  }
  state.queue = []

  // Abort active tasks
  for (const [taskId, active] of state.active) {
    active.abortController.abort()
    taskEvents.emit("task:cancelled", {
      taskId,
      reason: "cancel_all",
    })
  }
  state.active.clear()
}

/**
 * Subscribe to task events
 */
export function onTaskEvent(event: TaskEventType, listener: (data: unknown) => void): () => void {
  taskEvents.on(event, listener)
  return () => taskEvents.off(event, listener)
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BATCH OPERATIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Execute multiple tasks in parallel with queue management
 */
export async function executeBatch(tasks: AgentTask[]): Promise<AgentTaskResult[]> {
  const taskIds = tasks.map((task) => {
    enqueueTask(task)
    return task.id
  })

  return new Promise((resolve) => {
    const results: AgentTaskResult[] = []
    const checkComplete = () => {
      for (const taskId of taskIds) {
        const completed = state.completed.get(taskId)
        const failed = state.failed.get(taskId)

        if (completed && !results.find((r) => r.taskId === taskId)) {
          results.push(completed)
        } else if (failed && !results.find((r) => r.taskId === taskId)) {
          results.push({
            success: false,
            taskId,
            error: failed.error,
            retries: failed.retries,
          })
        }
      }

      if (results.length === tasks.length) {
        taskEvents.off("task:completed", checkComplete)
        taskEvents.off("task:failed", checkComplete)
        resolve(results)
      }
    }

    taskEvents.on("task:completed", checkComplete)
    taskEvents.on("task:failed", checkComplete)
  })
}
