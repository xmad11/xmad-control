/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CATEGORIES - Static category links
   Links only, no logic, no state
   Horizontally scrollable on mobile
   ═══════════════════════════════════════════════════════════════════════════════ */

const categories = [
  { label: "Pizza", slug: "pizza" },
  { label: "Burger", slug: "burger" },
  { label: "Coffee", slug: "coffee" },
  { label: "Sushi", slug: "sushi" },
  { label: "Vegan", slug: "vegan" },
  { label: "Fine Dining", slug: "fine-dining" },
  { label: "Brunch", slug: "brunch" },
  { label: "Dessert", slug: "dessert" },
]

/**
 * HomeCategories - Static category navigation
 *
 * What it DOES:
 * - Render category links
 * - Route to /restaurants with cuisine filter
 * - Horizontal scroll on mobile
 *
 * What it does NOT do:
 * - No state
 * - No API calls
 */
export function HomeCategories() {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-tablet)] lg:py-[var(--section-spacing-desktop)]">
      {/* Mobile: horizontal scroll */}
      <div className="flex gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-xs)] scrollbar-hide sm:justify-center sm:flex-wrap">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/restaurants?cuisine=${category.slug}`}
            className="flex-shrink-0 px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-full border border-[var(--fg-20)] text-[var(--fg)] hover:bg-[var(--fg-10)] hover:border-[var(--fg-40)] transition-colors duration-[var(--duration-normal)] text-[var(--font-size-sm)] font-medium"
          >
            {category.label}
          </a>
        ))}
        <a
          href="/restaurants"
          className="flex-shrink-0 px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-full bg-[var(--color-primary)] text-[var(--bg)] hover:opacity-90 transition-opacity duration-[var(--duration-normal)] text-[var(--font-size-sm)] font-bold"
        >
          View all →
        </a>
      </div>
    </section>
  )
}
