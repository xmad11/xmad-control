/* ═══════════════════════════════════════════════════════════════════════════════
   CARD SYSTEM - Unified card architecture
   2 types × 4 variants = 8 possible cards from 3 components
   ═══════════════════════════════════════════════════════════════════════════════ */

// Base
export { BaseCard } from "./BaseCard"
export type { BaseCardProps, CardVariant, CardType } from "./BaseCard"

// Semantic cards (use these)
export { RestaurantCard } from "./RestaurantCard"

// Re-export restaurant types from central types file
export type {
  ShadiRestaurant,
  RestaurantCardProps,
  UAEEmirate,
  ShadiBadge,
  PriceTier,
  ThemeCategory,
  DeliveryPlatform,
  OperatingHours,
  MapCoordinates,
  RestaurantLocation,
} from "@/types/restaurant"

export { PRICE_LABELS, formatPrice, priceTierValue, toRestaurantLocation } from "@/types/restaurant"

export { BlogCard } from "./BlogCard"
export type { BlogCardProps, BlogCardData } from "./BlogCard"

// Variants (pure UI components)
export * from "./variants"

// Legacy (deprecated - will be removed)
export { Card } from "./Card"
export type { BaseCardProps as LegacyCardProps } from "./Card"
export { CardContent } from "./CardContent"
export type { CardContentProps } from "./CardContent"
export type {
  CardVariant as LegacyCardVariant,
  CardDensity,
  CardType as LegacyCardType,
} from "./legacy-variants"

// CardMedia (carousel)
export { CardMedia } from "./CardMedia"
export type { CardMediaProps } from "./CardMedia"
