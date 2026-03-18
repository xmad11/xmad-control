/* ═══════════════════════════════════════════════════════════════════════════════
   SHOWCASE PAGE - XMAD Control
   Standalone page to showcase all widgets and components from ein-ui
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import { GlassBadge } from "@/components/glass/glass-badge"
import {
  GlassWidgetBase,
  MiniStatWidget,
  MultiGaugeWidget,
  MultiProgressWidget,
  ServerStatusCard,
} from "@/components/widgets/base-widget"
import {
  CalendarWidget,
  CompactCalendarWidget,
  EventsCalendarWidget,
} from "@/components/widgets/calendar-widget"
import {
  AnalogClockWidget,
  DigitalClockWidget,
  StopwatchWidget,
  TimerWidget,
  WorldClockWidget,
} from "@/components/widgets/clock-widget"
import { CircularProgressStat, MetricStat, StatCard } from "@/components/widgets/stats-widget"
import {
  CompactStockWidget,
  MarketOverviewWidget,
  StockTickerWidget,
} from "@/components/widgets/stock-widget"
import {
  CurrentWeatherWidget,
  DetailedWeatherWidget,
  ForecastWidget,
  HourlyWeatherWidget,
} from "@/components/widgets/weather-widget"
import { WORLD_CLOCKS } from "@/config/dashboard"
import {
  Activity,
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Server,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wifi,
} from "lucide-react"
import Link from "next/link"

export default function ShowcasePage() {
  const mockStats = {
    memory: { percentage: 52, used: 4.2, total: 8 },
    cpu: 45,
    disk: { percentage: 36, used: 180, total: 500 },
  }
  const mockServices = {
    openclaw: { running: true, pid: 12345 },
    tailscale: { connected: true, ip: "100.64.0.1" },
  }
  const forecastData = [
    { day: "Mon", high: 31, low: 24, condition: "sunny" as const },
    { day: "Tue", high: 29, low: 23, condition: "cloudy" as const },
    { day: "Wed", high: 27, low: 22, condition: "rainy" as const },
    { day: "Thu", high: 30, low: 24, condition: "sunny" as const },
    { day: "Fri", high: 32, low: 25, condition: "sunny" as const },
  ]
  const sampleEvents = [
    { id: "1", title: "Team Standup", time: "9:00 AM", color: "bg-cyan-500" },
    { id: "2", title: "Code Review", time: "11:00 AM", color: "bg-purple-500" },
    { id: "3", title: "Sprint Planning", time: "2:00 PM", color: "bg-blue-500" },
  ]
  const marketIndices = [
    { name: "S&P 500", value: 5234, change: 45.2, changePercent: 0.87 },
    { name: "NASDAQ", value: 16456, change: -32.5, changePercent: -0.2 },
    { name: "DOW", value: 39127, change: 125.8, changePercent: 0.32 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 -mt-[var(--header-total-height)]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-purple-950/10" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full overflow-y-auto">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-8">
          <div className="w-full text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              <span className="block">XMAD Control</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Component Showcase
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 w-full mx-auto mb-10 leading-relaxed">
              Explore our collection of liquid glass components and widgets for building beautiful
              dashboards and control panels.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500/80 via-blue-500/80 to-purple-500/80 backdrop-blur-xl border border-white/30 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white/10 hover:border-white/60 hover:scale-105 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                View Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Widget Showcase */}
        <section className="container mx-auto px-4 pb-16 w-full">
          <div className="text-center mb-6">
            <GlassBadge variant="primary" className="mb-3">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive
            </GlassBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Widgets Collection</h2>
            <p className="text-white/50 w-full mx-auto">
              Beautiful glass-styled widgets for dashboards, apps, and more
            </p>
          </div>

          {/* Calendar & Clock Widgets */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Calendar & Time
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <CompactCalendarWidget />
              <AnalogClockWidget size="lg" showNumbers={true} />
              <DigitalClockWidget showSeconds={false} />
              <StopwatchWidget />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
              <CalendarWidget />
              <TimerWidget initialMinutes={5} />
              <WorldClockWidget clocks={WORLD_CLOCKS} />
            </div>
            <div className="mt-4">
              <EventsCalendarWidget date={new Date()} events={sampleEvents} className="w-full" />
            </div>
          </div>

          {/* Weather Widgets */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Weather
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <CurrentWeatherWidget
                location="San Francisco"
                temperature={72}
                feelsLike={70}
                high={78}
                low={62}
                condition="sunny"
                humidity={65}
                windSpeed={12}
              />
              <ForecastWidget forecast={forecastData} />
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
              <DetailedWeatherWidget
                temperature={72}
                condition="Partly Cloudy"
                icon="cloud"
                location="New York"
                humidity={58}
                windSpeed={15}
                feelsLike={70}
              />
            </div>
          </div>

          {/* Stock Widgets */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Stock & Finance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <StockTickerWidget symbol="AAPL" price={198.45} change={2.34} changePercent={1.19} />
              <CompactStockWidget
                symbol="GOOGL"
                price={178.25}
                change={-1.87}
                changePercent={-1.04}
              />
              <StockTickerWidget symbol="TSLA" price={245.8} change={5.62} changePercent={2.34} />
              <MarketOverviewWidget indices={marketIndices} />
            </div>
          </div>

          {/* Stats Widgets */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Stats & Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <StatCard
                title="Revenue"
                value="$124,500"
                change={{ value: 12.5, type: "increase" }}
                icon={<TrendingUp className="w-5 h-5" />}
                glowColor="green"
              />
              <StatCard
                title="Expenses"
                value="$82,300"
                change={{ value: 8.2, type: "decrease" }}
                icon={<TrendingDown className="w-5 h-5" />}
                glowColor="red"
              />
              <MetricStat
                label="Bandwidth"
                value={750}
                max={1000}
                unit="Mbps"
                icon={<Globe className="w-4 h-4" />}
                glowColor="blue"
              />
              <CircularProgressStat label="Completion" value={78} unit="%" glowColor="purple" />
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Dashboard System
            </h3>
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
            <div className="mb-6">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
                <ServerStatusCard
                  icon={Server}
                  label="OpenClaw Gateway"
                  status={mockServices.openclaw.running ? "online" : "offline"}
                  detail={
                    mockServices.openclaw.running ? `PID: ${mockServices.openclaw.pid}` : "Stopped"
                  }
                  glowColor="cyan"
                />
                <ServerStatusCard
                  icon={Wifi}
                  label="Tailscale VPN"
                  status={mockServices.tailscale.connected ? "online" : "offline"}
                  detail={
                    mockServices.tailscale.connected ? mockServices.tailscale.ip : "Disconnected"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
              <MiniStatWidget icon={Database} label="Data In" value="45 MB" glowColor="green" />
              <MiniStatWidget icon={Cpu} label="Data Out" value="128 MB" glowColor="purple" />
              <MiniStatWidget icon={Server} label="Latency" value="12ms" glowColor="amber" />
            </div>
          </div>

          {/* View More */}
          <div className="flex justify-center mt-6">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-2 bg-transparent text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            >
              View all widgets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
