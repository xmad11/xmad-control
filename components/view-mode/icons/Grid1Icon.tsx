/* ═══════════════════════════════════════════════════════════════════════════════
   GRID 1 ICON - Single column grid (mobile only)
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { GridIconProps } from "./Grid2Icon"

export function Grid1Icon({ className, selected = false, breakpoint: _breakpoint }: GridIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={selected ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="1" />
    </svg>
  )
}
