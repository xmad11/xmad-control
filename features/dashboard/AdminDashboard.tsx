/* ═══════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD - Platform control & management
   Improved mobile layout with vertical tabs and Website management
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  ArrowDownIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@/components/icons"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { WebsiteManagement } from "@/features/admin/components/WebsiteManagement"
import { useCallback, useState } from "react"

type AdminTab = "overview" | "website" | "restaurants" | "blogs" | "users" | "more"

interface AdminTabConfig {
  id: AdminTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

/**
 * Admin tabs configuration
 */
const adminTabs: AdminTabConfig[] = [
  {
    id: "overview",
    label: "Overview",
    icon: ChartBarIcon,
    description: "Platform statistics and quick actions",
  },
  {
    id: "website",
    label: "Edit",
    icon: GlobeAltIcon,
    description: "Manage homepage, tabs, categories, and content",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: BuildingStorefrontIcon,
    description: "Restaurant approvals and management",
  },
  {
    id: "users",
    label: "Users",
    icon: UserGroupIcon,
    description: "User management and roles",
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: NewspaperIcon,
    description: "Blog content and editorial management",
  },
  {
    id: "more",
    label: "Settings",
    icon: Cog6ToothIcon,
    description: "Settings, reports, and support",
  },
]

/**
 * Admin Dashboard - Complete platform management interface
 *
 * Features:
 * - Mobile-friendly vertical tabs (icon on top, text below)
 * - Website management for homepage content
 * - Restaurant, blog, and user management
 * - Analytics and configuration
 */
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tabId: AdminTab) => {
    setActiveTab(tabId)
  }, [])

  return (
    <DashboardLayout userRole="admin" showRoleBadge={false} title="Admin" subtitle="Dashboard">
      <PageContainer>
        {/* Tab Navigation - Horizontal Scrolling */}
        <nav
          className="mb-[var(--spacing-xl)] mt-[var(--spacing-md)]"
          aria-label="Admin dashboard sections"
        >
          <div
            role="tablist"
            className="flex gap-[var(--spacing-md)] overflow-x-auto pb-[var(--spacing-md)] scrollbar-hide"
          >
            {adminTabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className="
                    group flex items-center gap-[var(--spacing-xs)]
                    px-[var(--spacing-md)] py-[var(--spacing-sm)]
                    min-h-[44px]
                    whitespace-nowrap
                    relative transition-all duration-[var(--duration-normal)]
                  "
                >
                  {/* Icon */}
                  <Icon
                    className="h-[var(--icon-size-base)] w-[var(--icon-size-base)] text-[var(--fg)]"
                    aria-hidden="true"
                  />

                  {/* Label */}
                  <span className="text-[var(--font-size-sm)] font-medium tracking-tight text-[var(--fg)]">
                    {tab.label}
                  </span>

                  {/* Bottom indicator - full width of button */}
                  <span
                    className={`
                      absolute -bottom-2 left-0 right-0
                      h-0.5 rounded-full
                      bg-[var(--color-primary)]
                      transition-all duration-[var(--duration-normal)]
                      ${
                        isActive
                          ? "opacity-[var(--opacity-full)]"
                          : "opacity-[var(--opacity-hidden)]"
                      }
                    `}
                  />
                </button>
              )
            })}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="pb-[var(--spacing-4xl)]">
          <div
            role="tabpanel"
            id="panel-overview"
            tabIndex={activeTab === "overview" ? 0 : -1}
            aria-labelledby="tab-overview"
            hidden={activeTab !== "overview"}
          >
            {activeTab === "overview" && <OverviewSection />}
          </div>
          <div
            role="tabpanel"
            id="panel-website"
            tabIndex={activeTab === "website" ? 0 : -1}
            aria-labelledby="tab-website"
            hidden={activeTab !== "website"}
          >
            {activeTab === "website" && <WebsiteManagement />}
          </div>
          <div
            role="tabpanel"
            id="panel-restaurants"
            tabIndex={activeTab === "restaurants" ? 0 : -1}
            aria-labelledby="tab-restaurants"
            hidden={activeTab !== "restaurants"}
          >
            {activeTab === "restaurants" && <PlaceholderSection title="Restaurants" />}
          </div>
          <div
            role="tabpanel"
            id="panel-blogs"
            tabIndex={activeTab === "blogs" ? 0 : -1}
            aria-labelledby="tab-blogs"
            hidden={activeTab !== "blogs"}
          >
            {activeTab === "blogs" && <PlaceholderSection title="Blogs" />}
          </div>
          <div
            role="tabpanel"
            id="panel-users"
            tabIndex={activeTab === "users" ? 0 : -1}
            aria-labelledby="tab-users"
            hidden={activeTab !== "users"}
          >
            {activeTab === "users" && <PlaceholderSection title="Users" />}
          </div>
          <div
            role="tabpanel"
            id="panel-more"
            tabIndex={activeTab === "more" ? 0 : -1}
            aria-labelledby="tab-more"
            hidden={activeTab !== "more"}
          >
            {activeTab === "more" && <PlaceholderSection title="Settings & More" />}
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
}

/**
 * Overview Section - Quick stats and navigation cards
 */
function OverviewSection() {
  return (
    <div className="space-y-[var(--spacing-2xl)]">
      {/* Quick Stats */}
      <section>
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
          Platform Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
          <OverviewCard
            icon={
              <BuildingStorefrontIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />
            }
            value="248"
            label="Active Restaurants"
            trend="+12 this week"
            trendUp
          />
          <OverviewCard
            icon={<UserGroupIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            value="12.4K"
            label="Total Users"
            trend="+8% this month"
            trendUp
          />
          <OverviewCard
            icon={<ClockIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            value="18"
            label="Pending Approvals"
            trend="Needs attention"
            variant="warning"
          />
          <OverviewCard
            icon={<NewspaperIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            value="156"
            label="Blog Posts"
            trend="+4 this week"
            trendUp
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
          <QuickActionCard
            title="Website Content"
            description="Manage homepage tabs, categories, and hero"
            icon={<GlobeAltIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            actionText="Manage"
          />
          <QuickActionCard
            title="Review Pending"
            description="18 restaurants awaiting approval"
            icon={<ClockIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            actionText="Review Now"
          />
          <QuickActionCard
            title="View Analytics"
            description="Platform performance and insights"
            icon={<ChartBarIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />}
            actionText="View"
          />
        </div>
      </section>
    </div>
  )
}

/**
 * Placeholder Section - For tabs not yet implemented
 */
function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-8xl)] px-[var(--spacing-xl)]">
      <div className="flex h-[var(--spacing-6xl)] w-[var(--spacing-6xl)] items-center justify-center rounded-full bg-[var(--fg-5)] mb-[var(--spacing-xl)]">
        <Cog6ToothIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-30)]" />
      </div>
      <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mb-[var(--spacing-sm)]">
        {title}
      </h2>
      <p className="text-[var(--font-size-base)] text-[var(--fg-60)] text-center max-w-[var(--max-w-md)]">
        This section is coming soon. For now, please use the Website tab to manage homepage content.
      </p>
    </div>
  )
}

/**
 * Overview Card - Stat card with trend
 */
interface OverviewCardProps {
  icon: React.ReactNode
  value: string
  label: string
  trend: string
  trendUp?: boolean
  variant?: "default" | "warning"
}

function OverviewCard({
  icon,
  value,
  label,
  trend,
  trendUp,
  variant = "default",
}: OverviewCardProps) {
  return (
    <div
      className={`
        p-[var(--spacing-sm)] rounded-[var(--radius-md)] border
        ${
          variant === "warning"
            ? "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5"
            : "border-[var(--fg-10)] bg-[var(--card-bg)]"
        }
      `}
    >
      <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-xs)]">
        <div className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[var(--fg-5)] text-[var(--fg-70)]">
          {icon}
        </div>
        <p className="text-[var(--font-size-4xl)] font-bold text-[var(--fg)]">{value}</p>
      </div>
      <p className="text-[var(--font-size-xs)] text-[var(--fg-60)] mb-[var(--spacing-xs)]">
        {label}
      </p>
      <p
        className={`text-[var(--font-size-xs)] font-medium ${
          trendUp ? "text-[var(--color-success)]" : "text-[var(--fg-50)]"
        }`}
      >
        {trend}
      </p>
    </div>
  )
}

/**
 * Quick Action Card - Actionable card
 */
interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  actionText: string
  variant?: "default" | "warning"
}

function QuickActionCard({
  title,
  description,
  icon,
  actionText,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <div
      className={`
        p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border
        ${
          variant === "warning"
            ? "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5"
            : "border-[var(--fg-10)] bg-[var(--card-bg)]"
        }
      `}
    >
      <div className="flex items-start gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
        <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--fg-5)] text-[var(--fg-70)] flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] truncate">
            {title}
          </h3>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        className={`
          w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)]
          font-medium text-[var(--font-size-sm)] transition-all
          ${
            variant === "warning"
              ? "bg-[var(--color-warning)] text-[var(--color-white)] hover:opacity-[var(--hover-opacity)]"
              : "bg-[var(--color-primary)] text-[var(--color-white)] hover:opacity-[var(--hover-opacity)]"
          }
        `}
      >
        {actionText}
      </button>
    </div>
  )
}

// Default export for compatibility
export default AdminDashboard
