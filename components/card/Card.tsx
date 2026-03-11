/* ═══════════════════════════════════════════════════════════════════════════════
   CARD - Base card component with variants
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import type { CardDensity, CardType, CardVariant } from "./legacy-variants"

export interface BaseCardProps {
  id: string
  variant?: CardVariant
  density?: CardDensity
  type?: CardType
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

/**
 * Base Card component - never rendered alone, use RestaurantCard or BlogCard
 * All spacing, sizing uses design tokens
 */
export const Card = memo(function Card({
  id,
  variant = "default",
  density = "normal",
  type = "generic",
  children,
  className = "",
  href,
  onClick,
}: BaseCardProps) {
  // Variant classes using tokens
  const variantClasses: Record<CardVariant, string> = {
    default: "p-[var(--spacing-lg)] gap-[var(--spacing-md)] rounded-[var(--radius-lg)]",
    compact: "p-[var(--spacing-sm)] gap-[var(--spacing-xs)] rounded-[var(--radius-md)]",
    media: "p-0 gap-0 rounded-[var(--radius-xl)] overflow-hidden",
    overlay: "p-[var(--spacing-md)] gap-[var(--spacing-sm)] rounded-[var(--radius-lg)]",
  }

  // Density modifier
  const densityClass = density === "dense" ? "data-[density=dense]" : ""

  // Glass effect (disable for dense mode via CSS)
  const glassClass = "glass-card"

  // Interactive element
  const Wrapper = href ? "a" : onClick ? "button" : "div"
  const wrapperProps: Record<string, unknown> = href
    ? { href, className: "block" }
    : onClick
      ? { type: "button" as const, onClick, className: "w-full text-left" }
      : {}

  return (
    <Wrapper
      id={id}
      data-card-type={type}
      data-variant={variant}
      data-density={density}
      className={`
        ${glassClass}
        ${variantClasses[variant]}
        ${densityClass}
        relative bg-[var(--glass-bg)] dark:bg-[var(--color-gray-900)]
        border border-[var(--fg-10)] dark:border-[var(--color-gray-700)]
        transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]
        hover:shadow-[var(--shadow-lg)]
        ${className}
      `}
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  )
})
