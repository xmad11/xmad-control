/* ═══════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD - Platform control & management
   Improved mobile layout with vertical tabs and Website management
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
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
import { memo, useCallback, useState } from "react"
import { ActivityFeed } from "./components/ActivityFeed"
import { AnalyticsDashboard } from "./components/AnalyticsDashboard"
import { ContentModeration } from "./components/ContentModeration"
import { ReportsExports } from "./components/ReportsExport"
import { RestaurantApprovalQueue } from "./components/RestaurantApprovalQueue"
import { SupportTickets } from "./components/SupportTickets"
import { SystemConfiguration } from "./components/SystemConfiguration"
import { UserManagement } from "./components/UserManagement"
import { WebsiteManagement } from "./components/WebsiteManagement"

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
    label: "Website",
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
    id: "blogs",
    label: "Blogs",
    icon: NewspaperIcon,
    description: "Blog content and editorial management",
  },
  {
    id: "users",
    label: "Users",
    icon: UserGroupIcon,
    description: "User management and roles",
  },
  {
    id: "more",
    label: "More",
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
    <DashboardLayout userRole="admin">
      <PageContainer>
        {/* Header */}
        <section className="py-[var(--spacing-2xl)] md:py-[var(--spacing-3xl)]">
          <h1 className="text-[var(--font-size-3xl)] md:text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            Admin <span className="text-[var(--color-primary)] italic">Dashboard</span>
          </h1>
          <p className="text-[var(--font-size-base)] md:text-[var(--font-size-lg)] text-[var(--fg-60)]">
            Platform management and administration
          </p>
        </section>

        {/* Tab Navigation - Mobile Friendly with Vertical Layout */}
        <nav className="mb-[var(--spacing-xl)]" aria-label="Admin dashboard sections">
          <div role="tablist" className="grid grid-cols-3 sm:grid-cols-6 gap-[var(--spacing-sm)]">
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
                  className={`
                    group flex flex-col items-center justify-center gap-[var(--spacing-xs)]
                    px-[var(--spacing-sm)] py-[var(--spacing-md)]
                    min-h-[70px] sm:min-h-[80px]
                    rounded-[var(--radius-lg)]
                    transition-all duration-[var(--duration-fast)]
                    ${
                      isActive
                        ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                        : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                    }
                  `}
                >
                  <Icon
                    className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] sm:h-[var(--icon-size-xl)] sm:w-[var(--icon-size-xl)]"
                    aria-hidden="true"
                  />
                  <span className="text-[var(--font-size-xs)] sm:text-[var(--font-size-sm)] font-medium text-center leading-tight">
                    {tab.label}
                  </span>
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
            {activeTab === "restaurants" && <RestaurantApprovalQueue />}
          </div>
          <div
            role="tabpanel"
            id="panel-blogs"
            tabIndex={activeTab === "blogs" ? 0 : -1}
            aria-labelledby="tab-blogs"
            hidden={activeTab !== "blogs"}
          >
            {activeTab === "blogs" && <ContentModeration />}
          </div>
          <div
            role="tabpanel"
            id="panel-users"
            tabIndex={activeTab === "users" ? 0 : -1}
            aria-labelledby="tab-users"
            hidden={activeTab !== "users"}
          >
            {activeTab === "users" && <UserManagement />}
          </div>
          <div
            role="tabpanel"
            id="panel-more"
            tabIndex={activeTab === "more" ? 0 : -1}
            aria-labelledby="tab-more"
            hidden={activeTab !== "more"}
          >
            {activeTab === "more" && <MoreSection />}
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
              <BuildingStorefrontIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />
            }
            value="248"
            label="Active Restaurants"
            trend="+12 this week"
            trendUp
          />
          <OverviewCard
            icon={<UserGroupIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
            value="12.4K"
            label="Total Users"
            trend="+8% this month"
            trendUp
          />
          <OverviewCard
            icon={<ClockIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
            value="18"
            label="Pending Approvals"
            trend="Needs attention"
            variant="warning"
          />
          <OverviewCard
            icon={<NewspaperIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
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
            icon={<GlobeAltIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
            actionText="Manage"
          />
          <QuickActionCard
            title="Review Pending"
            description="18 restaurants awaiting approval"
            icon={<ClockIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
            actionText="Review Now"
          />
          <QuickActionCard
            title="View Analytics"
            description="Platform performance and insights"
            icon={<ChartBarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
            actionText="View"
          />
        </div>
      </section>
    </div>
  )
}

/**
 * More Section - Contains settings, reports, activity, support
 */
function MoreSection() {
  const [subTab, setSubTab] = useState<"settings" | "reports" | "activity" | "support">("settings")

  const subTabs = [
    { id: "settings" as const, label: "Settings", icon: Cog6ToothIcon },
    { id: "reports" as const, label: "Reports", icon: DocumentTextIcon },
    { id: "activity" as const, label: "Activity", icon: ChartBarIcon },
    { id: "support" as const, label: "Support", icon: ClockIcon },
  ]

  return (
    <div>
      {/* Sub-tab navigation */}
      <nav className="mb-[var(--spacing-xl)]" aria-label="More sections">
        <div
          role="tablist"
          className="flex gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)]"
        >
          {subTabs.map((tab) => {
            const isActive = subTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSubTab(tab.id)}
                className={`
                  flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
                  rounded-[var(--radius-full)] whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                      : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                  }
                `}
              >
                <Icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                <span className="text-[var(--font-size-sm)] font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Sub-tab content */}
      <div>
        {subTab === "settings" && <SystemConfiguration />}
        {subTab === "reports" && <ReportsExports />}
        {subTab === "activity" && <ActivityFeed />}
        {subTab === "support" && <SupportTickets />}
      </div>
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
        p-[var(--spacing-md)] sm:p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border
        ${
          variant === "warning"
            ? "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5"
            : "border-[var(--fg-10)] bg-[var(--card-bg)]"
        }
      `}
    >
      <div className="flex items-start justify-between mb-[var(--spacing-sm)]">
        <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--fg-5)] text-[var(--fg-70)]">
          {icon}
        </div>
      </div>
      <p className="text-[var(--font-size-xl)] sm:text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
        {value}
      </p>
      <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-xs)]">
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
