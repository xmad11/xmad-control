/* ═══════════════════════════════════════════════════════════════════════════════
   USER DASHBOARD - Personal hub for restaurant discovery
   Simple, on-the-go design with bottom navigation for mobile
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { memo } from "react"
import { FavoritesSection } from "./components/FavoritesSection"
import { QuickActionsSection } from "./components/QuickActionsSection"
import { RecentViewSection } from "./components/RecentViewSection"
import { SavedSearchesSection } from "./components/SavedSearchesSection"

/**
 * User Dashboard - Mobile-first personal hub
 *
 * Features:
 * - Favorites: Saved restaurants and blogs
 * - Recently Viewed: Quick access to places you've seen
 * - Saved Searches: Reusable search filters
 * - Quick Actions: Profile, settings, notifications
 * - Bottom Navigation: Mobile-friendly navigation
 */
export function UserDashboard() {
  return (
    <DashboardLayout userRole="user">
      <PageContainer>
        {/* Header */}
        <header className="py-[var(--spacing-2xl)]">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-xs)]">
            My <span className="text-[var(--color-primary)] italic">Hub</span>
          </h1>
          <p className="text-[var(--font-size-base)] text-[var(--fg-60)]">
            Your saved places and quick actions
          </p>
        </header>

        {/* Favorites Section */}
        <section className="mb-[var(--section-gap-lg)]">
          <FavoritesSection />
        </section>

        {/* Recently Viewed Section */}
        <section className="mb-[var(--section-gap-lg)]">
          <RecentViewSection />
        </section>

        {/* Saved Searches Section */}
        <section className="mb-[var(--section-gap-lg)]">
          <SavedSearchesSection />
        </section>

        {/* Quick Actions Section */}
        <section className="mb-[var(--spacing-4xl)]">
          <QuickActionsSection />
        </section>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-[var(--spacing-5xl)] md:h-[var(--spacing-2xl)]" />
      </PageContainer>
    </DashboardLayout>
  )
}
