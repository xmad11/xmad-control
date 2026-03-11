/* ═══════════════════════════════════════════════════════════════════════════════
   FAVORITES PAGE - Saved restaurants and blogs
   Tab navigation with localStorage persistence via useFavorites hook
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { RestaurantCard } from "@/components/card"
import { DocumentTextIcon, HeartIcon } from "@/components/icons"
import { DocumentTextIcon as DocumentTextSolidIcon } from "@/components/icons"
import { PageContainer } from "@/components/layout/PageContainer"
import { memo, useState } from "react"
import { type FavoriteBlog, type FavoriteRestaurant, useFavorites } from "./hooks/useFavorites"

type TabType = "restaurants" | "blogs"

/**
 * Tab Button Component
 */
interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-[var(--spacing-xs)]
        px-[var(--spacing-lg)] py-[var(--spacing-sm)]
        rounded-[var(--radius-full)]
        text-[var(--font-size-base)] font-medium
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
 * Favorites Page Component
 *
 * Features:
 * - Tab navigation (Restaurants/Blogs)
 * - localStorage persistence via useFavorites hook
 * - Empty state with call-to-action
 * - Favorite count display
 * - Remove from favorites functionality
 */
export function FavoritesPage() {
  const {
    favoriteRestaurants,
    favoriteBlogs,
    isRestaurantFavorite,
    toggleRestaurant,
    removeRestaurant,
    removeBlog,
  } = useFavorites()

  const [activeTab, setActiveTab] = useState<TabType>("restaurants")

  const hasRestaurantFavorites = favoriteRestaurants.length > 0
  const hasBlogFavorites = favoriteBlogs.length > 0
  const hasFavorites = hasRestaurantFavorites || hasBlogFavorites

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
            <p className="text-[var(--font-size-lg)] text-[var(--fg-60)]">
              All your saved places in one spot
            </p>
          </section>

          {/* Tab Navigation */}
          <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-xl)]">
            <TabButton
              active={activeTab === "restaurants"}
              onClick={() => setActiveTab("restaurants")}
            >
              <HeartIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Restaurants
              {hasRestaurantFavorites && (
                <span className="ml-[var(--spacing-xs)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-full)] bg-[var(--color-white)]/20 text-[var(--font-size-xs)]">
                  {favoriteRestaurants.length}
                </span>
              )}
            </TabButton>
            <TabButton active={activeTab === "blogs"} onClick={() => setActiveTab("blogs")}>
              <DocumentTextIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Blogs
              {hasBlogFavorites && (
                <span className="ml-[var(--spacing-xs)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-full)] bg-[var(--color-white)]/20 text-[var(--font-size-xs)]">
                  {favoriteBlogs.length}
                </span>
              )}
            </TabButton>
          </div>

          {/* Empty State */}
          {!hasFavorites && <EmptyState />}

          {/* Restaurants Tab */}
          {hasFavorites &&
            activeTab === "restaurants" &&
            (hasRestaurantFavorites ? (
              <>
                <div className="mb-[var(--spacing-md)]">
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                    <span className="font-semibold text-[var(--fg)]">
                      {favoriteRestaurants.length}
                    </span>{" "}
                    saved restaurants
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
                  {favoriteRestaurants.map((restaurant) => (
                    <FavoriteRestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onRemove={() => removeRestaurant(restaurant.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyTabState type="restaurants" />
            ))}

          {/* Blogs Tab */}
          {hasFavorites &&
            activeTab === "blogs" &&
            (hasBlogFavorites ? (
              <>
                <div className="mb-[var(--spacing-md)]">
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                    <span className="font-semibold text-[var(--fg)]">{favoriteBlogs.length}</span>{" "}
                    saved blogs
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
                  {favoriteBlogs.map((blog) => (
                    <FavoriteBlogCard
                      key={blog.id}
                      blog={blog}
                      onRemove={() => removeBlog(blog.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyTabState type="blogs" />
            ))}
        </PageContainer>
      </main>
    </div>
  )
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="text-center py-[var(--spacing-5xl)]">
      <HeartIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
      <h2 className="text-[var(--font-size-2xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
        No favorites yet
      </h2>
      <p className="text-[var(--font-size-base)] text-[var(--fg-60)] mb-[var(--spacing-xl)]">
        Start saving your favorite restaurants and blogs
      </p>
      <a
        href="/restaurants"
        className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
      >
        Explore Restaurants
      </a>
    </div>
  )
}

/**
 * Empty Tab State Component
 */
interface EmptyTabStateProps {
  type: "restaurants" | "blogs"
}

function EmptyTabState({ type }: EmptyTabStateProps) {
  const isRestaurants = type === "restaurants"

  return (
    <div className="text-center py-[var(--spacing-5xl)]">
      {isRestaurants ? (
        <HeartIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
      ) : (
        <DocumentTextSolidIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
      )}
      <h2 className="text-[var(--font-size-2xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
        No favorite {type} yet
      </h2>
      <p className="text-[var(--font-size-base)] text-[var(--fg-60)] mb-[var(--spacing-xl)]">
        {isRestaurants ? "Start saving restaurants you love" : "Save blog posts to read later"}
      </p>
      {isRestaurants && (
        <a
          href="/restaurants"
          className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
        >
          Explore Restaurants
        </a>
      )}
    </div>
  )
}

/**
 * Favorite Restaurant Card with Remove Option
 */
interface FavoriteRestaurantCardProps {
  restaurant: FavoriteRestaurant
  onRemove: () => void
}

function FavoriteRestaurantCard({ restaurant, onRemove }: FavoriteRestaurantCardProps) {
  const [_showRemove, _setShowRemove] = useState(false)

  return (
    <div className="relative group">
      <RestaurantCard variant="compact" {...restaurant} />
      <button
        type="button"
        onClick={onRemove}
        className={`
          absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] z-10
          p-[var(--spacing-xs)] rounded-[var(--radius-full)]
          bg-[var(--bg)]/90 backdrop-blur-sm border border-[var(--fg-10)]
          text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-white)]
          transition-all opacity-0 group-hover:opacity-100
        `}
        aria-label="Remove from favorites"
      >
        <HeartIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
      </button>
    </div>
  )
}

/**
 * Favorite Blog Card with Remove Option
 */
interface FavoriteBlogCardProps {
  blog: FavoriteBlog
  onRemove: () => void
}

function FavoriteBlogCard({ blog, onRemove }: FavoriteBlogCardProps) {
  return (
    <div className="relative group p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--fg-20)] transition-colors">
      {/* Blog Card Content */}
      <div className="mb-[var(--spacing-md)]">
        <div className="relative h-[120px] rounded-[var(--radius-md)] bg-[var(--fg-5)] overflow-hidden mb-[var(--spacing-sm)]">
          {blog.imageUrl ? (
            <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover" />
          ) : (
            <DocumentTextSolidIcon className="h-[var(--icon-size-2xl)] w-[var(--icon-size-2xl)] text-[var(--fg-30)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
        <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)] line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] line-clamp-2">
          {blog.excerpt}
        </p>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className={`
          absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)] z-10
          p-[var(--spacing-xs)] rounded-[var(--radius-full)]
          bg-[var(--bg)]/90 backdrop-blur-sm border border-[var(--fg-10)]
          text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-white)]
          transition-all opacity-0 group-hover:opacity-100
        `}
        aria-label="Remove from favorites"
      >
        <HeartIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
      </button>
    </div>
  )
}

export const FavoritesPage = memo(FavoritesPage)
