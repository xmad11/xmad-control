"use client"

import { useEffect, useRef } from "react"

/**
 * Pauses CSS animations when element is off-screen (Intersection Observer)
 * Zero re-renders, zero memory growth, single observer
 *
 * Usage:
 *   const ref = useVisibilityPause<HTMLDivElement>()
 *   <div ref={ref} className="marquee-container">...</div>
 */
export function useVisibilityPause<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current as T | null
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set CSS variable to pause/resume animation - no re-render
        el.style.setProperty("--marquee-play", entry.isIntersecting ? "running" : "paused")
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref as React.RefObject<T>
}
