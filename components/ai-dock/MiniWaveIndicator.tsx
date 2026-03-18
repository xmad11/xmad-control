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
  const waveHeight = "8px"
  const waveWidth = "2px"
  const waveGap = "2px"
  const duration = `${aiDockTokens.motion.waveDurationSec}s`

  // Expanded mode: inline wave for button content
  if (expanded && active) {
    return (
      <div
        className={cn(
          "relative z-10 flex items-end justify-center",
          "pointer-events-none",
          className
        )}
        style={{
          gap: waveGap,
          height: "16px",
        }}
      >
        <div className="flex items-end gap-[2px]">
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
                animationDelay: `${i * 75}ms`,
                transformOrigin: "bottom",
                willChange: "transform",
              }}
            />
          ))}
        </div>
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
        gap: waveGap,
        height: "16px",
      }}
    >
      {active && !collapsed && (
        // Wave bars - CSS animation only (using separate properties, not shorthand)
        <div className="flex items-end gap-[2px]">
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
                animationDelay: `${i * 75}ms`,
                transformOrigin: "bottom",
                willChange: "transform",
              }}
            />
          ))}
          <style jsx>{`
            @keyframes wave-bar-anim {
              0%, 100% { transform: scaleY(0.6); }
              50% { transform: scaleY(1); }
            }
          `}</style>
        </div>
      )}

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
