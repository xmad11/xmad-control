/* ═══════════════════════════════════════════════════════════════════════════════
   OPTIMIZED RESTAURANT CARD - With BlurHash placeholders
   Phase 1: 20-char BlurHash instead of 50KB placeholder images
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { MapPinIcon, StarIcon } from "@/components/icons"
import { OptimizedImage } from "@/components/images"
import type { ShadiRestaurant } from "@/types/restaurant"
import Link from "next/link"
import { memo } from "react"

export interface OptimizedRestaurantCardProps {
  restaurant: ShadiRestaurant
  blurHash?: string
  variant?: "grid" | "list"
}

/**
 * Restaurant card with BlurHash placeholder
 * Supports grid and list variants
 */
export const OptimizedRestaurantCard = memo(function OptimizedRestaurantCard({
  restaurant,
  blurHash,
  variant = "grid",
}: OptimizedRestaurantCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className="flex gap-4 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--fg-10)] hover:border-[var(--color-primary)]/30 transition-colors"
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <OptimizedImage
            src={restaurant.images[0] || restaurant.image}
            alt={restaurant.name}
            blurHash={blurHash}
            fill
            sizes="96px"
            className="object-cover"
          />
          {restaurant.rating && (
            <div className="absolute top-1 left-1 flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]">
              <StarIcon className="w-2.5 h-2.5 text-[var(--color-rating)]" aria-hidden="true" />
              <span className="text-[var(--badge-font-size)] font-medium text-white">
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPinIcon className="w-3 h-3 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-[var(--font-size-xs)] text-[var(--color-primary)]">
              {restaurant.district}, {restaurant.emirate}
            </span>
          </div>
          <p className="text-[var(--font-size-xs)] text-[var(--fg-50)] mt-1 line-clamp-2">
            {restaurant.description}
          </p>
        </div>
      </Link>
    )
  }

  // Grid variant
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group block bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--fg-10)] hover:border-[var(--color-primary)]/30 transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-square">
        <OptimizedImage
          src={restaurant.images[0] || restaurant.image}
          alt={restaurant.name}
          blurHash={blurHash}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />

        {/* Rating badge */}
        {restaurant.rating && (
          <div className="absolute top-2 left-2 flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]">
            <StarIcon className="w-3 h-3 text-[var(--color-rating)]" aria-hidden="true" />
            <span className="text-[var(--badge-font-size)] font-medium text-white">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)] line-clamp-1">
          {restaurant.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPinIcon className="w-3 h-3 text-[var(--color-primary)]" aria-hidden="true" />
          <span className="text-[var(--font-size-xs)] text-[var(--color-primary)] line-clamp-1">
            {restaurant.district}, {restaurant.emirate}
          </span>
        </div>
      </div>
    </Link>
  )
})
