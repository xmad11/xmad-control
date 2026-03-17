/* ═══════════════════════════════════════════════════════════════════════════════
   SSE CLIENT — XMAD Dashboard (Hardened)
   Server-Sent Events client hook for live system stats

   Performance features:
   - AbortController for proper cancellation
   - Visibility pause when tab hidden
   - Exponential backoff on retry
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SSEMessage<T = unknown> {
  type: string
  data: T
  timestamp?: number
}

export interface SSEOptions {
  /** Initial reconnection delay in ms (default: 1000) */
  reconnectDelay?: number

  /** Maximum reconnection delay in ms (default: 30000) */
  maxReconnectDelay?: number

  /** Maximum reconnection attempts (default: 10) */
  maxReconnectAttempts?: number

  /** Enable auto-reconnect (default: true) */
  autoReconnect?: boolean

  /** Pause when tab is hidden (default: true) */
  pauseOnHidden?: boolean

  /** Callback when connection opens */
  onOpen?: () => void

  /** Callback when connection closes */
  onClose?: () => void

  /** Callback when error occurs */
  onError?: (error: Error) => void
}

export interface SSEState<T> {
  data: T | null
  isConnected: boolean
  error: Error | null
  lastUpdate: number | null
  isPaused: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useSSE<T = unknown>(
  endpoint: string,
  options: SSEOptions = {}
): SSEState<T> & {
  reconnect: () => void
  disconnect: () => void
  pause: () => void
  resume: () => void
} {
  const {
    reconnectDelay = 1000,
    maxReconnectDelay = 30000,
    maxReconnectAttempts = 10,
    autoReconnect = true,
    pauseOnHidden = true,
    onOpen,
    onClose,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Refs for cleanup and state tracking
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentDelayRef = useRef(reconnectDelay)

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPONENTIAL BACKOFF
  // ═══════════════════════════════════════════════════════════════════════════════

  const getNextDelay = useCallback(() => {
    const delay = Math.min(
      currentDelayRef.current * 2 ** reconnectAttemptsRef.current,
      maxReconnectDelay
    )
    return delay
  }, [maxReconnectDelay])

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════

  const cleanup = useCallback(() => {
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Close EventSource
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setIsConnected(false)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONNECT
  // ═══════════════════════════════════════════════════════════════════════════════

  const connect = useCallback(() => {
    // Don't connect if paused
    if (isPaused) return

    // Clean up existing connection
    cleanup()

    // Create new AbortController for this connection
    abortControllerRef.current = new AbortController()

    try {
      const eventSource = new EventSource(endpoint)
      eventSourceRef.current = eventSource

      // Connection opened
      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        currentDelayRef.current = reconnectDelay
        onOpen?.()
      }

      // Message received
      eventSource.onmessage = (event) => {
        try {
          const parsed: SSEMessage<T> = JSON.parse(event.data)
          setData(parsed.data)
          setLastUpdate(Date.now())
          setError(null)
        } catch (parseError) {
          console.error("Failed to parse SSE message:", parseError)
          setError(parseError instanceof Error ? parseError : new Error("Parse error"))
        }
      }

      // Error occurred
      eventSource.onerror = () => {
        const err = new Error("SSE connection error")
        setError(err)
        setIsConnected(false)

        onError?.(err)

        // Auto-reconnect with exponential backoff
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          const delay = getNextDelay()

          reconnectTimeoutRef.current = setTimeout(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              connect()
            }
          }, delay)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect to SSE")
      setError(error)
      setIsConnected(false)
      onError?.(error)
    }
  }, [
    endpoint,
    autoReconnect,
    maxReconnectAttempts,
    reconnectDelay,
    onOpen,
    onError,
    cleanup,
    isPaused,
    getNextDelay,
  ])

  // ═══════════════════════════════════════════════════════════════════════════════
  // VISIBILITY HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!pauseOnHidden) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause when tab is hidden
        cleanup()
        setIsPaused(true)
      } else {
        // Resume when tab becomes visible
        setIsPaused(false)
        connect()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pauseOnHidden, cleanup, connect])

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIAL CONNECTION & CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    connect()

    return () => {
      cleanup()
    }
  }, [connect, cleanup])

  // ═══════════════════════════════════════════════════════════════════════════════
  // MANUAL CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════════

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    currentDelayRef.current = reconnectDelay
    setIsPaused(false)
    connect()
  }, [connect, reconnectDelay])

  const disconnect = useCallback(() => {
    cleanup()
    onClose?.()
  }, [cleanup, onClose])

  const pause = useCallback(() => {
    cleanup()
    setIsPaused(true)
  }, [cleanup])

  const resume = useCallback(() => {
    setIsPaused(false)
    connect()
  }, [connect])

  return {
    data,
    isConnected,
    error,
    lastUpdate,
    isPaused,
    reconnect,
    disconnect,
    pause,
    resume,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE HOOK FOR SYSTEM STATS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SystemStats {
  cpu: number
  memory: { used: number; total: number; percentage: number }
  disk: { used: number; total: number; percentage: number }
  uptime: number
}

export function useSystemStats() {
  return useSSE<SystemStats>("/api/xmad/events", {
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    maxReconnectAttempts: 10,
    autoReconnect: true,
    pauseOnHidden: true,
  })
}
