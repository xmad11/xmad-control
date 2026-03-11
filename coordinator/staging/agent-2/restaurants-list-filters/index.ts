/**
 * Restaurants List Filters - Index
 *
 * Centralized exports for the restaurants list filter functionality.
 * All components use design tokens exclusively - NO hardcoded values.
 * Proper TypeScript - NO `any` types.
 */

// Main page component
export { default as RestaurantsPage } from "./RestaurantsPage"

// Filter components
export { FilterBar } from "./FilterBar"
export { default as FilterDropdown } from "./FilterDropdown"
export { default as SortDropdown } from "./SortDropdown"
export { default as EmptyState } from "./EmptyState"
export { default as LoadMore } from "./LoadMore"

// Hooks
export { default as useRestaurantFilters } from "./useRestaurantFilters"

// Types
export type {
  Emirate,
  Cuisine,
  PriceRange,
  SortOption,
  FeatureFilters,
  RestaurantFilters,
  RestaurantSort,
  FilterOption,
  ActiveFilter,
  FilterSearchParams,
} from "./types"

export type { FilterDropdownProps } from "./FilterDropdown"
export type { SortDropdownProps } from "./SortDropdown"
export type { FilterBarProps } from "./FilterBar"
export type { EmptyStateProps } from "./EmptyState"
export type { LoadMoreProps } from "./LoadMore"
export type {
  UseRestaurantFiltersOptions,
  UseRestaurantFiltersReturn,
} from "./useRestaurantFilters"
