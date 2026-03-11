/* ═══════════════════════════════════════════════════════════════════════════════
   SAVED SEARCHES SECTION - Reusable search filters
   Preset search configurations with one-tap access
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  ClockIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@/components/icons"
import { memo } from "react"

interface SavedSearch {
  id: string
  name: string
  filters: {
    cuisine?: string
    emirate?: string
    priceRange?: string
    rating?: number
  }
}

/**
 * Saved Searches Section - Quick access to saved filters
 *
 * Features:
 * - One-tap access to saved searches
 * - Visual filter indicators
 * - Create new search button
 */
export function SavedSearchesSection() {
  // TODO: Replace with actual saved searches from localStorage
  const savedSearches: SavedSearch[] = [
    {
      id: "1",
      name: "Budget Friendly",
      filters: { priceRange: "$", rating: 4.0 },
    },
    {
      id: "2",
      name: "Dubai Fine Dining",
      filters: { emirate: "Dubai", priceRange: "$$$" },
    },
    {
      id: "3",
      name: "Family Options",
      filters: { cuisine: "Family Friendly" },
    },
    {
      id: "4",
      name: "Highly Rated",
      filters: { rating: 4.5 },
    },
  ]

  /**
   * Get filter icon based on filter type
   */
  const getFilterIcon = (search: SavedSearch) => {
    if (search.filters.emirate)
      return <MapPinIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
    if (search.filters.priceRange)
      return <CurrencyDollarIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
    if (search.filters.rating && search.filters.rating >= 4.5) {
      return <ClockIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
    }
    return <FunnelIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
  }

  /**
   * Get filter badge text
   */
  const getFilterBadge = (search: SavedSearch) => {
    const badges: string[] = []
    if (search.filters.cuisine) badges.push(search.filters.cuisine)
    if (search.filters.emirate) badges.push(search.filters.emirate)
    if (search.filters.priceRange) badges.push(search.filters.priceRange)
    if (search.filters.rating) badges.push(`${search.filters.rating}+ ⭐`)
    return badges.join(" • ")
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-[var(--spacing-md)]">
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Saved Searches</h2>

        <button
          type="button"
          aria-label="Create new saved search"
          className="flex items-center justify-center w-[var(--touch-target-min)] h-[var(--touch-target-min)] rounded-full bg-[var(--color-primary)] text-[var(--color-white)] hover:opacity-[var(--hover-opacity)] transition-opacity"
        >
          <svg
            className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Saved Searches List */}
      <div className="space-y-[var(--spacing-sm)]">
        {savedSearches.map((search) => (
          <a
            key={search.id}
            href={`/restaurants?${new URLSearchParams(search.filters as Record<string, string>).toString()}`}
            className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 transition-colors">
              {getFilterIcon(search)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] truncate">
                {search.name}
              </h3>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] truncate">
                {getFilterBadge(search)}
              </p>
            </div>

            {/* Arrow */}
            <svg
              className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-30)] group-hover:text-[var(--color-primary)] group-hover:translate-x-[var(--spacing-xs)] transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      {/* Empty State (Hidden when searches exist) */}
      {savedSearches.length === 0 && (
        <div className="text-center py-[var(--spacing-4xl)]">
          <div className="flex items-center justify-center w-[var(--icon-size-3xl)] h-[var(--icon-size-3xl)] rounded-full bg-[var(--fg-5)] mx-auto mb-[var(--spacing-md)]">
            <MagnifyingGlassIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)] text-[var(--fg-30)]" />
          </div>
          <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]">
            No saved searches
          </h3>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Save your favorite filters for quick access
          </p>
        </div>
      )}
    </section>
  )
}
