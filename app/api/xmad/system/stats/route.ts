// app/api/xmad/system/stats/route.ts
// Real system stats using Node.js os module
// Matches SystemStats type in types/surface.types.ts

import { execSync } from "node:child_process"
import os from "node:os"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const isVercel = process.env.VERCEL === "1"

// Mock data for Vercel (serverless cannot read local system)
const MOCK_STATS = {
  cpu: 45,
  memory: { used: 4200, total: 8192, percentage: 51 },
  disk: { used: 180, total: 500, percentage: 36 },
  uptime: 86400,
}

function getCPUPercent(): number {
  try {
    const result = execSync("top -l 1 -n 0 | grep 'CPU usage'", {
      timeout: 3000,
      encoding: "utf8",
    })
    const match = result.match(/(\d+\.\d+)%\s+user/)
    if (match) return Number.parseFloat(match[1])
  } catch {}
  return 0
}

function getDiskStats() {
  try {
    const result = execSync("df -k / | tail -1", { timeout: 3000, encoding: "utf8" })
    const parts = result.trim().split(/\s+/)
    const totalKB = Number.parseInt(parts[1])
    const usedKB = Number.parseInt(parts[2])
    return {
      used: Number.parseFloat((usedKB / 1024 / 1024).toFixed(1)),
      total: Number.parseFloat((totalKB / 1024 / 1024).toFixed(1)),
      percentage: Math.round((usedKB / totalKB) * 100),
    }
  } catch {
    return { used: 0, total: 0, percentage: 0 }
  }
}

export async function GET() {
  // Return mock on Vercel
  if (isVercel) {
    return NextResponse.json(MOCK_STATS, {
      headers: { "Cache-Control": "no-store" },
    })
  }

  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  const totalMB = Math.round(totalMem / 1024 / 1024)
  const usedMB = Math.round(usedMem / 1024 / 1024)
  const disk = getDiskStats()

  return NextResponse.json(
    {
      cpu: getCPUPercent(),
      memory: {
        used: usedMB,
        total: totalMB,
        percentage: Math.round((usedMem / totalMem) * 100),
      },
      disk,
      uptime: Math.round(os.uptime()),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
