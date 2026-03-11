"use client"

/**
 * Reusable spinner component for loading states.
 * Uses design tokens only - no hardcoded values.
 * WCAG 2.1 AA compliant with ARIA attributes.
 */
export function Spinner({
  size = "md",
  label = "Loading…",
}: {
  size?: "sm" | "md" | "lg"
  label?: string
}) {
  const sizeClass = {
    sm: "h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]",
    md: "h-[var(--icon-size-md)] w-[var(--icon-size-md)]",
    lg: "h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]",
  }[size]

  return (
    <div
      className={`${sizeClass} spinner`}
      role="status"
      aria-label={label}
      aria-live="polite"
      data-testid="spinner"
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}
