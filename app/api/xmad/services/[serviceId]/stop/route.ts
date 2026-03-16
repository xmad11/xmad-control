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
    // Execute stop command based on service
    let command = ""
    switch (serviceId) {
      case "openclaw":
        command = `pkill -f openclaw`
        break
      case "api":
        command = `cd ${process.env.HOME}/xmad-control && pkill -f "api.*9870"`
        break
      case "dashboard":
        command = `cd ${process.env.HOME}/xmad-control && pkill -f "next.*3333"`
        break
    }

    // Execute command
    const { exec } = require("child_process")
    exec(command, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Stop failed for ${serviceId}:`, error)
      }
    })

    return NextResponse.json({
      success: true,
      message: `Stopping ${serviceId}...`,
      service: serviceId,
    })
  } catch (error) {
    console.error(`Error stopping ${serviceId}:`, error)
    return NextResponse.json(
      { error: "Failed to stop service", details: String(error) },
      { status: 500 }
    )
  }
}
