"use client"

import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import React, { useMemo, type ComponentProps, type CSSProperties } from "react"
import { type AgentState, useAudioVisualizerRadialAnimator } from "./hooks/use-audio-visualizer"

export const AudioVisualizerRadialVariants = cva(
  [
    "relative flex items-center justify-center rounded-full",
    "bg-white/5 backdrop-blur-xl border border-white/10",
    "[&_[data-index]]:bg-white/20 [&_[data-index]]:rounded-full [&_[data-index]]:transition-all [&_[data-index]]:duration-150",
    "[&_[data-highlighted=true]]:bg-cyan-400 [&_[data-highlighted=true]]:shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    "data-[state=thinking]:animate-spin data-[state=thinking]:[animation-duration:5s]",
  ],
  {
    variants: {
      size: {
        icon: "h-[32px] w-[32px]",
        sm: "h-[64px] w-[64px]",
        md: "h-[120px] w-[120px]",
        lg: "h-[200px] w-[200px]",
        xl: "h-[300px] w-[300px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface AudioVisualizerRadialProps {
  size?: "icon" | "sm" | "md" | "lg" | "xl"
  state?: AgentState
  color?: string
  radius?: number
  barCount?: number
  className?: string
}

export function AudioVisualizerRadial({
  size = "md",
  state = "connecting",
  color = "#22d3ee",
  radius,
  barCount,
  className,
  style,
  ...props
}: AudioVisualizerRadialProps &
  ComponentProps<"div"> &
  VariantProps<typeof AudioVisualizerRadialVariants>) {
  const _barCount = useMemo(() => {
    if (barCount) return barCount
    return size === "icon" || size === "sm" ? 12 : 24
  }, [barCount, size])

  const sequencerInterval = useMemo(() => {
    switch (state) {
      case "connecting":
      case "listening":
        return 500
      case "initializing":
        return 250
      case "thinking":
        return Number.POSITIVE_INFINITY
      default:
        return 1000
    }
  }, [state])

  const distanceFromCenter = useMemo(() => {
    if (radius) return radius
    switch (size) {
      case "icon":
        return 10
      case "xl":
        return 110
      case "lg":
        return 70
      case "sm":
        return 18
      default:
        return 40
    }
  }, [size, radius])

  const highlightedIndices = useAudioVisualizerRadialAnimator(state, _barCount, sequencerInterval)

  // Simulate volume bands for speaking state
  const bands = useMemo(() => {
    if (state === "speaking") {
      return Array.from({ length: _barCount }, () => Math.random() * 0.6 + 0.1)
    }
    return new Array(_barCount).fill(0)
  }, [state, _barCount])

  const dotSize = useMemo(() => {
    return Math.max(4, (distanceFromCenter * Math.PI) / _barCount)
  }, [distanceFromCenter, _barCount])

  return (
    <div
      data-state={state}
      className={cn(AudioVisualizerRadialVariants({ size }), className)}
      style={{ ...style, color } as CSSProperties}
      {...props}
    >
      {bands.map((band, idx) => {
        const angle = (idx / _barCount) * Math.PI * 2
        const isHighlighted = highlightedIndices.includes(idx)

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: Audio dots have no natural ID, position is identity
          <div
            key={`${_barCount}-${idx}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transformOrigin: "center",
              transform: `rotate(${angle}rad) translateY(${distanceFromCenter}px)`,
            }}
          >
            <div
              data-index={idx}
              data-highlighted={isHighlighted}
              style={{
                width: dotSize,
                minHeight: dotSize,
                height: state === "speaking" ? `${dotSize + dotSize * 8 * band}px` : dotSize,
                transition: "height 0.1s ease-out",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
