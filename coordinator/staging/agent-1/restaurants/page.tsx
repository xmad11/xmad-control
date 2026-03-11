/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANTS LIST PAGE - Discover all restaurants with filters
   Filter state management, URL sync, active filters display
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { mockRestaurants } from "@/__mock__/restaurants"
import { RestaurantCard } from "@/components/card"
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  XMarkIcon,
} from "@/components/icons"
import { PageContainer } from "@/components/layout/PageContainer"
import { useRouter, useSearchParams } from "next/navigation"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { FilterDropdown } from "./components/FilterDropdown"

type PriceLevel = 1 | 2 | 3 | 4
type RatingFilter = number | null
type Emirate = string | null
type Cuisine = string | null

interface RestaurantFilters {
  emirate: Emirate
  cuisine: Cuisine
  priceRange: PriceLevel[]
  minRating: RatingFilter
  features: string[]
}

/**
 * Get unique values from restaurants
 */
const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]

const cuisines = Array.from(new Set(mockRestaurants.map((r) => r.cuisine))).sort()

const features = [
  { id: "family-friendly", label: "Family Friendly" },
  { id: "outdoor-seating", label: "Outdoor Seating" },
  { id: "valet-parking", label: "Valet Parking" },
  { id: "wifi", label: "Free WiFi" },
  { id: "delivery", label: "Delivery" },
  { id: "alcohol", label: "Serves Alcohol" },
  { id: "private-dining", label: "Private Dining" },
  { id: "live-music", label: "Live Music" },
]

/**
 * Restaurants List Page Component
 *
 * Features:
 * - Filter state management
 * - URL query parameter sync
 * - Multiple filter dropdowns
 * - Active filters display
 * - Clear all filters
 * - Results count
 */
export function RestaurantsListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * Initialize filters from URL params
   */
  const initializeFilters = useCallback((): RestaurantFilters => {
    return {
      emirate: searchParams.get("emirate"),
      cuisine: searchParams.get("cuisine"),
      priceRange: searchParams.get("price")?.split(",").map(Number) as PriceLevel[] || [],
      minRating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
      features: searchParams.get("features")?.split(",") || [],
    }
  }, [searchParams])

  const [filters, setFilters] = useState<RestaurantFilters>(initializeFilters)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  /**
   * Sync filters to URL
   */
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.emirate) params.set("emirate", filters.emirate)
    if (filters.cuisine) params.set("cuisine", filters.cuisine)
    if (filters.priceRange.length > 0) params.set("price", filters.priceRange.join(","))
    if (filters.minRating) params.set("rating", filters.minRating.toString())
    if (filters.features.length > 0) params.set("features", filters.features.join(","))

    const queryString = params.toString()
    const newPath = queryString ? `/restaurants?${queryString}` : "/restaurants"

    router.replace(newPath)
  }, [filters, router])

  /**
   * Filter restaurants
   */
  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      // Emirate filter
      if (filters.emirate && restaurant.location !== filters.emirate) {
        return false
      }

      // Cuisine filter
      if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
        return false
      }

      // Price range filter
      if (filters.priceRange.length > 0 && !filters.priceRange.includes(restaurant.priceLevel as PriceLevel)) {
        return false
      }

      // Rating filter
      if (filters.minRating && restaurant.rating < filters.minRating) {
        return false
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every((feature) =>
          restaurant.features?.includes(feature)
        )
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [filters])

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback(<K extends keyof RestaurantFilters>(
    key: K,
    value: RestaurantFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  /**
   * Clear all filters
   */
  const handleClearAll = useCallback(() => {
    setFilters({
      emirate: null,
      cuisine: null,
      priceRange: [],
      minRating: null,
      features: [],
    })
    setActiveDropdown(null)
  }, [])

  /**
   * Clear specific filter
   */
  const handleClearFilter = useCallback(<K extends keyof RestaurantFilters>(key: K) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (key === "priceRange" || key === "features") {
        newFilters[key] = [] as RestaurantFilters[K]
      } else {
        newFilters[key] = null as RestaurantFilters[K]
      }
      return newFilters
    })
  }, [])

  /**
   * Toggle dropdown
   */
  const toggleDropdown = useCallback((dropdownId: string) => {
    setActiveDropdown((prev) => (prev === dropdownId ? null : dropdownId))
  }, [])

  /**
   * Get active filters count
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.emirate) count++
    if (filters.cuisine) count++
    if (filters.priceRange.length > 0) count++
    if (filters.minRating) count++
    if (filters.features.length > 0) count++
    return count
  }, [filters])

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
            <p className="text-[var(--font-size-lg)] text-[var(--fg-60)]">
              Discover amazing dining experiences across the UAE
            </p>
          </section>

          {/* Filter Bar - Sticky */}
          <div className="sticky top-[var(--header-total-height)] z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--fg-10)] py-[var(--spacing-md)] mb-[var(--spacing-lg)]">
            <div className="flex flex-col gap-[var(--spacing-md)]">
              {/* Filter Pills - Horizontal Scroll */}
              <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)] scrollbar-hide">
                {/* Emirate Filter */}
                <FilterDropdown
                  id="emirate"
                  label={filters.emirate || "All Emirates"}
                  icon={<MapPinIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                  isOpen={activeDropdown === "emirate"}
                  onToggle={() => toggleDropdown("emirate")}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-[var(--spacing-sm)]">
                    <button
                      type="button"
                      onClick={() => {
                        handleFilterChange("emirate", null)
                        setActiveDropdown(null)
                      }}
                      className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                        !filters.emirate ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                      }`}
                    >
                      All Emirates
                    </button>
                    {emirates.map((emirate) => (
                      <button
                        key={emirate}
                        type="button"
                        onClick={() => {
                          handleFilterChange("emirate", emirate)
                          setActiveDropdown(null)
                        }}
                        className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                          filters.emirate === emirate ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                        }`}
                      >
                        {emirate}
                      </button>
                    ))}
                  </div>
                </FilterDropdown>

                {/* Cuisine Filter */}
                <FilterDropdown
                  id="cuisine"
                  label={filters.cuisine || "Cuisine"}
                  icon={<FunnelIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                  isOpen={activeDropdown === "cuisine"}
                  onToggle={() => toggleDropdown("cuisine")}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-[var(--spacing-sm)] max-h-[240px] overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleFilterChange("cuisine", null)
                        setActiveDropdown(null)
                      }}
                      className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                        !filters.cuisine ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                      }`}
                    >
                      All Cuisines
                    </button>
                    {cuisines.map((cuisine) => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => {
                          handleFilterChange("cuisine", cuisine)
                          setActiveDropdown(null)
                        }}
                        className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                          filters.cuisine === cuisine ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </FilterDropdown>

                {/* Price Filter */}
                <FilterDropdown
                  id="price"
                  label={`Price ${filters.priceRange.length > 0 `($${filters.priceRange.length})` : ""}`}
                  icon={<CurrencyDollarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                  isOpen={activeDropdown === "price"}
                  onToggle={() => toggleDropdown("price")}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-[var(--spacing-sm)]">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          const newPriceRange = filters.priceRange.includes(level as PriceLevel)
                            ? filters.priceRange.filter((l) => l !== level)
                            : [...filters.priceRange, level] as PriceLevel[]
                          handleFilterChange("priceRange", newPriceRange)
                        }}
                        className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                          filters.priceRange.includes(level as PriceLevel) ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                        }`}
                      >
                        {"$".repeat(level)}
                      </button>
                    ))}
                  </div>
                </FilterDropdown>

                {/* Rating Filter */}
                <FilterDropdown
                  id="rating"
                  label={filters.minRating ? `${filters.minRating}+ Stars` : "Rating"}
                  icon={<StarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                  isOpen={activeDropdown === "rating"}
                  onToggle={() => toggleDropdown("rating")}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-[var(--spacing-sm)]">
                    {[4.8, 4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          handleFilterChange("minRating", filters.minRating === rating ? null : rating)
                          setActiveDropdown(null)
                        }}
                        className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                          filters.minRating === rating ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                        }`}
                      >
                        {rating}+ Stars
                      </button>
                    ))}
                  </div>
                </FilterDropdown>

                {/* Features Filter */}
                <FilterDropdown
                  id="features"
                  label={`Features ${filters.features.length > 0 `(${filters.features.length})` : ""}`}
                  icon={<FunnelIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                  isOpen={activeDropdown === "features"}
                  onToggle={() => toggleDropdown("features")}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-[var(--spacing-sm)] max-h-[240px] overflow-y-auto">
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => {
                          const newFeatures = filters.features.includes(feature.id)
                            ? filters.features.filter((f) => f !== feature.id)
                            : [...filters.features, feature.id]
                          handleFilterChange("features", newFeatures)
                        }}
                        className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] text-left text-[var(--font-size-sm)] transition-colors ${
                          filters.features.includes(feature.id) ? "bg-[var(--color-primary)] text-[var(--color-white)]" : "text-[var(--fg)] hover:bg-[var(--fg-3)]"
                        }`}
                      >
                        {feature.label}
                      </button>
                    ))}
                  </div>
                </FilterDropdown>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[var(--spacing-xs)] overflow-x-auto scrollbar-hide">
                    {filters.emirate && (
                      <ActiveFilterBadge label={`Emirate: ${filters.emirate}`} onClear={() => handleClearFilter("emirate")} />
                    )}
                    {filters.cuisine && (
                      <ActiveFilterBadge label={`Cuisine: ${filters.cuisine}`} onClear={() => handleClearFilter("cuisine")} />
                    )}
                    {filters.priceRange.length > 0 && (
                      <ActiveFilterBadge label={`Price: ${"$".repeat(Math.max(...filters.priceRange))}`} onClear={() => handleClearFilter("priceRange")} />
                    )}
                    {filters.minRating && (
                      <ActiveFilterBadge label={`Rating: ${filters.minRating}+`} onClear={() => handleClearFilter("minRating")} />
                    )}
                    {filters.features.map((feature) => (
                      <ActiveFilterBadge
                        key={feature}
                        label={features.find((f) => f.id === feature)?.label || feature}
                        onClear={() => {
                          setFilters((prev) => ({
                            ...prev,
                            features: prev.features.filter((f) => f !== feature),
                          }))
                        }}
                      />
                    ))}
                  </div>

                  {/* Clear All Button */}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] text-[var(--font-size-sm)] text-[var(--fg-60)] hover:bg-[var(--fg-5)] hover:text-[var(--fg)] transition-colors whitespace-nowrap"
                  >
                    <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-[var(--spacing-md)]">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Showing <span className="font-semibold text-[var(--fg)]">{filteredRestaurants.length}</span>
              {activeFiltersCount > 0 && (
                <span> of <span className="font-semibold">{mockRestaurants.length}</span></span>
              )}
              {" "}restaurants
            </p>
          </div>

          {/* Restaurant Grid - 2-Grid Mobile, 3+ Tablet/Desktop */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} variant="compact" {...restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-[var(--spacing-5xl)]">
              <FunnelIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
              <h2 className="text-[var(--font-size-2xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
                No restaurants found
              </h2>
              <p className="text-[var(--font-size-base)] text-[var(--fg-60)] mb-[var(--spacing-lg)]">
                Try adjusting your filters to see more results
              </p>
              <button
                type="button"
                onClick={handleClearAll}
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

/**
 * Active Filter Badge Component
 */
interface ActiveFilterBadgeProps {
  label: string
  onClear: () => void
}

function ActiveFilterBadge({ label, onClear }: ActiveFilterBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[var(--font-size-sm)] hover:bg-[var(--color-primary)]/20 transition-colors whitespace-nowrap"
    >
      {label}
      <XMarkIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
    </button>
  )
}

export const RestaurantsListPage = memo(RestaurantsListPage)
