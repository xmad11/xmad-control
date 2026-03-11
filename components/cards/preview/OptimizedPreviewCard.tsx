/* ═══════════════════════════════════════════════════════════════════════════════
   OPTIMIZED PREVIEW CARD - With BlurHash placeholders
   Phase 1: 20-char BlurHash instead of 50KB placeholder images
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { MapPinIcon, MessageCircleIcon, StarIcon, ThumbsUpIcon } from "@/components/icons"
import { OptimizedImage } from "@/components/images"
import Link from "next/link"
import { memo } from "react"

export interface OptimizedPreviewCardProps {
  id: string
  title: string
  image: string
  blurHash?: string
  cuisine?: string
  rating?: number
  href: string
  location?: string
  likes?: number
  comments?: number
}

/**
 * Preview card with BlurHash placeholder
 * Used in horizontal scrollable sections
 */
export const OptimizedPreviewCard = memo(function OptimizedPreviewCard({
  title,
  image,
  blurHash,
  rating,
  href,
  location,
  likes,
  comments,
}: OptimizedPreviewCardProps) {
  return (
    <Link
      href={href}
      className="block group transition-transform duration-[var(--duration-normal)] hover:scale-[var(--hover-scale-factor)]"
    >
      <div className="relative w-full aspect-square bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--fg-10)]">
        {/* Optimized Image with BlurHash */}
        <OptimizedImage
          src={image}
          alt={title}
          blurHash={blurHash}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />

        {/* Rating badge - top left */}
        {rating && (
          <div className="absolute top-[var(--spacing-xs)] left-[var(--spacing-xs)] flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]">
            <StarIcon
              className="w-4 h-4 text-[var(--color-rating)] fill-current"
              aria-hidden="true"
            />
            <span className="text-[var(--badge-font-size)] font-medium text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Engagement stats overlay - bottom right like blog cards */}
        {(likes !== undefined || comments !== undefined) && (
          <div className="absolute bottom-[var(--spacing-xs)] right-[var(--spacing-xs)] flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]">
            {likes !== undefined && (
              <div className="flex items-center gap-[var(--card-gap-xs)]">
                <ThumbsUpIcon
                  className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-white"
                  aria-hidden="true"
                />
                <span className="text-[var(--badge-font-size)] font-medium text-white">
                  {likes}
                </span>
              </div>
            )}
            {comments !== undefined && (
              <div className="flex items-center gap-[var(--card-gap-xs)]">
                <MessageCircleIcon
                  className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-white"
                  aria-hidden="true"
                />
                <span className="text-[var(--badge-font-size)] font-medium text-white">
                  {comments}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="mt-2">
        <h3 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)] line-clamp-1">
          {title}
        </h3>
        {location && (
          <div className="flex items-center gap-1 mt-1">
            <MapPinIcon className="w-4 h-4 text-secondary-gray flex-shrink-0" aria-hidden="true" />
            <span className="text-[var(--font-size-xs)] text-secondary-gray line-clamp-1">
              {location}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
})
