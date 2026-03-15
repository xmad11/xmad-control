/* ═══════════════════════════════════════════════════════════════════════════════
   DETAILED VARIANT - Primary listing (FULL FEATURED for restaurants page)
   Image + 3 lines content, carousel with Embla + OptimizedImage + blurhash
   ═══════════════════════════════════════════════════════════════════════════════ */

import { CardCarousel } from "@/components/carousel"
import {
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TagIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/icons"
import type { PriceTier, RestaurantLocation, ShadiBadge } from "@/types/restaurant"
import { memo } from "react"

/* ═══════════════════════════════════════════════════════════════════════════════
   BADGE CONFIG - Short names and icons for badges
   ───────────────────────────────────────────────────────────────────────────── */
interface BadgeConfig {
  short: string
  icon?: React.ComponentType<{ className?: string }>
}

const BADGE_CONFIG: Record<string, BadgeConfig> = {
  "Shadi's Pick": { short: "Pick", icon: SparklesIcon },
  "New on Shadi.AE": { short: "New", icon: SparklesIcon },
  "Deal Available": { short: "Deal", icon: TagIcon },
  "High Rating": { short: "Top", icon: TrophyIcon },
  "Kids Friendly": { short: "Kids", icon: UsersIcon },
  Romantic: { short: "Date", icon: HeartIcon },
  Iconic: { short: "Iconic", icon: TrophyIcon },
  Buffet: { short: "Buffet", icon: TagIcon },
  "Hotel Restaurant": { short: "Hotel", icon: SparklesIcon },
  "Family Style": { short: "Family", icon: UsersIcon },
  Heritage: { short: "Heritage", icon: TrophyIcon },
  Traditional: { short: "Trad", icon: SunIcon },
  Outdoor: { short: "Outdoor", icon: SunIcon },
}

function getBadgeConfig(badge: string): BadgeConfig {
  return BADGE_CONFIG[badge] || { short: badge }
}

export interface DetailedVariantProps {
  images: string[]
  alt: string
  title: string
  category?: string
  rating?: number
  price?: PriceTier
  location?: RestaurantLocation
  badges?: ShadiBadge[]
  features?: string[]
  showCarousel?: boolean
  showTitle?: boolean | "hover" | "always"
  showRating?: boolean
  showFavorite?: boolean
  isFavorite?: boolean
  href?: string
  onFavoriteToggle?: () => void
  onShare?: () => void
  blurHash?: string
}

/**
 * Detailed variant - Full-featured card for restaurants page (Grid View)
 *
 * Features:
 * - CardCarousel with Embla + OptimizedImage + blurhash
 * - Rating badge on image (top-left)
 * - Favorite button on image (top-right)
 * - Badges on image (bottom-left, transparent 50%)
 * - 3 content lines under image: Title + Location + Cuisine/Price
 */
export const DetailedVariant = memo(function DetailedVariant({
  images,
  alt,
  title,
  category,
  rating,
  price,
  location,
  badges = [],
  features = [],
  isFavorite = false,
  href,
  onFavoriteToggle,
  blurHash,
}: DetailedVariantProps) {
  const hasMultipleImages = (images?.length || 0) > 1

  // Build location string: "District, Emirate" or "District" or "Emirate"
  const locationStr = location
    ? [location.district, location.emirate].filter(Boolean).join(", ")
    : undefined

  // Sub categories (badges + features) for display on image
  const subCategories = [...(badges || []), ...(features || [])]
    .filter((b) => b !== category)
    .slice(0, 2)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.()
  }

  const content = (
    <div className="flex flex-col h-auto group">
      {/* Image Section - with CardCarousel and overlays */}
      <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden">
        <CardCarousel
          images={images || []}
          alt={alt}
          blurHash={blurHash}
          height="100%"
          className="h-full"
          restaurantName={title}
          showIndicators={false}
        />

        {/* Top Center: Image Count Dots - shows multiple images */}
        {hasMultipleImages && (
          <div className="absolute top-[var(--dot-size-xs)] left-1/2 -translate-x-1/2 flex gap-[var(--dot-size-xs)]">
            {images.slice(0, 3).map((img, i) => (
              <span
                key={`image-dot-${i}-${img}`}
                className="w-[var(--spacing-xs)] h-[var(--spacing-xs)] rounded-full bg-[var(--color-white)]/80 shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Top Left: Rating Badge */}
        {rating !== undefined && (
          <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)] flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] pointer-events-none">
            <StarIcon className="w-[calc(var(--icon-size-sm)*1.1)] h-[calc(var(--icon-size-sm)*1.1)] text-[var(--color-rating)] fill-[var(--color-rating)]" />
            <span className="text-xs font-[var(--font-weight-medium)] text-[var(--badge-color)]">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Top Right: Favorite Button */}
        {onFavoriteToggle && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-10)]/80 backdrop-blur-sm transition-all pointer-events-auto"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon
              className={`w-[calc(var(--icon-size-sm)*1.1)] h-[calc(var(--icon-size-sm)*1.1)] ${isFavorite ? "text-[var(--color-favorite)] fill-[var(--color-favorite)]" : "text-[var(--badge-color)] fill-none stroke-2"}`}
            />
          </button>
        )}

        {/* Bottom Left: Badges - transparent 50% */}
        {subCategories.length > 0 && (
          <div className="absolute bottom-[var(--spacing-sm)] left-[var(--spacing-sm)] flex items-center gap-[var(--badge-gap)] whitespace-nowrap pointer-events-none">
            {subCategories.map((badge) => {
              const config = getBadgeConfig(badge)
              return (
                <span
                  key={badge}
                  className="inline-flex items-center bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-xs font-medium text-[var(--badge-color)]"
                >
                  {config.short}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Content - Exactly 3 lines, no wrapping */}
      <div className="mt-[var(--spacing-sm)] flex flex-col justify-start">
        {/* Line 1: Title - one line only */}
        <h3 className="text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--fg)] line-clamp-1 leading-tight">
          {title}
        </h3>

        {/* Line 2: Location - one line only */}
        {locationStr && (
          <div className="flex items-center gap-[var(--card-gap-xs)] mt-[var(--spacing-xs)]">
            <MapPinIcon
              className="w-[var(--font-size-sm)] h-[var(--font-size-sm)] text-secondary-gray flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-[var(--font-size-sm)] text-secondary-gray line-clamp-1 leading-tight">
              {locationStr}
            </span>
          </div>
        )}

        {/* Line 3: Cuisine + Price - one line only */}
        {(category || price) && (
          <div className="flex items-center justify-between mt-[var(--spacing-xs)]">
            {category && (
              <span className="inline-block px-[var(--card-gap-xs)] py-[var(--radius-xs)] bg-badge-primary/10 text-badge-primary rounded text-[var(--card-meta-2xs)] font-medium truncate text-[var(--font-size-xs)]">
                {category}
              </span>
            )}
            {price && (
              <span className="text-secondary-gray ml-auto text-[var(--font-size-xs)]">
                {price}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return href ? <a href={href}>{content}</a> : content
})
