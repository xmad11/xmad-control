/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT CARD - Semantic wrapper using BaseCard + variants
   Database schema matched - ShadiRestaurant interface
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ShadiRestaurant } from "@/types/restaurant"
import { memo } from "react"
import { BaseCard, type CardVariant } from "./BaseCard"
import { CompactVariant, DetailedVariant, ImageVariant, ListVariant } from "./variants"

export type { RestaurantCardProps } from "@/types/restaurant"

// Extended props for interactive features
export interface RestaurantCardInteractiveProps {
  onShare?: () => void
  onImageChange?: (index: number) => void
}

/**
 * RestaurantCard - Restaurant card using BaseCard + variants
 *
 * USAGE:
 * <RestaurantCard
 *   variant="detailed"  // Full featured with favorite/share
 *   onFavoriteToggle={() => {}}
 *   onShare={() => {}}
 * />
 *
 * VARIANTS:
 * - image: Marquee/hero (image + optional overlays)
 * - compact: Dense grids (minimal)
 * - detailed: Primary listing (FULL FEATURES - favorite, share, carousel)
 * - list: Horizontal (image left, content right)
 */
export const RestaurantCard = memo(function RestaurantCard({
  id,
  name,
  images,
  rating,
  isFavorite = false,
  price,
  cuisine,
  description,
  emirate,
  district,
  address,
  distance,
  mapCoordinates,
  features,
  shadiBadges,
  variant = "detailed",
  href,
  onFavoriteToggle,
  onShare,
  showTitle = false,
  showRating = true,
  showFavorite = true,
  showCarousel = true,
  blurHash,
  // Keep unused props for API compatibility (avoid destructuring to prevent linter warnings)
  ..._unusedProps
}: ShadiRestaurant & {
  variant?: CardVariant
  href?: string
  onFavoriteToggle?: (id: string) => void
  onShare?: () => void
  onImageChange?: (index: number) => void
  showTitle?: boolean | "hover" | "always"
  showRating?: boolean
  showFavorite?: boolean
  showCarousel?: boolean
  blurHash?: string
}) {
  // Build location object for variants
  const location =
    emirate || district
      ? {
          emirate,
          district,
          address,
          distance,
          mapCoordinates,
        }
      : undefined

  // Variant content
  const variantContent = (
    <>
      {variant === "image" && (
        <ImageVariant
          images={images}
          alt={name}
          href={href}
          showTitle={showTitle}
          showRating={showRating}
          showFavorite={showFavorite}
          isFavorite={isFavorite}
          rating={rating}
          title={name}
          price={price}
          onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(id) : undefined}
        />
      )}

      {variant === "compact" && (
        <CompactVariant
          images={images}
          alt={name}
          title={name}
          cuisine={cuisine}
          rating={rating}
          price={price}
          href={href}
        />
      )}

      {variant === "detailed" && (
        <DetailedVariant
          images={images}
          alt={name}
          title={name}
          category={cuisine}
          rating={rating}
          price={price}
          location={location}
          badges={shadiBadges}
          features={features}
          showCarousel={showCarousel}
          isFavorite={isFavorite}
          href={href}
          onFavoriteToggle={
            showFavorite && onFavoriteToggle ? () => onFavoriteToggle(id) : undefined
          }
          onShare={onShare}
          blurHash={blurHash}
        />
      )}

      {variant === "list" && (
        <ListVariant
          images={images}
          alt={name}
          title={name}
          description={description}
          cuisine={cuisine}
          rating={rating}
          price={price}
          location={location}
          badges={shadiBadges}
          href={href}
          blurHash={blurHash}
        />
      )}
    </>
  )

  return (
    <BaseCard variant={variant} type="restaurant">
      {variantContent}
    </BaseCard>
  )
})
