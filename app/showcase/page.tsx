/* ═══════════════════════════════════════════════════════════════════════════════
   SHOWCASE PAGE - XMAD Control
   Standalone page to showcase all widgets and components from ein-ui
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

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
import { BackgroundBlobs } from "@/features/dashboard-ui/BackgroundBlobs"
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
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Background */}
      <BackgroundBlobs />

      {/* Content Container - fills screen, content scrolls inside */}
      <div className="relative z-10 h-full flex flex-col pt-16">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 pb-8">
          {/* Hero Section - Compact */}
          <div className="text-center mb-8">
            <GlassBadge variant="primary" className="mb-3">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive
            </GlassBadge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Component Showcase
              </span>
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto">
              Glass-styled widgets for dashboards and control panels
            </p>
          </div>

          {/* ════════════════════════════════════════════════════════════════════════
              WIDGET SECTIONS - Balanced grids
              ════════════════════════════════════════════════════════════════════════ */}

          {/* Calendar & Clock - Grouped by size */}
          <section className="mb-8">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Calendar & Time
            </h3>
            {/* Row 1 - 4 small widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
              <CompactCalendarWidget />
              <DigitalClockWidget showSeconds={false} />
              <StopwatchWidget />
              <CompactCalendarWidget />
            </div>
            {/* Row 2 - 4 small widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
              <AnalogClockWidget size="sm" showNumbers={true} />
              <DigitalClockWidget showSeconds={true} />
              <StopwatchWidget />
              <DigitalClockWidget showSeconds={false} />
            </div>
            {/* Row 3 - 3 medium widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-start">
              <CalendarWidget />
              <TimerWidget initialMinutes={5} />
              <CalendarWidget />
            </div>
            {/* Row 4 - 2 large widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <WorldClockWidget clocks={WORLD_CLOCKS} />
              <EventsCalendarWidget date={new Date()} events={sampleEvents} />
            </div>
          </section>

          {/* Weather - 4 items per row, balanced */}
          <section className="mb-8">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Weather
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
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
              <CurrentWeatherWidget
                location="New York"
                temperature={45}
                feelsLike={42}
                high={52}
                low={38}
                condition="cloudy"
                humidity={78}
                windSpeed={18}
              />
              <ForecastWidget forecast={forecastData} />
              <HourlyWeatherWidget
                hours={[
                  { time: "1 PM", temperature: 22, icon: "sun" },
                  { time: "2 PM", temperature: 21, icon: "cloud" },
                  { time: "3 PM", temperature: 20, icon: "rain" },
                  { time: "4 PM", temperature: 19, icon: "cloud" },
                ]}
              />
              <DetailedWeatherWidget
                temperature={72}
                condition="Partly Cloudy"
                icon="cloud"
                location="Chicago"
                humidity={58}
                windSpeed={15}
                feelsLike={70}
              />
              <DetailedWeatherWidget
                temperature={85}
                condition="Sunny"
                icon="sun"
                location="Miami"
                humidity={72}
                windSpeed={8}
                feelsLike={88}
              />
              <CurrentWeatherWidget
                location="Seattle"
                temperature={58}
                feelsLike={55}
                high={62}
                low={48}
                condition="rainy"
                humidity={85}
                windSpeed={12}
              />
              <ForecastWidget
                forecast={[
                  { day: "Sat", high: 28, low: 22, condition: "sunny" as const },
                  { day: "Sun", high: 26, low: 20, condition: "cloudy" as const },
                ]}
              />
            </div>
          </section>

          {/* Stock & Finance - Grouped by size */}
          <section className="mb-8">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Stock & Finance
            </h3>
            {/* Row 1 - 4 small widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
              <StockTickerWidget symbol="AAPL" price={198.45} change={2.34} changePercent={1.19} />
              <CompactStockWidget symbol="GOOGL" price={178.25} change={-1.87} changePercent={-1.04} />
              <StockTickerWidget symbol="TSLA" price={245.8} change={5.62} changePercent={2.34} />
              <CompactStockWidget symbol="MSFT" price={425.12} change={3.45} changePercent={0.82} />
            </div>
            {/* Row 2 - 4 small widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
              <StockTickerWidget symbol="NVDA" price={892.5} change={-8.25} changePercent={-0.92} />
              <CompactStockWidget symbol="AMZN" price={185.75} change={2.18} changePercent={1.19} />
              <StockTickerWidget symbol="META" price={505.3} change={7.85} changePercent={1.58} />
              <CompactStockWidget symbol="NFLX" price={628.4} change={-4.12} changePercent={-0.65} />
            </div>
            {/* Row 3 - 1 large widget */}
            <div className="grid grid-cols-1 gap-3 items-start">
              <MarketOverviewWidget indices={marketIndices} />
            </div>
          </section>

          {/* Stats & Metrics - Grouped by size */}
          <section className="mb-8">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Stats & Metrics
            </h3>
            {/* Row 1 - 4 items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
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
            {/* Row 2 - 4 items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 items-start">
              <StatCard
                title="Users"
                value="24.5K"
                change={{ value: 5.2, type: "increase" }}
                icon={<TrendingUp className="w-5 h-5" />}
                glowColor="cyan"
              />
              <MetricStat
                label="Storage"
                value={420}
                max={500}
                unit="GB"
                icon={<Database className="w-4 h-4" />}
                glowColor="amber"
              />
              <CircularProgressStat label="Progress" value={65} unit="%" glowColor="green" />
              <MetricStat
                label="Memory"
                value={6.2}
                max={8}
                unit="GB"
                icon={<Cpu className="w-4 h-4" />}
                glowColor="purple"
              />
            </div>
            {/* Row 3 - 4 items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
              <StatCard
                title="Orders"
                value="1,847"
                change={{ value: 8.3, type: "increase" }}
                icon={<TrendingUp className="w-5 h-5" />}
                glowColor="blue"
              />
              <MetricStat
                label="CPU Load"
                value={67}
                max={100}
                unit="%"
                icon={<Cpu className="w-4 h-4" />}
                glowColor="cyan"
              />
              <CircularProgressStat label="Tasks" value={42} unit="%" glowColor="amber" />
              <MetricStat
                label="API Calls"
                value={8.5}
                max={10}
                unit="K/m"
                icon={<Globe className="w-4 h-4" />}
                glowColor="green"
              />
            </div>
          </section>

          {/* Dashboard System - Gauges and Status */}
          <section className="mb-8">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Dashboard System
            </h3>
            {/* Gauges Row - 3 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 items-start">
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
                  { label: "RAM", value: mockStats.memory.used, max: mockStats.memory.total, unit: "GB", color: "green" },
                  { label: "CPU Load", value: mockStats.cpu, unit: "%", color: "blue" },
                  { label: "Disk", value: mockStats.disk.used, max: mockStats.disk.total, unit: "GB", color: "cyan" },
                ]}
                glowColor="green"
              />
              <GlassWidgetBase size="lg" width="md" glowColor="blue">
                <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">System Forecast</div>
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
            </div>
            {/* Status Row - 4 items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 items-start">
              <ServerStatusCard
                icon={Server}
                label="OpenClaw Gateway"
                status={mockServices.openclaw.running ? "online" : "offline"}
                detail={mockServices.openclaw.running ? `PID: ${mockServices.openclaw.pid}` : "Stopped"}
                glowColor="cyan"
              />
              <ServerStatusCard
                icon={Wifi}
                label="Tailscale VPN"
                status={mockServices.tailscale.connected ? "online" : "offline"}
                detail={mockServices.tailscale.connected ? mockServices.tailscale.ip : "Disconnected"}
                glowColor="purple"
              />
              <ServerStatusCard icon={Shield} label="Guardian" status="online" detail="Monitoring Active" glowColor="green" />
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
            </div>
            {/* Mini Stats Row - 4 items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
              <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
              <MiniStatWidget icon={Database} label="Data In" value="45 MB" glowColor="green" />
              <MiniStatWidget icon={Cpu} label="Data Out" value="128 MB" glowColor="purple" />
              <MiniStatWidget icon={Server} label="Latency" value="12ms" glowColor="amber" />
            </div>
          </section>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500/80 via-blue-500/80 to-purple-500/80 backdrop-blur-xl border border-white/30 text-white text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent backdrop-blur-sm border border-white/30 text-white/70 text-sm rounded-xl hover:bg-white/10 hover:text-white hover:border-white/50 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              View Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
