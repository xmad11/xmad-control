/**
 * XMAD Server-Sent Events (SSE) Endpoint
 * Real-time updates from XMAD system
 *
 * Route: /api/xmad/events
 */

import type { NextRequest } from "next/server"

const XMAD_API_URL = process.env.XMAD_API_URL || "http://localhost:9870"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`))

      // Set up interval for system stats
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${XMAD_API_URL}/api/system/stats`)
          if (response.ok) {
            const stats = await response.json()
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "stats", data: stats })}\n\n`)
            )
          }
        } catch (_error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "API unavailable" })}\n\n`
            )
          )
        }
      }, 5000) // Update every 5 seconds

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
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
