/**
 * System Stats API Route
 * Returns real-time system statistics: CPU, memory, disk, uptime, load average
 */

import { execSync } from "node:child_process"
import os from "node:os"
import { NextResponse } from "next/server"

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
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
