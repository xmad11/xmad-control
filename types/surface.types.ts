/* ═══════════════════════════════════════════════════════════════════════════════
   SURFACE TYPES — XMAD Dashboard Surface Runtime
   Type definitions for surface-based dashboard architecture
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { LucideIcon } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE IDENTIFIERS
// ═══════════════════════════════════════════════════════════════════════════════

export type SurfaceId =
  | "overview"
  | "memory"
  | "automation"
  | "screen"
  | "backups"
  | "settings"
  | "chat"
  | "terminal"
  | "showcase"

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE DIRECTIONS (for positioning)
// ═══════════════════════════════════════════════════════════════════════════════

export type SurfaceDirection = "center" | "up" | "down" | "left" | "right" | "fullscreen"

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

export interface SurfaceDefinition {
  /** Unique identifier for the surface */
  id: SurfaceId

  /** Position direction for the surface */
  direction: SurfaceDirection

  /** Icon component for navigation */
  icon: LucideIcon

  /** Display label */
  label: string

  /** Lazy import function for the surface component */
  lazy: () => Promise<{ default: React.ComponentType }>

  /** Z-index for stacking order */
  zIndex: number

  /** Default route path (optional, for deep linking) */
  path?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface SurfaceState {
  /** Currently active surface */
  activeSurface: SurfaceId | null

  /** Stack of opened surfaces (for navigation history) */
  surfaceStack: SurfaceId[]

  /** Whether a surface is currently open */
  isOpen: (id: SurfaceId) => boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE CONTROLLER ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SurfaceControllerActions {
  /** Open a surface (adds to stack) */
  openSurface: (id: SurfaceId) => void

  /** Close a surface (removes from stack) */
  closeSurface: (id: SurfaceId) => void

  /** Close all surfaces */
  closeAll: () => void

  /** Navigate to a specific surface (replaces stack) */
  navigateTo: (id: SurfaceId) => void

  /** Go back in surface stack */
  goBack: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE VIEWPORT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SurfaceViewportProps {
  /** Optional class name for styling */
  className?: string

  /** Optional fallback component when no surface is active */
  fallback?: React.ComponentType
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE CONFIG (for tab navigation)
// ═══════════════════════════════════════════════════════════════════════════════

export interface SurfaceConfig {
  /** Tab value for navigation */
  value: string

  /** Icon name (matches lucide-react) */
  icon: string

  /** Display label */
  label: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVE SURFACE (for stack tracking)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ActiveSurface {
  id: SurfaceId
  timestamp: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DATA TYPES (for overview surface)
// ═══════════════════════════════════════════════════════════════════════════════

export interface SystemStats {
  cpu: number
  memory: { used: number; total: number; percentage: number }
  disk: { used: number; total: number; percentage: number }
  uptime: number
}

export interface ServiceStatus {
  openclaw: { running: boolean; pid?: number; memoryUsage?: number }
  tailscale: { connected: boolean; ip?: string }
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number // MB
  command: string
}

export interface ProcessesResponse {
  processes: ProcessInfo[]
}
