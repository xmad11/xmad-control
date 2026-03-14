/**
 * Dashboard Page
 * Main dashboard for XMAD system monitoring and control
 * Optimized for all screen sizes (mobile-first)
 * Features glass morphism design with colored glow effects
 */

"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Database,
  MessageSquare,
  Server,
  Settings,
  Wifi,
} from "@/components/icons"
import { xmadApi } from "@/lib/xmad-api"

export const metadata = {
  title: "Dashboard | XMAD Control",
}

export default async function DashboardPage() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  // Auto-collapse tabs after delay
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleTabClick = () => {
      setIsExpanded(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => setIsExpanded(false), 2000) // Collapse after 2s
    }
  }, [isExpanded])

  // Add click listener
  useEffect(() => {
    const handleClick = () => {
      setIsExpanded(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => setIsExpanded(false), 3000) // Collapse after 3s
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Find current active tab
  const centerTab = {
    href: "/dashboard",
    label: "Overview",
    icon: "📊",
    glow: "cyan",
    position: "center",
  }

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

  const isCenterTab = pathname === "/dashboard" && !pathname.includes("/dashboard/")

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1920px] mx-auto p-[var(--spacing-xl)]">
          {/* Navigation Header */}
          <header className="mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
            <div className="flex items-center justify-between">
              <h1 className="text-[var(--font-size-3xl)] font-bold text-white">
                XMAD Control Center
              </h1>
              <div className="text-sm text-white/70">
                System status and monitoring
              </div>
            </div>
          </header>

          {/* Tab Navigation - 7 Tabs centered */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--glass-bg)] border-t border-[var(--fg-10)] backdrop-blur-md">
            <div className="max-w-[1920px] mx-auto px-4 py-3 flex justify-center gap-2">
              
              {/* Left Tabs (3): Automation, Memory, Screen, Backups */}
              <div className="flex gap-2">
                {["/dashboard/automation", "/dashboard/memory", "/dashboard/screen", "/dashboard/backups"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setIsExpanded(!isExpanded)
                      if (timeout) clearTimeout(timeout)
                      timeout = setTimeout(() => setIsExpanded(false), 2000)
                    }}
                    className={`
                      relative flex flex-col items-center gap-1.5 px-3 py-2
                      rounded-2xl transition-all duration-200
                      ${isExpanded && pathname.includes(tab) ? 'bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50' : 'bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]'}
                    `}
                  >
                    <span className="text-2xl">
                      {tab === "/dashboard/automation" && "⚡"}
                      {tab === "/dashboard/memory" && "🧠"}
                      {tab === "/dashboard/screen" && "🖥️"}
                      {tab === "/dashboard/backups" && "💾"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Center Tab (Overview) - Default */}
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded)
                  if (timeout) clearTimeout(timeout)
                  timeout = setTimeout(() => setIsExpanded(false), 2000)
                }}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5 px-4 py-3
                  rounded-full transition-all duration-200
                  ${isCenterTab ? 'bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50 scale-105' : 'bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]'}
                `}
              >
                <span className="text-2xl">
                  <span className="text-4xl">{centerTab.icon}</span>
                </span>
                {isExpanded && pathname === "/dashboard" && (
                  <span className="text-sm text-white mt-1 font-medium">
                    {centerTab.label}
                  </span>
                )}
              </button>

              {/* Right Tabs (3): Chat, Settings, plus extra */}
              <div className="flex gap-2">
                {["/dashboard/chat", "/dashboard/settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setIsExpanded(!isExpanded)
                      if (timeout) clearTimeout(timeout)
                      timeout = setTimeout(() => setIsExpanded(false), 2000)
                    }}
                    className={`
                      relative flex flex-col items-center justify-center gap-1.5 px-3 py-2
                      rounded-2xl transition-all duration-200
                      ${isExpanded && pathname.includes(tab) ? 'bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50' : 'bg-[var(--bg-secondary)] hover:bg-[var(--color-primary)]'}
                    `}
                  >
                    <span className="text-2xl">
                      {tab === "/dashboard/chat" && "💬"}
                      {tab === "/dashboard/settings" && "⚙️"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          {/* Navigation Arrow - Only shows when expanded */}
          {isExpanded && (
            <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-40 opacity-0 transition-opacity duration-300">
              <div className="text-white text-sm font-medium bg-[var(--glass-bg)] px-3 py-2 rounded-full shadow-lg">
                ▲
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
            {/* Status Cards Grid - Mobile First with Glow Effects */}
            <div className="glass-morph-card glow-cyan p-[var(--spacing-lg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--glow-cyan)]/20">
                  <Database className="w-6 h-6 md:w-8 md:h-6 text-[var(--glow-cyan)]" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    XMAD System Stats
                  </h2>
                  <div className="space-y-2 md:space-y-3">
                    <StatRow label="CPU" value="12%" mono />
                    <StatRow label="Memory" value="62.4%" />
                    <StatRow label="Disk" value="30%" />
                    <StatRow label="Uptime" value="24h" />
                  </div>
                </div>
              </div>
            </div>

            {/* OpenClaw Status Card - Purple Glow */}
            <div className="glass-morph-card glow-purple p-[var(--spacing-lg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--glow-purple)]/20">
                  <Wifi className="w-6 h-6 md:w-8 md:h-6 text-[var(--glow-purple)]" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    OpenClaw Gateway
                  </h2>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Status:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        systemStats?.running ? "bg-[var(--color-success)]/20 text-[var(--color-success)]" : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                      }`}>
                        {systemStats?.running ? "●" : "●"}
                      </span>
                      <span className={`text-xs font-medium ${
                        systemStats?.running ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                      }`}>
                        {systemStats?.running ? "Running" : "Stopped"}
                      </span>
                    </div>
                    <StatRow label="PID" value={systemStats?.pid || "N/A"} mono />
                  </div>
                </div>
              </div>
            </div>

            {/* Tailscale Status Card - Blue Glow */}
            <div className="glass-morph-card glow-blue p-[var(--spacing-lg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--glow-blue)]/20">
                  <Server className="w-6 h-6 md:w-8 md:h-6 text-[var(--glow-blue)]" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                    Tailscale VPN
                  </h2>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Status:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        openclawStatus?.connected ? "bg-[var(--color-success)]/20 text-[var(--color-success)]" : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                      }`}>
                        {openclawStatus?.connected ? "●" : "●"}
                      </span>
                      <span className={`text-xs font-medium ${
                        openclawStatus?.connected ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                      }`}>
                        {openclawStatus?.connected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    <StatRow label="IP" value={openclawStatus?.ip || "N/A"} mono />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>
    </div>
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
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
      isOnline
        ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
        : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isOnline ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"
      }`} />
      {isOnline ? "●" : "●"}
    </span>
  </span>
)
}
