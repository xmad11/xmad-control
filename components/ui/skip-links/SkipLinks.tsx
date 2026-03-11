"use client"

import { useEffect, useState } from "react"
import { useFocusManagement } from "./useFocusManagement"

interface SkipLinksProps {
  additionalLinks?: {
    id: string
    label: string
  }[]
}

/**
 * SkipLinks Component
 *
 * Provides skip navigation links for keyboard users to bypass repetitive content
 * and jump directly to main sections of the page.
 *
 * WCAG 2.1 AA Compliance: 2.4.1 Bypass Blocks
 *
 * Features:
 * - 4 default skip links (main content, navigation, search, footer)
 * - Tab key detection to show links
 * - Smooth scroll to targets
 * - Screen reader announcements
 * - Focus restoration
 *
 * @example
 * ```tsx
 * function Layout() {
 *   return (
 *     <>
 *       <SkipLinks />
 *       <nav id="navigation">...</nav>
 *       <main id="main-content">...</main>
 *       <footer id="footer">...</footer>
 *     </>
 *   )
 * }
 * ```
 */
export function SkipLinks({ additionalLinks = [] }: SkipLinksProps) {
  const [isFocused, setIsFocused] = useState(false)
  const { getFocusableElements } = useFocusManagement()

  const defaultLinks = [
    { id: "main-content", label: "Skip to main content" },
    { id: "navigation", label: "Skip to navigation" },
    { id: "search", label: "Skip to search" },
    { id: "footer", label: "Skip to footer" },
  ]

  const skipLinks = [...defaultLinks, ...additionalLinks]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsFocused(true)
      }
    }

    const handleMouseDown = () => {
      setIsFocused(false)
    }

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("skip-link")) {
        setIsFocused(true)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement

      if (
        target.classList.contains("skip-link") &&
        relatedTarget &&
        !relatedTarget.classList.contains("skip-link")
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("focusout", handleFocusOut)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("focusout", handleFocusOut)
    }
  }, [])

  return (
    <div
      className={`
				fixed top-0 left-0 z-[100]
				flex flex-col gap-[var(--spacing-xs)]
				p-[var(--spacing-sm)]
				transform -translate-y-full
				transition-transform duration-[var(--duration-fast)]
				${isFocused ? "translate-y-0" : ""}
			`}
      aria-label="Skip navigation links"
    >
      {skipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault()
            const targetElement = document.getElementById(link.id)
            if (targetElement) {
              targetElement.focus()
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })

              const announcement = document.createElement("div")
              announcement.setAttribute("role", "status")
              announcement.setAttribute("aria-live", "polite")
              announcement.className = "sr-only"
              announcement.textContent = `Navigated to ${link.id.replace(/-/g, " ")}`
              document.body.appendChild(announcement)

              setTimeout(() => {
                if (announcement.parentNode) {
                  document.body.removeChild(announcement)
                }
              }, 1000)
            }
          }}
          className={`
						skip-link
						block px-[var(--spacing-md)] py-[var(--spacing-xs)]
						bg-[var(--color-primary)]
						text-[var(--color-white)]
						rounded-[var(--radius-md)]
						text-[var(--font-size-sm)] font-medium
						focus:outline-none
						hover:bg-[var(--color-primary)]/90
						shadow-[var(--shadow-lg)]
						whitespace-nowrap
					`}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
