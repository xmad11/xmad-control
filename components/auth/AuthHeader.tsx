/* ═══════════════════════════════════════════════════════════════════════════════
   AUTH HEADER - Logo + branding for auth pages
   Positioned top-left, with "shadi.ae" text
   ═══════════════════════════════════════════════════════════════════════════════ */

export function AuthHeader() {
  return (
    <div className="flex items-center justify-start gap-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
      <img
        src="/LOGO/logo.svg"
        alt="Shadi"
        className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]"
      />
      <span className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">shadi.ae</span>
    </div>
  )
}
