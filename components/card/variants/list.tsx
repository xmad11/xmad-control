/* ═══════════════════════════════════════════════════════════════════════════════
   LIST VARIANT - Horizontal layout (Image left, content right)
   Based on card #7 (Horizontal) from reference
   ═══════════════════════════════════════════════════════════════════════════════ */

import { CardCarousel } from "@/components/carousel"
import { HeartIcon, MapPinIcon, ShareIcon, StarIcon } from "@/components/icons"
import type { PriceTier, RestaurantLocation, ShadiBadge } from "@/types/restaurant"
import { memo } from "react"

export interface ListVariantProps {
  images: string[]
  alt: string
  title: string
  description?: string
  cuisine?: string
  category?: string // Alias for cuisine (for BlogCard)
  rating?: number
  price?: PriceTier | string
  location?: RestaurantLocation
  badges?: (string | ShadiBadge)[]
  isFavorite?: boolean
  href?: string
  onFavoriteToggle?: () => void
  onShare?: () => void
  blurHash?: string
}

/**
 * List variant - Horizontal layout
 *
 * Based on card #7 (Horizontal card) from reference:
 * - Image left (96x96 rounded-xl)
 * - Content right with organized layout
 * - 1-2 icons on image (favorite, share)
 * - Other details arranged on right side
 *
 * Layout (right side):
 * - Line 1: Title (left) + Star rating (right, aligned)
 * - Line 2: Location in blue with icon (smaller, thinner)
 * - Line 3: Main category badge + sub categories + price
 */
export const ListVariant = memo(function ListVariant({
  images,
  alt,
  title,
  cuisine,
  category,
  rating,
  price,
  location,
  // badges, // Not currently used in list variant
  isFavorite = false,
  href,
  onFavoriteToggle,
  onShare,
  blurHash,
}: ListVariantProps) {
  const hasMultipleImages = (images?.length || 0) > 1

  // Use category if cuisine not provided (for BlogCard compatibility)
  const mainCategory = cuisine || category

  // Build location string: "District, Emirate" or just one
  const locationStr = location
    ? [location.district, location.emirate].filter(Boolean).join(", ")
    : undefined

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.()
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.()
  }

  const content = (
    <div className="flex bg-[var(--card-bg)] rounded-[var(--radius-xl)] rounded-l-none hover:shadow-[var(--shadow-lg)] transition-all cursor-pointer group overflow-hidden">
      {/* Image left - full height, no padding on top/bottom/left */}
      <div className="relative w-[var(--card-list-image-width)] lg:w-[var(--card-list-image-width-desktop)] flex-shrink-0 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--fg-10)]">
        <CardCarousel
          images={images || []}
          alt={alt}
          blurHash={blurHash}
          height="100%"
          className="h-full"
          restaurantName={title}
          showIndicators={false}
        />

        {/* Top Left: Rating Badge */}
        {rating !== undefined && (
          <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)] flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] pointer-events-none">
            <StarIcon className="w-[calc(var(--icon-size-sm)*1.1)] h-[calc(var(--icon-size-sm)*1.1)] text-[var(--color-rating)] fill-[var(--color-rating)]" />
            <span className="text-xs font-[var(--font-weight-medium)] text-[var(--badge-color)]">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Bottom Left: Favorite */}
        {onFavoriteToggle && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute bottom-[var(--spacing-xs)] left-[var(--spacing-xs)] p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-10)]/80 backdrop-blur-sm transition-all pointer-events-auto"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon
              className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ${isFavorite ? "text-[var(--color-favorite)] fill-[var(--color-favorite)]" : "text-[var(--badge-color)] fill-none stroke-2"}`}
            />
          </button>
        )}

        {/* Share - bottom of image (if no favorite) */}
        {onShare && !onFavoriteToggle && (
          <button
            type="button"
            onClick={handleShareClick}
            className="absolute bottom-[var(--spacing-xs)] left-[var(--spacing-xs)] p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-10)]/80 backdrop-blur-sm transition-all pointer-events-auto"
            aria-label="Share restaurant"
          >
            <ShareIcon className="w-[var(--icon-size-xs)] h-[var(--icon-size-xs)] text-[var(--badge-color)] drop-shadow-md" />
          </button>
        )}

        {/* Bottom Center: Image Count Dots - shows multiple images */}
        {hasMultipleImages && (
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex gap-[2px] pointer-events-none">
            {images.slice(0, 3).map((img, i) => (
              <span
                key={`list-dot-${i}-${img}`}
                className="w-[4px] h-[4px] rounded-full bg-[var(--color-white)]/80 shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Content right */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-[var(--card-gap-sm)] p-[var(--card-gap-md)]">
        {/* Line 1: Title - one line only */}
        <h3 className="text-[var(--card-title-base)] font-[var(--font-weight-semibold)] text-[var(--fg)] line-clamp-1 leading-tight">
          {title}
        </h3>

        {/* Line 2: Location - one line only */}
        <div className="flex items-center gap-[var(--card-gap-md)] text-[var(--card-meta-xs)] text-secondary-gray">
          {locationStr && (
            <span className="flex items-center gap-[var(--card-gap-xs)] line-clamp-1 leading-tight">
              <MapPinIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-secondary-gray flex-shrink-0" />
              <span className="text-secondary-gray line-clamp-1 leading-tight">{locationStr}</span>
            </span>
          )}
        </div>

        {/* Line 3: Main category + price - one line only */}
        <div className="flex items-center justify-between">
          {/* Main category badge - brand color, different from other badges */}
          {mainCategory && (
            <span className="inline-flex items-center bg-badge-primary/10 text-badge-primary rounded-[var(--radius-sm)] px-[var(--card-gap-sm)] py-[var(--card-gap-xs)] text-[var(--font-size-sm)] font-medium line-clamp-1">
              {mainCategory}
            </span>
          )}
          {/* Price - aligned right */}
          {price && <span className="text-secondary-gray ml-auto">{price}</span>}
        </div>
      </div>
    </div>
  )

  return href ? <a href={href}>{content}</a> : content
})
