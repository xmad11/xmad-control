/**
 * Sort Dropdown Component
 *
 * Dropdown for sorting restaurants.
 * Uses design tokens exclusively.
 */

"use client"

import { ArrowsUpDownIcon } from "@/components/icons"
import { memo, useEffect, useRef, useState } from "react"
import type { SortOption } from "./types"

export interface SortOptionData {
  value: SortOption
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface SortDropdownProps {
  /** Currently selected sort option */
  value: SortOption
  /** Sort change handler */
  onChange: (value: SortOption) => void
  /** Available sort options */
  options?: SortOptionData[]
}

const DEFAULT_OPTIONS: SortOptionData[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]

/**
 * Sort Dropdown Component
 *
 * @example
 * <SortDropdown
 *   value={sortOption}
 *   onChange={setSortOption}
 * />
 */
export function SortDropdown({ value, onChange, options = DEFAULT_OPTIONS }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Get display label
  const displayLabel = options.find((o) => o.value === value)?.label ?? "Sort"

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border transition-all duration-[var(--duration-fast)] ${
          isOpen || value !== "relevance"
            ? "border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)] text-[var(--color-primary)]"
            : "border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ArrowsUpDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
        <span className="text-[var(--font-size-sm)]">{displayLabel}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg)] shadow-[var(--shadow-lg)] min-w-[var(--spacing-5xl)]"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] transition-all duration-[var(--duration-fast)] w-full text-left ${
                  isSelected
                    ? "bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] text-[var(--color-primary)]"
                    : "text-[var(--fg)] hover:bg-[var(--bg-80)]"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                {option.icon && (
                  <option.icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                )}
                <span className="text-[var(--font-size-sm)]">{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const SortDropdown = memo(SortDropdown)
