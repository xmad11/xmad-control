// app/api/xmad/chat/route.ts
// Calls z.ai GLM-4.7 directly via Anthropic-compatible API
// OpenClaw is WhatsApp-only — this is the dashboard chat endpoint

import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ZAI_BASE = "https://api.z.ai/api/anthropic/v1"
const MODEL = "zai/glm-4.7"

function getZaiKey(): string {
  return process.env.ZAI_API_KEY || process.env.SSOT_ZAI_KEY || ""
}

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatRequest {
  message: string
  sessionId?: string
  context?: Record<string, unknown>
  history?: ChatMessage[]
  stream?: boolean
}

const NOVA_SYSTEM_PROMPT = `You are Nova, Ahmad's AI assistant managing the XMAD platform.
You are the Super Agent for the XMAD Control Center dashboard.
Be direct, concise, and technical. Ahmad prefers no filler words.
You manage: system monitoring, service control, tenant creation, automation, backups, and agent orchestration.
Current stack: Next.js 16, Bun, Tailwind 4, TypeScript. Two projects: xmad-control (super admin dashboard) + platform-monorepo (multi-tenant factory).`

export async function POST(request: NextRequest) {
  const apiKey = getZaiKey()

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "ZAI_API_KEY not configured. Add to Keychain as z.ai/openclaw." },
      { status: 503 }
    )
  }

  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const { message, history = [], stream = false } = body

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
  }

  if (message.length > 10000) {
    return NextResponse.json(
      { success: false, error: "Message too long (max 10000 chars)" },
      { status: 400 }
    )
  }

  const messages: ChatMessage[] = [...history.slice(-10), { role: "user", content: message.trim() }]

  const payload = {
    model: MODEL,
    max_tokens: 2048,
    system: NOVA_SYSTEM_PROMPT,
    messages,
    stream,
  }

  try {
    const response = await fetch(`${ZAI_BASE}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[chat] z.ai error:", response.status, errorText)
      return NextResponse.json(
        { success: false, error: `AI service error: ${response.status}` },
        { status: 502 }
      )
    }

    if (stream && response.body) {
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text ?? data?.completion ?? "No response"

    return NextResponse.json({
      success: true,
      message: text,
      model: MODEL,
      usage: data?.usage,
    })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ success: false, error: "Request timeout (60s)" }, { status: 504 })
    }
    console.error("[chat] Error:", error)
    return NextResponse.json({ success: false, error: "AI service unavailable" }, { status: 500 })
  }
}

export async function GET() {
  const key = getZaiKey()
  return NextResponse.json({
    ok: true,
    configured: !!key,
    model: MODEL,
    endpoint: ZAI_BASE,
  })
}
