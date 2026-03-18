/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT API ROUTE — XMAD Dashboard
   Handles AI chat messages through OpenClaw gateway
   ═══════════════════════════════════════════════════════════════════════════════ */

import { type NextRequest, NextResponse } from "next/server"

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const isVercel = process.env.VERCEL === "1"
const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY_URL || "http://127.0.0.1:18789"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatRequest {
  message: string
  sessionId?: string
  context?: Record<string, unknown>
}

interface OpenClawResponse {
  success: boolean
  response?: string
  error?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  // On Vercel, return mock response (serverless cannot reach local OpenClaw)
  if (isVercel) {
    try {
      const body: ChatRequest = await request.json()
      return NextResponse.json({
        success: true,
        message: `Chat is available when connected to xmad gateway. On Vercel, AI features require the self-hosted dashboard. Your message was: "${body.message?.slice(0, 50) || ""}"`,
        note: "Connect via Tailscale to your self-hosted dashboard for full AI features.",
      })
    } catch {
      return NextResponse.json({
        success: false,
        error: "Invalid request",
      }, { status: 400 })
    }
  }

  try {
    // Parse request body
    const body: ChatRequest = await request.json()
    const { message, sessionId = "dashboard-session", context = {} } = body

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Invalid message" }, { status: 400 })
    }

    // Forward to OpenClaw Gateway
    const gatewayUrl = `${OPENCLAW_GATEWAY}/api/chat`

    const gatewayResponse = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId,
        context,
        source: "dashboard",
      }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!gatewayResponse.ok) {
      console.error(`OpenClaw gateway error: ${gatewayResponse.status}`)
      return NextResponse.json(
        {
          success: false,
          error: "AI service temporarily unavailable.",
        },
        { status: 503 }
      )
    }

    const data: OpenClawResponse = await gatewayResponse.json()

    if (!data.success || !data.response) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service temporarily unavailable.",
        },
        { status: 500 }
      )
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      message: data.response,
    })
  } catch (error) {
    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: "AI service temporarily unavailable.",
        },
        { status: 504 }
      )
    }

    // Handle other errors - never expose internal errors
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "AI service temporarily unavailable.",
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIONS HANDLER (for CORS)
// ═══════════════════════════════════════════════════════════════════════════════

const ALLOWED_ORIGINS = [
  "http://localhost:3333",
  "http://127.0.0.1:3333",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // Add production URL when deployed
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
].filter(Boolean)

function getAllowedOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin") || ""
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] || ""
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": getAllowedOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
