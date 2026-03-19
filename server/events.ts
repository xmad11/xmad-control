/* ═══════════════════════════════════════════════════════════════════════════════
   EVENT EMITTER
   Typed event system for task orchestration and progress broadcasting

   Responsibility:
   - Provide type-safe event emission
   - Enable loose coupling between components
   - Support real-time progress updates

   MUST NOT:
   - Execute business logic directly
   - Store state beyond listener registry
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { AgentTaskResult, AgentTaskType, TaskPriority } from "@/types/agent-task"

/* ═══════════════════════════════════════════════════════════════════════════════
   EVENT TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

export type TaskEventType =
  | "task:queued"
  | "task:started"
  | "task:progress"
  | "task:warning"
  | "task:completed"
  | "task:failed"
  | "task:retry"
  | "task:cancelled"

export interface TaskQueuedEvent {
  taskId: string
  type: AgentTaskType
  goal: string
  priority: TaskPriority
  queuePosition: number
}

export interface TaskStartedEvent {
  taskId: string
  type: AgentTaskType
  goal: string
  retryAttempt: number
}

export interface TaskProgressEvent {
  taskId: string
  step: string
  progress: number
}

export interface TaskWarningEvent {
  taskId: string
  warning: string
}

export interface TaskCompletedEvent {
  taskId: string
  result: AgentTaskResult
  durationMs?: number
}

export interface TaskFailedEvent {
  taskId: string
  error: string
  retries: number
}

export interface TaskRetryEvent {
  taskId: string
  retryAttempt: number
  delayMs: number
}

export interface TaskCancelledEvent {
  taskId: string
  reason: string
}

export type TaskEventMap = {
  "task:queued": TaskQueuedEvent
  "task:started": TaskStartedEvent
  "task:progress": TaskProgressEvent
  "task:warning": TaskWarningEvent
  "task:completed": TaskCompletedEvent
  "task:failed": TaskFailedEvent
  "task:retry": TaskRetryEvent
  "task:cancelled": TaskCancelledEvent
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPED EVENT EMITTER
   ═══════════════════════════════════════════════════════════════════════════════ */

type EventListener<T> = (data: T) => void

// Maximum listeners per event to prevent memory leaks
const MAX_LISTENERS_PER_EVENT = 50

class TypedEventEmitter<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<EventListener<unknown>>>()
  private maxListeners = MAX_LISTENERS_PER_EVENT

  on<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const eventListeners = this.listeners.get(event)!
    if (eventListeners.size >= this.maxListeners) {
      console.warn(
        `[Events] Max listeners (${this.maxListeners}) reached for event "${String(event)}". Possible memory leak. Check cleanup logic.`
      )
    }

    eventListeners.add(listener as EventListener<unknown>)
  }

  off<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(listener as EventListener<unknown>)
    }
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      for (const listener of eventListeners) {
        try {
          listener(data)
        } catch (err) {
          console.error(`[Events] Error in listener for ${String(event)}:`, err)
        }
      }
    }
  }

  once<K extends keyof EventMap>(event: K, listener: EventListener<EventMap[K]>): void {
    const onceListener: EventListener<EventMap[K]> = (data) => {
      this.off(event, onceListener)
      listener(data)
    }
    this.on(event, onceListener)
  }

  /**
   * Remove all listeners for an event, or all listeners if no event specified
   */
  removeAllListeners(event?: keyof EventMap): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: keyof EventMap): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SINGLETON INSTANCE
   ═══════════════════════════════════════════════════════════════════════════════ */

export const taskEvents = new TypedEventEmitter<TaskEventMap>()

/* ═══════════════════════════════════════════════════════════════════════════════
   SSE HELPER
   Convert task events to Server-Sent Events format
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Create an SSE message string
 */
export function createSSEMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

/**
 * Create a readable stream that broadcasts task events
 */
export function createTaskEventStream(taskId: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController<Uint8Array>

  const listeners = new Map<TaskEventType, EventListener<unknown>>()

  const setupListeners = () => {
    const events: TaskEventType[] = [
      "task:queued",
      "task:started",
      "task:progress",
      "task:warning",
      "task:completed",
      "task:failed",
      "task:retry",
      "task:cancelled",
    ]

    for (const event of events) {
      const listener = (data: unknown) => {
        const eventData = data as { taskId?: string }
        if (eventData.taskId === taskId) {
          try {
            controller.enqueue(encoder.encode(createSSEMessage(event, data)))
          } catch {
            // Controller may be closed
          }

          // Close stream on terminal events
          if (event === "task:completed" || event === "task:failed" || event === "task:cancelled") {
            try {
              controller.close()
            } catch {
              // Already closed
            }
            cleanupListeners()
          }
        }
      }

      listeners.set(event, listener)
      taskEvents.on(event, listener)
    }
  }

  const cleanupListeners = () => {
    for (const [event, listener] of listeners) {
      taskEvents.off(event, listener)
    }
    listeners.clear()
  }

  return new ReadableStream({
    start(ctrl) {
      controller = ctrl
      setupListeners()
    },
    cancel() {
      cleanupListeners()
    },
  })
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LOGGING HELPER
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Enable debug logging for all task events
 */
export function enableTaskEventLogging(): () => void {
  const events: TaskEventType[] = [
    "task:queued",
    "task:started",
    "task:progress",
    "task:warning",
    "task:completed",
    "task:failed",
    "task:retry",
    "task:cancelled",
  ]

  const cleanup: (() => void)[] = []

  for (const event of events) {
    const listener = (data: unknown) => {
      console.log(`[TaskEvents] ${event}:`, JSON.stringify(data, null, 2))
    }
    taskEvents.on(event, listener)
    cleanup.push(() => taskEvents.off(event, listener))
  }

  return () => {
    for (const fn of cleanup) fn()
  }
}
