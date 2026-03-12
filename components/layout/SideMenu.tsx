/* ═══════════════════════════════════════════════════════════════════════════════
   SIDE MENU COMPONENT - XMAD Control
   Mobile slide-out menu with backdrop
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Database, HomeIcon, LayoutGrid, MessageSquare, Server, Settings } from "@/components/icons"
import type { PanelProps } from "@/components/types"
import { clsx } from "clsx"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { id: "chat", label: "AI Chat", icon: MessageSquare, href: "/dashboard/chat" },
  { id: "memory", label: "Memory Editor", icon: Database, href: "/dashboard/memory" },
  { id: "automation", label: "Automation", icon: LayoutGrid, href: "/dashboard/automation" },
  { id: "screen", label: "Screen Viewer", icon: Server, href: "/dashboard/screen" },
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export default function SideMenu({ isOpen, onClose }: PanelProps) {
  const router = useRouter()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href)
      onClose()
    },
    [router, onClose]
  )

  return (
    <>
      {/* Backdrop - click to close */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
      />

      {/* Side Menu Panel */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--bg-secondary)] border-r border-[var(--fg-10)] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header Section */}
          <div className="border-b border-[var(--fg-10)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold text-lg">
                  X
                </div>
                <div>
                  <p className="font-semibold text-[var(--fg)]">XMAD Control</p>
                  <p className="text-xs text-[var(--fg-muted)]">v4.0</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-[var(--fg-muted)] hover:bg-[var(--fg-10)] hover:text-[var(--fg)] transition-colors touch-target"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>Close</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[var(--fg-muted)] transition-colors hover:bg-[var(--fg-10)] hover:text-[var(--fg)] touch-target"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-[var(--fg-10)] p-4">
            <p className="text-xs text-[var(--fg-muted)] text-center">XMAD Control Center</p>
          </div>
        </div>
      </div>
    </>
  )
}
