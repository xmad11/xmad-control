/* ═══════════════════════════════════════════════════════════════════════════════
   SSE CLIENT — XMAD Dashboard Real-time Streaming
   Server-Sent Events client hook for live system stats
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SSEMessage<T = unknown> {
  type: string
  data: T
  timestamp?: number
}

export interface SSEOptions {
  /** Reconnection delay in ms (default: 3000) */
  reconnectDelay?: number

  /** Maximum reconnection attempts (default: Infinity) */
  maxReconnectAttempts?: number

  /** Enable auto-reconnect (default: true) */
  autoReconnect?: boolean

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
} {
  const {
    reconnectDelay = 3000,
    maxReconnectAttempts = Infinity,
    autoReconnect = true,
    onOpen,
    onClose,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
  }, [])

  // Connect function
  const connect = useCallback(() => {
    // Clean up existing connection
    cleanup()

    try {
      const eventSource = new EventSource(endpoint)

      eventSourceRef.current = eventSource

      // Connection opened
      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
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
      eventSource.onerror = (eventError) => {
        const err = new Error(eventError instanceof Event ? eventError.type : "SSE error")
        setError(err)
        setIsConnected(false)

        onError?.(err)

        // Auto-reconnect if enabled
        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect to SSE")
      setError(error)
      setIsConnected(false)
      onError?.(error)
    }
  }, [endpoint, autoReconnect, maxReconnectAttempts, reconnectDelay, onOpen, onError, cleanup])

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect])

  // Manual disconnect
  const disconnect = useCallback(() => {
    cleanup()
    onClose?.()
  }, [cleanup, onClose])

  // Initial connection
  useEffect(() => {
    connect()

    return () => {
      cleanup()
    }
  }, [connect, cleanup])

  return {
    data,
    isConnected,
    error,
    lastUpdate,
    reconnect,
    disconnect,
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
    reconnectDelay: 5000,
    maxReconnectAttempts: Infinity,
    autoReconnect: true,
  })
}
