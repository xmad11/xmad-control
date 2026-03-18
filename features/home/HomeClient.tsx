/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   AI Dock State Machine + Glass Liquid Tabs
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassTabs, GlassTabsList, GlassTabsTrigger } from "@/components/glass/glass-tabs"
import { WIDGET_LAYOUT } from "@/config/dashboard"
import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { SurfaceManager } from "@/runtime/SurfaceManager"
import { DashboardDataContext, useSurfaceController } from "@/runtime/useSurfaceController"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { useEffect } from "react"

import { AiChatSheet } from "@/components/ai-dock/AiChatSheet"
import { MiniWaveIndicator } from "@/components/ai-dock/MiniWaveIndicator"
import { ErrorBoundary, SurfaceErrorBoundary } from "@/components/error-boundary"
import { BackgroundBlobs } from "@/features/dashboard-ui/BackgroundBlobs"
import { useAiDockController } from "@/hooks/useAiDockController"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS FROM TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/** Bottom padding for content area to avoid tab bar overlap */
const CONTENT_BOTTOM_PADDING = WIDGET_LAYOUT.BOTTOM_PADDING // "pb-28"

/** Animation durations from tokens */
const ANIMATION = {
  /** Tab expand/collapse duration */
  tabExpand: aiDockTokens.motion.tabExpand / 1000, // Convert ms to seconds for Framer
  /** Fast micro-interaction */
  intentFast: aiDockTokens.motion.intentFast / 1000,
} as const

/** Safe area bottom for mobile devices */
const SAFE_AREA_BOTTOM = aiDockTokens.position.safeAreaBottom

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  // Surface controller - handles surface selection and data ONLY
  const {
    activeSurface,
    handleSurfaceChange,
    tabs,
    stats,
    services,
    processes,
    DashboardDataContext: DataContext,
  } = useSurfaceController()

  // AI Dock Controller - owns tabsExpanded state and all dock interactions
  const {
    tabsExpanded,
    isSheetOpen,
    isHolding,
    showIndicator,
    openSheet,
    closeSheet,
    resetCollapseTimer,
    holdHandlers,
    keyboardHandlers,
  } = useAiDockController()

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [isSheetOpen])

  return (
    <DataContext.Provider value={{ stats, services, processes }}>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND - Pixel-perfect from ein-ui
          ════════════════════════════════════════════════════════════════════════ */}
      <BackgroundBlobs />

      {/* ════════════════════════════════════════════════════════════════════════
          GLASS TABS CONTAINER
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeSurface}
        onValueChange={handleSurfaceChange}
        className="relative z-10 flex flex-col transition-all duration-500"
      >
        {/* Content area - use SurfaceManager with token-based bottom padding */}
        <div className={`relative z-10 flex-1 px-3 py-4 md:px-4 lg:px-6 ${CONTENT_BOTTOM_PADDING}`}>
          <SurfaceErrorBoundary surfaceId={activeSurface}>
            <SurfaceManager activeSurface={activeSurface} />
          </SurfaceErrorBoundary>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            FLOATING TAB BAR - With AI Dock State Machine
            ════════════════════════════════════════════════════════════════════════ */}
        <div
          className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none"
          style={{ paddingBottom: `calc(0.5rem + ${SAFE_AREA_BOTTOM})` }}
        >
          <div className="relative flex flex-col items-center pointer-events-auto gap-1">
            {/* Chat icon above - click only (no hold gesture) */}
            <AnimatePresence>
              {tabsExpanded && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: ANIMATION.intentFast }}
                  className="relative p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  aria-label="Open chat"
                  onClick={openSheet}
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button with HOLD gesture for Voice */}
            <button
              onClick={resetCollapseTimer}
              onContextMenu={(e) => e.preventDefault()}
              {...holdHandlers}
              {...keyboardHandlers}
              className={`
                transition-all ease-out select-none touch-none
                ${tabsExpanded ? "hidden" : "flex"}
                relative p-3 rounded-xl
                bg-white/10 backdrop-blur-xl border border-white/20
                shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                hover:bg-white/15
                ${isHolding ? "scale-110" : "active:scale-95"}
              `}
              style={{
                transitionDuration: `${aiDockTokens.motion.tabExpand}ms`,
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
              aria-label={
                isHolding ? "Voice input active, release to send" : "Hold to speak or press Enter"
              }
              aria-expanded={tabsExpanded}
              aria-controls="dashboard-tab-list"
              aria-pressed={isHolding}
            >
              <div className="relative z-10 flex items-center justify-center">
                {(() => {
                  const activeTabData = tabs.find((t) => t.value === activeSurface)
                  const TabIcon = activeTabData?.icon
                  return TabIcon ? <TabIcon className="h-4 w-4 text-white" /> : null
                })()}
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-lg opacity-60" />

              {/* Mini Wave Indicator on collapsed button */}
              <MiniWaveIndicator active={isHolding} collapsed={showIndicator && !isHolding} />

              {/* Glow effect when holding */}
              {isHolding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="absolute -inset-2 rounded-xl bg-cyan-500/30 blur-lg"
                />
              )}
            </button>

            {/* Expanded state - tabs */}
            <div
              id="dashboard-tab-list"
              className={`
                transition-all ease-out origin-bottom
                ${tabsExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"}
              `}
              style={{ transitionDuration: `${aiDockTokens.motion.tabExpand}ms` }}
            >
              <GlassTabsList className="flex items-center justify-center gap-1 px-1.5 py-1 h-auto">
                {tabs.map((tab) => (
                  <GlassTabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group p-2 transition-all rounded-lg"
                    style={{ transitionDuration: `${aiDockTokens.motion.intentMedium}ms` }}
                    onClick={resetCollapseTimer}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="ml-1.5 text-xs hidden group-data-[state=active]:inline whitespace-nowrap">
                      {tab.label}
                    </span>
                  </GlassTabsTrigger>
                ))}
              </GlassTabsList>
            </div>
          </div>
        </div>
      </GlassTabs>

      {/* ════════════════════════════════════════════════════════════════════════
          AI CHAT SHEET - Lazy loaded bottom sheet
          ════════════════════════════════════════════════════════════════════════ */}
      <ErrorBoundary>
        <AiChatSheet isOpen={isSheetOpen} onClose={closeSheet} />
      </ErrorBoundary>
    </DataContext.Provider>
  )
}

export default HomeClient
