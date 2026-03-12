/**
 * Dashboard Layout
 * Shared layout for all dashboard pages
 * Features glass morphism design with gradient background
 */

import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <div className="flex min-h-screen dashboard-bg">
      {/* Sidebar - Glass morphism style */}
      <aside className="w-64 glass-morph-card border-r border-white/10 p-[var(--spacing-lg)] m-2 rounded-[var(--radius-2xl)]">
        <div className="mb-[var(--spacing-xl)]">
          <h1 className="text-[var(--font-size-xl)] font-bold text-white">XMAD Control</h1>
          <p className="text-white/60 text-sm">v1.0.0</p>
        </div>

        <nav className="space-y-[var(--spacing-xs)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] glass-morph-card glow-${item.glow} text-white hover:bg-white/10 transition-all`}
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
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
