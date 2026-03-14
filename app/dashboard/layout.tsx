/**
 * Dashboard Layout
 * Shared layout for all dashboard pages
 * Features glass morphism design with gradient background
 * Collapsible sidebar with toggle button
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊", glow: "cyan" },
    { href: "/dashboard/chat", label: "AI Chat", icon: "💬", glow: "purple" },
    { href: "/dashboard/memory", label: "Memory", icon: "🧠", glow: "blue" },
    { href: "/dashboard/automation", label: "Automation", icon: "⚡", glow: "pink" },
    { href: "/dashboard/screen", label: "Screen", icon: "🖥️", glow: "green" },
    { href: "/dashboard/backups", label: "Backups", icon: "💾", glow: "cyan" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️", glow: "purple" },
  ]

  return (
    <div className="flex min-h-screen dashboard-bg -mt-[var(--header-total-height)] pt-[var(--header-total-height)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glass morphism style */}
      <aside
        className={`
          fixed md:relative z-50 h-[calc(100vh-var(--header-total-height)]
          w-64 glass-morph-card border-r border-white/10 p-[var(--spacing-lg)] m-2 rounded-[var(--radius-2xl)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="mb-[var(--spacing-xl)]">
          <h1 className="text-[var(--font-size-xl)] font-bold text-white">XMAD Control</h1>
          <p className="text-white/60 text-sm">v1.0.0</p>
        </div>

        <nav className="space-y-[var(--spacing-xs)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
                rounded-[var(--radius-lg)] glass-morph-card text-white hover:bg-white/10 transition-all
                ${pathname === item.href ? `glow-${item.glow} bg-white/10` : ""}
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-[var(--spacing-xl)]">
          <Link
            href="/"
            className="flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-30 md:hidden p-2 glass-morph-card rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {children}
      </main>
    </div>
  )
}
