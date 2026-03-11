/* ═══════════════════════════════════════════════════════════════════════════════
   STICKY TABS - Tab navigation that sticks to top when scrolling
   Uses design tokens, smooth animations, CSS-only sticky positioning
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo, useCallback, useState } from "react"

export interface Tab {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

export interface StickyTabsProps {
  tabs: readonly Tab[]
  defaultTabId?: string
  onChange?: (tabId: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "text-[var(--font-size-sm)] gap-[var(--spacing-sm)]",
  md: "text-[var(--font-size-base)] gap-[var(--spacing-md)]",
  lg: "text-[var(--font-size-lg)] gap-[var(--spacing-lg)]",
}

const indicatorSizeClasses = {
  sm: "h-[var(--spacing-xs)]",
  md: "h-[var(--spacing-sm)]",
  lg: "h-[var(--spacing-md)]",
}

/**
 * StickyTabs - Tab navigation with sticky positioning
 *
 * Features:
 * - CSS-only sticky positioning (no JS scroll listeners)
 * - Smooth slide animation for active indicator
 * - Optional count badges on tabs
 * - Design token-based sizing and spacing
 *
 * @example
 * <StickyTabs
 *   tabs={[
 *     { id: "overview", label: "Overview" },
 *     { id: "menu", label: "Menu", count: 24 },
 *     { id: "reviews", label: "Reviews", count: 128 },
 *   ]}
 *   defaultTabId="overview"
 *   onChange={(id) => console.log(id)}
 * />
 */
export const StickyTabs = memo(function StickyTabs({
  tabs,
  defaultTabId,
  onChange,
  className = "",
  size = "md",
}: StickyTabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? tabs[0]?.id ?? "")

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabs.find((t) => t.id === tabId)?.disabled) return
      setActiveTabId(tabId)
      onChange?.(tabId)
    },
    [tabs, onChange]
  )

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId)

  return (
    <div
      className={`sticky top-[var(--header-total-height)] z-50 w-full bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--fg-10)] ${className}`}
    >
      <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
        <div className={`relative flex items-center ${sizeClasses[size]}`}>
          {/* Tabs */}
          {tabs.map((tab, _index) => {
            const isActive = tab.id === activeTabId
            const isDisabled = tab.disabled

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                disabled={isDisabled}
                className={`
                  relative px-[var(--spacing-sm)] py-[var(--spacing-md)]
                  font-medium transition-colors duration-[var(--duration-normal)]
                  flex items-center gap-[var(--spacing-xs)]
                  ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : isDisabled
                        ? "text-[var(--fg-20)] cursor-not-allowed"
                        : "text-[var(--fg-70)] hover:text-[var(--fg)]"
                  }
                `}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`
                      px-[var(--spacing-xs)] py-[var(--spacing-xs)]
                      rounded-full text-[var(--font-size-2xs)]
                      ${
                        isActive
                          ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                          : "bg-[var(--fg-10)] text-[var(--fg-70)]"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}

          {/* Active indicator - smooth slide animation */}
          {activeIndex >= 0 && (
            <div
              className="absolute bottom-0 left-0 bg-[var(--color-primary)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]"
              style={{
                /* @design-exception DYNAMIC_TRANSFORM: Width & transform calculated at runtime based on tab count and active index - cannot be expressed with static Tailwind classes */
                width: `${100 / tabs.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
              <div className={indicatorSizeClasses[size]} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
