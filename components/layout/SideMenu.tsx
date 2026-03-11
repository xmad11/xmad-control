/* ═══════════════════════════════════════════════════════════════════════════════
   SIDE MENU COMPONENT - Restaurant Platform 2025-2026
   Role-aware navigation with different items per role (guest/user/owner/admin)
   Shows user info when signed in, sign-in button for guests
   Smooth sliding animation from al-kabab-recovery project
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  PaintBrushIcon,
  SignOutIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons"
import { OptimizedImage } from "@/components/images/OptimizedImage"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import type { PanelProps } from "@/components/types"
import { Button } from "@/components/ui"
import { useLanguage } from "@/context/LanguageContext"
import { useTheme } from "@/context/ThemeContext"
import type { AccentColorName } from "@/context/ThemeContext"
import { useUser } from "@/context/UserContext"
import { clsx } from "clsx"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import type { UserRole } from "./Header"

interface NavItem {
  id: string
  labelKey: string // Translation key instead of hardcoded label
  icon: React.ComponentType<{ className?: string }>
  href: string | undefined
  action?: () => void
}

/* Role-based navigation configurations with translation keys */
const ROLE_NAV_ITEMS_CONFIG: Record<
  UserRole,
  { nav: readonly Omit<NavItem, "label">[]; widgets: readonly Omit<NavItem, "label">[] }
> = {
  guest: {
    nav: [
      {
        id: "restaurants",
        labelKey: "nav.restaurants",
        icon: BuildingStorefrontIcon,
        href: "/restaurants",
      },
      {
        id: "search",
        labelKey: "nav.search",
        icon: MagnifyingGlassIcon,
        href: "/restaurants?focus=search",
      },
      { id: "saved", labelKey: "nav.favorites", icon: HeartIcon, href: "/favorites" },
    ] as const,
    widgets: [
      { id: "theme", labelKey: "settings.theme", icon: PaintBrushIcon, href: undefined },
      { id: "language", labelKey: "settings.language", icon: LanguageIcon, href: "/language" },
    ] as const,
  },
  user: {
    nav: [{ id: "saved", labelKey: "nav.favorites", icon: HeartIcon, href: "/favorites" }] as const,
    widgets: [
      { id: "theme", labelKey: "settings.theme", icon: PaintBrushIcon, href: undefined },
      { id: "language", labelKey: "settings.language", icon: LanguageIcon, href: "/language" },
      { id: "profile", labelKey: "nav.profile", icon: UserIcon, href: "/profile" },
    ] as const,
  },
  owner: {
    nav: [
      { id: "dashboard", labelKey: "nav.dashboard", icon: BuildingStorefrontIcon, href: "/owner" },
      {
        id: "restaurants",
        labelKey: "nav.restaurants",
        icon: BuildingStorefrontIcon,
        href: "/restaurants",
      },
      { id: "offers", labelKey: "common.new", icon: StarIcon, href: undefined },
    ] as const,
    widgets: [
      { id: "theme", labelKey: "settings.theme", icon: PaintBrushIcon, href: undefined },
      { id: "language", labelKey: "settings.language", icon: LanguageIcon, href: "/language" },
      { id: "profile", labelKey: "nav.profile", icon: UserIcon, href: "/profile" },
    ] as const,
  },
  admin: {
    nav: [
      { id: "dashboard", labelKey: "nav.dashboard", icon: BuildingStorefrontIcon, href: "/admin" },
      {
        id: "restaurants",
        labelKey: "nav.restaurants",
        icon: BuildingStorefrontIcon,
        href: "/restaurants",
      },
      { id: "users", labelKey: "common.new", icon: UsersIcon, href: undefined },
      { id: "reports", labelKey: "common.new", icon: ExclamationTriangleIcon, href: undefined },
    ] as const,
    widgets: [
      { id: "theme", labelKey: "settings.theme", icon: PaintBrushIcon, href: undefined },
      { id: "language", labelKey: "settings.language", icon: LanguageIcon, href: "/language" },
      { id: "profile", labelKey: "nav.profile", icon: UserIcon, href: "/profile" },
    ] as const,
  },
}

export interface SideMenuProps extends PanelProps {
  role?: UserRole
}

export default function SideMenu({ isOpen, onClose, role = "guest" }: SideMenuProps) {
  const { user, role: userRole, signOut } = useUser()
  const { openTheme } = useNavigation()
  const { t, language, setLanguage } = useLanguage()

  // Use the authenticated role from UserContext if available
  const effectiveRole = user ? userRole : role
  const { nav: NAV_ITEMS } = ROLE_NAV_ITEMS_CONFIG[effectiveRole]

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    }

    // Cleanup function - ensures scroll is unlocked when component unmounts
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const getUserName = (): string => {
    if (!user) return "User"
    const metadata = user.user_metadata || {}
    const name = metadata.name ?? metadata.full_name ?? user.email?.split("@")[0]
    return typeof name === "string" ? name : "User"
  }

  const avatarUrl = (() => {
    if (!user) return undefined
    const metadata = user.user_metadata || {}
    const url = metadata.avatar_url ?? metadata.picture
    return typeof url === "string" && url.length > 0 ? url : undefined
  })()

  return (
    <>
      {/* Mobile Overlay - Blurred, not dark */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm z-[var(--z-side-menu-backdrop)] transition-opacity duration-300"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Slide-out Menu - Same design as ThemeModal */}
      <aside
        className={clsx(
          "fixed right-0 top-[var(--theme-modal-top-aligned)] glass rounded-l-[var(--panel-radius)] shadow-[var(--shadow-2xl)] flex-shrink-0 transition-transform duration-300 z-[var(--z-side-menu)]",
          "w-[var(--side-menu-width)]",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
        style={{
          height: "calc(100vh - var(--theme-modal-top-aligned) - env(safe-area-inset-top))",
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Scrollable Content Area */}
          <div className="flex-1 p-[var(--spacing-lg)]">
            {/* Profile Section - Centered */}
            <div className="flex flex-col items-center pb-[var(--spacing-xl)] border-b border-[var(--fg-8)]">
              {/* Profile Avatar - Centered */}
              <div
                className="relative rounded-full overflow-hidden bg-[var(--fg-10)] border-[var(--border-width-thick)] border-[var(--fg-20)] mb-[var(--spacing-md)]"
                style={{
                  width: "var(--spacing-3xl)",
                  height: "var(--spacing-3xl)",
                }}
              >
                {avatarUrl ? (
                  <OptimizedImage
                    src={avatarUrl}
                    alt={getUserName()}
                    width={64}
                    height={64}
                    fill
                    sizes="64px"
                    quality={75}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* Demo avatar for guest users */
                  <OptimizedImage
                    src="/images/avatar-the-ss.jpg"
                    alt="@the.ss"
                    width={64}
                    height={64}
                    fill
                    sizes="64px"
                    quality={75}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Greeting - Centered */}
              <p className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {user ? getUserName() : "Shadi Shawqi"}
              </p>
              {user && (
                <p className="text-[var(--font-size-xs)] text-[var(--fg-60)] mt-[var(--spacing-xs)]">
                  {user.email}
                </p>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-[var(--spacing-xs)] py-[var(--spacing-sm)]">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                if (item.href) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="
                        nav-menu-item group relative w-full flex items-center
                        rounded-[var(--radius-lg)] px-[var(--spacing-md)] py-[var(--spacing-md)]
                        text-[var(--font-size-sm)] font-medium
                        transition-all duration-200
                        hover:text-[var(--fg)]
                        text-[var(--fg-70)]
                        touch-target
                      "
                      style={{ gap: "var(--spacing-md)" }}
                    >
                      <Icon className="flex-shrink-0 h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                      <span className="truncate">{t(item.labelKey)}</span>
                    </a>
                  )
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={onClose}
                    className="
                      nav-menu-item group relative w-full flex items-center
                      rounded-[var(--radius-lg)] px-[var(--spacing-md)] py-[var(--spacing-md)]
                      text-[var(--font-size-sm)] font-medium
                      transition-all duration-200
                      hover:text-[var(--fg)]
                      text-[var(--fg-70)]
                      touch-target
                    "
                    style={{ gap: "var(--spacing-md)" }}
                  >
                    <Icon className="flex-shrink-0 h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </button>
                )
              })}
            </nav>

            {/* Theme & Language Toggles - Side by side, centered */}
            <div className="flex items-center justify-center gap-[var(--spacing-md)] py-[var(--spacing-md)]">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => {
                  onClose()
                  openTheme()
                }}
                className="p-[var(--spacing-sm)] rounded-full bg-[var(--fg-5)] hover:bg-[var(--fg-10)] transition-colors"
                aria-label="Theme"
              >
                <PaintBrushIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--fg-70)]" />
              </button>

              {/* Language Toggle */}
              <button
                type="button"
                onClick={() => {
                  setLanguage(language === "ar" ? "en" : "ar")
                }}
                className="p-[var(--spacing-sm)] rounded-full bg-[var(--fg-5)] hover:bg-[var(--fg-10)] transition-colors"
                aria-label="Toggle language"
              >
                <span className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] flex items-center justify-center text-[var(--fg-70)] font-bold text-[18px]">
                  {language === "ar" ? "E" : "ع"}
                </span>
              </button>
            </div>

            {/* Line after theme/language */}
            <div className="h-[var(--divider-width)] bg-[var(--fg-8)]" />

            {/* Sign In/Out Button Section */}
            <div className="py-[var(--spacing-xl)] border-b border-[var(--fg-8)]">
              {!user ? (
                <a href="/login" onClick={onClose}>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full bg-[var(--color-brand-secondary)]"
                  >
                    {t("nav.signIn")}
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={handleSignOut}
                  leftIcon={
                    <SignOutIcon
                      style={{ width: "var(--icon-size-sm)", height: "var(--icon-size-sm)" }}
                    />
                  }
                >
                  {t("nav.signOut")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
