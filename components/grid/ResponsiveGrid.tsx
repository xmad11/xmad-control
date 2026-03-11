/* ═══════════════════════════════════════════════════════════════════════════════
   RESPONSIVE GRID - Enforces 2-column mobile layout (NON-NEGOTIABLE)
   Mobile: 2-column | Tablet: 3-column | Desktop: 4-column
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export type ResponsiveGridVariant = "default" | "tight" | "wide"

export interface ResponsiveGridProps {
  children: React.ReactNode
  variant?: ResponsiveGridVariant
  className?: string
}

const gapClasses = {
  default: "gap-[var(--spacing-md)] sm:gap-[var(--spacing-lg)] lg:gap-[var(--spacing-xl)]",
  tight: "gap-[var(--spacing-sm)] sm:gap-[var(--spacing-md)] lg:gap-[var(--spacing-lg)]",
  wide: "gap-[var(--spacing-lg)] sm:gap-[var(--spacing-xl)] lg:gap-[var(--spacing-2xl)]",
}

/**
 * ResponsiveGrid - ENFORCED 2-COLUMN MOBILE LAYOUT
 *
 * BREAKPOINTS (LOCKED):
 * - Mobile (default): grid-cols-2 (NEVER 1 column)
 * - Tablet (sm: 640px): grid-cols-3
 * - Desktop (lg: 1024px): grid-cols-4
 *
 * USAGE:
 * <ResponsiveGrid>
 *   <Card />
 *   <Card />
 * </ResponsiveGrid>
 *
 * @see https://www.nngroup.com/articles/mobile-ui-patterns/
 */
export const ResponsiveGrid = memo(function ResponsiveGrid({
  children,
  variant = "default",
  className = "",
}: ResponsiveGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${gapClasses[variant]} ${className}`}
    >
      {children}
    </div>
  )
})
