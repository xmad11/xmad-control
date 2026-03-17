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
import { useDashboardData } from "@/runtime/useSurfaceController"
import { Activity, Cpu, Database, Server, Shield, Wifi } from "lucide-react"

export function OverviewSurface() {
  const { stats, services } = useDashboardData()

  return (
    <>
      {/* Row 1 - System Gauges */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
          <MultiGaugeWidget
            title="System Resources"
            gauges={[
              { label: "RAM", value: stats?.memory.percentage ?? 52, unit: "%", color: "green" },
              { label: "CPU", value: stats?.cpu ?? 45, unit: "%", color: "blue" },
              { label: "Disk", value: stats?.disk.percentage ?? 36, unit: "%", color: "cyan" },
            ]}
            glowColor="green"
          />
          <MultiProgressWidget
            title="Usage"
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
                value: stats?.disk.used ?? 180,
                max: stats?.disk.total ?? 500,
                unit: "GB",
                color: "cyan",
              },
            ]}
            glowColor="green"
          />
          <GlassWidgetBase size="lg" width="md" glowColor="blue">
            <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">
              System Forecast
            </div>
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

      {/* Row 2 - Server Status */}
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

      {/* Row 3 - Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
        <MiniStatWidget icon={Database} label="Data In" value="45 MB" glowColor="green" />
        <MiniStatWidget icon={Cpu} label="Data Out" value="128 MB" glowColor="purple" />
        <MiniStatWidget icon={Server} label="Latency" value="12ms" glowColor="amber" />
      </div>

      {/* Row 4 - Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { symbol: "CPU", name: "Processor Load", price: stats?.cpu ?? 45, change: 2.34, glow: "cyan" as const },
          {
            symbol: "RAM",
            name: "Memory Usage",
            price: stats?.memory.percentage ?? 52,
            change: -1.5,
            glow: "purple" as const,
          },
          {
            symbol: "DISK",
            name: "Storage Used",
            price: stats?.disk.percentage ?? 36,
            change: 0.3,
            glow: "green" as const,
          },
        ].map((stock) => (
          <GlassWidgetBase
            key={stock.symbol}
            size="md"
            width="full"
            glowColor={stock.glow}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-white font-bold">{stock.symbol}</div>
                <div className="text-white/40 text-xs">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-lg font-medium">{stock.price.toFixed(1)}%</div>
                <div className={`text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </div>
              </div>
            </div>
          </GlassWidgetBase>
        ))}
      </div>
    </>
  )
}

export default OverviewSurface
