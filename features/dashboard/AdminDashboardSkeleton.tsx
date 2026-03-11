/* ═══════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD SKELETON - 2026 Best Practices (NO shimmer for admin)
   Functional skeleton only - Admins prefer clarity over animations
   ═══════════════════════════════════════════════════════════════════════════════ */

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"

export function AdminDashboardSkeleton() {
  return (
    <DashboardLayout userRole="admin">
      <PageContainer>
        {/* Header Skeleton */}
        <section className="py-[var(--spacing-2xl)] md:py-[var(--spacing-3xl)]">
          <div className="space-y-[var(--spacing-xs)]">
            <div className="h-[calc(var(--font-size-4xl)*1.2)] w-2/3 bg-[var(--fg-10)] rounded-[var(--radius-md)]" />
            <div className="h-[var(--skeleton-height-sm)] w-1/2 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
          </div>
        </section>

        {/* Tab Navigation Skeleton - Mobile Friendly with Vertical Layout */}
        <nav className="mb-[var(--spacing-xl)]" aria-label="Admin dashboard sections">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-[var(--spacing-sm)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`tab-${i}`}
                className="flex flex-col items-center justify-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-md)] min-h-[70px] sm:min-h-[80px] bg-[var(--fg-5)] rounded-[var(--radius-lg)]"
              >
                <div className="w-6 h-6 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
                <div className="h-[var(--skeleton-height-xs)] w-12 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
              </div>
            ))}
          </div>
        </nav>

        {/* Overview Section Skeleton */}
        <div className="pb-[var(--spacing-4xl)] space-y-[var(--spacing-2xl)]">
          {/* Quick Stats */}
          <section>
            <div className="h-[var(--skeleton-height-sm)] w-48 bg-[var(--fg-10)] rounded-[var(--radius-md)] mb-[var(--spacing-md)]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`stat-${i}`}
                  className="bg-[var(--card-bg)] p-[var(--spacing-md)] sm:p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)]"
                >
                  <div className="flex items-start justify-between mb-[var(--spacing-sm)]">
                    <div className="w-10 h-10 bg-[var(--fg-5)] rounded-[var(--radius-md)]" />
                  </div>
                  <div className="h-[calc(var(--font-size-2xl)*1.2)] w-16 bg-[var(--fg-10)] rounded-[var(--radius-sm)] mb-[var(--spacing-xs)]" />
                  <div className="h-[var(--skeleton-height-xs)] w-24 bg-[var(--fg-5)] rounded-[var(--radius-sm)] mb-[var(--spacing-xs)]" />
                  <div className="h-[var(--skeleton-height-xs)] w-28 bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="h-[var(--skeleton-height-sm)] w-40 bg-[var(--fg-10)] rounded-[var(--radius-md)] mb-[var(--spacing-md)]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`action-${i}`}
                  className="bg-[var(--card-bg)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)]"
                >
                  <div className="flex items-start gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
                    <div className="w-10 h-10 bg-[var(--fg-5)] rounded-[var(--radius-md)] flex-shrink-0" />
                    <div className="flex-1 space-y-[var(--spacing-xs)]">
                      <div className="h-[var(--skeleton-height-sm)] w-3/4 bg-[var(--fg-10)] rounded-[var(--radius-sm)]" />
                      <div className="h-[var(--skeleton-height-xs)] w-full bg-[var(--fg-5)] rounded-[var(--radius-sm)]" />
                    </div>
                  </div>
                  <div className="h-[calc(var(--spacing-md)*2.5)] w-full bg-[var(--fg-5)] rounded-[var(--radius-md)]" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
}
