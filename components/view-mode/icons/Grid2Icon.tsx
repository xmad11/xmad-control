/* ═══════════════════════════════════════════════════════════════════════════════
   GRID 2 ICON - Always shows 2 columns (consistent across all breakpoints)

   Grid-2 renders 2 columns on all breakpoints.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Breakpoint } from "@/types/breakpoint"

export interface GridIconProps {
  className?: string
  selected?: boolean
  breakpoint?: Breakpoint
}

export function Grid2Icon({ className, selected = false, breakpoint: _breakpoint }: GridIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={selected ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="9" height="20" rx="1" />
      <rect x="13" y="2" width="9" height="20" rx="1" />
    </svg>
  )
}
