/* ═══════════════════════════════════════════════════════════════════════════════
   OWNER DASHBOARD - Business management
   2-grid mobile layout, cards-only UI
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { getOwnerDashboardData } from "@/__mock__/dashboard"
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
} from "@/components/icons"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { DashboardCard } from "@/components/ui"
import { useEffect, useState } from "react"

export default function OwnerDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getOwnerDashboardData>> | null>(null)

  useEffect(() => {
    getOwnerDashboardData().then(setData)
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
            Owner <span className="text-[var(--color-primary)] italic">Dashboard</span>
          </h1>
          <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
            Manage your restaurant profile and content
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
                "My Restaurants": BuildingStorefrontIcon,
                "Active Offers": TagIcon,
                "Profile Views": EyeIcon,
                "Blog Posts": DocumentTextIcon,
              }
              const Icon = icons[stat.label] || ChartBarIcon

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

        {/* My Restaurants - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="flex items-center justify-between mb-[var(--spacing-md)]">
            <h2 className="text-[var(--font-size-lg)] font-semibold">My Restaurants</h2>
            <button
              type="button"
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium"
            >
              <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Add New
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="default"
              size="md"
              icon={
                <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Al Fanar"
              subtitle="Pending Approval"
            />
            <DashboardCard
              variant="success"
              size="md"
              icon={
                <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Arabian Tea House"
              subtitle="Active"
            />
          </div>
        </section>

        {/* Offers Management - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="flex items-center justify-between mb-[var(--spacing-md)]">
            <h2 className="text-[var(--font-size-lg)] font-semibold">Offers & Vouchers</h2>
            <button
              type="button"
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium"
            >
              <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Create Offer
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="default"
              size="md"
              icon={<TagIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="50% Off Lunch"
              subtitle="Active • 23 claimed"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={<TagIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="Free Dessert"
              subtitle="Active • 45 claimed"
            />
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
                <DocumentTextIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              }
              title="Create Blog Post"
              subtitle="Share news"
            />
            <DashboardCard
              variant="default"
              size="md"
              icon={<ChartBarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
              title="View Analytics"
              subtitle="See insights"
            />
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  )
}
