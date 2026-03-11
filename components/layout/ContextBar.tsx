/* ═══════════════════════════════════════════════════════════════════════════════
   CONTEXT BAR - Page-aware navigation layer
   Sits between Header and page content
   Owns spacing via tokens (NOT page responsibility)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChevronLeft } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { type HTMLAttributes, forwardRef } from "react"

export type ContextBarVariant = "none" | "search" | "detail"

interface ContextBarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContextBarVariant
  title?: string
  showBack?: boolean
  sticky?: boolean
  children?: React.ReactNode
}

export const ContextBar = forwardRef<HTMLDivElement, ContextBarProps>(
  (
    { variant = "none", title, showBack = false, sticky = true, className, children, ...props },
    ref
  ) => {
    const router = useRouter()

    const handleBack = () => {
      router.back()
    }

    // variant="none" renders nothing
    if (variant === "none") return null

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "w-full bg-[var(--bg)] border-b border-[var(--fg-10)]",
          // Sticky behavior ONLY for ContextBar
          sticky && "sticky top-[var(--header-total-height)] z-40",
          // Spacing - uses tokens, NOT hardcoded
          "px-[var(--page-padding-x)] py-[var(--spacing-sm)]",
          // Height is controlled by content, not fixed
          "min-h-[var(--context-bar-height)]",
          // Custom classes allowed
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Back Button - single source of truth */}
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-5)] transition-colors text-[var(--fg)]"
              aria-label="Go back"
            >
              <ChevronLeft className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
            </button>
          )}

          {/* Content slot */}
          {variant === "search" && <div className="flex-1">{children}</div>}

          {variant === "detail" && title && (
            <h1 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--fg)]">
              {title}
            </h1>
          )}
        </div>
      </div>
    )
  }
)

ContextBar.displayName = "ContextBar"
