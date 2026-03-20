// app/api/xmad/bridge/ping/route.ts
// Called when dashboard is open - keeps eco mode active
// Updates last_activity timestamp in bridge so idle timeout doesn't trigger

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BRIDGE_URL = process.env.XMAD_BRIDGE_URL

export async function POST() {
  if (!BRIDGE_URL) {
    return NextResponse.json({ ok: false, message: "No bridge configured" })
  }

  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ping" }),
      signal: AbortSignal.timeout(2000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ ok: false, error: "Bridge unreachable" })
  }
}

export async function GET() {
  // Health check - is bridge reachable?
  if (!BRIDGE_URL) {
    return NextResponse.json({ ok: false, bridge: "not_configured" })
  }

  try {
    const res = await fetch(`${BRIDGE_URL}/health`, {
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json({ ok: true, bridge: data })
  } catch {
    return NextResponse.json({ ok: false, bridge: "unreachable" })
  }
}
