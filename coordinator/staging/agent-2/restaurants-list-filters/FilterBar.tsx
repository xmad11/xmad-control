/**
 * Filter Bar Component
 *
 * Complete filter bar with dropdowns, active filters display, and clear functionality.
 * Uses design tokens exclusively.
 */

"use client"

import { FunnelIcon, XMarkIcon } from "@/components/icons"
import { memo } from "react"
import { FilterDropdown } from "./FilterDropdown"
import { SortDropdown } from "./SortDropdown"
import type { ActiveFilter, FilterOption, RestaurantFilters, SortOption } from "./types"

export interface FilterBarProps {
  /** Current filter state */
  filters: RestaurantFilters
  /** Current sort option */
  sort: SortOption
  /** Filter change handler */
  onFilterChange: (filters: Partial<RestaurantFilters>) => void
  /** Sort change handler */
  onSortChange: (sort: SortOption) => void
  /** Clear all filters handler */
  onClearAll: () => void
  /** Available options for each filter */
  options: {
    emirates: FilterOption[]
    cuisines: FilterOption[]
    priceRanges: FilterOption[]
    ratings: FilterOption[]
  }
  /** Total result count */
  resultCount: number
}

/**
 * Filter Bar Component
 *
 * @example
 * <FilterBar
 *   filters={filters}
 *   sort={sort}
 *   onFilterChange={handleFilterChange}
 *   onSortChange={setSort}
 *   onClearAll={handleClearAll}
 *   options={filterOptions}
 *   resultCount={filteredRestaurants.length}
 * />
 */
export function FilterBar({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onClearAll,
  options,
  resultCount,
}: FilterBarProps) {
  // Get active filters for display
  const getActiveFilters = (): ActiveFilter[] => {
    const activeFilters: ActiveFilter[] = []

    if (filters.emirate !== "all") {
      const option = options.emirates.find((o) => o.value === filters.emirate)
      activeFilters.push({
        key: "emirate",
        label: "Emirate",
        value: option?.label ?? filters.emirate,
        onRemove: () => onFilterChange({ emirate: "all" }),
      })
    }

    if (filters.cuisine !== "all") {
      const option = options.cuisines.find((o) => o.value === filters.cuisine)
      activeFilters.push({
        key: "cuisine",
        label: "Cuisine",
        value: option?.label ?? filters.cuisine,
        onRemove: () => onFilterChange({ cuisine: "all" }),
      })
    }

    if (filters.priceRange !== "all") {
      const option = options.priceRanges.find((o) => o.value === filters.priceRange)
      activeFilters.push({
        key: "priceRange",
        label: "Price",
        value: option?.label ?? filters.priceRange,
        onRemove: () => onFilterChange({ priceRange: "all" }),
      })
    }

    if (filters.minRating > 0) {
      activeFilters.push({
        key: "minRating",
        label: "Rating",
        value: `${filters.minRating}+ stars`,
        onRemove: () => onFilterChange({ minRating: 0 }),
      })
    }

    if (filters.searchQuery) {
      activeFilters.push({
        key: "searchQuery",
        label: "Search",
        value: filters.searchQuery,
        onRemove: () => onFilterChange({ searchQuery: "" }),
      })
    }

    return activeFilters
  }

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      {/* Sticky Filter Bar */}
      <div className="sticky top-[var(--header-total-height)] z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--fg-10)] py-[var(--spacing-md)]">
        <div className="flex flex-col gap-[var(--spacing-md)]">
          {/* Primary Filters Row */}
          <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto scrollbar-hide">
            {/* Filters Button (decorative, shows active count) */}
            <button
              type="button"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
              className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border transition-all duration-[var(--duration-fast)] whitespace-nowrap ${
                hasActiveFilters
                  ? "border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] text-[var(--color-primary)] hover:bg-[oklch(from_var(--color-primary)_l_c_h_/0.15)]"
                  : "border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg-70)]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FunnelIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Filters
              {hasActiveFilters && (
                <span className="flex items-center justify-center h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] rounded-full bg-[var(--color-primary)] text-white text-[var(--font-size-2xs)] font-medium">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Emirate Filter */}
            <FilterDropdown
              label="All Emirates"
              value={filters.emirate}
              options={options.emirates}
              onChange={(value) => onFilterChange({ emirate: value as typeof filters.emirate })}
              showCount
            />

            {/* Cuisine Filter */}
            <FilterDropdown
              label="Cuisine"
              value={filters.cuisine}
              options={options.cuisines}
              onChange={(value) => onFilterChange({ cuisine: value as typeof filters.cuisine })}
              showCount
              searchable
            />

            {/* Price Filter */}
            <FilterDropdown
              label="Price"
              value={filters.priceRange}
              options={options.priceRanges}
              onChange={(value) =>
                onFilterChange({ priceRange: value as typeof filters.priceRange })
              }
            />

            {/* Rating Filter */}
            <FilterDropdown
              label="Rating"
              value={filters.minRating === 0 ? "all" : filters.minRating.toString()}
              options={options.ratings}
              onChange={(value) =>
                onFilterChange({ minRating: value === "all" ? 0 : Number.parseFloat(value) })
              }
            />
          </div>

          {/* Secondary Row: Sort + Active Filters */}
          <div className="flex items-center justify-between gap-[var(--spacing-md)]">
            {/* Sort Dropdown */}
            <SortDropdown value={sort} onChange={onSortChange} />

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto scrollbar-hide">
                {activeFilters.map((filter, index) => (
                  <button
                    key={`${filter.key}-${index}`}
                    type="button"
                    onClick={filter.onRemove}
                    className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg-70)] text-[var(--font-size-sm)] text-[var(--fg)] hover:border-[var(--color-error)] hover:text-[var(--color-error)] transition-all duration-[var(--duration-fast)] whitespace-nowrap"
                  >
                    <span className="opacity-70">{filter.label}:</span>
                    <span className="font-medium">{filter.value}</span>
                    <XMarkIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
                  </button>
                ))}

                {/* Clear All Button */}
                <button
                  type="button"
                  onClick={onClearAll}
                  className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] text-[var(--color-primary)] hover:bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] transition-all duration-[var(--duration-fast)] whitespace-nowrap"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
          Showing <span className="font-semibold text-[var(--fg)]">{resultCount}</span> restaurants
          {hasActiveFilters && (
            <span className="ml-[var(--spacing-xs)]">
              (
              {activeFilters.map((f, i) => (
                <span key={i} className="inline">
                  {i > 0 && ", "}
                  {f.value}
                </span>
              ))}
              )
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export const FilterBar = memo(FilterBar)
