"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { SystemStats, OpenClawStatus, TailscaleStatus, AutomationTask, BackupInfo } from "@/lib/xmad-api"

// ═══════════════════════════════════════════════════════════════════════════════
// SSE EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SSEEvent {
  type: "stats" | "openclaw" | "tailscale" | "automation" | "backup" | "alert" | "ping"
  timestamp: string
  data: unknown
}

export interface SSEStatsEvent extends SSEEvent {
  type: "stats"
  data: SystemStats
}

export interface SSEOpenClawEvent extends SSEEvent {
  type: "openclaw"
  data: OpenClawStatus
}

export interface SSETailscaleEvent extends SSEEvent {
  type: "tailscale"
  data: TailscaleStatus
}

export interface SSEAutomationEvent extends SSEEvent {
  type: "automation"
  data: { queue: AutomationTask[]; history: AutomationTask[] }
}

export interface SSEBackupEvent extends SSEEvent {
  type: "backup"
  data: BackupInfo[]
}

export interface SSEAlertEvent extends SSEEvent {
  type: "alert"
  data: { level: "info" | "warning" | "error"; message: string }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SSE STATE TYPE
// ═══════════════════════════════════════════════════════════════════════════════

export interface SSEState {
  connected: boolean
  error: string | null
  lastUpdate: string | null
  stats: SystemStats | null
  openclaw: OpenClawStatus | null
  tailscale: TailscaleStatus | null
  automation: { queue: AutomationTask[]; history: AutomationTask[] } | null
  backups: BackupInfo[] | null
  alerts: Array<{ level: "info" | "warning" | "error"; message: string; timestamp: string }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// SSE HOOK OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface UseSSEOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  enabled?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// useSSE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for SSE (Server-Sent Events) connection to XMAD API
 *
 * @param options - Configuration options
 * @returns SSE state and control functions
 *
 * @example
 * const { connected, stats, openclaw, tailscale } = useSSE()
 */
export function useSSE(options: UseSSEOptions = {}) {
  const {
    url = "/api/xmad/events",
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
    enabled = true,
  } = options

  const [state, setState] = useState<SSEState>({
    connected: false,
    error: null,
    lastUpdate: null,
    stats: null,
    openclaw: null,
    tailscale: null,
    automation: null,
    backups: null,
    alerts: [],
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Process incoming SSE event
  const processEvent = useCallback((event: SSEEvent) => {
    setState((prev) => {
      const newState: SSEState = {
        ...prev,
        lastUpdate: event.timestamp,
      }

      switch (event.type) {
        case "stats":
          newState.stats = event.data as SystemStats
          break
        case "openclaw":
          newState.openclaw = event.data as OpenClawStatus
          break
        case "tailscale":
          newState.tailscale = event.data as TailscaleStatus
          break
        case "automation":
          newState.automation = event.data as { queue: AutomationTask[]; history: AutomationTask[] }
          break
        case "backup":
          newState.backups = event.data as BackupInfo[]
          break
        case "alert":
          const alertData = event.data as { level: "info" | "warning" | "error"; message: string }
          newState.alerts = [
            { ...alertData, timestamp: event.timestamp },
            ...prev.alerts.slice(0, 9), // Keep last 10 alerts
          ]
          break
        case "ping":
          // Just update timestamp, no data change
          break
      }

      return newState
    })
  }, [])

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setState((prev) => ({ ...prev, connected: true, error: null }))
      reconnectAttemptsRef.current = 0
    }

    eventSource.onerror = () => {
      eventSource.close()
      setState((prev) => ({ ...prev, connected: false }))

      // Attempt reconnection
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, reconnectInterval)
      } else {
        setState((prev) => ({
          ...prev,
          error: `Failed to reconnect after ${maxReconnectAttempts} attempts`,
        }))
      }
    }

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data)
        processEvent(data)
      } catch (e) {
        console.error("Failed to parse SSE event:", e)
      }
    }
  }, [url, reconnectInterval, maxReconnectAttempts, processEvent])

  // Disconnect from SSE endpoint
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setState((prev) => ({ ...prev, connected: false }))
  }, [])

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setState((prev) => ({ ...prev, alerts: [] }))
  }, [])

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    disconnect()
    connect()
  }, [connect, disconnect])

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    ...state,
    reconnect,
    disconnect,
    clearAlerts,
  }
}

export default useSSE
