/* ═══════════════════════════════════════════════════════════════════════════════
   BLOG PREVIEW CARD - Instagram-style exact match
   Profile picture, username, verified badge matching Instagram design
   ═══════════════════════════════════════════════════════════════════════════════ */

import { MessageCircleIcon, ThumbsUpIcon } from "@/components/icons"
import { InstagramVerifiedBadge } from "@/components/icons/VerifiedBadge"
import { OptimizedImage } from "@/components/images"
import { memo, useMemo } from "react"

export interface BlogPreviewCardProps {
  id: string
  title: string
  image: string
  blurHash?: string
  avatarBlurHash?: string
  category: string
  readTime?: string
  date?: string
  href?: string
  avatar?: string
  username?: string
  location?: string
  likes?: number
  comments?: number
}

/**
 * Format date as relative time (X hours ago, X days ago, etc.)
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffMins < 60) return `${diffMins} mins ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffMonths < 12) return `${diffMonths} months ago`
  return `${diffYears} years ago`
}

/**
 * BlogPreviewCard - Instagram-style exact design
 *
 * Instagram search card specs:
 * - Avatar: 40px (w-10 h-10) with circular crop
 * - Username: 14px (text-sm), font-semibold
 * - Verified badge: 14px (text-sm), #1D9BF0 (Instagram's verified badge color)
 * - Spacing: 12px gap between elements
 * - Header padding: 12px vertical
 * - Image: Square, no radius
 * - Title: 14px (text-sm), line-clamp-2
 * - Content padding: 12px
 */
const BlogPreviewCard = memo(function BlogPreviewCard({
  title,
  image,
  blurHash,
  avatarBlurHash,
  // category, // Not currently used
  // readTime, // Not currently used
  date,
  href,
  avatar,
  username,
  location,
  likes,
  comments,
}: BlogPreviewCardProps) {
  // Format date as relative time
  const relativeDate = useMemo(() => {
    return date ? formatRelativeTime(date) : undefined
  }, [date])

  const cardContent = (
    <>
      {/* Instagram-style header - exact match */}
      <div className="flex items-center gap-2 py-3 pl-0 pr-3">
        {/* Profile picture - smaller, left aligned with no space */}
        {avatar && (
          <div className="relative flex-shrink-0 w-8 h-8">
            <OptimizedImage
              src={avatar}
              alt={username || "Profile"}
              blurHash={avatarBlurHash}
              width={32}
              height={32}
              fill
              sizes="32px"
              className="rounded-full object-cover"
            />
          </div>
        )}

        {/* Username + location - smaller text */}
        {username && (
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[var(--fg)] truncate">{username}</span>
              <InstagramVerifiedBadge size={12} className="flex-shrink-0" />
            </div>
            {location && <span className="text-xs text-secondary-gray truncate">{location}</span>}
          </div>
        )}
      </div>

      {/* Image - Square aspect ratio, no radius */}
      <div className="relative aspect-square overflow-hidden bg-[var(--fg-10)]">
        <OptimizedImage
          src={image}
          alt={title}
          blurHash={blurHash}
          fill
          quality={75}
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 210px"
        />

        {/* Engagement stats overlay - bottom right like Instagram */}
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

      {/* Content - Instagram-style spacing */}
      <div className="py-3 pl-0 pr-3">
        {/* Title - using same tokens as restaurant cards */}
        <h3 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)] line-clamp-1">
          {title}
        </h3>

        {/* Date - using same token style as restaurant location */}
        {relativeDate && (
          <p className="text-[var(--font-size-xs)] text-secondary-gray mt-1">{relativeDate}</p>
        )}
      </div>
    </>
  )

  // Direct link wrapper - no PreviewCardBase needed
  if (href) {
    return (
      <a href={href} className="block bg-[var(--card-bg)]">
        {cardContent}
      </a>
    )
  }

  return <div className="bg-[var(--card-bg)]">{cardContent}</div>
})

export { BlogPreviewCard }
