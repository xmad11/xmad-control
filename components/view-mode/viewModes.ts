/* ═══════════════════════════════════════════════════════════════════════════════
   VIEW MODES - Semantic view modes with icons

   Icons represent intent, not responsive behavior.
   Icons never change based on screen size.
   Order is fixed: grid-2 → grid-3 → grid-4 → list
   ═══════════════════════════════════════════════════════════════════════════════ */

import { Grid2Icon, Grid3Icon, Grid4Icon, ListIcon } from "./icons"
import type { ViewModeOption } from "./types"

/**
 * Semantic view modes with stable icons
 * No responsive logic here - see viewModeColumns.ts for responsive behavior
 */
export const VIEW_MODES: ViewModeOption[] = [
  {
    id: "grid-2",
    label: "2 Columns",
    icon: Grid2Icon,
  },
  {
    id: "grid-3",
    label: "3 Columns",
    icon: Grid3Icon,
  },
  {
    id: "grid-4",
    label: "4 Columns",
    icon: Grid4Icon,
  },
  {
    id: "list",
    label: "List View",
    icon: ListIcon,
  },
] as const
