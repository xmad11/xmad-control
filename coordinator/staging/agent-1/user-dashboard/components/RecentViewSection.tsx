/* ═══════════════════════════════════════════════════════════════════════════════
   RECENT VIEW SECTION - Recently viewed restaurants
   Compact list with quick actions
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { RestaurantCard } from "@/components/card"
import { ClockIcon } from "@/components/icons"
import { memo } from "react"

/**
 * Recent View Section - Recently viewed restaurants
 *
 * Features:
 * - Shows up to 4 recently viewed restaurants
 * - Compact card variant for dense display
 * - View all link
 */
export function RecentViewSection() {
  // TODO: Replace with actual recently viewed from localStorage/history
  const recentRestaurants = [
    {
      id: "1",
      title: "Al Fanar Restaurant",
      image: "/images/restaurants/1511671782779-c97d3d27a1d4-card.webp",
      rating: 4.7,
      location: "Dubai Festival City",
      cuisine: "Emirati",
      priceMin: 15,
      priceMax: 25,
    },
    {
      id: "2",
      title: "Operation Falafel",
      image: "/images/restaurants/1577106263724-2c8e03bfe9cf-card.webp",
      rating: 4.5,
      location: "Sheikh Zayed Road",
      cuisine: "Lebanese",
      priceMin: 10,
      priceMax: 20,
    },
    {
      id: "3",
      title: "Zahrat Lebnan",
      image: "/images/restaurants/1590779033100-9f60a05a013d-card.webp",
      rating: 4.6,
      location: "Al Quoz",
      cuisine: "Lebanese",
      priceMin: 12,
      priceMax: 22,
    },
    {
      id: "4",
      title: "Seven Sisters",
      image: "/images/restaurants/1590502593747-42a996133562-card.webp",
      rating: 4.4,
      location: "Jumeirah",
      cuisine: "Emirati",
      priceMin: 18,
      priceMax: 30,
    },
  ]

  if (recentRestaurants.length === 0) {
    return null
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-[var(--spacing-md)]">
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Recently Viewed</h2>

        <a
          href="/nearby"
          className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-[var(--spacing-xs)]"
        >
          View all
          <svg
            className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Recent Items Grid - Horizontal Scroll on Mobile */}
      <div className="flex gap-[var(--spacing-md)] overflow-x-auto pb-[var(--spacing-sm)] scrollbar-hide snap-x snap-mandatory">
        {recentRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="snap-start flex-shrink-0 w-[calc(50%-var(--spacing-sm)/2)]"
          >
            <RestaurantCard {...restaurant} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  )
}
