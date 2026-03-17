import { exec } from "node:child_process"
import { promisify } from "node:util"
import { type NextRequest, NextResponse } from "next/server"

const execAsync = promisify(exec)

const EXEC_TIMEOUT = 30000 // 30 seconds

export async function POST(_request: NextRequest, { params }: { params: { serviceId: string } }) {
  const serviceId = params.serviceId

  // Validate service ID
  const validServices = ["openclaw", "api", "dashboard"]
  if (!validServices.includes(serviceId)) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 })
  }

  try {
    // Execute stop command based on service
    let command = ""
    switch (serviceId) {
      case "openclaw":
        command = "pkill -f openclaw"
        break
      case "api":
        command = `cd ${process.env.HOME}/xmad-control && pkill -f "api.*9870"`
        break
      case "dashboard":
        command = `cd ${process.env.HOME}/xmad-control && pkill -f "next.*3333"`
        break
    }

    // Execute command with timeout
    execAsync(command, { timeout: EXEC_TIMEOUT })
      .then(() => {
        console.log(`Service ${serviceId} stopped`)
      })
      .catch((error: Error) => {
        console.error(`Stop failed for ${serviceId}:`, error.message)
      })

    return NextResponse.json({
      success: true,
      message: `Stopping ${serviceId}...`,
      service: serviceId,
    })
  } catch (error) {
    console.error(`Error stopping ${serviceId}:`, error)
    return NextResponse.json(
      {
        error: "Failed to stop service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
