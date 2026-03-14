/**
 * Control Center Dashboard Page
 * Main dashboard for XMAD system monitoring and control
 * Optimized for all screen sizes (mobile-first)
 * Features glass morphism design with colored glow effects
 */

"use client"

import { xmadApi } from "@/lib/xmad-api"
import { TabContentWrapper } from "@/components/dashboard/TabContentWrapper"

export const metadata = {
  title: "Dashboard | XMAD Control",
}

export default async function DashboardPage() {
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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1920px] mx-auto p-[var(--spacing-lg)] md:p-[var(--spacing-xl)]">
      {/* Header */}
      <header className="mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          XMAD Control Center
        </h1>
        <p className="text-sm md:text-base text-white/60 mt-1">
          Monitor and control your AI infrastructure
        </p>
      </header>

      {/* Status Cards Grid - Mobile First with Glow Effects */}
      <TabContentWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--spacing-md)] md:gap-[var(--spacing-lg)] lg:gap-[var(--spacing-xl)] mb-[var(--spacing-lg)] md:mb-[var(--spacing-xl)]">
        {/* System Stats Card - Cyan Glow */}
        <div className="glass-morph-card glow-cyan p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[var(--glow-cyan)]/20">
              <Server className="w-5 h-5 md:w-6 md:h-6 text-[var(--glow-cyan)]" />
            </div>
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
              System Stats
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
        <div className="glass-morph-card glow-purple p-4 md:p-6">
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
              {openclawStatus.pid && <StatRow label="PID" value={String(openclawStatus.pid)} />}
            </div>
          ) : (
            <p className="text-sm text-white/60">Loading...</p>
          )}
        </div>

        {/* Tailscale Status Card - Blue Glow */}
        <div className="glass-morph-card glow-blue p-4 md:p-6 sm:col-span-2 xl:col-span-1">
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
          <ActionButton href="/dashboard/chat" icon={MessageSquare} label="AI Chat" glow="purple" />
          <ActionButton href="/dashboard/memory" icon={Database} label="Memory" glow="blue" />
          <ActionButton
            href="/dashboard/automation"
            icon={LayoutGrid}
            label="Automation"
            glow="pink"
          />
          <ActionButton href="/dashboard/screen" icon={Server} label="Screen" glow="green" />
          <ActionButton href="/dashboard/settings" icon={Settings} label="Settings" glow="cyan" />
        </div>
      </section>
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
  return (
    <a
      href={href}
      className={`flex flex-col items-center justify-center gap-2 p-3 md:p-4 glass-morph-card glow-${glow} touch-target transition-all hover:scale-105`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
      <span className="text-xs md:text-sm font-medium text-white">{label}</span>
    </a>
  )
}
