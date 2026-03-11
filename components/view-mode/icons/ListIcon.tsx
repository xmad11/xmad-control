/* ═══════════════════════════════════════════════════════════════════════════════
   LIST ICON - Always shows list (consistent across all breakpoints)

   List view renders the same on all breakpoints.
   ═══════════════════════════════════════════════════════════════════════════════ */

import { ListBulletIcon } from "@/components/icons"
import type { GridIconProps } from "./Grid2Icon"

export function ListIconComponent({
  className,
  selected = false,
  breakpoint: _breakpoint,
}: GridIconProps) {
  return selected ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="4" width="20" height="4" rx="1" />
      <rect x="2" y="10" width="20" height="4" rx="1" />
      <rect x="2" y="16" width="20" height="4" rx="1" />
    </svg>
  ) : (
    <ListBulletIcon className={className} />
  )
}
