/* ═══════════════════════════════════════════════════════════════════════════════
   OPTIMIZED MARQUEE CARD - With BlurHash placeholders
   Phase 1: 20-char BlurHash instead of 50KB placeholder images
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { StarIcon } from "@/components/icons"
import { OptimizedImage } from "@/components/images"
import Link from "next/link"
import { memo } from "react"

export interface OptimizedMarqueeCardProps {
  id: string
  title: string
  image: string
  blurHash?: string
  rating?: number
  href: string
  badge?: string
}

/**
 * Marquee card with BlurHash placeholder
 * Used in infinite scroll carousel
 */
export const OptimizedMarqueeCard = memo(function OptimizedMarqueeCard({
  title,
  image,
  blurHash,
  rating,
  href,
  badge,
}: OptimizedMarqueeCardProps) {
  return (
    <Link href={href} className="flex-shrink-0 w-[clamp(12.5rem,20vw,15.625rem)] group">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[var(--card-bg)]">
        {/* Optimized Image with BlurHash */}
        <OptimizedImage
          src={image}
          alt={title}
          blurHash={blurHash}
          fill
          sizes="250px"
          className="object-cover"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-2 right-2 bg-[var(--color-primary)] text-[var(--bg)] px-2 py-1 rounded text-[10px] font-bold uppercase">
            {badge}
          </div>
        )}

        {/* Rating */}
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-[var(--badge-gap)] bg-[var(--badge-bg)] backdrop-blur-[var(--badge-blur)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]">
            <StarIcon className="w-3 h-3 text-[var(--color-rating)]" aria-hidden="true" />
            <span className="text-[var(--badge-font-size)] font-medium text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <h3 className="text-white text-sm font-semibold line-clamp-2">{title}</h3>
        </div>
      </div>
    </Link>
  )
})
