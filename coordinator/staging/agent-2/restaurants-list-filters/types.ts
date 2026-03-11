/**
 * Restaurants Filter Types
 *
 * All types for restaurant filtering and sorting.
 * No `any`, `undefined`, or `never` types.
 */

/**
 * Available Emirates for filtering
 */
export type Emirate =
  | "all"
  | "dubai"
  | "abu-dhabi"
  | "sharjah"
  | "ajman"
  | "umm-al-quwain"
  | "ras-al-khaimah"
  | "fujairah"

/**
 * Available cuisine types
 */
export type Cuisine =
  | "all"
  | "italian"
  | "japanese"
  | "chinese"
  | "indian"
  | "arabic"
  | "lebanese"
  | "emirati"
  | "mediterranean"
  | "thai"
  | "mexican"
  | "american"
  | "french"
  | "korean"
  | "filipino"
  | "pakistani"
  | "iranian"
  | "grill"
  | "seafood"
  | "vegetarian"
  | "cafe"
  | "bakery"
  | "desserts"

/**
 * Price range filter
 */
export type PriceRange = "all" | "$" | "$$" | "$$$" | "$$$$"

/**
 * Sort options
 */
export type SortOption =
  | "relevance"
  | "rating"
  | "newest"
  | "popularity"
  | "price-low"
  | "price-high"

/**
 * Feature filters (amenities, tags, etc.)
 */
export interface FeatureFilters {
  familyFriendly: boolean
  outdoorSeating: boolean
  valetParking: boolean
  delivery: boolean
  takeaway: boolean
  alcoholServed: boolean
  liveMusic: boolean
  privateDining: boolean
}

/**
 * Complete filter state
 */
export interface RestaurantFilters {
  /** Selected emirate */
  emirate: Emirate
  /** Selected cuisine */
  cuisine: Cuisine
  /** Price range filter */
  priceRange: PriceRange
  /** Minimum rating filter */
  minRating: number
  /** Feature filters */
  features: FeatureFilters
  /** Search query */
  searchQuery: string
}

/**
 * Sort state
 */
export interface RestaurantSort {
  /** Sort option */
  option: SortOption
  /** Sort direction */
  direction: "asc" | "desc"
}

/**
 * Filter display label
 */
export interface FilterOption {
  value: string
  label: string
  count?: number
}

/**
 * Active filter badge for display
 */
export interface ActiveFilter {
  key: keyof RestaurantFilters | "features"
  label: string
  value: string
  onRemove: () => void
}

/**
 * URL search params structure
 */
export interface FilterSearchParams {
  emirate?: string
  cuisine?: string
  price?: string
  rating?: string
  sort?: string
  q?: string
  features?: string
}
