/* ═══════════════════════════════════════════════════════════════════════════════
   MARQUEE DATA - Restaurant data for hero section marquees
   Derived from mockRestaurants with BlurHash for Phase 1 performance
   ═══════════════════════════════════════════════════════════════════════════════ */

import { type ShadiBadge, type ShadiRestaurant, mockRestaurants } from "@/__mock__/restaurants"
import { getBlurHash } from "@/lib/images/precomputed-blurhash"

export interface MarqueeItem {
  id: string
  slug: string
  name: string // Changed from title to match database
  images: string[]
  rating: number
  price: string // Changed from priceMin/priceMax to single price string
  location: string // District, Emirate combined
  shadiBadges?: (string | ShadiBadge)[] // Optional badges (string or object)
  blurHash?: string // Phase 1: BlurHash for instant placeholder
}

/**
 * MARQUEE_ITEMS - First 12 restaurants for hero marquee (row 1)
 * Used by both desktop (3D vertical) and mobile (horizontal) marquees
 * Phase 1: Includes BlurHash for ultra-fast perceived load
 */
export const MARQUEE_ITEMS: MarqueeItem[] = mockRestaurants
  .slice(0, 12)
  .map((r: ShadiRestaurant) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    images: r.images,
    rating: r.rating,
    price: r.price,
    location: [r.district, r.emirate].filter(Boolean).join(", "),
    shadiBadges: r.shadiBadges ?? [],
    blurHash: getBlurHash(r.image), // Phase 1: Add BlurHash for instant preview
  }))

/**
 * MARQUEE_ITEMS_2 - Next 13 restaurants for second marquee row (scrolls opposite direction)
 * Phase 1: Includes BlurHash for ultra-fast perceived load
 */
export const MARQUEE_ITEMS_2: MarqueeItem[] = mockRestaurants
  .slice(12, 25)
  .map((r: ShadiRestaurant) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    images: r.images,
    rating: r.rating,
    price: r.price,
    location: [r.district, r.emirate].filter(Boolean).join(", "),
    shadiBadges: r.shadiBadges ?? [],
    blurHash: getBlurHash(r.image),
  }))
