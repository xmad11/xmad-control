/* ═══════════════════════════════════════════════════════════════════════════════
   CARD VARIANTS - Pure UI components, no logic
   2 variants: compact (summary), detailed (full featured)
   ═══════════════════════════════════════════════════════════════════════════════ */

export { CompactVariant } from "./compact"
export type { CompactVariantProps } from "./compact"

export { DetailedVariant } from "./detailed"
export type { DetailedVariantProps } from "./detailed"

// Alias exports for backwards compatibility
export { DetailedVariant as ImageVariant } from "./detailed"
export { CompactVariant as ListVariant } from "./compact"
export type { DetailedVariantProps as ImageVariantProps } from "./detailed"
export type { CompactVariantProps as ListVariantProps } from "./compact"
