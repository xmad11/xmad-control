/* ═══════════════════════════════════════════════════════════════════════════════
   SKELETON CARD - 2026 Best Practices pure CSS shimmer
   Lightweight, optimized, uses design tokens only

   Shimmer ONLY on image, NOT on text (per 2026 best practices)
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface SkeletonCardProps {
  aspect?: "card" | "hero" | "list"
  lines?: number
  showIcon?: boolean
  className?: string
}

/**
 * SkeletonCard - Pure CSS shimmer loading placeholder
 *
 * Uses design tokens only - no hardcoded values
 * Shimmer ONLY on image placeholder, NOT on text lines
 *
 * @example
 * <SkeletonCard aspect="card" lines={3} />
 * <SkeletonCard aspect="hero" lines={2} />
 */
export function SkeletonCard({
  aspect = "card",
  lines = 3,
  showIcon = false,
  className = "",
}: SkeletonCardProps) {
  // Map aspect prop to CSS token
  const aspectRatio = {
    card: "var(--aspect-card)",
    hero: "var(--aspect-hero)",
    list: "var(--aspect-list)",
  }[aspect]

  return (
    <div className={`bg-[var(--card-bg)] rounded-[var(--radius-xl)] overflow-hidden ${className}`}>
      {/* Image skeleton - WITH shimmer (needs bg color) */}
      <div className="bg-[var(--fg-10)] skeleton-shimmer" style={{ aspectRatio }} />

      {/* Content lines skeleton - NO shimmer */}
      <div className="p-[var(--spacing-md)] space-y-[var(--spacing-sm)]">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--fg-10)] rounded-[var(--radius-md)]"
            style={{
              width: i === 0 ? "75%" : "50%",
              height: "var(--skeleton-height-xs)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
