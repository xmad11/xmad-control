/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER BAR - Cuisine filter dropdown with clear option
   Horizontal scrollable cuisine pills
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { XMarkIcon } from "@/components/icons"
import { memo, useCallback, useEffect, useRef, useState } from "react"

interface FilterBarProps {
  cuisines: string[]
  selectedCuisine: string | null
  onCuisineChange: (cuisine: string | null) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

/**
 * Filter Bar - Cuisine filter dropdown
 *
 * Features:
 * - Dropdown with cuisine list
 * - Scrollable cuisine options
 * - Selected cuisine display
 * - Clear all filters button
 */
export function FilterBar({
  cuisines,
  selectedCuisine,
  onCuisineChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  /**
   * Handle cuisine selection
   */
  const handleCuisineSelect = useCallback(
    (cuisine: string) => {
      if (selectedCuisine === cuisine) {
        onCuisineChange(null)
      } else {
        onCuisineChange(cuisine)
      }
      setIsOpen(false)
    },
    [selectedCuisine, onCuisineChange]
  )

  /**
   * Clear all filters
   */
  const handleClearAll = useCallback(() => {
    onClearFilters()
    setIsOpen(false)
  }, [onClearFilters])

  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      {/* Cuisine Dropdown */}
      <div className="relative flex-1" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            w-full flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)]
            rounded-[var(--radius-lg)] border bg-[var(--bg)] text-left
            transition-all duration-[var(--duration-fast)]
            ${
              isOpen
                ? "border-[var(--color-primary)] ring-[var(--focus-ring-width)] ring-[var(--color-primary)]/20"
                : "border-[var(--fg-20)] hover:border-[var(--fg-30)]"
            }
          `}
        >
          <span className="text-[var(--font-size-base)] text-[var(--fg)]">
            {selectedCuisine || "All Cuisines"}
          </span>
          <ChevronDownIcon
            className={`h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-60)] transition-transform duration-[var(--duration-fast)] ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-[var(--z-index-dropdown)] w-full mt-[var(--spacing-xs)] bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] max-h-[240px] overflow-y-auto">
            {/* All Cuisines Option */}
            <button
              type="button"
              onClick={() => handleCuisineSelect("")}
              className={`
                w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left hover:bg-[var(--fg-3)]
                transition-colors first:rounded-t-[var(--radius-lg)]
              `}
            >
              <span
                className={`text-[var(--font-size-base)] ${!selectedCuisine ? "font-medium text-[var(--color-primary)]" : "text-[var(--fg)]"}`}
              >
                All Cuisines
              </span>
              {!selectedCuisine && (
                <span className="text-[var(--font-size-xs)] text-[var(--fg-50)] ml-[var(--spacing-xs)]">
                  ({cuisines.length})
                </span>
              )}
            </button>

            {/* Cuisine Options */}
            {cuisines.map((cuisine) => {
              const isSelected = selectedCuisine === cuisine
              return (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => handleCuisineSelect(cuisine)}
                  className={`
                    w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left hover:bg-[var(--fg-3)]
                    transition-colors border-t border-[var(--fg-5)]
                  `}
                >
                  <span
                    className={`text-[var(--font-size-base)] ${isSelected ? "font-medium text-[var(--color-primary)]" : "text-[var(--fg)]"}`}
                  >
                    {cuisine}
                  </span>
                  {isSelected && (
                    <svg
                      className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-primary)] ml-[var(--spacing-xs)] inline-block"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearAll}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)] hover:text-[var(--fg)] transition-colors"
        >
          <XMarkIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          <span className="text-[var(--font-size-sm)] font-medium">Clear</span>
        </button>
      )}
    </div>
  )
}

export const FilterBar = memo(FilterBar)
