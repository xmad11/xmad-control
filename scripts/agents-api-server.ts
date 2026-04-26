/**
 * Agents API Server — Lightweight proxy for Antigravity's agent endpoints
 * Runs on port 4040, proxies prompts to Antigravity IDE's local agent API
 *
 * Start: bun run ~/xmad-control/scripts/agents-api-server.ts
 * Health: http://localhost:4040/health
 */

const PORT = 4040
const ANTIGRAVITY_BASE = "http://localhost:3000" // Antigravity's default port

interface AgentInfo {
  id: string
  name: string
  status: "online" | "offline" | "unknown"
}

const KNOWN_AGENTS: AgentInfo[] = [
  { id: "chatgpt", name: "ChatGPT", status: "unknown" },
  { id: "claude", name: "Claude", status: "unknown" },
  { id: "gemini", name: "Gemini", status: "unknown" },
]

const _server = Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url)

    // CORS headers for mobile access
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    // Health check
    if (url.pathname === "/health") {
      return Response.json({ ok: true, status: "live", port: PORT }, { headers: corsHeaders })
    }

    // List agents
    if (url.pathname === "/agents" && req.method === "GET") {
      // Try to detect if Antigravity is running
      const ideRunning = await checkAntigravity()
      const agents = KNOWN_AGENTS.map((a) => ({
        ...a,
        status: ideRunning ? ("online" as const) : ("offline" as const),
      }))
      return Response.json({ agents }, { headers: corsHeaders })
    }

    // Send prompt to agent
    if (url.pathname.match(/^\/agents\/[\w-]+\/prompt$/) && req.method === "POST") {
      const agentId = url.pathname.split("/")[2]
      try {
        const body = (await req.json()) as { prompt: string }
        if (!body.prompt) {
          return Response.json(
            { ok: false, error: "Missing prompt" },
            { status: 400, headers: corsHeaders }
          )
        }

        // Forward to Antigravity's agent endpoint
        try {
          const upstreamRes = await fetch(`${ANTIGRAVITY_BASE}/agents/${agentId}/prompt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: body.prompt }),
            signal: AbortSignal.timeout(60_000),
          })

          if (!upstreamRes.ok) {
            const errText = await upstreamRes.text().catch(() => "Unknown error")
            return Response.json(
              { ok: false, error: `Upstream error (${upstreamRes.status}): ${errText}` },
              { status: upstreamRes.status, headers: corsHeaders }
            )
          }

          const data = await upstreamRes.json()
          return Response.json(
            {
              ok: true,
              agent: agentId,
              response: data.response ?? data.message ?? data.text ?? JSON.stringify(data),
              timestamp: new Date().toISOString(),
            },
            { headers: corsHeaders }
          )
        } catch {
          return Response.json(
            {
              ok: false,
              agent: agentId,
              error: "Antigravity IDE not responding. Is it running?",
              timestamp: new Date().toISOString(),
            },
            { status: 503, headers: corsHeaders }
          )
        }
      } catch {
        return Response.json(
          { ok: false, error: "Invalid JSON body" },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // 404
    return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders })
  },
})

async function checkAntigravity(): Promise<boolean> {
  try {
    const proc = Bun.spawn(["pgrep", "-f", "Antigravity"])
    const exitCode = await proc.exited
    return exitCode === 0
  } catch {
    return false
  }
}

console.log(`[agents-api] Running on port ${PORT}`)
console.log(`[agents-api] Health: http://localhost:${PORT}/health`)
console.log(`[agents-api] Antigravity proxy: ${ANTIGRAVITY_BASE}`)
