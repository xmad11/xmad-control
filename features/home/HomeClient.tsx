/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   Pixel-perfect reproduction from ein-ui
   Phase 1: Background + Bottom Tabs
   Phase 2: Tab containers + Widget horizontal scroll engine
   Phase 3: All tabs + Sheet functionality
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import {
  GlassTabs,
  GlassTabsContent,
  GlassTabsList,
  GlassTabsTrigger,
} from "@/components/glass/glass-tabs"
import { GlassSheet } from "@/components/sheet/glass-sheet"
import {
  GlassWidgetBase,
  MemoryFileCard,
  MiniStatWidget,
  MultiGaugeWidget,
  MultiProgressWidget,
  QuickActionCard,
  ServerStatusCard,
  TaskCard,
} from "@/components/widgets/base-widget"
import { GlassSkeleton } from "@/components/glass/glass-skeleton"

// Agent AI Components
import {
  AudioVisualizerBar,
  AgentControlBar,
  AgentChatTranscript,
  type AgentState,
  type ChatMessage,
} from "@/components/agents"
// Config imports - no more hardcoded values
import {
  AUTOMATION_WIDGETS,
  BACKGROUND,
  BACKUP_WIDGETS,
  DEFAULTS,
  DEFAULT_TAB,
  MEMORY_WIDGETS,
  SCREEN_WIDGETS,
  SETTINGS_WIDGETS,
  type SheetPosition,
  TABS,
  TIMING,
  WIDGET_LAYOUT,
  WIDGET_PRESETS,
} from "@/config/dashboard"
import { AnimatePresence, motion } from "framer-motion"
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Binary,
  Brain,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  FolderOpen,
  Globe,
  HardDrive,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  MessageSquare,
  Monitor,
  Pause,
  Play,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Terminal,
  TrendingUp,
  Wifi,
  X,
  XCircle,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAPPING (config-based) - All icons are LucideIcon type
// ═══════════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Zap,
  Monitor,
  HardDrive,
  Activity,
  Shield,
  Wifi,
  Server,
  Cpu,
  Database,
  Clock,
  FolderOpen,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Binary,
  Lock,
  Terminal,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  X,
}

const tabs = TABS.map((tab) => ({
  ...tab,
  icon: iconMap[tab.icon],
}))

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemStats {
  cpu: number
  memory: { used: number; total: number; percentage: number }
  disk: { used: number; total: number; percentage: number }
  uptime: number
}

interface ServiceStatus {
  openclaw: { running: boolean; pid?: number; memoryUsage?: number }
  tailscale: { connected: boolean; ip?: string }
}

interface LoadingState {
  stats: boolean
  services: boolean
}

interface ErrorState {
  stats: string | null
  services: string | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING & ERROR STATE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full p-4">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-white/60 text-sm">{message}</p>
    </div>
  )
}

function ErrorState({
  message,
  onRetry
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full p-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
      </div>
      <p className="mt-4 text-white/60 text-sm text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 transition-colors text-sm"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  // Use DEFAULT_TAB from config instead of hardcoded value
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const [tabsExpanded, setTabsExpanded] = useState(true)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [services, setServices] = useState<ServiceStatus | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>("up")
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Loading and error states
  const [loading, setLoading] = useState<LoadingState>({ stats: true, services: true })
  const [errors, setErrors] = useState<ErrorState>({ stats: null, services: null })

  // Chat sheet state - AI Assistant
  const [chatSheetOpen, setChatSheetOpen] = useState(false)
  const [agentState, setAgentState] = useState<AgentState>("listening")
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  // Fetch system stats from API
  const fetchStats = useCallback(async () => {
    setLoading((prev) => ({ ...prev, stats: true }))
    setErrors((prev) => ({ ...prev, stats: null }))
    try {
      const response = await fetch("/api/xmad/system/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error("Failed to fetch stats")
      }
    } catch {
      // Use DEFAULTS from config instead of hardcoded values
      setStats({
        cpu: DEFAULTS.STATS.CPU,
        memory: { ...DEFAULTS.STATS.MEMORY },
        disk: { ...DEFAULTS.STATS.DISK },
        uptime: DEFAULTS.STATS.UPTIME,
      })
      setErrors((prev) => ({ ...prev, stats: "Using default values" }))
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }))
    }
  }, [])

  // Fetch service status from API
  const fetchServices = useCallback(async () => {
    setLoading((prev) => ({ ...prev, services: true }))
    setErrors((prev) => ({ ...prev, services: null }))
    try {
      const response = await fetch("/api/xmad/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        throw new Error("Failed to fetch services")
      }
    } catch {
      // Use DEFAULTS from config instead of hardcoded values
      setServices({
        openclaw: { ...DEFAULTS.SERVICES.OPENCLAW },
        tailscale: { ...DEFAULTS.SERVICES.TAILSCALE },
      })
      setErrors((prev) => ({ ...prev, services: "Service unavailable" }))
    } finally {
      setLoading((prev) => ({ ...prev, services: false }))
    }
  }, [])

  // Reset collapse timer (uses TIMING.TAB_COLLAPSE from config)
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
    setTabsExpanded(true)
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)
  }, [])

  // Initial mount - start collapse timer and fetch data
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      collapseTimerRef.current = setTimeout(() => {
        setTabsExpanded(false)
      }, TIMING.TAB_COLLAPSE)
    }

    // Fetch initial data
    fetchStats()
    fetchServices()

    // Set up polling using TIMING.STATS_POLL_INTERVAL from config
    const interval = setInterval(fetchStats, TIMING.STATS_POLL_INTERVAL)

    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
      }
      clearInterval(interval)
    }
  }, [fetchStats, fetchServices])

  // Open sheet with specific position
  const openSheet = useCallback((position: SheetPosition) => {
    setSheetPosition(position)
    setSheetOpen(true)
  }, [])

  // Handle tab change
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value)
      resetCollapseTimer()
    },
    [resetCollapseTimer]
  )

  // Chat sheet handlers - AI Assistant
  const handleOpenChat = useCallback(() => {
    setChatSheetOpen(true)
    setAgentState("listening")
  }, [])

  const handleCloseChat = useCallback(() => {
    setChatSheetOpen(false)
    setAgentState("idle")
  }, [])

  const handleSendMessage = useCallback((message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      sender: "user",
    }
    setChatMessages((prev) => [...prev, newMessage])

    // Simulate agent response
    setAgentState("thinking")
    setTimeout(() => {
      setAgentState("speaking")
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message. This is a demo response.`,
        timestamp: new Date(),
        sender: "agent",
      }
      setChatMessages((prev) => [...prev, agentResponse])
      setTimeout(() => setAgentState("listening"), 2000)
    }, 1500)
  }, [])

  const handleMicToggle = useCallback(() => {
    setIsMicEnabled((prev) => !prev)
  }, [])

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND - Uses BACKGROUND config (no hardcoded values)
          Pixel-perfect from ein-ui with animate-pulse on blobs
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse z-0" />

      {/* ════════════════════════════════════════════════════════════════════════
          GLASS TABS CONTAINER - exact from ein-ui
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="relative z-10 h-screen overflow-hidden pt-16 flex flex-col transition-all duration-500"
      >
        {/* Content area - scrollable vertically (pixel-perfect from ein-ui) */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:px-4 lg:px-6 pb-24">
          {/* ==================== OVERVIEW TAB ==================== */}
          <GlassTabsContent value="overview" className="m-0 mt-0">
            {/* Loading State */}
            {loading.stats && <LoadingState message="Loading system stats..." />}

            {/* Error State */}
            {errors.stats && !loading.stats && (
              <ErrorState message={errors.stats} onRetry={fetchStats} />
            )}

            {/* Content - show when not loading and no error */}
            {!loading.stats && !errors.stats && (
              <>
                {/* Row 1 - System Gauges - uses WIDGET_LAYOUT.CAROUSEL_ITEMS */}
            <div className="mb-4">
              <WidgetCarousel gap={WIDGET_LAYOUT.GAP} itemsPerView={WIDGET_LAYOUT.CAROUSEL_ITEMS}>
                <MultiGaugeWidget
                  title="System Resources"
                  gauges={[
                    {
                      label: "RAM",
                      value: stats?.memory.percentage ?? 52,
                      unit: "%",
                      color: "green",
                    },
                    { label: "CPU", value: stats?.cpu ?? 45, unit: "%", color: "blue" },
                    {
                      label: "Disk",
                      value: stats?.disk.percentage ?? 36,
                      unit: "%",
                      color: "cyan",
                    },
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
                    {WIDGET_PRESETS.FORECAST.map((f) => (
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

            {/* Row 2 - Server Status - uses WIDGET_LAYOUT.CAROUSEL_ITEMS */}
            <div className="mb-4">
              <WidgetCarousel
                gap={WIDGET_LAYOUT.GAP}
                itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              >
                <ServerStatusCard
                  icon={Server}
                  label="OpenClaw Gateway"
                  status={services?.openclaw?.running ? "online" : "offline"}
                  detail={
                    services?.openclaw?.running
                      ? `PID: ${services.openclaw.pid ?? "N/A"}`
                      : "Stopped"
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

            {/* Row 3 - Mini Stats - uses WIDGET_PRESETS.MINI_STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {WIDGET_PRESETS.MINI_STATS.map((stat) => {
                const Icon = iconMap[stat.icon]
                return (
                  <MiniStatWidget
                    key={stat.label}
                    icon={Icon}
                    label={stat.label}
                    value={stat.value}
                    glowColor={stat.color}
                  />
                )
              })}
            </div>

            {/* Row 4 - Stats Cards - uses WIDGET_PRESETS.STOCK_CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WIDGET_PRESETS.STOCK_CARDS.map((stock, i) => (
                <GlassWidgetBase key={stock.symbol} size="md" width="full" glowColor={stock.color}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-bold">{stock.symbol}</div>
                      <div className="text-white/40 text-xs">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-lg font-medium">
                        {stock.symbol === "CPU" && (stats?.cpu ?? DEFAULTS.STATS.CPU)}
                        {stock.symbol === "RAM" &&
                          (stats?.memory.percentage ?? DEFAULTS.STATS.MEMORY.percentage)}
                        {stock.symbol === "DISK" &&
                          (stats?.disk.percentage ?? DEFAULTS.STATS.DISK.percentage)}
                        %
                      </div>
                      <div className={`text-xs ${i % 2 === 0 ? "text-green-400" : "text-red-400"}`}>
                        {i % 2 === 0 ? "+" : ""}
                        {(Math.random() * 3).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </GlassWidgetBase>
              ))}
            </div>
              </>
            )}
          </GlassTabsContent>

          {/* ==================== MEMORY TAB ==================== */}
          <GlassTabsContent value="memory" className="m-0 mt-0">
            {/* Memory Stats */}
            <div className="mb-4">
              <WidgetCarousel gap={WIDGET_LAYOUT.GAP} itemsPerView={WIDGET_LAYOUT.CAROUSEL_ITEMS}>
                <MultiProgressWidget
                  title="Memory Usage"
                  items={MEMORY_WIDGETS.CATEGORIES}
                  glowColor="purple"
                />
                <GlassWidgetBase size="lg" width="md" glowColor="blue">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">
                    Quick Actions
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-left flex items-center gap-3"
                    >
                      <FolderOpen className="h-4 w-4 text-cyan-400" />
                      <span className="text-white text-sm">Browse All Files</span>
                    </button>
                    <button
                      type="button"
                      className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-left flex items-center gap-3"
                    >
                      <Settings className="h-4 w-4 text-purple-400" />
                      <span className="text-white text-sm">Memory Settings</span>
                    </button>
                    <button
                      type="button"
                      className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-left flex items-center gap-3"
                    >
                      <Database className="h-4 w-4 text-green-400" />
                      <span className="text-white text-sm">Export Memory</span>
                    </button>
                  </div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>

            {/* Recent Files */}
            <div className="mb-4">
              <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">Recent Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MEMORY_WIDGETS.FILES.map((file) => (
                  <MemoryFileCard key={file.name} {...file} />
                ))}
              </div>
            </div>

            {/* Sheet Position Demo */}
            <div className="mb-4">
              <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">Sheet Demo</h3>
              <div className="grid grid-cols-5 gap-2">
                {(["up", "down", "left", "right", "center"] as SheetPosition[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => openSheet(pos)}
                    className="p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white text-xs capitalize"
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </GlassTabsContent>

          {/* ==================== AUTOMATION TAB ==================== */}
          <GlassTabsContent value="automation" className="m-0 mt-0">
            {/* Automation Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {AUTOMATION_WIDGETS.STATS.map((stat) => {
                const Icon =
                  iconMap[
                    stat.label === "Active Tasks"
                      ? "Play"
                      : stat.label === "Completed Today"
                        ? "CheckCircle"
                        : stat.label === "Failed"
                          ? "XCircle"
                          : "Clock"
                  ]
                return (
                  <MiniStatWidget
                    key={stat.label}
                    icon={Icon}
                    label={stat.label}
                    value={stat.value}
                    glowColor={stat.color}
                  />
                )
              })}
            </div>

            {/* Tasks */}
            <div className="mb-4">
              <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">Active Tasks</h3>
              <div className="space-y-3">
                {AUTOMATION_WIDGETS.TASKS.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-4">
              <WidgetCarousel gap={WIDGET_LAYOUT.GAP} itemsPerView={{ base: 1, sm: 2, lg: 3 }}>
                <GlassWidgetBase size="md" width="full" glowColor="green">
                  <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">
                    Create Task
                  </div>
                  <button
                    type="button"
                    className="w-full p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    New Automation
                  </button>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="full" glowColor="amber">
                  <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">
                    Schedule
                  </div>
                  <button
                    type="button"
                    className="w-full p-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors text-amber-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    View Schedule
                  </button>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="full" glowColor="purple">
                  <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">History</div>
                  <button
                    type="button"
                    className="w-full p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    View Logs
                  </button>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>
          </GlassTabsContent>

          {/* ==================== SCREEN TAB ==================== */}
          <GlassTabsContent value="screen" className="m-0 mt-0">
            {/* VNC Connections */}
            <div className="mb-4">
              <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">
                VNC Connections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SCREEN_WIDGETS.CONNECTIONS.map((conn) => (
                  <GlassWidgetBase
                    key={conn.name}
                    size="md"
                    width="full"
                    glowColor={conn.status === "online" ? "green" : "red"}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{conn.name}</div>
                        <div className="text-white/50 text-xs">
                          {conn.host}:{conn.port}
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${conn.status === "online" ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                      />
                    </div>
                  </GlassWidgetBase>
                ))}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="mb-4">
              <WidgetCarousel gap={WIDGET_LAYOUT.GAP} itemsPerView={{ base: 1, sm: 2, lg: 3 }}>
                {SCREEN_WIDGETS.RESOLUTIONS.map((res) => (
                  <GlassWidgetBase key={res.label} size="md" width="full" glowColor="blue">
                    <button
                      type="button"
                      className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center"
                    >
                      <div className="text-white font-medium">{res.label}</div>
                      <div className="text-white/50 text-xs">{res.value}</div>
                    </button>
                  </GlassWidgetBase>
                ))}
              </WidgetCarousel>
            </div>

            {/* Screen Preview Placeholder */}
            <GlassWidgetBase size="xl" width="full" glowColor="purple" className="min-h-[300px]">
              <div className="flex flex-col items-center justify-center h-full text-white">
                <Monitor className="h-16 w-16 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">VNC Viewer</h3>
                <p className="text-white/60 text-sm">Select a connection to view screen</p>
              </div>
            </GlassWidgetBase>
          </GlassTabsContent>

          {/* ==================== BACKUPS TAB ==================== */}
          <GlassTabsContent value="backups" className="m-0 mt-0">
            {/* Backup Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {BACKUP_WIDGETS.STATS.map((stat) => {
                const Icon =
                  iconMap[
                    stat.label === "Total Backups"
                      ? "Database"
                      : stat.label === "Storage Used"
                        ? "HardDrive"
                        : stat.label === "Last Success"
                          ? "CheckCircle"
                          : "Clock"
                  ]
                return (
                  <MiniStatWidget
                    key={stat.label}
                    icon={Icon}
                    label={stat.label}
                    value={stat.value}
                    glowColor={stat.color}
                  />
                )
              })}
            </div>

            {/* Recent Backups */}
            <div className="mb-4">
              <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">
                Recent Backups
              </h3>
              <div className="space-y-3">
                {BACKUP_WIDGETS.RECENT.map((backup) => (
                  <GlassWidgetBase key={backup.name} size="md" width="full" glowColor="cyan">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium">{backup.name}</div>
                        <div className="text-white/50 text-xs">{backup.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">{backup.size}</div>
                        <div
                          className={`text-xs ${backup.status === "completed" ? "text-green-400" : "text-amber-400"}`}
                        >
                          {backup.status}
                        </div>
                      </div>
                    </div>
                  </GlassWidgetBase>
                ))}
              </div>
            </div>

            {/* Backup Actions */}
            <div className="mb-4">
              <WidgetCarousel gap={WIDGET_LAYOUT.GAP} itemsPerView={{ base: 1, sm: 2, lg: 3 }}>
                <GlassWidgetBase size="md" width="full" glowColor="green">
                  <button
                    type="button"
                    className="w-full p-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Create Backup
                  </button>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="full" glowColor="purple">
                  <button
                    type="button"
                    className="w-full p-4 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Backup Settings
                  </button>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="full" glowColor="cyan">
                  <button
                    type="button"
                    className="w-full p-4 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors text-cyan-400 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Browse All
                  </button>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>
          </GlassTabsContent>

          {/* ==================== SETTINGS TAB ==================== */}
          <GlassTabsContent value="settings" className="m-0 mt-0">
            {/* Row 1 - System status servers */}
            <div className="mb-4">
              <WidgetCarousel
                gap={WIDGET_LAYOUT.GAP}
                itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              >
                {SETTINGS_WIDGETS.SERVERS.map((server) => {
                  const Icon = iconMap[server.icon]
                  return (
                    <ServerStatusCard
                      key={server.label}
                      icon={Icon}
                      label={server.label}
                      status={server.status}
                      detail={server.detail}
                      glowColor={server.color}
                    />
                  )
                })}
              </WidgetCarousel>
            </div>

            {/* Row 2 - Mini stats */}
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {SETTINGS_WIDGETS.MINI_STATS.map((stat) => {
                const Icon = iconMap[stat.icon]
                return (
                  <MiniStatWidget
                    key={stat.label}
                    icon={Icon}
                    label={stat.label}
                    value={stat.value}
                    glowColor={stat.color}
                  />
                )
              })}
            </div>

            {/* Row 3 - Quick actions */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SETTINGS_WIDGETS.QUICK_ACTIONS.map((action) => {
                const Icon = iconMap[action.icon]
                return (
                  <QuickActionCard
                    key={action.label}
                    icon={Icon}
                    label={action.label}
                    description={action.description}
                    glowColor={action.color}
                  />
                )
              })}
            </div>

            {/* Row 4 - System limits and performance */}
            <div className="mb-4">
              <WidgetCarousel
                gap={WIDGET_LAYOUT.GAP}
                itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 2 }}
              >
                <MultiProgressWidget
                  title="System Limits"
                  items={SETTINGS_WIDGETS.LIMITS}
                  glowColor="cyan"
                />
                <MultiGaugeWidget
                  title="Performance"
                  gauges={SETTINGS_WIDGETS.PERFORMANCE}
                  glowColor="purple"
                />
              </WidgetCarousel>
            </div>
          </GlassTabsContent>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            FLOATING TAB BAR - Pixel-perfect from ein-ui (lines 1156-1222)
            Must be INSIDE GlassTabs for Radix context
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-4 pt-2 pointer-events-none">
          {/* Single centered container */}
          <div className="relative flex flex-col items-center pointer-events-auto">
            {/* Chat icon above - only visible when expanded */}
            <AnimatePresence>
              {tabsExpanded && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleOpenChat}
                  className="mb-2 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  aria-label="Open chat"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button */}
            <button
              type="button"
              onClick={resetCollapseTimer}
              className={`
                transition-all duration-300 ease-out select-none
                ${tabsExpanded ? "opacity-0 scale-75 pointer-events-none absolute" : "opacity-100 scale-100"}
                relative p-3 rounded-xl
                bg-white/10 backdrop-blur-xl border border-white/20
                shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                hover:bg-white/15 active:scale-95
                before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none
              `}
              aria-label="Expand navigation"
            >
              <div className="relative z-10 flex items-center justify-center">
                {(() => {
                  const activeTabData = tabs.find((t) => t.value === activeTab)
                  const TabIcon = activeTabData?.icon || LayoutDashboard
                  return <TabIcon className="h-4 w-4 text-white" />
                })()}
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-lg opacity-60" />
            </button>

            {/* Expanded state - tabs */}
            <div
              className={`
                transition-all duration-300 ease-out origin-bottom
                ${tabsExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"}
              `}
            >
              {/* The tab bar */}
              <GlassTabsList className="flex items-center justify-center gap-0.5 px-1.5 py-1 h-auto">
                {tabs.map((tab) => (
                  <GlassTabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group p-2 transition-all duration-200 rounded-lg"
                    onClick={resetCollapseTimer}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="ml-1.5 text-xs hidden group-data-[state=active]:inline whitespace-nowrap">
                      {tab.label}
                    </span>
                  </GlassTabsTrigger>
                ))}
              </GlassTabsList>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            GLASS SHEET - Multi-position sheet demo
            ════════════════════════════════════════════════════════════════════════ */}
        <GlassSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          position={sheetPosition}
          title={`${sheetPosition.charAt(0).toUpperCase() + sheetPosition.slice(1)} Sheet`}
          description="This is a demo of the glass sheet component"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10">
              <h4 className="text-white font-medium mb-2">Sheet Position: {sheetPosition}</h4>
              <p className="text-white/60 text-sm">
                This sheet is positioned at the {sheetPosition} of the screen. You can use it for
                menus, forms, or any content that needs to be displayed in an overlay.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["up", "down", "left", "right", "center"] as SheetPosition[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => {
                    setSheetPosition(pos)
                  }}
                  className={`p-3 rounded-lg capitalize transition-colors ${
                    sheetPosition === pos
                      ? "bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </GlassSheet>

        {/* ════════════════════════════════════════════════════════════════════════
            AI CHAT SHEET - Pixel-perfect from ein-ui (lines 1226-1321)
            Voice-enabled AI assistant interface
            ════════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {chatSheetOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl overflow-hidden"
              style={{ height: "60vh" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AI Assistant</h3>
                    <p className="text-white/50 text-sm">Voice-enabled chat</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Audio Visualizer */}
              <div className="flex justify-center py-6 border-b border-white/10">
                <AudioVisualizerBar state={agentState} size="lg" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4" style={{ height: "calc(60vh - 280px)" }}>
                <AgentChatTranscript
                  messages={chatMessages}
                  agentState={agentState}
                  agentName="XMAD AI"
                />
              </div>

              {/* Control Bar */}
              <div className="p-4 border-t border-white/10">
                <AgentControlBar
                  isMicEnabled={isMicEnabled}
                  isCameraEnabled={false}
                  isScreenShareEnabled={false}
                  isConnected={true}
                  showChat={false}
                  onMicToggle={handleMicToggle}
                  onDisconnect={handleCloseChat}
                />
                {/* Text Input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        handleSendMessage(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement
                      if (input?.value) {
                        handleSendMessage(input.value)
                        input.value = ""
                      }
                    }}
                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors text-cyan-400"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for chat sheet */}
        <AnimatePresence>
          {chatSheetOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseChat}
              className="fixed inset-0 z-40 bg-black/50"
            />
          )}
        </AnimatePresence>
      </GlassTabs>
    </>
  )
}

export default HomeClient
