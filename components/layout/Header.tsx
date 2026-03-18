/* ═══════════════════════════════════════════════════════════════════════════════
   APP HEADER - XMAD Control Dashboard
   Single source of truth for header across all pages
   - XMAD Logo (left) → opens LEFT sheet
   - Menu icon (right) → opens RIGHT sheet
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { BackButton } from "@/components/navigation/BackButton"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { useSheetContext } from "@/context/SheetContext"
import { type ThemeMode, useTheme } from "@/context/ThemeContext"
import { Menu } from "lucide-react"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

export type UserRole = "guest" | "user" | "owner" | "admin"

export interface AppHeaderProps {
  role?: UserRole
  showRoleBadge?: boolean
  title?: string
  subtitle?: string
}

/* ─────────────────────────────────────────────────────────────────────────
   Component constants - defined outside render to prevent recreation
   ───────────────────────────────────────────────────────────────────────── */
const SCROLL_HIDE_THRESHOLD = 50
const SCROLL_GLASS_THRESHOLD = 20

function AppHeaderComponent({
  role: _role = "guest",
  showRoleBadge: _showRoleBadge = false,
  title,
  subtitle,
}: AppHeaderProps) {
  const { mounted: themeMounted } = useTheme()
  const { showBackButton } = useNavigation()
  const { activeSheet, openSheet, closeSheet, isSheetOpen } = useSheetContext()
  const [visible, setVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  /* ─────────────────────────────────────────────────────────────────────────
     Scroll handler with requestAnimationFrame throttling
     - Hides header on scroll down, shows on scroll up
     - Prevents layout thrashing
     ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const updateScrollState = () => {
      const currentScrollY = window.scrollY

      // Visibility toggle on scroll direction
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < SCROLL_HIDE_THRESHOLD)

      // Add glass effect when scrolled
      setIsScrolled(currentScrollY > SCROLL_GLASS_THRESHOLD)

      lastScrollY.current = currentScrollY
      ticking.current = false
    }

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(updateScrollState)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
     Sheet handlers
     ───────────────────────────────────────────────────────────────────────── */
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isSheetOpen("left")) {
        closeSheet()
      } else {
        openSheet("left")
      }
    },
    [isSheetOpen, closeSheet, openSheet]
  )

  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isSheetOpen("right")) {
        closeSheet()
      } else {
        openSheet("right")
      }
    },
    [isSheetOpen, closeSheet, openSheet]
  )

  const handleHeaderClick = useCallback(() => {
    if (activeSheet) {
      closeSheet()
    }
  }, [activeSheet, closeSheet])

  const handleHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && activeSheet) {
        closeSheet()
      }
    },
    [activeSheet, closeSheet]
  )

  /* ─────────────────────────────────────────────────────────────────────────
     Pre-compute class names to reduce string operations on each render
     ───────────────────────────────────────────────────────────────────────── */
  const headerClasses = useMemo(() => {
    const visibilityClasses = visible
      ? "translate-y-0 opacity-[var(--opacity-full)]"
      : "-translate-y-[calc(var(--header-height)*2)] opacity-[var(--opacity-faint)] pointer-events-none"

    const scrolledClasses = isScrolled
      ? "glass-header rounded-[var(--radius-3xl)] shadow-[var(--shadow-xl)] py-[var(--header-padding-y)] px-[var(--header-padding-x-scrolled)]"
      : "bg-transparent py-[var(--header-padding-y)] px-[var(--header-padding-x-normal)]"

    return `fixed top-[var(--header-offset-top)] left-1/2 -translate-x-1/2 z-[var(--z-header)] w-[var(--header-width)] transition-all duration-700 ${visibilityClasses} ${scrolledClasses}`
  }, [visible, isScrolled])

  const showHeaderClick = activeSheet !== null

  return (
    <nav
      onClick={showHeaderClick ? handleHeaderClick : undefined}
      onKeyDown={showHeaderClick ? handleHeaderKeyDown : undefined}
      className={headerClasses}
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center">
        {/* Left side - Back button (conditional) + Logo */}
        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Back Button - shows when enabled via navigation context AND theme is mounted */}
          {showBackButton && themeMounted && <BackButton className="flex-shrink-0" />}

          {/* Logo - Opens LEFT sheet */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-[var(--header-logo-gap)] group bg-transparent touch-target"
            aria-label="Open navigation"
            aria-expanded={isSheetOpen("left")}
          >
            {/* XMAD Logo Icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white bg-gradient-to-br from-cyan-400 to-purple-500">
              X
            </div>
            <span className="text-[var(--font-size-xl)] font-black tracking-tight text-[var(--fg)] hidden sm:inline">
              XMAD
            </span>

            {/* Show title/subtitle if provided */}
            {title && (
              <div className="flex items-center gap-[var(--spacing-xs)]">
                <span className="text-[var(--font-size-lg)] font-black tracking-tight text-[var(--fg)]">
                  {title}
                </span>
                {subtitle && (
                  <span className="text-[var(--font-size-lg)] font-black tracking-tight text-[var(--color-primary)] italic">
                    {subtitle}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Right side - Menu icon (opens RIGHT sheet) */}
        <div className="flex items-center gap-[var(--header-actions-gap)]">
          <button
            type="button"
            onClick={handleMenuClick}
            className="transition-all active:scale-95 group relative p-[var(--spacing-sm)] touch-target"
            aria-label="Open menu"
            aria-expanded={isSheetOpen("right")}
          >
            <Menu className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg)] stroke-[2px]" />
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   React.memo wrapper - Prevents unnecessary re-renders when props haven't changed
   ───────────────────────────────────────────────────────────────────────── */
export const AppHeader = memo(AppHeaderComponent)

// Default export for backward compatibility
export default memo(AppHeaderComponent)
