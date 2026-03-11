/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT PREVIEW CARD - Home tabs preview only
   Based on /cards Card #2 (MinimalTypographyCard)
   ═══════════════════════════════════════════════════════════════════════════════ */

import Image from "next/image"
import { memo } from "react"
import { PreviewCardBase } from "./PreviewCardBase"

export interface RestaurantPreviewCardProps {
  id: string
  title: string
  image: string
  cuisine: string
  rating: number
  href?: string
}

/**
 * RestaurantPreviewCard - MINIMAL preview for home tabs
 *
 * Hard rules:
 * - Exactly 1 image
 * - Exactly 2 text lines total
 * - line-clamp-1 for title
 * - line-clamp-1 for meta row
 * - No hover animation
 * - No buttons/actions
 */
const RestaurantPreviewCard = memo(function RestaurantPreviewCard({
  title,
  image,
  cuisine,
  rating,
  href,
}: RestaurantPreviewCardProps) {
  const cardContent = (
    <>
      {/* Image - Square aspect ratio, no animation */}
      <div className="relative aspect-square overflow-hidden bg-[var(--fg-10)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 210px"
        />
      </div>

      {/* Content - Minimal padding, 2 lines max */}
      <div className="px-[var(--card-gap-sm)] py-[var(--card-gap-sm)]">
        {/* Title - Line 1: truncate to 1 line */}
        <h3 className="font-medium text-[var(--fg)] text-[var(--card-title-sm)] leading-tight line-clamp-1">
          {title}
        </h3>

        {/* Meta row - Line 2: cuisine badge + rating */}
        <div className="flex items-center justify-between mt-[var(--card-gap-xs)]">
          {/* Cuisine badge */}
          <span className="inline-block px-[var(--card-gap-xs)] py-[var(--card-gap-xs)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded text-[var(--card-meta-sm)] font-medium truncate max-w-[60%]">
            {cuisine}
          </span>

          {/* Rating */}
          <span className="inline-flex items-center gap-[var(--card-gap-xs)] text-[var(--card-meta-sm)] font-medium text-[var(--fg)] flex-shrink-0">
            <svg
              className="w-[var(--card-meta-sm)] h-[var(--card-meta-sm)] text-[var(--color-rating)] fill-current"
              viewBox="0 0 24 24"
              aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
              role="img"
            >
              <title>{rating.toFixed(1)} stars</title>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </>
  )

  // Wrap in link if href provided
  if (href) {
    return (
      <a href={href} className="block">
        <PreviewCardBase>{cardContent}</PreviewCardBase>
      </a>
    )
  }

  return <PreviewCardBase>{cardContent}</PreviewCardBase>
})

export { RestaurantPreviewCard }
