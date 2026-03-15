/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT - XMAD Control Dashboard
   Pixel-perfect reproduction from ein-ui (Phase 1: Background + Bottom Tabs)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LayoutDashboard, MessageSquare, Brain, Zap, Monitor, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent } from "@/components/glass/glass-tabs";

// ═══════════════════════════════════════════════════════════════════════════════
// TABS CONFIGURATION (exact from ein-ui)
// ═══════════════════════════════════════════════════════════════════════════════

const tabs = [
  { value: "overview", icon: LayoutDashboard, label: "Overview" },
  { value: "memory", icon: Brain, label: "Memory" },
  { value: "automation", icon: Zap, label: "Automation" },
  { value: "screen", icon: Monitor, label: "Screen" },
  { value: "backups", icon: HardDrive, label: "Backups" },
];

// Tab collapse timing (exact from ein-ui: 2000ms)
const TAB_COLLAPSE_DELAY = 2000;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HomeClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tabsExpanded, setTabsExpanded] = useState(true);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Reset collapse timer (exact logic from ein-ui)
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    setTabsExpanded(true);
    collapseTimerRef.current = setTimeout(() => {
      setTabsExpanded(false);
    }, TAB_COLLAPSE_DELAY);
  }, []);

  // Initial mount - start collapse timer
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      collapseTimerRef.current = setTimeout(() => {
        setTabsExpanded(false);
      }, TAB_COLLAPSE_DELAY);
    }
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    resetCollapseTimer();
  }, [resetCollapseTimer]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          BACKGROUND - Pixel-perfect from ein-ui (lines 433-436)
          ════════════════════════════════════════════════════════════════════════ */}
      {/* Full-screen gradient background - covers body bg */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse z-0" />

      {/* ════════════════════════════════════════════════════════════════════════
          GLASS TABS CONTAINER (wraps entire page including floating tab bar)
          ════════════════════════════════════════════════════════════════════════ */}
      <GlassTabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="relative z-10 h-screen overflow-hidden pt-16 flex flex-col transition-all duration-500"
      >
        {/* Content area - scrollable vertically */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 md:px-4 lg:px-6 pb-24">

          {/* ==================== OVERVIEW TAB ==================== */}
          <GlassTabsContent value="overview" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <LayoutDashboard className="h-16 w-16 text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Overview</h2>
              <p className="text-white/60">Dashboard content will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== MEMORY TAB ==================== */}
          <GlassTabsContent value="memory" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Brain className="h-16 w-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Memory</h2>
              <p className="text-white/60">Memory editor will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== AUTOMATION TAB ==================== */}
          <GlassTabsContent value="automation" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Zap className="h-16 w-16 text-orange-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Automation</h2>
              <p className="text-white/60">Automation tasks will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== SCREEN TAB ==================== */}
          <GlassTabsContent value="screen" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <Monitor className="h-16 w-16 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Screen</h2>
              <p className="text-white/60">VNC screen will be implemented here</p>
            </div>
          </GlassTabsContent>

          {/* ==================== BACKUPS TAB ==================== */}
          <GlassTabsContent value="backups" className="m-0 mt-0">
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
              <HardDrive className="h-16 w-16 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Backups</h2>
              <p className="text-white/60">Backup management will be implemented here</p>
            </div>
          </GlassTabsContent>

        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            FLOATING TAB BAR - Pixel-perfect from ein-ui (lines 1156-1222)
            Must be INSIDE GlassTabs for Radix context
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-4 pt-2 pointer-events-none">
          {/* Single centered container */}
          <div className="relative flex flex-col items-center pointer-events-auto">
            {/* Chat icon above - only visible when expanded */}
            <AnimatePresence>
              {tabsExpanded && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  aria-label="Open chat"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Collapsed state - single floating button */}
            <button
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
                {(() => {
                  const activeTabData = tabs.find((t) => t.value === activeTab);
                  const TabIcon = activeTabData?.icon || LayoutDashboard;
                  return <TabIcon className="h-4 w-4 text-white" />;
                })()}
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
              {/* The tab bar */}
              <GlassTabsList className="flex items-center justify-center gap-0.5 px-1.5 py-1 h-auto">
                {tabs.map((tab) => (
                  <GlassTabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group p-2 transition-all duration-200 rounded-lg"
                    onClick={resetCollapseTimer}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="ml-1.5 text-xs hidden group-data-[state=active]:inline whitespace-nowrap">{tab.label}</span>
                  </GlassTabsTrigger>
                ))}
              </GlassTabsList>
            </div>
          </div>
        </div>
      </GlassTabs>
    </>
  );
}

export default HomeClient;
