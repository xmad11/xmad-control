/* ═══════════════════════════════════════════════════════════════════════════════
   PRIVACY POLICY PAGE - shadi.ae platform privacy
   ═══════════════════════════════════════════════════════════════════════════════ */

import { PageContainer } from "@/components/layout/PageContainer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Shadi V2",
  description: "Privacy policy for shadi.ae",
}

function PrivacyPageClient() {
  return (
    <main className="relative pt-[var(--header-total-height)] pb-[var(--spacing-4xl)]">
      <PageContainer>
        <article className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-3xl)] text-center">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-md)]">
            Privacy Policy
          </h1>
          <p className="text-[var(--fg-60)] mb-[var(--spacing-2xl)]">
            Effective Date: January 8, 2026
          </p>

          <section className="text-left space-y-[var(--spacing-lg)]">
            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              1. Introduction
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              shadi.ae ("we," "us," "our") is committed to protecting your privacy. This Privacy
              Policy explains what personal data we collect, how we use it, how we protect it, and
              your rights regarding your information.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              2. What We Collect
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We may collect personal data you provide voluntarily when you use our services, such
              as:
            </p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>Name;</li>
              <li>Email address;</li>
              <li>Phone number;</li>
              <li>Restaurant preferences, search history.</li>
            </ul>
            <p className="text-[var(--fg-70)] leading-relaxed mt-[var(--spacing-sm)]">
              We may also collect technical non-personal data automatically, such as:
            </p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>IP address;</li>
              <li>Browser type;</li>
              <li>Pages visited;</li>
              <li>Time and date of access.</li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              3. How We Use Your Information
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">We use your information to:</p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>Provide and improve services;</li>
              <li>Personalize your experience;</li>
              <li>Communicate with you regarding updates and features;</li>
              <li>Comply with legal obligations.</li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              4. Cookies and Tracking
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We use cookies and similar technologies to improve Site performance, user experience,
              and analytics. You may disable cookies through your browser settings, but this may
              affect functionality.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              5. Data Sharing
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We do not sell or share your personal data with third parties except:
            </p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>With service providers who help operate the Platform;</li>
              <li>To comply with legal requirements;</li>
              <li>To protect the rights, property, or safety of our users or others.</li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              6. Data Security
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We implement appropriate technical and administrative measures to protect your data
              against unauthorized access, alteration, or destruction.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              7. Retention
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We retain your information only as long as necessary for the purposes outlined in this
              policy or as required by law.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              8. Your Rights
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">You may have rights to:</p>
            <ul className="list-disc list-inside text-[var(--fg-70)] space-y-[var(--spacing-sm)] leading-relaxed">
              <li>Access your personal data;</li>
              <li>Correct inaccuracies;</li>
              <li>Delete your data (subject to legal and operational requirements).</li>
            </ul>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              9. Applicable Data Protection Law
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              The processing of personal data through electronic systems targeting UAE residents is
              subject to the UAE Personal Data Protection Law (PDPL) and relevant regulations. Your
              use of the Platform indicates your consent to this policy and the processing of your
              data under applicable UAE law.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              10. Changes to Privacy Policy
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              We may update this Privacy Policy from time to time. Continued use of the Platform
              after updates constitutes acceptance of the changes.
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xl)] mb-[var(--spacing-sm)]">
              11. Contact
            </h2>
            <p className="text-[var(--fg-70)] leading-relaxed">
              For questions about this policy, email:{" "}
              <a
                href="mailto:privacy@shadi.ae"
                className="text-[var(--color-brand-primary)] hover:underline"
              >
                privacy@shadi.ae
              </a>
            </p>
          </section>
        </article>
      </PageContainer>
    </main>
  )
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
