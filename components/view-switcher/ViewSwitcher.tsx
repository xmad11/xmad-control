/* ═══════════════════════════════════════════════════════════════════════════════
   VIEW SWITCHER - Toggle between grid/list/compact views
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Bars3Icon, ListBulletIcon, Squares2X2Icon } from "@/components/icons"
import { memo } from "react"

export type ViewMode = "grid-4" | "grid-3" | "grid-2" | "list" | "compact"

export interface ViewSwitcherProps {
  current: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

const viewButtons: {
  mode: ViewMode
  icon: React.ComponentType<{ className: string }>
  label: string
}[] = [
  { mode: "grid-4", icon: Squares2X2Icon, label: "4 columns" },
  { mode: "list", icon: ListBulletIcon, label: "List view" },
  { mode: "compact", icon: Bars3Icon, label: "Compact view" },
]

/**
 * ViewSwitcher - Toggle between different view modes
 * Icon-only buttons, no dropdowns, loop states
 */
export const ViewSwitcher = memo(function ViewSwitcher({
  current,
  onChange,
  className = "",
}: ViewSwitcherProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-[var(--spacing-xs)]
        p-[var(--spacing-xs)]
        bg-[var(--glass-bg)] dark:bg-[var(--color-gray-800)]
        rounded-[var(--radius-lg)]
        border border-[var(--fg-10)] dark:border-[var(--color-gray-700)]
        ${className}
      `}
    >
      {viewButtons.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`
            w-11 h-11
            rounded-[var(--radius-md)]
            transition-all duration-[var(--duration-fast)]
            flex items-center justify-center
            ${
              current === mode
                ? "bg-[var(--accent-rust)] text-[var(--color-white)]"
                : "text-[var(--fg-60)] hover:text-[var(--fg)] hover:bg-[var(--bg)]"
            }
          `}
          aria-label={label}
          aria-pressed={current === mode}
        >
          <Icon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
        </button>
      ))}
    </div>
  )
})
