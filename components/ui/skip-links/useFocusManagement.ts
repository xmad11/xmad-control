"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Focus Management Hook
 *
 * Provides utilities for managing focus in accessibility contexts:
 * - Focus trapping for modals and dropdowns
 * - Focus restoration after closing elements
 * - Keyboard navigation within focusable elements
 */

export interface UseFocusManagementProps {
  isTrapped?: boolean
  restoreFocusTo?: HTMLElement | null
  onTrap?: () => void
  onRelease?: () => void
}

export function useFocusManagement({
  isTrapped = false,
  restoreFocusTo,
  onTrap,
  onRelease,
}: UseFocusManagementProps = {}) {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "a[href]",
      "area[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      "summary",
      "iframe",
    ].join(", ")

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }, [])

  const focusFirstElement = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container)
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
        return true
      }
      return false
    },
    [getFocusableElements]
  )

  const focusLastElement = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container)
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus()
        return true
      }
      return false
    },
    [getFocusableElements]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isTrapped || !containerRef.current) return

      const container = containerRef.current
      const focusableElements = getFocusableElements(container)
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

      switch (e.key) {
        case "Tab":
          e.preventDefault()
          if (e.shiftKey) {
            if (currentIndex > 0) {
              focusableElements[currentIndex - 1].focus()
            } else {
              focusLastElement(container)
            }
          } else {
            if (currentIndex < focusableElements.length - 1) {
              focusableElements[currentIndex + 1].focus()
            } else {
              focusFirstElement(container)
            }
          }
          break

        case "Escape":
          if (onRelease) {
            onRelease()
          }
          break
      }
    },
    [isTrapped, getFocusableElements, focusFirstElement, focusLastElement, onRelease]
  )

  useEffect(() => {
    if (isTrapped && containerRef.current) {
      previousFocusRef.current = document.activeElement as HTMLElement
      focusFirstElement(containerRef.current)
      document.addEventListener("keydown", handleKeyDown)

      if (onTrap) {
        onTrap()
      }
    } else {
      document.removeEventListener("keydown", handleKeyDown)

      if (previousFocusRef.current && !isTrapped) {
        previousFocusRef.current.focus()
      } else if (restoreFocusTo && !isTrapped) {
        restoreFocusTo.focus()
      }

      if (onRelease && !isTrapped) {
        onRelease()
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isTrapped, handleKeyDown, focusFirstElement, onTrap, onRelease, restoreFocusTo])

  useEffect(() => {
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  }
}

/**
 * Focus restoration hook for preserving focus across re-renders
 */
export function useFocusRestoration() {
  const focusRef = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    focusRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (focusRef.current && typeof focusRef.current.focus === "function") {
      focusRef.current.focus()
    }
  }, [])

  const clearFocus = useCallback(() => {
    focusRef.current = null
  }, [])

  return {
    saveFocus,
    restoreFocus,
    clearFocus,
    currentFocus: focusRef.current,
  }
}

/**
 * Announce to screen readers
 */
export function useAnnouncer() {
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div")
    announcement.setAttribute("role", "status")
    announcement.setAttribute("aria-live", priority)
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }, [])

  return { announce }
}
