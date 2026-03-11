/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER HELPERS - Shared utilities for restaurant filtering
   Reusable functions for multi-select filter logic and sorting
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { AtmosphereOption, CuisineOption, MealOption } from "@/components/filters/filterData"
import type { ShadiRestaurant } from "@/types/restaurant"

/* ─────────────────────────────────────────────────────────────────────────
   TEXT NORMALIZATION - Standardizes terms for matching
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Normalize filter terms for case-insensitive, hyphen-tolerant matching
 * Converts to lowercase and replaces hyphens with spaces
 */
export function normalizeFilterTerm(term: string): string {
  return term.toLowerCase().replace(/-/g, " ")
}

/* ─────────────────────────────────────────────────────────────────────────
   MATCH COUNTERS - Count how many selected options match a restaurant
   Used for priority sorting (more matches = higher rank)
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Count how many selected meal options match a restaurant's badges
 */
export function countMealMatches(restaurant: ShadiRestaurant, selectedMeals: MealOption[]): number {
  if (selectedMeals.length === 0) return 0
  return selectedMeals.filter((meal) =>
    restaurant.shadiBadges?.some((badge) => badge.toLowerCase().includes(normalizeFilterTerm(meal)))
  ).length
}

/**
 * Count how many selected cuisine options match a restaurant
 * Matches against cuisine field and restaurant name
 */
export function countCuisineMatches(
  restaurant: ShadiRestaurant,
  selectedCuisines: CuisineOption[]
): number {
  if (selectedCuisines.length === 0) return 0
  return selectedCuisines.filter(
    (cuisine) =>
      restaurant.cuisine.toLowerCase().includes(normalizeFilterTerm(cuisine)) ||
      restaurant.name.toLowerCase().includes(normalizeFilterTerm(cuisine))
  ).length
}

/**
 * Count how many selected atmosphere options match a restaurant
 * Matches against badges and features
 */
export function countAtmosphereMatches(
  restaurant: ShadiRestaurant,
  selectedAtmospheres: AtmosphereOption[]
): number {
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

/**
 * Count total matches across all active filter categories
 * Returns sum of meal + cuisine + atmosphere matches
 */
export function countTotalMatches(
  restaurant: ShadiRestaurant,
  selectedMeals: MealOption[],
  selectedCuisines: CuisineOption[],
  selectedAtmospheres: AtmosphereOption[]
): number {
  return (
    countMealMatches(restaurant, selectedMeals) +
    countCuisineMatches(restaurant, selectedCuisines) +
    countAtmosphereMatches(restaurant, selectedAtmospheres)
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   FILTER VALIDATION - Check if restaurant matches active filters
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Check if a restaurant matches at least one option in each active filter category
 * Restaurant must match ALL active categories to pass the filter
 */
export function matchesAllFilters(
  restaurant: ShadiRestaurant,
  selectedMeals: MealOption[],
  selectedCuisines: CuisineOption[],
  selectedAtmospheres: AtmosphereOption[]
): boolean {
  const hasMealFilter = selectedMeals.length > 0
  const hasCuisineFilter = selectedCuisines.length > 0
  const hasAtmosphereFilter = selectedAtmospheres.length > 0

  // Must match at least one option in each active category
  if (hasMealFilter && countMealMatches(restaurant, selectedMeals) === 0) {
    return false
  }
  if (hasCuisineFilter && countCuisineMatches(restaurant, selectedCuisines) === 0) {
    return false
  }
  if (hasAtmosphereFilter && countAtmosphereMatches(restaurant, selectedAtmospheres) === 0) {
    return false
  }

  return true
}

/* ─────────────────────────────────────────────────────────────────────────
   SORTING HELPERS - Convert price tiers to numeric values for sorting
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Convert price tier symbol to numeric value for sorting
 * $: 1, $$: 2, $$$: 3, $$$$: 4
 */
export function priceTierValue(price: string | undefined): number {
  const values: Record<string, number> = { $: 1, $$: 2, $$$: 3, $$$$: 4 }
  return values[price || "$"] || 0
}
