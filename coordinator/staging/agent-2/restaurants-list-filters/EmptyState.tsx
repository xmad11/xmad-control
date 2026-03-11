/**
 * Empty State Component
 *
 * Displayed when no results match the current filters.
 * Uses design tokens exclusively.
 */

"use client"

import { MagnifyingGlassIcon, XMarkIcon } from "@/components/icons"
import { memo } from "react"

export interface EmptyStateProps {
  /** Type of empty state */
  type: "no-results" | "no-restaurants"
  /** Whether filters are active */
  hasActiveFilters: boolean
  /** Clear filters handler */
  onClearFilters?: () => void
  /** Optional custom message */
  message?: string
}

/**
 * Empty State Component
 *
 * @example
 * <EmptyState
 *   type="no-results"
 *   hasActiveFilters={true}
 *   onClearFilters={() => clearAllFilters()}
 * />
 */
export function EmptyState({ type, hasActiveFilters, onClearFilters, message }: EmptyStateProps) {
  if (type === "no-restaurants") {
    return (
      <div className="flex flex-col items-center justify-center py-[var(--spacing-5xl)] px-[var(--spacing-xl)]">
        <div className="flex flex-col items-center gap-[var(--spacing-md)] text-center max-w-[var(--max-w-xl)]">
          <div className="flex h-[var(--spacing-4xl)] w-[var(--spacing-4xl)] items-center justify-center rounded-full bg-[var(--fg-10)]">
            <MagnifyingGlassIcon className="h-[var(--icon-size-2xl)] w-[var(--icon-size-2xl)] text-[var(--fg-40)]" />
          </div>

          <div>
            <h3 className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
              No restaurants found
            </h3>
            <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">
              {message ?? "We couldn't find any restaurants matching your criteria."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // No results with filters
  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-5xl)] px-[var(--spacing-xl)]">
      <div className="flex flex-col items-center gap-[var(--spacing-md)] text-center max-w-[var(--max-w-xl)]">
        <div className="flex h-[var(--spacing-4xl)] w-[var(--spacing-4xl)] items-center justify-center rounded-full bg-[var(--fg-10)]">
          <MagnifyingGlassIcon className="h-[var(--icon-size-2xl)] w-[var(--icon-size-2xl)] text-[var(--fg-40)]" />
        </div>

        <div>
          <h3 className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
            No matching restaurants
          </h3>
          <p className="text-[var(--font-size-base)] text-[var(--fg-70)] mb-[var(--spacing-md)]">
            {message ?? "Try adjusting your filters to find more restaurants."}
          </p>
        </div>

        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)] text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)]"
          >
            <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = memo(EmptyState)
