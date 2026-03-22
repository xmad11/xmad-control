// app/api/xmad/system/processes/route.ts
// Returns top processes by memory and CPU usage
// Fetches from bridge or local ps command

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BRIDGE_URL = process.env.XMAD_BRIDGE_URL
const IS_VERCEL = process.env.VERCEL === "1"

interface ProcessInfo {
  name: string
  pid: number
  usage: number
  details?: string
}

async function fetchFromBridge() {
  if (!BRIDGE_URL) return null
  try {
    const res = await fetch(`${BRIDGE_URL}/processes`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    })
    if (res.ok) return res.json()
  } catch {}
  return null
}

function getLocalProcesses() {
  const memoryProcesses: ProcessInfo[] = []
  const cpuProcesses: ProcessInfo[] = []

  try {
    // Get top 5 memory consuming processes
    const memResult = execSync(
      "ps aux -m | head -6 | tail -5 | awk '{print $2, $3, $4, $6, $11}'",
      { timeout: 3000, encoding: "utf8" }
    )

    memResult
      .trim()
      .split("\n")
      .forEach((line) => {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 5) {
          const pid = Number.parseInt(parts[0])
          const _cpuPct = Number.parseFloat(parts[1])
          const memPct = Number.parseFloat(parts[2])
          const memKB = Number.parseInt(parts[3])
          const memMB = Math.round(memKB / 1024)
          const name = parts[4].split("/").pop() || parts[4]

          // Skip kernel processes
          if (name.startsWith("(") || name.startsWith("kernel")) return

          memoryProcesses.push({
            name,
            pid,
            usage: memMB,
            details: `${memPct.toFixed(1)}% of RAM`,
          })
        }
      })
  } catch {}

  try {
    // Get top 5 CPU consuming processes
    const cpuResult = execSync("ps aux -r | head -6 | tail -5 | awk '{print $2, $3, $4, $11}'", {
      timeout: 3000,
      encoding: "utf8",
    })

    cpuResult
      .trim()
      .split("\n")
      .forEach((line) => {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 4) {
          const pid = Number.parseInt(parts[0])
          const cpuPct = Number.parseFloat(parts[1])
          const memPct = Number.parseFloat(parts[2])
          const name = parts[3].split("/").pop() || parts[3]

          // Skip kernel processes
          if (name.startsWith("(") || name.startsWith("kernel")) return

          cpuProcesses.push({
            name,
            pid,
            usage: cpuPct,
            details: `${memPct.toFixed(1)}% RAM`,
          })
        }
      })
  } catch {}

  return { memory: memoryProcesses.slice(0, 5), cpu: cpuProcesses.slice(0, 5) }
}

const MOCK_PROCESSES = {
  memory: [
    { name: "claude", pid: 1234, usage: 344, details: "4.2% of RAM" },
    { name: "node", pid: 2345, usage: 156, details: "1.9% of RAM" },
    { name: "Electron", pid: 3456, usage: 128, details: "1.6% of RAM" },
    { name: "com.apple.Safari", pid: 4567, usage: 98, details: "1.2% of RAM" },
    { name: "WindowServer", pid: 5678, usage: 87, details: "1.1% of RAM" },
  ] as ProcessInfo[],
  cpu: [
    { name: "claude", pid: 1234, usage: 12.5, details: "4.2% RAM" },
    { name: "node", pid: 2345, usage: 8.3, details: "1.9% RAM" },
    { name: "Finder", pid: 6789, usage: 4.2, details: "0.5% RAM" },
    { name: "Terminal", pid: 7890, usage: 2.1, details: "0.3% RAM" },
    { name: "SystemUIServer", pid: 8901, usage: 1.8, details: "0.2% RAM" },
  ] as ProcessInfo[],
}

export async function GET() {
  // Try bridge first for real process data
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}/processes`, {
        signal: AbortSignal.timeout(3000),
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
      }
    } catch {}
  }

  const bridgeData = await fetchFromBridge()
  if (bridgeData) {
    return NextResponse.json(
      { ...bridgeData, _source: "bridge" },
      {
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  if (IS_VERCEL) {
    return NextResponse.json(
      { ...MOCK_PROCESSES, _source: "mock" },
      {
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  return NextResponse.json(
    { ...getLocalProcesses(), _source: "local" },
    {
      headers: { "Cache-Control": "no-store" },
    }
  )
}

export async function POST(request: Request) {
  const BRIDGE_URL = process.env.XMAD_BRIDGE_URL
  if (!BRIDGE_URL) {
    return NextResponse.json({ ok: false, error: "Bridge not configured" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "kill_process", ...body }),
      signal: AbortSignal.timeout(5000),
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
