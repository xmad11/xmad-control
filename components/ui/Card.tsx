/* ═══════════════════════════════════════════════════════════════════════════════
   DASHBOARD CARD - Generic card component for dashboard sections
   Uses design tokens, consistent spacing
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export type DashboardCardVariant = "default" | "primary" | "success" | "warning" | "error"
export type DashboardCardSize = "sm" | "md" | "lg"

export interface DashboardCardProps {
  children?: React.ReactNode
  variant?: DashboardCardVariant
  size?: DashboardCardSize
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

const variantClasses: Record<DashboardCardVariant, string> = {
  default: "bg-[var(--bg)] border border-[var(--fg-10)]",
  primary: "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20",
  success: "bg-[var(--status-open-bg)] border border-[var(--status-open-fg)]/20",
  warning: "bg-[var(--status-busy-bg)] border border-[var(--status-busy-fg)]/20",
  error: "bg-[var(--status-temp-closed-bg)] border border-[var(--status-temp-closed-fg)]/20",
}

const sizeClasses: Record<DashboardCardSize, string> = {
  sm: "p-[var(--spacing-md)]",
  md: "p-[var(--spacing-lg)]",
  lg: "p-[var(--spacing-xl)]",
}

/**
 * DashboardCard - Generic card for dashboard sections
 *
 * @example
 * <DashboardCard variant="primary" size="md" title="Stats" icon={<Icon />}>
 *   <p>Content here</p>
 * </DashboardCard>
 */
export const DashboardCard = memo(function DashboardCard({
  children,
  variant = "default",
  size = "md",
  title,
  subtitle,
  icon,
  className = "",
  onClick,
}: DashboardCardProps) {
  const cardContent = (
    <div
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-[var(--radius-xl)] transition-all duration-[var(--duration-normal)] ${onClick ? "hover:shadow-[var(--shadow-md)] cursor-pointer" : ""} ${className}`.trim()}
    >
      {(title || icon) && (
        <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
          {icon && <div className="flex-shrink-0 text-[var(--color-primary)]">{icon}</div>}
          <div>
            {title && (
              <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick}>
        {cardContent}
      </button>
    )
  }

  return cardContent
})
