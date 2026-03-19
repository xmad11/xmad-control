/* ═══════════════════════════════════════════════════════════════════════════════
   AGENT TASK CONTRACT
   Deterministic task definition for xmad-control ↔ Skales bridge

   This is the backbone of the agent system. All tasks flowing through
   the system MUST conform to this contract.
   ═══════════════════════════════════════════════════════════════════════════════ */

export type AgentTaskType = "scrape" | "message" | "automation" | "research"

export type TaskPriority = "low" | "medium" | "high"

export type TaskSource = "voice" | "dashboard" | "system" | "cli" | "api" | "api-stream"

export interface AgentTaskConstraints {
  /** Maximum execution time in milliseconds */
  timeoutMs?: number
  /** Maximum retry attempts on failure */
  maxRetries?: number
}

export interface AgentTaskMeta {
  /** Where the task originated from */
  source: TaskSource
  /** Task priority for queue ordering */
  priority: TaskPriority
  /** Timestamp when task was created */
  createdAt?: string
  /** User ID if applicable */
  userId?: string
  /** Session ID for context tracking */
  sessionId?: string
}

export interface AgentTaskInput {
  /** URL for scrape tasks */
  url?: string
  /** Recipient for message tasks */
  recipient?: string
  /** Message content */
  content?: string
  /** Selector for automation tasks */
  selector?: string
  /** Action to perform */
  action?: string
  /** Additional context data */
  context?: Record<string, unknown>
}

export interface AgentTask {
  /** Unique task identifier */
  id: string
  /** Task type determines execution handler */
  type: AgentTaskType
  /** Natural language goal description */
  goal: string
  /** Type-specific input parameters */
  input?: AgentTaskInput
  /** Execution constraints */
  constraints?: AgentTaskConstraints
  /** Task metadata */
  meta?: AgentTaskMeta
}

export interface AgentTaskResult {
  /** Whether the task completed successfully */
  success: boolean
  /** Task ID this result corresponds to */
  taskId: string
  /** Result data */
  data?: unknown
  /** Error message if failed */
  error?: string
  /** Execution time in milliseconds */
  durationMs?: number
  /** Number of retries attempted */
  retries?: number
}

export interface AgentTaskProgress {
  /** Task ID */
  taskId: string
  /** Current status */
  status: "pending" | "running" | "completed" | "failed" | "timeout"
  /** Progress percentage (0-100) */
  progress?: number
  /** Current step description */
  step?: string
  /** Timestamp */
  timestamp: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TASK FACTORY
   Helper functions for creating tasks with proper defaults
   ═══════════════════════════════════════════════════════════════════════════════ */

export function createAgentTask(
  type: AgentTaskType,
  goal: string,
  options?: {
    input?: AgentTaskInput
    constraints?: AgentTaskConstraints
    meta?: Partial<AgentTaskMeta>
  }
): AgentTask {
  return {
    id: crypto.randomUUID(),
    type,
    goal,
    input: options?.input,
    constraints: {
      timeoutMs: 30000, // Default 30s timeout
      maxRetries: 2, // Default 2 retries
      ...options?.constraints,
    },
    meta: {
      source: "system",
      priority: "medium",
      createdAt: new Date().toISOString(),
      ...options?.meta,
    },
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPE GUARDS
   Runtime validation for task objects
   ═══════════════════════════════════════════════════════════════════════════════ */

export function isValidAgentTask(task: unknown): task is AgentTask {
  if (typeof task !== "object" || task === null) return false

  const t = task as Record<string, unknown>

  return (
    typeof t.id === "string" &&
    typeof t.type === "string" &&
    ["scrape", "message", "automation", "research"].includes(t.type as string) &&
    typeof t.goal === "string"
  )
}

export function isValidAgentTaskResult(result: unknown): result is AgentTaskResult {
  if (typeof result !== "object" || result === null) return false

  const r = result as Record<string, unknown>

  return typeof r.success === "boolean" && typeof r.taskId === "string"
}
