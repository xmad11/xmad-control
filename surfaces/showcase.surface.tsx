/* ═══════════════════════════════════════════════════════════════════════════════
   SHOWCASE SURFACE - XMAD Control Dashboard
   Display all widgets and components from ein-ui
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import { GlassBadge } from "@/components/glass/glass-badge"
import { GlassButton } from "@/components/glass/glass-button"
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/glass/glass-card"
import {
  GlassWidgetBase,
  MiniStatWidget,
  MultiGaugeWidget,
  MultiProgressWidget,
  ServerStatusCard,
} from "@/components/widgets/base-widget"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import {
  Activity,
  Calendar,
  Clock,
  Cloud,
  Cpu,
  Database,
  Server,
  Shield,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Widget imports from registry/widgets
import {
  CalendarWidget,
  CompactCalendarWidget,
} from "@/components/widgets/calendar-widget"
import {
  AnalogClockWidget,
  DigitalClockWidget,
  StopwatchWidget,
} from "@/components/widgets/clock-widget"
import { StockTickerWidget } from "@/components/widgets/stock-widget"
import { ForecastWidget, HourlyWeatherWidget } from "@/components/widgets/weather-widget"

export function ShowcaseSurface() {
  // Forecast data for weather widget
  const forecastData = [
    { day: "Mon", high: 31, low: 24, condition: "sunny" as const },
    { day: "Tue", high: 29, low: 23, condition: "cloudy" as const },
    { day: "Wed", high: 27, low: 22, condition: "rainy" as const },
    { day: "Thu", high: 30, low: 24, condition: "sunny" as const },
    { day: "Fri", high: 32, low: 25, condition: "sunny" as const },
  ]

  // Mock stats for widgets
  const mockStats = {
    memory: { percentage: 52, used: 4.2, total: 8 },
    cpu: 45,
    disk: { percentage: 36, used: 180, total: 500 },
  }

  const mockServices = {
    openclaw: { running: true, pid: 12345 },
    tailscale: { connected: true, ip: "100.64.0.1" },
  }

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            <span className="block">XMAD Control</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Component Showcase
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore our collection of liquid glass components and widgets for building beautiful
            dashboards and control panels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/dashboard">
              <GlassButton variant="primary" size="lg" className="min-w-45">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </GlassButton>
            </Link>
            <Link href="/docs">
              <GlassButton variant="outline" size="lg" className="min-w-45">
                <BookOpen className="w-4 h-4 mr-2" />
                View Docs
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Widget Showcase */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <GlassBadge variant="primary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Interactive
          </GlassBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Widgets Collection</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Beautiful glass-styled widgets for dashboards, apps, and more
          </p>
        </div>

        {/* Calendar & Clock Widgets */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
            Calendar & Time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <CompactCalendarWidget />
                <AnalogClockWidget size="lg" showNumbers={true} />
              </div>
              <CalendarWidget />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <HourlyWeatherWidget
                hours={[
                  { time: "1 AM", temperature: 22, icon: "sun" },
                  { time: "2 AM", temperature: 21, icon: "cloud" },
                  { time: "3 AM", temperature: 20, icon: "rain" },
                  { time: "4 AM", temperature: 19, icon: "cloud" },
                  { time: "5 AM", temperature: 18, icon: "sun" },
                  { time: "6 AM", temperature: 20, icon: "snow" },
                  { time: "7 AM", temperature: 22, icon: "sun" },
                  { time: "8 AM", temperature: 24, icon: "cloud" },
                  { time: "9 AM", temperature: 26, icon: "sun" },
                ]}
              />
              <StockTickerWidget symbol="AAPL" price={198.45} change={2.34} changePercent={1.19} />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
              <ForecastWidget forecast={forecastData} />
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-4 xl:grid xl:grid-cols-2">
                <DigitalClockWidget showSeconds={false} className="w-full h-full" />
                <StopwatchWidget className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
            Dashboard Widgets
          </h3>

          {/* System Gauges */}
          <div className="mb-6">
            <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
              <MultiGaugeWidget
                title="System Resources"
                gauges={[
                  { label: "RAM", value: mockStats.memory.percentage, unit: "%", color: "green" },
                  { label: "CPU", value: mockStats.cpu, unit: "%", color: "blue" },
                  { label: "Disk", value: mockStats.disk.percentage, unit: "%", color: "cyan" },
                ]}
                glowColor="green"
              />
              <MultiProgressWidget
                title="Usage"
                items={[
                  {
                    label: "RAM",
                    value: mockStats.memory.used,
                    max: mockStats.memory.total,
                    unit: "GB",
                    color: "green",
                  },
                  { label: "CPU Load", value: mockStats.cpu, unit: "%", color: "blue" },
                  {
                    label: "Disk",
                    value: mockStats.disk.used,
                    max: mockStats.disk.total,
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

          {/* Server Status */}
          <div className="mb-6">
            <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
              <ServerStatusCard
                icon={Server}
                label="OpenClaw Gateway"
                status={mockServices.openclaw?.running ? "online" : "offline"}
                detail={
                  mockServices.openclaw?.running ? `PID: ${mockServices.openclaw.pid}` : "Stopped"
                }
                glowColor="cyan"
              />
              <ServerStatusCard
                icon={Wifi}
                label="Tailscale VPN"
                status={mockServices.tailscale?.connected ? "online" : "offline"}
                detail={
                  mockServices.tailscale?.connected ? mockServices.tailscale.ip : "Disconnected"
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

          {/* Mini Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
            <MiniStatWidget icon={Database} label="Data In" value="45 MB" glowColor="green" />
            <MiniStatWidget icon={Cpu} label="Data Out" value="128 MB" glowColor="purple" />
            <MiniStatWidget icon={Server} label="Latency" value="12ms" glowColor="amber" />
          </div>
        </div>

        {/* View More Widgets Button */}
        <div className="flex justify-center mt-10">
          <Link href="/docs">
            <GlassButton variant="ghost">
              View all widgets
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlassButton>
          </Link>
        </div>
      </section>
    </>
  )
}

export default ShowcaseSurface
