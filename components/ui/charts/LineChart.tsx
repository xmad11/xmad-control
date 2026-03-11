/**
 * Line Chart Component
 *
 * Line chart for displaying analytics over time.
 * Uses Recharts with 100% design token compliance.
 *
 * @module components/ui/charts
 */

"use client"

import { cn } from "@/lib/utils"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { LineChartProps } from "./types"

/**
 * LineChart - Displays data as a line chart
 *
 * @example
 * ```tsx
 * import { LineChart } from "@/components/ui/charts"
 *
 * const data = [
 *   { name: "Mon", value: 100 },
 *   { name: "Tue", value: 200 },
 *   { name: "Wed", value: 150 },
 * ]
 *
 * <LineChart data={data} height={300} />
 * ```
 */
export function LineChart({
  data,
  dataKey = "value",
  xAxisKey = "name",
  color = "var(--color-primary)",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  showDots = true,
  strokeDasharray,
  className = "",
  height = 300,
  width = "100%",
  isLoading = false,
}: LineChartProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--bg-5)] rounded-[var(--radius-lg)]",
          className
        )}
        style={{ height, width }}
        // @design-exception DYNAMIC_VALUE: Height & width are runtime props that cannot be expressed with static Tailwind classes
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
        // @design-exception DYNAMIC_VALUE: Height & width are runtime props that cannot be expressed with static Tailwind classes
      >
        No data available
      </div>
    )
  }

  return (
    <div
      className={cn("w-full", className)}
      style={{ height, width }}
      // @design-exception DYNAMIC_VALUE: Height & width are runtime props that cannot be expressed with static Tailwind classes
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid stroke="var(--fg-10)" strokeDasharray="3 3" vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--fg-50)"
            /* @design-external RECHARTS_LIBRARY: Recharts requires inline style object for style prop - using design tokens */
            style={{
              fontSize: "var(--font-size-xs)",
              fontFamily: "var(--font-sans)",
            }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--fg-50)"
            /* @design-external RECHARTS_LIBRARY: Recharts requires inline style object for style prop - using design tokens */
            style={{
              fontSize: "var(--font-size-xs)",
              fontFamily: "var(--font-sans)",
            }}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              /* @design-external RECHARTS_LIBRARY: Recharts requires inline style object for contentStyle prop - using design tokens */
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
              /* @design-external RECHARTS_LIBRARY: Recharts requires inline style object for wrapperStyle prop - using design tokens */
              wrapperStyle={{
                fontSize: "var(--font-size-sm)",
                fontFamily: "var(--font-sans)",
                color: "var(--fg)",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={showDots ? { fill: color, r: 4, strokeWidth: 2 } : false}
            activeDot={{ r: 6, fill: color, strokeWidth: 2 }}
            strokeDasharray={strokeDasharray}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
