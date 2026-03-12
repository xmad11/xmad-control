/* ═══════════════════════════════════════════════════════════════════════════════
   CARD GRID - Pure layout consumer

   Receives resolved column number and renders a responsive grid.
   No breakpoint logic. No view mode logic. Just layout.

   Uses CSS Grid with dynamic columns based on resolved number.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react"

export interface CardGridProps {
  columns: number
  children: ReactNode
  className?: string
}

/**
 * CardGrid - Pure layout component
 * Renders a CSS grid with the specified number of columns
 *
 * This component does NOT know about:
 * - View modes
 * - Breakpoints
 * - Responsive logic
 *
 * It only knows: "render N columns"
 */
export function CardGrid({ columns, children, className = "" }: CardGridProps) {
  // Map column count to grid class
  const gridColsClass: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }

  // 1-2 column grids on mobile get more vertical space
  const mobileVerticalGap =
    columns === 1 || columns === 2 ? "gap-y-[var(--spacing-lg)]" : "gap-y-[var(--spacing-sm)]"

  return (
    <div
      className={`grid ${gridColsClass[columns] || "grid-cols-4"} grid-flow-row gap-x-[var(--spacing-sm)] ${mobileVerticalGap} md:gap-x-[var(--spacing-lg)] md:gap-y-[var(--spacing-lg)] lg:gap-x-[var(--spacing-xl)] lg:gap-y-[var(--spacing-xl)] items-start auto-rows-min ${className}`}
    >
      {children}
    </div>
  )
}
