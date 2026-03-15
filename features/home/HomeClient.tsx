/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   Pixel-perfect implementation from ein-ui
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Zap,
  Monitor,
  HardDrive,
  Settings,
  Activity,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Wifi,
  Server,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  FileText,
  Globe,
  Gauge,
  Binary,
  Terminal,
  Lock,
  RefreshCw,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Folder,
  X,
} from "lucide-react";

// Import dashboard styles
import "@/styles/dashboard.css";

// Import glass components
import {
  GlassTabs,
  GlassTabsList,
  GlassTabsTrigger,
  GlassTabsContent,
} from "@/components/glass/glass-tabs";

import {
  GlassWidgetBase,
  MiniStatWidget,
  ServerStatusCard,
  TaskCard,
  MemoryFileCard,
  StatCard,
  StatusBadge,
  GaugeWidget,
  MultiGaugeWidget,
  MultiProgressWidget,
} from "@/components/widgets/base-widget";

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel";

import { ChatInterface } from "@/components/chat/ChatInterface";

import { MemoryEditor } from "@/components/memory/MemoryEditor";

// ═══════════════════════════════════════════════════════════════════════════════
// TABS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const tabs = [
  { value: "overview", icon: LayoutDashboard, label: "Overview", bg: "tab-bg-ocean" },
  { value: "chat", icon: MessageSquare, label: "Chat", bg: "tab-bg-aurora" },
  { value: "memory", icon: Brain, label: "Memory", bg: "tab-bg-forest" },
  { value: "automation", icon: Zap, label: "Automation", bg: "tab-bg-sunset" },
  { value: "screen", icon: Monitor, label: "Screen", bg: "tab-bg-midnight" },
  { value: "backups", icon: HardDrive, label: "Backups", bg: "tab-bg-ocean" },
];

const TAB_COLLAPSE_DELAY = 2000;

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const systemStats = {
  cpu: 67,
  memory: { used: 7.8, total: 16, percentage: 48 },
  disk: { used: 234, total: 500, percentage: 46 },
  uptime: 864000,
};

const openClawStatus = {
  running: true,
  pid: 12345,
  uptime: 432000,
  memoryUsage: 256,
};

const tailscaleStatus = {
  connected: true,
  ip: "100.121.254.21",
  hostname: "xmad-server",
  peers: 5,
};

const automationTasks: Array<{
  id: string;
  name: string;
  status: "running" | "pending" | "completed" | "paused";
  progress: number;
}> = [
  { id: "1", name: "Daily Backup", status: "running", progress: 45 },
  { id: "2", name: "Log Cleanup", status: "pending", progress: 0 },
  { id: "3", name: "Security Scan", status: "completed", progress: 100 },
  { id: "4", name: "Cache Clear", status: "paused", progress: 60 },
];

const memoryFiles = [
  { name: "project-context.md", size: "12 KB", modified: "2 hours ago" },
  { name: "api-keys.json", size: "2 KB", modified: "1 day ago" },
  { name: "system-config.yaml", size: "8 KB", modified: "3 days ago" },
];

const chatStats = [
  { title: "Messages", value: "1,247", change: "+15%", trend: "up", icon: MessageSquare },
  { title: "Tokens Used", value: "845K", change: "+23%", trend: "up", icon: Cpu },
  { title: "API Quota", value: "67%", change: "+5%", trend: "up", icon: Gauge },
  { title: "Avg Response", value: "1.2s", change: "-8%", trend: "down", icon: Clock },
];

const screenStats = [
  { title: "FPS", value: "30", change: "Stable", trend: "up", icon: Monitor },
  { title: "Quality", value: "85%", change: "+2%", trend: "up", icon: Activity },
  { title: "Latency", value: "45ms", change: "-5ms", trend: "up", icon: Globe },
  { title: "Bitrate", value: "4.2Mb", change: "+0.3", trend: "up", icon: Binary },
];

const adminStats = [
  { title: "Total Backups", value: "12", change: "+2", trend: "up", icon: Database },
  { title: "Storage Used", value: "54.3 GB", change: "+8.2%", trend: "up", icon: HardDrive },
  { title: "Success Rate", value: "99.1%", change: "+4.3%", trend: "up", icon: TrendingUp },
  { title: "Active Jobs", value: "3", change: "-1", trend: "down", icon: Activity },
];

const backupHistory = [
  { name: "Daily Backup", type: "Incremental", status: "completed", size: "2.4 GB" },
  { name: "Weekly Full", type: "Full", status: "completed", size: "12.1 GB" },
  { name: "Database Dump", type: "Incremental", status: "running", size: "1.2 GB" },
  { name: "Config Backup", type: "Full", status: "completed", size: "0.5 GB" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tabsExpanded, setTabsExpanded] = useState(true);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    setTabsExpanded(true);
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false);
    }, TAB_COLLAPSE_DELAY);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      collapseTimerRef.current = setTimeout(() => {
        setTabsExpanded(false);
      }, TAB_COLLAPSE_DELAY);
    }
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    resetCollapseTimer();
  }, [resetCollapseTimer]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND EFFECTS - Pixel-perfect from ein-ui
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="blur-circle-1" />
      <div className="blur-circle-2" />
      <div className="blur-circle-3" />

      {/* ════════════════════════════════════════════════════════════════════════
          TABS CONTAINER
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="relative z-10 min-h-screen overflow-hidden pt-16 flex flex-col transition-all duration-500"
      >
        {/* Tab Navigation - Fixed at top */}
        <div className="sticky top-16 z-20 px-3 py-3 md:px-4 lg:px-6">
          <GlassTabsList expanded={tabsExpanded} className="w-full justify-center">
            {tabs.map((tab) => (
              <GlassTabsTrigger
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                bgClass={tab.bg}
                expanded={tabsExpanded}
                className="flex-1"
              >
                {tab.label}
              </GlassTabsTrigger>
            ))}
          </GlassTabsList>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            CONTENT AREA - Scrollable
            ═════════════════════════════════════════════════════════════════════ */}
        <div className="dashboard-content">

          {/* ═══════════════════════════════════════════════════════════════════
              OVERVIEW TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="overview" className="m-0">

            {/* Row 1 - Gauges */}
            <div className="widget-row">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
                <MultiGaugeWidget
                  title="System Resources"
                  gauges={[
                    { label: "RAM", value: systemStats.memory.percentage, unit: "%", color: "purple" },
                    { label: "CPU", value: systemStats.cpu, unit: "%", color: "cyan" },
                    { label: "Disk", value: systemStats.disk.percentage, unit: "%", color: "green" },
                  ]}
                  glowColor="green"
                />
                <MultiProgressWidget
                  title="Usage"
                  items={[
                    { label: "Memory", value: systemStats.memory.used, max: systemStats.memory.total, unit: "GB", color: "purple" },
                    { label: "Disk", value: systemStats.disk.used, max: systemStats.disk.total, unit: "GB", color: "blue" },
                    { label: "CPU Load", value: systemStats.cpu, unit: "%", color: "cyan" },
                  ]}
                  glowColor="purple"
                />
                <GlassWidgetBase size="lg" width="md" glowColor="blue">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">System Forecast</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "1h", high: 72, low: 45 },
                      { label: "2h", high: 68, low: 42 },
                      { label: "3h", high: 75, low: 48 },
                    ].map((f, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-white/50 mb-1">{f.label}</div>
                        <div className="text-white font-medium">{f.high}°</div>
                        <div className="text-xs text-white/40">{f.low}°</div>
                      </div>
                    ))}
                  </div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>

            {/* Row 2 - Server Status */}
            <div className="widget-row">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
                <ServerStatusCard
                  icon={Server}
                  label="OpenClaw Gateway"
                  status={openClawStatus.running ? "online" : "offline"}
                  detail={openClawStatus.running ? `PID: ${openClawStatus.pid}` : "Stopped"}
                  glowColor="cyan"
                />
                <ServerStatusCard
                  icon={Wifi}
                  label="Tailscale VPN"
                  status={tailscaleStatus.connected ? "online" : "offline"}
                  detail={tailscaleStatus.connected ? tailscaleStatus.ip : "Disconnected"}
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
                    <Gauge className="h-5 w-5 text-white/70" />
                    <span className="text-white/60 text-sm">Server Room</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-medium">22°C</span>
                    <StatusBadge status="online" />
                  </div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>

            {/* Row 3 - Mini Stats */}
            <div className="widget-row grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStatWidget icon={Activity} label="Requests/min" value="1.2K" glowColor="cyan" />
              <MiniStatWidget icon={Binary} label="Data In" value="45 MB" glowColor="green" />
              <MiniStatWidget icon={Binary} label="Data Out" value="128 MB" glowColor="purple" />
              <MiniStatWidget icon={Gauge} label="Latency" value="12ms" glowColor="amber" />
            </div>

            {/* Row 4 - Hourly Chart & Calendar */}
            <div className="widget-row">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 2 }}>
                <GlassWidgetBase size="lg" width="md" glowColor="cyan">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">Hourly Load</div>
                  <div className="flex justify-between items-end h-24">
                    {[
                      { time: "1AM", val: 22 },
                      { time: "4AM", val: 18 },
                      { time: "8AM", val: 26 },
                      { time: "12PM", val: 32 },
                      { time: "4PM", val: 28 },
                      { time: "8PM", val: 24 },
                    ].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 rounded-t-md bg-gradient-to-t from-cyan-500/50 to-cyan-400"
                          style={{ height: `${h.val * 2}px` }}
                        />
                        <span className="text-[10px] text-white/40">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </GlassWidgetBase>
                <GlassWidgetBase size="lg" width="md" glowColor="purple">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">Scheduled Events</div>
                  <div className="space-y-3">
                    {[
                      { title: "Backup Cycle", time: "02:00 AM", color: "bg-cyan-500" },
                      { title: "Cache Flush", time: "06:00 AM", color: "bg-purple-500" },
                      { title: "Security Audit", time: "12:00 PM", color: "bg-amber-500" },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                        <div className={`w-2 h-2 rounded-full ${e.color}`} />
                        <div className="flex-1">
                          <div className="text-white text-sm">{e.title}</div>
                          <div className="text-white/40 text-xs">{e.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>

            {/* Row 5 - Resource Stocks */}
            <div className="widget-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { symbol: "CPU", name: "Processor Load", price: 67.45, change: 2.34 },
                { symbol: "RAM", name: "Memory Usage", price: 48.20, change: -1.50 },
                { symbol: "DISK", name: "Storage Used", price: 46.80, change: 0.30 },
              ].map((stock, i) => (
                <GlassWidgetBase key={i} size="md" width="full" glowColor={i === 0 ? "cyan" : i === 1 ? "purple" : "green"}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-bold">{stock.symbol}</div>
                      <div className="text-white/40 text-xs">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-lg font-medium">{stock.price.toFixed(2)}%</div>
                      <div className={`text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </GlassWidgetBase>
              ))}
            </div>
          </GlassTabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
              CHAT TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="chat" className="m-0">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {chatStats.map((stat) => (
                <div key={stat.title} className="glass-dashboard-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">{stat.title}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10">
                      <stat.icon className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Interface */}
            <div className="glass-dashboard-card overflow-hidden" style={{ height: "500px" }}>
              <ChatInterface
                placeholder="Ask Nova..."
                enableVoice={true}
                enableTTS={true}
                maxHeight="400px"
                onSend={async (message) => {
                  // TODO: Connect to actual AI backend
                  console.log("Sending message:", message)
                  // Simulated response
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return `I received your message: "${message}". This is a simulated response. Connect to the AI backend for real responses.`
                }}
              />
            </div>
          </GlassTabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
              MEMORY TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="memory" className="m-0">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MiniStatWidget icon={FileText} label="Total Files" value="7" glowColor="blue" />
              <MiniStatWidget icon={Database} label="Total Size" value="24KB" glowColor="purple" />
              <MiniStatWidget icon={Binary} label="Last Modified" value="5m" glowColor="cyan" />
              <MiniStatWidget icon={RefreshCw} label="Auto-Save" value="On" glowColor="green" />
            </div>

            {/* Memory Editor */}
            <div className="glass-dashboard-card overflow-hidden" style={{ height: "500px" }}>
              <MemoryEditor
                initialFile="MEMORY.md"
                height="450px"
                onSave={(filename, content) => {
                  console.log("Saved:", filename, content.length, "characters")
                }}
              />
            </div>
          </GlassTabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
              AUTOMATION TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="automation" className="m-0">
            <div className="widget-row">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
                <GlassWidgetBase size="md" width="sm" glowColor="pink">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-white/60" />
                    <span className="text-white/50 text-xs">Active Tasks</span>
                  </div>
                  <div className="text-2xl font-bold text-white">4</div>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="sm" glowColor="green">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-white/60" />
                    <span className="text-white/50 text-xs">Completed Today</span>
                  </div>
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">+10</span>
                  </div>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="sm" glowColor="green">
                  <div className="flex flex-col items-center py-2">
                    <GaugeWidget label="Success Rate" value={96} unit="%" color="green" size="sm" />
                  </div>
                </GlassWidgetBase>
                <GlassWidgetBase size="md" width="sm" glowColor="amber">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-white/60" />
                    <span className="text-white/50 text-xs">Avg Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-white">2.5<span className="text-sm font-normal text-white/50 ml-1">min</span></div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MiniStatWidget icon={Zap} label="Queued" value="12" glowColor="amber" />
              <MiniStatWidget icon={CheckCircle2} label="Success" value="234" glowColor="green" />
              <MiniStatWidget icon={Pause} label="Paused" value="3" glowColor="purple" />
              <MiniStatWidget icon={Activity} label="Running" value="4" glowColor="cyan" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {automationTasks.map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>

            <div className="widget-row">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
                <MultiGaugeWidget
                  title="Task Distribution"
                  gauges={[
                    { label: "Running", value: 1, color: "green" },
                    { label: "Pending", value: 1, color: "amber" },
                    { label: "Done", value: 2, color: "cyan" },
                  ]}
                  glowColor="pink"
                />
                <MultiProgressWidget
                  title="Schedule Timeline"
                  items={[
                    { label: "Hourly Tasks", value: 8, max: 10, color: "pink" },
                    { label: "Daily Tasks", value: 12, max: 15, color: "purple" },
                    { label: "Weekly Tasks", value: 3, max: 5, color: "blue" },
                  ]}
                  glowColor="purple"
                />
                <GlassWidgetBase size="lg" width="md" glowColor="cyan">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">Timer</div>
                  <div className="text-center">
                    <div className="text-4xl font-mono text-white mb-2">25:00</div>
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                        Start
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>
                </GlassWidgetBase>
              </WidgetCarousel>
            </div>
          </GlassTabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
              SCREEN TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="screen" className="m-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {screenStats.map((stat) => (
                <div key={stat.title} className="glass-dashboard-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">{stat.title}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10">
                      <stat.icon className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MiniStatWidget icon={Monitor} label="Resolution" value="1080p" glowColor="cyan" />
              <MiniStatWidget icon={Activity} label="Bitrate" value="4.2Mbps" glowColor="green" />
              <MiniStatWidget icon={Globe} label="Protocol" value="WebRTC" glowColor="purple" />
              <MiniStatWidget icon={Clock} label="Session" value="2h 15m" glowColor="amber" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <GlassWidgetBase size="md" width="full" glowColor="cyan" interactive>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Monitor className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Fullscreen</div>
                    <div className="text-white/50 text-xs">Toggle fullscreen mode</div>
                  </div>
                </div>
              </GlassWidgetBase>
              <GlassWidgetBase size="md" width="full" glowColor="green" interactive>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Quality</div>
                    <div className="text-white/50 text-xs">Adjust stream quality</div>
                  </div>
                </div>
              </GlassWidgetBase>
              <GlassWidgetBase size="md" width="full" glowColor="purple" interactive>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Screenshot</div>
                    <div className="text-white/50 text-xs">Capture current frame</div>
                  </div>
                </div>
              </GlassWidgetBase>
            </div>
          </GlassTabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
              BACKUPS TAB
              ═══════════════════════════════════════════════════════════════════ */}
          <GlassTabsContent value="backups" className="m-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {adminStats.map((stat) => (
                <div key={stat.title} className="glass-dashboard-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">{stat.title}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400" />
                        )}
                        <span className={`text-xs ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10">
                      <stat.icon className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Backup History Table */}
            <div className="glass-dashboard-card p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Backup History</h3>
                  <p className="text-white/50 text-xs">Manage your backup jobs</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 w-40"
                    />
                  </div>
                  <button className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium flex items-center gap-1 hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> New
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-xs font-medium text-white/40 uppercase">Name</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-white/40 uppercase hidden sm:table-cell">Type</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-white/40 uppercase">Status</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-white/40 uppercase hidden sm:table-cell">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupHistory.map((backup, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white/10">
                              <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                            </div>
                            <span className="text-sm text-white truncate">{backup.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 hidden sm:table-cell">
                          <span className="text-sm text-white/70">{backup.type}</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <StatusBadge status={backup.status === "completed" ? "online" : backup.status === "running" ? "online" : "warning"} />
                        </td>
                        <td className="py-2.5 px-2 hidden sm:table-cell">
                          <span className="text-sm text-white/50">{backup.size}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-dashboard-card p-4">
                <h4 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Database className="h-4 w-4" /> Storage
                </h4>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-[68%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-white/60">68.5 GB used</span>
                  <span className="text-white/40">100 GB</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: Folder, label: "Database", size: "24.5 GB", color: "text-cyan-400" },
                    { icon: Folder, label: "Files", size: "32.1 GB", color: "text-purple-400" },
                    { icon: Folder, label: "Configs", size: "11.9 GB", color: "text-blue-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                        <span className="text-white/70">{item.label}</span>
                      </div>
                      <span className="text-white/50">{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-dashboard-card p-4">
                <h4 className="text-white font-medium mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {[
                    { action: "Backup completed", time: "2 min ago" },
                    { action: "New schedule added", time: "15 min ago" },
                    { action: "Storage cleaned", time: "1 hour ago" },
                    { action: "Full backup started", time: "3 hours ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-cyan-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{item.action}</p>
                        <p className="text-xs text-white/40">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassTabsContent>
        </div>
      </GlassTabs>
    </>
  );
}

export default HomeClient;
