/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANTS PAGE - Full search, filter, sort, view functionality
   Query param based routing from home page
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { mockRestaurants } from "@/__mock__/restaurants"
import { RestaurantCard } from "@/components/card"
import { CardGrid } from "@/components/cards"
import type {
  AtmosphereOption,
  CuisineOption,
  LocationOption,
  MealOption,
} from "@/components/filters/filterData"
import type { SortOptionId } from "@/components/search"
import { SearchContainer, type ViewMode } from "@/components/search/SearchContainer"
import { type ViewModeId, resolveViewMode } from "@/components/view-mode"
import { useLanguage } from "@/context/LanguageContext"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import { useGeolocation } from "@/lib/maps"
import { STORAGE_KEYS, storage } from "@/lib/storage"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { useCallback, useMemo, useState } from "react"

function RestaurantsPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  // Read URL params with backward compatibility for ?q=
  const initialQuery = searchParams.get("query") || searchParams.get("q") || ""
  const initialFilter = searchParams.get("filter") || ""
  const initialSort = searchParams.get("sort") || ""
  const initialView = searchParams.get("view") || ""

  // Multi-select filter states
  const [selectedMeals, setSelectedMeals] = useState<MealOption[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineOption[]>([])
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<AtmosphereOption[]>([])

  // Single-select states
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [location, setLocation] = useState<LocationOption>("all")
  const [sort, setSort] = useState<SortOptionId>((initialSort || "newest") as SortOptionId)

  // Geolocation hook
  const { position: userLocation, requestLocation } = useGeolocation()

  // Auto-request location on app start (one time)
  useEffect(() => {
    // Only request if we don't have location yet and not already loading
    if (!userLocation && typeof window !== "undefined") {
      const hasRequested = sessionStorage.getItem("location-requested")
      if (!hasRequested) {
        requestLocation()
        sessionStorage.setItem("location-requested", "true")
      }
    }
  }, [userLocation, requestLocation])

  // Hydration-safe state initialization
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Server + first client render: use URL param or default
    // This ensures server and client match on first render
    return (initialView || "grid-4") as ViewMode
  })

  // After mount, load from localStorage
  useEffect(() => {
    if (!initialView) {
      const stored = storage.getRaw(STORAGE_KEYS.RESTAURANT_FILTERS)
      if (stored) {
        try {
          const filters = JSON.parse(stored)
          if (filters.viewMode) {
            setViewMode(filters.viewMode as ViewMode)
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [initialView])

  const breakpoint = useBreakpoint()

  // Map filter URL param to appropriate state
  useEffect(() => {
    if (initialFilter) {
      switch (initialFilter) {
        case "hidden-gem":
          setSelectedAtmospheres(["hidden-gem"])
          break
        case "near-me":
          setLocation("near-me")
          break
        case "budget-friendly":
          setSelectedAtmospheres(["budget-friendly"])
          break
        case "trending":
          setSort("newest")
          break
        case "romantic":
          setSelectedAtmospheres(["romantic"])
          break
        case "iconic":
          setSelectedAtmospheres(["iconic"])
          break
        case "family-friendly":
          setSelectedAtmospheres(["family-friendly"])
          break
        case "casual":
          setSelectedAtmospheres(["casual"])
          break
        case "fine-dining":
          setSelectedAtmospheres(["fine-dining"])
          break
        case "trendy":
          setSelectedAtmospheres(["trendy"])
          break
        case "traditional":
          setSelectedAtmospheres(["traditional"])
          break
        case "outdoor":
          setSelectedAtmospheres(["outdoor"])
          break
        case "outdoor-seating":
          setSelectedAtmospheres(["outdoor-seating"])
          break
        case "business":
          setSelectedAtmospheres(["business"])
          break
        case "kids-friendly":
          setSelectedAtmospheres(["kids-friendly"])
          break
        default:
          // If filter matches a cuisine option, set cuisine
          setSelectedCuisines([initialFilter as CuisineOption])
          break
      }
    }
  }, [initialFilter])

  // Load filters from localStorage on mount (if URL params are empty)
  // Note: viewMode is loaded synchronously in useState initialization to prevent flash
  useEffect(() => {
    // Only load from localStorage if URL params are empty (user navigated directly)
    const hasUrlParams = initialQuery || initialFilter || initialSort || initialView
    if (hasUrlParams) return

    const stored = storage.getRaw(STORAGE_KEYS.RESTAURANT_FILTERS)
    if (stored) {
      try {
        const filters = JSON.parse(stored)
        console.log("Loading filters from localStorage:", filters)

        let filtersModified = false
        const cleanedFilters = { ...filters }

        // Validate filters before applying - if any filter arrays exist, check if they'd match anything
        const hasFilterArrays =
          filters.selectedMeals?.length > 0 ||
          filters.selectedCuisines?.length > 0 ||
          filters.selectedAtmospheres?.length > 0

        // If filters exist but would result in empty results, clear them
        if (hasFilterArrays) {
          // Quick check: do any restaurants match these filters?
          const hasMatchingRestaurants = mockRestaurants.some((r) => {
            const mealMatch =
              !filters.selectedMeals?.length ||
              filters.selectedMeals.some((m: string) =>
                r.shadiBadges?.some((b) =>
                  b.toLowerCase().includes(m.toLowerCase().replace(/-/g, " "))
                )
              )
            const cuisineMatch =
              !filters.selectedCuisines?.length ||
              filters.selectedCuisines.some((c: string) =>
                r.cuisine.toLowerCase().includes(c.toLowerCase().replace(/-/g, " "))
              )
            const atmosphereMatch =
              !filters.selectedAtmospheres?.length ||
              filters.selectedAtmospheres.some(
                (a: string) =>
                  r.shadiBadges?.some((b) =>
                    b.toLowerCase().includes(a.toLowerCase().replace(/-/g, " "))
                  ) ||
                  r.features?.some((f) =>
                    f.toLowerCase().includes(a.toLowerCase().replace(/-/g, " "))
                  )
              )
            return mealMatch && cuisineMatch && atmosphereMatch
          })

          if (!hasMatchingRestaurants) {
            console.warn("Saved filters match no restaurants, clearing them")
            cleanedFilters.selectedMeals = []
            cleanedFilters.selectedCuisines = []
            cleanedFilters.selectedAtmospheres = []
            filtersModified = true
          }
        }

        // Validate searchQuery before applying
        if (filters.searchQuery) {
          // Check if search query matches ANY restaurant
          const hasSearchMatch = mockRestaurants.some(
            (r) =>
              r.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              r.cuisine.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              r.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              r.district?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              r.emirate?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          )
          if (!hasSearchMatch) {
            console.warn("Saved searchQuery matches no restaurants, clearing:", filters.searchQuery)
            cleanedFilters.searchQuery = ""
            filtersModified = true
          }
        }

        // Save cleaned filters back to localStorage if modified
        if (filtersModified) {
          storage.set(STORAGE_KEYS.RESTAURANT_FILTERS, cleanedFilters)
        }

        // Apply validated filters
        if (cleanedFilters.searchQuery) setSearchQuery(cleanedFilters.searchQuery)
        if (cleanedFilters.location && cleanedFilters.location !== "all")
          setLocation(cleanedFilters.location)
        if (cleanedFilters.selectedMeals?.length > 0) setSelectedMeals(cleanedFilters.selectedMeals)
        if (cleanedFilters.selectedCuisines?.length > 0)
          setSelectedCuisines(cleanedFilters.selectedCuisines)
        if (cleanedFilters.selectedAtmospheres?.length > 0)
          setSelectedAtmospheres(cleanedFilters.selectedAtmospheres)
        if (cleanedFilters.sort && cleanedFilters.sort !== "newest") setSort(cleanedFilters.sort)
        // viewMode is already loaded synchronously in useState initialization
      } catch (e) {
        console.error("Error loading filters from localStorage:", e)
        // Clear invalid data
        storage.remove(STORAGE_KEYS.RESTAURANT_FILTERS)
      }
    }
  }, [initialQuery, initialFilter, initialSort, initialView])

  // Save filters to localStorage whenever state changes
  useEffect(() => {
    const filters = {
      searchQuery,
      location,
      selectedMeals,
      selectedCuisines,
      selectedAtmospheres,
      sort,
      viewMode,
    }
    storage.set(STORAGE_KEYS.RESTAURANT_FILTERS, filters)
  }, [searchQuery, location, selectedMeals, selectedCuisines, selectedAtmospheres, sort, viewMode])

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTER & SORT LOGIC - Multi-select with priority sorting (optimized O(n))
  // ─────────────────────────────────────────────────────────────────────────────
  //
  // FILTER SEMANTICS (AND/OR logic):
  // - Within a category: OR logic (any selected option matches = pass)
  //   Example: selectedMeals=["breakfast", "lunch"] → restaurants with EITHER badge pass
  //
  // - Between categories: AND logic (all active categories must match)
  //   Example: selectedMeals=["breakfast"] + selectedCuisines=["emirati"]
  //            → ONLY restaurants with BOTH meal AND cuisine match pass
  //
  // - Empty categories: Ignored (no filtering applied)
  //   Example: selectedMeals=[] → meal filter not applied
  //
  // PRIORITY SORTING:
  // - Restaurants matching MORE options across ALL categories appear first
  // - Example: RestaurantA (3 matches) > RestaurantB (1 match)
  // ─────────────────────────────────────────────────────────────────────────────

  // Map location IDs to emirate names (shared across filters and recommendations)
  const locationEmirateMap: Record<string, string> = {
    "abu-dhabi": "Abu Dhabi",
    dubai: "Dubai",
    sharjah: "Sharjah",
    ajman: "Ajman",
    "umm-al-quwain": "Umm Al Quwain",
    "ras-al-khaimah": "Ras Al Khaimah",
    fujairah: "Fujairah",
  }

  const filteredRestaurants = useMemo(() => {
    let results = [...mockRestaurants]

    // Helper: Normalize filter terms for matching
    function normalizeFilterTerm(term: string): string {
      return term.toLowerCase().replace(/-/g, " ")
    }

    // Helper: Count meal matches for a restaurant
    function countMealMatches(restaurant: (typeof mockRestaurants)[0]): number {
      if (selectedMeals.length === 0) return 0
      return selectedMeals.filter((meal) =>
        restaurant.shadiBadges?.some((badge) =>
          badge.toLowerCase().includes(normalizeFilterTerm(meal))
        )
      ).length
    }

    // Helper: Count cuisine matches for a restaurant
    function countCuisineMatches(restaurant: (typeof mockRestaurants)[0]): number {
      if (selectedCuisines.length === 0) return 0
      return selectedCuisines.filter((cuisine) =>
        restaurant.cuisine.toLowerCase().includes(normalizeFilterTerm(cuisine))
      ).length
    }

    // Helper: Count atmosphere matches for a restaurant
    function countAtmosphereMatches(restaurant: (typeof mockRestaurants)[0]): number {
      if (selectedAtmospheres.length === 0) return 0
      return selectedAtmospheres.filter(
        (atm) =>
          restaurant.shadiBadges?.some((badge) =>
            badge.toLowerCase().includes(normalizeFilterTerm(atm))
          ) ||
          restaurant.features?.some((feature) =>
            feature.toLowerCase().includes(normalizeFilterTerm(atm))
          )
      ).length
    }

    // Helper function to get price tier numeric value for sorting
    function priceTierValue(price: string): number {
      const values: Record<string, number> = { $: 1, $$: 2, $$$: 3, $$$$: 4 }
      return values[price] || 0
    }

    // Store original count for safety check
    const originalCount = results.length

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.district?.toLowerCase().includes(query) ||
          r.emirate?.toLowerCase().includes(query)
      )
    }

    // Location filter
    if (location && location !== "all") {
      if (location === "international") {
        results = results.filter((r) => !r.emirate)
      } else {
        results = results.filter((r) => r.emirate === locationEmirateMap[location])
      }
    }

    // Multi-select filters with priority sorting (single-pass O(n))
    // Restaurants matching more selected options appear first
    if (selectedMeals.length > 0 || selectedCuisines.length > 0 || selectedAtmospheres.length > 0) {
      // Filter and count matches in a single pass
      results = results
        .map((restaurant) => ({
          restaurant,
          mealMatches: countMealMatches(restaurant),
          cuisineMatches: countCuisineMatches(restaurant),
          atmosphereMatches: countAtmosphereMatches(restaurant),
        }))
        .filter(({ mealMatches, cuisineMatches, atmosphereMatches }) => {
          // Restaurant must match at least one filter in each active category
          const hasMealMatch = selectedMeals.length === 0 || mealMatches > 0
          const hasCuisineMatch = selectedCuisines.length === 0 || cuisineMatches > 0
          const hasAtmosphereMatch = selectedAtmospheres.length === 0 || atmosphereMatches > 0
          const passes = hasMealMatch && hasCuisineMatch && hasAtmosphereMatch
          return passes
        })
        .sort((a, b) => {
          // Sort by total match count (priority: most matches first)
          const aTotal = a.mealMatches + a.cuisineMatches + a.atmosphereMatches
          const bTotal = b.mealMatches + b.cuisineMatches + b.atmosphereMatches
          return bTotal - aTotal
        })
        .map(({ restaurant }) => restaurant)
    }

    // Secondary sort (price, newest, distance)
    // ALWAYS copy before sort to prevent mutation (React immutability)
    switch (sort) {
      case "price-desc":
        results = [...results].sort(
          (a, b) => priceTierValue(b.price || "$") - priceTierValue(a.price || "$")
        )
        break
      case "price-asc":
        results = [...results].sort(
          (a, b) => priceTierValue(a.price || "$") - priceTierValue(b.price || "$")
        )
        break
      case "newest":
        results = [...results].sort((a, b) => {
          const aDate = a.addedDate ? new Date(a.addedDate).getTime() : 0
          const bDate = b.addedDate ? new Date(b.addedDate).getTime() : 0
          return bDate - aDate
        })
        break
      case "distance":
        // Distance sorting will be handled by maps integration
        break
      default:
        // Default: newest
        results = [...results].sort((a, b) => {
          const aDate = a.addedDate ? new Date(a.addedDate).getTime() : 0
          const bDate = b.addedDate ? new Date(b.addedDate).getTime() : 0
          return bDate - aDate
        })
        break
    }

    // SAFETY CHECK: If filters result in empty list but we have active filters,
    // return all restaurants to prevent empty state on load
    const hasActiveFilters =
      searchQuery !== "" ||
      location !== "all" ||
      selectedMeals.length > 0 ||
      selectedCuisines.length > 0 ||
      selectedAtmospheres.length > 0

    if (results.length === 0 && hasActiveFilters && originalCount > 0) {
      // Filters resulted in empty list - return all restaurants instead
      // Return sorted list of all restaurants without filters applied
      results = [...mockRestaurants]
      // Still apply the sort
      switch (sort) {
        case "price-desc":
          results = [...results].sort(
            (a, b) => priceTierValue(b.price || "$") - priceTierValue(a.price || "$")
          )
          break
        case "price-asc":
          results = [...results].sort(
            (a, b) => priceTierValue(a.price || "$") - priceTierValue(b.price || "$")
          )
          break
        case "newest":
          results = [...results].sort((a, b) => {
            const aDate = a.addedDate ? new Date(a.addedDate).getTime() : 0
            const bDate = b.addedDate ? new Date(b.addedDate).getTime() : 0
            return bDate - aDate
          })
          break
        case "distance":
          // Distance sorting will be handled by maps integration
          break
        default:
          // Default: newest
          results = [...results].sort((a, b) => {
            const aDate = a.addedDate ? new Date(a.addedDate).getTime() : 0
            const bDate = b.addedDate ? new Date(b.addedDate).getTime() : 0
            return bDate - aDate
          })
      }
    }

    return results
  }, [searchQuery, location, selectedMeals, selectedCuisines, selectedAtmospheres, sort])

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Multi-select filter handlers
  const handleMealToggle = useCallback((meal: MealOption) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    )
  }, [])

  const handleCuisineToggle = useCallback((cuisine: CuisineOption) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    )
  }, [])

  const handleAtmosphereToggle = useCallback((atmosphere: AtmosphereOption) => {
    setSelectedAtmospheres((prev) =>
      prev.includes(atmosphere) ? prev.filter((a) => a !== atmosphere) : [...prev, atmosphere]
    )
  }, [])

  const handleSortChange = useCallback((sortId: SortOptionId) => {
    setSort(sortId)
  }, [])

  const handleViewModeChange = useCallback((view: ViewMode) => {
    setViewMode(view)
  }, [])

  // Debounced URL update (smooth, no scroll jump)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      // Only add non-default params to URL (canonical URLs)
      if (searchQuery) params.set("query", searchQuery)
      if (location && location !== "all") params.set("location", location)
      if (selectedMeals.length > 0) params.set("meals", selectedMeals.join(","))
      if (selectedCuisines.length > 0) params.set("cuisines", selectedCuisines.join(","))
      if (selectedAtmospheres.length > 0) params.set("atmospheres", selectedAtmospheres.join(","))
      if (sort && sort !== "newest") params.set("sort", sort)
      if (viewMode && viewMode !== "grid-4") params.set("view", viewMode)

      const queryString = params.toString()
      router.replace(`/restaurants${queryString ? `?${queryString}` : ""}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [
    searchQuery,
    location,
    selectedMeals,
    selectedCuisines,
    selectedAtmospheres,
    sort,
    viewMode,
    router,
  ])

  // ─────────────────────────────────────────────────────────────────────────────
  // GRID COLUMNS BASED ON VIEW MODE & BREAKPOINT
  // ─────────────────────────────────────────────────────────────────────────────
  const columns = resolveViewMode(viewMode as ViewModeId, breakpoint)

  // Determine card variant based on view mode
  const cardVariant: "detailed" | "compact" | "list" = viewMode === "list" ? "list" : "detailed"

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS FOR INTERACTIVE FEATURES
  // ─────────────────────────────────────────────────────────────────────────────
  const handleFavoriteToggle = useCallback((restaurantId: string) => {
    console.log("Toggle favorite:", restaurantId)
    // TODO: Implement favorite toggle logic
  }, [])

  const handleShare = useCallback(() => {
    console.log("Share restaurant")
    // TODO: Implement share functionality
  }, [])

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main id="main-content" className="relative pt-0 pb-[var(--spacing-4xl)]">
        {/* Page Title - Centered */}
        <section className="w-full mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-3xl)] pb-[var(--spacing-sm)]">
          {/* Title */}
          <h1
            className="font-black tracking-tight text-center mb-[var(--spacing-md)] leading-[var(--line-height-display)]"
            style={{ fontSize: "clamp(1.25rem, 6vw, 5.5rem)" }}
          >
            <span className="whitespace-nowrap">
              {t("restaurantsPage.titleBefore")}{" "}
              <span className="text-[var(--color-primary)]">
                {t("restaurantsPage.titleHighlight")}
              </span>
              {t("restaurantsPage.titleAfter")}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-black tracking-tight text-center leading-[var(--line-height-display)] mb-[var(--spacing-xl)]"
            style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}
          >
            <span className="opacity-[var(--opacity-muted)]">
              {t("restaurantsPage.subtitleHandle")}
            </span>{" "}
            <span className="opacity-[var(--opacity-muted)]">
              {t("restaurantsPage.subtitleAsk")}
            </span>{" "}
            <span className="text-[var(--color-primary)]">
              {t("restaurantsPage.subtitleShadi")}
            </span>
          </p>
        </section>

        {/* Search Section */}
        <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
          <SearchContainer
            placeholder={t("restaurantsPage.searchPlaceholder")}
            resultCount={filteredRestaurants.length}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            location={location}
            selectedMeals={selectedMeals}
            onMealToggle={handleMealToggle}
            selectedCuisines={selectedCuisines}
            onCuisineToggle={handleCuisineToggle}
            selectedAtmospheres={selectedAtmospheres}
            onAtmosphereToggle={handleAtmosphereToggle}
            sort={sort}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showViewToggle={true}
          />
        </div>

        {/* Results Grid */}
        <div className="max-w-[var(--page-max-width)] mx-auto px-2 md:px-[var(--page-padding-x)] pt-[var(--spacing-lg)]">
          {filteredRestaurants.length > 0 ? (
            columns === "list" ? (
              <div className="flex flex-col gap-[var(--spacing-md)] md:gap-[var(--spacing-lg)] lg:gap-[var(--spacing-2xl)]">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    variant={cardVariant}
                    {...restaurant}
                    href={restaurant.slug ? `/restaurants/${restaurant.slug}` : undefined}
                    onFavoriteToggle={handleFavoriteToggle}
                    onShare={handleShare}
                  />
                ))}
              </div>
            ) : columns === null ? null : typeof columns === "number" ? (
              <CardGrid columns={columns}>
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    variant={cardVariant}
                    {...restaurant}
                    href={restaurant.slug ? `/restaurants/${restaurant.slug}` : undefined}
                    onFavoriteToggle={handleFavoriteToggle}
                    onShare={handleShare}
                  />
                ))}
              </CardGrid>
            ) : null
          ) : (
            <div className="text-center py-[var(--spacing-5xl)]">
              {/* Empty State Banner */}
              <div className="glass-card p-[var(--spacing-2xl)] rounded-[var(--radius-2xl)] mb-[var(--spacing-3xl)]">
                <p className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-sm)]">
                  {t("restaurantsPage.noResults")}
                </p>
                <p className="text-[var(--font-size-base)] text-[var(--fg-60)] mb-[var(--spacing-md)]">
                  {t("restaurantsPage.adjustFilters")}
                </p>
              </div>

              {/* Recommendations Section */}
              <div className="text-left">
                <h3 className="text-[var(--font-size-lg)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
                  You might like 💡
                </h3>
                <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-xl)]">
                  Top-rated restaurants matching your location
                </p>

                {/* Recommendation Cards - Show top 3 rated restaurants */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)]">
                  {mockRestaurants
                    .filter(
                      (r) =>
                        !location ||
                        location === "all" ||
                        r.emirate === locationEmirateMap[location]
                    )
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 3)
                    .map((restaurant) => (
                      <RestaurantCard
                        key={`rec-${restaurant.id}`}
                        variant="compact"
                        {...restaurant}
                        href={restaurant.slug ? `/restaurants/${restaurant.slug}` : undefined}
                        onFavoriteToggle={handleFavoriteToggle}
                        onShare={handleShare}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Loading skeleton component
function RestaurantsPageSkeleton() {
  return (
    <div className="min-h-[var(--layout-min-height)]">
      {/* Search container skeleton */}
      <div className="max-w-5xl mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-sm)] pb-[var(--spacing-md)]">
        <div className="space-y-[var(--spacing-md)]">
          {/* Search input skeleton */}
          <div className="h-[calc(var(--spacing-md)*3)] bg-[var(--fg-10)] rounded-[var(--radius-lg)] animate-pulse" />
          {/* Filters skeleton */}
          <div className="flex gap-[var(--spacing-sm)]">
            <div className="h-[calc(var(--spacing-md)*2.5)] w-[calc(var(--spacing-md)*6)] bg-[var(--fg-10)] rounded-full animate-pulse" />
            <div className="h-[calc(var(--spacing-md)*2.5)] w-[calc(var(--spacing-md)*6)] bg-[var(--fg-10)] rounded-full animate-pulse" />
            <div className="h-[calc(var(--spacing-md)*2.5)] w-[calc(var(--spacing-md)*6)] bg-[var(--fg-10)] rounded-full animate-pulse" />
            <div className="h-[calc(var(--spacing-md)*2.5)] w-[calc(var(--spacing-md)*6)] bg-[var(--fg-10)] rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Results grid skeleton */}
      <div className="max-w-5xl mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--spacing-md)] md:gap-[var(--spacing-md)] lg:gap-[calc(var(--spacing-md)*1.5)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items don't change order
              key={`skeleton-${i}`}
              className="bg-[var(--card-bg)] rounded-[var(--radius-xl)] overflow-hidden"
            >
              {/* Image skeleton */}
              <div className="aspect-[4/3] bg-[var(--fg-10)] animate-pulse" />
              {/* Content skeleton */}
              <div className="p-[var(--spacing-md)] space-y-[var(--spacing-sm)]">
                <div className="h-[var(--spacing-md)] bg-[var(--fg-10)] rounded-[var(--radius-md)] animate-pulse w-3/4" />
                <div className="h-[calc(var(--spacing-md)*0.75)] bg-[var(--fg-5)] rounded-[var(--radius-sm)] animate-pulse w-1/2" />
                <div className="flex gap-[var(--spacing-xs)]">
                  <div className="h-[var(--spacing-lg)] w-[calc(var(--spacing-md)*3)] bg-[var(--fg-5)] rounded-full animate-pulse" />
                  <div className="h-[var(--spacing-lg)] w-[calc(var(--spacing-md)*3)] bg-[var(--fg-5)] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<RestaurantsPageSkeleton />}>
      <RestaurantsPageClient />
    </Suspense>
  )
}
