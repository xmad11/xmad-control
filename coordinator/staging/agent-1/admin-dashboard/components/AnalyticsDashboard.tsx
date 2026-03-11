/* ═══════════════════════════════════════════════════════════════════════════════
   ANALYTICS DASHBOARD - Platform analytics with chart widgets
   Visual analytics for platform insights
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  UsersIcon,
} from "@/components/icons"
import { memo, useMemo } from "react"

interface MetricCard {
  title: string
  value: string
  change: string
  changeType: "up" | "down" | "neutral"
  icon: React.ReactNode
}

interface ChartData {
  label: string
  value: number
}

/**
 * Analytics Dashboard Component
 *
 * Features:
 * - Key metrics with trends
 * - User growth chart
 * - Restaurant engagement chart
 * - Popular cuisines
 * - Traffic sources
 */
export function AnalyticsDashboard() {
  /**
   * Mock metrics data - replace with API call
   */
  const metrics: MetricCard[] = [
    {
      title: "Total Users",
      value: "12,458",
      change: "+12.5%",
      changeType: "up",
      icon: <UsersIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
    },
    {
      title: "Active Restaurants",
      value: "248",
      change: "+8",
      changeType: "up",
      icon: <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
    },
    {
      title: "Total Reviews",
      value: "4,892",
      change: "+234",
      changeType: "up",
      icon: <StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
    },
    {
      title: "Blog Posts",
      value: "156",
      change: "+5",
      changeType: "up",
      icon: <DocumentTextIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />,
    },
  ]

  /**
   * Mock user growth data
   */
  const userGrowthData: ChartData[] = [
    { label: "Jan", value: 8500 },
    { label: "Feb", value: 9200 },
    { label: "Mar", value: 9800 },
    { label: "Apr", value: 10500 },
    { label: "May", value: 11200 },
    { label: "Jun", value: 11800 },
    { label: "Jul", value: 12458 },
  ]

  /**
   * Mock engagement data
   */
  const engagementData: ChartData[] = [
    { label: "Views", value: 45600 },
    { label: "Favorites", value: 8900 },
    { label: "Saves", value: 5400 },
    { label: "Reviews", value: 1200 },
  ]

  /**
   * Mock cuisine popularity
   */
  const cuisineData: ChartData[] = [
    { label: "Arabic", value: 35 },
    { label: "Asian", value: 22 },
    { label: "Italian", value: 18 },
    { label: "Indian", value: 12 },
    { label: "Mexican", value: 8 },
    { label: "Other", value: 5 },
  ]

  /**
   * Mock traffic sources
   */
  const trafficSources: ChartData[] = [
    { label: "Direct", value: 42 },
    { label: "Google", value: 28 },
    { label: "Social", value: 18 },
    { label: "Referral", value: 12 },
  ]

  /**
   * Calculate max value for charts
   */
  const maxUserGrowth = useMemo(
    () => Math.max(...userGrowthData.map((d) => d.value)),
    [userGrowthData]
  )
  const maxCuisine = useMemo(() => Math.max(...cuisineData.map((d) => d.value)), [cuisineData])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            Analytics Dashboard
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Platform performance metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center border border-[var(--fg-20)] rounded-[var(--radius-md)] overflow-hidden">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              type="button"
              className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] transition-colors ${
                range === "30d"
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--bg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-2xl)]">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-xl)]">
        {/* User Growth Chart */}
        <ChartCard title="User Growth" subtitle="Last 7 months">
          <BarChart data={userGrowthData} maxValue={maxUserGrowth} color="var(--color-primary)" />
        </ChartCard>

        {/* Engagement Chart */}
        <ChartCard title="Engagement" subtitle="User interactions">
          <DonutChart data={engagementData} />
        </ChartCard>

        {/* Cuisine Popularity */}
        <ChartCard title="Popular Cuisines" subtitle="Restaurant distribution">
          <HorizontalBarChart
            data={cuisineData}
            maxValue={maxCuisine}
            color="var(--color-accent-rust)"
          />
        </ChartCard>

        {/* Traffic Sources */}
        <ChartCard title="Traffic Sources" subtitle="Where users come from">
          <DonutChart data={trafficSources} />
        </ChartCard>
      </div>

      {/* Recent Activity Summary */}
      <div className="mt-[var(--spacing-xl)]">
        <ChartCard title="Platform Health" subtitle="Overall system status">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-lg)]">
            <HealthMetric
              icon={<EyeIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
              label="Avg. Daily Views"
              value="1.2K"
              trend="+15%"
              trendUp
            />
            <HealthMetric
              icon={<HeartIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
              label="Avg. Favorites"
              value="234"
              trend="+8%"
              trendUp
            />
            <HealthMetric
              icon={<BookmarkIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
              label="Avg. Saves"
              value="156"
              trend="+12%"
              trendUp
            />
            <HealthMetric
              icon={<StarIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]" />}
              label="Avg. Rating"
              value="4.6"
              trend="+0.2"
              trendUp
            />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

/**
 * Metric Card Component
 */
function MetricCard({ title, value, change, changeType, icon }: MetricCard) {
  return (
    <div className="p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
      <div className="flex items-start justify-between mb-[var(--spacing-sm)]">
        <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--fg-5)] text-[var(--fg-60)]">
          {icon}
        </div>
        <ChangeIndicator change={change} type={changeType} />
      </div>
      <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">{value}</p>
      <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{title}</p>
    </div>
  )
}

/**
 * Change Indicator
 */
interface ChangeIndicatorProps {
  change: string
  type: "up" | "down" | "neutral"
}

function ChangeIndicator({ change, type }: ChangeIndicatorProps) {
  const config = {
    up: { color: "text-[var(--color-success)]", icon: ArrowUpIcon },
    down: { color: "text-[var(--color-error)]", icon: ArrowDownIcon },
    neutral: { color: "text-[var(--fg-50)]", icon: null },
  }

  const { color, icon: Icon } = config[type]

  return (
    <div
      className={`flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-xs)] font-medium ${color}`}
    >
      {Icon && <Icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
      <span>{change}</span>
    </div>
  )
}

/**
 * Chart Card Component
 */
interface ChartCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="p-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
      <div className="mb-[var(--spacing-lg)]">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">{title}</h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

/**
 * Health Metric Component
 */
interface HealthMetricProps {
  icon: React.ReactNode
  label: string
  value: string
  trend: string
  trendUp: boolean
}

function HealthMetric({ icon, label, value, trend, trendUp }: HealthMetricProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-[var(--spacing-sm)]">
        <div
          className={`p-[var(--spacing-md)] rounded-[var(--radius-full)] ${
            trendUp
              ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
              : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mb-[var(--spacing-xs)]">
        {value}
      </p>
      <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-xs)]">
        {label}
      </p>
      <p
        className={`text-[var(--font-size-xs)] font-medium ${
          trendUp ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
        }`}
      >
        {trend} vs last month
      </p>
    </div>
  )
}

/**
 * Simple Bar Chart Component
 */
interface BarChartProps {
  data: ChartData[]
  maxValue: number
  color: string
}

function BarChart({ data, maxValue, color }: BarChartProps) {
  return (
    <div className="flex items-end justify-between gap-[var(--spacing-xs)] h-[200px]">
      {data.map((item) => {
        const height = (item.value / maxValue) * 100

        return (
          <div
            key={item.label}
            className="flex-1 flex flex-col items-center gap-[var(--spacing-xs)]"
          >
            <div
              className="w-full rounded-t-[var(--radius-sm)] transition-all hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: `var(${color})`,
              }}
            />
            <span className="text-[var(--font-size-xs)] text-[var(--fg-50)] text-center">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Horizontal Bar Chart Component
 */
interface HorizontalBarChartProps {
  data: ChartData[]
  maxValue: number
  color: string
}

function HorizontalBarChart({ data, maxValue, color }: HorizontalBarChartProps) {
  return (
    <div className="space-y-[var(--spacing-md)]">
      {data.map((item) => {
        const width = (item.value / maxValue) * 100

        return (
          <div key={item.label} className="space-y-[var(--spacing-xs)]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--font-size-sm)] text-[var(--fg)]">{item.label}</span>
              <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)]">
                {item.value}%
              </span>
            </div>
            <div className="h-[8px] w-full rounded-[var(--radius-full)] bg-[var(--fg-5)] overflow-hidden">
              <div
                className="h-full rounded-[var(--radius-full)] transition-all"
                style={{
                  width: `${width}%`,
                  backgroundColor: `var(${color})`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Simple Donut Chart Component (Legend-based)
 */
interface DonutChartProps {
  data: ChartData[]
}

function DonutChart({ data }: DonutChartProps) {
  const colors = [
    "var(--color-primary)",
    "var(--color-accent-rust)",
    "var(--color-accent-sage)",
    "var(--color-accent-teal)",
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-[var(--spacing-md)]">
      {data.map((item, index) => {
        const percentage = ((item.value / total) * 100).toFixed(1)

        return (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <div
                className="h-[12px] w-[12px] rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-[var(--font-size-sm)] text-[var(--fg)]">{item.label}</span>
            </div>
            <div className="flex items-center gap-[var(--spacing-md)]">
              <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)]">
                {item.value.toLocaleString()}
              </span>
              <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">{percentage}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
