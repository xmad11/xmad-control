/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   AI Dock State Machine + Glass Liquid Tabs
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassTabs, GlassTabsList, GlassTabsTrigger } from "@/components/glass/glass-tabs"
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
        {/* Content area - use SurfaceManager */}
        <div className="relative z-10 flex-1 px-3 py-4 md:px-4 lg:px-6 pb-24">
          <SurfaceErrorBoundary surfaceId={activeSurface}>
            <SurfaceManager activeSurface={activeSurface} />
          </SurfaceErrorBoundary>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            FLOATING TAB BAR - With AI Dock State Machine
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-2 pointer-events-none">
          <div className="relative flex flex-col items-center pointer-events-auto">
            {/* Chat icon above - click only (no hold gesture) */}
            <AnimatePresence>
              {tabsExpanded && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="relative p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  aria-label="Open chat"
                  onClick={openSheet}
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button with HOLD gesture for voice */}
            <button
              onClick={resetCollapseTimer}
              {...holdHandlers}
              {...keyboardHandlers}
              className={`
                transition-all duration-300 ease-out select-none
                ${tabsExpanded ? "opacity-0 scale-75 pointer-events-none absolute" : "opacity-100 scale-100"}
                relative p-3 rounded-xl
                bg-white/10 backdrop-blur-xl border border-white/20
                shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                hover:bg-white/15 active:scale-95
                before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none
              `}
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
                transition-all duration-300 ease-out origin-bottom
                ${tabsExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"}
              `}
            >
              <GlassTabsList className="flex items-center justify-center gap-0.5 px-1.5 py-1 h-auto">
                {tabs.map((tab) => (
                  <GlassTabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group p-2 transition-all duration-200 rounded-lg"
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
