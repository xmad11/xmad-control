/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   Pixel-perfect reproduction from ein-ui
   Phase 1: Background + Bottom Tabs
   Phase 2: Tab containers + Widget horizontal scroll engine
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
  Activity,
  Shield,
  Wifi,
  Server,
  Cpu,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent } from "@/components/glass/glass-tabs";
import { WidgetCarousel } from "@/components/carousel/WidgetCarousel";
import {
  GlassWidgetBase,
  MiniStatWidget,
  ServerStatusCard,
  MultiGaugeWidget,
  MultiProgressWidget,
  StatCard,
} from "@/components/widgets/base-widget";

// ═══════════════════════════════════════════════════════════════════════════════
// TABS CONFIGURATION (exact from ein-ui)
// ═══════════════════════════════════════════════════════════════════════════════

const tabs = [
  { value: "memory", icon: Brain, label: "Memory" },
  { value: "automation", icon: Zap, label: "Automation" },
  { value: "overview", icon: LayoutDashboard, label: "Overview" },
  { value: "screen", icon: Monitor, label: "Screen" },
  { value: "backups", icon: HardDrive, label: "Backups" },
];

// Tab collapse timing (exact from ein-ui: 2000ms)
const TAB_COLLAPSE_DELAY = 2000;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemStats {
  cpu: number;
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  uptime: number;
}

interface ServiceStatus {
  openclaw: { running: boolean; pid?: number; memoryUsage?: number };
  tailscale: { connected: boolean; ip?: string };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tabsExpanded, setTabsExpanded] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceStatus | null>(null);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Fetch system stats from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/xmad/system/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {
      // Use fallback data if API not available
      setStats({
        cpu: 45,
        memory: { used: 4.2, total: 8, percentage: 52 },
        disk: { used: 180, total: 500, percentage: 36 },
        uptime: 86400,
      });
    }
  }, []);

  // Fetch service status from API
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/xmad/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch {
      // Use fallback data if API not available
      setServices({
        openclaw: { running: true, pid: 12345, memoryUsage: 256 },
        tailscale: { connected: true, ip: "100.64.0.1" },
      });
    }
  }, []);

  // Reset collapse timer (exact logic from ein-ui)
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    setTabsExpanded(true);
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false);
    }, TAB_COLLAPSE_DELAY);
  }, []);

  // Initial mount - start collapse timer and fetch data
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      collapseTimerRef.current = setTimeout(() => {
        setTabsExpanded(false);
      }, TAB_COLLAPSE_DELAY);
    }

    // Fetch initial data
    fetchStats();
    fetchServices();

    // Set up polling for live stats (every 5 seconds)
    const interval = setInterval(fetchStats, 5000);

    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
      clearInterval(interval);
    };
  }, [fetchStats, fetchServices]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    resetCollapseTimer();
  }, [resetCollapseTimer]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND - Pixel-perfect from ein-ui (lines 433-436)
          ════════════════════════════════════════════════════════════════════════ */}
      {/* Full-screen gradient background - covers body bg */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse z-0" />

      {/* ════════════════════════════════════════════════════════════════════════
          GLASS TABS CONTAINER (wraps entire page including floating tab bar)
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="relative z-10 h-screen overflow-hidden flex flex-col transition-all duration-500"
      >
        {/* Content area - scrollable vertically */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:px-4 lg:px-6 pb-24">

          {/* ==================== OVERVIEW TAB ==================== */}
          <GlassTabsContent value="overview" className="m-0 mt-0">
            {/* Row 1 - System Gauges */}
            <div className="mb-4">
              <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2, xl: 3 }}>
                <MultiGaugeWidget
                  title="System Resources"
                  gauges={[
                    { label: "RAM", value: stats?.memory.percentage ?? 52, unit: "%", color: "purple" },
                    { label: "CPU", value: stats?.cpu ?? 45, unit: "%", color: "cyan" },
                    { label: "Disk", value: stats?.disk.percentage ?? 36, unit: "%", color: "green" },
                  ]}
                  glowColor="green"
                />
                <MultiProgressWidget
                  title="Usage"
                  items={[
                    { label: "Memory", value: stats?.memory.used ?? 4.2, max: stats?.memory.total ?? 8, unit: "GB", color: "purple" },
                    { label: "Disk", value: stats?.disk.used ?? 180, max: stats?.disk.total ?? 500, unit: "GB", color: "blue" },
                    { label: "CPU Load", value: stats?.cpu ?? 45, unit: "%", color: "cyan" },
                  ]}
                  glowColor="purple"
                />
                <GlassWidgetBase size="lg" width="md" glowColor="blue">
                  <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">System Forecast</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "1h", high: 52, low: 38 },
                      { label: "2h", high: 48, low: 35 },
                      { label: "3h", high: 55, low: 40 },
                    ].map((f, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-white/5">
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
                  detail={services?.openclaw?.running ? `PID: ${services.openclaw.pid ?? "N/A"}` : "Stopped"}
                  glowColor="cyan"
                />
                <ServerStatusCard
                  icon={Wifi}
                  label="Tailscale VPN"
                  status={services?.tailscale?.connected ? "online" : "offline"}
                  detail={services?.tailscale?.connected ? (services.tailscale.ip ?? "Connected") : "Disconnected"}
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
                { symbol: "CPU", name: "Processor Load", price: stats?.cpu ?? 45, change: 2.34 },
                { symbol: "RAM", name: "Memory Usage", price: stats?.memory.percentage ?? 52, change: -1.50 },
                { symbol: "DISK", name: "Storage Used", price: stats?.disk.percentage ?? 36, change: 0.30 },
              ].map((stock, i) => (
                <GlassWidgetBase key={i} size="md" width="full" glowColor={i === 0 ? "cyan" : i === 1 ? "purple" : "green"}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-bold">{stock.symbol}</div>
                      <div className="text-white/40 text-xs">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-lg font-medium">{stock.price.toFixed(1)}%</div>
                      <div className={`text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </GlassWidgetBase>
              ))}
            </div>
          </GlassTabsContent>

          {/* ==================== MEMORY TAB ==================== */}
          <GlassTabsContent value="memory" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Brain className="h-16 w-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Memory</h2>
              <p className="text-white/60">Memory editor will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== AUTOMATION TAB ==================== */}
          <GlassTabsContent value="automation" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Zap className="h-16 w-16 text-orange-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Automation</h2>
              <p className="text-white/60">Automation tasks will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== SCREEN TAB ==================== */}
          <GlassTabsContent value="screen" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Monitor className="h-16 w-16 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Screen</h2>
              <p className="text-white/60">VNC screen will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== BACKUPS TAB ==================== */}
          <GlassTabsContent value="backups" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <HardDrive className="h-16 w-16 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Backups</h2>
              <p className="text-white/60">Backup management will be implemented here</p>
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
                  className="mb-2 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  aria-label="Open chat"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button */}
            <button
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
                  const activeTabData = tabs.find((t) => t.value === activeTab);
                  const TabIcon = activeTabData?.icon || LayoutDashboard;
                  return <TabIcon className="h-4 w-4 text-white" />;
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
                    <span className="ml-1.5 text-xs hidden group-data-[state=active]:inline whitespace-nowrap">{tab.label}</span>
                  </GlassTabsTrigger>
                ))}
              </GlassTabsList>
            </div>
          </div>
        </div>
      </GlassTabs>
    </>
  );
}

export default HomeClient;
