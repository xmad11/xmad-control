/* ═══════════════════════════════════════════════════════════════════════════════
   VIEW MODE BUTTON - Square icon button with semantic icon + hover tooltip

   Cycles through available view modes for current breakpoint.
   Icons are semantic and never change.
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useBreakpoint } from "@/hooks/useBreakpoint"
import type { Breakpoint } from "@/types/breakpoint"
import { useCallback, useEffect, useState } from "react"
import type { ViewModeId } from "./types"
import { getAvailableViewModes } from "./viewModeColumns"
import { VIEW_MODES } from "./viewModes"

export interface ViewModeButtonProps {
  currentView: ViewModeId
  onViewChange: (viewId: ViewModeId) => void
  className?: string
}

export function ViewModeButton({ currentView, onViewChange, className = "" }: ViewModeButtonProps) {
  const breakpoint = useBreakpoint()
  const [mounted, setMounted] = useState(false)

  // Get available modes for current breakpoint
  const availableModes = getAvailableViewModes(breakpoint)

  // If current view is not available, switch to first available
  useEffect(() => {
    if (!availableModes.includes(currentView)) {
      onViewChange(availableModes[0])
    }
    setMounted(true) // Mark as mounted after validation
  }, [currentView, availableModes, onViewChange])

  const currentOption = VIEW_MODES.find((opt) => opt.id === currentView)
  const CurrentIcon = currentOption?.icon

  const handleCycle = useCallback(() => {
    const currentIndex = availableModes.indexOf(currentView)
    const nextIndex = (currentIndex + 1) % availableModes.length
    onViewChange(availableModes[nextIndex])
  }, [currentView, onViewChange, availableModes])

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleCycle}
        className={`
          flex items-center justify-center
          hover:bg-[var(--bg)]
          rounded-[var(--radius-md)]
          transition-colors duration-[var(--duration-fast)]
          p-[var(--spacing-sm)]
          ${className}
          ${!mounted ? "opacity-0" : "opacity-100"}
        `}
        aria-label={`View mode: ${currentOption?.label}. Click to cycle through options.`}
        suppressHydrationWarning
      >
        {CurrentIcon && (
          <CurrentIcon
            className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)] opacity-[var(--opacity-muted)] group-hover:text-[var(--fg)] group-hover:opacity-100 transition-all duration-[var(--duration-fast)]"
            selected={false}
            breakpoint={breakpoint ?? undefined}
          />
        )}
      </button>

      {/* Hover Tooltip */}
      <div className="absolute right-0 top-full mt-[var(--spacing-xs)] z-[var(--z-tooltip)] opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] pointer-events-none">
        <div className="bg-[var(--fg)] text-[var(--bg)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-xs)] whitespace-nowrap shadow-[var(--shadow-md)]">
          {currentOption?.label || "View"}
        </div>
      </div>
    </div>
  )
}
