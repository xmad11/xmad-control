/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE TITLE - Semantic, reusable page heading component

   Single source of truth for page titles across the application.
   Uses design tokens for consistent sizing and spacing.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react"

export interface PageTitleProps {
  children: ReactNode
  className?: string
  size?: "page" | "section" | "hero"
}

/**
 * PageTitle - Semantic page heading component
 *
 * Size options:
 * - "page": Default for main page titles (--heading-page = 36px)
 * - "section": For section headers (--heading-section = 30px)
 * - "hero": For hero/display text (--heading-hero = 60px)
 *
 * @example
 * <PageTitle>Restaurants in UAE</PageTitle>
 * <PageTitle size="hero">Welcome</PageTitle>
 */
export function PageTitle({ children, className = "", size = "page" }: PageTitleProps) {
  const sizeClasses = {
    page: "text-[var(--heading-page)]",
    section: "text-[var(--heading-section)]",
    hero: "text-[var(--heading-hero)]",
  }

  return (
    <h1
      className={`
        ${sizeClasses[size]}
        font-black
        tracking-tight
        text-center
        leading-[var(--line-height-display)]
        ${className}
      `}
    >
      {children}
    </h1>
  )
}
