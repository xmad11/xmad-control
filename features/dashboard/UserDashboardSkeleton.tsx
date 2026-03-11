/* ═══════════════════════════════════════════════════════════════════════════════
   USER DASHBOARD SKELETON - 2026 Best Practices (NO shimmer for admin)
   Functional skeleton only - Admins prefer clarity over animations
   ═══════════════════════════════════════════════════════════════════════════════ */

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"

export function UserDashboardSkeleton() {
  return (
    <DashboardLayout>
      <PageContainer>
        {/* Header Skeleton */}
        <section className="py-[var(--spacing-3xl)]">
          <div className="space-y-[var(--spacing-xs)]">
            <div className="h-[calc(var(--font-size-4xl)*1.2)] w-2/3 bg-[var(--fg-10)] rounded-[var(--radius-md)]" />
            <div className="h-[var(--skeleton-height-sm)] w-1/2 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
          </div>
        </section>

        {/* Stats Section Skeleton - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="h-[var(--skeleton-height-sm)] w-32 bg-[var(--fg-10)] rounded-[var(--radius-md)] mb-[var(--spacing-md)]" />
          <div className="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`stat-${i}`}
                className="bg-[var(--card-bg)] p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)]"
              >
                <div className="flex items-center justify-between mb-[var(--spacing-sm)]">
                  <div className="w-10 h-10 bg-[var(--fg-5)] rounded-[var(--radius-md)]" />
                </div>
                <div className="h-[calc(var(--font-size-2xl)*1.2)] w-16 bg-[var(--fg-10)] rounded-[var(--radius-sm)] mb-[var(--spacing-xs)]" />
                <div className="h-[var(--skeleton-height-xs)] w-24 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Skeleton - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="h-[var(--skeleton-height-sm)] w-36 bg-[var(--fg-10)] rounded-[var(--radius-md)] mb-[var(--spacing-md)]" />
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`action-${i}`}
                className="bg-[var(--card-bg)] p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)]"
              >
                <div className="flex items-start gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
                  <div className="w-10 h-10 bg-[var(--fg-5)] rounded-[var(--radius-md)] flex-shrink-0" />
                  <div className="flex-1 space-y-[var(--spacing-xs)]">
                    <div className="h-[var(--skeleton-height-sm)] w-3/4 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
                    <div className="h-[var(--skeleton-height-xs)] w-1/2 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity Skeleton - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-md)]">
          <div className="h-[var(--skeleton-height-sm)] w-40 bg-[var(--fg-10)] rounded-[var(--radius-md)] mb-[var(--spacing-md)]" />
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`activity-${i}`}
                className="bg-[var(--card-bg)] p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)]"
              >
                <div className="flex items-start gap-[var(--spacing-md)]">
                  <div className="w-10 h-10 bg-[var(--fg-5)] rounded-[var(--radius-md)] flex-shrink-0" />
                  <div className="flex-1 space-y-[var(--spacing-xs)]">
                    <div className="h-[var(--skeleton-height-sm)] w-24 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
                    <div className="h-[var(--skeleton-height-xs)] w-32 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  )
}
