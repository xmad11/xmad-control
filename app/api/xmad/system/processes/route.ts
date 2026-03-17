/**
 * System Processes API Route
 * Returns top 10 processes by memory usage
 * Falls back to mock data on Vercel (serverless)
 */

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

// Check if running on Vercel (production)
const isVercel = process.env.VERCEL === "1"

// Mock data for Vercel environment
const MOCK_PROCESSES = [
  { pid: 1234, name: "node", cpu: 15.2, memory: 245, command: "node server.js" },
  { pid: 2345, name: "bun", cpu: 8.5, memory: 189, command: "bun run dev" },
  { pid: 3456, name: "next-server", cpu: 5.1, memory: 156, command: "next start" },
  { pid: 4567, name: "react", cpu: 2.3, memory: 98, command: "react render" },
  { pid: 5678, name: "api-handler", cpu: 1.8, memory: 82, command: "api route" },
]

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
  // Return mock data on Vercel (serverless), real data locally
  const processes = isVercel ? MOCK_PROCESSES : getTopProcesses()

  return NextResponse.json(
    { processes },
    {
      headers: {
        "Cache-Control": "no-store, max-age=1",
      },
    }
  )
}
