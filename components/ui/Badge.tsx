/* ═══════════════════════════════════════════════════════════════════════════════
   BADGE - Unified badge component for all badges in the app
   Follows the rate badge design from /restaurants page
   Container: Semi-transparent rose red (50% opacity)
   Text/Icons: Always WHITE in all modes
   Shape: Rectangle (small radius) or Circle
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

export type BadgeVariant =
  | "shadi-badge" // Default Shadi badge (rectangle)
  | "circle" // Circle badge (e.g., verified, favorites count)
  | "status" // Status badge (open/closed/busy/coming-soon/temporary-closed)

export type BadgeSize = "sm" | "md" | "lg"

export type StatusType = "open" | "closed" | "busy" | "coming-soon" | "temporary-closed"

export interface BadgeProps {
  children?: React.ReactNode // Optional for status variant
  variant?: BadgeVariant
  size?: BadgeSize
  status?: StatusType // Only for variant="status"
  showDot?: boolean // Only for status badges
  className?: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STATUS CONFIG - For variant="status" only
   Uses same tokens but different semantic meanings
   ═══════════════════════════════════════════════════════════════════════════════ */

const statusConfig: Record<
  StatusType,
  { label: string; icon?: React.ComponentType<{ className?: string }> }
> = {
  open: { label: "Open" },
  closed: { label: "Closed" },
  busy: { label: "Busy" },
  "coming-soon": { label: "Coming Soon" },
  "temporary-closed": { label: "Temporarily Closed" },
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SIZE CLASSES - All variants use same sizing
   ═══════════════════════════════════════════════════════════════════════════════ */

const sizeClasses: Record<
  BadgeSize,
  { padding: string; text: string; icon: string; gap?: string }
> = {
  sm: {
    padding: "px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]",
    text: "text-[var(--font-size-2xs)]",
    icon: "w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]",
  },
  md: {
    padding: "px-[var(--badge-padding-x)] py-[var(--badge-padding-y)]",
    text: "text-xs",
    icon: "w-[calc(var(--icon-size-sm)*1.1)] h-[calc(var(--icon-size-sm)*1.1)]",
  },
  lg: {
    padding: "px-[var(--spacing-sm)] py-[var(--badge-padding-y)]",
    text: "text-[var(--font-size-sm)]",
    icon: "w-[var(--icon-size-md)] h-[var(--icon-size-md)]",
  },
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BADGE COMPONENT - Unified badge following rate badge design
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Badge - Unified badge component
 *
 * All badges use the same design tokens from /restaurants rate badge:
 * - Background: var(--badge-bg) - Semi-transparent rose red
 * - Text/Icons: var(--badge-color) - ALWAYS WHITE
 * - Blur: var(--badge-blur) - Backdrop blur
 * - Radius: var(--badge-radius) - Small radius (rectangle) or circle
 *
 * @example
 * // Default Shadi badge (rectangle, white text)
 * <Badge>Top Rated</Badge>
 *
 * // Circle badge (for counts, verified icons, etc.)
 * <Badge variant="circle" size="sm">5</Badge>
 *
 * // Status badge (open/closed/busy)
 * <Badge variant="status" status="open" size="md" showDot />
 */
export const Badge = memo(function Badge({
  children,
  variant = "shadi-badge",
  size = "md",
  status,
  showDot = false,
  className = "",
}: BadgeProps) {
  const sizing = sizeClasses[size]

  // Base classes - All badges share these
  const baseClasses = [
    "inline-flex items-center justify-center font-medium",
    "bg-[var(--badge-bg)]", // Semi-transparent rose red
    "backdrop-blur-[var(--badge-blur)]", // Blur effect
    "text-[var(--badge-color)]", // ALWAYS WHITE
    sizing.padding,
    sizing.text,
    "transition-all duration-[var(--duration-fast)]",
    className,
  ].join(" ")

  // Variant-specific classes
  const variantClasses =
    variant === "circle"
      ? "rounded-full" // Full circle for circle variant
      : "rounded-[var(--badge-radius)]" // Small radius for rectangle

  // Status badge with optional dot
  if (variant === "status" && status) {
    const config = statusConfig[status]
    return (
      <span className={`${baseClasses} ${variantClasses} gap-[var(--badge-gap)]`}>
        {showDot && (
          <span
            className="h-[var(--spacing-sm)] w-[var(--spacing-sm)] rounded-full bg-[var(--badge-color)]"
            aria-hidden="true"
          />
        )}
        <span>{config.label}</span>
      </span>
    )
  }

  // Default Shadi badge or Circle badge with children
  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {typeof children === "number" ? (
        <span>{children}</span>
      ) : children ? (
        <span className="flex items-center gap-[var(--badge-gap)]">{children}</span>
      ) : null}
    </span>
  )
})
