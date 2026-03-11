/* ═══════════════════════════════════════════════════════════════════════════════
   HOME TRENDING BLOGS - Preview section (3 items max)
   Uses existing BlogCard, imports from centralized mock data
   ═══════════════════════════════════════════════════════════════════════════════ */

import { BlogCard } from "@/components/card"
import type { BlogCardData } from "@/components/card"
import { mockBlogs } from "@/data/mocks"

/**
 * HomeTrendingBlogs - Preview section with 3 items max
 *
 * What it DOES:
 * - Show 3 trending blog posts
 * - Use existing BlogCard
 * - Link to /blog for more
 * - Import from centralized mock data (DRY principle)
 *
 * What it does NOT do:
 * - No pagination
 * - No infinite scroll
 * - No API calls
 * - No duplicate mock data
 */
export function HomeTrendingBlogs() {
  // Use first 3 items from centralized mock data
  const trendingBlogs: BlogCardData[] = mockBlogs.slice(0, 3)

  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-tablet)] lg:py-[var(--section-spacing-desktop)]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-xl)] md:text-[var(--font-size-2xl)] font-black text-[var(--fg)]">
          Food & <span className="text-[var(--color-primary)] italic">Dining Guides</span>
        </h2>
        <a
          href="/blog"
          className="text-[var(--font-size-sm)] font-bold text-[var(--color-primary)] hover:underline"
        >
          Read more →
        </a>
      </div>

      {/* Cards grid - 3 items only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)] md:gap-[var(--spacing-lg)]">
        {trendingBlogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </section>
  )
}
