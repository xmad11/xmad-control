/* ═══════════════════════════════════════════════════════════════════════════════
   MARQUEE - Responsive component with mobile/desktop branches
   Mobile: 2 horizontal rows | Desktop: 3 diagonal 3D columns
   GPU-only animations, edge fade masks, fixed widths
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useVisibilityPause } from "@/hooks/usePageVisibility"
import { cloneElement, memo, useEffect, useMemo, useState } from "react"

export type MarqueeDirection = "left" | "right"

export interface MarqueeProps {
  children: React.ReactNode
  className?: string
  direction?: MarqueeDirection
}

const MIN_CARDS = 6

function useSmartFill(children: React.ReactNode) {
  return useMemo(() => {
    const valid = (Array.isArray(children) ? children : [children]).filter(Boolean)
    if (valid.length >= MIN_CARDS) return valid

    const result = [...valid]
    let i = 0
    while (result.length < MIN_CARDS && i < 10) {
      valid.forEach((child, idx) => {
        const _el = child as React.ReactElement
        result.push({ ...child, key: `fill-${i}-${idx}` } as React.ReactElement)
      })
      i++
    }
    return result
  }, [children])
}

export const Marquee = memo(function Marquee({
  children,
  className = "",
  direction = "left",
}: MarqueeProps) {
  const filled = useSmartFill(children)
  const mobileRef = useVisibilityPause<HTMLDivElement>()

  // Double the content for seamless infinite loop
  const doubled = [
    ...filled.map((c) =>
      cloneElement(c as React.ReactElement, {
        key: `marquee-a-${(c as React.ReactElement).key || Math.random()}`,
      })
    ),
    ...filled.map((c) =>
      cloneElement(c as React.ReactElement, {
        key: `marquee-b-${(c as React.ReactElement).key || Math.random()}`,
      })
    ),
  ]

  // Determine animation direction
  const animationClass = direction === "right" ? "marquee-track-reverse" : "marquee-track"

  // Horizontal marquee for all screen sizes
  // No inline styles needed - CSS handles everything with -50% scroll
  return (
    <div ref={mobileRef} className={`marquee-horizontal-container ${className}`}>
      <div className="marquee-row fade-horizontal">
        <div className={animationClass}>
          {doubled.map((c) => (
            <div key={c.key} className="marquee-card">
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
