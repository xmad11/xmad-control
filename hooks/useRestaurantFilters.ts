/* ═══════════════════════════════════════════════════════════════════════════════
   USE RESTAURANT FILTERS - Centralized filtering logic with distance support
   SSOT-compliant: All filtering logic lives here, NOT in UI components
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { type Coordinate, calculateDistance, formatDistance } from "@/lib/maps"
import type { ShadiRestaurant } from "@/types/restaurant"
import { useMemo } from "react"

export interface FilterOptions {
  // Search
  searchQuery?: string

  // Location filter
  location?: "all" | "near-me"
  userLocation?: Coordinate

  // Distance range (in km)
  maxDistance?: number

  // Cuisine
  cuisines?: string[]

  // Atmosphere
  atmospheres?: string[]

  // Meal type
  meals?: string[]

  // Price
  prices?: string[]

  // Sort
  sortBy?: "newest" | "rating" | "distance"
}

export interface FilteredResult {
  restaurants: ShadiRestaurant[]
  distances: Map<string, string>
}

/**
 * Centralized hook for filtering restaurants
 * All business logic for filtering lives here - NOT in UI components
 *
 * Source: MAPS_INTEGRATION.md - "Filtering logic MUST be in hooks/useRestaurantFilters.ts"
 */
export function useRestaurantFilters(
  restaurants: ShadiRestaurant[],
  filters: FilterOptions
): FilteredResult {
  const {
    searchQuery,
    location,
    userLocation,
    maxDistance = 10, // Default 10km radius
    cuisines = [],
    atmospheres = [],
    meals = [],
    prices = [],
    sortBy = "newest",
  } = filters

  const result = useMemo(() => {
    let filtered = [...restaurants]

    // 1. Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.district?.toLowerCase().includes(query)
      )
    }

    // 2. Location-based filtering
    const distancesMap = new Map<string, string>()

    if (location === "near-me" && userLocation) {
      // Filter by distance from user
      filtered = filtered.filter((restaurant) => {
        if (!restaurant.mapCoordinates) return false

        const [lng, lat] = [restaurant.mapCoordinates.lng, restaurant.mapCoordinates.lat]
        const distance = calculateDistance(userLocation, [lng, lat])

        if (distance <= maxDistance) {
          distancesMap.set(restaurant.id, formatDistance(distance))
          return true
        }

        return false
      })
    }

    // 3. Cuisine filter
    if (cuisines.length > 0) {
      filtered = filtered.filter((r) => cuisines.includes(r.cuisine))
    }

    // 4. Atmosphere filter
    if (atmospheres.length > 0) {
      filtered = filtered.filter((r) => atmospheres.some((a) => r.themeCategories?.includes(a)))
    }

    // 5. Meal type filter
    if (meals.length > 0) {
      filtered = filtered.filter((r) => meals.some((m) => r.features?.includes(m)))
    }

    // 6. Price filter
    if (prices.length > 0) {
      filtered = filtered.filter((r) => prices.includes(r.price))
    }

    // 7. Sorting
    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "distance" && location === "near-me" && userLocation) {
      filtered.sort((a, b) => {
        const distA = a.mapCoordinates
          ? calculateDistance(userLocation, [a.mapCoordinates.lng, a.mapCoordinates.lat])
          : Number.POSITIVE_INFINITY
        const distB = b.mapCoordinates
          ? calculateDistance(userLocation, [b.mapCoordinates.lng, b.mapCoordinates.lat])
          : Number.POSITIVE_INFINITY
        return distA - distB
      })
    }
    // "newest" is default order (already sorted by date in data)

    return {
      restaurants: filtered,
      distances: distancesMap,
    }
  }, [
    restaurants,
    searchQuery,
    location,
    userLocation,
    maxDistance,
    cuisines,
    atmospheres,
    meals,
    prices,
    sortBy,
  ])

  return result
}
