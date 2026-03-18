/* ═══════════════════════════════════════════════════════════════════════════════
   CARD SYSTEM - Unified card architecture
   ═══════════════════════════════════════════════════════════════════════════════ */

// Base
export { BaseCard } from "./BaseCard"
export type { BaseCardProps, CardVariant, CardType } from "./BaseCard"

// Variants (pure UI components)
export * from "./variants"

// Legacy (deprecated - will be removed)
export { Card } from "./Card"
export type { BaseCardProps as LegacyCardProps } from "./Card"
export { CardContent } from "./CardContent"
export type { CardContentProps } from "./CardContent"
export type {
  CardVariant as LegacyCardVariant,
  CardDensity,
  CardType as LegacyCardType,
} from "./legacy-variants"

// CardMedia (carousel)
export { CardMedia } from "./CardMedia"
export type { CardMediaProps } from "./CardMedia"
