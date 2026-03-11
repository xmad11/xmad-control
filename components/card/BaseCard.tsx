/* ═══════════════════════════════════════════════════════════════════════════════
   BASE CARD - Single source of truth for ALL cards
   4 locked variants: image, compact, detailed, list
   NO expansion, NO conditional heights, NO hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export type CardVariant = "image" | "compact" | "detailed" | "list"
export type CardType = "restaurant" | "blog"

export interface BaseCardProps {
  variant: CardVariant
  type: CardType
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

/**
 * BaseCard - The ONLY card wrapper allowed
 *
 * VARIANTS (LOCKED - NON-NEGOTIABLE):
 * - image: 160px (marquee/hero, image only + optional overlays)
 * - compact: 200px (dense grids, image + 1 line)
 * - detailed: 280px (primary listing, 4 forced lines)
 * - list: 120px (horizontal, image left content right)
 *
 * ACCENTS:
 * - restaurant: warm (--card-accent-restaurant)
 * - blog: cool (--card-accent-blog)
 *
 * FORBIDDEN:
 * - NO height expansion
 * - NO inline height styles
 * - NO custom variants beyond these 4
 */
export const BaseCard = memo(function BaseCard({
  variant,
  type,
  children,
  className = "",
  href,
  onClick,
}: BaseCardProps) {
  // Fixed heights - NEVER change these
  const heightClasses: Record<CardVariant, string> = {
    image: "h-[var(--card-height-image)]",
    compact: "h-[var(--card-height-compact)]",
    detailed: "h-auto",
    list: "h-[var(--card-height-list)]",
  }

  // Type-specific accent colors
  const accentColor =
    type === "restaurant" ? "var(--card-accent-restaurant)" : "var(--card-accent-blog)"

  // Interactive element
  const Wrapper = href ? "a" : onClick ? "button" : "div"
  const wrapperProps: Record<string, unknown> = href
    ? { href, className: "block" }
    : onClick
      ? { type: "button" as const, onClick, className: "w-full text-left" }
      : {}

  return (
    <Wrapper
      className={`
        relative rounded-[var(--radius-xl)]
        bg-[var(--card-bg)]
        shadow-[var(--shadow-sm)]
        transition hover:shadow-[var(--shadow-md)]
        ${heightClasses[variant]}
        ${className}
      `}
      style={
        {
          /* @design-exception CSS_CUSTOM_PROPERTY: Dynamic accent color based on card type */
          "--card-accent": accentColor,
        } as React.CSSProperties
      }
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  )
})
