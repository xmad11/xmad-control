/**
 * System Processes API Route
 * Returns top 10 processes by memory usage
 */

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number // MB
  command: string
}

interface ProcessesResponse {
  processes: ProcessInfo[]
}

// Processes to skip (temporary spikes, build tools, etc.)
const SKIP_PATTERNS = ["grep", "ps aux", "node /", "next build", "tsc --"]

function getTopProcesses(): ProcessInfo[] {
  try {
    // Run ps aux sorted by memory usage
    const output = execSync("ps aux --sort=-%mem 2>/dev/null | head -20", {
      encoding: "utf-8",
    }).trim()
    const lines = output.split("\n").slice(1) // Skip header

    const processes: ProcessInfo[] = []

    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 11) continue

      const pid = Number.parseInt(parts[1], 10)
      const cpu = Number.parseFloat(parts[2])
      const rss = Number.parseInt(parts[5], 10) // RSS in KB
      const command = parts.slice(10).join(" ")

      // Extract process name from command
      let name = parts[10]
      if (name.startsWith("/")) {
        name = name.split("/").pop() ?? name
      }

      // Skip processes matching skip patterns
      if (SKIP_PATTERNS.some((pattern) => command.toLowerCase().includes(pattern.toLowerCase()))) {
        continue
      }

      processes.push({
        pid,
        name,
        cpu: Number(cpu.toFixed(1)),
        memory: Number((rss / 1024).toFixed(1)), // Convert KB to MB
        command: command.slice(0, 100), // Truncate long commands
      })
    }

    return processes.slice(0, 10)
  } catch {
    return []
  }
}

export async function GET(): Promise<NextResponse<ProcessesResponse>> {
  const processes = getTopProcesses()

  return NextResponse.json(
    { processes },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
