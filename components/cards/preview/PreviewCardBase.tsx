/* ═══════════════════════════════════════════════════════════════════════════════
   PREVIEW CARD BASE - Shared foundation for all preview cards
   HOME TABS ONLY - No search/result usage
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

/**
 * PreviewCardBase - Minimal wrapper for preview cards
 *
 * Rules:
 * - Fixed aspect ratio image
 * - No hover animations (causes CLS)
 * - No actions/buttons
 * - Maximum 2 text lines
 */
export interface PreviewCardBaseProps {
  children: React.ReactNode
  className?: string
}

const PreviewCardBase = memo(function PreviewCardBase({
  children,
  className = "",
}: PreviewCardBaseProps) {
  return (
    <div className={`bg-[var(--card-bg)] rounded-xl overflow-hidden ${className}`}>{children}</div>
  )
})

export { PreviewCardBase }
