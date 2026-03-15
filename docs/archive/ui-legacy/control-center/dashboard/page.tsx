/**
 * XMAD Control Center Dashboard
 * Main dashboard with system stats and quick actions
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
        <div className="p-[var(--spacing-lg)] bg-[var(--bg-secondary)] rounded-[var(--radius-xl)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            System Stats
          </h2>
          {systemStats ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between">
                <span>CPU</span>
                <span>{systemStats.cpu}%</span>
              </div>
              <div className="flex justify-between">
                <span>Memory</span>
                <span>{systemStats.memory.percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Disk</span>
                <span>{systemStats.disk.percentage}%</span>
              </div>
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Unable to fetch stats</p>
          )}
        </div>

        {/* OpenClaw Status Widget */}
        <div className="p-[var(--spacing-lg)] bg-[var(--bg-secondary)] rounded-[var(--radius-xl)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            OpenClaw Status
          </h2>
          {openclawStatus ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between">
                <span>Status</span>
                <span className={openclawStatus.running ? "text-green-500" : "text-red-500"}>
                  {openclawStatus.running ? "Running" : "Stopped"}
                </span>
              </div>
              {openclawStatus.pid && (
                <div className="flex justify-between">
                  <span>PID</span>
                  <span>{openclawStatus.pid}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Unable to fetch status</p>
          )}
        </div>

        {/* Tailscale Status Widget */}
        <div className="p-[var(--spacing-lg)] bg-[var(--bg-secondary)] rounded-[var(--radius-xl)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            Tailscale VPN
          </h2>
          {tailscaleStatus ? (
            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex justify-between">
                <span>Status</span>
                <span className={tailscaleStatus.connected ? "text-green-500" : "text-red-500"}>
                  {tailscaleStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {tailscaleStatus.ip && (
                <div className="flex justify-between">
                  <span>IP</span>
                  <span className="font-mono text-sm">{tailscaleStatus.ip}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--fg-muted)]">Unable to fetch status</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-[var(--font-size-2xl)] font-semibold mt-[var(--spacing-2xl)] mb-[var(--spacing-lg)]">
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
      </div>
    </div>
  )
}
