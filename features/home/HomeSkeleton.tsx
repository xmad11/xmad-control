/* ═══════════════════════════════════════════════════════════════════════════════
   HOME PAGE SKELETON - 2026 Best Practices
   Skeletons for structure, shimmer ONLY on images (not on text)

   Best Practices Applied:
   - Hero Marquee: Skeleton cards WITH shimmer (images from DB)
   - Tabs: Static skeleton (no shimmer needed)
   - Sections: First section full viewport, subsequent partial
   - Shimmer: Only on card images, NOT on text/elements
   - Theme-aware: Uses CSS variables for light/warm/dark modes
   - Performance: GPU-accelerated, off-screen optimization
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Single Marquee Card Skeleton - WITH shimmer (image placeholder)
 * Uses bg-[var(--fg-10)] for theme-aware background color
 */
function MarqueeCardSkeleton() {
  return (
    <div
      className="flex-shrink-0 rounded-[var(--radius-xl)] bg-[var(--fg-10)] skeleton-shimmer"
      style={{ width: "var(--marquee-card-size)", height: "var(--marquee-card-size)" }}
    />
  )
}

/**
 * Single Preview Card Skeleton - Horizontal scroll card
 * Shimmer ONLY on image, NOT on text
 */
function PreviewCardSkeleton() {
  return (
    <div
      className="flex-shrink-0 bg-[var(--card-bg)] rounded-[var(--radius-xl)] overflow-hidden"
      style={{ width: "var(--card-width-mobile)" }}
    >
      {/* Card Image - WITH shimmer (needs bg color) */}
      <div
        className="bg-[var(--fg-10)] skeleton-shimmer"
        style={{ aspectRatio: "var(--aspect-card)" }}
      />

      {/* Card Content - NO shimmer */}
      <div className="p-[var(--spacing-md)] space-y-[var(--spacing-xs)]">
        <div className="h-[var(--skeleton-height-xs)] bg-[var(--fg-10)] rounded-[var(--radius-md)] w-3/4" />
        <div className="h-[var(--skeleton-height-xs)] bg-[var(--fg-5)] rounded-[var(--radius-sm)] w-1/2" />
      </div>
    </div>
  )
}

/**
 * Section Skeleton - Title + horizontal scroll cards
 */
function SectionSkeleton({ cardCount = 3 }: { cardCount?: number }) {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--spacing-md)] lg:px-[var(--spacing-sm)] py-[var(--spacing-xl)]">
      {/* Section Title - NO shimmer */}
      <div className="flex items-center justify-between mb-[var(--spacing-md)]">
        <div className="h-[calc(var(--font-size-2xl)*1.2)] w-40 bg-[var(--fg-10)] rounded-[var(--radius-md)]" />
        <div className="h-8 w-8 bg-[var(--fg-5)] rounded-full" />
      </div>

      {/* Horizontal Scroll Cards - Shimmer ONLY on images */}
      <div className="flex gap-[var(--spacing-md)] overflow-hidden">
        {Array.from({ length: cardCount }).map((_, i) => (
          <PreviewCardSkeleton key={`card-${i}`} />
        ))}
      </div>
    </section>
  )
}

export function HomeSkeleton() {
  return (
    <div className="min-h-[var(--layout-min-height)]">
      {/* Hero Section - Dual Marquee WITH shimmer */}
      <section className="relative overflow-hidden mb-[var(--spacing-xl)]">
        {/* Top Marquee Row */}
        <div className="mb-[var(--spacing-md)]">
          <div className="flex gap-[var(--spacing-sm)] overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <MarqueeCardSkeleton key={`marquee-1-${i}`} />
            ))}
          </div>
        </div>

        {/* Bottom Marquee Row */}
        <div>
          <div className="flex gap-[var(--spacing-sm)] overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <MarqueeCardSkeleton key={`marquee-2-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Search Skeleton - NO shimmer */}
      <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mb-[var(--spacing-md)]">
        <div className="h-[var(--skeleton-height-lg)] bg-[var(--fg-10)] rounded-[var(--radius-lg)]" />
      </section>

      {/* Tabs Skeleton - NO shimmer */}
      <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-md)]">
        <div className="flex justify-around gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`tab-${i}`}
              className="flex flex-col items-center gap-2 flex-1 max-w-[calc(var(--spacing-md)*6.25)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
            >
              {/* Icon */}
              <div className="w-5 h-5 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
              {/* Label */}
              <div className="h-[var(--skeleton-height-xs)] w-12 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
            </div>
          ))}
        </div>
      </section>

      {/* Tab Sections - First section full viewport, rest partial */}
      {/* Section 1: Full viewport (4 cards for desktop, 3 for mobile) */}
      <SectionSkeleton cardCount={4} />

      {/* Section 2: Partial viewport (3 cards) */}
      <SectionSkeleton cardCount={3} />

      {/* Section 3: Partial viewport (3 cards) */}
      <SectionSkeleton cardCount={3} />
    </div>
  )
}
