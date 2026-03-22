/* ═══════════════════════════════════════════════════════════════════════════════
   USE AI DOCK CONTROLLER - State machine for AI dock interactions
   Single source of truth for dock state AND tab expansion

   Behavior:
   - Click → Expand tabs (if collapsed)
   - Hold (500ms) → Toggle voice mode ON/OFF
   - Voice mode auto-off after 30 seconds
   - Toast messages for voice state changes
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { TIMING } from "@/config/dashboard"
import { type AiDockState, aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { useCallback, useEffect, useRef, useState } from "react"

/** Voice mode auto-off timeout (30 seconds) */
const VOICE_MODE_TIMEOUT_MS = 30_000

/** Hold duration to trigger voice toggle (500ms) */
const HOLD_TRIGGER_MS = 500

interface UseAiDockControllerOptions {
  /** Callback when voice mode starts */
  onVoiceStart?: () => void
  /** Callback when voice mode stops */
  onVoiceStop?: () => void
}

interface VoiceToast {
  show: boolean
  message: string
  type: "on" | "off"
}

interface UseAiDockControllerReturn {
  // State
  dockState: AiDockState
  tabsExpanded: boolean
  isSheetOpen: boolean
  voiceMode: boolean
  voiceToast: VoiceToast
  showIndicator: boolean
  isTransitioning: boolean

  // Actions
  openSheet: () => void
  closeSheet: () => void
  resetCollapseTimer: () => void
  expandTabs: () => void
  dismissToast: () => void

  // Hold handlers (spread onto element)
  holdHandlers: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
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
  const [voiceMode, setVoiceMode] = useState(false)
  const [voiceToast, setVoiceToast] = useState<VoiceToast>({ show: false, message: "", type: "on" })
  const [showIndicator, setShowIndicator] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Timers - all via useRef for stability
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const voiceModeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const triggeredRef = useRef(false)
  const isInitialMount = useRef(true)
  const isHoldingRef = useRef(false)

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (voiceModeTimerRef.current) clearTimeout(voiceModeTimerRef.current)
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
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

  // Show toast helper
  const showToast = useCallback((type: "on" | "off") => {
    const message = type === "on" ? "Voice mode ON" : "Voice mode OFF"
    setVoiceToast({ show: true, message, type })

    // Auto-dismiss toast after 2 seconds
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setVoiceToast((prev) => ({ ...prev, show: false }))
    }, 2000)
  }, [])

  // Dismiss toast manually
  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setVoiceToast((prev) => ({ ...prev, show: false }))
  }, [])

  // Toggle voice mode
  const toggleVoiceMode = useCallback(() => {
    setVoiceMode((prev) => {
      const newMode = !prev

      if (newMode) {
        // Voice mode ON
        setDockState("holding")
        setShowIndicator(true)
        showToast("on")
        onVoiceStart?.()

        // Auto-off after 30 seconds
        if (voiceModeTimerRef.current) clearTimeout(voiceModeTimerRef.current)
        voiceModeTimerRef.current = setTimeout(() => {
          setVoiceMode(false)
          setDockState("idle")
          setShowIndicator(false)
          showToast("off")
          onVoiceStop?.()
        }, VOICE_MODE_TIMEOUT_MS)
      } else {
        // Voice mode OFF
        setDockState("idle")
        setShowIndicator(false)
        showToast("off")
        onVoiceStop?.()

        if (voiceModeTimerRef.current) {
          clearTimeout(voiceModeTimerRef.current)
          voiceModeTimerRef.current = null
        }
      }

      return newMode
    })
  }, [onVoiceStart, onVoiceStop, showToast])

  // Reset collapse timer - keeps tabs expanded, then auto-collapses
  const resetCollapseTimer = useCallback(() => {
    // If voice mode is active, don't expand tabs (use expandTabs instead)
    if (voiceMode) return

    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
    setTabsExpanded(true)
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)
  }, [voiceMode])

  // Expand tabs - always works, even during voice mode
  const expandTabs = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
    setTabsExpanded(true)
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)
  }, [])

  // Sheet actions
  const openSheet = useCallback(() => {
    setIsTransitioning(true)
    setIsSheetOpen(true)
    setDockState("sheet")
    setShowIndicator(false)
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
    // Clear transition after animation completes (store ref for cleanup)
    indicatorTimerRef.current = setTimeout(
      () => setIsTransitioning(false),
      aiDockTokens.motion.sheetEnter
    )
  }, [])

  const closeSheet = useCallback(() => {
    setIsTransitioning(true)
    setIsSheetOpen(false)
    setDockState("idle")
    setShowIndicator(false)
    // Clear transition after animation completes (store ref for cleanup)
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
    indicatorTimerRef.current = setTimeout(
      () => setIsTransitioning(false),
      aiDockTokens.motion.sheetExit
    )
  }, [])

  // Clear hold timer helper
  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    startPosRef.current = null
    isHoldingRef.current = false
  }, [])

  // Hold gesture handlers - toggle voice mode on hold
  const holdHandlers = {
    onPointerDown: useCallback(
      (e: React.PointerEvent) => {
        // Guard: prevent gesture during sheet open or transitioning
        if (isSheetOpen || isTransitioning) return

        startPosRef.current = { x: e.clientX, y: e.clientY }
        triggeredRef.current = false
        isHoldingRef.current = true

        holdTimerRef.current = setTimeout(() => {
          if (!triggeredRef.current && isHoldingRef.current) {
            triggeredRef.current = true
            toggleVoiceMode()
          }
        }, HOLD_TRIGGER_MS)
      },
      [toggleVoiceMode, isSheetOpen, isTransitioning]
    ),

    onPointerUp: useCallback(() => {
      const wasHoldTriggered = triggeredRef.current
      isHoldingRef.current = false
      clearHoldTimer()

      // If hold was NOT triggered (short tap)
      if (!wasHoldTriggered) {
        if (voiceMode) {
          // During voice mode: expand tabs
          expandTabs()
        } else {
          // Normal mode: reset collapse timer
          resetCollapseTimer()
        }
      }
    }, [clearHoldTimer, resetCollapseTimer, expandTabs, voiceMode]),

    onPointerLeave: useCallback(() => {
      isHoldingRef.current = false
      clearHoldTimer()
    }, [clearHoldTimer]),

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

  // Keyboard handlers for accessibility
  const keyboardHandlers = {
    onKeyDown: useCallback(
      (e: React.KeyboardEvent) => {
        // Enter or Space toggles voice mode
        if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
          e.preventDefault()
          if (!triggeredRef.current) {
            triggeredRef.current = true
            toggleVoiceMode()
          }
        }
        // Escape stops voice mode
        if (e.key === "Escape" && voiceMode) {
          e.preventDefault()
          toggleVoiceMode()
          clearHoldTimer()
        }
      },
      [toggleVoiceMode, clearHoldTimer, voiceMode]
    ),

    onKeyUp: useCallback(() => {
      // No action needed for toggle mode
    }, []),
  }

  // ARIA props for accessibility
  const ariaProps = {
    role: "button" as const,
    tabIndex: 0,
    "aria-expanded": isSheetOpen,
    "aria-label": voiceMode
      ? "Voice mode active, tap to stop or wait 30 seconds"
      : "Hold to toggle voice mode, tap to expand tabs",
    "aria-pressed": voiceMode,
  }

  return {
    dockState,
    tabsExpanded,
    isSheetOpen,
    voiceMode,
    voiceToast,
    showIndicator,
    isTransitioning,
    openSheet,
    closeSheet,
    resetCollapseTimer,
    expandTabs,
    dismissToast,
    holdHandlers,
    keyboardHandlers,
    ariaProps,
  }
}

export default useAiDockController
