/* ═══════════════════════════════════════════════════════════════════════════════
   RESOLVE VIEW MODE - Safe adapter for column resolution

   Usage:
     const columns = resolveViewMode("grid-3", "mobile") // returns 1
     const columns = resolveViewMode("grid-4", "mobile") // returns null (not available)

   If columns === null, the mode is not available on this breakpoint.
   If columns === "list", use list layout.
   Otherwise, columns is a number for grid layout.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Breakpoint } from "@/hooks/useBreakpoint"
import type { ResolvedColumns, ViewModeId } from "./types"
import { VIEW_MODE_COLUMNS } from "./viewModeColumns"

/**
 * Resolve a view mode to its column count for a specific breakpoint
 * Returns number, "list", or null (if not available)
 *
 * If breakpoint is null (SSR), returns 1 column as safe default
 */
export function resolveViewMode(
  viewMode: ViewModeId,
  breakpoint: Breakpoint | null
): ResolvedColumns {
  // During SSR or before hydration, default to 1 column to prevent mismatch
  if (breakpoint === null) {
    return 1
  }
  return VIEW_MODE_COLUMNS[breakpoint][viewMode]
}
