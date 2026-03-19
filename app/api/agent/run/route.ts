/* ═══════════════════════════════════════════════════════════════════════════════
   AGENT RUN API ROUTE
   HTTP endpoint for triggering agent tasks from dashboard/voice/system

   POST /api/agent/run
   Body: AgentTask JSON

   Response: { ok: boolean, result: AgentTaskResult }
   ═══════════════════════════════════════════════════════════════════════════════ */

import { runSkalesTask } from "@/server/skales-bridge"
import type { AgentTask, AgentTaskResult, isValidAgentTask } from "@/types/agent-task"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface ApiResponse {
  ok: boolean
  result?: AgentTaskResult
  error?: string
}

/**
 * POST /api/agent/run
 * Execute an agent task via the Skales bridge
 */
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json()

    // Validate task structure
    if (!isValidAgentRequestBody(body)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid task: must include id, type, and goal",
        },
        { status: 400 }
      )
    }

    const task: AgentTask = body

    // Execute via bridge
    const result = await runSkalesTask(task, {
      timeoutMs: task.constraints?.timeoutMs ?? 30000,
      onError: (err) => console.error("[Agent API] Runner error:", err),
    })

    return NextResponse.json({
      ok: result.success,
      result,
    })
  } catch (err) {
    console.error("[Agent API] Error:", err)
    return NextResponse.json(
      {
        ok: false,
        error: (err as Error).message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/agent/run
 * Health check for the agent system
 */
export async function GET(): Promise<NextResponse<ApiResponse & { available?: boolean }>> {
  try {
    // Simple health check - ping the runner
    const result = await runSkalesTask(
      {
        id: "health-check",
        type: "research",
        goal: "ping",
        constraints: { timeoutMs: 5000 },
      },
      { timeoutMs: 5000 }
    )

    return NextResponse.json({
      ok: true,
      available: result.success,
      result,
    })
  } catch (err) {
    return NextResponse.json({
      ok: false,
      available: false,
      error: (err as Error).message,
    })
  }
}

/**
 * Type guard for request body validation
 */
function isValidAgentRequestBody(body: unknown): body is AgentTask {
  if (typeof body !== "object" || body === null) return false

  const b = body as Record<string, unknown>

  return (
    typeof b.id === "string" &&
    typeof b.type === "string" &&
    ["scrape", "message", "automation", "research"].includes(b.type as string) &&
    typeof b.goal === "string"
  )
}
