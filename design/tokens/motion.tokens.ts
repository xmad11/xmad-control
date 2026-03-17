/* ═══════════════════════════════════════════════════════════════════════════════
   MOTION TOKENS — XMAD Control (Centralized SSOT)

   ⚠️ CRITICAL: All timing values are sourced from design/tokens/ai-dock.tokens.ts
   This file provides convenient constants and helpers for Framer Motion.

   SSOT: aiDockTokens.motion.* from @/design/tokens/ai-dock.tokens
   ═══════════════════════════════════════════════════════════════════════════════ */

import { aiDockMotion } from "./ai-dock.tokens"

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION CONSTANTS (ms values for easy reference)
// ═══════════════════════════════════════════════════════════════════════════════

/** Unified motion tokens - all sourced from aiDockMotion SSOT */
export const MOTION = {
  // Intent-based durations
  INTENT_FAST: aiDockMotion.intentFast,
  INTENT_MEDIUM: aiDockMotion.intentMedium,
  INTENT_SLOW: aiDockMotion.intentSlow,

  // Sheet motion
  SHEET_ENTER: aiDockMotion.sheetEnter,
  SHEET_EXIT: aiDockMotion.sheetExit,
  SHEET_BACKDROP: aiDockMotion.sheetBackdrop,

  // Tab motion
  TAB_COLLAPSE_DELAY: aiDockMotion.tabCollapseDelay,
  TAB_TRANSITION: aiDockMotion.tabTransition,
  TAB_EXPAND: aiDockMotion.tabExpand,

  // Widget motion
  WIDGET_APPEAR: aiDockMotion.widgetAppear,
  WIDGET_HOVER: aiDockMotion.widgetHover,
  WIDGET_STAGGER: aiDockMotion.widgetStagger,
  GAUGE_ANIMATION: aiDockMotion.gaugeAnimation,

  // Chat motion
  CHAT_ANIMATION: aiDockMotion.chatAnimation,
  MESSAGE_APPEAR: aiDockMotion.messageAppear,

  // Voice/Wave motion
  VOICE_HOLD_DELAY: aiDockMotion.holdDelayMs,
  WAVE_DURATION: aiDockMotion.waveDurationSec * 1000,
  INDICATOR_TIMEOUT: aiDockMotion.indicatorTimeoutMs,
  FADE_DURATION: aiDockMotion.fadeDurationMs,

  // Easing (as arrays for Framer Motion compatibility)
  EASE_STANDARD: [0.2, 0.8, 0.2, 1] as const,
  EASE_EXIT: [0.4, 0, 1, 1] as const,
  EASE_SPRING: [0.16, 1, 0.3, 1] as const,

  // Spring physics
  SPRING_DAMPING: aiDockMotion.springDamping,
  SPRING_STIFFNESS: aiDockMotion.springStiffness,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Create Framer Motion transition config from MOTION tokens */
export function createTransition(
  type: "enter" | "exit" | "standard" = "standard"
): { duration: number; ease: readonly [number, number, number, number] } {
  switch (type) {
    case "enter":
      return {
        duration: aiDockMotion.sheetEnter / 1000,
        ease: MOTION.EASE_STANDARD,
      }
    case "exit":
      return {
        duration: aiDockMotion.sheetExit / 1000,
        ease: MOTION.EASE_EXIT,
      }
    default:
      return {
        duration: aiDockMotion.intentMedium / 1000,
        ease: MOTION.EASE_STANDARD,
      }
  }
}

/** Create spring config for Framer Motion */
export function createSpring() {
  return {
    type: "spring" as const,
    damping: aiDockMotion.springDamping,
    stiffness: aiDockMotion.springStiffness,
  }
}

/** Create staggered children transition */
export function createStagger(count: number, staggerMs: number = aiDockMotion.widgetStagger) {
  return {
    staggerChildren: staggerMs / 1000,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Commonly used transition presets */
export const transitions = {
  fast: { duration: aiDockMotion.intentFast / 1000, ease: MOTION.EASE_STANDARD },
  medium: { duration: aiDockMotion.intentMedium / 1000, ease: MOTION.EASE_STANDARD },
  slow: { duration: aiDockMotion.intentSlow / 1000, ease: MOTION.EASE_STANDARD },
  spring: createSpring(),
  enter: createTransition("enter"),
  exit: createTransition("exit"),
} as const
