/**
 * XMAD API Proxy Route
 * Proxies requests from Next.js to XMAD API Gateway
 *
 * Route: /api/xmad/* → http://localhost:9870/*
 */

import { type NextRequest, NextResponse } from "next/server"

const XMAD_API_URL = process.env.XMAD_API_URL || "http://localhost:9870"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, "GET")
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const body = await request.text()
  return proxyRequest(request, path, "POST", body)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const body = await request.text()
  return proxyRequest(request, path, "PUT", body)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path, "DELETE")
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string,
  body?: string
) {
  // Build target URL
  const pathString = pathSegments.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const targetUrl = `${XMAD_API_URL}/${pathString}${searchParams ? `?${searchParams}` : ""}`

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Forward authorization header if present
    const authHeader = request.headers.get("Authorization")
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
    })

    const data = await response.text()

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("XMAD API Proxy Error:", error)
    return NextResponse.json({ error: "Failed to connect to XMAD API Gateway" }, { status: 503 })
  }
}
