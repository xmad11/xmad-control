/* ═══════════════════════════════════════════════════════════════════════════════
   IMAGE VARIANT - Marquee/hero/featured
   Image only + optional overlays (title, rating, favorite, price)
   DOM target: < 15 nodes for smooth marquee animation
   ═══════════════════════════════════════════════════════════════════════════════ */

import { HeartIcon, StarIcon } from "@/components/icons"
import { OptimizedImage } from "@/components/images"
import type { PriceTier } from "@/types/restaurant"

// Allow both PriceTier and string for flexibility
type PriceProp = PriceTier | string
import { memo } from "react"

export interface ImageVariantProps {
  images: string[]
  alt: string
  href?: string
  // Optional toggles
  showTitle?: boolean | "hover" | "always"
  showRating?: boolean
  showFavorite?: boolean
  showPrice?: boolean
  isFavorite?: boolean
  rating?: number
  title?: string
  price?: PriceProp
  // Optional callbacks
  onFavoriteToggle?: () => void
  blurHash?: string
}

/**
 * Image variant - For marquees, hero sections, featured sliders
 *
 * Rules:
 * - Image fills the card (aspect-video or square)
 * - No text below image
 * - No vertical expansion
 * - Minimal DOM for performance
 * - Carousel disabled by default for marquee
 */
export const ImageVariant = memo(function ImageVariant({
  images,
  alt,
  href,
  showTitle = false,
  showRating = false,
  showFavorite = false,
  showPrice = false,
  isFavorite = false,
  rating,
  title,
  price,
  onFavoriteToggle,
  blurHash,
}: ImageVariantProps) {
  const imageUrl = images?.[0] ?? ""

  // Wrapper for link
  const content = (
    <div className="relative w-full h-full">
      {/* Image - fills the card */}
      <div className="relative w-full h-full aspect-video rounded-[var(--radius-xl)] overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={alt}
          blurHash={blurHash}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Top overlays row */}
      <div className="absolute top-[var(--card-gap-sm)] left-[var(--card-gap-sm)] right-[var(--card-gap-sm)] flex items-start justify-between">
        {/* Rating - top left */}
        {showRating && rating !== undefined && (
          <div className="flex items-center gap-[var(--card-gap-xs)] bg-[var(--color-black)]/60 backdrop-blur-sm px-[var(--card-gap-sm)] py-[var(--card-gap-xs)] rounded-[var(--radius-full)]">
            <StarIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-[var(--color-rating)] fill-[var(--color-rating)]" />
            <span className="text-[var(--card-meta-sm)] font-medium text-[var(--color-white)]">
              {rating}
            </span>
          </div>
        )}

        {/* Price + Favorite - top right */}
        <div className="flex items-center gap-[var(--card-gap-xs)]">
          {/* Price badge */}
          {showPrice && price && <span className="text-secondary-gray">{price}</span>}

          {/* Favorite button */}
          {showFavorite && onFavoriteToggle && (
            <button
              type="button"
              onClick={onFavoriteToggle}
              className="p-[var(--card-gap-sm)] bg-[var(--color-black)]/60 backdrop-blur-sm rounded-[var(--radius-full)] hover:bg-[var(--color-black)]/80 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <HeartIcon
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ${isFavorite ? "text-[var(--color-favorite)] fill-[var(--color-favorite)]" : "text-[var(--color-white)] fill-none stroke-2"}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Title - overlay or hover */}
      {showTitle && title && (
        <div
          className={`absolute inset-x-0 bottom-0 px-[var(--card-gap-sm)] py-[var(--card-gap-sm)] bg-gradient-to-t from-[var(--color-black)]/80 to-transparent ${
            showTitle === "hover" ? "opacity-0 group-hover:opacity-100 transition-opacity" : ""
          }`}
        >
          <p className="text-[var(--card-title-sm)] font-semibold text-[var(--color-white)] line-clamp-1">
            {title}
          </p>
        </div>
      )}
    </div>
  )

  return href ? <a href={href}>{content}</a> : content
})
