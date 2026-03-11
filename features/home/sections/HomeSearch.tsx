/* ═══════════════════════════════════════════════════════════════════════════════
   HOME SEARCH - Intent router (NO real search)
   Routes user intent to /restaurants or /blog based on query keywords
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { MagnifyingGlassIcon } from "@/components/icons"
import { useRouter } from "next/navigation"
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react"

// Animated placeholder messages
const PLACEHOLDER_MESSAGES = [
  "Search restaurants, cuisines, dishes…",
  "Top rated restaurants",
  "Best brunch spots",
  "Outdoor seating",
  "Family friendly places",
  "Romantic dinner",
  "Seafood specialists",
  "Budget-friendly eats",
  "Fine dining",
  "Pet friendly cafes",
  "Vegetarian options",
  "Hotel restaurants",
  "Buffet style",
  "Coffee & desserts",
  "Late night delivery",
  "Hidden gems",
  "Popular this week",
] as const

/**
 * HomeSearch - Lightweight intent router
 *
 * What it DOES:
 * - Capture search input
 * - Detect intent (restaurant vs blog)
 * - Route to correct page
 *
 * What it does NOT do:
 * - No API calls
 * - No filtering
 * - No result rendering
 * - No virtualization
 *
 * Intent Detection Rules:
 * - Blog intent: "how", "guide", "tips", "best", "article", "review", "top"
 * - Restaurant intent: everything else (default)
 */
export function HomeSearch() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Animated placeholder cycle
  useEffect(() => {
    if (isFocused || value) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isFocused, value])

  const currentPlaceholder = PLACEHOLDER_MESSAGES[placeholderIndex]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const q = value.trim().toLowerCase()
    if (!q) return

    // Simple intent detection (rule-based, no AI)
    const isBlogIntent =
      q.includes("how") ||
      q.includes("guide") ||
      q.includes("tips") ||
      q.includes("article") ||
      q.includes("review") ||
      (q.includes("best") && q.includes("in")) // "best pizza in dubai" = blog

    // Route to correct page
    router.push(
      isBlogIntent
        ? `/blog?query=${encodeURIComponent(value)}`
        : `/restaurants?query=${encodeURIComponent(value)}`
    )
  }

  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-sm)] lg:pt-[var(--spacing-2xl)] pb-[var(--spacing-md)]">
      {/* Intent router form - constrained width to match /restaurants */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={currentPlaceholder}
            className="w-full pl-[var(--spacing-lg)] pr-[calc(var(--spacing-lg)*3)] min-h-[calc(var(--spacing-md)*3)] py-[var(--spacing-sm)] bg-[var(--bg)] border border-[var(--fg-20)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--font-size-base)] text-[var(--fg)] placeholder:opacity-[var(--opacity-muted)] rounded-full"
            aria-label="Search restaurants or blogs"
          />
          {/* Circular search button */}
          <button
            type="submit"
            className="absolute right-[var(--spacing-xs)] top-1/2 -translate-y-1/2 h-[calc(100%-var(--spacing-sm)*2)] aspect-square flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/15 transition-colors"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-primary)]" />
          </button>
        </div>
      </form>
    </section>
  )
}
