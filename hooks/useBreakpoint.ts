/* ═══════════════════════════════════════════════════════════════════════════════
   USE BREAKPOINT HOOK - Track viewport breakpoint

   Uses CSS breakpoint tokens from styles/tokens.css:
   - Mobile: < 768px (--breakpoint-md)
   - Tablet: 768px - 1023px (--breakpoint-md to --breakpoint-lg)
   - Desktop: ≥ 1024px (--breakpoint-lg)
   ═══════════════════════════════════════════════════════════════════════════════ */

import { BREAKPOINTS } from "@/lib/breakpoints"
import type { Breakpoint } from "@/types/breakpoint"
import { useEffect, useState } from "react"

export type { Breakpoint }

/**
 * Get the current breakpoint based on window width
 * Reads from BREAKPOINTS constants (SSOT for breakpoint values)
 */
export function getBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "mobile"
  if (window.innerWidth >= BREAKPOINTS.DESKTOP) return "desktop"
  if (window.innerWidth >= BREAKPOINTS.TABLET) return "tablet"
  return "mobile"
}

/**
 * Hook to track viewport breakpoint changes
 * Updates on window resize
 *
 * Returns null until after hydration to prevent SSR mismatch
 */
export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setBreakpoint(getBreakpoint())

    const handleResize = () => {
      setBreakpoint(getBreakpoint())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Return null during SSR to prevent hydration mismatch
  if (!isMounted) return null
  return breakpoint
}
