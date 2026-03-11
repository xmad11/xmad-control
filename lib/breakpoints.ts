/* ═══════════════════════════════════════════════════════════════════════════════
   BREAKPOINT CONSTANTS - JavaScript mirror of CSS tokens
   These values MUST match styles/tokens.css breakpoint definitions
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Breakpoint values in pixels
 * MUST match styles/tokens.css:
 * --breakpoint-md: 48rem (768px)
 * --breakpoint-lg: 64rem (1024px)
 */
export const BREAKPOINTS = {
  /** Mobile: < 768px (default) */
  MOBILE: 0,
  /** Tablet: >= 768px (--breakpoint-md) */
  TABLET: 768,
  /** Desktop: >= 1024px (--breakpoint-lg) */
  DESKTOP: 1024,
} as const

/**
 * Breakpoint value type
 */
export type BreakpointValue = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS]
