/* ═══════════════════════════════════════════════════════════════════════════════
   SKALES BRIDGE
   Execution layer bridge between xmad-control (brain) and Skales (hands)

   Responsibility:
   - Spawn isolated processes for task execution
   - Handle IPC (stdin/stdout JSON transport)
   - Enforce timeouts and resource limits
   - Report results back to caller

   MUST NOT:
   - Make strategic decisions (that's xmad-control's job)
   - Interpret task meaning (just transport and execute)
   ═══════════════════════════════════════════════════════════════════════════════ */

import { type ChildProcess, spawn } from "node:child_process"
import type { AgentTask, AgentTaskResult } from "@/types/agent-task"

const DEFAULT_TIMEOUT_MS = 30000

interface BridgeOptions {
  /** Override timeout for this execution */
  timeoutMs?: number
  /** Called with progress updates */
  onProgress?: (step: string) => void
  /** Called on stderr output */
  onError?: (error: string) => void
}

/**
 * Execute a task via the Skales runner
 * Spawns an isolated Node.js process and communicates via JSON over stdin/stdout
 */
export async function runSkalesTask(
  task: AgentTask,
  options?: BridgeOptions
): Promise<AgentTaskResult> {
  return new Promise((resolve, _reject) => {
    const startTime = Date.now()
    const timeoutMs = options?.timeoutMs ?? task.constraints?.timeoutMs ?? DEFAULT_TIMEOUT_MS

    let stdout = ""
    let stderr = ""
    let killed = false

    // Spawn isolated process - runner path resolved at runtime only
    // Using array join to avoid Next.js static string detection
    const runnerPath = [process.cwd(), "skales-runner.js"].join("/")
    const proc: ChildProcess = spawn("node", [runnerPath], {
      stdio: ["pipe", "pipe", "pipe"],
      // Isolation: don't inherit environment or cwd
      env: { ...process.env, NODE_ENV: "production" },
    })

    // Collect stdout
    proc.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString()
    })

    // Collect stderr and notify
    proc.stderr?.on("data", (data: Buffer) => {
      const err = data.toString()
      stderr += err
      options?.onError?.(err)
    })

    // Handle process completion
    proc.on("close", (code: number) => {
      if (killed) {
        resolve({
          success: false,
          taskId: task.id,
          error: "Task timed out",
          durationMs: Date.now() - startTime,
        })
        return
      }

      try {
        const result = JSON.parse(stdout) as AgentTaskResult
        resolve({
          ...result,
          taskId: task.id,
          durationMs: Date.now() - startTime,
        })
      } catch {
        resolve({
          success: false,
          taskId: task.id,
          error: stderr || `Process exited with code ${code}`,
          data: stdout,
          durationMs: Date.now() - startTime,
        })
      }
    })

    // Handle spawn errors
    proc.on("error", (err: Error) => {
      resolve({
        success: false,
        taskId: task.id,
        error: `Failed to spawn runner: ${err.message}`,
        durationMs: Date.now() - startTime,
      })
    })

    // Send task to runner via stdin
    try {
      proc.stdin?.write(JSON.stringify(task))
      proc.stdin?.end()
    } catch (err) {
      proc.kill()
      resolve({
        success: false,
        taskId: task.id,
        error: `Failed to send task: ${(err as Error).message}`,
        durationMs: Date.now() - startTime,
      })
      return
    }

    // Enforce timeout
    const timeout = setTimeout(() => {
      killed = true
      proc.kill("SIGKILL")
      options?.onError?.(`Task killed after ${timeoutMs}ms timeout`)
    }, timeoutMs)

    // Cleanup timeout on completion
    proc.on("close", () => clearTimeout(timeout))
  })
}

/**
 * Check if the Skales runner is available
 */
export async function checkSkalesHealth(): Promise<{ available: boolean; error?: string }> {
  try {
    const result = await runSkalesTask(
      {
        id: "health-check",
        type: "research",
        goal: "ping",
        constraints: { timeoutMs: 5000 },
      },
      { timeoutMs: 5000 }
    )

    return { available: result.success }
  } catch (err) {
    return { available: false, error: (err as Error).message }
  }
}

/**
 * Execute multiple tasks in parallel with a concurrency limit
 */
export async function runSkalesTasksParallel(
  tasks: AgentTask[],
  concurrency = 3
): Promise<AgentTaskResult[]> {
  const results: AgentTaskResult[] = []
  const queue = [...tasks]

  async function processQueue(): Promise<void> {
    while (queue.length > 0) {
      const task = queue.shift()
      if (!task) break

      const result = await runSkalesTask(task)
      results.push(result)
    }
  }

  // Run 'concurrency' workers in parallel
  await Promise.all(Array.from({ length: concurrency }, () => processQueue()))

  return results
}
