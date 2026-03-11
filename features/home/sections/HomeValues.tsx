/* ═══════════════════════════════════════════════════════════════════════════════
   HOME VALUES - Trust / Value propositions section
   Static content, no state, no logic
   ═══════════════════════════════════════════════════════════════════════════════ */

import { BeakerIcon, CheckBadgeIcon, ScaleIcon } from "@/components/icons"

const values = [
  {
    icon: CheckBadgeIcon,
    title: "7,000+ Restaurants",
    description: "Curated & verified spots",
  },
  {
    icon: BeakerIcon,
    title: "Smart Search",
    description: "Match your taste instantly",
  },
  {
    icon: ScaleIcon,
    title: "Real Guides",
    description: "No sponsored bias",
  },
]

/**
 * HomeValues - Trust / Value section
 *
 * What it DOES:
 * - Show value propositions
 * - Build trust
 *
 * What it does NOT do:
 * - No state
 * - No API calls
 */
export function HomeValues() {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-tablet)] lg:py-[var(--section-spacing-desktop)]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-lg)] text-center">
        {values.map((value) => (
          <div key={value.title} className="space-y-[var(--spacing-sm)]">
            {/* Icon */}
            <div className="inline-flex h-[calc(var(--icon-size-lg)*2)] w-[calc(var(--icon-size-lg)*2)] items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10">
              <value.icon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
            </div>

            {/* Title */}
            <h3 className="text-[var(--font-size-base)] md:text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {value.title}
            </h3>

            {/* Description */}
            <p className="text-[var(--font-size-sm)] text-[var(--fg)] opacity-[var(--opacity-medium)]">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
