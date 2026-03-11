/**
 * Favorites Page - Complete with localStorage functionality
 *
 * Full implementation with tabbed navigation, sort options,
 * remove all button, and localStorage persistence.
 * Uses design tokens exclusively.
 */

"use client"

import { RestaurantCard } from "@/components/card"
import { DocumentTextIcon, TrashIcon } from "@/components/icons"
import { PageContainer } from "@/components/layout/PageContainer"
import { memo, useCallback, useState } from "react"
import { FavoritesEmptyState } from "./EmptyState"
import { FavoriteButton } from "./FavoriteButton"
import { FavoritesSortDropdown } from "./SortDropdown"
import type { FavoriteSortOption, FavoriteType } from "./types"
import { useFavorites } from "./useFavorites"

// ============================================================================
// TAB BUTTON COMPONENT
// ============================================================================()

interface TabButtonProps {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}

function TabButton({ active, onClick, count, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] text-[var(--font-size-base)] font-medium transition-all duration-[var(--duration-fast)] ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
      }`}
    >
      {children}
      {count > 0 && (
        <span
          className={`flex items-center justify-center h-[var(--icon-size-md)] w-[var(--icon-size-md)] rounded-full text-[var(--font-size-2xs)] font-medium ${
            active ? "bg-white/20" : "bg-[var(--fg-10)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// ============================================================================
// CONFIRM DIALOG COMPONENT
// ============================================================================

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--fg-80)]">
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-xl)] rounded-[var(--radius-xl)] bg-[var(--bg)] shadow-[var(--shadow-2xl)] max-w-[var(--max-w-xl)] w-full mx-[var(--spacing-md)]">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">{title}</h3>
        <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">{message}</p>
        <div className="flex items-center justify-end gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90"
          >
            Remove All
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================()

type TabType = "restaurants" | "blogs"

function FavoritesPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>("restaurants")
  const [sortOption, setSortOption] = useState<FavoriteSortOption>("recent")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Favorites hook with localStorage
  const { favorites, isFavorite, removeFavorite, clearAll, getFavoritesByType } = useFavorites()

  // Get current tab's favorites
  const currentFavorites = getFavoritesByType(activeTab, sortOption)
  const hasFavorites = currentFavorites.length > 0

  // Handle remove single favorite
  const handleRemoveFavorite = useCallback(
    (id: string) => {
      removeFavorite(id, activeTab)
    },
    [activeTab, removeFavorite]
  )

  // Handle clear all
  const handleClearAll = useCallback(() => {
    clearAll(activeTab)
    setShowConfirmDialog(false)
  }, [activeTab, clearAll])

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]">
        <PageContainer>
          {/* Page Header */}
          <section className="py-[var(--spacing-3xl)]">
            <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
              Your <span className="text-[var(--color-primary)] italic">Favorites</span>
            </h1>
            <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
              All your saved places in one spot
            </p>
          </section>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-[var(--spacing-xl)]">
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <TabButton
                active={activeTab === "restaurants"}
                onClick={() => setActiveTab("restaurants")}
                count={favorites.restaurants.length}
              >
                Restaurants
              </TabButton>
              <TabButton
                active={activeTab === "blogs"}
                onClick={() => setActiveTab("blogs")}
                count={favorites.blogs.length}
              >
                <DocumentTextIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Blogs
              </TabButton>
            </div>

            {/* Actions */}
            {hasFavorites && (
              <div className="flex items-center gap-[var(--spacing-sm)]">
                {/* Sort Dropdown */}
                <FavoritesSortDropdown value={sortOption} onChange={setSortOption} />

                {/* Remove All Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(true)}
                  className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg-70)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:border-[var(--color-error)] hover:text-[var(--color-error)]"
                >
                  <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                  Remove All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {!hasFavorites && (
            <FavoritesEmptyState
              type={activeTab}
              cta={{
                label: activeTab === "restaurants" ? "Explore Restaurants" : "Explore Blogs",
                href: activeTab === "restaurants" ? "/restaurants" : "/blog",
              }}
            />
          )}

          {/* Favorites Grid - Restaurants */}
          {hasFavorites && activeTab === "restaurants" && (
            <>
              {/* Results Count */}
              <div className="mb-[var(--spacing-md)]">
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  <span className="font-semibold text-[var(--fg)]">{currentFavorites.length}</span>{" "}
                  saved restaurants
                </p>
              </div>

              {/* Restaurant Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
                {currentFavorites.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Restaurant Card */}
                    <RestaurantCard
                      variant="compact"
                      name={item.name}
                      slug={item.slug}
                      image={item.image}
                      cuisine={item.cuisine}
                      location={item.location}
                      rating={item.rating}
                      priceRange={item.priceRange}
                    />

                    {/* Remove Button (appears on hover) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(item.restaurantId)}
                      className="absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] p-[var(--spacing-xs)] rounded-full bg-[var(--color-error)] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] hover:scale-110"
                      aria-label="Remove from favorites"
                    >
                      <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                    </button>

                    {/* Favorite Indicator */}
                    <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)]">
                      <FavoriteButton
                        isFavorite={true}
                        onToggle={() => handleRemoveFavorite(item.restaurantId)}
                        size="sm"
                        iconOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Favorites Grid - Blogs */}
          {hasFavorites && activeTab === "blogs" && (
            <>
              {/* Results Count */}
              <div className="mb-[var(--spacing-md)]">
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  <span className="font-semibold text-[var(--fg)]">{currentFavorites.length}</span>{" "}
                  saved blog posts
                </p>
              </div>

              {/* Blog Grid - Simple card layout */}
              <div className="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
                {currentFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="relative group flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)] hover:shadow-[var(--shadow-md)] transition-shadow duration-[var(--duration-fast)]"
                  >
                    {/* Remove Button (appears on hover) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(item.blogId)}
                      className="absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] p-[var(--spacing-xs)] rounded-full bg-[var(--color-error)] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] hover:scale-110"
                      aria-label="Remove from favorites"
                    >
                      <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                    </button>

                    {/* Favorite Indicator */}
                    <div className="absolute top-[var(--spacing-sm)] left-[var(--spacing-sm)]">
                      <FavoriteButton
                        isFavorite={true}
                        onToggle={() => handleRemoveFavorite(item.blogId)}
                        size="sm"
                        iconOnly
                      />
                    </div>

                    {/* Blog Cover Image */}
                    <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-md)]">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Blog Content */}
                    <div className="flex flex-col gap-[var(--spacing-xs)]">
                      <span className="text-[var(--font-size-xs)] text-[var(--color-primary)] font-medium uppercase">
                        {item.category}
                      </span>
                      <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] line-clamp-2">
                        {item.excerpt}
                      </p>
                      <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
                        {item.author} • {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Link to Blog */}
                    <a
                      href={`/blog/${item.slug}`}
                      className="mt-auto text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={showConfirmDialog}
            title={`Remove All ${activeTab === "restaurants" ? "Restaurants" : "Blogs"}?`}
            message={`Are you sure you want to remove all ${activeTab} from your favorites? This action cannot be undone.`}
            onConfirm={handleClearAll}
            onCancel={() => setShowConfirmDialog(false)}
          />
        </PageContainer>
      </main>
    </div>
  )
}

export const FavoritesPageClient = memo(FavoritesPageClient)
