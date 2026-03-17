/* ═══════════════════════════════════════════════════════════════════════════════
   BACKUPS SURFACE - XMAD Control Dashboard
   Backup management with widgets for backup status and scheduling
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import {
  GlassWidgetBase,
  MultiProgressWidget,
  ServerStatusCard,
} from "@/components/widgets/base-widget"
import { CompactCalendarWidget } from "@/components/widgets/calendar-widget"
import { StatCard } from "@/components/widgets/stats-widget"
import { useDashboardData } from "@/runtime/useSurfaceController"
import { Database, HardDrive, Clock, Shield } from "lucide-react"

// TODO: wire to real API route when available — currently mocked
// When /api/xmad/backups exists, replace this with actual API call
interface BackupStats {
  lastBackupTime: Date | null
  lastBackupSize: number // in GB
  totalBackupCount: number
  totalBackupSize: number // in GB
  nextScheduledBackup: Date | null
  backupHealth: "healthy" | "warning" | "error"
}

// Mock backup data - replace with API call when route exists
const mockBackupStats: BackupStats = {
  lastBackupTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  lastBackupSize: 2.4,
  totalBackupCount: 47,
  totalBackupSize: 112.8,
  nextScheduledBackup: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
  backupHealth: "healthy",
}

export function BackupsSurface() {
  const { services } = useDashboardData()

  // Use mock data - when API route exists, replace with:
  // const { data: backupStats } = useSWR('/api/xmad/backups/stats', fetcher)
  const backupStats = mockBackupStats

  // Format time ago
  const formatTimeAgo = (date: Date | null): string => {
    if (!date) return "Never"
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return "Just now"
  }

  // Format time until
  const formatTimeUntil = (date: Date | null): string => {
    if (!date) return "Not scheduled"
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `In ${diffDays}d`
    if (diffHours > 0) return `In ${diffHours}h`
    return "Soon"
  }

  return (
    <>
      {/* Row 1 - Backup Stats Carousel */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
          {/* Last Backup Info */}
          <GlassWidgetBase size="lg" width="md" glowColor="green">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Database className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-medium">Last Backup</div>
                <div className="text-white/50 text-xs">{formatTimeAgo(backupStats.lastBackupTime)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/50 text-xs mb-1">Size</div>
                <div className="text-white text-lg font-medium">{backupStats.lastBackupSize} GB</div>
              </div>
              <div>
                <div className="text-white/50 text-xs mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    backupStats.backupHealth === "healthy" ? "bg-emerald-400" :
                    backupStats.backupHealth === "warning" ? "bg-amber-400" : "bg-red-400"
                  }`} />
                  <span className="text-white/80 text-sm capitalize">{backupStats.backupHealth}</span>
                </div>
              </div>
            </div>
          </GlassWidgetBase>

          {/* Backup Storage Progress */}
          <MultiProgressWidget
            title="Backup Storage"
            items={[
              {
                label: "Used",
                value: backupStats.totalBackupSize,
                max: 500,
                unit: "GB",
                color: "green",
              },
              {
                label: "Available",
                value: 500 - backupStats.totalBackupSize,
                max: 500,
                unit: "GB",
                color: "cyan",
              },
            ]}
            glowColor="green"
          />

          {/* Next Scheduled Backup */}
          <CompactCalendarWidget
            date={backupStats.nextScheduledBackup ?? undefined}
            className="min-h-[140px]"
          />
        </WidgetCarousel>
      </div>

      {/* Row 2 - Backup Count & Service Status */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          <StatCard
            title="Total Backups"
            value={backupStats.totalBackupCount}
            icon={<HardDrive className="h-4 w-4" />}
            glowColor="cyan"
          />
          <StatCard
            title="Total Size"
            value={`${backupStats.totalBackupSize} GB`}
            icon={<Database className="h-4 w-4" />}
            glowColor="purple"
          />
          <ServerStatusCard
            icon={Shield}
            label="Backup Service"
            status={backupStats.backupHealth === "healthy" ? "online" : "warning"}
            detail={formatTimeUntil(backupStats.nextScheduledBackup)}
            glowColor="green"
          />
          <GlassWidgetBase size="md" width="sm" glowColor="amber">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-white/70" />
              <span className="text-white/60 text-sm">Next Run</span>
            </div>
            <div className="text-white text-lg font-medium">
              {backupStats.nextScheduledBackup?.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }) ?? "Not scheduled"}
            </div>
          </GlassWidgetBase>
        </WidgetCarousel>
      </div>

      {/* Row 3 - Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <GlassWidgetBase size="md" width="full" glowColor="cyan" interactive>
          <button type="button" className="w-full text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Database className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-medium">Create Backup</div>
                <div className="text-white/50 text-xs">Start a new backup now</div>
              </div>
            </div>
          </button>
        </GlassWidgetBase>

        <GlassWidgetBase size="md" width="full" glowColor="purple" interactive>
          <button type="button" className="w-full text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <HardDrive className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">Restore Backup</div>
                <div className="text-white/50 text-xs">Restore from a previous backup</div>
              </div>
            </div>
          </button>
        </GlassWidgetBase>

        <GlassWidgetBase size="md" width="full" glowColor="amber" interactive>
          <button type="button" className="w-full text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-medium">Schedule</div>
                <div className="text-white/50 text-xs">Configure backup schedule</div>
              </div>
            </div>
          </button>
        </GlassWidgetBase>
      </div>
    </>
  )
}

export default BackupsSurface
