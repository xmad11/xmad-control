/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER DATA - Single Source of Truth (SSOT) for all filter options
   Updated for 2026 with unified color coding and cleaned options
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════
   MEAL FILTER - Red color (#ef4444)
   7 options: breakfast, lunch, dinner, brunch, buffet, desserts, coffee/juice
   ═══════════════════════════════════════════════════════════════════════════════ */
export type MealOption =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "brunch"
  | "buffet"
  | "desserts"
  | "coffee-juice"

export const MEAL_OPTIONS: { id: MealOption; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "brunch", label: "Brunch" },
  { id: "buffet", label: "Buffet" },
  { id: "desserts", label: "Desserts" },
  { id: "coffee-juice", label: "Coffee & Juice" },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   CUISINE FILTER - Green color (#22c55e)
   Organized in 5 categories
   ═══════════════════════════════════════════════════════════════════════════════ */
export type CuisineOption =
  | "shawarma"
  | "burger"
  | "pizza"
  | "falafel"
  | "steak"
  | "bbq"
  | "taco"
  | "emirati"
  | "lebanese"
  | "turkish"
  | "syrian"
  | "jordanian"
  | "persian"
  | "indian"
  | "pakistani"
  | "chinese"
  | "japanese"
  | "thai"
  | "korean"
  | "italian"
  | "french"
  | "spanish"
  | "greek"
  | "mexican"
  | "american"
  | "cafe"
  | "bakery"
  | "desserts"
  | "juices"
  | "ice-cream"

export type CuisineCategoryId = "famous" | "arabic" | "asian" | "international" | "cafe"

export interface CuisineCategory {
  id: CuisineCategoryId
  label: string
  subcategories: CuisineOption[]
}

export const CUISINE_CATEGORIES: CuisineCategory[] = [
  {
    id: "famous",
    label: "Famous Foods",
    subcategories: ["shawarma", "burger", "pizza", "falafel", "steak", "bbq", "taco"],
  },
  {
    id: "arabic",
    label: "Arabic",
    subcategories: ["emirati", "lebanese", "turkish", "syrian", "jordanian", "persian"],
  },
  {
    id: "asian",
    label: "Asian",
    subcategories: ["indian", "pakistani", "chinese", "japanese", "thai", "korean"],
  },
  {
    id: "international",
    label: "International",
    subcategories: ["italian", "french", "spanish", "greek", "mexican", "american"],
  },
  {
    id: "cafe",
    label: "Cafe & Desserts",
    subcategories: ["cafe", "bakery", "desserts", "juices", "ice-cream"],
  },
]

// Flat list for backward compatibility
export const CUISINE_OPTIONS: { id: CuisineOption; label: string }[] = [
  { id: "shawarma", label: "Shawarma" },
  { id: "burger", label: "Burger" },
  { id: "pizza", label: "Pizza" },
  { id: "falafel", label: "Falafel" },
  { id: "steak", label: "Steak" },
  { id: "bbq", label: "BBQ" },
  { id: "taco", label: "Taco" },
  { id: "emirati", label: "Emirati" },
  { id: "lebanese", label: "Lebanese" },
  { id: "turkish", label: "Turkish" },
  { id: "syrian", label: "Syrian" },
  { id: "jordanian", label: "Jordanian" },
  { id: "persian", label: "Persian / Iranian" },
  { id: "indian", label: "Indian" },
  { id: "pakistani", label: "Pakistani" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "thai", label: "Thai" },
  { id: "korean", label: "Korean" },
  { id: "italian", label: "Italian" },
  { id: "french", label: "French" },
  { id: "spanish", label: "Spanish" },
  { id: "greek", label: "Greek" },
  { id: "mexican", label: "Mexican" },
  { id: "american", label: "American" },
  { id: "cafe", label: "Cafe" },
  { id: "bakery", label: "Bakery" },
  { id: "desserts", label: "Desserts" },
  { id: "juices", label: "Juices & Smoothies" },
  { id: "ice-cream", label: "Ice Cream" },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   ATMOSPHERE FILTER - Blue color (#3b82f6)
   16 options (removed "nightlife" and other inappropriate items)
   ═══════════════════════════════════════════════════════════════════════════════ */
export type AtmosphereOption =
  | "romantic"
  | "iconic"
  | "family-friendly"
  | "casual"
  | "fine-dining"
  | "budget-friendly"
  | "trendy"
  | "traditional"
  | "hidden-gem"
  | "outdoor"
  | "business"
  | "kids-friendly"
  | "outdoor-seating"
  | "late-night"
  | "brunch"
  | "pet-friendly"

export const ATMOSPHERE_OPTIONS: { id: AtmosphereOption; label: string }[] = [
  { id: "romantic", label: "Romantic" },
  { id: "iconic", label: "Iconic" },
  { id: "family-friendly", label: "Family Friendly" },
  { id: "casual", label: "Casual" },
  { id: "fine-dining", label: "Fine Dining" },
  { id: "budget-friendly", label: "Budget Friendly" },
  { id: "trendy", label: "Trendy" },
  { id: "traditional", label: "Traditional" },
  { id: "hidden-gem", label: "Hidden Gem" },
  { id: "outdoor", label: "Outdoor" },
  { id: "business", label: "Business Dining" },
  { id: "kids-friendly", label: "Kids Friendly" },
  { id: "outdoor-seating", label: "Outdoor Seating" },
  { id: "late-night", label: "Late Night" },
  { id: "brunch", label: "Brunch Spot" },
  { id: "pet-friendly", label: "Pet Friendly" },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   LOCATION FILTER - Purple color (#8b5cf6)
   Domain types separated from UI state
   ═══════════════════════════════════════════════════════════════════════════════ */

// Domain types - actual locations from restaurant data
export type EmirateLocation =
  | "abu-dhabi"
  | "dubai"
  | "sharjah"
  | "ajman"
  | "umm-al-quwain"
  | "ras-al-khaimah"
  | "fujairah"

// Domain locations that can appear in restaurant data
export type DomainLocation = EmirateLocation | "international"

// UI state - includes sentinel values for filter selector
export type LocationFilter = DomainLocation | "all" | "near-me"

// Legacy alias for backward compatibility
export type LocationOption = LocationFilter

export const LOCATION_OPTIONS: { id: LocationFilter; label: string }[] = [
  { id: "all", label: "All Locations" },
  { id: "near-me", label: "Near Me" },
  { id: "abu-dhabi", label: "Abu Dhabi" },
  { id: "dubai", label: "Dubai" },
  { id: "sharjah", label: "Sharjah" },
  { id: "ajman", label: "Ajman" },
  { id: "umm-al-quwain", label: "Umm Al Quwain" },
  { id: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { id: "fujairah", label: "Fujairah" },
  { id: "international", label: "International" },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   SHADI RATE FILTER - DISABLED (kept for future use)
   ═══════════════════════════════════════════════════════════════════════════════ */
export type ShadiRateOption = "shadi-pick" | "high-rated" | "rated-4-plus" | "rated-3-plus" | "all"

/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER COLOR CODING - Unified across all components
   ═══════════════════════════════════════════════════════════════════════════════ */
export type FilterKey = "meal" | "cuisine" | "atmosphere" | "location"

export const FILTER_COLORS = {
  meal: "var(--filter-badge-meal)" /* Red */,
  cuisine: "var(--filter-badge-cuisine)" /* Green */,
  atmosphere: "var(--filter-badge-atmosphere)" /* Blue */,
  location: "var(--filter-badge-location)" /* Purple */,
} as const

export const FILTER_CONFIG = {
  meal: { label: "Meal", color: FILTER_COLORS.meal },
  cuisine: { label: "Cuisine", color: FILTER_COLORS.cuisine },
  atmosphere: { label: "Atmosphere", color: FILTER_COLORS.atmosphere },
  location: { label: "Location", color: FILTER_COLORS.location },
} as const
