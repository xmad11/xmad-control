/**
 * Tabs Component - For Owner Dashboard navigation
 *
 * Provides horizontal tab navigation with active state styling.
 * Uses design tokens exclusively for all values.
 */

"use client"

import { memo } from "react"

/**
 * Individual Tab button with active state
 *
 * @example
 * <Tab label="Profile" isActive onClick={() => setActiveTab('profile')} />
 */
export function Tab({
  label,
  isActive = false,
  icon: Icon,
  onClick,
  "aria-label": ariaLabel,
}: TabProps) {
  const baseStyles =
    "relative flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] font-medium transition-all duration-[var(--duration-fast)] rounded-t-[var(--radius-lg)] border-b-[var(--border-width-thin)]"

  const activeStyles = isActive
    ? "text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--bg-70)]"
    : "text-[var(--fg-70)] border-transparent hover:text-[var(--fg)] hover:bg-[var(--bg-80)]"

  const indicatorStyles = isActive
    ? "absolute bottom-[-1px] left-0 right-0 h-[var(--border-width-thin)] bg-[var(--bg)]"
    : ""

  return (
    <button
      type="button"
      className={`${baseStyles} ${activeStyles}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {Icon && <Icon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />}
      <span className="text-[var(--font-size-sm)]">{label}</span>
      {indicatorStyles && <span className={indicatorStyles} aria-hidden="true" />}
    </button>
  )
}

/**
 * Tabs container with horizontal scroll for mobile
 *
 * @example
 * <Tabs activeTab="profile" onChange={(tab) => setActiveTab(tab)} items={tabItems} />
 */
export function Tabs({
  activeTab,
  onChange,
  items,
  "aria-label": ariaLabel = "Dashboard sections",
}: TabsProps) {
  return (
    <div className="w-full">
      {/* Scrollable tabs container for mobile */}
      <div
        className="flex gap-[var(--spacing-sm)] overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => (
          <Tab
            key={item.value}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.value}
            onClick={() => onChange(item.value)}
            aria-label={`Switch to ${item.label} section`}
          />
        ))}
      </div>

      {/* Active tab indicator line */}
      <div
        className="mt-0 h-[var(--border-width-thin)] w-full border-b border-[var(--fg-10)]"
        aria-hidden="true"
      />
    </div>
  )
}

export const Tabs = memo(Tabs)

/**
 * Types for Tabs component
 */

export interface TabProps {
  /** Tab label text */
  label: string
  /** Whether this tab is currently active */
  isActive?: boolean
  /** Optional icon component to display */
  icon?: React.ComponentType<{ className?: string }>
  /** Click handler */
  onClick: () => void
  /** Accessibility label */
  "aria-label"?: string
}

export interface TabsProps {
  /** Currently active tab value */
  activeTab: string
  /** Change handler called when tab is clicked */
  onChange: (value: string) => void
  /** Array of tab items */
  items: Array<{
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  /** Accessibility label for tab list */
  "aria-label"?: string
}
