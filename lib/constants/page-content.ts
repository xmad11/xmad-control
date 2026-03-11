/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE CONTENT LIMITS - Character limits for editable page content
   These limits ensure content fits properly on the smallest screen size (320px)
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Character limits for page titles and subtitles
 * Calculated based on:
 * - Smallest screen: 320px (iPhone SE)
 * - Container padding: var(--spacing-md) on each side
 * - Available width: 320px - 2 × var(--spacing-md)
 * - Font tokens: var(--heading-hero) for titles, var(--font-size-base) for subtitles
 */

export const PAGE_CONTENT_LIMITS = {
  /**
   * Restaurants page title
   * Font: var(--hero-title-size) (clamp(3rem, 7vw, 6rem) = 48-96px)
   * Max lines: 2
   * Max characters: 18 (fits 2 lines on 320px screen with hero title font)
   */
  restaurantsTitle: {
    max: 18,
    maxLines: 2,
    label: "Page Title",
  },

  /**
   * Restaurants page subtitle
   * Font: var(--font-size-base)
   * Max lines: 3
   * Max characters: 90 (fits 3 lines on 320px screen with base font)
   */
  restaurantsSubtitle: {
    max: 90,
    maxLines: 3,
    label: "Page Subtitle",
  },

  /**
   * Blog page title
   * Font: var(--heading-hero)
   * Max lines: 2
   * Max characters: 20 (same as restaurants for consistency)
   */
  blogTitle: {
    max: 20,
    maxLines: 2,
    label: "Page Title",
  },

  /**
   * Blog page subtitle
   * Font: var(--font-size-base)
   * Max lines: 3
   * Max characters: 90
   */
  blogSubtitle: {
    max: 90,
    maxLines: 3,
    label: "Page Subtitle",
  },
} as const

export type PageContentType = keyof typeof PAGE_CONTENT_LIMITS

/**
 * Format character count for admin display
 * @example
 * formatCharCount(43, 97) // "43/97"
 * formatCharCount(0, 25) // "0/25"
 */
export function formatCharCount(current: number, max: number): string {
  return `${current}/${max}`
}

/**
 * Check if content exceeds character limit
 */
export function exceedsCharLimit(content: string, max: number): boolean {
  return content.length > max
}

/**
 * Get remaining characters allowed
 */
export function getRemainingChars(content: string, max: number): number {
  return Math.max(0, max - content.length)
}

/**
 * Truncate content to fit within limit (with ellipsis if needed)
 */
export function truncateToLimit(content: string, max: number): string {
  if (content.length <= max) return content
  return `${content.slice(0, max - 3)}...`
}
