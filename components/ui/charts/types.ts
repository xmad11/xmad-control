/**
 * Chart Components Types
 *
 * Type definitions for chart components
 * No `any`, `undefined`, or `never` types (unless genuinely unreachable)
 */

/**
 * Data point for line and bar charts
 */
export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

/**
 * Data point for pie charts
 */
export interface PieDataPoint {
  name: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

/**
 * Base chart props
 */
export interface BaseChartProps {
  className?: string
  height?: number | string
  width?: number | string
  isLoading?: boolean
}

/**
 * Line chart specific props
 */
export interface LineChartProps extends BaseChartProps {
  data: ChartDataPoint[]
  dataKey?: string
  xAxisKey?: string
  color?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showDots?: boolean
  strokeDasharray?: string
}

/**
 * Bar chart specific props
 */
export interface BarChartProps extends BaseChartProps {
  data: ChartDataPoint[]
  dataKey?: string
  xAxisKey?: string
  color?: string
  horizontal?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

/**
 * Pie chart specific props
 */
export interface PieChartProps extends BaseChartProps {
  data: PieDataPoint[]
  dataKey?: string
  nameKey?: string
  showTooltip?: boolean
  showLegend?: boolean
  innerRadius?: number
  outerRadius?: number
  label?: boolean
}
