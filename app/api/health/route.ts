// app/api/health/route.ts
// Dashboard health check endpoint for service monitoring

import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "xmad-dashboard",
    timestamp: Date.now(),
    version: process.env.npm_package_version || "1.0.0",
  })
}
