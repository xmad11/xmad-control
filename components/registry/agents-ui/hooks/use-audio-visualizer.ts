"use client"

import { useEffect, useMemo, useState } from "react"

export type AgentState =
  | "connecting"
  | "initializing"
  | "listening"
  | "thinking"
  | "speaking"
  | "idle"

// Bar visualizer hook
function generateConnectingSequenceBar(columns: number): number[][] {
  const seq = []
  for (let x = 0; x < columns; x++) {
    seq.push([x, columns - 1 - x])
  }
  return seq
}

function generateListeningSequenceBar(columns: number): number[][] {
  const center = Math.floor(columns / 2)
  return [[center], [-1]]
}

function getSequenceForState(state: AgentState | undefined, columns: number): number[][] {
  if (state === "thinking") {
    return generateListeningSequenceBar(columns)
  }
  if (state === "connecting" || state === "initializing") {
    return [...generateConnectingSequenceBar(columns)]
  }
  if (state === "listening") {
    return generateListeningSequenceBar(columns)
  }
  if (state === undefined || state === "speaking") {
    return [new Array(columns).fill(0).map((_, idx) => idx)]
  }
  return [[]]
}

export function useAudioVisualizerBarAnimator(
  state: AgentState | undefined,
  columns: number,
  interval: number
): number[] {
  const [index, setIndex] = useState(0)
  const sequence = useMemo(() => getSequenceForState(state, columns), [state, columns])

  useEffect(() => {
    let startTime = performance.now()
    let animationId: number | null = null

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime
      if (timeElapsed >= interval) {
        setIndex((prev) => prev + 1)
        startTime = time
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [interval])

  return sequence[index % sequence.length] ?? []
}

// Radial visualizer hook
function findGcdLessThan(columns: number, max: number = columns): number {
  function gcd(a: number, b: number): number {
    while (b !== 0) {
      const t = b
      b = a % b
      a = t
    }
    return a
  }
  for (let i = max; i >= 1; i--) {
    if (gcd(columns, i) === i) return i
  }
  return 1
}

function generateConnectingSequenceRadial(columns: number): number[][] {
  const seq = []
  const center = Math.floor(columns / 2)
  for (let x = 0; x < columns; x++) {
    seq.push([x, (x + center) % columns])
  }
  return seq
}

function generateListeningSequenceRadial(columns: number): number[][] {
  const divisor = columns > 8 ? columns / findGcdLessThan(columns, 4) : findGcdLessThan(columns, 2)
  return Array.from({ length: divisor }, (_, idx) => [
    ...Array(Math.floor(columns / divisor))
      .fill(1)
      .map((_, idx2) => idx2 * divisor + idx),
  ])
}

function getSequenceForStateRadial(state: AgentState | undefined, barCount: number): number[][] {
  if (state === "thinking") {
    return generateListeningSequenceRadial(barCount)
  }
  if (state === "connecting" || state === "initializing") {
    return generateConnectingSequenceRadial(barCount)
  }
  if (state === "listening") {
    return generateListeningSequenceRadial(barCount)
  }
  if (state === undefined || state === "speaking") {
    return [new Array(barCount).fill(0).map((_, idx) => idx)]
  }
  return [[]]
}

export function useAudioVisualizerRadialAnimator(
  state: AgentState | undefined,
  barCount: number,
  interval: number
): number[] {
  const [index, setIndex] = useState(0)
  const sequence = useMemo(() => getSequenceForStateRadial(state, barCount), [state, barCount])

  useEffect(() => {
    let startTime = performance.now()
    let animationId: number | null = null

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime
      if (timeElapsed >= interval) {
        setIndex((prev) => prev + 1)
        startTime = time
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [interval])

  return sequence[index % sequence.length] ?? []
}

// Grid visualizer hook
export interface Coordinate {
  x: number
  y: number
}

function generateConnectingSequenceGrid(
  rows: number,
  columns: number,
  radius: number
): Coordinate[] {
  const seq = []
  const centerY = Math.floor(rows / 2)
  const topLeft = {
    x: Math.max(0, centerY - radius),
    y: Math.max(0, centerY - radius),
  }
  const bottomRight = {
    x: columns - 1 - topLeft.x,
    y: Math.min(rows - 1, centerY + radius),
  }

  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    seq.push({ x, y: topLeft.y })
  }
  for (let y = topLeft.y + 1; y <= bottomRight.y; y++) {
    seq.push({ x: bottomRight.x, y })
  }
  for (let x = bottomRight.x - 1; x >= topLeft.x; x--) {
    seq.push({ x, y: bottomRight.y })
  }
  for (let y = bottomRight.y - 1; y > topLeft.y; y--) {
    seq.push({ x: topLeft.x, y })
  }
  return seq
}

function generateListeningSequenceGrid(rows: number, columns: number): Coordinate[] {
  const center = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) }
  return [
    center,
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
  ]
}

function generateThinkingSequenceGrid(rows: number, columns: number): Coordinate[] {
  const seq = []
  const y = Math.floor(rows / 2)
  for (let x = 0; x < columns; x++) {
    seq.push({ x, y })
  }
  for (let x = columns - 1; x >= 0; x--) {
    seq.push({ x, y })
  }
  return seq
}

function getSequenceForStateGrid(
  state: AgentState,
  rows: number,
  columns: number,
  radius: number
): Coordinate[] {
  const clampedRadius = radius
    ? Math.min(radius, Math.floor(Math.max(rows, columns) / 2))
    : Math.floor(Math.max(rows, columns) / 2)

  if (state === "thinking") {
    return generateThinkingSequenceGrid(rows, columns)
  }
  if (state === "connecting" || state === "initializing") {
    return [...generateConnectingSequenceGrid(rows, columns, clampedRadius)]
  }
  if (state === "listening") {
    return generateListeningSequenceGrid(rows, columns)
  }
  return [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }]
}

export function useAudioVisualizerGridAnimator(
  state: AgentState,
  rows: number,
  columns: number,
  interval: number,
  radius?: number
): Coordinate {
  const [index, setIndex] = useState(0)
  const effectiveRadius = radius ?? Math.floor(Math.max(rows, columns) / 2)
  const sequence = useMemo(
    () => getSequenceForStateGrid(state, rows, columns, effectiveRadius),
    [state, rows, columns, effectiveRadius]
  )

  useEffect(() => {
    if (state === "speaking") return

    const intervalId = setInterval(() => {
      setIndex((prev) => prev + 1)
    }, interval)

    return () => clearInterval(intervalId)
  }, [interval, state])

  return (
    sequence[index % sequence.length] ?? { x: Math.floor(columns / 2), y: Math.floor(rows / 2) }
  )
}
