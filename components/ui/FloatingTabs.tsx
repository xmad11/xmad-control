/* ═══════════════════════════════════════════════════════════════════════════════
   FLOATING TABS — XMAD Dashboard
   Collapsible bottom tab navigation with auto-collapse behavior
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { GlassTabs, GlassTabsList, GlassTabsTrigger } from "@/components/glass/glass-tabs"
import { TABS, TIMING } from "@/config/dashboard"
import type { LucideIcon } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard: require("lucide-react").LayoutDashboard,
  MessageSquare: require("lucide-react").MessageSquare,
  Brain: require("lucide-react").Brain,
  Zap: require("lucide-react").Zap,
  Monitor: require("lucide-react").Monitor,
  HardDrive: require("lucide-react").HardDrive,
  Settings: require("lucide-react").Settings,
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FloatingTabsProps {
  value: string
  onValueChange: (value: string) => void
  onChatClick?: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function FloatingTabs({ value, onValueChange, onChatClick }: FloatingTabsProps) {
  const [tabsExpanded, setTabsExpanded] = useState(true)
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Map tabs with icons
  const tabs = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        icon: iconMap[tab.icon],
      })),
    []
  )

  // Reset collapse timer
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
    setTabsExpanded(true)
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)
  }, [])

  // Auto-collapse on mount
  useEffect(() => {
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false)
    }, TIMING.TAB_COLLAPSE)

    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
      }
    }
  }, [])

  // Get active tab icon
  const activeTabData = tabs.find((t) => t.value === value)
  const ActiveTabIcon = activeTabData?.icon || iconMap.LayoutDashboard

  // Handle tab change
  const handleTabChange = useCallback(
    (newValue: string) => {
      onValueChange(newValue)
      resetCollapseTimer()
    },
    [onValueChange, resetCollapseTimer]
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-4 pt-2 pointer-events-none">
      <div className="relative flex flex-col items-center pointer-events-auto">
        {/* Chat FAB - only visible when expanded */}
        <AnimatePresence>
          {tabsExpanded && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: TIMING.CHAT_ANIMATION / 1000 }}
              onClick={onChatClick}
              className="mb-2 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              aria-label="Open chat"
            >
              <MessageSquare className="h-4 w-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Collapsed state - single floating button */}
        <button
          type="button"
          onClick={resetCollapseTimer}
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
          aria-label="Expand navigation"
        >
          <div className="relative z-10 flex items-center justify-center">
            <ActiveTabIcon className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-lg opacity-60" />
        </button>

        {/* Expanded state - tabs */}
        <div
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
                onClick={() => handleTabChange(tab.value)}
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
  )
}

export default FloatingTabs
