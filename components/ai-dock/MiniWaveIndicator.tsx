/* ═══════════════════════════════════════════════════════════════════════════════
   MINI WAVE INDICATOR - CSS-only wave animation
   Zero JS animation, pure CSS transforms - NO framer-motion

   Modes:
   - collapsed=true: Small pulsing dot indicator
   - active + expanded: Inline wave bars (for button content)
   - active only: Absolute positioned wave above element
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { cn } from "@/lib/utils"
import React from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE BARS COMPONENT (shared between modes)
// ═══════════════════════════════════════════════════════════════════════════════

function WaveBars() {
  const waveHeight = "10px"
  const waveWidth = "3px"
  const duration = `${aiDockTokens.motion.waveDurationSec}s`

  return (
    <>
      <div className="flex items-center justify-center gap-[3px] h-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="wave-bar rounded-full bg-cyan-400"
            style={{
              width: waveWidth,
              height: waveHeight,
              animationName: "wave-bar-anim",
              animationDuration: duration,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * 100}ms`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes wave-bar-anim {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MiniWaveIndicatorProps {
  /** Show the wave animation */
  active?: boolean
  /** Show collapsed dot indicator instead of wave */
  collapsed?: boolean
  /** Show inline (not absolute positioned) - for use inside buttons */
  expanded?: boolean
  /** Position above element */
  className?: string
}

export function MiniWaveIndicator({
  active = false,
  collapsed = false,
  expanded = false,
  className,
}: MiniWaveIndicatorProps) {
  // Expanded mode: inline wave for button content (centered)
  if (expanded && active) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <WaveBars />
      </div>
    )
  }

  // Default mode: absolute positioned indicator above element
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 flex items-end justify-center",
        "pointer-events-none transition-opacity duration-200",
        active || collapsed ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        bottom: `calc(100% + ${aiDockTokens.position.waveOffsetY})`,
        height: "16px",
      }}
    >
      {active && !collapsed && <WaveBars />}

      {collapsed && !active && (
        // Collapsed dot indicator - CSS pulse only
        <div
          className="size-2 rounded-full bg-cyan-400 animate-pulse"
          style={{
            opacity: aiDockTokens.opacity.indicator,
          }}
        />
      )}
    </div>
  )
}

export default MiniWaveIndicator
