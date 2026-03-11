/**
 * useFavorites Hook
 *
 * Manages favorites with localStorage persistence.
 * Uses design tokens exclusively.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  BlogFavorite,
  Favorite,
  FavoriteAction,
  FavoriteSortOption,
  FavoriteType,
  FavoritesState,
  FavoritesStorageData,
  RestaurantFavorite,
} from "./types"

const STORAGE_KEY = "shadi_favorites"
const STORAGE_VERSION = 1

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

function getFromStorage(): FavoritesState {
  if (typeof window === "undefined") {
    return { restaurants: [], blogs: [] }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return { restaurants: [], blogs: [] }
    }

    const parsed: FavoritesStorageData = JSON.parse(data)

    // Check version
    if (parsed.version !== STORAGE_VERSION) {
      // Version mismatch, clear storage
      localStorage.removeItem(STORAGE_KEY)
      return { restaurants: [], blogs: [] }
    }

    // Convert date strings back to Date objects
    return {
      restaurants: parsed.restaurants.map((r) => ({
        ...r,
        favoritedAt: new Date(r.favoritedAt),
      })),
      blogs: parsed.blogs.map((b) => ({
        ...b,
        favoritedAt: new Date(b.favoritedAt),
        publishedAt: new Date(b.publishedAt),
      })),
    }
  } catch {
    return { restaurants: [], blogs: [] }
  }
}

function saveToStorage(state: FavoritesState) {
  if (typeof window === "undefined") return

  try {
    const data: FavoritesStorageData = {
      version: STORAGE_VERSION,
      restaurants: state.restaurants,
      blogs: state.blogs,
      updatedAt: new Date(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error)
  }
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseFavoritesOptions {
  /** Initial favorites state (overrides localStorage) */
  initialState?: Partial<FavoritesState>
  /** Listen for storage changes from other tabs */
  syncAcrossTabs?: boolean
}

export interface UseFavoritesReturn {
  /** Current favorites state */
  favorites: FavoritesState
  /** All favorites combined */
  allFavorites: Favorite[]
  /** Check if an item is favorited */
  isFavorite: (id: string, type: FavoriteType) => boolean
  /** Add to favorites */
  addFavorite: (item: Omit<Favorite, "favoritedAt">) => FavoriteAction
  /** Remove from favorites */
  removeFavorite: (id: string, type: FavoriteType) => FavoriteAction
  /** Toggle favorite status */
  toggleFavorite: (item: Omit<Favorite, "favoritedAt">) => FavoriteAction
  /** Clear all favorites */
  clearAll: (type?: FavoriteType) => void
  /** Get favorites by type */
  getFavoritesByType: (type: FavoriteType, sort?: FavoriteSortOption) => Favorite[]
  /** Get favorite count */
  getCount: (type?: FavoriteType) => number
  /** Sort favorites */
  sortFavorites: (favorites: Favorite[], option: FavoriteSortOption) => Favorite[]
}

/**
 * Favorites Hook
 *
 * @example
 * const { favorites, isFavorite, toggleFavorite, clearAll } = useFavorites()
 */
export function useFavorites({
  initialState,
  syncAcrossTabs = true,
}: UseFavoritesOptions = {}): UseFavoritesReturn {
  // Initialize state from localStorage or initial state
  const [favorites, setFavorites] = useState<FavoritesState>(() => {
    const stored = getFromStorage()
    return {
      restaurants: initialState?.restaurants ?? stored.restaurants,
      blogs: initialState?.blogs ?? stored.blogs,
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(favorites)
  }, [favorites])

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (!syncAcrossTabs) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = JSON.parse(e.newValue) as FavoritesStorageData
        setFavorites({
          restaurants: parsed.restaurants.map((r) => ({
            ...r,
            favoritedAt: new Date(r.favoritedAt),
          })),
          blogs: parsed.blogs.map((b) => ({
            ...b,
            favoritedAt: new Date(b.favoritedAt),
            publishedAt: new Date(b.publishedAt),
          })),
        })
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [syncAcrossTabs])

  // Check if an item is favorited
  const isFavorite = useCallback(
    (id: string, type: FavoriteType) => {
      if (type === "restaurant") {
        return favorites.restaurants.some((r) => r.restaurantId === id)
      }
      return favorites.blogs.some((b) => b.blogId === id)
    },
    [favorites]
  )

  // Add to favorites
  const addFavorite = useCallback((item: Omit<Favorite, "favoritedAt">): FavoriteAction => {
    const favorite = { ...item, favoritedAt: new Date() } as Favorite

    setFavorites((prev) => {
      if (favorite.type === "restaurant") {
        // Check if already exists
        if (prev.restaurants.some((r) => r.restaurantId === favorite.restaurantId)) {
          return prev
        }
        return {
          ...prev,
          restaurants: [...prev.restaurants, favorite as RestaurantFavorite],
        }
      }
      // Check if already exists
      if (prev.blogs.some((b) => b.blogId === favorite.blogId)) {
        return prev
      }
      return {
        ...prev,
        blogs: [...prev.blogs, favorite as BlogFavorite],
      }
    })

    return { success: true, isFavorite: true, item: favorite }
  }, [])

  // Remove from favorites
  const removeFavorite = useCallback((id: string, type: FavoriteType): FavoriteAction => {
    let removedItem: Favorite | undefined

    setFavorites((prev) => {
      if (type === "restaurant") {
        const filtered = prev.restaurants.filter((r) => r.restaurantId !== id)
        removedItem = prev.restaurants.find((r) => r.restaurantId === id)
        return { ...prev, restaurants: filtered }
      }
      const filtered = prev.blogs.filter((b) => b.blogId !== id)
      removedItem = prev.blogs.find((b) => b.blogId === id)
      return { ...prev, blogs: filtered }
    })

    return { success: true, isFavorite: false, item: removedItem }
  }, [])

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (item: Omit<Favorite, "favoritedAt">): FavoriteAction => {
      const id = item.type === "restaurant" ? item.restaurantId : item.blogId

      if (isFavorite(id, item.type)) {
        return removeFavorite(id, item.type)
      }
      return addFavorite(item)
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  // Clear all favorites
  const clearAll = useCallback((type?: FavoriteType) => {
    setFavorites((prev) => {
      if (type === "restaurant") {
        return { ...prev, restaurants: [] }
      }
      if (type === "blog") {
        return { ...prev, blogs: [] }
      }
      return { restaurants: [], blogs: [] }
    })
  }, [])

  // Get favorites by type
  const getFavoritesByType = useCallback(
    (type: FavoriteType, sort?: FavoriteSortOption): Favorite[] => {
      const items = type === "restaurant" ? favorites.restaurants : favorites.blogs
      return sort ? sortFavorites(items, sort) : items
    },
    [favorites]
  )

  // Get favorite count
  const getCount = useCallback(
    (type?: FavoriteType) => {
      if (type === "restaurant") return favorites.restaurants.length
      if (type === "blog") return favorites.blogs.length
      return favorites.restaurants.length + favorites.blogs.length
    },
    [favorites]
  )

  // Sort favorites
  const sortFavorites = useCallback(
    (itemsToSort: Favorite[], option: FavoriteSortOption): Favorite[] => {
      const sorted = [...itemsToSort]

      switch (option) {
        case "recent":
          return sorted.sort((a, b) => b.favoritedAt.getTime() - a.favoritedAt.getTime())
        case "name":
          return sorted.sort((a, b) => {
            const nameA = a.type === "restaurant" ? a.name : a.title
            const nameB = b.type === "restaurant" ? b.name : b.title
            return nameA.localeCompare(nameB)
          })
        case "rating":
          return sorted.sort((a, b) => {
            const ratingA = a.type === "restaurant" ? a.rating : 0
            const ratingB = b.type === "restaurant" ? b.rating : 0
            return ratingB - ratingA
          })
        default:
          return sorted
      }
    },
    []
  )

  // All favorites combined
  const allFavorites: Favorite[] = [...favorites.restaurants, ...favorites.blogs]

  return {
    favorites,
    allFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAll,
    getFavoritesByType,
    getCount,
    sortFavorites,
  }
}

export default useFavorites
