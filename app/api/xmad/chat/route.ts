/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT API ROUTE — XMAD Dashboard
   Handles AI chat messages through OpenClaw gateway
   ═══════════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

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
  try {
    // Parse request body
    const body: ChatRequest = await request.json()
    const { message, sessionId = "dashboard-session", context = {} } = body

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid message" },
        { status: 400 }
      )
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
          error: "AI service unavailable. Please check if OpenClaw gateway is running.",
        },
        { status: 503 }
      )
    }

    const data: OpenClawResponse = await gatewayResponse.json()

    if (!data.success || !data.response) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "No response from AI service",
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
          error: "Request timeout. AI service took too long to respond.",
        },
        { status: 504 }
      )
    }

    // Handle other errors
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIONS HANDLER (for CORS)
// ═══════════════════════════════════════════════════════════════════════════════

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
