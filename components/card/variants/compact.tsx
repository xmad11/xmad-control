/* ═══════════════════════════════════════════════════════════════════════════════
   COMPACT VARIANT - Dense grids
   Image + 2 lines under: title/cuisine left, rating/price right
   ═══════════════════════════════════════════════════════════════════════════════ */

import { StarIcon } from "@/components/icons"
import { OptimizedImage } from "@/components/images"
import type { PriceTier } from "@/types/restaurant"
import { memo } from "react"

type PriceProp = PriceTier | string

export interface CompactVariantProps {
  images: string[]
  alt: string
  title: string
  cuisine?: string
  rating?: number
  price?: PriceProp
  href?: string
  blurHash?: string
}

/**
 * Compact variant - For dense grids, explorer, search
 *
 * Layout:
 * - Image (fills most of height)
 * - Two lines under image:
 *   - Line 1: title left, cuisine badge right
 *   - Line 2: rating left, price right
 */
export const CompactVariant = memo(function CompactVariant({
  images,
  alt,
  title,
  cuisine,
  rating,
  price,
  href,
  blurHash,
}: CompactVariantProps) {
  const imageUrl = images?.[0] ?? ""

  const content = (
    <div className="flex flex-col h-full">
      {/* Image - fills available space */}
      <div className="relative flex-1 min-h-0 aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={alt}
          blurHash={blurHash}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* Two lines under image */}
      <div className="flex flex-col gap-[var(--card-gap-xs)] px-[var(--card-gap-sm)] py-[var(--card-gap-sm)]">
        {/* Line 1: title left, cuisine badge right */}
        <div className="flex items-center justify-between gap-[var(--card-gap-sm)]">
          <h3 className="text-[var(--card-title-xs)] font-semibold text-[var(--fg)] truncate flex-1">
            {title}
          </h3>
          {cuisine && (
            <span className="inline-block px-[var(--card-gap-xs)] py-[var(--radius-xs)] bg-badge-primary/10 text-badge-primary rounded text-[var(--card-meta-2xs)] font-medium truncate max-w-[40%]">
              {cuisine}
            </span>
          )}
        </div>

        {/* Line 2: rating left, price right */}
        <div className="flex items-center justify-between gap-[var(--card-gap-sm)]">
          {rating !== undefined && (
            <div className="flex items-center gap-[var(--card-gap-xs)]">
              <StarIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-[var(--color-rating)] fill-[var(--color-rating)]" />
              <span className="text-[var(--card-meta-xs)] font-medium text-[var(--fg)]">
                {rating}
              </span>
            </div>
          )}
          {price && <span className="text-secondary-gray">{price}</span>}
        </div>
      </div>
    </div>
  )

  return href ? <a href={href}>{content}</a> : content
})
