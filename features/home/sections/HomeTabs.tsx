/* ═══════════════════════════════════════════════════════════════════════════════
   HOME TABS - For You, Restaurants, Stories
   Tab navigation with animated icons and vertical layout
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { type MouseEvent, useState } from "react"

const TABS = [
  { id: "for-you", label: "For You" },
  { id: "restaurants", label: "Restaurants" },
  { id: "stories", label: "Stories" },
] as const

export type TabId = (typeof TABS)[number]["id"]

export interface HomeTabsProps {
  activeTab?: TabId
  onTabChange?: (tabId: TabId) => void
}

// Lightweight animated SVG icons - CSS animations only (no Lottie overhead)
const ForYouIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--gray)]"}`}
    role="img"
    aria-label="For You"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      stroke="currentColor"
      strokeWidth="1.5"
      className={isActive ? "animate-pulse" : ""}
    />
  </svg>
)

const PlacesIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--gray)]"}`}
    role="img"
    aria-label="Restaurants"
  >
    <path d="M12 2L8 6H4V16L8 20H16L20 16V6H16L12 2Z" fill="currentColor" fillOpacity="0.3" />
    <path
      d="M12 2L8 6H4V16L8 20H16L20 16V6H16L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className={isActive ? "animate-[spin_3s_linear_infinite]" : ""}
      style={{ transformOrigin: "center" }}
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-60" />
  </svg>
)

const StoriesIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--gray)]"}`}
    role="img"
    aria-label="Stories"
  >
    <path
      d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className={isActive ? "animate-[spin_4s_linear_infinite]" : ""}
      style={{ transformOrigin: "center" }}
    />
  </svg>
)

export function HomeTabs({ activeTab: controlledActiveTab, onTabChange }: HomeTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabId>("for-you")
  const activeTab = controlledActiveTab ?? internalActiveTab

  function handleTabClick(e: MouseEvent<HTMLButtonElement>, tabId: TabId) {
    e.preventDefault()
    if (onTabChange) {
      onTabChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
  }

  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-md)]">
      {/* Tabs - vertical layout: icon on top, label below */}
      <div className="flex justify-around gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => handleTabClick(e, tab.id)}
              className="
                flex flex-col items-center justify-center gap-2
                flex-1 max-w-[calc(var(--spacing-md)*6.25)]
                px-[var(--spacing-md)] py-[var(--spacing-sm)]
                relative transition-all duration-[var(--duration-normal)]
                group
              "
            >
              {/* Icon */}
              <div className="relative">
                {tab.id === "for-you" && <ForYouIcon isActive={isActive} />}
                {tab.id === "restaurants" && <PlacesIcon isActive={isActive} />}
                {tab.id === "stories" && <StoriesIcon isActive={isActive} />}
              </div>

              {/* Label - similar to category titles but less bold */}
              <span
                className="
                  text-[var(--font-size-sm)]
                  font-[var(--font-weight-semibold)] tracking-tight
                  text-[var(--fg)]
                  transition-colors duration-200
                  whitespace-nowrap
                "
              >
                {tab.label}
              </span>

              {/* Bottom indicator - accent brand color */}
              <span
                className={`
                  absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full
                  bg-[var(--color-primary)]
                  transition-all duration-[var(--duration-normal)]
                  ${isActive ? "opacity-[var(--opacity-full)]" : "opacity-[var(--opacity-hidden)]"}
                `}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
