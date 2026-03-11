/* ═══════════════════════════════════════════════════════════════════════════════
   SIDE MENU COMPONENT - XMAD Control
   Simplified version without auth/user features
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  HeartIcon,
  MagnifyingGlassIcon,
} from "@/components/icons"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import type { PanelProps } from "@/components/types"
import { useLanguage } from "@/context/LanguageContext"
import { clsx } from "clsx"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

interface NavItem {
  id: string
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  href: string | undefined
  action?: () => void
}

export default function SideMenu({ isOpen, onClose }: PanelProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleNavigate = useCallback((href: string) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  const navigationItems: NavItem[] = [
    { id: "restaurants", labelKey: "nav.restaurants", icon: MagnifyingGlassIcon, href: "/restaurants" },
    { id: "favorites", labelKey: "nav.favorites", icon: HeartIcon, href: "/favorites" },
  ]

  return (
    <div
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Header Section */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                X
              </div>
              <div>
                <p className="font-semibold text-white">XMAD Control</p>
                <p className="text-sm text-slate-400">v4.0</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Close</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => item.href && handleNavigate(item.href)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{t(item.labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
