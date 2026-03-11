/* ═══════════════════════════════════════════════════════════════════════════════
   BLOG PAGE SKELETON - 2026 Best Practices
   Skeletons for structure, shimmer ONLY on card images (not on text)

   Theme-aware: Uses CSS variables for light/warm/dark modes
   Performance: GPU-accelerated, off-screen optimization
   ═══════════════════════════════════════════════════════════════════════════════ */

export function BlogSkeleton() {
  return (
    <div className="min-h-[var(--layout-min-height)]">
      <main id="main-content" className="relative pt-0 pb-[var(--spacing-4xl)]">
        {/* Page Title Skeleton - NO shimmer */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-md)] pb-0">
          <div className="space-y-[var(--spacing-xs)]">
            <div className="h-[calc(var(--font-size-5xl)*1.2)] w-2/3 bg-[var(--fg-10)] rounded-[var(--radius-md)]" />
            <div className="h-[var(--skeleton-height-sm)] w-1/2 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
          </div>
        </section>

        {/* Search Skeleton - NO shimmer */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-md)] mb-[var(--spacing-md)]">
          <div className="h-[var(--skeleton-height-lg)] bg-[var(--fg-10)] rounded-[var(--radius-lg)]" />
        </section>

        {/* Category Pills Skeleton - NO shimmer */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mb-[var(--spacing-md)]">
          <div className="flex items-center gap-[var(--spacing-sm)] overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`category-${i}`}
                className="h-[calc(var(--spacing-md)*2.5)] px-[var(--spacing-md)] bg-[var(--fg-10)] rounded-full flex-shrink-0"
                style={{ width: i === 0 ? "4rem" : i === 1 ? "5rem" : "6rem" }}
              />
            ))}
          </div>
        </section>

        {/* Blog Cards Grid - Shimmer ONLY on images */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`blog-${i}`}
                className="bg-[var(--card-bg)] rounded-[var(--radius-xl)] overflow-hidden"
              >
                {/* Card Image - WITH shimmer (needs bg color) */}
                <div
                  className="bg-[var(--fg-10)] skeleton-shimmer"
                  style={{ aspectRatio: "var(--aspect-card)" }}
                />

                {/* Card Content - NO shimmer */}
                <div className="p-[var(--spacing-md)] space-y-[var(--spacing-sm)]">
                  {/* Category badge */}
                  <div className="h-[var(--skeleton-height-xs)] w-16 bg-[var(--fg-5)] rounded-full" />

                  {/* Title */}
                  <div className="h-[var(--skeleton-height-sm)] bg-[var(--fg-10)] rounded-[var(--radius-md)]" />

                  {/* Excerpt lines */}
                  <div className="space-y-[var(--spacing-xs)]">
                    <div className="h-[var(--skeleton-height-xs)] bg-[var(--fg-5)] rounded-[var(--radius-sm)] w-full" />
                    <div className="h-[var(--skeleton-height-xs)] bg-[var(--fg-5)] rounded-[var(--radius-sm)] w-3/4" />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-[var(--spacing-sm)]">
                    <div className="h-[var(--skeleton-height-xs)] w-20 bg-[var(--fg-5)] rounded-full" />
                    <div className="h-[var(--skeleton-height-xs)] w-16 bg-[var(--fg-5)] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
