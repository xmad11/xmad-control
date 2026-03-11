/**
 * Bar Chart Component
 *
 * Bar chart for comparing data across categories.
 * Uses Recharts with 100% design token compliance.
 *
 * @module components/ui/charts
 */

"use client"

import { cn } from "@/lib/utils"
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { BarChartProps } from "./types"

/**
 * BarChart - Displays data as a bar chart
 *
 * @example
 * ```tsx
 * import { BarChart } from "@/components/ui/charts"
 *
 * const data = [
 *   { name: "Mon", value: 100 },
 *   { name: "Tue", value: 200 },
 *   { name: "Wed", value: 150 },
 * ]
 *
 * <BarChart data={data} height={300} />
 * ```
 */
export function BarChart({
  data,
  dataKey = "value",
  xAxisKey = "name",
  color = "var(--color-primary)",
  horizontal = false,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  className = "",
  height = 300,
  width = "100%",
  isLoading = false,
}: BarChartProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--bg-5)] rounded-[var(--radius-lg)]",
          className
        )}
        style={{ height, width }}
      >
        <div className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)] animate-spin" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--bg-5)] rounded-[var(--radius-lg)] text-[var(--fg-50)]",
          className
        )}
        style={{ height, width }}
      >
        No data available
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)} style={{ height, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid stroke="var(--fg-10)" strokeDasharray="3 3" vertical={false} />
          )}
          <XAxis
            dataKey={horizontal ? dataKey : xAxisKey}
            stroke="var(--fg-50)"
            type={horizontal ? "number" : "category"}
            style={{
              fontSize: "var(--font-size-xs)",
              fontFamily: "var(--font-sans)",
            }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--fg-50)"
            type={horizontal ? "category" : "number"}
            style={{
              fontSize: "var(--font-size-xs)",
              fontFamily: "var(--font-sans)",
            }}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--fg-10)",
                borderRadius: "var(--radius-md)",
                color: "var(--fg)",
                fontSize: "var(--font-size-sm)",
                fontFamily: "var(--font-sans)",
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontSize: "var(--font-size-sm)",
                fontFamily: "var(--font-sans)",
                color: "var(--fg)",
              }}
            />
          )}
          <Bar dataKey={horizontal ? xAxisKey : dataKey} radius={[4, 4, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
