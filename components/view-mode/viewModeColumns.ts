/* ═══════════════════════════════════════════════════════════════════════════════
   VIEW MODE COLUMNS - Responsive behavior mapping

   This is the ONLY place where responsive behavior is defined.
   No breakpoint logic in components. No hardcoded Tailwind classes.

   Breakpoint mapping:
   - Mobile (< 768px): grid-2→2cols, grid-3→1col, grid-4→hidden
   - Tablet (768-1023px): grid-2→2cols, grid-3→3cols, grid-4→hidden
   - Desktop (≥1024px): grid-2→2cols, grid-3→3cols, grid-4→4cols

   null = mode is not available on this breakpoint
   "list" = list layout (not a number)
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Breakpoint } from "@/hooks/useBreakpoint"
import type { ResolvedColumns, ViewModeColumnsMapping, ViewModeId } from "./types"

/**
 * Single source of truth for responsive view mode behavior
 * Maps view modes to actual column counts per breakpoint
 */
export const VIEW_MODE_COLUMNS: ViewModeColumnsMapping = {
  mobile: {
    "grid-2": 2,
    "grid-3": 1,
    "grid-4": null, // hidden on mobile
    list: "list",
  },
  tablet: {
    "grid-2": 2,
    "grid-3": 3,
    "grid-4": null, // hidden on tablet
    list: "list",
  },
  desktop: {
    "grid-2": 2,
    "grid-3": 3,
    "grid-4": 4,
    list: "list",
  },
}

/**
 * Get available view modes for a specific breakpoint
 * Filters out modes that are hidden (null) on that breakpoint
 *
 * If breakpoint is null (SSR), returns mobile modes as safe default
 */
export function getAvailableViewModes(breakpoint: Breakpoint | null): ViewModeId[] {
  // During SSR or before hydration, default to mobile view modes
  const bp = breakpoint || "mobile"
  return Object.entries(VIEW_MODE_COLUMNS[bp])
    .filter(([_, columns]) => columns !== null)
    .map(([modeId]) => modeId as ViewModeId)
}
