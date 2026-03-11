/* ═══════════════════════════════════════════════════════════════════════════════
   SKIP LINK COMPONENT - Accessibility
   Allows keyboard users to skip navigation and jump to main content
   ═══════════════════════════════════════════════════════════════════════════════ */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-[var(--spacing-md)] left-[var(--spacing-md)]
        z-[var(--z-skip-link)]
        bg-primary text-[var(--color-white)]
        px-[var(--spacing-md)] py-[var(--spacing-sm)]
        rounded-[var(--radius-lg)]
        font-bold
        focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-white)]
        transition-all duration-[var(--duration-fast)]
      "
    >
      Skip to main content
    </a>
  )
}
