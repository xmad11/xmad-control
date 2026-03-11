/* ═══════════════════════════════════════════════════════════════════════════════
   BLOG SKELETON PREVIEW CARD - Matches BlogPreviewCard Instagram design
   Shimmer loading placeholder with same layout as blog cards
   ═══════════════════════════════════════════════════════════════════════════════ */

import { InstagramVerifiedBadge } from "@/components/icons/VerifiedBadge"
import Link from "next/link"
import { memo } from "react"

export interface BlogSkeletonPreviewCardProps {
  href: string
  label?: string
}

/**
 * Blog skeleton preview card - Matches BlogPreviewCard Instagram design exactly
 * Used as "Show more" placeholder in blog sections
 */
export const BlogSkeletonPreviewCard = memo(function BlogSkeletonPreviewCard({
  href,
  label = "Show more",
}: BlogSkeletonPreviewCardProps) {
  return (
    <Link
      href={href}
      className="block group transition-transform duration-[var(--duration-normal)] hover:scale-[var(--hover-scale-factor)] contain-optimization"
    >
      {/* Instagram-style header - exact match */}
      <div className="flex items-center gap-2 py-3 pl-0 pr-3">
        {/* Profile picture placeholder - 32px */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--fg-10)] animate-pulse" />
        </div>

        {/* Username + location placeholders */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="h-3 bg-[var(--fg-10)] rounded animate-pulse w-16" />
            <InstagramVerifiedBadge size={12} className="flex-shrink-0 opacity-50" />
          </div>
          <div className="h-3 bg-[var(--fg-10)] rounded animate-pulse w-24 mt-0.5" />
        </div>
      </div>

      {/* Image container - shimmer effect */}
      <div className="relative aspect-square bg-[var(--fg-10)] skeleton-shimmer">
        {/* Show more label - centered on image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-[var(--color-primary)]">{label} →</span>
        </div>
      </div>

      {/* Content - skeleton lines */}
      <div className="py-3 pl-0 pr-3">
        {/* Title placeholder - 2 lines */}
        <div className="space-y-1">
          <div className="h-[var(--font-size-sm)] bg-[var(--fg-10)] rounded animate-pulse w-full" />
          <div className="h-[var(--font-size-sm)] bg-[var(--fg-10)] rounded animate-pulse w-3/4" />
        </div>

        {/* Read time placeholder */}
        <div className="h-[var(--font-size-xs)] bg-[var(--fg-10)] rounded animate-pulse w-16 mt-2" />
      </div>
    </Link>
  )
})
