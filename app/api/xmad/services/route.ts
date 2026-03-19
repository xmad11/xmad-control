// app/api/xmad/services/route.ts
// Service status — matches ServiceStatus type in surface.types.ts exactly:
// { openclaw: { running, pid, memoryUsage }, tailscale: { connected, ip } }

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function checkPort(port: number): { alive: boolean; pid?: number } {
  try {
    const result = execSync(`lsof -i :${port} -sTCP:LISTEN -n -P 2>/dev/null | tail -1`, {
      timeout: 2000,
      encoding: "utf8",
    })
    if (result.trim()) {
      const pid = Number.parseInt(result.trim().split(/\s+/)[1])
      return { alive: true, pid: Number.isNaN(pid) ? undefined : pid }
    }
    return { alive: false }
  } catch {
    return { alive: false }
  }
}

function getProcessMemoryMB(pid: number): number {
  try {
    const result = execSync(`ps -p ${pid} -o rss= 2>/dev/null`, {
      timeout: 1000,
      encoding: "utf8",
    })
    const kb = Number.parseInt(result.trim())
    return Number.isNaN(kb) ? 0 : Math.round(kb / 1024)
  } catch {
    return 0
  }
}

async function checkOpenClaw() {
  try {
    const res = await fetch("http://127.0.0.1:18789/health", {
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const port = checkPort(18789)
      const memoryUsage = port.pid ? getProcessMemoryMB(port.pid) : 0
      return {
        running: true,
        pid: port.pid ?? null,
        memoryUsage,
        port: 18789,
      }
    }
  } catch {}
  return { running: false, pid: null, memoryUsage: 0, port: 18789 }
}

function getTailscale() {
  try {
    const result = execSync("tailscale status --json 2>/dev/null", {
      timeout: 3000,
      encoding: "utf8",
    })
    const data = JSON.parse(result)
    const self = data?.Self
    if (self?.Online) {
      return {
        connected: true,
        ip: self.TailscaleIPs?.[0] ?? null,
        hostname: self.HostName ?? null,
        peers: Object.keys(data?.Peer || {}).length,
      }
    }
  } catch {}
  return { connected: false, ip: null, hostname: null, peers: 0 }
}

export async function GET() {
  const [openclaw, tailscale] = await Promise.all([
    checkOpenClaw(),
    Promise.resolve(getTailscale()),
  ])

  // Shape matches ServiceStatus type in surface.types.ts exactly
  return NextResponse.json(
    {
      openclaw,
      tailscale,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(request: Request) {
  const { service, action } = await request.json()

  if (service === "openclaw" && action === "start") {
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
