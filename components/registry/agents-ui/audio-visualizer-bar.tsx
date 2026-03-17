"use client"

import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import React, { useMemo, type ComponentProps, type CSSProperties } from "react"
import { type AgentState, useAudioVisualizerBarAnimator } from "./hooks/use-audio-visualizer"

export const AudioVisualizerBarElementVariants = cva(
  [
    "rounded-full transition-all duration-150 ease-out",
    "bg-white/20 backdrop-blur-sm",
    "data-[highlighted=true]:bg-cyan-400 data-[highlighted=true]:shadow-[0_0_12px_rgba(34,211,238,0.6)]",
  ],
  {
    variants: {
      size: {
        icon: "w-[3px] min-h-[3px]",
        sm: "w-[6px] min-h-[6px]",
        md: "w-[10px] min-h-[10px]",
        lg: "w-[20px] min-h-[20px]",
        xl: "w-[40px] min-h-[40px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export const AudioVisualizerBarVariants = cva(
  "relative flex items-end justify-center gap-1 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-2",
  {
    variants: {
      size: {
        icon: "h-[24px] gap-[2px]",
        sm: "h-[48px] gap-[3px]",
        md: "h-[80px] gap-[4px]",
        lg: "h-[140px] gap-[6px]",
        xl: "h-[200px] gap-[8px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface AudioVisualizerBarProps {
  size?: "icon" | "sm" | "md" | "lg" | "xl"
  state?: AgentState
  color?: string
  barCount?: number
  className?: string
}

export function AudioVisualizerBar({
  size = "md",
  state = "connecting",
  color = "#22d3ee",
  barCount,
  className,
  style,
  ...props
}: AudioVisualizerBarProps &
  ComponentProps<"div"> &
  VariantProps<typeof AudioVisualizerBarVariants>) {
  const _barCount = useMemo(() => {
    if (barCount) return barCount
    return size === "icon" || size === "sm" ? 3 : 5
  }, [barCount, size])

  const sequencerInterval = useMemo(() => {
    switch (state) {
      case "connecting":
        return 2000 / _barCount
      case "initializing":
        return 2000
      case "listening":
        return 500
      case "thinking":
        return 150
      default:
        return 1000
    }
  }, [state, _barCount])

  const highlightedIndices = useAudioVisualizerBarAnimator(state, _barCount, sequencerInterval)

  // Simulate volume bands for speaking state
  const bands = useMemo(() => {
    if (state === "speaking") {
      return Array.from({ length: _barCount }, () => Math.random() * 0.8 + 0.2)
    }
    return new Array(_barCount).fill(0.3)
  }, [state, _barCount])

  return (
    <div
      className={cn(AudioVisualizerBarVariants({ size }), className)}
      style={{ ...style, color } as CSSProperties}
      {...props}
    >
      {bands.map((band: number, idx: number) => {
        const isHighlighted = highlightedIndices.includes(idx)
        const height = state === "speaking" ? `${band * 100}%` : isHighlighted ? "80%" : "30%"

        return (
          <div
            key={`${_barCount}-${idx}`}
            data-index={idx}
            data-highlighted={isHighlighted}
            className={cn(AudioVisualizerBarElementVariants({ size }))}
            style={{
              height,
              transition: "height 0.15s ease-out",
            }}
          />
        )
      })}
    </div>
  )
}
