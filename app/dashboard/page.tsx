/**
 * Dashboard Page
 * Main dashboard for XMAD system monitoring and control
 */

"use client"

import { Database, LayoutGrid, MessageSquare, Server, Settings, Wifi } from "@/components/icons"
import { xmadApi } from "@/lib/xmad-api"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export const metadata = {
  title: "Dashboard | XMAD Control",
}

export default async function DashboardPage() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  // Auto-collapse tabs after delay
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleClick = () => {
      setIsExpanded(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => setIsExpanded(false), 2000)
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  // Fetch initial data server-side
  let systemStats = null
  let openclawStatus = null
  let tailscaleStatus = null

  try {
    const [statsRes, openclawRes, tailscaleRes] = await Promise.allSettled([
      xmadApi.getSystemStats(),
      xmadApi.getOpenClawStatus(),
      xmadApi.getTailscaleStatus(),
    ])

    if (statsRes.status === "fulfilled") systemStats = statsRes.value
    if (openclawRes.status === "fulfilled") openclawStatus = openclawRes.value
    if (tailscaleRes.status === "fulfilled") tailscaleStatus = tailscaleRes.value
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
  }

  const isCenterTab = pathname === "/dashboard"

  return (
    <>
      {/* SCROLLABLE CONTENT - Separate from navigation */}
      <div className="min-h-screen overflow-x-hidden pb-24">
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1920px] mx-auto p-[var(--spacing-xl)]">
            {/* Header */}
            <header className="mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
              <div className="flex items-center justify-between">
                <h1 className="text-[var(--font-size-3xl)] font-bold text-white">
                  XMAD Control Center
                </h1>
                <div className="text-sm text-white/70">System status and monitoring</div>
              </div>
            </header>

            {/* Status Cards Grid - Mobile First with Glow Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--spacing-md)] md:gap-[var(--spacing-lg)] lg:gap-[var(--spacing-xl)] mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
              {/* System Stats Card - Cyan Glow */}
              <div className="glass-morph-card glow-cyan p-[var(--spacing-lg)] md:p-[var(--spacing-xl)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[var(--glow-cyan)]/20">
                    <Database className="w-5 h-5 md:w-6 md:h-6 text-[var(--glow-cyan)]" />
                  </div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    XMAD System Stats
                  </h2>
                </div>
                {systemStats?.memory && systemStats.disk ? (
                  <div className="space-y-2 md:space-y-3">
                    <StatRow label="CPU" value={`${systemStats.cpu?.toFixed(1) || "0.0"}%`} />
                    <StatRow
                      label="Memory"
                      value={`${systemStats.memory?.percentage?.toFixed(1) || "0.0"}%`}
                    />
                    <StatRow
                      label="Disk"
                      value={`${systemStats.disk?.percentage?.toFixed(1) || "0.0"}%`}
                    />
                    <StatRow label="Uptime" value={`${Math.floor(systemStats.uptime / 3600)}h`} />
                  </div>
                ) : (
                  <p className="text-sm text-white/60">Loading...</p>
                )}
              </div>

              {/* OpenClaw Status Card - Purple Glow */}
              <div className="glass-morph-card glow-purple p-[var(--spacing-lg)] md:p-[var(--spacing-xl)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[var(--glow-purple)]/20">
                    <Wifi className="w-5 h-5 md:w-6 md:h-6 text-[var(--glow-purple)]" />
                  </div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    OpenClaw Gateway
                  </h2>
                </div>
                {openclawStatus ? (
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Status:</span>
                      <StatusBadge isOnline={openclawStatus.running} />
                    </div>
                    {openclawStatus.pid && (
                      <StatRow label="PID" value={String(openclawStatus.pid)} />
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">Loading...</p>
                )}
              </div>

              {/* Tailscale Status Card - Blue Glow */}
              <div className="glass-morph-card glow-blue p-[var(--spacing-lg)] md:p-[var(--spacing-xl)] sm:col-span-2 xl:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[var(--glow-blue)]/20">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-[var(--glow-blue)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      role="img"
                      aria-label="Tailscale VPN"
                    >
                      <title>Tailscale VPN</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    Tailscale VPN
                  </h2>
                </div>
                {tailscaleStatus ? (
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Status:</span>
                      <StatusBadge isOnline={tailscaleStatus.connected} />
                    </div>
                    {tailscaleStatus.ip && <StatRow label="IP" value={tailscaleStatus.ip} mono />}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">Loading...</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <section className="mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--spacing-md)] md:gap-[var(--spacing-lg)] lg:gap-[var(--spacing-xl)]">
                <ActionButton
                  href="/dashboard/chat"
                  icon={MessageSquare}
                  label="AI Chat"
                  glow="purple"
                />
                <ActionButton href="/dashboard/memory" icon={Database} label="Memory" glow="blue" />
                <ActionButton
                  href="/dashboard/automation"
                  icon={LayoutGrid}
                  label="Automation"
                  glow="pink"
                />
                <ActionButton href="/dashboard/screen" icon={Server} label="Screen" glow="green" />
                <ActionButton
                  href="/dashboard/settings"
                  icon={Settings}
                  label="Settings"
                  glow="cyan"
                />
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* STICKY BOTTOM NAVIGATION - Outside scrolling area */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--glass-bg)] border-t border-[var(--fg-10)] backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          {/* All Tabs - Centered Horizontally */}
          <div className="flex justify-center items-center gap-2">
            {/* Left Tabs (3): Automation, Memory, Screen */}
            <div className="flex gap-2">
              {["/dashboard/automation", "/dashboard/memory", "/dashboard/screen"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setIsExpanded(true)}
                  className={`
                    relative flex flex-col items-center gap-1.5 px-3 py-2
                    rounded-2xl transition-all duration-200
                    ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                    ${pathname === tab ? "bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50" : "bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]"}
                  `}
                >
                  <span className="text-2xl">
                    {tab === "/dashboard/automation" && "⚡"}
                    {tab === "/dashboard/memory" && "🧠"}
                    {tab === "/dashboard/screen" && "🖥️"}
                  </span>
                  {isExpanded && (
                    <span className="text-xs text-white">
                      {tab === "/dashboard/automation" && "Automation"}
                      {tab === "/dashboard/memory" && "Memory"}
                      {tab === "/dashboard/screen" && "Screen"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Center Tab (Overview) - Default */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                relative flex flex-col items-center justify-center gap-1.5 px-4 py-3
                rounded-full transition-all duration-200
                ${isCenterTab ? "bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50 scale-105" : "bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]"}
              `}
            >
              <span className="text-2xl">📊</span>
              {isExpanded && isCenterTab && (
                <span className="text-sm text-white font-medium">Overview</span>
              )}
            </button>

            {/* Right Tabs (3): Backups, Settings, Chat */}
            <div className="flex gap-2">
              {["/dashboard/backups", "/dashboard/settings", "/dashboard/chat"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setIsExpanded(true)}
                  className={`
                    relative flex flex-col items-center gap-1.5 px-3 py-2
                    rounded-2xl transition-all duration-200
                    ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                    ${pathname === tab ? "bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50" : "bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]"}
                  `}
                >
                  <span className="text-2xl">
                    {tab === "/dashboard/backups" && "💾"}
                    {tab === "/dashboard/settings" && "⚙️"}
                    {tab === "/dashboard/chat" && "💬"}
                  </span>
                  {isExpanded && (
                    <span className="text-xs text-white">
                      {tab === "/dashboard/backups" && "Backups"}
                      {tab === "/dashboard/settings" && "Settings"}
                      {tab === "/dashboard/chat" && "Chat"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

// Helper Components
function StatRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-white/60">{label}:</span>
      <span className={`text-sm md:text-base text-white ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}

function StatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        isOnline
          ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
          : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"}`}
      />
      {isOnline ? "Online" : "Offline"}
    </span>
  )
}

function ActionButton({
  href,
  icon: Icon,
  label,
  glow = "cyan",
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  glow?: "cyan" | "purple" | "blue" | "pink" | "green"
}) {
  const glowClass = `text-[var(--glow-${glow})]`
  return (
    <a
      href={href}
      className="glass-morph-card p-[var(--spacing-lg)] md:p-[var(--spacing-xl)] text-center hover:scale-105 transition-transform duration-200"
    >
      <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${glowClass}`} />
      <span className="text-sm md:text-base text-white">{label}</span>
    </a>
  )
}
