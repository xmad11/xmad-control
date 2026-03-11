/**
 * Analytics Section - Restaurant performance metrics
 *
 * Display views, clicks, calls, and favorites with trend indicators.
 */

"use client"

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  PhoneIcon,
} from "@/components/icons"
import { memo, useState } from "react"
import type { AnalyticsData } from "./types"

/**
 * Format number for display (e.g., 1.2K, 1M)
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Format percentage change
 */
function formatTrend(trend: number): { value: string; isPositive: boolean } {
  const isPositive = trend >= 0
  return {
    value: `${isPositive ? "+" : ""}${trend.toFixed(1)}%`,
    isPositive,
  }
}

/**
 * Stat card component with trend indicator
 */
function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  color = "primary",
}: {
  label: string
  value: number
  trend: number
  icon: React.ComponentType<{ className?: string }>
  color?: "primary" | "success" | "warning" | "info"
}) {
  const trendData = formatTrend(trend)

  const colorStyles = {
    primary: "text-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)]",
    success: "text-[var(--color-success)] bg-[oklch(from_var(--color-success)_l_c_h_/0.1)]",
    warning: "text-[var(--color-warning)] bg-[oklch(from_var(--color-warning)_l_c_h_/0.1)]",
    info: "text-[var(--color-info)] bg-[oklch(from_var(--color-info)_l_c_h_/0.1)]",
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
      <div className="flex items-center justify-between">
        <div className={`p-[var(--spacing-sm)] rounded-[var(--radius-md)] ${colorStyles[color]}`}>
          <Icon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
        </div>
        {trend !== 0 && (
          <div
            className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] ${
              trendData.isPositive
                ? "bg-[oklch(from_var(--color-success)_l_c_h_/0.1)] text-[var(--color-success)]"
                : "bg-[oklch(from_var(--color-error)_l_c_h_/0.1)] text-[var(--color-error)]"
            }`}
          >
            {trendData.isPositive ? (
              <ArrowTrendingUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            ) : (
              <ArrowTrendingDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            )}
            <span className="text-[var(--font-size-sm)] font-medium">{trendData.value}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-[var(--font-size-3xl)] font-black text-[var(--fg)] tracking-tight">
          {formatNumber(value)}
        </p>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] mt-[var(--spacing-xs)]">
          {label}
        </p>
      </div>
    </div>
  )
}

/**
 * Mini chart component for daily data
 */
function MiniChart({
  data,
  color = "var(--color-primary)",
}: {
  data: Array<{ date: string; count: number }>
  color?: string
}) {
  if (data.length === 0) return null

  const max = Math.max(...data.map((d) => d.count))
  const min = Math.min(...data.map((d) => d.count))
  const range = max - min || 1

  // Create SVG path
  const width = 200
  const height = 60
  const padding = 2

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((point.count - min) / range) * (height - padding * 2) - padding
    return `${x},${y}`
  })

  const pathData = `M ${points.join(" L ")}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      aria-hidden="true"
    >
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fill area below the line */}
      <path
        d={`${pathData} L ${width},${height} L 0,${height} Z`}
        fill={color}
        fillOpacity="0.1"
        stroke="none"
      />
    </svg>
  )
}

/**
 * Date range selector
 */
function DateRangeSelector({
  value,
  onChange,
}: {
  value: "7d" | "30d" | "90d" | "all"
  onChange: (value: "7d" | "30d" | "90d" | "all") => void
}) {
  const options = [
    { value: "7d" as const, label: "7 Days" },
    { value: "30d" as const, label: "30 Days" },
    { value: "90d" as const, label: "90 Days" },
    { value: "all" as const, label: "All Time" },
  ]

  return (
    <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
      <CalendarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-70)] ml-[var(--spacing-sm)]" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] ${
            value === option.value
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--fg-70)] hover:text-[var(--fg)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Analytics Section Component
 *
 * @example
 * <AnalyticsSection data={analyticsData} isLoading={false} />
 */
export function AnalyticsSection({
  data,
  isLoading = false,
}: {
  data: AnalyticsData
  isLoading?: boolean
}) {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <ChartBarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Analytics
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Track your restaurant's performance
            </p>
          </div>
        </div>

        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-[var(--spacing-md)] lg:grid-cols-4">
        <StatCard
          label="Profile Views"
          value={data.views.total}
          trend={data.views.trend}
          icon={EyeIcon}
          color="primary"
        />
        <StatCard
          label="Clicks"
          value={data.clicks.total}
          trend={data.clicks.trend}
          icon={PhoneIcon}
          color="info"
        />
        <StatCard
          label="Calls"
          value={data.calls.total}
          trend={data.calls.trend}
          icon={PhoneIcon}
          color="success"
        />
        <StatCard
          label="Favorites"
          value={data.favorites.total}
          trend={data.favorites.trend}
          icon={HeartIcon}
          color="warning"
        />
      </div>

      {/* Daily Charts */}
      <div className="grid grid-cols-1 gap-[var(--spacing-md)] lg:grid-cols-3">
        {/* Views Chart */}
        <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Profile Views</p>
              <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xs)]">
                {formatNumber(data.views.total)}
              </p>
            </div>
            <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)]">
              <EyeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
            </div>
          </div>
          <MiniChart data={data.views.daily} color="var(--color-primary)" />
          <div className="flex items-center justify-between text-[var(--font-size-xs)] text-[var(--fg-50)]">
            <span>Last {data.views.daily.length} days</span>
            <span>
              Avg: {formatNumber(Math.round(data.views.total / data.views.daily.length))}/day
            </span>
          </div>
        </div>

        {/* Clicks Chart */}
        <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Clicks</p>
              <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xs)]">
                {formatNumber(data.clicks.total)}
              </p>
            </div>
            <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-info)_l_c_h_/0.1)]">
              <PhoneIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-info)]" />
            </div>
          </div>
          <MiniChart data={data.clicks.daily} color="var(--color-info)" />
          <div className="flex items-center justify-between text-[var(--font-size-xs)] text-[var(--fg-50)]">
            <span>Last {data.clicks.daily.length} days</span>
            <span>
              Avg: {formatNumber(Math.round(data.clicks.total / data.clicks.daily.length))}/day
            </span>
          </div>
        </div>

        {/* Calls Chart */}
        <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Calls</p>
              <p className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mt-[var(--spacing-xs)]">
                {formatNumber(data.calls.total)}
              </p>
            </div>
            <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-success)_l_c_h_/0.1)]">
              <PhoneIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-success)]" />
            </div>
          </div>
          <MiniChart data={data.calls.daily} color="var(--color-success)" />
          <div className="flex items-center justify-between text-[var(--font-size-xs)] text-[var(--fg-50)]">
            <span>Last {data.calls.daily.length} days</span>
            <span>
              Avg: {formatNumber(Math.round(data.calls.total / data.calls.daily.length))}/day
            </span>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          Engagement Insights
        </h3>
        <div className="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-3">
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Click-Through Rate
            </span>
            <span className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {data.views.total > 0
                ? ((data.clicks.total / data.views.total) * 100).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Call Rate</span>
            <span className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {data.views.total > 0
                ? ((data.calls.total / data.views.total) * 100).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Favorite Rate</span>
            <span className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {data.views.total > 0
                ? ((data.favorites.total / data.views.total) * 100).toFixed(1)
                : "0"}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-[var(--spacing-2xl)]">
          <div className="flex items-center gap-[var(--spacing-sm)] text-[var(--fg-70)]">
            <div className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] animate-spin rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)]" />
            <span className="text-[var(--font-size-sm)]">Loading analytics...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const AnalyticsSection = memo(AnalyticsSection)
