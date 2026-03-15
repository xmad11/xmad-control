/**
 * Screen Page
 * Display system status and controls
 */

import { TabContentWrapper } from "@/components/dashboard/TabContentWrapper"
import { Server } from "lucide-react"

export const metadata = {
  title: "Screen | XMAD Control",
}

export default function ScreenPage() {
  return (
    <TabContentWrapper>
      <h1 className="text-[var(--font-size-3xl)] font-bold mb-[var(--spacing-lg)]">
        System Screen
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-lg)]">
        {/* Status Card */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 md:p-3 rounded-lg bg-[var(--glow-cyan)]/20">
              <Server className="w-5 h-5 md:w-6 md:h-6 text-[var(--glow-cyan)]" />
            </div>
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-white">
              System Status
            </h2>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Status:</span>
              <span className="text-sm text-white/60">Running</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">CPU:</span>
              <span className="text-sm text-white/60">12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Memory:</span>
              <span className="text-sm text-white/60">6.2GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Disk:</span>
              <span className="text-sm text-white/60">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Uptime:</span>
              <span className="text-sm text-white/60">24h</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
            System Controls
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="p-4 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-80"
            >
              Restart System
            </button>
            <button
              type="button"
              className="p-4 bg-[var(--bg-secondary)] text-white rounded-lg hover:bg-[var(--bg)]"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-lg)] font-semibold mb-[var(--spacing-md)]">
          Recent Activity
        </h2>
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] p-[var(--spacing-lg)] opacity-50">
          <p className="text-sm text-white/60">No recent activity</p>
        </div>
      </div>
    </TabContentWrapper>
  )
}
