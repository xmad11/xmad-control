/* ═══════════════════════════════════════════════════════════════════════════════
   GRID 3 ICON - Responsive for toggle button

   For toggle buttons, icons show CURRENT STATE:
   - Mobile: 1 column (what's actually rendered)
   - Tablet/Desktop: 3 columns (what's actually rendered)
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Breakpoint } from "@/types/breakpoint"
import type { GridIconProps } from "./Grid2Icon"

export interface GridIconPropsResponsive extends GridIconProps {
  breakpoint?: Breakpoint
}

export function Grid3Icon({
  className,
  selected = false,
  breakpoint = "desktop",
}: GridIconPropsResponsive) {
  const isMobile = breakpoint === "mobile"

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={selected ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {isMobile ? (
        <rect x="4" y="2" width="16" height="20" rx="1" />
      ) : (
        <>
          <rect x="1" y="2" width="6.5" height="20" rx="1" />
          <rect x="8.75" y="2" width="6.5" height="20" rx="1" />
          <rect x="16.5" y="2" width="6.5" height="20" rx="1" />
        </>
      )}
    </svg>
  )
}
