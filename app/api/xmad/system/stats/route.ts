// app/api/xmad/system/stats/route.ts
// Fetches real data from local bridge via Tailscale when available
// Falls back to local stats or mock on Vercel if bridge unreachable

import { execSync } from "node:child_process"
import os from "node:os"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BRIDGE_URL = process.env.XMAD_BRIDGE_URL // http://100.121.254.21:4567
const IS_VERCEL = process.env.VERCEL === "1"

async function fetchFromBridge() {
  if (!BRIDGE_URL) return null
  try {
    const res = await fetch(`${BRIDGE_URL}/status`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    })
    if (res.ok) return res.json()
  } catch {}
  return null
}

function getLocalStats() {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  let cpu = 0
  let diskPct = 0

  try {
    const r = execSync("top -l 1 -n 0 | grep 'CPU usage'", { timeout: 3000, encoding: "utf8" })
    const m = r.match(/(\d+\.\d+)%\s+user/)
    if (m) cpu = Number.parseFloat(m[1])
  } catch {}

  try {
    const r = execSync("df -k / | tail -1", { timeout: 2000, encoding: "utf8" })
    const p = r.trim().split(/\s+/)
    diskPct = Math.round((Number.parseInt(p[2]) / Number.parseInt(p[1])) * 100)
  } catch {}

  return {
    cpu,
    memory: {
      used: Math.round(usedMem / 1024 / 1024),
      total: Math.round(totalMem / 1024 / 1024),
      percentage: Math.round((usedMem / totalMem) * 100),
    },
    disk: { percentage: diskPct },
    uptime: Math.round(os.uptime()),
    _source: "local",
  }
}

const MOCK_STATS = {
  cpu: 45,
  memory: { used: 4200, total: 8192, percentage: 51 },
  disk: { used: 180, total: 500, percentage: 36 },
  uptime: 86400,
  _source: "mock",
}

export async function GET() {
  // Try bridge first (works from Vercel via Tailscale)
  const bridgeData = await fetchFromBridge()
  if (bridgeData) {
    return NextResponse.json(
      { ...bridgeData, _source: "bridge" },
      {
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  // On Vercel without bridge, return mock
  if (IS_VERCEL) {
    return NextResponse.json(MOCK_STATS, {
      headers: { "Cache-Control": "no-store" },
    })
  }

  // Local fallback
  return NextResponse.json(getLocalStats(), {
    headers: { "Cache-Control": "no-store" },
  })
}
