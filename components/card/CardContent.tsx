/* ═══════════════════════════════════════════════════════════════════════════════
   CARD CONTENT - Text content for cards
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"

export interface CardContentProps {
  title: string
  description?: string
  meta?: string[]
  badges?: string[]
  className?: string
}

/**
 * CardContent - Text content for cards
 * Handles title, description, metadata, badges
 */
export const CardContent = memo(function CardContent({
  title,
  description,
  meta,
  badges,
  className = "",
}: CardContentProps) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-sm)] ${className}`}>
      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-[var(--spacing-xs)]">
          {badges.map((badge) => (
            <span
              key={badge}
              className="
                px-[var(--spacing-sm)] py-[var(--spacing-xs)]
                text-[var(--font-size-xs)]
                font-[var(--font-weight-medium)] rounded-[var(--radius-full)]
                bg-[var(--accent-rust)]/10
                text-[var(--accent-rust)]
                dark:bg-[var(--accent-rust)]/20
              "
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-[var(--font-size-base)] font-[var(--font-weight-semibold)] text-[var(--fg)] line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] line-clamp-2">{description}</p>
      )}

      {/* Meta */}
      {meta && meta.length > 0 && (
        <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-xs)] text-[var(--gray)]">
          {meta.map((item, index) => (
            <span key={item}>
              {item}
              {index < meta.length - 1 && <span className="mx-[var(--spacing-xs)]">•</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  )
})
