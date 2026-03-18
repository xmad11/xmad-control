/* ══════════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   AI Dock State Machine + Glass Liquid Tabs + Unified Sheets
   ══════════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  GlassSheet,
  GlassSheetContent,
  GlassSheetHeader,
  GlassSheetTitle,
} from "@/components/glass/glass-sheet"
import { GlassTabs, GlassTabsList, GlassTabsTrigger } from "@/components/glass/glass-tabs"
import { BottomSheetContent, LeftSheetContent, RightSheetContent } from "@/components/sheets"
import { WIDGET_LAYOUT } from "@/config/dashboard"
import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { SurfaceManager } from "@/runtime/SurfaceManager"
import { DashboardDataContext, useSurfaceController } from "@/runtime/useSurfaceController"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, MessageSquare, Mic, MicOff } from "lucide-react"
import { useEffect } from "react"

import { MiniWaveIndicator } from "@/components/ai-dock/MiniWaveIndicator"
import { ErrorBoundary, SurfaceErrorBoundary } from "@/components/error-boundary"
import { BackgroundBlobs } from "@/features/dashboard-ui/BackgroundBlobs"
import { useAiDockController } from "@/hooks/useAiDockController"
import { useSheetManager } from "@/hooks/useSheetManager"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS FROM TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

/** Bottom padding for content area to avoid tab bar overlap */
const CONTENT_BOTTOM_PADDING = WIDGET_LAYOUT.BOTTOM_PADDING // "pb-28"

/** Top padding for content area to avoid header overlap */
const CONTENT_TOP_PADDING = "pt-16"

/** Animation durations from tokens */
const ANIMATION = {
  /** Tab expand/collapse duration */
  tabExpand: aiDockTokens.motion.tabExpand / 1000,
  /** Fast micro-interaction */
  intentFast: aiDockTokens.motion.intentFast / 1000,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE TOAST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface VoiceToastProps {
  show: boolean
  message: string
  type: "on" | "off"
}

function VoiceToast({ show, message, type }: VoiceToastProps) {
  const isActive = type === "on"
  const Icon = isActive ? Mic : MicOff

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              backdrop-blur-xl border shadow-lg
              ${isActive ? "bg-cyan-glow/15 border-cyan-glow/30" : "bg-white/8 border-white/15"}
            `}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-cyan-glow" : "text-white/60"}`} />
            <span
              className={`text-sm font-medium ${isActive ? "text-cyan-glow" : "text-white/80"}`}
            >
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT - Glassy texture
// ═══════════════════════════════════════════════════════════════════════════════

interface HeaderProps {
  onLogoClick: () => void
  onMenuClick: () => void
}

function Header({ onLogoClick, onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left - XMAD Logo (opens left sheet) */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2 p-2 rounded-xl backdrop-blur-xl border border-white/15 transition-all hover:scale-[1.02] glass-header-button"
          aria-label="Open navigation"
        >
          {/* XMAD Logo Icon - Glassy gradient */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white bg-gradient-cyan-purple glass-logo-icon">
            X
          </div>
          <span className="text-white font-bold text-sm hidden sm:inline">XMAD</span>
        </button>

        {/* Right - Menu Button (opens right sheet) */}
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2.5 rounded-xl backdrop-blur-xl border border-white/15 transition-all hover:scale-[1.02] glass-header-button"
          aria-label="Open settings"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  )
}

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
    voiceMode,
    voiceToast,
    resetCollapseTimer,
    expandTabs,
    holdHandlers,
    keyboardHandlers,
    ariaProps,
  } = useAiDockController()

  // Sheet Manager - unified state for all sheet directions
  const { activeSheet, openSheet, closeSheet, isSheetOpen } = useSheetManager()

  // Wrap surface change to reset collapse timer
  const handleTabChange = (value: string) => {
    handleSurfaceChange(value)
    resetCollapseTimer()
  }

  // Lock body scroll when any sheet is open
  useEffect(() => {
    if (activeSheet) {
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
  }, [activeSheet])

  return (
    <DataContext.Provider value={{ stats, services, processes }}>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND
          ════════════════════════════════════════════════════════════════════════ */}
      <BackgroundBlobs />

      {/* ════════════════════════════════════════════════════════════════════════
          HEADER - XMAD Logo (left) + Menu (right)
          ════════════════════════════════════════════════════════════════════════ */}
      <Header onLogoClick={() => openSheet("left")} onMenuClick={() => openSheet("right")} />

      {/* ════════════════════════════════════════════════════════════════════════
          GLASS TABS CONTAINER
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeSurface}
        onValueChange={handleTabChange}
        className="relative z-10 flex flex-col transition-all duration-500"
      >
        {/* Content area */}
        <div
          className={`relative z-10 flex-1 px-3 py-4 md:px-4 lg:px-6 ${CONTENT_BOTTOM_PADDING} ${CONTENT_TOP_PADDING}`}
        >
          <SurfaceErrorBoundary surfaceId={activeSurface}>
            <SurfaceManager activeSurface={activeSurface} />
          </SurfaceErrorBoundary>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            FLOATING TAB BAR
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none tab-bar-safe-area">
          <div className="relative flex flex-col items-center pointer-events-auto gap-1">
            {/* Voice mode active + tabs collapsed */}
            <AnimatePresence>
              {!tabsExpanded && voiceMode && (
                <button
                  onContextMenu={(e) => e.preventDefault()}
                  {...holdHandlers}
                  className="transition-all ease-out select-none touch-none flex relative p-3 rounded-xl backdrop-blur-xl border scale-110 glass-voice-button-active"
                  aria-label="Voice active - hold to stop, tap to expand tabs"
                  onClick={expandTabs}
                >
                  <MiniWaveIndicator active expanded />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="absolute -inset-2 rounded-xl blur-lg pointer-events-none bg-cyan-glow/25"
                  />
                </button>
              )}
            </AnimatePresence>

            {/* Voice mode active + tabs expanded */}
            <AnimatePresence>
              {tabsExpanded && voiceMode && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: ANIMATION.intentFast }}
                  onContextMenu={(e) => e.preventDefault()}
                  {...holdHandlers}
                  className="relative p-2 rounded-lg backdrop-blur-xl border transition-colors select-none touch-none glass-voice-button-active"
                  aria-label="Voice active - hold to stop, tap to open chat"
                  onClick={() => openSheet("bottom")}
                >
                  <MiniWaveIndicator active expanded />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Chat icon - when tabs expanded and NOT voice mode */}
            <AnimatePresence>
              {tabsExpanded && !voiceMode && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: ANIMATION.intentFast }}
                  className="relative p-2 rounded-lg backdrop-blur-xl border transition-colors glass-tab-button"
                  aria-label="Open chat"
                  onClick={() => openSheet("bottom")}
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button */}
            {!voiceMode && (
              <button
                onContextMenu={(e) => e.preventDefault()}
                {...holdHandlers}
                {...keyboardHandlers}
                {...ariaProps}
                className={`transition-all ease-out select-none touch-none ${
                  tabsExpanded || voiceMode ? "hidden" : "flex"
                } relative p-3 rounded-xl backdrop-blur-xl border glass-tab-button glass-tab-button`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {(() => {
                    const activeTabData = tabs.find((t) => t.value === activeSurface)
                    const TabIcon = activeTabData?.icon
                    return TabIcon ? <TabIcon className="h-4 w-4 text-white" /> : null
                  })()}
                </div>
                <div className="absolute -inset-1 rounded-xl blur-lg opacity-60 bg-gradient-tabs-glow" />
              </button>
            )}

            {/* Expanded state - tabs */}
            <div
              id="dashboard-tab-list"
              className={`transition-all ease-out origin-bottom duration-tab-expand ${
                tabsExpanded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-75 pointer-events-none absolute"
              }`}
            >
              <GlassTabsList className="flex items-center justify-center gap-1 px-1.5 py-1 h-auto">
                {tabs.map((tab) => (
                  <GlassTabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group p-2 transition-all rounded-lg duration-intent-medium"
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

      {/* ══════════════════════════════════════════════════════════════════════════
          VOICE TOAST
          ════════════════════════════════════════════════════════════════════════ */}
      <VoiceToast show={voiceToast.show} message={voiceToast.message} type={voiceToast.type} />

      {/* ════════════════════════════════════════════════════════════════════════
          UNIFIED SHEETS - All 4 directions using GlassSheet
          ════════════════════════════════════════════════════════════════════════ */}

      {/* LEFT SHEET - Navigation */}
      <GlassSheet open={isSheetOpen("left")} onOpenChange={(open) => !open && closeSheet()}>
        <GlassSheetContent side="left" className="w-72 sm:max-w-sm p-0">
          <LeftSheetContent />
        </GlassSheetContent>
      </GlassSheet>

      {/* RIGHT SHEET - Settings */}
      <GlassSheet open={isSheetOpen("right")} onOpenChange={(open) => !open && closeSheet()}>
        <GlassSheetContent side="right" className="w-80 sm:max-w-sm p-0">
          <RightSheetContent />
        </GlassSheetContent>
      </GlassSheet>

      {/* BOTTOM SHEET - Chat */}
      <GlassSheet open={isSheetOpen("bottom")} onOpenChange={(open) => !open && closeSheet()}>
        <GlassSheetContent side="bottom" className="h-[80vh] p-0 rounded-t-2xl">
          <GlassSheetHeader className="sr-only">
            <GlassSheetTitle>AI Chat</GlassSheetTitle>
          </GlassSheetHeader>
          <BottomSheetContent />
        </GlassSheetContent>
      </GlassSheet>
    </DataContext.Provider>
  )
}

export default HomeClient
