/* ═══════════════════════════════════════════════════════════════════════════════
   CARD VARIANTS - Design tokens for card variations
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

export type CardVariant = "default" | "compact" | "media" | "overlay"
export type CardDensity = "normal" | "dense"
export type CardType = "restaurant" | "blog" | "generic"

export interface CardVariants {
  variant?: CardVariant
  density?: CardDensity
  type?: CardType
}

/**
 * Variant token mappings - all use CSS variables
 */
export const variantTokens = {
  padding: {
    default: "var(--spacing-lg)",
    compact: "var(--spacing-sm)",
    media: "0",
    overlay: "var(--spacing-md)",
  },
  gap: {
    default: "var(--spacing-md)",
    compact: "var(--spacing-xs)",
    media: "0",
    overlay: "var(--spacing-sm)",
  },
  borderRadius: {
    default: "var(--radius-lg)",
    compact: "var(--radius-md)",
    media: "var(--radius-xl)",
    overlay: "var(--radius-lg)",
  },
} as const
