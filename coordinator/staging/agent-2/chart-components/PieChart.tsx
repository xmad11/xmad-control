/**
 * Pie Chart Component
 *
 * Pie chart for displaying data distributions.
 * Uses Recharts with 100% design token compliance.
 *
 * @module components/ui/charts
 */

"use client"

import { cn } from "@/lib/utils"
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { PieChartProps } from "./types"

/**
 * Default colors for pie chart slices
 * Using design tokens where possible
 */
const DEFAULT_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-rating)",
  "var(--color-favorite)",
  "var(--fg-70)",
  "var(--fg-50)",
  "var(--fg-30)",
  "var(--bg-20)",
]

/**
 * PieChart - Displays data as a pie chart
 *
 * @example
 * ```tsx
 * import { PieChart } from "@/components/ui/charts"
 *
 * const data = [
 *   { name: "Direct", value: 400 },
 *   { name: "Social", value: 300 },
 *   { name: "Organic", value: 200 },
 * ]
 *
 * <PieChart data={data} height={300} />
 * ```
 */
export function PieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  label = false,
  className = "",
  height = 300,
  width = "100%",
  isLoading = false,
}: PieChartProps) {
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
        <RechartsPieChart margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            label={
              label
                ? {
                    fill: "var(--fg)",
                    fontSize: "var(--font-size-xs)",
                    fontFamily: "var(--font-sans)",
                  }
                : false
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
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
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
