/* ═══════════════════════════════════════════════════════════════════════════════
   TOP RATED PAGE - Highly rated restaurants with filters
   Rating threshold selector, cuisine filters, badges
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { mockRestaurants } from "@/__mock__/restaurants"
import { RestaurantCard } from "@/components/card"
import { ChevronDownIcon, FunnelIcon, StarIcon } from "@/components/icons"
import { PageContainer } from "@/components/layout/PageContainer"
import { memo, useCallback, useMemo, useState } from "react"
import { FilterBar } from "./components/FilterBar"

type RatingThreshold = 4.0 | 4.5 | 4.8
type CuisineFilter = string | null

interface FilterPillsProps {
  ratings: RatingThreshold[]
  selectedRating: RatingThreshold
  onRatingChange: (rating: RatingThreshold) => void
}

/**
 * Filter Pills - Rating threshold selector
 */
function FilterPills({ ratings, selectedRating, onRatingChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)] scrollbar-hide">
      {ratings.map((rating) => {
        const isSelected = selectedRating === rating
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onRatingChange(rating)}
            className={`
              flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
              rounded-[var(--radius-full)] whitespace-nowrap transition-all duration-[var(--duration-fast)]
              ${
                isSelected
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
              }
            `}
          >
            <StarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            <span className="text-[var(--font-size-sm)] font-medium">{rating}+ Stars</span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Top Rated Page - Highly rated restaurants with filters
 *
 * Features:
 * - Rating threshold selector (4.0+, 4.5+, 4.8+)
 * - Cuisine filter dropdown
 * - "Best of" badges on top restaurants
 * - Sort options
 * - Results count
 */
export function TopRatedPage() {
  const [selectedRating, setSelectedRating] = useState<RatingThreshold>(4.5)
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineFilter>(null)

  /**
   * Get unique cuisines from restaurants
   */
  const availableCuisines = useMemo(() => {
    const cuisines = new Set(mockRestaurants.map((r) => r.cuisine))
    return Array.from(cuisines).sort()
  }, [])

  /**
   * Filter and sort restaurants
   */
  const filteredRestaurants = useMemo(() => {
    let results = mockRestaurants.filter((r) => r.rating >= selectedRating)

    if (selectedCuisine) {
      results = results.filter((r) => r.cuisine === selectedCuisine)
    }

    // Sort by rating descending, then by name
    return results.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return a.title.localeCompare(b.title)
    })
  }, [selectedRating, selectedCuisine])

  /**
   * Get "Best of" badge based on rating
   */
  const getBadgeForRating = (rating: number) => {
    if (rating >= 4.9)
      return {
        label: "Exceptional",
        color: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
      }
    if (rating >= 4.7)
      return {
        label: "Outstanding",
        color: "bg-[var(--color-accent-rust)]/10 text-[var(--color-accent-rust)]",
      }
    if (rating >= 4.5)
      return {
        label: "Excellent",
        color: "bg-[var(--color-accent-sage)]/10 text-[var(--color-accent-sage)]",
      }
    return null
  }

  /**
   * Handle rating change
   */
  const handleRatingChange = useCallback((rating: RatingThreshold) => {
    setSelectedRating(rating)
  }, [])

  /**
   * Handle cuisine change
   */
  const handleCuisineChange = useCallback((cuisine: CuisineFilter) => {
    setSelectedCuisine(cuisine)
  }, [])

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    setSelectedRating(4.5)
    setSelectedCuisine(null)
  }, [])

  const hasActiveFilters = selectedRating !== 4.5 || selectedCuisine !== null

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]">
        <PageContainer>
          {/* Page Header */}
          <section className="py-[var(--spacing-3xl)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <StarIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)] text-[var(--color-rating)]" />
              <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight">
                Top <span className="text-[var(--color-primary)] italic">Rated</span>
              </h1>
            </div>
            <p className="text-[var(--font-size-lg)] text-[var(--fg-60)]">
              The highest rated restaurants in UAE
            </p>
          </section>

          {/* Filters */}
          <section className="mb-[var(--spacing-lg)]">
            {/* Rating Threshold */}
            <div className="mb-[var(--spacing-md)]">
              <p className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-sm)]">
                Minimum Rating
              </p>
              <FilterPills
                ratings={[4.0, 4.5, 4.8]}
                selectedRating={selectedRating}
                onRatingChange={handleRatingChange}
              />
            </div>

            {/* Cuisine Filter */}
            <FilterBar
              cuisines={availableCuisines}
              selectedCuisine={selectedCuisine}
              onCuisineChange={handleCuisineChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </section>

          {/* Results Count */}
          <div className="mb-[var(--spacing-md)]">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Showing{" "}
              <span className="font-semibold text-[var(--fg)]">{filteredRestaurants.length}</span>
              {selectedCuisine ? ` ${selectedCuisine}` : ""} restaurants with {selectedRating}+
              rating
            </p>
          </div>

          {/* Restaurant Grid */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {filteredRestaurants.map((restaurant) => {
                const badge = getBadgeForRating(restaurant.rating)

                return (
                  <div key={restaurant.id} className="relative">
                    {/* Badge */}
                    {badge && (
                      <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)] z-10 px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-semibold uppercase tracking-wide">
                        <span className={badge.color}>{badge.label}</span>
                      </div>
                    )}
                    <RestaurantCard variant="compact" {...restaurant} />
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-[var(--spacing-5xl)]">
              <StarIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
              <h2 className="text-[var(--font-size-2xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
                No restaurants found
              </h2>
              <p className="text-[var(--font-size-base)] text-[var(--fg-60)] mb-[var(--spacing-lg)]">
                Try adjusting your filters to see more results
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <FunnelIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                Clear Filters
              </button>
            </div>
          )}
        </PageContainer>
      </main>
    </div>
  )
}

export const TopRatedPage = memo(TopRatedPage)
