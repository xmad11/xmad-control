/* ═══════════════════════════════════════════════════════════════════════════════
   MOBILE DETECTION HOOK - Responsive device detection
   Returns media query matches for mobile, tablet, desktop breakpoints
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useEffect, useState } from "react"

export interface MobileDetection {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
}

/**
 * Mobile detection hook with responsive breakpoints
 * Breakpoints match Tailwind defaults:
 * - Mobile: < 768px (sm)
 * - Tablet: 768px - 1023px (md)
 * - Desktop: 1024px - 1279px (lg)
 * - Large Desktop: >= 1280px (xl)
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useMobile()
 */
export function useMobile(): MobileDetection {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)

  useEffect(() => {
    // Function to check all breakpoints
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024 && width < 1280)
      setIsLargeDesktop(width >= 1280)
    }

    // Check on mount
    checkBreakpoints()

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkBreakpoints, 100)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  }
}

/**
 * Simpler version - just returns boolean for mobile
 * Useful for simple conditional rendering
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

/**
 * Get breakpoint name as string
 * Returns 'mobile' | 'tablet' | 'desktop' | 'large-desktop'
 */
export function useBreakpoint(): "mobile" | "tablet" | "desktop" | "large-desktop" {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useMobile()

  if (isMobile) return "mobile"
  if (isTablet) return "tablet"
  if (isDesktop) return "desktop"
  return "large-desktop"
}
