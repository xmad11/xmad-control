// app/api/xmad/services/route.ts
// Fetches real service status from bridge or local check
// Matches ServiceStatus shape expected by useSurfaceController

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BRIDGE_URL = process.env.XMAD_BRIDGE_URL
const IS_VERCEL = process.env.VERCEL === "1"

async function fetchFromBridge() {
  if (!BRIDGE_URL) return null
  try {
    const res = await fetch(`${BRIDGE_URL}/status`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      // Bridge status.json has openclaw and mode - build services shape
      return {
        openclaw: {
          running: data.openclaw?.running ?? false,
          pid: data.openclaw?.pid ?? null,
          memoryUsage: data.openclaw?.memoryMB ?? 0,
        },
        tailscale: {
          connected: true, // if bridge is reachable via Tailscale, it's connected
          ip: BRIDGE_URL.match(/(\d+\.\d+\.\d+\.\d+)/)?.[1] ?? null,
        },
        mode: data.mode ?? "eco",
        _source: "bridge",
      }
    }
  } catch {}
  return null
}

function getLocalServices() {
  let openclawRunning = false
  let openclawPid: number | null = null
  let tailscaleConnected = false
  let tailscaleIp: string | null = null

  try {
    const r = execSync("lsof -i :18789 -sTCP:LISTEN -n -P 2>/dev/null | tail -1", {
      timeout: 2000,
      encoding: "utf8",
    })
    if (r.trim()) {
      openclawRunning = true
      openclawPid = Number.parseInt(r.trim().split(/\s+/)[1]) || null
    }
  } catch {}

  try {
    const r = execSync("tailscale status --json 2>/dev/null", { timeout: 3000, encoding: "utf8" })
    const d = JSON.parse(r)
    if (d?.Self?.Online) {
      tailscaleConnected = true
      tailscaleIp = d.Self.TailscaleIPs?.[0] ?? null
    }
  } catch {}

  return {
    openclaw: { running: openclawRunning, pid: openclawPid, memoryUsage: 0 },
    tailscale: { connected: tailscaleConnected, ip: tailscaleIp },
    mode: "local",
    _source: "local",
  }
}

const MOCK_SERVICES = {
  openclaw: { running: false, pid: null, memoryUsage: 0 },
  tailscale: { connected: false, ip: null },
  mode: "mock",
  _source: "mock",
}

export async function GET() {
  const bridgeData = await fetchFromBridge()
  if (bridgeData) {
    return NextResponse.json(bridgeData, { headers: { "Cache-Control": "no-store" } })
  }

  if (IS_VERCEL) {
    return NextResponse.json(MOCK_SERVICES, { headers: { "Cache-Control": "no-store" } })
  }

  return NextResponse.json(getLocalServices(), { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const { action } = await request.json()

  // Forward control actions to bridge
  if (
    BRIDGE_URL &&
    (action === "start_openclaw" || action === "stop_openclaw" || action === "restart_openclaw")
  ) {
    try {
      const res = await fetch(BRIDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        signal: AbortSignal.timeout(5000),
      })
      const data = await res.json()
      return NextResponse.json(data)
    } catch {
      return NextResponse.json({ ok: false, error: "Bridge unreachable" }, { status: 503 })
    }
  }

  // Local fallback for start action
  if (action === "start_openclaw" && !IS_VERCEL) {
    try {
      execSync(
        "launchctl load -w ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null || bash ~/xmad-control/openclaw/scripts/start-ssot.sh &",
        { timeout: 5000 }
      )
      return NextResponse.json({ ok: true, message: "OpenClaw start initiated" })
    } catch {
      return NextResponse.json({ ok: false, error: "Failed to start" }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 })
}
