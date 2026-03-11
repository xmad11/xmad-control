/**
 * Restaurants List Page - Complete with Filter Functionality
 *
 * Full implementation of filter state management, dropdowns,
 * URL sync, pagination, and empty states.
 * Uses design tokens exclusively.
 */

"use client"

import { RestaurantCard } from "@/components/card"
import { PageContainer } from "@/components/layout/PageContainer"
import { memo, useCallback, useMemo, useState } from "react"
import { EmptyState } from "./EmptyState"
import { FilterBar } from "./FilterBar"
import { LoadMore } from "./LoadMore"
import type { FilterOption, RestaurantFilters, SortOption } from "./types"
import { useRestaurantFilters } from "./useRestaurantFilters"

// ============================================================================
// MOCK DATA - Replace with actual API call
// ============================================================================

import { mockRestaurants } from "@/__mock__/restaurants"

// ============================================================================
// FILTER OPTIONS
// ============================================================================

const EMIRATE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Emirates" },
  { value: "dubai", label: "Dubai", count: 245 },
  { value: "abu-dhabi", label: "Abu Dhabi", count: 189 },
  { value: "sharjah", label: "Sharjah", count: 98 },
  { value: "ajman", label: "Ajman", count: 45 },
  { value: "umm-al-quwain", label: "Umm Al Quwain", count: 23 },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah", count: 34 },
  { value: "fujairah", label: "Fujairah", count: 28 },
]

const CUISINE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Cuisines" },
  { value: "arabic", label: "Arabic", count: 156 },
  { value: "italian", label: "Italian", count: 89 },
  { value: "indian", label: "Indian", count: 134 },
  { value: "chinese", label: "Chinese", count: 67 },
  { value: "japanese", label: "Japanese", count: 54 },
  { value: "thai", label: "Thai", count: 43 },
  { value: "mediterranean", label: "Mediterranean", count: 78 },
  { value: "lebanese", label: "Lebanese", count: 45 },
  { value: "emirati", label: "Emirati", count: 23 },
  { value: "pakistani", label: "Pakistani", count: 56 },
  { value: "filipino", label: "Filipino", count: 34 },
  { value: "korean", label: "Korean", count: 28 },
  { value: "mexican", label: "Mexican", count: 19 },
  { value: "american", label: "American", count: 45 },
  { value: "french", label: "French", count: 23 },
  { value: "grill", label: "Grill & BBQ", count: 67 },
  { value: "seafood", label: "Seafood", count: 89 },
  { value: "vegetarian", label: "Vegetarian", count: 34 },
  { value: "cafe", label: "Cafe", count: 123 },
  { value: "bakery", label: "Bakery", count: 45 },
  { value: "desserts", label: "Desserts", count: 56 },
]

const PRICE_OPTIONS: FilterOption[] = [
  { value: "all", label: "Any Price" },
  { value: "$", label: "$ (Budget)", count: 234 },
  { value: "$$", label: "$$ (Moderate)", count: 345 },
  { value: "$$$", label: "$$$ (Expensive)", count: 156 },
  { value: "$$$$", label: "$$$$ (Fine Dining)", count: 45 },
]

const RATING_OPTIONS: FilterOption[] = [
  { value: "all", label: "Any Rating" },
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
  { value: "3", label: "3+ Stars" },
]

// ============================================================================
// FILTER LOGIC
// ============================================================================

interface RestaurantWithMeta extends (typeof mockRestaurants)[number] {
  _matchScore?: number
}

function filterRestaurants(
  restaurants: typeof mockRestaurants,
  filters: RestaurantFilters,
  sort: SortOption
): RestaurantWithMeta[] {
  let filtered = [...restaurants] as RestaurantWithMeta[]

  // Emirate filter
  if (filters.emirate !== "all") {
    filtered = filtered.filter((r) => r.location.area.toLowerCase().includes(filters.emirate))
  }

  // Cuisine filter
  if (filters.cuisine !== "all") {
    filtered = filtered.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase().includes(filters.cuisine))
    )
  }

  // Price range filter
  if (filters.priceRange !== "all") {
    const priceMap = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 }
    const targetPrice = priceMap[filters.priceRange]
    filtered = filtered.filter((r) => r.priceRange.length === targetPrice)
  }

  // Rating filter
  if (filters.minRating > 0) {
    filtered = filtered.filter((r) => r.rating >= filters.minRating)
  }

  // Search query filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.some((c) => c.toLowerCase().includes(query)) ||
        r.location.area.toLowerCase().includes(query)
    )
  }

  // Sorting
  switch (sort) {
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      filtered.sort((a, b) => b.id.localeCompare(a.id))
      break
    case "price-low":
      filtered.sort((a, b) => a.priceRange.length - b.priceRange.length)
      break
    case "price-high":
      filtered.sort((a, b) => b.priceRange.length - a.priceRange.length)
      break
    case "popularity":
      filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      break
    default:
      // Relevance - keep original order
      break
  }

  return filtered
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================()

interface RestaurantsListClientProps {
  restaurants?: typeof mockRestaurants
}

function RestaurantsListClient({ restaurants = mockRestaurants }: RestaurantsListClientProps) {
  // Filter state with URL sync
  const { filters, sort, setFilters, setSort, resetFilters, getActiveFilterCount } =
    useRestaurantFilters()

  // Pagination state
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return filterRestaurants(restaurants, filters, sort)
  }, [restaurants, filters, sort])

  // Paginated results
  const paginatedRestaurants = useMemo(() => {
    return filteredRestaurants.slice(0, page * itemsPerPage)
  }, [filteredRestaurants, page])

  const hasMore = paginatedRestaurants.length < filteredRestaurants.length
  const hasActiveFilters = getActiveFilterCount() > 0

  // Filter options
  const filterOptions = useMemo(
    () => ({
      emirates: EMIRATE_OPTIONS,
      cuisines: CUISINE_OPTIONS,
      priceRanges: PRICE_OPTIONS,
      ratings: RATING_OPTIONS,
    }),
    []
  )

  // Handlers
  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const handleFilterChange = useCallback((newFilters: Partial<RestaurantFilters>) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }, [setFilters])

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]">
        <PageContainer>
          {/* Page Header */}
          <section className="py-[var(--spacing-3xl)]">
            <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
              All <span className="text-[var(--color-primary)] italic">Restaurants</span>
            </h1>
            <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
              Discover amazing dining experiences across the UAE
            </p>
          </section>

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            sort={sort}
            onFilterChange={handleFilterChange}
            onSortChange={setSort}
            onClearAll={resetFilters}
            options={filterOptions}
            resultCount={filteredRestaurants.length}
          />

          {/* Results */}
          {filteredRestaurants.length > 0 ? (
            <>
              {/* Restaurant Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
                {paginatedRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} variant="compact" {...restaurant} />
                ))}
              </div>

              {/* Load More */}
              <LoadMore
                hasMore={hasMore}
                isLoading={false}
                onLoadMore={handleLoadMore}
                currentPage={page}
                totalItems={filteredRestaurants.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
            <EmptyState
              type="no-results"
              hasActiveFilters={hasActiveFilters}
              onClearFilters={resetFilters}
            />
          )}
        </PageContainer>
      </main>
    </div>
  )
}

export const RestaurantsListClient = memo(RestaurantsListClient)
