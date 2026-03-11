/* ═══════════════════════════════════════════════════════════════════════════════
   BUSINESS CTA - Partnership opportunities section
   For businesses to join, request reviews, or send products
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BuildingStorefrontIcon,
  CameraIcon,
  EnvelopeIcon,
  SparklesIcon,
  StarIcon,
} from "@/components/icons"
import { memo } from "react"

const partnerships = [
  {
    icon: BuildingStorefrontIcon,
    title: "List Your Business",
    description: "Join 7,000+ restaurants",
    cta: "Register →",
    href: "/register",
  },
  {
    icon: CameraIcon,
    title: "Request a Visit",
    description: "Get reviewed by @the.ss",
    cta: "Request →",
    href: "/business/request-visit",
  },
  {
    icon: EnvelopeIcon,
    title: "Send Products",
    description: "Feature on Instagram",
    cta: "Send →",
    href: "/business/send-products",
  },
  {
    icon: SparklesIcon,
    title: "Home Businesses",
    description: "Special program available",
    cta: "Join →",
    href: "/register",
  },
]

/**
 * Business CTA Section
 */
const BusinessCTA = memo(function BusinessCTA() {
  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-2xl)]">
      {/* Section Header */}
      <div className="text-center mb-[var(--spacing-xl)]">
        <div className="inline-flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
          <StarIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
          <span className="text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-primary">
            Partner With Us
          </span>
        </div>
        <h2 className="text-[var(--font-size-2xl)] md:text-[var(--font-size-3xl)] font-black text-[var(--fg)] mb-[var(--spacing-sm)]">
          Grow Your Food & Beverage Business
        </h2>
        <p className="text-[var(--font-size-sm)] text-secondary-gray">
          Join the UAE's fastest-growing restaurant recommendation platform by{" "}
          <span className="font-semibold text-[var(--color-primary)]">@the.ss</span> (100K+
          Instagram followers)
        </p>
      </div>

      {/* Partnership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)] mb-[var(--spacing-xl)]">
        {partnerships.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group relative w-full bg-[var(--card-bg)] rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] transition-all"
          >
            {/* Side Color Accent - Right side curved bar with theme color gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-[var(--spacing-2xl)] accent-gradient" />

            <div className="p-[var(--spacing-md)] pr-[var(--spacing-3xl)]">
              <h4 className="font-bold text-[var(--font-size-lg)] text-[var(--fg)] mb-[var(--spacing-xs)]">
                {item.title}
              </h4>
              <p className="text-[var(--font-size-sm)] text-secondary-gray">{item.description}</p>
              <div className="flex items-center gap-[var(--spacing-xs)] mt-[var(--spacing-sm)] justify-end">
                <span className="text-[var(--font-size-xs)] text-secondary-gray">{item.cta}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="bg-[var(--card-bg)] rounded-[var(--radius-3xl)] rounded-t-[var(--radius-lg)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] transition-all p-[var(--spacing-lg)] md:p-[var(--spacing-xl)] text-center border border-[var(--fg-10)]">
        <p className="text-[var(--font-size-base)] md:text-[var(--font-size-lg)] font-bold text-[var(--fg)] mb-[var(--spacing-sm)]">
          Already have a business account?
        </p>
        <p className="text-[var(--font-size-sm)] text-secondary-gray mb-[var(--spacing-md)]">
          Sign in to manage your profile, respond to reviews, and track your performance
        </p>
        <a
          href="/business/signin"
          className="inline-block px-[var(--spacing-xl)] py-[var(--spacing-md)] bg-[var(--color-primary)] border-2 border-[var(--color-primary)] text-[var(--fg)] font-bold rounded-[var(--radius-lg)] hover:bg-[var(--color-primary)]/[0.8] transition-all text-[var(--font-size-base)]"
        >
          Business Sign In
        </a>
      </div>
    </section>
  )
})

export { BusinessCTA }
