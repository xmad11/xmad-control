/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT TYPES - Database Schema Matched
   Aligned with Supabase shadi_restaurants table structure
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * UAE Emirates for location filtering
 */
export type UAEEmirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Umm Al Quwain"
  | "Ras Al Khaimah"
  | "Fujairah"

/**
 * Shadi's official badges (database enum)
 * Extended with string for flexibility
 */
export type ShadiBadge =
  | "Shadi's Pick"
  | "New on Shadi.AE"
  | "Deal Available"
  | "High Rating"
  | "Kids Friendly"
  | "Romantic"
  | "Iconic"
  | "Buffet"
  | "Hotel Restaurant"
  | "Family Style"
  | "Heritage"
  | "Traditional"
  | "Outdoor"
  | string // Allow custom badges

/**
 * Price tier levels (database enum)
 */
export type PriceTier = "$" | "$$" | "$$$" | "$$$$"

/**
 * Price display labels
 */
export const PRICE_LABELS: Record<PriceTier, string> = {
  $: "Budget-friendly",
  $$: "Moderate",
  $$$: "Expensive",
  $$$$: "Very Expensive",
}

/**
 * Theme categories for filtering
 * Extended with string for flexibility
 */
export type ThemeCategory =
  | "Breakfast"
  | "Brunch"
  | "Seafood"
  | "Meat Lovers"
  | "Romantic"
  | "Kids-Friendly"
  | "Iconic"
  | "Traditional"
  | "Buffet"
  | "Vegetarian"
  | "Vegan"
  | "Hotel"
  | "Outdoor"
  | "Fine Dining"
  | "Casual"
  | "Bakery"
  | "Family Style"
  | string // Allow custom categories

/**
 * Delivery platform options
 */
export type DeliveryPlatform = "Talabat" | "Noon" | "Careem" | "Zomato" | "Deliveroo" | "Uber Eats"

/**
 * Operating hours structure
 */
export interface OperatingHours {
  [key: string]: string // "Monday": "10:00-22:00"
}

/**
 * Map coordinates
 */
export interface MapCoordinates {
  lat: number
  lng: number
}

/**
 * Restaurant location details
 */
export interface RestaurantLocation {
  emirate?: UAEEmirate
  district?: string
  address?: string
  distance?: string // Calculated distance, e.g., "2.5 km"
  mapCoordinates?: MapCoordinates
}

/**
 * Complete Restaurant Data (Database Matched)
 * This interface matches the Supabase shadi_restaurants table
 */
export interface ShadiRestaurant {
  // Identity
  id: string
  slug: string
  name: string

  // Images
  image: string // Primary/cover image
  images: string[] // All images
  fallbackImage?: string // Backup when images fail

  // Rating & Favorites
  rating: number
  isFavorite?: boolean

  // Price
  price: PriceTier // "$", "$$", "$$$", "$$$$"

  // Cuisine/Category
  cuisine: string
  description?: string

  // Location
  distance?: string
  emirate?: UAEEmirate
  district?: string
  address?: string
  mapCoordinates?: MapCoordinates

  // Features & Badges
  features?: string[] // "Outdoor Seating", "Parking", "WiFi", etc.
  themeCategories?: ThemeCategory[]
  deliveryPlatforms?: DeliveryPlatform[]
  shadiBadges?: ShadiBadge[]

  // Additional Info
  operatingHours?: OperatingHours
  isHotelRestaurant?: boolean
  hasDelivery?: boolean
  addedDate?: string
  phone?: string
  website?: string
  instagram?: string
  facebook?: string
  tiktok?: string
}

/**
 * Restaurant Card Props
 * Extends ShadiRestaurant with UI-only props
 */
export interface RestaurantCardProps extends ShadiRestaurant {
  // UI-only props
  href?: string
  variant?: "image" | "compact" | "detailed" | "list"
  onFavoriteToggle?: (id: string) => void
  showTitle?: boolean | "hover" | "always"
  showRating?: boolean
  showFavorite?: boolean
  showCarousel?: boolean
}

/**
 * Map legacy location to structured location
 */
export function toRestaurantLocation(
  emirate?: UAEEmirate,
  district?: string,
  address?: string,
  distance?: string,
  mapCoordinates?: MapCoordinates
): RestaurantLocation | undefined {
  if (!emirate && !district && !address && !distance && !mapCoordinates) {
    return undefined
  }
  return {
    emirate,
    district,
    address,
    distance,
    mapCoordinates,
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: PriceTier): string {
  return PRICE_LABELS[price] || price
}

/**
 * Get price tier as number for sorting
 */
export function priceTierValue(price: PriceTier): number {
  return { $: 1, $$: 2, $$$: 3, $$$$: 4 }[price] || 0
}
