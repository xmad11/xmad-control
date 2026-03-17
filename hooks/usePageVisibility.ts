/* ═══════════════════════════════════════════════════════════════════════════════
   USE PAGE VISIBILITY - Pause operations when tab is hidden
   Uses Page Visibility API for performance optimization
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useEffect, useState } from "react"

/**
 * Hook that returns whether the page is currently visible.
 * Uses the Page Visibility API to detect tab visibility.
 *
 * @returns {boolean} isVisible - true if the page is visible to the user
 *
 * @example
 * const isVisible = usePageVisibility()
 * useEffect(() => {
 *   if (isVisible) {
 *     // Start polling
 *   } else {
 *     // Pause polling
 *   }
 * }, [isVisible])
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if document is defined (SSR safety)
    if (typeof document === "undefined") return

    // Set initial state
    setIsVisible(!document.hidden)

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return isVisible
}

/**
 * Hook that returns a callback for running operations only when visible.
 * Automatically pauses when tab is hidden and resumes when visible.
 *
 * @param callback - Function to run when page is visible
 * @param interval - Interval in milliseconds
 *
 * @example
 * useVisibleInterval(() => {
 *   fetchStats()
 * }, 5000)
 */
export function useVisibleInterval(callback: () => void, interval: number): void {
  const isVisible = usePageVisibility()

  useEffect(() => {
    if (!isVisible) return

    // Run immediately when becoming visible
    callback()

    // Set up interval
    const intervalId = setInterval(callback, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [callback, interval, isVisible])
}

export { usePageVisibility as useTabVisibility }

/* ═══════════════════════════════════════════════════════════════════════════════
   USE VISIBILITY PAUSE - Pause animations when element is not visible
   Uses Intersection Observer for performance optimization
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useRef } from "react"

/**
 * Hook that returns a ref to attach to an element and pauses animations
 * when the element is not visible in the viewport.
 *
 * @example
 * const ref = useVisibilityPause<HTMLDivElement>()
 * return <div ref={ref}>...</div>
 */
export function useVisibilityPause<
  T extends HTMLElement = HTMLDivElement,
>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)
  const [_isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)

          // Add/remove class to control animations
          if (entry.isIntersecting) {
            element.classList.remove("animation-paused")
            element.classList.add("animation-playing")
          } else {
            element.classList.add("animation-paused")
            element.classList.remove("animation-playing")
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "50px", // Start slightly before element enters viewport
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return ref
}

export { useVisibilityPause as useAnimationPause }
