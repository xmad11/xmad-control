/* ═══════════════════════════════════════════════════════════════════════════════
   TERMS OF SERVICE PAGE - shadi.ae platform terms
   ═══════════════════════════════════════════════════════════════════════════════ */

import { PageContainer } from "@/components/layout/PageContainer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Shadi V2",
  description: "Terms of service for shadi.ae",
}

function TermsPageClient() {
  return (
    <main className="relative pt-[var(--header-total-height)] pb-[var(--spacing-4xl)]">
      <PageContainer>
        <article className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-3xl)] text-center">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-md)]">
            Terms of Service
          </h1>
          <p className="text-[var(--fg-60)] mb-[var(--spacing-2xl)]">
            Last Updated: January 8, 2026
          </p>

          <section className="text-left space-y-[var(--spacing-lg)]">
            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              1. Acceptance of Terms
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              By accessing or using shadi.ae (the "Site"), you agree to be legally bound by these
              Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must
              not use this Site. Your use of the Site constitutes acceptance of these Terms.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              2. Definitions
            </h2>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>
                <strong>"Platform"</strong> means shadi.ae, including all web pages, services,
                search functions, and related mobile offerings.
              </li>
              <li>
                <strong>"User," "You," or "Your"</strong> means any person accessing or using the
                Platform.
              </li>
              <li>
                <strong>"Content"</strong> refers to all text, data, listings, reviews, ratings,
                images, and information provided on the Platform.
              </li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              3. Scope of Service
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              shadi.ae provides an online restaurant search and discovery service for restaurants,
              cafes, and food businesses in the UAE. The Platform is offered "as is" and may be
              updated, modified, or discontinued at any time without notice.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              4. User Obligations
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">You agree to:</p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>
                Provide accurate, current, and complete information when interacting with the
                Platform;
              </li>
              <li>
                Comply with all applicable laws, regulations, and guidelines when using the
                Platform;
              </li>
              <li>Not post any unlawful, harmful, defamatory, obscene, or infringing Content.</li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              5. Intellectual Property
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              All content and materials on shadi.ae are owned by or licensed to shadi.ae. Users must
              not copy, modify, transmit, distribute, or create derivative works without written
              permission.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              6. Privacy and Personal Data
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              Your use of the Site is also governed by our Privacy Policy below, which is expressly
              incorporated into these Terms.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              7. Limitation of Liability
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              To the maximum extent permitted under UAE law, shadi.ae and its owners shall not be
              liable for any direct, indirect, incidental, consequential, or punitive damages
              arising from your access or use of the Platform.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              8. Governing Law
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              These Terms are governed by the laws of the United Arab Emirates. Any dispute arising
              out of or related to these Terms will be resolved exclusively in the courts of the
              UAE.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              9. Changes to Terms
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              shadi.ae may update these Terms at any time without prior notice. Continued use of the
              Platform constitutes acceptance of the updated Terms.
            </p>
          </section>
        </article>
      </PageContainer>
    </main>
  )
}

export default function TermsPage() {
  return <TermsPageClient />
}
