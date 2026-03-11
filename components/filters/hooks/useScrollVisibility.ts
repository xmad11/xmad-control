/* ═══════════════════════════════════════════════════════════════════════════════
   USE SCROLL VISIBILITY - Hide/show filter bar on scroll
   Uses header animation timing, opposite direction
   Hides filters when reaching bottom of page
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react"

// Design token: --filter-scroll-threshold: 3.125rem (50px)
const SCROLL_HIDE_THRESHOLD_PX = 50
// Hide filters when within this distance from bottom
const BOTTOM_HIDE_THRESHOLD_PX = 300

export function useScrollVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const distanceFromBottom = documentHeight - (currentScrollY + windowHeight)

      // Hide when near bottom of page (highest priority)
      if (distanceFromBottom < BOTTOM_HIDE_THRESHOLD_PX) {
        setIsVisible(false)
      }
      // Show when at top of page
      else if (currentScrollY < SCROLL_HIDE_THRESHOLD_PX) {
        setIsVisible(true)
      }
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return isVisible
}
