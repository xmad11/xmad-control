"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// RAM ALERT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface RamAlert {
  id: string
  timestamp: string
  level: "warning" | "critical"
  message: string
  memoryMB: number
  threshold: number
}

export interface RamAlertOptions {
  /** Warning threshold in MB (default: 600) */
  warningThreshold?: number
  /** Critical threshold in MB (default: 700) */
  criticalThreshold?: number
  /** Check interval in ms (default: 10000) */
  checkInterval?: number
  /** Deduplication window in ms (default: 60000 = 1 minute) */
  dedupWindow?: number
  /** Max alerts to keep (default: 10) */
  maxAlerts?: number
  /** Enable/disable monitoring */
  enabled?: boolean
  /** Custom memory fetcher function */
  getMemoryUsage?: () => Promise<number | null>
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT MEMORY FETCHER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch memory usage from the system stats API
 * Returns memory in MB or null if failed
 */
async function defaultGetMemoryUsage(): Promise<number | null> {
  try {
    const response = await fetch("/api/xmad/system/stats")
    if (!response.ok) return null

    const data = await response.json()
    // Assuming the API returns memory.used in MB or percentage
    return data.memory?.used ?? null
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// useRamAlert HOOK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for RAM monitoring with alert deduplication
 *
 * @param options - Configuration options
 * @returns Alert state and control functions
 *
 * @example
 * const { alerts, currentMemory, isWarning, isCritical } = useRamAlert({
 *   warningThreshold: 600,
 *   criticalThreshold: 700,
 * })
 */
export function useRamAlert(options: RamAlertOptions = {}) {
  const {
    warningThreshold = 600,
    criticalThreshold = 700,
    checkInterval = 10000,
    dedupWindow = 60000,
    maxAlerts = 10,
    enabled = true,
    getMemoryUsage = defaultGetMemoryUsage,
  } = options

  const [alerts, setAlerts] = useState<RamAlert[]>([])
  const [currentMemory, setCurrentMemory] = useState<number | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Track last alert time for deduplication
  const lastAlertRef = useRef<{ warning: number; critical: number }>({
    warning: 0,
    critical: 0,
  })

  // Generate unique ID for alerts
  const generateId = useCallback(() => {
    return `ram-alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }, [])

  // Add alert with deduplication
  const addAlert = useCallback(
    (level: "warning" | "critical", memoryMB: number) => {
      const now = Date.now()
      const lastAlert = lastAlertRef.current[level]

      // Deduplicate: skip if we already alerted within the window
      if (now - lastAlert < dedupWindow) {
        return
      }

      // Update last alert time
      lastAlertRef.current[level] = now

      const alert: RamAlert = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        level,
        message:
          level === "critical"
            ? `Critical: Memory usage at ${memoryMB}MB (threshold: ${criticalThreshold}MB)`
            : `Warning: Memory usage at ${memoryMB}MB (threshold: ${warningThreshold}MB)`,
        memoryMB,
        threshold: level === "critical" ? criticalThreshold : warningThreshold,
      }

      setAlerts((prev) => [alert, ...prev].slice(0, maxAlerts))
    },
    [criticalThreshold, warningThreshold, dedupWindow, maxAlerts, generateId]
  )

  // Check memory and trigger alerts
  const checkMemory = useCallback(async () => {
    const memoryMB = await getMemoryUsage()
    setCurrentMemory(memoryMB)

    if (memoryMB === null) return

    if (memoryMB >= criticalThreshold) {
      addAlert("critical", memoryMB)
    } else if (memoryMB >= warningThreshold) {
      addAlert("warning", memoryMB)
    }
  }, [getMemoryUsage, criticalThreshold, warningThreshold, addAlert])

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([])
    lastAlertRef.current = { warning: 0, critical: 0 }
  }, [])

  // Start monitoring
  useEffect(() => {
    if (!enabled) {
      setIsMonitoring(false)
      return
    }

    setIsMonitoring(true)

    // Initial check
    checkMemory()

    // Set up interval
    const interval = setInterval(checkMemory, checkInterval)

    return () => {
      clearInterval(interval)
      setIsMonitoring(false)
    }
  }, [enabled, checkMemory, checkInterval])

  // Derived state
  const isWarning = currentMemory !== null && currentMemory >= warningThreshold
  const isCritical = currentMemory !== null && currentMemory >= criticalThreshold
  const hasAlerts = alerts.length > 0
  const latestAlert = alerts[0] ?? null

  return {
    // State
    alerts,
    currentMemory,
    isWarning,
    isCritical,
    hasAlerts,
    latestAlert,
    isMonitoring,

    // Actions
    clearAlerts,
    checkMemory, // Manual check

    // Thresholds (for UI display)
    warningThreshold,
    criticalThreshold,
  }
}

export default useRamAlert
