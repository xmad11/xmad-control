/* ═══════════════════════════════════════════════════════════════════════════════
   SURFACE CONFIGURATION — XMAD Dashboard
   Surface registry and configuration for the dashboard runtime
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { SurfaceConfig, SurfaceDefinition, SurfaceId } from "@/types/surface.types"
import {
  Brain,
  HardDrive,
  LayoutDashboard,
  MessageSquare,
  Monitor,
  Settings,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const SURFACE_REGISTRY: Record<SurfaceId, SurfaceDefinition> = {
  overview: {
    id: "overview",
    direction: "center",
    icon: LayoutDashboard,
    label: "Overview",
    lazy: () => import("@/surfaces/overview.surface"),
    zIndex: 10,
    path: "/dashboard",
  },
  memory: {
    id: "memory",
    direction: "center",
    icon: Brain,
    label: "Memory",
    lazy: () => import("@/surfaces/memory.surface"),
    zIndex: 10,
    path: "/dashboard/memory",
  },
  automation: {
    id: "automation",
    direction: "center",
    icon: Zap,
    label: "Automation",
    lazy: () => import("@/surfaces/automation.surface"),
    zIndex: 10,
    path: "/dashboard/automation",
  },
  settings: {
    id: "settings",
    direction: "center",
    icon: Settings,
    label: "Settings",
    lazy: () => import("@/surfaces/settings.surface"),
    zIndex: 10,
    path: "/dashboard/settings",
  },
  screen: {
    id: "screen",
    direction: "fullscreen",
    icon: Monitor,
    label: "Screen",
    lazy: () => import("@/surfaces/screen.surface"),
    zIndex: 50,
    path: "/dashboard/screen",
  },
  backups: {
    id: "backups",
    direction: "center",
    icon: HardDrive,
    label: "Backups",
    lazy: () => import("@/surfaces/backups.surface"),
    zIndex: 10,
    path: "/dashboard/backups",
  },
  chat: {
    id: "chat",
    direction: "right",
    icon: MessageSquare,
    label: "Chat",
    lazy: () => import("@/surfaces/chat.surface"),
    zIndex: 100,
    path: "/dashboard/chat",
  },
  terminal: {
    id: "terminal",
    direction: "fullscreen",
    icon: Terminal,
    label: "Terminal",
    lazy: () => import("@/surfaces/terminal.surface"),
    zIndex: 50,
    path: "/dashboard/terminal",
  },
  showcase: {
    id: "showcase",
    direction: "center",
    icon: Sparkles,
    label: "Showcase",
    lazy: () => import("@/surfaces/showcase.surface"),
    zIndex: 10,
    path: "/dashboard/showcase",
  },
  tenants: {
    id: "tenants",
    direction: "center",
    icon: Users,
    label: "Tenants",
    lazy: () => import("@/surfaces/tenants.surface"),
    zIndex: 10,
    path: "/dashboard/tenants",
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB CONFIGURATION (for navigation)
// ═══════════════════════════════════════════════════════════════════════════════

export const TAB_CONFIG: SurfaceConfig[] = [
  { value: "memory", icon: "Brain", label: "Memory" },
  { value: "automation", icon: "Zap", label: "Automation" },
  { value: "overview", icon: "LayoutDashboard", label: "Overview" },
  { value: "screen", icon: "Monitor", label: "Screen" },
  { value: "backups", icon: "HardDrive", label: "Backups" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SURFACE
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SURFACE: SurfaceId = "overview"

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE Z-INDEX LAYERS
// ═══════════════════════════════════════════════════════════════════════════════

export const SURFACE_Z_INDEX = {
  background: 0,
  content: 10,
  navigation: 20,
  overlay: 50,
  modal: 100,
  toast: 200,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get surface definition by ID
 */
export function getSurface(id: SurfaceId): SurfaceDefinition | undefined {
  return SURFACE_REGISTRY[id]
}

/**
 * Get surface config for tab navigation
 */
export function getTabConfig(value: string): SurfaceConfig | undefined {
  return TAB_CONFIG.find((tab) => tab.value === value)
}

/**
 * Check if a surface ID exists in registry
 */
export function isValidSurface(id: string): id is SurfaceId {
  return id in SURFACE_REGISTRY
}
