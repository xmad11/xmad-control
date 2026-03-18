/* ═══════════════════════════════════════════════════════════════════════════════
   SURFACE CONTROLLER HOOK - XMAD Dashboard (Hardened)
   Manages surface state and data fetching ONLY
   Tab expansion is handled by useAiDockController

   Performance features:
   - Request debounce
   - AbortController for fetch cancellation
   - Websocket future placeholder interface
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { DEFAULTS, TIMING } from "@/config/dashboard"
import { DEFAULT_SURFACE, TAB_CONFIG } from "@/config/surfaces"
import { usePageVisibility } from "@/hooks/usePageVisibility"
import type {
  ProcessInfo,
  ProcessesResponse,
  ServiceStatus,
  SurfaceId,
  SystemStats,
} from "@/types/surface.types"
import { Brain, HardDrive, LayoutDashboard, MessageSquare, Monitor, Zap } from "lucide-react"
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DATA CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface DashboardDataContextType {
  stats: SystemStats | null
  services: ServiceStatus | null
  processes: ProcessInfo[]
}

const DashboardDataContext = createContext<DashboardDataContextType>({
  stats: null,
  services: null,
  processes: [],
})

export function useDashboardData() {
  return useContext(DashboardDataContext)
}

export { DashboardDataContext }

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET FUTURE PLACEHOLDER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface WebSocketInterface {
  connect: () => void
  disconnect: () => void
  subscribe: (event: string, callback: (data: unknown) => void) => void
  unsubscribe: (event: string, callback: (data: unknown) => void) => void
}

// Placeholder for future WebSocket implementation
// When ready, replace polling with WebSocket connection
// biome-ignore lint/correctness/noUnusedVariables: placeholder for future WebSocket implementation
function _createWebSocketInterface(config: WebSocketConfig): WebSocketInterface {
  return {
    connect: () => {
      console.log(`[WebSocket] Placeholder - would connect to ${config.url}`)
    },
    disconnect: () => {
      console.log("[WebSocket] Placeholder - would disconnect")
    },
    subscribe: (event: string, _callback: (data: unknown) => void) => {
      console.log(`[WebSocket] Placeholder - subscribed to ${event}`)
    },
    unsubscribe: (event: string, _callback: (data: unknown) => void) => {
      console.log(`[WebSocket] Placeholder - unsubscribed from ${event}`)
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEBOUNCE UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

// biome-ignore lint/correctness/noUnusedVariables: utility function for future debouncing
function _debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Brain,
  Zap,
  Monitor,
  HardDrive,
  MessageSquare,
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE CONTROLLER HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useSurfaceController() {
  const [activeSurface, setActiveSurface] = useState<SurfaceId>(DEFAULT_SURFACE)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [services, setServices] = useState<ServiceStatus | null>(null)
  const [processes, setProcesses] = useState<ProcessInfo[]>([])

  // Page visibility - pause polling when tab is hidden
  const isVisible = usePageVisibility()

  // AbortController for cancelling pending requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounced fetch refs
  const lastFetchTimeRef = useRef<number>(0)
  const pendingFetchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch system stats from API with debounce
  const fetchStats = useCallback(async () => {
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetchTimeRef.current

    // Debounce: Skip if last fetch was less than 500ms ago
    if (timeSinceLastFetch < 500) {
      if (pendingFetchRef.current) {
        clearTimeout(pendingFetchRef.current)
      }
      pendingFetchRef.current = setTimeout(() => {
        fetchStats()
      }, 500 - timeSinceLastFetch)
      return
    }

    lastFetchTimeRef.current = now

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/xmad/system/stats", {
        signal: abortControllerRef.current.signal,
      })
      if (response.ok) {
        const data = await response.json()
        // Use startTransition to prevent polling from blocking UI animations
        startTransition(() => {
          setStats(data)
        })
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      // Use fallback data if API not available
      startTransition(() => {
        setStats({
          cpu: DEFAULTS.STATS.CPU,
          memory: DEFAULTS.STATS.MEMORY,
          disk: DEFAULTS.STATS.DISK,
          uptime: DEFAULTS.STATS.UPTIME,
        })
      })
    }
  }, [])

  // Fetch service status from API with debounce
  const fetchServices = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/xmad/services", {
        signal: abortControllerRef.current.signal,
      })
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      // Use fallback data if API not available
      setServices({
        openclaw: {
          running: DEFAULTS.SERVICES.OPENCLAW.running,
          pid: DEFAULTS.SERVICES.OPENCLAW.pid,
          memoryUsage: DEFAULTS.SERVICES.OPENCLAW.memoryUsage,
        },
        tailscale: {
          connected: DEFAULTS.SERVICES.TAILSCALE.connected,
          ip: DEFAULTS.SERVICES.TAILSCALE.ip,
        },
      })
    }
  }, [])

  // Fetch processes from API
  const fetchProcesses = useCallback(async () => {
    try {
      const response = await fetch("/api/xmad/system/processes")
      if (response.ok) {
        const data: ProcessesResponse = await response.json()
        setProcesses(data.processes)
      }
    } catch {
      // Use empty fallback if API not available
      setProcesses([])
    }
  }, [])

  // Initial data fetch and polling setup with visibility awareness
  useEffect(() => {
    // Only fetch and poll when page is visible
    if (!isVisible) return

    // Fetch initial data when becoming visible
    fetchStats()
    fetchServices()
    fetchProcesses()

    // Set up polling for live stats (only when visible)
    const interval = setInterval(fetchStats, TIMING.STATS_POLL_INTERVAL)

    return () => {
      clearInterval(interval)
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      // Clear any pending debounced fetches
      if (pendingFetchRef.current) {
        clearTimeout(pendingFetchRef.current)
      }
    }
  }, [fetchStats, fetchServices, fetchProcesses, isVisible])

  // Handle surface change
  const handleSurfaceChange = useCallback((value: string) => {
    setActiveSurface(value as SurfaceId)
  }, [])

  // Get tabs with resolved icons - memoized to prevent tab bar re-renders
  const tabs = useMemo(
    () =>
      TAB_CONFIG.map((tab) => ({
        value: tab.value,
        icon: iconMap[tab.icon] || LayoutDashboard,
        label: tab.label,
      })),
    [] // iconMap and TAB_CONFIG are static imports
  )

  return {
    activeSurface,
    handleSurfaceChange,
    tabs,
    stats,
    services,
    processes,
    DashboardDataContext,
  }
}
