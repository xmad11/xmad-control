/* ═══════════════════════════════════════════════════════════════════════════════
   IMAGE TOKENS - Single Source of Truth for Responsive Image Sizes
   Used with Next.js <Image> component to prevent over-fetching
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Image size tokens for Next.js Image `sizes` prop
 * Prevents browser from over-fetching large images
 *
 * Usage:
 * ```tsx
 * <Image
 *   src={src}
 *   sizes={IMAGE_SIZES.card}
 *   ...
 * />
 * ```
 */
export const IMAGE_SIZES = {
  /**
   * Hero images - full width on mobile, 1200px on desktop
   */
  hero: "(max-width: 768px) 100vw, 1200px",

  /**
   * Restaurant cards - responsive grid
   * Mobile: 2 columns (45vw), Tablet: 3 columns (30vw), Desktop: 320px fixed
   */
  card: "(max-width: 640px) 45vw, (max-width: 768px) 30vw, 320px",

  /**
   * Marquee cards - small horizontal scrolling cards
   * Mobile: 40vw, Desktop: 180px fixed
   */
  marquee: "(max-width: 640px) 40vw, 180px",

  /**
   * Thumbnail images - avatars, small thumbnails
   * Fixed 64px size
   */
  thumbnail: "64px",

  /**
   * Preview cards - medium cards for preview sections
   * Mobile: 50vw, Tablet: 33vw, Desktop: 25vw
   */
  preview: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",

  /**
   * Admin image gallery - flexible sizing
   * Mobile: 90vw, Desktop: 400px
   */
  gallery: "(max-width: 768px) 90vw, 400px",
} as const

/**
 * Image quality tiers for different use cases
 * Lower quality = smaller file size (use for small images)
 */
export const IMAGE_QUALITY = {
  /** Ultra-small images (thumbnails, marquee) */
  thumbnail: 50,

  /** Small images (cards, previews) */
  card: 60,

  /** Medium images (hero, featured) */
  hero: 75,

  /** Large images (full screen) */
  fullscreen: 85,
} as const

/**
 * Maximum image widths for different contexts
 * Used to prevent serving unnecessarily large images
 */
export const IMAGE_MAX_WIDTH = {
  /** Marquee cards - very small */
  marquee: 160,

  /** Thumbnails and avatars */
  thumbnail: 128,

  /** Restaurant cards */
  card: 400,

  /** Preview cards */
  preview: 400,

  /** Hero images */
  hero: 1200,

  /** Full screen gallery */
  gallery: 1920,
} as const
