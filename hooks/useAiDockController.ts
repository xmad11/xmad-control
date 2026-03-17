/* ═══════════════════════════════════════════════════════════════════════════════
   USE AI DOCK CONTROLLER - State machine for AI dock interactions
   Single source of truth for dock state AND tab expansion
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { TIMING } from "@/config/dashboard"
import { type AiDockState, aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { useCallback, useEffect, useRef, useState } from "react"

interface UseAiDockControllerOptions {
  /** Callback when voice should start */
  onVoiceStart?: () => void
  /** Callback when voice should stop */
  onVoiceStop?: () => void
}

interface UseAiDockControllerReturn {
  // State
  dockState: AiDockState
  tabsExpanded: boolean
  isSheetOpen: boolean
  isHolding: boolean
  showIndicator: boolean

  // Actions
  openSheet: () => void
  closeSheet: () => void
  resetCollapseTimer: () => void

  // Hold handlers (spread onto element)
  holdHandlers: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerUp: () => void
    onPointerLeave: () => void
    onPointerMove: (e: React.PointerEvent) => void
  }

  // Keyboard handlers for accessibility
  keyboardHandlers: {
    onKeyDown: (e: React.KeyboardEvent) => void
    onKeyUp: (e: React.KeyboardEvent) => void
  }

  // ARIA props for accessibility
  ariaProps: {
    role: "button"
    tabIndex: number
    "aria-expanded": boolean
    "aria-label": string
    "aria-pressed": boolean
  }
}

export function useAiDockController({
  onVoiceStart,
  onVoiceStop,
}: UseAiDockControllerOptions = {}): UseAiDockControllerReturn {
  // Core state
  const [dockState, setDockState] = useState<AiDockState>("idle")
  const [tabsExpanded, setTabsExpanded] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)

  // Timers - all via useRef for stability
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const triggeredRef = useRef(false)
  const isInitialMount = useRef(true)

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
    }
  }, [])

  // Initial auto-collapse after mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      collapseTimerRef.current = setTimeout(() => {
        setTabsExpanded(false)
      }, TIMING.TAB_COLLAPSE)
    }
  }, [])

  // Reset collapse timer - keeps tabs expanded, then auto-collapses
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
    setTabsExpanded(true)
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)
  }, [])

  // Clear indicator after timeout
  const startIndicatorTimeout = useCallback(() => {
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
    indicatorTimerRef.current = setTimeout(() => {
      setShowIndicator(false)
      setDockState("idle")
    }, aiDockTokens.motion.indicatorTimeoutMs)
  }, [])

  // Hold gesture actions
  const startHold = useCallback(() => {
    setIsHolding(true)
    setDockState("holding")
    onVoiceStart?.()
  }, [onVoiceStart])

  const endHold = useCallback(() => {
    setIsHolding(false)
    setShowIndicator(true)
    setDockState("indicator")
    onVoiceStop?.()
    startIndicatorTimeout()
  }, [onVoiceStop, startIndicatorTimeout])

  // Sheet actions
  const openSheet = useCallback(() => {
    setIsSheetOpen(true)
    setDockState("sheet")
    setShowIndicator(false)
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
  }, [])

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false)
    setDockState("idle")
    setShowIndicator(false)
  }, [])

  // Clear hold timer helper
  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    startPosRef.current = null
  }, [])

  // Hold gesture handlers
  const holdHandlers = {
    onPointerDown: useCallback(
      (e: React.PointerEvent) => {
        startPosRef.current = { x: e.clientX, y: e.clientY }
        triggeredRef.current = false

        holdTimerRef.current = setTimeout(() => {
          if (!triggeredRef.current) {
            triggeredRef.current = true
            startHold()
          }
        }, aiDockTokens.gesture.holdMs)
      },
      [startHold]
    ),

    onPointerUp: useCallback(() => {
      if (isHolding) {
        endHold()
      }
      clearHoldTimer()
    }, [isHolding, endHold, clearHoldTimer]),

    onPointerLeave: useCallback(() => {
      if (isHolding) {
        endHold()
      }
      clearHoldTimer()
    }, [isHolding, endHold, clearHoldTimer]),

    onPointerMove: useCallback(
      (e: React.PointerEvent) => {
        if (!startPosRef.current || triggeredRef.current) return

        const dx = e.clientX - startPosRef.current.x
        const dy = e.clientY - startPosRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > aiDockTokens.gesture.cancelDistancePx) {
          clearHoldTimer()
          triggeredRef.current = true
        }
      },
      [clearHoldTimer]
    ),
  }

  // Keyboard handlers for accessibility (Enter/Space to trigger hold)
  const keyboardHandlers = {
    onKeyDown: useCallback(
      (e: React.KeyboardEvent) => {
        // Enter or Space starts hold
        if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
          e.preventDefault()
          if (!triggeredRef.current) {
            triggeredRef.current = true
            startHold()
          }
        }
        // Escape cancels hold
        if (e.key === "Escape" && isHolding) {
          e.preventDefault()
          endHold()
          clearHoldTimer()
        }
      },
      [startHold, endHold, clearHoldTimer, isHolding]
    ),

    onKeyUp: useCallback(
      (e: React.KeyboardEvent) => {
        // Enter or Space release ends hold
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (isHolding) {
            endHold()
          }
        }
      },
      [isHolding, endHold]
    ),
  }

  // ARIA props for accessibility
  const ariaProps = {
    role: "button" as const,
    tabIndex: 0,
    "aria-expanded": isSheetOpen,
    "aria-label": isHolding ? "Voice input active, release to send" : "Hold to speak or press Enter",
    "aria-pressed": isHolding,
  }

  return {
    dockState,
    tabsExpanded,
    isSheetOpen,
    isHolding,
    showIndicator,
    openSheet,
    closeSheet,
    resetCollapseTimer,
    holdHandlers,
    keyboardHandlers,
    ariaProps,
  }
}

export default useAiDockController
