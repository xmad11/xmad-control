/* ═══════════════════════════════════════════════════════════════════════════════
   SHIMMERING TEXT - ElevenLabs UI Component
   Animated text with gradient shimmer effects and viewport-triggered
   animations using Motion (Framer Motion)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"

export interface ShimmeringTextProps {
  /** Text to display with shimmer effect */
  text: string
  /** Animation duration in seconds */
  duration?: number
  /** Delay before starting animation */
  delay?: number
  /** Whether to repeat the animation */
  repeat?: boolean
  /** Pause duration between repeats in seconds */
  repeatDelay?: number
  /** Optional CSS classes */
  className?: string
  /** Whether to start animation when entering viewport */
  startOnView?: boolean
  /** Whether to animate only once */
  once?: boolean
  /** Shimmer spread multiplier */
  spread?: number
  /** Base text color (CSS custom property) */
  color?: string
  /** Shimmer gradient color (CSS custom property) */
  shimmerColor?: string
}

export function ShimmeringText({
  text,
  duration = 2,
  delay = 0,
  repeat = true,
  repeatDelay = 0.5,
  className,
  startOnView = true,
  once = false,
  spread = 2,
  color,
  shimmerColor,
}: ShimmeringTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Viewport detection
  const isInView = useInView(ref, {
    once,
  })

  // Determine if animation should play
  const shouldAnimate = useMemo(() => {
    if (!startOnView) return true
    if (once && hasAnimated) return false
    return isInView
  }, [startOnView, once, hasAnimated, isInView])

  // Mark as animated when first viewed
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  // Calculate shimmer spread based on text length
  const shimmerSpread = useMemo(() => {
    const baseSpread = Math.min(spread, text.length / 10)
    return baseSpread
  }, [spread, text.length])

  // CSS custom properties for colors
  const style = useMemo(() => {
    const styles: Record<string, string> = {}

    if (color) {
      styles["--shimmer-base-color"] = color
    }
    if (shimmerColor) {
      styles["--shimmer-color"] = shimmerColor
    }

    return styles as React.CSSProperties
  }, [color, shimmerColor])

  // Animation keyframes
  const keyframes = useMemo(() => {
    const start = -100 - shimmerSpread * 50
    const end = 100 + shimmerSpread * 50

    return {
      backgroundPosition: [`${start}% 0`, `${end}% 0`],
    }
  }, [shimmerSpread])

  // Animation transition
  const transition = useMemo(() => {
    const baseTransition = {
      duration,
      delay,
      ease: "linear" as const,
    }

    if (repeat) {
      return {
        ...baseTransition,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay,
      }
    }

    return baseTransition
  }, [duration, delay, repeat, repeatDelay])

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-block bg-clip-text text-transparent",
        // Gradient background
        "bg-gradient-to-r",
        // Base gradient: transparent -> shimmer -> transparent
        "from-[var(--shimmer-base-color,rgba(255,255,255,0.2))]",
        "via-[var(--shimmer-color,rgba(255,255,255,0.8))]",
        "to-[var(--shimmer-base-color,rgba(255,255,255,0.2))]",
        // Background size for animation
        "bg-[length:200%_100%]",
        className
      )}
      style={{
        ...style,
        backgroundSize: `${200 + shimmerSpread * 100}% 100%`,
      }}
      animate={shouldAnimate ? keyframes : { backgroundPosition: "-100% 0" }}
      transition={transition}
    >
      {text}
    </motion.span>
  )
}

export default ShimmeringText
