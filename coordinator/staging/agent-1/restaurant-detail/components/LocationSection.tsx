/* ═══════════════════════───────────────────────────────────────────────────────
   LOCATION SECTION - Map, address, and contact info
   Interactive map placeholder with directions
   ═════════════════════─────────────────────────────────────────────────────────── */

"use client"

import type { RestaurantCardData } from "@/components/card"
import { ClockIcon, EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@/components/icons"
import { memo } from "react"

interface LocationSectionProps {
  restaurant: RestaurantCardData
}

/**
 * Location Section - Map, address, and contact information
 *
 * Features:
 * - Interactive map (placeholder)
 * - Full address
 * - Contact information
 * - Opening hours
 * - Get directions button
 */
export function LocationSection({ restaurant }: LocationSectionProps) {
  const fullAddress = `${restaurant.location || "Dubai Festival City Mall"}, Dubai, United Arab Emirates`
  const phone = "+971 4 444 4444"
  const email = "info@alfanar.ae"
  const website = "https://www.alfanarestaurant.ae"

  return (
    <div className="space-y-[var(--spacing-2xl)]">
      {/* Header */}
      <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">Location & Contact</h2>

      {/* Map Placeholder */}
      <div
        className="relative rounded-[var(--radius-xl)] overflow-hidden bg-[var(--fg-5)]"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Map Background (placeholder) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--fg-10)] to-[var(--fg-5)] flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--color-primary)] mx-auto mb-[var(--spacing-md)] opacity-50" />
            <p className="text-[var(--font-size-lg)] font-medium text-[var(--fg-70)]">
              Interactive Map
            </p>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-50)]">
              Map integration coming soon
            </p>
          </div>
        </div>

        {/* Get Directions Button */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[var(--spacing-md)] right-[var(--spacing-md)] inline-flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-[var(--color-white)] rounded-[var(--radius-lg)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity shadow-lg"
        >
          <MapPinIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          Get Directions
        </a>
      </div>

      {/* Address */}
      <section className="p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)]">
        <h3 className="text-[var(--font-size-lg)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
          Address
        </h3>
        <p className="text-[var(--font-size-base)] text-[var(--fg-80)] leading-relaxed">
          {fullAddress}
        </p>
      </section>

      {/* Contact Information */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
        {/* Phone */}
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)] hover:bg-[var(--fg-8)] transition-colors group"
        >
          <div className="flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 transition-colors">
            <PhoneIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Phone</p>
            <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)] truncate">
              {phone}
            </p>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)] hover:bg-[var(--fg-8)] transition-colors group"
        >
          <div className="flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 transition-colors">
            <EnvelopeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Email</p>
            <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)] truncate">
              {email}
            </p>
          </div>
        </a>

        {/* Website */}
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)] hover:bg-[var(--fg-8)] transition-colors group"
        >
          <div className="flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 transition-colors">
            <GlobeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Website</p>
            <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)] truncate">
              Visit Website
            </p>
          </div>
        </a>

        {/* Hours */}
        <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)]">
          <div className="flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full bg-[var(--color-success)]/10">
            <ClockIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-success)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Hours</p>
            <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">Open now</p>
          </div>
        </div>
      </section>

      {/* Opening Hours Detail */}
      <section className="p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-xl)]">
        <h3 className="text-[var(--font-size-lg)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
          Opening Hours
        </h3>
        <div className="space-y-[var(--spacing-sm)]">
          {[
            { days: "Monday - Thursday", hours: "10:00 AM - 10:00 PM" },
            { days: "Friday - Saturday", hours: "10:00 AM - 11:00 PM" },
            { days: "Sunday", hours: "10:00 AM - 10:00 PM" },
          ].map((schedule, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-[var(--spacing-xs)] border-b border-[var(--fg-10)] last:border-0"
            >
              <span className="text-[var(--font-size-base)] text-[var(--fg-80)]">
                {schedule.days}
              </span>
              <span className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export const LocationSection = memo(LocationSection)
