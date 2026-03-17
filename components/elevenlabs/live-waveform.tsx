/* ═══════════════════════════════════════════════════════════════════════════════
   LIVE WAVEFORM - ElevenLabs UI Component
   Real-time canvas-based audio waveform visualizer with microphone input
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useCallback, useState } from "react"

export interface LiveWaveformProps {
  /** Whether the waveform is actively listening */
  active?: boolean
  /** Whether to show processing animation */
  processing?: boolean
  /** Height of the waveform in pixels */
  height?: number
  /** Width of each bar in pixels */
  barWidth?: number
  /** Gap between bars in pixels */
  barGap?: number
  /** Rendering mode: static bars or scrolling waveform */
  mode?: "static" | "scrolling"
  /** Whether to fade the edges */
  fadeEdges?: boolean
  /** Color of the bars */
  barColor?: "gray" | "white" | "accent"
  /** Number of history samples to keep (for scrolling mode) */
  historySize?: number
  /** Additional CSS classes */
  className?: string
}

type BarColor = "gray" | "white" | "accent"

const BAR_COLOR_MAP: Record<BarColor, { active: string; inactive: string }> = {
  gray: {
    active: "rgba(156, 163, 175, 0.8)",
    inactive: "rgba(156, 163, 175, 0.3)",
  },
  white: {
    active: "rgba(255, 255, 255, 0.8)",
    inactive: "rgba(255, 255, 255, 0.3)",
  },
  accent: {
    active: "rgba(34, 211, 238, 0.8)",
    inactive: "rgba(34, 211, 238, 0.3)",
  },
}

export function LiveWaveform({
  active = false,
  processing = false,
  height = 80,
  barWidth = 3,
  barGap = 2,
  mode = "static",
  fadeEdges = true,
  barColor = "gray",
  historySize = 120,
  className,
}: LiveWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const historyRef = useRef<number[]>(new Array(historySize).fill(0))
  const [isActive, setIsActive] = useState(false)

  const colors = BAR_COLOR_MAP[barColor]

  // Initialize audio context and analyser
  const initAudio = useCallback(async () => {
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("MediaDevices API not supported")
      return
    }

    try {
      // Use permissive audio constraints to avoid OverconstrainedError
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Don't specify exact constraints to avoid overconstraining
        },
      })
      streamRef.current = stream

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source

      setIsActive(true)
    } catch (error: any) {
      // Silently handle permission errors and overconstrained errors
      if (error.name === "NotAllowedError") {
        console.warn("Microphone permission denied")
      } else if (
        error.name === "OverconstrainedError" ||
        error.name === "ConstraintNotSatisfiedError"
      ) {
        console.warn("Microphone constraints not satisfied")
      } else {
        console.error("Failed to initialize audio:", error)
      }
    }
  }, [])

  // Cleanup audio resources
  const cleanupAudio = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsActive(false)
  }, [])

  // Handle active state changes
  useEffect(() => {
    if (active && !isActive) {
      initAudio()
    } else if (!active && isActive) {
      cleanupAudio()
    }

    return () => {
      if (!active) {
        cleanupAudio()
      }
    }
  }, [active, isActive, initAudio, cleanupAudio])

  // Draw waveform
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const canvasWidth = canvas.offsetWidth
    const canvasHeight = canvas.offsetHeight

    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Get audio data
    let volume = 0
    const dataArray = new Uint8Array(
      analyserRef.current ? analyserRef.current.frequencyBinCount : 128
    )

    if (analyserRef.current && active) {
      analyserRef.current.getByteFrequencyData(dataArray)
      volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255
    }

    if (mode === "static") {
      // Static bar visualization
      const barCount = Math.floor(canvasWidth / (barWidth + barGap))
      const barHeights: number[] = []

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length)
        const value = active ? dataArray[dataIndex] / 255 : 0
        barHeights.push(value)
      }

      // Apply fade edges
      const gradient = fadeEdges ? ctx.createLinearGradient(0, 0, canvasWidth, 0) : null

      if (gradient) {
        gradient.addColorStop(0, "transparent")
        gradient.addColorStop(0.1, "black")
        gradient.addColorStop(0.9, "black")
        gradient.addColorStop(1, "transparent")
      }

      // Draw bars
      barHeights.forEach((barHeight, i) => {
        const x = i * (barWidth + barGap)
        const barHeightPx = Math.max(4, barHeight * canvasHeight * 0.8)
        const y = (canvasHeight - barHeightPx) / 2

        ctx.fillStyle = active ? colors.active : colors.inactive
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeightPx, barWidth / 2)
        ctx.fill()
      })

      if (gradient) {
        ctx.globalCompositeOperation = "destination-in"
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        ctx.globalCompositeOperation = "source-over"
      }
    } else {
      // Scrolling waveform
      historyRef.current.shift()
      historyRef.current.push(volume)

      const points: { x: number; y: number }[] = []
      historyRef.current.forEach((vol, i) => {
        const x = (i / historySize) * canvasWidth
        const y = canvasHeight / 2 + (vol - 0.5) * canvasHeight * 0.8
        points.push({ x, y })
      })

      // Draw waveform line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }

      ctx.strokeStyle = active ? colors.active : colors.inactive
      ctx.lineWidth = 2
      ctx.stroke()

      // Apply fade edges
      if (fadeEdges) {
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0)
        gradient.addColorStop(0, "transparent")
        gradient.addColorStop(0.1, "black")
        gradient.addColorStop(0.9, "black")
        gradient.addColorStop(1, "transparent")

        ctx.globalCompositeOperation = "destination-in"
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        ctx.globalCompositeOperation = "source-over"
      }
    }

    // Processing animation
    if (processing) {
      const time = Date.now() / 1000
      const pulseAlpha = ((Math.sin(time * 3) + 1) / 2) * 0.3

      ctx.fillStyle = colors.active
      ctx.globalAlpha = pulseAlpha
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      ctx.globalAlpha = 1
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [active, processing, barWidth, barGap, mode, fadeEdges, colors, historySize])

  // Start/stop animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [draw])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [cleanupAudio])

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
    </div>
  )
}

export default LiveWaveform
