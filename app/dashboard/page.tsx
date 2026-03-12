/**
 * Control Center Dashboard Page
 * Main dashboard for XMAD system monitoring and control
 */

import { xmadApi } from "@/lib/xmad-api"

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
    <div className="p-[var(--spacing-xl)]">
      <h1 className="text-[var(--font-size-4xl)] font-bold mb-[var(--spacing-xl)]">
        XMAD Control Center
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
        {/* System Stats Widget */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-semibold mb-[var(--spacing-md)]">
            System Stats
          </h2>
          {systemStats?.memory && systemStats.disk ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between">
                <span>CPU:</span>
                <span>{systemStats.cpu?.toFixed(1) || "0.0"}%</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span>{systemStats.memory?.percentage?.toFixed(1) || "0.0"}%</span>
              </div>
              <div className="flex justify-between">
                <span>Disk:</span>
                <span>{systemStats.disk?.percentage?.toFixed(1) || "0.0"}%</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>{Math.floor(systemStats.uptime / 3600)}h</span>
              </div>
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Loading...</p>
          )}
        </div>

        {/* OpenClaw Status Widget */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-semibold mb-[var(--spacing-md)]">
            OpenClaw Status
          </h2>
          {openclawStatus ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={openclawStatus.running ? "text-success" : "text-error"}>
                  {openclawStatus.running ? "Running" : "Stopped"}
                </span>
              </div>
              {openclawStatus.pid && (
                <div className="flex justify-between">
                  <span>PID:</span>
                  <span>{openclawStatus.pid}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Loading...</p>
          )}
        </div>

        {/* Tailscale Status Widget */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-semibold mb-[var(--spacing-md)]">
            Tailscale VPN
          </h2>
          {tailscaleStatus ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={tailscaleStatus.connected ? "text-success" : "text-error"}>
                  {tailscaleStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {tailscaleStatus.ip && (
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="font-mono text-sm">{tailscaleStatus.ip}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Loading...</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-[var(--spacing-xl)]">
        <h2 className="text-[var(--font-size-2xl)] font-semibold mb-[var(--spacing-lg)]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <a
            href="/dashboard/chat"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] hover:opacity-80 transition-opacity"
          >
            AI Chat
          </a>
          <a
            href="/dashboard/memory"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:opacity-80 transition-opacity"
          >
            Memory Editor
          </a>
          <a
            href="/dashboard/automation"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:opacity-80 transition-opacity"
          >
            Automation
          </a>
          <a
            href="/dashboard/screen"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:opacity-80 transition-opacity"
          >
            Screen Viewer
          </a>
          <a
            href="/dashboard/backups"
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:opacity-80 transition-opacity"
          >
            Backups
          </a>
        </div>
      </div>
    </div>
  )
}
