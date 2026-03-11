/* ═══════════════════════════════════════════════════════════════════════════════
   INSTAGRAM VERIFIED BADGE - Blue circle with white checkmark
   Uses design token for verified badge color
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export interface VerifiedBadgeProps {
  className?: string
  size?: number
}

/**
 * InstagramVerifiedBadge - Blue circle with white checkmark
 *
 * Design specs:
 * - Blue circle background: Uses --color-accent-azure (bright sky blue)
 * - White checkmark inside
 * - Typically 14-16px
 */
export const InstagramVerifiedBadge = memo(function InstagramVerifiedBadge({
  className = "",
  size = 14,
}: VerifiedBadgeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-[var(--color-accent-azure)]`}
      aria-label="Verified account"
      role="img"
    >
      <title>Verified account</title>
      {/* Blue circle background */}
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      {/* White checkmark */}
      <path
        d="M4.5 8L6.5 10L11.5 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
})
