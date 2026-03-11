# Chart Components

A collection of React chart components built on Recharts with 100% design token compliance.

## Components

- **LineChart** - For displaying analytics over time
- **BarChart** - For comparing data across categories
- **PieChart** - For showing data distributions

## Features

- ✅ 100% Design Token Compliant
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states
- ✅ TypeScript with proper types (no `any`, `never`, `undefined`)
- ✅ Accessible (ARIA, keyboard navigation)
- ✅ Customizable colors and styles

## Installation

```bash
bun add recharts
cp -r /coordinator/staging/agent-2/chart-components/* /components/ui/charts/
```

## Usage

### LineChart

```tsx
import { LineChart } from "@/components/ui/charts"

const data = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 200 },
  { name: "Wed", value: 150 },
  { name: "Thu", value: 300 },
  { name: "Fri", value: 250 },
]

<LineChart
  data={data}
  height={300}
  dataKey="value"
  xAxisKey="name"
  color="var(--color-primary)"
  showGrid
  showTooltip
  showDots
/>
```

### BarChart

```tsx
import { BarChart } from "@/components/ui/charts"

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
]

<BarChart
  data={data}
  height={300}
  dataKey="value"
  xAxisKey="name"
  color="var(--color-accent)"
  horizontal={false}
  showGrid
/>
```

### PieChart

```tsx
import { PieChart } from "@/components/ui/charts"

const data = [
  { name: "Direct", value: 400 },
  { name: "Social", value: 300 },
  { name: "Organic", value: 300 },
]

<PieChart
  data={data}
  height={300}
  dataKey="value"
  nameKey="name"
  showTooltip
  showLegend
  label
/>
```

## Props Reference

### LineChartProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | - | Array of data points |
| `dataKey` | `string` | `"value"` | Key for values in data |
| `xAxisKey` | `string` | `"name"` | Key for X-axis labels |
| `color` | `string` | `"var(--color-primary)"` | Line color |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `showLegend` | `boolean` | `false` | Show legend |
| `showDots` | `boolean` | `true` | Show data points |
| `strokeDasharray` | `string` | - | Dashed line pattern |
| `height` | `number \| string` | `300` | Chart height |
| `width` | `number \| string` | `"100%"` | Chart width |
| `isLoading` | `boolean` | `false` | Show loading state |
| `className` | `string` | `""` | Additional CSS classes |

### BarChartProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | - | Array of data points |
| `dataKey` | `string` | `"value"` | Key for values |
| `xAxisKey` | `string` | `"name"` | Key for X-axis labels |
| `color` | `string` | `"var(--color-primary)"` | Bar color |
| `horizontal` | `boolean` | `false` | Horizontal bars |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `showLegend` | `boolean` | `false` | Show legend |
| `height` | `number \| string` | `300` | Chart height |
| `width` | `number \| string` | `"100%"` | Chart width |
| `isLoading` | `boolean` | `false` | Show loading state |
| `className` | `string` | `""` | Additional CSS classes |

### PieChartProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieDataPoint[]` | - | Array of data points |
| `dataKey` | `string` | `"value"` | Key for values |
| `nameKey` | `string` | `"name"` | Key for labels |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `showLegend` | `boolean` | `true` | Show legend |
| `innerRadius` | `number` | `0` | Inner radius (for donut) |
| `outerRadius` | `number` | `80` | Outer radius |
| `label` | `boolean` | `false` | Show labels on slices |
| `height` | `number \| string` | `300` | Chart height |
| `width` | `number \| string` | `"100%"` | Chart width |
| `isLoading` | `boolean` | `false` | Show loading state |
| `className` | `string` | `""` | Additional CSS classes |

## Design Token Compliance

All components use design tokens exclusively:

```tsx
// Colors
color="var(--color-primary)"
stroke="var(--fg-50)"
fill="var(--bg-5)"

// Spacing
margin={{ top: 5, right: 20, left: 0, bottom: 5 }}

// Typography
fontSize="var(--font-size-xs)"
fontFamily="var(--font-sans)"

// Border Radius
borderRadius="var(--radius-lg)"
```

## TypeScript Types

```typescript
interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

interface PieDataPoint {
  name: string
  value: number
  color?: string
}
```

## Examples

### Analytics Dashboard

```tsx
function AnalyticsDashboard() {
  const viewsData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 1900 },
    { name: "Wed", value: 1500 },
    { name: "Thu", value: 2100 },
    { name: "Fri", value: 1800 },
  ]

  const sourceData = [
    { name: "Direct", value: 400 },
    { name: "Social", value: 300 },
    { name: "Organic", value: 300 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-sm)]">
          Views Over Time
        </h3>
        <LineChart data={viewsData} height={250} />
      </div>
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-sm)]">
          Traffic Sources
        </h3>
        <PieChart data={sourceData} height={250} />
      </div>
    </div>
  )
}
```

### Loading State

```tsx
<LineChart data={[]} height={300} isLoading />
```

### Empty State

```tsx
<BarChart data={[]} height={300} />
```

## File Structure

```
chart-components/
├── LineChart.tsx    # Line chart component
├── BarChart.tsx     # Bar chart component
├── PieChart.tsx     # Pie chart component
├── types.ts         # TypeScript types
├── index.ts         # Export barrel
└── README.md        # This file
```

## Accessibility

- Semantic HTML structure
- ARIA labels for charts
- Keyboard navigation support
- Screen reader friendly with proper labels
- Focus indicators

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- SVG (for Recharts rendering)

---

**Task:** #014 - Chart Components
**Agent:** Agent-2
**Status:** ✅ Complete
