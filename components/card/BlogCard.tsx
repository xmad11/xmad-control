/* ═══════════════════════════════════════════════════════════════════════════════
   BLOG CARD - Semantic wrapper using BaseCard + variants
   Cool accent, author emphasis, Instagram-style header
   ═══════════════════════════════════════════════════════════════════════════════ */

import { OptimizedImage } from "@/components/images"
import Image from "next/image"
import { memo } from "react"
import { BaseCard, type CardVariant } from "./BaseCard"
import { CompactVariant, DetailedVariant, ListVariant } from "./variants"

export interface BlogCardData {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  blurHash?: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  category?: string
  readTime?: number
  href?: string
}

export interface BlogCardProps extends BlogCardData {
  variant?: CardVariant
  showAuthor?: boolean
}

/**
 * BlogCard - Blog card using BaseCard + variants
 *
 * USAGE:
 * <BlogCard
 *   variant="compact | detailed | list"
 *   showAuthor={true}
 * />
 *
 * NOTE: image variant uses author header (rich/full style)
 *
 * VARIANTS:
 * - image: Hero/featured with author header
 * - compact: Related posts (image + 1 line)
 * - detailed: Blog grid (4 lines with author)
 * - list: Blog index (horizontal)
 */
export const BlogCard = memo(function BlogCard({
  title,
  excerpt,
  coverImage,
  blurHash,
  author,
  publishedAt,
  category,
  readTime,
  variant = "detailed",
  href,
  showAuthor = false,
}: BlogCardProps) {
  // Format date
  const formatDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // For image variant, add author header overlay
  const imageWithAuthor = showAuthor ? (
    <div className="flex flex-col h-full">
      {/* Author header */}
      <div className="flex items-center gap-[var(--card-gap-sm)] px-[var(--card-gap-sm)] py-[var(--card-gap-sm)] border-b border-[var(--fg-10)] flex-shrink-0">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={32}
            height={32}
            className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded-full object-cover"
          />
        ) : (
          <div className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded-full bg-[var(--card-accent-blog)]/10 flex items-center justify-center text-[var(--card-accent-blog)] text-[var(--card-meta-xs)] font-semibold">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[var(--card-meta-xs)] font-medium text-[var(--fg)] truncate">
            {author.name}
          </p>
          <p className="text-[var(--card-meta-xs)] text-[var(--opacity-muted)]">{formatDate}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative flex-1 min-h-0 aspect-[4/3]">
        <OptimizedImage
          src={coverImage}
          alt={title}
          blurHash={blurHash}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  ) : (
    <div className="relative w-full aspect-[4/3]">
      <OptimizedImage
        src={coverImage}
        alt={title}
        blurHash={blurHash}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  // Variant content
  const variantContent = (
    <>
      {variant === "image" && imageWithAuthor}

      {variant === "compact" && (
        <CompactVariant images={[coverImage]} alt={title} title={title} href={href} />
      )}

      {variant === "detailed" && (
        <div className="flex flex-col h-full">
          {/* Author header */}
          {showAuthor && (
            <div className="flex items-center gap-[var(--card-gap-sm)] px-[var(--card-gap-sm)] py-[var(--card-gap-sm)] border-b border-[var(--fg-10)] flex-shrink-0">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={32}
                  height={32}
                  className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded-full object-cover"
                />
              ) : (
                <div className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded-full bg-[var(--card-accent-blog)]/10 flex items-center justify-center text-[var(--card-accent-blog)] text-[var(--card-meta-xs)] font-semibold">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[var(--card-meta-xs)] font-medium text-[var(--fg)] truncate">
                  {author.name}
                </p>
                <p className="text-[var(--card-meta-xs)] text-[var(--opacity-muted)]">
                  {formatDate}
                </p>
              </div>
            </div>
          )}

          {/* Image */}
          <div className="relative aspect-[4/3] flex-shrink-0">
            <OptimizedImage
              src={coverImage}
              alt={title}
              blurHash={blurHash}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content - 4 lines */}
          <div className="flex flex-col gap-[var(--card-gap-xs)] px-[var(--card-gap-sm)] py-[var(--card-gap-sm)] flex-1">
            <h3 className="text-[var(--card-title-sm)] font-semibold text-[var(--fg)] line-clamp-1">
              {title}
            </h3>
            <p className="text-[var(--font-size-sm)] text-[var(--opacity-medium)] line-clamp-2">
              {excerpt}
            </p>
            <div className="flex items-center justify-between">
              {category && (
                <span className="text-[var(--card-meta-xs)] px-[var(--card-gap-xs)] py-[var(--radius-xs)] rounded bg-[var(--card-accent-blog)]/10 text-[var(--card-accent-blog)]">
                  {category}
                </span>
              )}
              {readTime && (
                <span className="text-[var(--card-meta-xs)] text-[var(--opacity-muted)]">
                  {readTime}m
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {variant === "list" && (
        <ListVariant
          images={[coverImage]}
          alt={title}
          title={title}
          description={excerpt}
          category={category}
          href={href}
          blurHash={blurHash}
        />
      )}
    </>
  )

  return (
    <BaseCard variant={variant} type="blog">
      {variantContent}
    </BaseCard>
  )
})
