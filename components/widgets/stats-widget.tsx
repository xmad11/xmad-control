"use client"

import { GlassWidgetBase } from "@/components/widgets/base-widget"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from "lucide-react"
import * as React from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
  }
  icon?: React.ReactNode
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  className?: string
}

function StatCard({ title, value, change, icon, glowColor = "cyan", className }: StatCardProps) {
  const changeColors = {
    increase: "text-emerald-400",
    decrease: "text-red-400",
    neutral: "text-white/50",
  }

  const ChangeIcon =
    change?.type === "increase" ? ArrowUp : change?.type === "decrease" ? ArrowDown : Minus

  return (
    <GlassWidgetBase className={className} size="md" width="sm" glowColor={glowColor}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-white/60 text-sm">{title}</div>
        {icon && <div className="text-white/40">{icon}</div>}
      </div>
      <div className="text-3xl font-light text-white mb-2">{value}</div>
      {change && (
        <div className={cn("flex items-center gap-1 text-xs", changeColors[change.type])}>
          <ChangeIcon className="w-3 h-3" />
          <span>{Math.abs(change.value)}%</span>
          <span className="text-white/50">vs last period</span>
        </div>
      )}
    </GlassWidgetBase>
  )
}

interface MetricStatProps {
  label: string
  value: number
  max?: number
  unit?: string
  icon?: React.ReactNode
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  className?: string
}

function MetricStat({
  label,
  value,
  max = 100,
  unit = "",
  icon,
  glowColor = "blue",
  className,
}: MetricStatProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <GlassWidgetBase className={className} size="md" width="sm" glowColor={glowColor}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-white/60">{icon}</div>}
          <div className="text-white/60 text-sm">{label}</div>
        </div>
        <div className="text-white font-medium">
          {value}
          {unit && <span className="text-white/60 text-sm ml-1">{unit}</span>}
        </div>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            glowColor === "cyan" && "bg-linear-to-r from-cyan-500 to-blue-500",
            glowColor === "purple" && "bg-linear-to-r from-purple-500 to-pink-500",
            glowColor === "blue" && "bg-linear-to-r from-blue-500 to-indigo-500",
            glowColor === "pink" && "bg-linear-to-r from-pink-500 to-rose-500",
            glowColor === "green" && "bg-linear-to-r from-emerald-500 to-teal-500",
            glowColor === "amber" && "bg-linear-to-r from-amber-500 to-orange-500",
            glowColor === "red" && "bg-linear-to-r from-red-500 to-rose-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-white/40 text-xs mt-2">
        {percentage.toFixed(0)}% of {max}
        {unit}
      </div>
    </GlassWidgetBase>
  )
}

interface ComparisonStatProps {
  title: string
  current: number
  previous: number
  format?: (value: number) => string
  icon?: React.ReactNode
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  className?: string
}

function ComparisonStat({
  title,
  current,
  previous,
  format = (v) => v.toString(),
  icon,
  glowColor = "green",
  className,
}: ComparisonStatProps) {
  // Handle division by zero: if previous is 0, calculate change differently
  let change: number
  let isNew = false
  let isZero = false

  if (previous === 0) {
    if (current === 0) {
      change = 0
      isZero = true
    } else if (current > 0) {
      // Going from 0 to positive value - treat as "new"
      change = 0
      isNew = true
    } else {
      // Going from 0 to negative value - treat as decrease
      change = -100
    }
  } else {
    change = ((current - previous) / previous) * 100
  }

  const isIncrease = change > 0
  const isDecrease = change < 0

  return (
    <GlassWidgetBase className={className} size="md" width="sm" glowColor={glowColor}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/60 text-sm">{title}</div>
        {icon && <div className="text-white/40">{icon}</div>}
      </div>
      <div className="text-4xl font-light text-white mb-2">{format(current)}</div>
      <div className="flex items-center gap-2">
        {isIncrease ? (
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        ) : isDecrease ? (
          <TrendingDown className="w-4 h-4 text-red-400" />
        ) : (
          <Minus className="w-4 h-4 text-white/50" />
        )}
        <span
          className={cn(
            "text-sm",
            isIncrease && "text-emerald-400",
            isDecrease && "text-red-400",
            !isIncrease && !isDecrease && "text-white/50"
          )}
        >
          {isNew ? (
            "New"
          ) : isZero ? (
            "0%"
          ) : (
            <>
              {isIncrease ? "+" : ""}
              {change.toFixed(1)}%
            </>
          )}
        </span>
        <span className="text-white/40 text-xs">from {format(previous)}</span>
      </div>
    </GlassWidgetBase>
  )
}

interface StatsGridProps {
  stats: Array<{
    title: string
    value: string | number
    change?: {
      value: number
      type: "increase" | "decrease" | "neutral"
    }
    icon?: React.ReactNode
    glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  }>
  className?: string
}

function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}

interface CircularProgressStatProps {
  label: string
  value: number
  max?: number
  unit?: string
  icon?: React.ReactNode
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  size?: "sm" | "md" | "lg"
  className?: string
}

function CircularProgressStat({
  label,
  value,
  max = 100,
  unit = "",
  icon,
  glowColor = "cyan",
  size = "md",
  className,
}: CircularProgressStatProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = size === "lg" ? 50 : size === "md" ? 42 : 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Animated display value - only animate once on mount
  const [displayValue, setDisplayValue] = React.useState(0)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, value)
      setDisplayValue(Math.round(current))

      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const sizeConfig = {
    sm: { container: "w-32 h-32", text: "text-2xl", label: "text-xs" },
    md: { container: "w-40 h-40", text: "text-3xl", label: "text-sm" },
    lg: { container: "w-48 h-48", text: "text-4xl", label: "text-base" },
  }

  const config = sizeConfig[size]

  const strokeColors = {
    cyan: "#06b6d4",
    purple: "#a855f7",
    blue: "#3b82f6",
    pink: "#ec4899",
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  }

  return (
    <GlassWidgetBase
      className={cn("flex flex-col items-center justify-center", className)}
      size="md"
      width="sm"
      glowColor={glowColor}
    >
      <div className={cn("relative", config.container)}>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={strokeColors[glowColor]}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="text-white/60 mb-1">{icon}</div>}
          <div className={cn("font-light text-white", config.text)}>
            {displayValue}
            {unit && <span className="text-white/60 text-lg ml-1">{unit}</span>}
          </div>
          <div className={cn("text-white/50 mt-1", config.label)}>{label}</div>
        </div>
      </div>
    </GlassWidgetBase>
  )
}

/**
 * MultiGaugeWidget - 3 circular progress gauges in one card
 * Perfect for displaying CPU, RAM, Disk or similar metrics together
 */
interface GaugeItem {
  label: string
  value: number
  max?: number
  unit?: string
  color?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
}

interface MultiGaugeWidgetProps {
  gauges: [GaugeItem, GaugeItem, GaugeItem] // Exactly 3 gauges
  title?: string
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  size?: "sm" | "md"
  className?: string
}

function MultiGaugeWidget({
  gauges,
  title,
  glowColor = "cyan",
  size = "md",
  className,
}: MultiGaugeWidgetProps) {
  const radius = size === "md" ? 32 : 28
  const circumference = 2 * Math.PI * radius

  // Animated values for each gauge - only animate once on mount
  const [displayValues, setDisplayValues] = React.useState(gauges.map(() => 0))
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1000
    const steps = 60
    const timers: NodeJS.Timeout[] = []

    gauges.forEach((gauge, index) => {
      const targetValue = gauge.value
      const increment = targetValue / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        current = Math.min(current + increment, targetValue)

        setDisplayValues((prev) => {
          const newValues = [...prev]
          newValues[index] = Math.round(current)
          return newValues
        })

        if (step >= steps) {
          clearInterval(timer)
          setDisplayValues((prev) => {
            const newValues = [...prev]
            newValues[index] = targetValue
            return newValues
          })
        }
      }, duration / steps)

      timers.push(timer)
    })

    return () => timers.forEach((t) => clearInterval(t))
  }, [gauges])

  const strokeColors = {
    cyan: "#06b6d4",
    purple: "#a855f7",
    blue: "#3b82f6",
    pink: "#ec4899",
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  }

  const textSize = size === "md" ? "text-lg" : "text-base"
  const labelSize = size === "md" ? "text-xs" : "text-[10px]"
  const containerSize = size === "md" ? "w-20 h-20" : "w-16 h-16"

  return (
    <GlassWidgetBase
      className={cn("flex flex-col", className)}
      size="md"
      width="lg"
      glowColor={glowColor}
    >
      {title && <div className="text-white/60 text-sm mb-4">{title}</div>}
      <div className="flex items-center justify-around gap-2">
        {gauges.map((gauge, index) => {
          const percentage = Math.min((gauge.value / (gauge.max || 100)) * 100, 100)
          const offset = circumference - (percentage / 100) * circumference
          const color =
            gauge.color || (Object.keys(strokeColors)[index % 7] as keyof typeof strokeColors)

          return (
            <div key={index} className="flex flex-col items-center">
              <div className={cn("relative", containerSize)}>
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={strokeColors[color]}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn("font-light text-white", textSize)}>
                    {displayValues[index]}
                    {gauge.unit && <span className="text-white/60 text-xs">{gauge.unit}</span>}
                  </span>
                </div>
              </div>
              <span className={cn("text-white/50 mt-1", labelSize)}>{gauge.label}</span>
            </div>
          )
        })}
      </div>
    </GlassWidgetBase>
  )
}

/**
 * MultiProgressWidget - 3 linear progress bars in one card
 * Alternative to circular gauges for a different visual style
 */
interface ProgressItem {
  label: string
  value: number
  max?: number
  unit?: string
  color?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
}

interface MultiProgressWidgetProps {
  items: ProgressItem[]
  title?: string
  glowColor?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red"
  className?: string
}

function MultiProgressWidget({
  items,
  title,
  glowColor = "cyan",
  className,
}: MultiProgressWidgetProps) {
  const gradientClasses = {
    cyan: "from-cyan-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-indigo-500",
    pink: "from-pink-500 to-rose-500",
    green: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-500",
  }

  return (
    <GlassWidgetBase
      className={cn("flex flex-col", className)}
      size="md"
      width="lg"
      glowColor={glowColor}
    >
      {title && <div className="text-white/60 text-sm mb-4">{title}</div>}
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.min((item.value / (item.max || 100)) * 100, 100)
          const color = item.color || glowColor

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{item.label}</span>
                <span className="text-white text-sm font-medium">
                  {item.value}
                  {item.unit && <span className="text-white/50 ml-1">{item.unit}</span>}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-linear-to-r transition-all duration-500",
                    gradientClasses[color]
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </GlassWidgetBase>
  )
}

export {
  StatCard,
  MetricStat,
  ComparisonStat,
  StatsGrid,
  CircularProgressStat,
  MultiGaugeWidget,
  MultiProgressWidget,
}
