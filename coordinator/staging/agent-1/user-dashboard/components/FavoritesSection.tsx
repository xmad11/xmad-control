/* ═══════════════════════════════════════════════════════════════════════════════
   FAVORITES SECTION - Saved restaurants and blogs
   Tab navigation with card grid
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { RestaurantCard } from "@/components/card"
import { DocumentTextIcon, HeartIcon } from "@/components/icons"
import { memo, useState } from "react"

type TabType = "restaurants" | "blogs"

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  tabId: TabType
}

/**
 * Tab button for favorites navigation
 */
function TabButton({ active, onClick, children, tabId }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${tabId}`}
      id={`tab-${tabId}`}
      onClick={onClick}
      className={`
        flex items-center gap-[var(--spacing-xs)]
        px-[var(--spacing-lg)] py-[var(--spacing-sm)]
        rounded-[var(--radius-full)]
        text-[var(--font-size-sm)] font-medium
        transition-all duration-[var(--duration-fast)]
        ${
          active
            ? "bg-[var(--color-primary)] text-[var(--color-white)]"
            : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
        }
      `}
    >
      {children}
    </button>
  )
}

/**
 * Favorites Section - Displays saved restaurants and blogs
 *
 * Features:
 * - Tab navigation between Restaurants and Blogs
 * - Horizontal scrollable card grid
 * - Empty state with CTA
 * - View all link
 */
export function FavoritesSection() {
  const [activeTab, setActiveTab] = useState<TabType>("restaurants")

  // TODO: Replace with actual favorites from localStorage/API
  const favoriteRestaurants = [
    {
      id: "1",
      title: "Al Fanar Restaurant",
      image: "/images/restaurants/1511671782779-c97d3d27a1d4-card.webp",
      rating: 4.7,
      location: "Dubai Festival City",
      cuisine: "Emirati",
      priceMin: 15,
      priceMax: 25,
    },
    {
      id: "2",
      title: "Operation Falafel",
      image: "/images/restaurants/1577106263724-2c8e03bfe9cf-card.webp",
      rating: 4.5,
      location: "Sheikh Zayed Road",
      cuisine: "Lebanese",
      priceMin: 10,
      priceMax: 20,
    },
  ]

  const favoriteBlogs = [
    {
      id: "1",
      title: "Best Brunch Spots in Dubai",
      image: "/images/restaurants/1493225457124-a3eb161ffa5f-card.webp",
      author: { name: "Sarah Ahmed" },
      category: "Food Guides",
      readTime: 5,
      excerpt: "Discover the most Instagrammable brunch spots...",
    },
  ]

  const hasFavorites =
    activeTab === "restaurants" ? favoriteRestaurants.length > 0 : favoriteBlogs.length > 0

  return (
    <section>
      {/* Section Header with Tabs */}
      <div className="flex items-center justify-between mb-[var(--spacing-md)]">
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Favorites</h2>

        {/* Tab Navigation */}
        <div role="tablist" className="flex items-center gap-[var(--spacing-xs)]">
          <TabButton
            active={activeTab === "restaurants"}
            onClick={() => setActiveTab("restaurants")}
            tabId="restaurants"
          >
            <HeartIcon
              className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]"
              aria-hidden="true"
            />
            Restaurants
          </TabButton>
          <TabButton
            active={activeTab === "blogs"}
            onClick={() => setActiveTab("blogs")}
            tabId="blogs"
          >
            <DocumentTextIcon
              className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]"
              aria-hidden="true"
            />
            Blogs
          </TabButton>
        </div>
      </div>

      {/* Empty State */}
      {!hasFavorites && (
        <div role="tabpanel" id="panel-empty" className="text-center py-[var(--spacing-4xl)]">
          <div className="flex items-center justify-center w-[var(--icon-size-3xl)] h-[var(--icon-size-3xl)] rounded-full bg-[var(--fg-5)] mx-auto mb-[var(--spacing-md)]">
            <HeartIcon className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)] text-[var(--fg-30)]" />
          </div>
          <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]">
            No favorites yet
          </h3>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-lg)]">
            Start saving your favorite places
          </p>
          <a
            href="/restaurants"
            className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
          >
            Explore Restaurants
          </a>
        </div>
      )}

      {/* Favorites Grid - Horizontal Scroll on Mobile */}
      {hasFavorites && (
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          className="flex gap-[var(--spacing-md)] overflow-x-auto pb-[var(--spacing-sm)] scrollbar-hide snap-x snap-mandatory"
        >
          {activeTab === "restaurants" &&
            favoriteRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="snap-start flex-shrink-0 w-[calc(50%-var(--spacing-sm)/2)]"
              >
                <RestaurantCard {...restaurant} variant="compact" />
              </div>
            ))}

          {activeTab === "blogs" &&
            favoriteBlogs.map((blog) => (
              <div
                key={blog.id}
                className="snap-start flex-shrink-0 w-[calc(50%-var(--spacing-sm)/2)]"
              >
                <RestaurantCard {...blog} variant="compact" />
              </div>
            ))}
        </div>
      )}

      {/* View All Link */}
      {hasFavorites && (
        <div className="mt-[var(--spacing-md)] text-right">
          <a
            href="/favorites"
            className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-[var(--spacing-xs)]"
          >
            View all
            <svg
              className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </section>
  )
}
