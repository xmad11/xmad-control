/* ═══════════════════════════════════════════════════════════════════════════════
   APP HEADER - XMAD Control Dashboard
   Single source of truth for header
   - XMAD Logo (left) → opens LEFT sheet
   - Theme icon → opens ThemeModal
   - Menu icon (right) → opens RIGHT sheet
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Bars3BottomRightIcon } from "@/components/icons"
import { BackButton } from "@/components/navigation/BackButton"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { THEME_ICONS } from "@/components/theme-constants"
import { useSheetContext } from "@/context/SheetContext"
import { type ThemeMode, useTheme } from "@/context/ThemeContext"
import { usePathname } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import SideMenu from "./SideMenu"
import ThemeModal from "./ThemeModal"

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
  const { mode, mounted: themeMounted } = useTheme()
  const { activePanel, openMenu, openTheme, closeAll, showBackButton } = useNavigation()
  const { openSheet, closeSheet, isSheetOpen } = useSheetContext()
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Only show theme icon on home page
  const isHomePage = pathname === "/"

  /* ─────────────────────────────────────────────────────────────────────────
     Scroll handler with requestAnimationFrame throttling
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
     Panel handlers - uses NavigationContext for theme, SheetContext for sheets
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

  const handleThemeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (activePanel === "theme") {
        closeAll()
      } else {
        openTheme()
      }
    },
    [activePanel, closeAll, openTheme]
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
    if (activePanel !== "none") {
      closeAll()
    }
    if (isSheetOpen("left") || isSheetOpen("right")) {
      closeSheet()
    }
  }, [activePanel, closeAll, isSheetOpen, closeSheet])

  const handleHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (activePanel !== "none") {
          closeAll()
        }
        if (isSheetOpen("left") || isSheetOpen("right")) {
          closeSheet()
        }
      }
    },
    [activePanel, closeAll, isSheetOpen, closeSheet]
  )

  /* ─────────────────────────────────────────────────────────────────────────
     Pre-compute class names
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

  const ThemeIcon = THEME_ICONS[mode]

  const showHeaderClick = activePanel !== "none" || isSheetOpen("left") || isSheetOpen("right")

  // Hide header when side sheets are open
  const isSideSheetOpen = isSheetOpen("left") || isSheetOpen("right")

  return (
    <>
      {!isSideSheetOpen && (
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
              {/* LayoutDashboard Icon */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--widget-cyan)]/20 border border-[var(--widget-cyan)]/30">
                <LayoutDashboard className="h-4 w-4 text-[var(--widget-cyan)]" />
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

          {/* Actions */}
          <div className="flex items-center gap-[var(--header-actions-gap)]">
            <div className="h-[var(--icon-size-lg)] w-[var(--divider-width)] bg-[var(--color-gray-500)] mx-[var(--spacing-sm)] hidden md:block opacity-[var(--opacity-subtle)]" />

            {/* Theme Launcher - only on home page */}
            {isHomePage && (
              <button
                type="button"
                onClick={handleThemeClick}
                className="transition-all active:scale-95 group relative p-[var(--spacing-sm)] touch-target"
                aria-label="Toggle theme"
              >
                <ThemeIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg)] stroke-[2px]" />
              </button>
            )}

            {/* Menu Launcher - Opens RIGHT sheet */}
            <button
              type="button"
              onClick={handleMenuClick}
              className="transition-all active:scale-95 group relative p-[var(--spacing-sm)] touch-target"
              aria-label="Open menu"
              aria-expanded={isSheetOpen("right")}
            >
              <Bars3BottomRightIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg)] stroke-[2px]" />
            </button>
          </div>
        </div>
      </nav>
      )}

      {/* Theme Modal - uses NavigationContext */}
      {activePanel === "theme" && <ThemeModal isOpen={true} onClose={closeAll} />}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   React.memo wrapper
   ───────────────────────────────────────────────────────────────────────── */
export const AppHeader = memo(AppHeaderComponent)

// Default export for backward compatibility
export default memo(AppHeaderComponent)
