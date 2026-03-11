/* ═══════════════════════════════════════════════════════════════════════════════
   USE FAVORITES HOOK - localStorage sync for favorites
   Manages restaurant and blog favorites with localStorage persistence
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEYS = {
  RESTAURANTS: "shadi_favorites_restaurants",
  BLOGS: "shadi_favorites_blogs",
} as const

interface FavoriteRestaurant {
  id: string
  title: string
  slug: string
  cuisine: string
  location: string
  rating: number
  priceLevel: number
  imageUrl?: string
  features?: string[]
}

interface FavoriteBlog {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl?: string
  author: string
  publishedAt: string
}

/**
 * useFavorites Hook
 *
 * Features:
 * - localStorage persistence for restaurants and blogs
 * - Toggle favorite (add/remove)
 * - Check if item is favorite
 * - Remove single favorite
 * - Clear all favorites
 * - Sync across tabs via storage event
 *
 * @returns Favorites state and actions
 */
export function useFavorites() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<FavoriteRestaurant[]>([])
  const [favoriteBlogs, setFavoriteBlogs] = useState<FavoriteBlog[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Load favorites from localStorage on mount
   */
  useEffect(() => {
    try {
      const storedRestaurants = localStorage.getItem(STORAGE_KEYS.RESTAURANTS)
      const storedBlogs = localStorage.getItem(STORAGE_KEYS.BLOGS)

      if (storedRestaurants) {
        setFavoriteRestaurants(JSON.parse(storedRestaurants))
      }

      if (storedBlogs) {
        setFavoriteBlogs(JSON.parse(storedBlogs))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  /**
   * Save restaurants to localStorage
   */
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(favoriteRestaurants))
    } catch (error) {
      console.error("Error saving restaurants to localStorage:", error)
    }
  }, [favoriteRestaurants, isInitialized])

  /**
   * Save blogs to localStorage
   */
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(favoriteBlogs))
    } catch (error) {
      console.error("Error saving blogs to localStorage:", error)
    }
  }, [favoriteBlogs, isInitialized])

  /**
   * Sync favorites across tabs
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.RESTAURANTS && e.newValue) {
        setFavoriteRestaurants(JSON.parse(e.newValue))
      }
      if (e.key === STORAGE_KEYS.BLOGS && e.newValue) {
        setFavoriteBlogs(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  /**
   * Check if restaurant is favorite
   */
  const isRestaurantFavorite = useCallback(
    (restaurantId: string) => {
      return favoriteRestaurants.some((r) => r.id === restaurantId)
    },
    [favoriteRestaurants]
  )

  /**
   * Check if blog is favorite
   */
  const isBlogFavorite = useCallback(
    (blogId: string) => {
      return favoriteBlogs.some((b) => b.id === blogId)
    },
    [favoriteBlogs]
  )

  /**
   * Toggle restaurant favorite
   */
  const toggleRestaurant = useCallback((restaurant: FavoriteRestaurant) => {
    setFavoriteRestaurants((prev) => {
      const exists = prev.some((r) => r.id === restaurant.id)

      if (exists) {
        return prev.filter((r) => r.id !== restaurant.id)
      }
      return [...prev, restaurant]
    })
  }, [])

  /**
   * Toggle blog favorite
   */
  const toggleBlog = useCallback((blog: FavoriteBlog) => {
    setFavoriteBlogs((prev) => {
      const exists = prev.some((b) => b.id === blog.id)

      if (exists) {
        return prev.filter((b) => b.id !== blog.id)
      }
      return [...prev, blog]
    })
  }, [])

  /**
   * Remove restaurant from favorites
   */
  const removeRestaurant = useCallback((restaurantId: string) => {
    setFavoriteRestaurants((prev) => prev.filter((r) => r.id !== restaurantId))
  }, [])

  /**
   * Remove blog from favorites
   */
  const removeBlog = useCallback((blogId: string) => {
    setFavoriteBlogs((prev) => prev.filter((b) => b.id !== blogId))
  }, [])

  /**
   * Clear all restaurant favorites
   */
  const clearRestaurants = useCallback(() => {
    setFavoriteRestaurants([])
  }, [])

  /**
   * Clear all blog favorites
   */
  const clearBlogs = useCallback(() => {
    setFavoriteBlogs([])
  }, [])

  /**
   * Clear all favorites
   */
  const clearAll = useCallback(() => {
    setFavoriteRestaurants([])
    setFavoriteBlogs([])
  }, [])

  return {
    // State
    favoriteRestaurants,
    favoriteBlogs,
    isInitialized,

    // Check
    isRestaurantFavorite,
    isBlogFavorite,

    // Toggle
    toggleRestaurant,
    toggleBlog,

    // Remove
    removeRestaurant,
    removeBlog,

    // Clear
    clearRestaurants,
    clearBlogs,
    clearAll,
  }
}

/**
 * Type exports
 */
export type { FavoriteRestaurant, FavoriteBlog }
