/* ═══════════════════════════════════════════════════════════════════════════════
   MORPHING TEXT - Optimized with pause-when-off-screen
   Visual: EXACTLY THE SAME as original
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

const MORPH_TIME = 1.5
const COOLDOWN_TIME = 0.5

const useMorphingText = (texts: string[], isPaused: boolean) => {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(performance.now())

  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const memoizedTexts = useMemo(() => texts, [texts])

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      current2.style.opacity = `${fraction ** 0.4 * 100}%`

      const invertedFraction = 1 - fraction
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`
      current1.style.opacity = `${invertedFraction ** 0.4 * 100}%`

      current1.textContent = memoizedTexts[textIndexRef.current % memoizedTexts.length]
      current2.textContent = memoizedTexts[(textIndexRef.current + 1) % memoizedTexts.length]
    },
    [memoizedTexts]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / MORPH_TIME

    if (fraction > 1) {
      cooldownRef.current = COOLDOWN_TIME
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1) {
      textIndexRef.current++
    }
  }, [setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const [current1, current2] = [text1Ref.current, text2Ref.current]
    if (current1 && current2) {
      current2.style.filter = "none"
      current2.style.opacity = "100%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
    }
  }, [])

  useEffect(() => {
    // Pause animation when off-screen (memory optimization)
    if (isPaused) return

    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = performance.now()
      const dt = (now - timeRef.current) / 1000
      timeRef.current = now

      cooldownRef.current -= dt

      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }

    animate()
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown, isPaused])

  return { text1Ref, text2Ref, containerRef }
}

interface MorphingTextProps {
  className?: string
  texts: string[]
}

const Texts = memo<Pick<MorphingTextProps, "texts"> & { isPaused: boolean }>(
  ({ texts, isPaused }) => {
    const { text1Ref, text2Ref, containerRef } = useMorphingText(texts, isPaused)

    const getWidestWord = useMemo(
      () => [...texts].sort((a, b) => b.length - a.length)[0] || texts[0],
      [texts]
    )

    return (
      <div
        ref={containerRef}
        className="relative inline-block leading-none contain-optimization [filter:url(#threshold)_blur(0.6px)]"
      >
        <span className="inline-block opacity-0 leading-none">{getWidestWord}</span>
        <span className="absolute left-0 right-0 top-0 text-center leading-none" ref={text1Ref} />
        <span className="absolute left-0 right-0 top-0 text-center leading-none" ref={text2Ref} />
      </div>
    )
  }
)
Texts.displayName = "MorphTexts"

const SvgFilters = memo(() => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
))
SvgFilters.displayName = "SvgFilters"

export const MorphingText = memo<MorphingTextProps>(({ texts, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Simple visibility check - pause when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsPaused(!entry.isIntersecting), {
      threshold: 0.1,
      rootMargin: "100px",
    })

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative inline-block leading-none align-middle${className ? ` ${className}` : ""}`}
    >
      <Texts texts={texts} isPaused={isPaused} />
      <SvgFilters />
    </div>
  )
})
MorphingText.displayName = "MorphingText"
