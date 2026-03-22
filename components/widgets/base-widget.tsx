/* ═══════════════════════════════════════════════════════════════════════════════
   Base Widget Components - Pixel-perfect from ein-ui
   With Framer Motion animations for breathing glow effect
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { type HTMLMotionProps, type Variants, motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import * as React from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type GlowColor = "cyan" | "purple" | "green" | "amber" | "blue" | "pink" | "red" | "gray"
type WidgetSize = "sm" | "md" | "lg" | "xl"
type WidgetWidth = "sm" | "md" | "lg" | "xl" | "full"
type StatusType = "online" | "offline" | "warning" | "error"

interface GlassWidgetBaseProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  size?: WidgetSize
  width?: WidgetWidth
  glowEffect?: boolean
  glowColor?: GlowColor
  hoverScale?: boolean
  interactive?: boolean
}

interface MiniStatWidgetProps {
  icon: LucideIcon
  label: string
  value: string | number
  glowColor?: GlowColor
  className?: string
}

interface ServerStatusCardProps {
  icon: LucideIcon
  label: string
  status: StatusType
  detail: string
  glowColor?: GlowColor
  className?: string
}

interface TaskCardProps {
  id: string
  name: string
  status: "running" | "pending" | "completed" | "paused"
  progress: number
  className?: string
}

interface MemoryFileCardProps {
  name: string
  size: string
  modified: string
  className?: string
}

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down"
  icon?: LucideIcon
  className?: string
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

interface GaugeWidgetProps {
  label: string
  value: number
  unit?: string
  color?: GlowColor
  size?: WidgetSize
  className?: string
}

interface GaugeItem {
  label: string
  value: number
  unit?: string
  color?: GlowColor
  actualValue?: number
  actualUnit?: string
}

interface MultiGaugeWidgetProps {
  title?: string
  gauges: GaugeItem[]
  glowColor?: GlowColor
  className?: string
}

interface ProgressItem {
  label: string
  value: number
  max?: number
  unit?: string
  color?: GlowColor
}

interface MultiProgressWidgetProps {
  title?: string
  items: ProgressItem[]
  glowColor?: GlowColor
  className?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIZE & WIDTH CLASSES (pixel-perfect from ein-ui)
// ═══════════════════════════════════════════════════════════════════════════════

const sizeClasses: Record<WidgetSize, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
  xl: "p-6",
}

// Standard widget widths for consistent carousel layouts (from ein-ui)
const widthClasses: Record<WidgetWidth, string> = {
  sm: "min-w-64", // 256px - compact widgets
  md: "min-w-72", // 288px - standard widgets
  lg: "min-w-80", // 320px - detailed widgets
  xl: "min-w-96", // 384px - complex widgets
  full: "w-full", // Full width
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET COLOR MAPPINGS - Using design tokens via CSS custom properties
// ═══════════════════════════════════════════════════════════════════════════════

const glowColors: Record<GlowColor, string> = {
  cyan: "from-[color:var(--widget-cyan)]/30 via-[color:var(--glow-blue)]/30 to-[color:var(--widget-purple)]/30",
  purple:
    "from-[color:var(--widget-purple)]/30 via-[color:var(--widget-pink)]/30 to-[color:var(--widget-purple)]/30",
  green:
    "from-[color:var(--glow-green)]/30 via-[color:var(--glow-cyan)]/30 to-[color:var(--glow-green)]/30",
  amber:
    "from-[color:var(--widget-amber)]/30 via-[color:var(--color-accent-rust)]/30 to-[color:var(--widget-amber)]/30",
  blue: "from-[color:var(--widget-blue)]/30 via-[color:var(--color-accent-indigo)]/30 to-[color:var(--widget-blue)]/30",
  pink: "from-[color:var(--widget-pink)]/30 via-[color:var(--color-accent-rose)]/30 to-[color:var(--widget-pink)]/30",
  red: "from-[color:var(--widget-red)]/30 via-[color:var(--color-accent-rose)]/30 to-[color:var(--widget-red)]/30",
  gray: "from-[color:var(--gray)]/30 via-[color:var(--gray)]/30 to-[color:var(--gray)]/30",
}

const gaugeColors: Record<GlowColor, string> = {
  cyan: "text-[color:var(--widget-cyan)]",
  purple: "text-[color:var(--widget-purple)]",
  green: "text-[color:var(--widget-green)]",
  amber: "text-[color:var(--widget-amber)]",
  blue: "text-[color:var(--widget-blue)]",
  pink: "text-[color:var(--widget-pink)]",
  red: "text-[color:var(--widget-red)]",
  gray: "text-[color:var(--gray)]",
}

const progressColors: Record<GlowColor, string> = {
  cyan: "bg-[color:var(--widget-cyan)]",
  purple: "bg-[color:var(--widget-purple)]",
  green: "bg-[color:var(--widget-green)]",
  amber: "bg-[color:var(--widget-amber)]",
  blue: "bg-[color:var(--widget-blue)]",
  pink: "bg-[color:var(--widget-pink)]",
  red: "bg-[color:var(--widget-red)]",
  gray: "bg-[color:var(--gray)]",
}

const statusColors: Record<StatusType, string> = {
  online: "bg-[color:var(--color-success)]",
  offline: "bg-[color:var(--color-error)]",
  warning: "bg-[color:var(--color-warning)]",
  error: "bg-[color:var(--color-error)]",
}

// ═══════════════════════════════════════════════════════════════════════════════
// FRAMER MOTION VARIANTS (from ein-ui)
// ═══════════════════════════════════════════════════════════════════════════════

// Widget container animation - fade in, slide up, scale
const widgetVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      visualDuration: 0.4,
      bounce: 0.2,
    },
  },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.4,
    },
  },
} as const

// Glow effect animation - breathing pulse
const glowVariants: Variants = {
  initial: { opacity: 0.4, scale: 0.98 },
  animate: {
    opacity: [0.4, 0.6, 0.4] as number[],
    scale: [0.98, 1, 0.98] as number[],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
  hover: {
    opacity: 0.8,
    scale: 1.02,
    transition: {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.3,
    },
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WIDGET COMPONENT (with Framer Motion from ein-ui)
// ═══════════════════════════════════════════════════════════════════════════════

const GlassWidgetBase = React.forwardRef<HTMLDivElement, GlassWidgetBaseProps>(
  (
    {
      className,
      children,
      size = "md",
      width,
      glowEffect = true,
      glowColor = "cyan",
      hoverScale = true,
      interactive = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        className="relative h-full"
        initial="hidden"
        animate="visible"
        whileHover={interactive && hoverScale ? "hover" : undefined}
        variants={widgetVariants}
      >
        {/* Animated glow effect - breathing pulse */}
        {glowEffect && (
          <motion.div
            className={cn(
              "absolute -inset-0.5 rounded-2xl bg-gradient-to-r blur-xl",
              glowColors[glowColor]
            )}
            variants={glowVariants}
            initial="initial"
            animate="animate"
            whileHover={interactive ? "hover" : undefined}
            aria-hidden="true"
          />
        )}

        {/* Widget container */}
        <motion.div
          ref={ref}
          className={cn(
            "relative h-full rounded-2xl border border-white/20",
            "bg-white/10 backdrop-blur-xl",
            "shadow-[var(--glass-shadow-widget)]",
            // Inner highlight gradient
            "before:absolute before:inset-0 before:rounded-2xl",
            "before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
            // Inner shadow for depth
            "after:absolute after:inset-px after:rounded-[calc(1rem-1px)]",
            "after:shadow-[var(--glass-shadow-inset)] after:pointer-events-none",
            sizeClasses[size],
            width && width !== "full" && widthClasses[width],
            width === "full" && "w-full",
            className
          )}
          role="article"
          {...props}
        >
          <div className="relative z-10 h-full">{children}</div>
        </motion.div>
      </motion.div>
    )
  }
)
GlassWidgetBase.displayName = "GlassWidgetBase"

// ═══════════════════════════════════════════════════════════════════════════════
// DERIVED WIDGET COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function MiniStatWidget({
  icon: Icon,
  label,
  value,
  glowColor = "cyan",
  className = "",
}: MiniStatWidgetProps) {
  return (
    <GlassWidgetBase size="md" width="full" glowColor={glowColor} className={className}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-4 w-4 ${gaugeColors[glowColor]}`} />
        <span className="text-white/50 text-xs">{label}</span>
      </div>
      <div className="text-xl font-light text-white">{value}</div>
    </GlassWidgetBase>
  )
}

export function ServerStatusCard({
  icon: Icon,
  label,
  status,
  detail,
  glowColor = "cyan",
  className = "",
}: ServerStatusCardProps) {
  return (
    <GlassWidgetBase size="md" width="sm" glowColor={glowColor} className={className}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className={`h-5 w-5 ${gaugeColors[glowColor]}`} />
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{label}</div>
          <div className="text-white/50 text-xs">{detail}</div>
        </div>
      </div>
      <StatusBadge status={status} />
    </GlassWidgetBase>
  )
}

export function TaskCard({ name, status, progress, className = "" }: TaskCardProps) {
  const statusColor = {
    running: "text-[color:var(--color-success)]",
    pending: "text-[color:var(--color-warning)]",
    completed: "text-[color:var(--widget-cyan)]",
    paused: "text-[color:var(--widget-purple)]",
  }[status]

  return (
    <GlassWidgetBase size="md" width="full" glowColor="cyan" className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">{name}</span>
        <span className={`text-xs ${statusColor}`}>{status}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[color:var(--widget-cyan)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <div className="text-white/40 text-xs mt-1">{progress}%</div>
    </GlassWidgetBase>
  )
}

export function MemoryFileCard({ name, size, modified, className = "" }: MemoryFileCardProps) {
  return (
    <GlassWidgetBase size="sm" width="full" glowColor="purple" interactive className={className}>
      <div className="text-white text-sm font-medium truncate">{name}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-white/40 text-xs">{size}</span>
        <span className="text-white/20">•</span>
        <span className="text-white/40 text-xs">{modified}</span>
      </div>
    </GlassWidgetBase>
  )
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  className = "",
}: StatCardProps) {
  return (
    <GlassWidgetBase size="md" width="full" glowColor="cyan" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/60 mb-1">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 text-[color:var(--color-success)]" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-[color:var(--color-error)]" />
              )}
              <span
                className={`text-xs ${trend === "up" ? "text-[color:var(--color-success)]" : "text-[color:var(--color-error)]"}`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-white/10">
            <Icon className="h-4 w-4 text-white/60" />
          </div>
        )}
      </div>
    </GlassWidgetBase>
  )
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const statusLabel = {
    online: "Online",
    offline: "Offline",
    warning: "Warning",
    error: "Error",
  }[status]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${statusColors[status]} ${status === "online" ? "animate-pulse" : ""}`}
      />
      <span className="text-white/60 text-xs">{statusLabel}</span>
    </div>
  )
}

export function GaugeWidget({
  label,
  value,
  unit = "%",
  color = "cyan",
  className = "",
  actualValue,
  actualUnit,
  onClick,
}: GaugeWidgetProps & {
  actualValue?: number
  actualUnit?: string
  onClick?: () => void
}) {
  const [showActual, setShowActual] = React.useState(false)
  const circumference = 2 * Math.PI * 40
  const targetOffset = circumference - (value / 100) * circumference

  const handleClick = () => {
    setShowActual(!showActual)
    onClick?.()
  }

  const displayValue = showActual && actualValue !== undefined ? actualValue : value
  const displayUnit = showActual && actualUnit ? actualUnit : unit

  return (
    <div
      className={`flex flex-col items-center cursor-pointer select-none ${className}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
    >
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90" role="img" aria-label={label}>
          <title>{label} - Click to toggle view</title>
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="var(--glass-stroke-subtle)"
            strokeWidth="8"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={gaugeColors[color]}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-white font-bold"
            key={displayValue}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {typeof displayValue === "number"
              ? displayValue.toFixed(displayValue % 1 === 0 ? 0 : 1)
              : displayValue}
            <span className="text-white/40 text-sm">{displayUnit}</span>
          </motion.span>
        </div>
      </div>
      <span className="text-white/60 text-xs mt-2">{label}</span>
    </div>
  )
}

export function MultiGaugeWidget({
  title,
  gauges,
  glowColor = "cyan",
  className = "",
}: MultiGaugeWidgetProps) {
  return (
    <GlassWidgetBase
      size={title ? "lg" : "md"}
      width="md"
      glowColor={glowColor}
      className={className}
    >
      {title && <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">{title}</div>}
      <div className="flex justify-around">
        {gauges.map((gauge) => (
          <GaugeWidget
            key={gauge.label}
            {...gauge}
            actualValue={gauge.actualValue}
            actualUnit={gauge.actualUnit}
          />
        ))}
      </div>
    </GlassWidgetBase>
  )
}

export function MultiProgressWidget({
  title,
  items,
  glowColor = "cyan",
  className = "",
}: MultiProgressWidgetProps) {
  return (
    <GlassWidgetBase
      size={title ? "lg" : "md"}
      width="md"
      glowColor={glowColor}
      className={className}
    >
      {title && <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">{title}</div>}
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = item.max ? (item.value / item.max) * 100 : item.value
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs">{item.label}</span>
                <motion.span
                  className="text-white text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                >
                  {item.value}
                  {item.unit || ""}
                  {item.max && ` / ${item.max}${item.unit || ""}`}
                </motion.span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${progressColors[item.color || "cyan"]} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{
                    delay: index * 0.15,
                    duration: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </GlassWidgetBase>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTION CARD - Action button with icon and description
// ═══════════════════════════════════════════════════════════════════════════════

interface QuickActionCardProps {
  icon: LucideIcon
  label: string
  description: string
  glowColor?: GlowColor
  onClick?: () => void
  className?: string
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  glowColor = "cyan",
  onClick,
  className = "",
}: QuickActionCardProps) {
  return (
    <GlassWidgetBase
      size="md"
      width="sm"
      glowColor={glowColor}
      className={className}
      interactive={!!onClick}
    >
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/10">
            <Icon className={`h-5 w-5 ${gaugeColors[glowColor]}`} />
          </div>
          <div>
            <div className="text-white font-medium">{label}</div>
            <div className="text-white/50 text-xs">{description}</div>
          </div>
        </div>
      </button>
    </GlassWidgetBase>
  )
}

export { GlassWidgetBase }
export type { GlassWidgetBaseProps }
export default GlassWidgetBase
