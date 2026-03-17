/**
 * System Stats API Route
 * Returns real-time system statistics: CPU, memory, disk, uptime, load average
 * Falls back to mock data on Vercel (serverless)
 */

import { execSync } from "node:child_process"
import os from "node:os"
import { NextResponse } from "next/server"

// Check if running on Vercel (production)
const isVercel = process.env.VERCEL === "1"

// Mock data for Vercel environment
const MOCK_STATS = {
  cpu: 45,
  memory: { used: 4.2, free: 3.8, total: 8, percentage: 52 },
  disk: { used: 180, free: 320, total: 500, percentage: 36 },
  uptime: 86400,
  loadAvg: [1.5, 1.2, 1.0],
}

interface SystemStats {
  cpu: number
  memory: {
    used: number
    free: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    free: number
    total: number
    percentage: number
  }
  uptime: number
  loadAvg: number[]
}

function getDiskUsage(): { used: number; free: number; total: number; percentage: number } {
  try {
    // Run df -k / to get disk usage in KB
    const output = execSync("df -k / 2>/dev/null | tail -1", { encoding: "utf-8" }).trim()
    const parts = output.split(/\s+/)

    // df output: Filesystem, 1K-blocks, Used, Available, Capacity%, Mounted on
    const totalKB = Number.parseInt(parts[1], 10)
    const usedKB = Number.parseInt(parts[2], 10)
    const freeKB = Number.parseInt(parts[3], 10)

    // Convert to GB
    const kbToGb = 1024 * 1024
    return {
      used: Number((usedKB / kbToGb).toFixed(2)),
      free: Number((freeKB / kbToGb).toFixed(2)),
      total: Number((totalKB / kbToGb).toFixed(2)),
      percentage: Number(((usedKB / totalKB) * 100).toFixed(1)),
    }
  } catch {
    return { used: 0, free: 0, total: 0, percentage: 0 }
  }
}

function getCpuUsage(): number {
  const cpus = os.cpus()
  let totalIdle = 0
  let totalTick = 0

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times]
    }
    totalIdle += cpu.times.idle
  }

  const totalUsage = totalTick - totalIdle
  return Number(((totalUsage / totalTick) * 100).toFixed(1))
}

export async function GET(): Promise<NextResponse<SystemStats>> {
  // Return mock data on Vercel, real data locally
  if (isVercel) {
    return NextResponse.json(MOCK_STATS, {
      headers: {
        "Cache-Control": "no-store, max-age=1",
      },
    })
  }

  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory

  const stats: SystemStats = {
    cpu: getCpuUsage(),
    memory: {
      used: Number((usedMemory / (1024 * 1024 * 1024)).toFixed(2)), // GB
      free: Number((freeMemory / (1024 * 1024 * 1024)).toFixed(2)), // GB
      total: 8, // This machine always has 8GB
      percentage: Number(((usedMemory / totalMemory) * 100).toFixed(1)),
    },
    disk: getDiskUsage(),
    uptime: Math.floor(os.uptime()),
    loadAvg: os.loadavg().map((v) => Number(v.toFixed(2))),
  }

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store, max-age=1",
    },
  })
}
// redeploy trigger
// redeploy trigger 1773780363
