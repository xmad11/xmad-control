/* ═══════════════════════════════════════════════════════════════════════════════
   AI DOCK DESIGN TOKENS - Single Source of Truth

   This is the visual + motion + layout contract for the AI dock system.
   Agents must follow it strictly so the dock stays consistent, tiny, and safe.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════════
// SIZE SCALE
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockSize = {
  /** Main floating tab size */
  tab: "var(--size-ai-tab)",
  /** Gap between expanded tabs */
  tabExpandedGap: "var(--space-ai-tabs-gap)",
  /** Wave indicator height */
  waveHeight: "var(--size-ai-wave)",
  /** Single wave bar width */
  waveWidth: "var(--size-ai-wave-bar)",
  /** Collapsed dot indicator size */
  dot: "var(--size-ai-dot)",
  /** Sheet border radius */
  sheetRadius: "var(--radius-ai-sheet)",
  /** Sheet max height */
  sheetMaxHeight: "var(--ai-sheet-max-height, 60vh)",
  /** Sheet backdrop blur */
  sheetBlur: "var(--ai-sheet-blur, 20px)",
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION SCALE — SSOT for ALL dashboard timing
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockMotion = {
  // ─────────────────────────────────────────────────────────────────────────────
  // INTENT-BASED DURATIONS (ms)
  // ─────────────────────────────────────────────────────────────────────────────
  /** Fast micro-interactions: button press, icon swap */
  intentFast: 140,
  /** Standard interactions: hover states, small reveals */
  intentMedium: 220,
  /** Deliberate animations: sheet enter, large reveals */
  intentSlow: 320,

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET MOTION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Sheet/modal enter animation */
  sheetEnter: 320,
  /** Sheet/modal exit animation - faster for snappy close */
  sheetExit: 240,
  /** Sheet backdrop fade */
  sheetBackdrop: 180,

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB MOTION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Delay before tabs auto-collapse (ms) */
  tabCollapseDelay: 2000,
  /** Tab transition between states (ms) */
  tabTransition: 220,
  /** Tab expand/collapse animation (ms) */
  tabExpand: 220,

  // ─────────────────────────────────────────────────────────────────────────────
  // WIDGET MOTION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Widget appear animation */
  widgetAppear: 320,
  /** Widget hover lift */
  widgetHover: 140,
  /** Stagger delay between multiple widgets */
  widgetStagger: 100,
  /** Gauge/chart animation duration */
  gaugeAnimation: 1200,

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAT MOTION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Chat FAB appear/disappear */
  chatAnimation: 180,
  /** Message appear animation */
  messageAppear: 180,

  // ─────────────────────────────────────────────────────────────────────────────
  // VOICE/WAVE MOTION (legacy aliases preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  /** Hold duration before voice activates (ms) */
  holdDelayMs: 420,
  /** Time before indicator collapses to dot (ms) */
  indicatorTimeoutMs: 2400,
  /** Wave animation duration (seconds) */
  waveDurationSec: 0.8,
  /** Fade transition duration (ms) */
  fadeDurationMs: 180,
  /** Tab expand duration (ms) - legacy alias */
  expandDurationMs: 220,

  // ─────────────────────────────────────────────────────────────────────────────
  // SPRING PHYSICS (for Framer Motion)
  // ─────────────────────────────────────────────────────────────────────────────
  /** Spring damping for sheet */
  springDamping: 30,
  /** Spring stiffness for sheet */
  springStiffness: 300,

  // ─────────────────────────────────────────────────────────────────────────────
  // EASING CURVES
  // ─────────────────────────────────────────────────────────────────────────────
  /** Standard ease - smooth, natural feel */
  easeStandard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  /** Exit ease - quick start, slow end for departures */
  easeExit: "cubic-bezier(0.4, 0, 1, 1)",
  /** Spring-like ease - bouncy but controlled */
  easeSpringFake: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// OPACITY SCALE
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockOpacity = {
  /** Idle state opacity */
  idle: 0.35,
  /** Active/focused state opacity */
  active: 0.9,
  /** Collapsed indicator dot opacity */
  indicator: 0.55,
  /** Wave animation opacity */
  wave: 0.8,
  /** Sheet backdrop opacity */
  backdrop: 0.5,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER SCALE (Z-index)
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockLayer = {
  /** Base dock z-index */
  dock: 80,
  /** Wave indicator z-index */
  wave: 85,
  /** Dot indicator z-index */
  indicator: 86,
  /** Sheet backdrop z-index */
  backdrop: 110,
  /** Sheet z-index */
  sheet: 120,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// GESTURE THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockGesture = {
  /** Hold duration to trigger voice (ms) */
  holdMs: 420,
  /** Distance to cancel hold gesture (px) */
  cancelDistancePx: 12,
  /** Scroll threshold to cancel hold (px) */
  scrollCancelPx: 24,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockColor = {
  /** Primary accent color (cyan) */
  accent: "var(--color-ai-accent, rgb(34, 211, 238))",
  /** Muted accent for idle states */
  accentMuted: "var(--color-ai-accent-muted, rgb(8, 145, 178))",
  /** Glow effect color */
  glow: "var(--color-ai-glow, rgba(34, 211, 238, 0.3))",
  /** Glass background */
  glass: "var(--color-ai-glass, rgba(255, 255, 255, 0.1))",
  /** Glass border */
  glassBorder: "var(--color-ai-glass-border, rgba(255, 255, 255, 0.2))",
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockPosition = {
  /** Dock offset from bottom */
  dockOffsetY: "var(--dock-offset-y, 16px)",
  /** Wave offset above tab */
  waveOffsetY: "var(--space-ai-wave-offset, 8px)",
  /** Safe area bottom (for mobile) */
  safeAreaBottom: "env(safe-area-inset-bottom, 0px)",
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED TOKENS EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockTokens = {
  size: aiDockSize,
  motion: aiDockMotion,
  opacity: aiDockOpacity,
  layer: aiDockLayer,
  gesture: aiDockGesture,
  color: aiDockColor,
  position: aiDockPosition,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MACHINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** AI Dock interaction states */
export type AiDockState = "idle" | "tabs" | "tab-selected" | "holding" | "indicator" | "sheet"

/** AI Dock events for state transitions */
export type AiDockEvent =
  | "EXPAND_TABS"
  | "SELECT_TAB"
  | "START_HOLD"
  | "END_HOLD"
  | "OPEN_SHEET"
  | "CLOSE_SHEET"
  | "TIMEOUT"
  | "RESET"

// ═══════════════════════════════════════════════════════════════════════════════
// CSS CUSTOM PROPERTIES (for injection)
// ═══════════════════════════════════════════════════════════════════════════════

export const aiDockCSSProperties = `
  :root {
    --size-ai-tab: 48px;
    --space-ai-tabs-gap: 4px;
    --size-ai-wave: 8px;
    --size-ai-wave-bar: 2px;
    --size-ai-dot: 8px;
    --radius-ai-sheet: 24px;
    --ai-sheet-max-height: 60vh;
    --ai-sheet-blur: 20px;
    --dock-offset-y: 16px;
    --space-ai-wave-offset: 8px;
    --color-ai-accent: rgb(34, 211, 238);
    --color-ai-accent-muted: rgb(8, 145, 178);
    --color-ai-glow: rgba(34, 211, 238, 0.3);
    --color-ai-glass: rgba(255, 255, 255, 0.1);
    --color-ai-glass-border: rgba(255, 255, 255, 0.2);
  }
` as const
