import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
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
      return NextResponse.json(
        { error: "Automation command not found" },
        { status: 404 }
      )
    }

    // Execute command asynchronously
    const { exec } = require("child_process")
    exec(command, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Automation ${automationId} failed:`, error)
      } else {
        console.log(`Automation ${automationId} completed:`, stdout)
      }
    })

    return NextResponse.json({
      success: true,
      message: `Running automation: ${automationId}...`,
      automation: automationId,
    })
  } catch (error) {
    console.error(`Error running automation ${automationId}:`, error)
    return NextResponse.json(
      { error: "Failed to run automation", details: String(error) },
      { status: 500 }
    )
  }
}
