// app/api/xmad/tenants/route.ts
// Proxies tenant management to platform-monorepo via shared API key

import { platformApi } from "@/lib/platform-api"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - List all tenants
export async function GET() {
  try {
    const data = await platformApi.listTenants()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: "Could not reach platform API", details: message, tenants: [] },
      { status: 503 }
    )
  }
}

// POST - Create new tenant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, ownerId } = body

    if (!name || !slug || !ownerId) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, ownerId" },
        { status: 400 }
      )
    }

    const data = await platformApi.createTenant({ name, slug, ownerId })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
