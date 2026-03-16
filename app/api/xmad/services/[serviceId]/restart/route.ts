import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  const serviceId = params.serviceId

  // Validate service ID
  const validServices = ["openclaw", "api", "dashboard"]
  if (!validServices.includes(serviceId)) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 })
  }

  try {
    // Execute restart command based on service
    let command = ""
    switch (serviceId) {
      case "openclaw":
        command = `cd ${process.env.HOME}/xmad-control && pkill -f openclaw && sleep 2 && bash openclaw/scripts/start-ssot.sh`
        break
      case "api":
        command = `cd ${process.env.HOME}/xmad-control && bash scripts/restart-api.sh`
        break
      case "dashboard":
        command = `cd ${process.env.HOME}/xmad-control && bash scripts/restart-dashboard.sh`
        break
    }

    // Execute command (in production, use proper process management)
    const { exec } = require("child_process")
    exec(command, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Restart failed for ${serviceId}:`, error)
      }
    })

    return NextResponse.json({
      success: true,
      message: `Restarting ${serviceId}...`,
      service: serviceId,
    })
  } catch (error) {
    console.error(`Error restarting ${serviceId}:`, error)
    return NextResponse.json(
      { error: "Failed to restart service", details: String(error) },
      { status: 500 }
    )
  }
}
