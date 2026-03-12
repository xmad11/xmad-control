/* ═══════════════════════════════════════════════════════════════════════════════
   SKELETON PREVIEW CARD - Matches OptimizedPreviewCard design
   Shimmer loading placeholder with same layout as real cards
   ═══════════════════════════════════════════════════════════════════════════════ */

import { MapPinIcon, StarIcon } from "@/components/icons"
import Link from "next/link"
import { memo } from "react"

export interface SkeletonPreviewCardProps {
  href: string
  label?: string
}

/**
 * Skeleton preview card - Matches OptimizedPreviewCard design exactly
 * Used as "Show More" placeholder in horizontal scrollable sections
 */
export const SkeletonPreviewCard = memo(function SkeletonPreviewCard({
  href,
  label = "Show more",
}: SkeletonPreviewCardProps) {
  return (
    <Link
      href={href}
      className="block group transition-transform duration-[var(--duration-normal)] hover:scale-[var(--hover-scale-factor)] contain-optimization"
    >
      {/* Image container - shimmer effect */}
      <div className="relative w-full aspect-square bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--fg-10)] skeleton-shimmer">
        {/* Rating badge placeholder - top left */}
        <div className="absolute top-2 left-2 bg-[var(--fg-10)] px-2 py-1 rounded-lg flex items-center gap-1 animate-pulse">
          <StarIcon className="w-3 h-3 text-[var(--fg-30)]" aria-hidden="true" />
          <div className="w-4 h-3 bg-[var(--fg-20)] rounded-sm" />
        </div>

        {/* 3 dots placeholder - bottom center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[var(--card-gap-xs)] h-[var(--card-gap-xs)] rounded-full bg-[var(--fg-20)] animate-pulse"
              aria-hidden="true"
              style={{ animationDelay: `${i * 150}ms` }}
              // @design-exception DYNAMIC_VALUE: Animation delay requires index-based calculation that cannot be expressed with static Tailwind classes
            />
          ))}
        </div>

        {/* Show more label - centered on image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-[var(--color-primary)]">{label} →</span>
        </div>
      </div>

      {/* Card info - skeleton lines */}
      <div className="mt-2">
        {/* Title placeholder */}
        <div className="h-[var(--font-size-sm)] bg-[var(--fg-10)] rounded animate-pulse w-3/4" />

        {/* Location placeholder with icon */}
        <div className="flex items-center gap-1 mt-1">
          <MapPinIcon className="w-3 h-3 text-[var(--fg-20)] animate-pulse" aria-hidden="true" />
          <div className="h-[var(--font-size-xs)] bg-[var(--fg-10)] rounded animate-pulse flex-1" />
        </div>
      </div>
    </Link>
  )
})
