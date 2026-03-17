import { exec } from "node:child_process"
import { promisify } from "node:util"
import { type NextRequest, NextResponse } from "next/server"

const execAsync = promisify(exec)

const EXEC_TIMEOUT = 60000 // 60 seconds

export async function POST(
  _request: NextRequest,
  { params }: { params: { automationId: string } }
) {
  const automationId = params.automationId

  // Validate automation ID
  const validAutomations = [
    "backup",
    "cleanup",
    "health-check",
    "sync-memory",
    "download-backup",
    "snapshot",
  ]

  if (!validAutomations.includes(automationId)) {
    return NextResponse.json({ error: "Invalid automation" }, { status: 400 })
  }

  try {
    // Map automation to command
    const automationCommands: Record<string, string> = {
      backup: `cd ${process.env.HOME}/xmad-control && bash scripts/backup.sh`,
      cleanup: `cd ${process.env.HOME}/xmad-control && bash scripts/cleanup.sh`,
      "health-check": `cd ${process.env.HOME}/xmad-control && bash bootstrap/health-platform.sh`,
      "sync-memory": `cd ${process.env.HOME}/xmad-control/openclaw && bash scripts/sync-memory.sh`,
      "download-backup": `cd ${process.env.HOME}/xmad-control && bash scripts/download-backup.sh`,
      snapshot: `cd ${process.env.HOME}/xmad-control && bash scripts/snapshot.sh`,
    }

    const command = automationCommands[automationId]

    if (!command) {
      return NextResponse.json({ error: "Automation command not found" }, { status: 404 })
    }

    // Execute command with timeout (fire and forget, but with proper error handling)
    execAsync(command, { timeout: EXEC_TIMEOUT })
      .then(({ stdout }) => {
        console.log(`Automation ${automationId} completed:`, stdout.slice(0, 500))
      })
      .catch((error: Error) => {
        console.error(`Automation ${automationId} failed:`, error.message)
      })

    return NextResponse.json({
      success: true,
      message: `Running automation: ${automationId}...`,
      automation: automationId,
    })
  } catch (error) {
    console.error(`Error running automation ${automationId}:`, error)
    return NextResponse.json(
      {
        error: "Failed to run automation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
