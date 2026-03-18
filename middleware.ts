/* ═══════════════════════════════════════════════════════════════════════════════
   MIDDLEWARE — Tailscale Network Guard (Hardened)
   Protects dashboard routes from non-Tailscale access in production
   ═══════════════════════════════════════════════════════════════════════════════ */

import { type NextRequest, NextResponse } from "next/server"

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

// Dev bypass: Set TAILSCALE_GUARD_DISABLED=true to bypass in any environment
// Disabled by default for Vercel deployments (Tailscale guard only works on self-hosted)
const GUARD_DISABLED = process.env.TAILSCALE_GUARD_DISABLED === "true" || process.env.VERCEL === "1"

// Logging throttle: Only log same IP once per minute
const LOG_THROTTLE_MS = 60_000
const blockedIPs = new Map<string, number>()

// ═══════════════════════════════════════════════════════════════════════════════
// TAILSCALE IP VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if an IP address is from Tailscale network or localhost
 * Tailscale uses CGNAT range: 100.64.0.0/10 (100.64.0.0 - 100.127.255.255)
 */
function isTailscaleOrLocal(ip: string): boolean {
  if (!ip) return false

  // Localhost variants
  if (["127.0.0.1", "::1", "localhost"].includes(ip)) return true
  if (ip.startsWith("::ffff:127.")) return true

  // Parse IPv4
  const parts = ip.split(".").map(Number)
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false

  // Tailscale CGNAT range: 100.64.0.0/10
  // First octet must be 100, second must be 64-127
  return parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127
}

/**
 * Extract client IP from request headers
 */
function getClientIP(req: NextRequest): string {
  // Check X-Forwarded-For (first IP in chain)
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  // Check X-Real-IP
  const realIP = req.headers.get("x-real-ip")
  if (realIP) {
    return realIP.trim()
  }

  // Fallback to empty (will be rejected in production)
  return ""
}

/**
 * Throttled logging to prevent log spam from same IP
 */
function logBlockedIP(ip: string): void {
  const now = Date.now()
  const lastLogged = blockedIPs.get(ip)

  // Only log if not recently logged or map is getting too large
  if (!lastLogged || now - lastLogged > LOG_THROTTLE_MS) {
    console.warn(`[SECURITY] Blocked non-Tailscale access from: ${ip}`)
    blockedIPs.set(ip, now)

    // Cleanup old entries if map gets too large (prevent memory leak)
    if (blockedIPs.size > 1000) {
      const cutoff = now - LOG_THROTTLE_MS * 2
      for (const [key, timestamp] of blockedIPs) {
        if (timestamp < cutoff) {
          blockedIPs.delete(key)
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export function middleware(req: NextRequest) {
  // Dev bypass: Allow bypassing guard via environment variable
  if (GUARD_DISABLED) {
    return NextResponse.next()
  }

  // Skip in development mode (unless guard is explicitly enabled)
  if (process.env.NODE_ENV !== "production" && process.env.TAILSCALE_GUARD_ENABLED !== "true") {
    return NextResponse.next()
  }

  // Get client IP
  const clientIP = getClientIP(req)

  // Check if request is from Tailscale or localhost
  if (!isTailscaleOrLocal(clientIP)) {
    // Throttled logging
    logBlockedIP(clientIP)

    // Return 403 Forbidden
    return new NextResponse(
      JSON.stringify({
        error: "Access restricted to Tailscale network",
        hint: "Connect via Tailscale VPN to access this dashboard",
        code: "TAILSCALE_REQUIRED",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  // Allow request to proceed
  return NextResponse.next()
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE MATCHER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser icon)
     * - public folder files
     * - api routes (handled separately with their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
