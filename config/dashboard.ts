/* ═══════════════════════════════════════════════════════════════════════════════
   DASHBOARD CONFIGURATION - Central tokens and constants
   All configurable values in one place - no magic numbers

   ⚠️ TIMING: All motion/animation timing is sourced from aiDockTokens.motion
   See: design/tokens/ai-dock.tokens.ts for SSOT
   ═══════════════════════════════════════════════════════════════════════════════ */

import { aiDockMotion } from "@/design/tokens/ai-dock.tokens"

// ═══════════════════════════════════════════════════════════════════════════════
// TIMING CONSTANTS - Re-exported from SSOT (aiDockMotion)
// ═══════════════════════════════════════════════════════════════════════════════

export const TIMING = {
  /** Delay before tabs collapse after interaction (ms) - from SSOT */
  TAB_COLLAPSE: aiDockMotion.tabCollapseDelay,

  /** Polling interval for live stats (ms) */
  STATS_POLL_INTERVAL: 5000,

  /** Animation duration for tab transitions (ms) - from SSOT */
  TAB_TRANSITION: aiDockMotion.tabTransition,

  /** Animation duration for widget appearance (ms) - from SSOT */
  WIDGET_APPEAR: aiDockMotion.widgetAppear,

  /** Duration for gauge animation (ms) - from SSOT */
  GAUGE_ANIMATION: aiDockMotion.gaugeAnimation,

  /** Stagger delay for multiple widgets (ms) - from SSOT */
  WIDGET_STAGGER: aiDockMotion.widgetStagger,

  /** Chat animation duration (ms) - from SSOT */
  CHAT_ANIMATION: aiDockMotion.chatAnimation,

  /** Sheet animation duration (ms) - from SSOT */
  SHEET_ANIMATION: aiDockMotion.sheetEnter,
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES (fallback when API unavailable)
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULTS = {
  STATS: {
    CPU: 45,
    MEMORY: { used: 4.2, total: 8, percentage: 52 },
    DISK: { used: 180, total: 500, percentage: 36 },
    UPTIME: 86400,
  },

  SERVICES: {
    OPENCLAW: { running: true, pid: 12345, memoryUsage: 256 },
    TAILSCALE: { connected: true, ip: "100.64.0.1" },
  },

  HEALTH: 98,
  LATENCY: 12,
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const WIDGET_PRESETS = {
  /** Mini stat widgets for overview tab */
  MINI_STATS: [
    { icon: "Activity", label: "Requests/min", value: "1.2K", color: "cyan" as const },
    { icon: "Database", label: "Data In", value: "45 MB", color: "green" as const },
    { icon: "Cpu", label: "Data Out", value: "128 MB", color: "purple" as const },
    { icon: "Server", label: "Latency", value: `${DEFAULTS.LATENCY}ms`, color: "amber" as const },
  ],

  /** System forecast data */
  FORECAST: [
    { label: "1h", high: 52, low: 38 },
    { label: "2h", high: 48, low: 35 },
    { label: "3h", high: 55, low: 40 },
  ],

  /** Stock-style stat cards */
  STOCK_CARDS: [
    { symbol: "CPU", name: "Processor Load", color: "cyan" as const },
    { symbol: "RAM", name: "Memory Usage", color: "purple" as const },
    { symbol: "DISK", name: "Storage Used", color: "green" as const },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKGROUND = {
  GRADIENT: "from-slate-900 via-blue-950 to-slate-900",
  BLOBS: [
    {
      position: "top-1/4 left-1/4",
      size: "w-96 h-96",
      color: "bg-blue-500/20",
      blur: "blur-3xl",
    },
    {
      position: "bottom-1/3 right-1/4",
      size: "w-80 h-80",
      color: "bg-purple-500/20",
      blur: "blur-3xl",
    },
    {
      position: "top-1/2 left-1/2",
      size: "w-72 h-72",
      color: "bg-cyan-500/15",
      blur: "blur-3xl",
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const TABS = [
  { value: "memory", icon: "Brain", label: "Memory" },
  { value: "automation", icon: "Zap", label: "Automation" },
  { value: "overview", icon: "LayoutDashboard", label: "Overview" },
  { value: "screen", icon: "Monitor", label: "Screen" },
  { value: "backups", icon: "HardDrive", label: "Backups" },
  { value: "settings", icon: "Settings", label: "Settings" },
]

export const DEFAULT_TAB = "overview"

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export type SheetPosition = "up" | "down" | "left" | "right" | "center"

export const SHEET = {
  /** Animation duration for sheet open/close */
  ANIMATION_DURATION: 300,

  /** Maximum sheet width */
  MAX_WIDTH: "md", // tailwind md = 448px

  /** Maximum sheet height */
  MAX_HEIGHT: "lg", // tailwind lg = 75%

  /** Close on click outside */
  CLOSE_ON_OUTSIDE_CLICK: true,

  /** Close on escape key */
  CLOSE_ON_ESCAPE: true,
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET LAYOUT PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const WIDGET_LAYOUT = {
  /** Items per view for carousel at different breakpoints */
  CAROUSEL_ITEMS: {
    base: 1,
    sm: 1,
    lg: 2,
    xl: 3,
    "2xl": 4,
  },

  /** Gap size between widgets */
  GAP: "sm" as const, // tailwind sm = 1rem

  /** Padding for content area */
  CONTENT_PADDING: "px-3 py-4 md:px-4 lg:px-6",

  /** Bottom padding for tab bar */
  BOTTOM_PADDING: "pb-28",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY TAB WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

export const MEMORY_WIDGETS = {
  /** Sample memory files */
  FILES: [
    { name: "agent_memory.json", size: "24 KB", modified: "2 min ago" },
    { name: "conversation_history.jsonl", size: "156 KB", modified: "5 min ago" },
    { name: "user_preferences.json", size: "2 KB", modified: "1 hour ago" },
    { name: "session_state.json", size: "8 KB", modified: "2 hours ago" },
  ],

  /** Memory categories */
  CATEGORIES: [
    { label: "Short-term", value: 42, max: 100, unit: "MB", color: "blue" as const },
    { label: "Long-term", value: 156, max: 500, unit: "MB", color: "purple" as const },
    { label: "Cache", value: 28, max: 50, unit: "MB", color: "cyan" as const },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATION TAB WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

export const AUTOMATION_WIDGETS = {
  /** Sample automation tasks */
  TASKS: [
    { id: "1", name: "Database Backup", status: "completed" as const, progress: 100 },
    { id: "2", name: "Log Rotation", status: "running" as const, progress: 67 },
    { id: "3", name: "Cache Cleanup", status: "pending" as const, progress: 0 },
    { id: "4", name: "Health Check", status: "paused" as const, progress: 23 },
  ],

  /** Automation stats */
  STATS: [
    { label: "Active Tasks", value: "3", color: "green" as const },
    { label: "Completed Today", value: "12", color: "cyan" as const },
    { label: "Failed", value: "0", color: "red" as const },
    { label: "Total Runtime", value: "4h 32m", color: "purple" as const },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN TAB WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

export const SCREEN_WIDGETS = {
  /** VNC connection presets */
  CONNECTIONS: [
    { name: "Localhost", host: "127.0.0.1", port: 5900, status: "online" },
    { name: "Server-01", host: "192.168.1.100", port: 5901, status: "offline" },
  ],

  /** Screen resolutions */
  RESOLUTIONS: [
    { label: "1920x1080", value: "1080p" },
    { label: "2560x1440", value: "1440p" },
    { label: "3840x2160", value: "4K" },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUPS TAB WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKUP_WIDGETS = {
  /** Recent backups */
  RECENT: [
    { name: "daily-2026-03-16", size: "2.4 GB", date: "Today, 3:00 AM", status: "completed" },
    { name: "daily-2026-03-15", size: "2.3 GB", date: "Yesterday, 3:00 AM", status: "completed" },
    { name: "weekly-2026-03-14", size: "12.1 GB", date: "Mar 14, 3:00 AM", status: "completed" },
  ],

  /** Backup stats */
  STATS: [
    { label: "Total Backups", value: "24", color: "cyan" as const },
    { label: "Storage Used", value: "48 GB", color: "purple" as const },
    { label: "Last Success", value: "2h ago", color: "green" as const },
    { label: "Retention", value: "30 days", color: "amber" as const },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

export const SETTINGS_WIDGETS = {
  /** System status servers */
  SERVERS: [
    {
      icon: "Server",
      label: "API Server",
      status: "online" as const,
      detail: "Port 9870",
      color: "cyan" as const,
    },
    {
      icon: "Database",
      label: "Database",
      status: "online" as const,
      detail: "Connected",
      color: "purple" as const,
    },
    {
      icon: "Shield",
      label: "Auth",
      status: "online" as const,
      detail: "JWT Active",
      color: "green" as const,
    },
    {
      icon: "Wifi",
      label: "Network",
      status: "online" as const,
      detail: "VPN Active",
      color: "blue" as const,
    },
  ],

  /** Mini stats for settings */
  MINI_STATS: [
    { icon: "Lock", label: "SSL Status", value: "Valid", color: "green" as const },
    { icon: "Terminal", label: "SSH Port", value: "22", color: "cyan" as const },
    { icon: "Globe", label: "Domain", value: "Active", color: "purple" as const },
    { icon: "RefreshCw", label: "Auto-Update", value: "On", color: "amber" as const },
  ],

  /** Quick action cards */
  QUICK_ACTIONS: [
    { icon: "Settings", label: "General", description: "System settings", color: "cyan" as const },
    { icon: "Shield", label: "Security", description: "Auth & keys", color: "purple" as const },
    { icon: "Globe", label: "Network", description: "VPN & proxy", color: "blue" as const },
    { icon: "Database", label: "Storage", description: "Backup config", color: "green" as const },
  ],

  /** System limits */
  LIMITS: [
    { label: "API Rate", value: 750, max: 1000, unit: "/min", color: "cyan" as const },
    { label: "Storage", value: 42, max: 100, unit: "%", color: "purple" as const },
    { label: "Memory", value: 48, max: 100, unit: "%", color: "blue" as const },
  ],

  /** Performance gauges */
  PERFORMANCE: [
    { label: "CPU", value: 67, unit: "%", color: "cyan" as const },
    { label: "RAM", value: 48, unit: "%", color: "purple" as const },
    { label: "Disk", value: 46, unit: "%", color: "blue" as const },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORLD CLOCKS (for Settings tab)
// ═══════════════════════════════════════════════════════════════════════════════

export const WORLD_CLOCKS = [
  { city: "NYC", timezone: "America/New_York", isDay: true },
  { city: "London", timezone: "Europe/London", isDay: true },
  { city: "Tokyo", timezone: "Asia/Tokyo", isDay: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK DATA (with proper change values - not random)
// ═══════════════════════════════════════════════════════════════════════════════

export const STOCK_DATA = [
  {
    symbol: "CPU",
    name: "Processor Load",
    price: 67.45,
    change: 2.34,
    changePercent: 3.61,
    trend: "up" as const,
  },
  {
    symbol: "RAM",
    name: "Memory Usage",
    price: 48.2,
    change: -1.5,
    changePercent: -3.02,
    trend: "down" as const,
  },
  {
    symbol: "DISK",
    name: "Storage Used",
    price: 46.8,
    change: 0.3,
    changePercent: 0.64,
    trend: "up" as const,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION SYSTEM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const NOTIFICATION = {
  /** Default auto-dismiss duration (ms) */
  DEFAULT_DURATION: 5000,

  /** Maximum notifications visible at once */
  MAX_NOTIFICATIONS: 5,

  /** Default position for notifications */
  DEFAULT_POSITION: "top-right" as const,

  /** Animation duration for enter/exit (ms) */
  ANIMATION_DURATION: 300,

  /** Progress bar update interval (ms) */
  PROGRESS_UPDATE_INTERVAL: 50,
}
