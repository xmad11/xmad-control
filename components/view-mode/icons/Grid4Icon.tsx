/* ═══════════════════════════════════════════════════════════════════════════════
   GRID 4 ICON - Always shows 4 columns (desktop only)

   Grid-4 is only available on desktop, renders 4 columns.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { GridIconProps } from "./Grid2Icon"

export function Grid4Icon({ className, selected = false, breakpoint: _breakpoint }: GridIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={selected ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="1" y="2" width="5" height="20" rx="1" />
      <rect x="7" y="2" width="5" height="20" rx="1" />
      <rect x="13" y="2" width="5" height="20" rx="1" />
      <rect x="19" y="2" width="5" height="20" rx="1" />
    </svg>
  )
}
