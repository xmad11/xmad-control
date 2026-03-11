/* ═══════════════════════════════════════════════════════════════════════════════
   PROFILE PAGE - Avatar, info, and stats cards
   2-grid mobile layout
   ═══════════════════════════════════════════════════════════════════════════════ */

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { DashboardCard } from "@/components/ui"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile - Shadi V2",
  description: "Your profile settings",
}

function ProfileClient() {
  return (
    <DashboardLayout userRole="user">
      <PageContainer>
        {/* Header */}
        <section className="py-[var(--spacing-3xl)]">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            My <span className="text-[var(--color-primary)] italic">Profile</span>
          </h1>
          <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
            Manage your account settings
          </p>
        </section>

        {/* Profile Card */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-2xl)] p-[var(--spacing-2xl)]">
            <div className="flex flex-col sm:flex-row items-center gap-[var(--spacing-xl)]">
              {/* Avatar */}
              {/* @design-exception HARDCODED_SPACING: Avatar container and icon size need specific pixel values for proper visual proportions */}
              <div className="relative">
                <div
                  className="rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 flex items-center justify-center"
                  style={{ height: "120px", width: "120px" }} // @design-exception HARDCODED_SPACING: Avatar container needs fixed size for circular shape
                >
                  <svg
                    className="text-[var(--color-primary)]"
                    style={{ height: "60px", width: "60px" }} // @design-exception HARDCODED_SPACING: Icon size needs fixed pixel value for visual balance
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex items-center justify-center p-[var(--spacing-sm)] bg-[var(--color-primary)] text-[var(--color-white)] rounded-[var(--radius-full)]"
                  style={{ minHeight: "44px", minWidth: "44px" }} // @design-exception DYNAMIC_VALUE: Touch target minimum size per Apple HIG (44px)
                >
                  <svg
                    className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mb-[var(--spacing-xs)]">
                  Ahmed Abdullah
                </h2>
                <p className="text-[var(--font-size-base)] text-[var(--fg-70)] mb-[var(--spacing-sm)]">
                  ahmed@example.com
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-[var(--spacing-sm)]">
                  <span className="inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[var(--font-size-xs)] font-semibold uppercase">
                    User
                  </span>
                  <span className="text-[var(--font-size-sm)] text-[var(--fg-50)]">
                    Joined Jan 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Activity Stats
          </h2>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard variant="primary" size="md" title="24" subtitle="Saved Restaurants" />
            <DashboardCard variant="primary" size="md" title="12" subtitle="Saved Blogs" />
            <DashboardCard variant="primary" size="md" title="48" subtitle="Recently Viewed" />
            <DashboardCard variant="primary" size="md" title="5" subtitle="Offers Claimed" />
          </div>
        </section>

        {/* Quick Actions - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="default"
              size="md"
              title="Edit Profile"
              subtitle="Update your info"
            />
            <DashboardCard
              variant="default"
              size="md"
              title="Change Password"
              subtitle="Security settings"
            />
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  )
}

export default function ProfilePage() {
  return <ProfileClient />
}
