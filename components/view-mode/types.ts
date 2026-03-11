/* ═══════════════════════════════════════════════════════════════════════════════
   VIEW MODE TYPES - Semantic type definitions

   View modes represent user intent, not responsive behavior.
   Responsive behavior is defined separately in viewModeColumns.ts
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Breakpoint } from "@/types/breakpoint"

/**
 * Semantic view mode identifiers
 * Order is fixed: grid-2 → grid-3 → grid-4 → list
 */
export type ViewModeId = "grid-2" | "grid-3" | "grid-4" | "list"

/**
 * Resolved columns for a view mode at a specific breakpoint
 * - number: use grid with this many columns
 * - "list": use list layout
 * - null: mode not available on this breakpoint
 */
export type ResolvedColumns = number | "list" | null

/**
 * View mode option with responsive icon
 * Icons show current state for toggle button pattern
 */
export interface ViewModeOption {
  id: ViewModeId
  label: string
  icon: React.ComponentType<{ className?: string; selected?: boolean; breakpoint?: Breakpoint }>
}

/**
 * Responsive columns mapping per breakpoint
 * This is the single source of truth for responsive behavior
 */
export type ViewModeColumnsMapping = Record<Breakpoint, Record<ViewModeId, ResolvedColumns>>
