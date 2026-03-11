/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA - Restaurant listings with BlurHash strings
   ═══════════════════════════════════════════════════════════════════════════════ */

import { getBlurHash } from "@/lib/images/precomputed-blurhash"
import type { ShadiRestaurant } from "@/types/restaurant"
import { mockRestaurants } from "./restaurants"

// Extended type with blurHash
export type ShadiRestaurantWithBlurHash = ShadiRestaurant & {
  blurHash?: string
}

// Add blurHash to each restaurant
export const mockRestaurantsWithBlurHash: ShadiRestaurantWithBlurHash[] = mockRestaurants.map(
  (restaurant) => ({
    ...restaurant,
    blurHash: getBlurHash(restaurant.image),
  })
)
