/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT TYPES - Central type definitions for restaurant domain
   ═══════════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════════

export type UAEEmirate =
  | "abu_dhabi"
  | "dubai"
  | "sharjah"
  | "ajman"
  | "umm_al_quwain"
  | "ras_al_khaimah"
  | "fujairah"

export type PriceTier = "$" | "$$" | "$$$" | "$$$$"

export type ThemeCategory =
  | "arabic"
  | "indian"
  | "pakistani"
  | "lebanese"
  | "persian"
  | "turkish"
  | "italian"
  | "chinese"
  | "japanese"
  | "thai"
  | "mexican"
  | "french"
  | "seafood"
  | "steakhouse"
  | "cafe"
  | "bakery"
  | "dessert"
  | "fusion"
  | "international"

export type DeliveryPlatform = "talabat" | "careem" | "noon" | "deliveroo" | "ubereats"

// ═══════════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShadiBadge {
  id: string
  label: string
  icon?: string
  color?: string
}

export interface MapCoordinates {
  lat: number
  lng: number
}

export interface OperatingHours {
  open: string
  close: string
  days?: string[]
}

export interface RestaurantLocation {
  emirate: UAEEmirate
  district: string
  address?: string
  coordinates?: MapCoordinates
}

export interface ShadiRestaurant {
  id: string
  slug: string
  name: string
  description?: string
  image: string
  images: string[]
  rating: number
  reviewCount?: number
  price: string
  priceTier?: PriceTier | string // Allow string for flexibility
  theme?: ThemeCategory
  cuisine?: string // Alias for theme
  location: RestaurantLocation
  emirate: UAEEmirate
  district: string
  address?: string // Direct address access
  distance?: string // Distance from user
  mapCoordinates?: MapCoordinates // Direct coordinates access
  features?: string[] // Restaurant features/amenities
  shadiBadges?: (string | ShadiBadge)[] // Allow both string and object
  badges?: (string | ShadiBadge)[] // Allow both string and object
  deliveryPlatforms?: DeliveryPlatform[]
  operatingHours?: OperatingHours
  phone?: string
  website?: string
  featured?: boolean
  verified?: boolean
  isFavorite?: boolean
}

export interface RestaurantCardProps {
  restaurant: ShadiRestaurant
  variant?: "image" | "compact" | "detailed" | "list"
  className?: string
  onClick?: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PRICE_LABELS: Record<PriceTier, string> = {
  $: "Budget-friendly",
  $$: "Moderate",
  $$$: "Premium",
  $$$$: "Luxury",
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatPrice(price: string | number): string {
  if (typeof price === "number") {
    if (price < 50) return "$"
    if (price < 100) return "$$"
    if (price < 200) return "$$$"
    return "$$$$"
  }
  return price
}

export function priceTierValue(tier: PriceTier): number {
  const values: Record<PriceTier, number> = {
    $: 1,
    $$: 2,
    $$$: 3,
    $$$$: 4,
  }
  return values[tier] ?? 2
}

export function toRestaurantLocation(
  emirate: UAEEmirate,
  district: string,
  address?: string,
  coordinates?: MapCoordinates
): RestaurantLocation {
  return {
    emirate,
    district,
    address,
    coordinates,
  }
}
