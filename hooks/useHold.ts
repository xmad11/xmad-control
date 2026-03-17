/* ═══════════════════════════════════════════════════════════════════════════════
   USE HOLD - Ultra-lightweight hold gesture detection hook
   Zero re-renders, pointer events only
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { useCallback, useRef } from "react"

interface UseHoldOptions {
  /** Callback when hold threshold is reached */
  onHold: () => void
  /** Hold duration in ms (default: from tokens) */
  duration?: number
  /** Cancel if pointer moves more than this distance in px */
  cancelDistance?: number
  /** Called when hold is cancelled (moved too far or released early) */
  onCancel?: () => void
}

interface UseHoldReturn {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onTouchEnd: () => void
  onPointerMove: (e: React.PointerEvent) => void
}

export function useHold({
  onHold,
  duration = aiDockTokens.gesture.holdMs,
  cancelDistance = aiDockTokens.gesture.cancelDistancePx,
  onCancel,
}: UseHoldOptions): UseHoldReturn {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const triggeredRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    startPosRef.current = null
  }, [])

  const start = useCallback(
    (e: React.PointerEvent) => {
      // Store start position for cancel detection
      startPosRef.current = { x: e.clientX, y: e.clientY }
      triggeredRef.current = false

      timerRef.current = setTimeout(() => {
        if (!triggeredRef.current) {
          triggeredRef.current = true
          onHold()
        }
      }, duration)
    },
    [onHold, duration]
  )

  const stop = useCallback(() => {
    if (timerRef.current && !triggeredRef.current) {
      // Released before hold completed
      onCancel?.()
    }
    clearTimer()
  }, [clearTimer, onCancel])

  const move = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current || triggeredRef.current) return

      const dx = e.clientX - startPosRef.current.x
      const dy = e.clientY - startPosRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > cancelDistance) {
        // Moved too far, cancel hold
        clearTimer()
        onCancel?.()
      }
    },
    [cancelDistance, clearTimer, onCancel]
  )

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onTouchEnd: stop,
    onPointerMove: move,
  }
}

export default useHold
