/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED SECTION COMPONENTS - Memory-optimized, reusable components
   Uses real mock data with proper slugs for linking to detail pages
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  type ShadiRestaurantWithBlurHash,
  mockRestaurantsWithBlurHash,
} from "@/__mock__/restaurants-with-blurhash"
import { OptimizedPreviewCard } from "@/components/cards/optimized"
import { SkeletonPreviewCard } from "@/components/cards/preview"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { memo, useCallback, useMemo, useRef, useState } from "react"

/**
 * Section wrapper with memoized title parsing and clickable navigation
 */
export interface SectionProps {
  title: string
  categorySlug?: string
  children: React.ReactNode
}

export const Section = memo(function Section({ title, categorySlug, children }: SectionProps) {
  // Memoize string operations to prevent re-creation on every render
  const { firstWord, restOfTitle } = useMemo(() => {
    const words = title.split(" ")
    return {
      firstWord: words[0],
      restOfTitle: words.slice(1).join(" "),
    }
  }, [title])

  return (
    <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--spacing-md)] lg:px-[var(--spacing-sm)] py-[var(--spacing-xl)]">
      <div className="flex items-center justify-between mb-[var(--spacing-md)]">
        <Link
          href={categorySlug || "/restaurants"}
          className="hover:opacity-[var(--opacity-muted)] transition-opacity duration-[var(--duration-normal)]"
        >
          <h2 className="text-[var(--font-size-2xl)] font-black tracking-tight text-[var(--fg)]">
            {firstWord}{" "}
            {restOfTitle && (
              <span className="text-[var(--color-primary)] italic">{restOfTitle}</span>
            )}
          </h2>
        </Link>
        <Link
          href={categorySlug || "/restaurants"}
          className="hover:scale-[var(--hover-scale-factor)] transition-transform duration-[var(--duration-normal)]"
          aria-label="View all"
        >
          <ArrowRight className="w-[var(--font-size-2xl)] h-[var(--font-size-2xl)] text-[var(--fg)] mr-[var(--spacing-xs)]" />
        </Link>
      </div>
      {children}
    </section>
  )
})

/**
 * Pre-create card indices array to prevent Array.from() on every render
 */
const _CARD_INDICES = Array.from({ length: 8 }, (_, i) => i)

/**
 * Horizontal Scroll Cards - Memory-optimized with preview cards
 * Uses real mock restaurant data with proper slugs
 * Includes a "Show More" card at the end
 */
export interface ScrollableCardsProps {
  itemCount: number
  categorySlug?: string
  cardType?: "restaurant"
}

export const ScrollableCards = memo(function ScrollableCards({
  itemCount,
  categorySlug = "/restaurants",
  cardType = "restaurant",
}: ScrollableCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Get first N restaurants from mock data with blurhash (already shuffled in mock)
  const displayRestaurants: ShadiRestaurantWithBlurHash[] = useMemo(
    () => mockRestaurantsWithBlurHash.slice(0, itemCount),
    [itemCount]
  )

  // Scroll handlers
  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }, [])

  // Update scroll button visibility
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1)
  }, [])

  return (
    <div className="relative group">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-[var(--spacing-xl)] bg-gradient-to-r from-[var(--bg)] to-transparent flex items-center justify-start pl-[var(--spacing-sm)] opacity-[var(--opacity-hidden)] group-hover:opacity-[var(--opacity-full)] transition-opacity duration-[var(--duration-normal)]"
          aria-label="Scroll left"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--fg-10)] rounded-full p-[var(--spacing-xs)] shadow-[var(--shadow-lg)]">
            <ChevronLeft className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--fg)]" />
          </div>
        </button>
      )}

      {/* Scrollable cards container */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-[var(--spacing-md)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-md)] scrollbar-hide snap-x snap-mandatory snap-start scroll-smooth"
      >
        {/* Restaurant Cards */}
        {displayRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="flex-shrink-0 w-[var(--card-width-mobile)] sm:w-[var(--card-width-sm)] md:w-[var(--card-width-md)] lg:w-[var(--card-width-lg)] xl:w-[var(--card-width-xl)] snap-start"
          >
            <OptimizedPreviewCard
              id={restaurant.id}
              title={restaurant.name}
              image={restaurant.image}
              blurHash={restaurant.blurHash}
              cuisine={restaurant.cuisine}
              rating={restaurant.rating}
              href={`/restaurants/${restaurant.slug}`}
              location={`${restaurant.district}, ${restaurant.emirate}`}
            />
          </div>
        ))}

        {/* Show More Card */}
        <div className="flex-shrink-0 w-[var(--card-width-mobile)] sm:w-[var(--card-width-sm)] md:w-[var(--card-width-md)] lg:w-[var(--card-width-lg)] xl:w-[var(--card-width-xl)] snap-start">
          <SkeletonPreviewCard href={categorySlug} label="Show more" />
        </div>
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-[var(--spacing-xl)] bg-gradient-to-l from-[var(--bg)] to-transparent flex items-center justify-end pr-[var(--spacing-sm)] opacity-[var(--opacity-hidden)] group-hover:opacity-[var(--opacity-full)] transition-opacity duration-[var(--duration-normal)]"
          aria-label="Scroll right"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--fg-10)] rounded-full p-[var(--spacing-xs)] shadow-[var(--shadow-lg)]">
            <ChevronRight className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--fg)]" />
          </div>
        </button>
      )}
    </div>
  )
})
