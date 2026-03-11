/**
 * useRestaurantFilters Hook
 *
 * Manages filter state with URL synchronization.
 * Uses design tokens exclusively.
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type {
  Cuisine,
  Emirate,
  FilterSearchParams,
  PriceRange,
  RestaurantFilters,
  SortOption,
} from "./types"

const DEFAULT_FILTERS: RestaurantFilters = {
  emirate: "all",
  cuisine: "all",
  priceRange: "all",
  minRating: 0,
  features: {
    familyFriendly: false,
    outdoorSeating: false,
    valetParking: false,
    delivery: false,
    takeaway: false,
    alcoholServed: false,
    liveMusic: false,
    privateDining: false,
  },
  searchQuery: "",
}

const DEFAULT_SORT: SortOption = "relevance"

export interface UseRestaurantFiltersOptions {
  /** Initial filters (overrides URL params if provided) */
  initialFilters?: Partial<RestaurantFilters>
  /** Initial sort */
  initialSort?: SortOption
  /** Base URL for navigation */
  basePath?: string
}

export interface UseRestaurantFiltersReturn {
  /** Current filter state */
  filters: RestaurantFilters
  /** Current sort option */
  sort: SortOption
  /** Update filters */
  setFilters: (filters: Partial<RestaurantFilters>) => void
  /** Update sort */
  setSort: (sort: SortOption) => void
  /** Reset all filters */
  resetFilters: () => void
  /** Get active filter count */
  getActiveFilterCount: () => number
}

/**
 * Convert filters to URL search params
 */
function filtersToSearchParams(filters: RestaurantFilters, sort: SortOption): FilterSearchParams {
  const params: FilterSearchParams = {}

  if (filters.emirate !== "all") params.emirate = filters.emirate
  if (filters.cuisine !== "all") params.cuisine = filters.cuisine
  if (filters.priceRange !== "all") params.price = filters.priceRange
  if (filters.minRating > 0) params.rating = filters.minRating.toString()
  if (filters.searchQuery) params.q = filters.searchQuery
  if (sort !== "relevance") params.sort = sort

  return params
}

/**
 * Convert URL search params to filters
 */
function searchParamsToFilters(searchParams: URLSearchParams): {
  filters: Partial<RestaurantFilters>
  sort: SortOption
} {
  const filters: Partial<RestaurantFilters> = {}
  let sort: SortOption = DEFAULT_SORT

  const emirate = searchParams.get("emirate")
  if (emirate) filters.emirate = emirate as Emirate

  const cuisine = searchParams.get("cuisine")
  if (cuisine) filters.cuisine = cuisine as Cuisine

  const price = searchParams.get("price")
  if (price) filters.priceRange = price as PriceRange

  const rating = searchParams.get("rating")
  if (rating) filters.minRating = Number.parseFloat(rating)

  const searchQuery = searchParams.get("q")
  if (searchQuery) filters.searchQuery = searchQuery

  const sortParam = searchParams.get("sort")
  if (sortParam) sort = sortParam as SortOption

  return { filters, sort }
}

/**
 * Restaurant Filters Hook
 *
 * @example
 * const { filters, sort, setFilters, setSort, resetFilters } = useRestaurantFilters()
 */
export function useRestaurantFilters({
  initialFilters,
  initialSort = DEFAULT_SORT,
  basePath = "/restaurants",
}: UseRestaurantFiltersOptions = {}): UseRestaurantFiltersReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL or defaults
  const [filters, setFiltersState] = useState<RestaurantFilters>(() => {
    const urlFilters = searchParamsToFilters(searchParams).filters
    return { ...DEFAULT_FILTERS, ...urlFilters, ...initialFilters }
  })

  const [sort, setSortState] = useState<SortOption>(() => {
    const urlSort = searchParamsToFilters(searchParams).sort
    return initialSort !== DEFAULT_SORT ? initialSort : urlSort
  })

  // Update URL when filters change
  useEffect(() => {
    const params = filtersToSearchParams(filters, sort)
    const queryString = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value
          return acc
        },
        {} as Record<string, string>
      )
    ).toString()

    const url = queryString ? `${basePath}?${queryString}` : basePath
    router.replace(url, { scroll: false })
  }, [filters, sort, basePath, router])

  // Update filters
  const setFilters = useCallback((newFilters: Partial<RestaurantFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Update sort
  const setSort = useCallback((newSort: SortOption) => {
    setSortState(newSort)
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
    setSortState(DEFAULT_SORT)
  }, [])

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0
    if (filters.emirate !== "all") count++
    if (filters.cuisine !== "all") count++
    if (filters.priceRange !== "all") count++
    if (filters.minRating > 0) count++
    if (filters.searchQuery) count++
    return count
  }, [filters])

  return {
    filters,
    sort,
    setFilters,
    setSort,
    resetFilters,
    getActiveFilterCount,
  }
}

export default useRestaurantFilters
