/**
 * Dashboard Layout with Sticky Bottom Navigation
 * Tabs centered horizontally, sticky to bottom
 * Overview in center, 3 left, 3 right
 * Auto-collapse with no arrow indicator
 */

"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const navItems = [
  // Left tabs (3)
  { href: "/dashboard/automation", label: "Automation", icon: "⚡", position: "left" },
  { href: "/dashboard/memory", label: "Memory", icon: "🧠", position: "left" },
  { href: "/dashboard/screen", label: "Screen", icon: "🖥️", position: "left" },
  
  // Center tab (Overview - default)
  { href: "/dashboard", label: "Overview", icon: "📊", position: "center" },
  
  // Right tabs (3)
  { href: "/dashboard/backups", label: "Backups", icon: "💾", position: "right" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", position: "right" },
  { href: "/dashboard/chat", label: "Chat", icon: "💬", position: "right" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Find current active tab
  const currentTab = navItems.find(item => item.href === pathname)
  const centerTab = navItems.find(item => item.position === "center")

  // Auto-collapse after 2 seconds
  useEffect(() => {
    if (isExpanded) {
      const timeout = setTimeout(() => {
        setIsExpanded(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isExpanded])

  // Determine which tab is active (default to Overview if no match)
  const activeTab = currentTab || centerTab

  return (
    <div className="min-h-screen bg-[var(--dashboard-bg)]">
      {/* Main Content Area - Add bottom padding for nav */}
      <main className="pb-24">
        {children}
      </main>

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--glass-bg)] border-t border-[var(--fg-10)] backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          {/* All Tabs - Centered Horizontally */}
          <div className="flex justify-center items-center gap-2">
            
            {/* Left Tabs (3) */}
            <div className="flex gap-2">
              {navItems.filter(item => item.position === "left").map((item) => {
                const isActive = activeTab?.href === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsExpanded(true)}
                    className={`
                      relative flex flex-col items-center gap-1 px-4 py-2
                      rounded-xl transition-all duration-200
                      ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                      ${isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--bg-secondary)]'}
                      ${isActive ? 'ring-2 ring-[var(--color-primary)]/50' : ''}
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isExpanded && (
                      <span className="text-xs text-white">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Center Tab (Overview - Default) */}
            {centerTab && (
              <Link
                key={centerTab.href}
                href={centerTab.href}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-6 py-3
                  rounded-full transition-all duration-200
                  ${activeTab?.href === centerTab.href ? 'bg-[var(--color-primary)]' : 'bg-[var(--bg-secondary)]'}
                  ${activeTab?.href === centerTab.href ? 'ring-2 ring-[var(--color-primary)]/50' : ''}
                  ${activeTab?.position !== 'center' ? 'scale-90' : 'scale-100'}
                `}
              >
                <span className="text-2xl">{centerTab.icon}</span>
                {isExpanded && (
                  <span className="text-sm font-semibold text-white">{centerTab.label}</span>
                )}
              </Link>
            )}

            {/* Right Tabs (3) */}
            <div className="flex gap-2">
              {navItems.filter(item => item.position === "right").map((item) => {
                const isActive = activeTab?.href === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsExpanded(true)}
                    className={`
                      relative flex flex-col items-center gap-1 px-4 py-2
                      rounded-xl transition-all duration-200
                      ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                      ${isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--bg-secondary)]'}
                      ${isActive ? 'ring-2 ring-[var(--color-primary)]/50' : ''}
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isExpanded && (
                      <span className="text-xs text-white">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Collapsed State - Show only center tab */}
          {!isExpanded && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="flex flex-col items-center gap-1 px-6 py-3 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)] transition-all"
              >
                <span className="text-2xl">{activeTab?.icon || centerTab?.icon}</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
