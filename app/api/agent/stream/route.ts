/* ═══════════════════════════════════════════════════════════════════════════════
   AGENT STREAM API ROUTE
   SSE (Server-Sent Events) endpoint for real-time task progress

   GET /api/agent/stream?taskId=<id>
   Returns: text/event-stream with progress updates
   ═══════════════════════════════════════════════════════════════════════════════ */

import { runSkalesTask } from "@/server/skales-bridge"
import {
  type AgentTask,
  type AgentTaskProgress,
  createAgentTask,
  isValidAgentTask,
} from "@/types/agent-task"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * GET /api/agent/stream
 * Execute task with real-time progress updates via SSE
 *
 * Query params:
 *   - goal: Task goal (required)
 *   - type: Task type (default: research)
 *   - url: Optional URL for scrape/automation
 */
export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const goal = searchParams.get("goal")
  const type = (searchParams.get("type") as AgentTask["type"]) || "research"
  const url = searchParams.get("url")

  if (!goal) {
    return new Response("Missing goal parameter", { status: 400 })
  }

  const task = createAgentTask(type, goal, {
    input: url ? { url } : undefined,
    meta: { source: "api-stream" },
  })

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        controller.enqueue(new TextEncoder().encode(message))
      }

      // Send task started
      send("started", { taskId: task.id, type: task.type, goal: task.goal })

      try {
        // Send progress updates
        send("progress", {
          taskId: task.id,
          status: "running",
          step: "Initializing browser...",
          progress: 10,
        })

        // Execute with progress callback
        const result = await runSkalesTask(task, {
          onProgress: (step) =>
            send("progress", { taskId: task.id, status: "running", step, progress: 50 }),
          onError: (error) => send("warning", { taskId: task.id, error }),
        })

        // Send completion
        send("progress", { taskId: task.id, status: "completed", step: "Done", progress: 100 })
        send("result", { ...result, taskId: task.id })
      } catch (err) {
        send("error", { taskId: task.id, error: (err as Error).message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

/**
 * POST /api/agent/stream
 * Execute task with SSE progress updates
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    if (!isValidAgentTask(body)) {
      return new Response(JSON.stringify({ error: "Invalid task" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const task = body as AgentTask

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: object) => {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
          controller.enqueue(new TextEncoder().encode(message))
        }

        send("started", { taskId: task.id })

        try {
          const result = await runSkalesTask(task, {
            onProgress: (step) => send("progress", { taskId: task.id, step }),
            onError: (error) => send("warning", { taskId: task.id, error }),
          })

          send("result", { ...result, taskId: task.id })
        } catch (err) {
          send("error", { taskId: task.id, error: (err as Error).message })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
