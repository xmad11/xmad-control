/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CTA - Final call-to-action section
   Static content, links to /restaurants
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * HomeCTA - Final call-to-action
 *
 * What it DOES:
 * - Encourage action
 * - Link to /restaurants
 *
 * What it does NOT do:
 * - No state
 * - No API calls
 */
export function HomeCTA() {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-tablet)] lg:py-[var(--section-spacing-desktop)] text-center">
      {/* Heading */}
      <h2 className="text-[var(--font-size-2xl)] md:text-[var(--font-size-3xl)] font-black text-[var(--fg)] mb-[var(--spacing-sm)]">
        Ready to explore?
      </h2>

      {/* Subtext */}
      <p className="text-[var(--font-size-sm)] text-[var(--fg)] opacity-[var(--opacity-medium)] mb-[var(--spacing-lg)] max-w-md mx-auto">
        Discover the best restaurants near you
      </p>

      {/* CTA Button */}
      <a
        href="/restaurants"
        className="inline-block px-[var(--spacing-2xl)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-[var(--bg)] font-bold rounded-[var(--radius-xl)] hover:opacity-90 transition-opacity text-[var(--font-size-base)]"
      >
        Browse Restaurants
      </a>
    </section>
  )
}
