/* ═══════════════════════════════════════════════════════════════════════════════
   🔒 STABLE CONTRACT - DO NOT CHANGE WITHOUT MIGRATION

   This file defines the public API contract for the view-mode system.
   Breaking changes require a migration plan for ALL consumers.

   MIGRATION PROCESS:
   1. Announce deprecation in CHANGELOG.md
   2. Add @deprecated comments to old API
   3. Implement new API alongside old
   4. Migrate all consumers
   5. Remove old API in next major version
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * 🔒 STABLE: View mode identifiers
 *
 * Represents semantic user intent for content layout.
 * Icons represent these modes, not actual responsive behavior.
 *
 * @example
 * // ✅ CORRECT: User selects "grid-3"
 * // Mobile: renders 1 column
 * // Tablet/Desktop: renders 3 columns
 * // Icon: always shows 3 columns (semantic)
 *
 * @see https://react.dev/learn/thinking-in-react
 */
export type ViewModeId = "grid-2" | "grid-3" | "grid-4" | "list"

/**
 * 🔒 STABLE: Breakpoint categories
 *
 * Matches CSS breakpoint tokens:
 * - Mobile: < 768px (--breakpoint-md)
 * - Tablet: 768px - 1023px (--breakpoint-md to --breakpoint-lg)
 * - Desktop: ≥ 1024px (--breakpoint-lg)
 *
 * @see styles/tokens.css
 */
export type Breakpoint = "mobile" | "tablet" | "desktop"

/**
 * 🔒 STABLE: Resolved columns for rendering
 *
 * Return type from resolveViewMode() function.
 * - number: Use grid with this many columns
 * - "list": Use list layout (flex column)
 * - null: Mode not available on this breakpoint (hide it)
 *
 * @example
 * const columns = resolveViewMode("grid-3", "mobile")
 * if (columns === null) return null // Mode hidden
 * if (columns === "list") return <ListView />
 * return <CardGrid columns={columns} /> // number
 */
export type ResolvedColumns = number | "list" | null

/**
 * 🔒 STABLE: Resolve view mode to actual columns
 *
 * This is the ONLY way to get responsive column counts from view modes.
 * Do NOT implement your own mapping. Do NOT duplicate this logic.
 *
 * @param viewMode - Semantic view mode selected by user
 * @param breakpoint - Current breakpoint from useBreakpoint()
 * @returns Resolved columns for rendering
 *
 * @example
 * const breakpoint = useBreakpoint()
 * const columns = resolveViewMode(activeViewMode, breakpoint)
 *
 * // columns will be:
 * // "grid-3" + "mobile" → 1
 * // "grid-3" + "tablet" → 3
 * // "grid-3" + "desktop" → 3
 * // "grid-4" + "mobile" → null (not available)
 */
export declare function resolveViewMode(
  viewMode: ViewModeId,
  breakpoint: Breakpoint
): ResolvedColumns

/**
 * 🔒 STABLE: Breakpoint tracking hook
 *
 * Returns current breakpoint and updates on resize.
 * This is the ONLY way to get breakpoint in components.
 *
 * @returns Current breakpoint
 *
 * @example
 * const breakpoint = useBreakpoint()
 * // "mobile" | "tablet" | "desktop"
 */
export declare function useBreakpoint(): Breakpoint

/**
 * 🔒 STABLE: Card grid layout component
 *
 * Renders a CSS grid with the specified number of columns.
 * This component does NOT know about view modes or breakpoints.
 *
 * @param columns - Number of columns (from resolveViewMode)
 * @param children - Card components to render
 *
 * @example
 * const columns = resolveViewMode(viewMode, breakpoint)
 * if (typeof columns === "number") {
 *   return <CardGrid columns={columns}>{cards}</CardGrid>
 * }
 */
export interface CardGridProps {
  columns: number
  children: React.ReactNode
  className?: string
}

/**
 * 🔒 STABLE: Card variant types
 *
 * Visual variants for card presentation.
 * These are NOT the same as view modes.
 *
 * - image: Hero/marquee cards (160px height)
 * - compact: Dense grid cards (200px height)
 * - detailed: Standard cards (280px height)
 * - list: Horizontal layout (120px height)
 *
 * View modes map to card variants:
 * - grid-2/grid-3/grid-4 → detailed variant
 * - list → list variant
 * - dense → compact variant
 */
export type CardVariant = "image" | "compact" | "detailed" | "list"
