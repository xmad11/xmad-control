/* ═══════════════════════════════════════════════════════════════════════════════
   USER DASHBOARD - Personal consumption + engagement
   2-grid mobile layout, cards-only UI
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { getUserDashboardData } from "@/__mock__/dashboard"
import { ResponsiveGrid } from "@/components/grid/ResponsiveGrid"
import {
  BuildingStorefrontIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TagIcon,
  UserIcon,
} from "@/components/icons"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { Badge, DashboardCard } from "@/components/ui"
import { useEffect, useState } from "react"

export default function UserDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getUserDashboardData>> | null>(null)

  useEffect(() => {
    getUserDashboardData().then(setData)
  }, [])

  if (!data) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-[var(--fg-70)]">Loading...</div>
          </div>
        </PageContainer>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageContainer>
        {/* Header */}
        <section className="py-[var(--spacing-3xl)]">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            My <span className="text-[var(--color-primary)] italic">Dashboard</span>
          </h1>
          <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
            Your favorites, reviews, and saved content
          </p>
        </section>

        {/* Stats - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-3 lg:grid-cols-4">
            {data.stats.map((stat) => {
              const icons: Record<string, React.ComponentType<{ className?: string }>> = {
                "Saved Restaurants": HeartIcon,
                "Saved Blogs": DocumentTextIcon,
                "Recently Viewed": ClockIcon,
                "Offers Claimed": TagIcon,
              }
              const Icon = icons[stat.label] || StarIcon

              return (
                <DashboardCard
                  key={stat.label}
                  variant="primary"
                  size="sm"
                  icon={<Icon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
                  title={stat.value}
                  subtitle={stat.label}
                />
              )
            })}
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
              icon={
                <MagnifyingGlassIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Search Restaurants"
              subtitle="Find new places"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={
                <DocumentTextIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Read Blogs"
              subtitle="Latest articles"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={<UserIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="Edit Profile"
              subtitle="Update your info"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={<StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="Write Review"
              subtitle="Share experience"
            />
          </div>
        </section>

        {/* Activity - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Recent Activity
          </h2>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="default"
              size="md"
              icon={
                <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Al Fanar"
              subtitle="Viewed 2 hours ago"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={<HeartIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="Saved Places"
              subtitle={data.savedRestaurants.toString()}
            />
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  )
}
