/* ═══════════════════════════════════════════════════════════════════════════════
   AUTH SHELL - Shared layout container for all auth pages
   Provides: horizontal padding, responsive max-width, proper centering
   Note: Uses block layout (not flex) to prevent visual offset issues
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react"

export interface AuthShellProps {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="w-full px-[var(--page-padding-x)]">
      <div className="mx-auto max-w-[var(--form-max-width)]">{children}</div>
    </div>
  )
}
