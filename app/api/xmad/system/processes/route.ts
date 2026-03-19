// app/api/xmad/system/processes/route.ts
// Returns top processes by CPU usage
// Matches ProcessInfo type in types/surface.types.ts

import { execSync } from "node:child_process"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const isVercel = process.env.VERCEL === "1"

// Mock data for Vercel
const MOCK_PROCESSES = [
  { pid: 1234, name: "node", cpu: 15.2, memory: 245, command: "node server.js" },
  { pid: 2345, name: "bun", cpu: 8.5, memory: 189, command: "bun run dev" },
  { pid: 3456, name: "next-server", cpu: 5.1, memory: 156, command: "next start" },
]

export async function GET() {
  if (isVercel) {
    return NextResponse.json(
      { processes: MOCK_PROCESSES },
      {
        headers: { "Cache-Control": "no-store" },
      }
    )
  }

  try {
    // macOS compatible: sort by CPU, get top 20
    const result = execSync("ps aux | sort -k3 -rn | head -20", {
      timeout: 3000,
      encoding: "utf8",
    })

    const processes = result
      .trim()
      .split("\n")
      .slice(1) // Skip header
      .map((line) => {
        const parts = line.trim().split(/\s+/)
        const pid = Number.parseInt(parts[1])
        const cpu = Number.parseFloat(parts[2])
        const memKB = Number.parseInt(parts[5])
        const command = parts.slice(10).join(" ")

        // Extract name from command
        let name = parts[10] ?? "unknown"
        if (name.startsWith("/")) {
          name = name.split("/").pop() ?? name
        }

        return {
          pid,
          name,
          cpu,
          memory: Math.round(memKB / 1024), // Convert KB to MB
          command: command.slice(0, 100),
        }
      })
      .filter((p) => p.pid && !Number.isNaN(p.pid))

    return NextResponse.json({ processes }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ processes: [] })
  }
}
