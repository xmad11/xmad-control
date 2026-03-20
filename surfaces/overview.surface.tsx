/* ═══════════════════════════════════════════════════════════════════════════════
   OVERVIEW SURFACE - XMAD Control Dashboard
   Main dashboard view with system widgets
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import {
  GlassWidgetBase,
  MiniStatWidget,
  MultiGaugeWidget,
  MultiProgressWidget,
  ServerStatusCard,
} from "@/components/widgets/base-widget"
import { type ProcessInfo, TopProcessesCarousel } from "@/components/widgets/top-processes-widget"
import { useDashboardData } from "@/runtime/useSurfaceController"
import { Activity, Cpu, Database, Server, Shield, Wifi } from "lucide-react"
import * as React from "react"

export function OverviewSurface() {
  const { stats, services } = useDashboardData()
  const [processesData, setProcessesData] = React.useState<{
    memory: ProcessInfo[]
    cpu: ProcessInfo[]
  }>({ memory: [], cpu: [] })

  // Fetch processes on mount and every 5 seconds
  React.useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const res = await fetch("/api/xmad/system/processes")
        if (res.ok) {
          const data = await res.json()
          setProcessesData({
            memory: data.memory || [],
            cpu: data.cpu || [],
          })
        }
      } catch (err) {
        console.error("Failed to fetch processes:", err)
      }
    }

    fetchProcesses()
    const interval = setInterval(fetchProcesses, 5000)
    return () => clearInterval(interval)
  }, [])

  // Prepare gauge data with toggle values
  const ramUsedGB = (stats?.memory.used ?? 4200) / 1024
  const diskUsedTB = Number(((stats?.disk.used ?? 14) / 1024).toFixed(2))

  const gaugeData = [
    {
      label: "RAM",
      value: stats?.memory.percentage ?? 52,
      unit: "%",
      color: "green" as const,
      actualValue: ramUsedGB,
      actualUnit: "GB",
    },
    {
      label: "CPU",
      value: stats?.cpu ?? 45,
      unit: "%",
      color: "blue" as const,
      actualValue: stats?.cpu ?? 45,
      actualUnit: "%",
    },
    {
      label: "Disk",
      value: stats?.disk.percentage ?? 36,
      unit: "%",
      color: "cyan" as const,
      actualValue: diskUsedTB,
      actualUnit: "TB",
    },
  ]

  return (
    <>
      {/* Row 1 - System Gauges (clickable to toggle %/actual) */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
          <MultiGaugeWidget gauges={gaugeData} glowColor="green" />
          <MultiProgressWidget
            items={[
              {
                label: "RAM",
                value: stats?.memory.used ?? 4.2,
                max: stats?.memory.total ?? 8,
                unit: "GB",
                color: "green",
              },
              { label: "CPU Load", value: stats?.cpu ?? 45, unit: "%", color: "blue" },
              {
                label: "Disk",
                value: stats?.disk.used ?? 14,
                max: stats?.disk.total ?? 931,
                unit: "GB",
                color: "cyan",
              },
            ]}
            glowColor="green"
          />
          <GlassWidgetBase size="md" width="md" glowColor="blue">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "1h", high: 52, low: 38 },
                { label: "2h", high: 48, low: 35 },
                { label: "3h", high: 55, low: 40 },
              ].map((f) => (
                <div key={f.label} className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-xs text-white/50 mb-1">{f.label}</div>
                  <div className="text-white font-medium">{f.high}%</div>
                  <div className="text-xs text-white/40">{f.low}%</div>
                </div>
              ))}
            </div>
          </GlassWidgetBase>
        </WidgetCarousel>
      </div>

      {/* Row 2 - Top Processes (scroll to toggle Memory/CPU) */}
      <div className="mb-4">
        <TopProcessesCarousel
          memoryProcesses={processesData.memory}
          cpuProcesses={processesData.cpu}
        />
      </div>

      {/* Row 3 - Server Status */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          <ServerStatusCard
            icon={Server}
            label="OpenClaw Gateway"
            status={services?.openclaw?.running ? "online" : "offline"}
            detail={
              services?.openclaw?.running ? `PID: ${services.openclaw.pid ?? "N/A"}` : "Stopped"
            }
            glowColor="cyan"
          />
          <ServerStatusCard
            icon={Wifi}
            label="Tailscale VPN"
            status={services?.tailscale?.connected ? "online" : "offline"}
            detail={
              services?.tailscale?.connected
                ? (services.tailscale.ip ?? "Connected")
                : "Disconnected"
            }
            glowColor="purple"
          />
          <ServerStatusCard
            icon={Shield}
            label="Guardian"
            status="online"
            detail="Monitoring Active"
            glowColor="green"
          />
          <GlassWidgetBase size="md" width="sm" glowColor="amber">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-white/70" />
              <span className="text-white/60 text-sm">Health</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-lg font-medium">98%</span>
              <span className="text-green-400 text-xs">Optimal</span>
            </div>
          </GlassWidgetBase>
        </WidgetCarousel>
      </div>

      {/* Row 4 - Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
        <MiniStatWidget icon={Database} label="Data In" value="45 MB" glowColor="green" />
        <MiniStatWidget icon={Cpu} label="Data Out" value="128 MB" glowColor="purple" />
        <MiniStatWidget icon={Server} label="Latency" value="12ms" glowColor="amber" />
      </div>
    </>
  )
}

export default OverviewSurface
