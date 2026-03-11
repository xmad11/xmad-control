/**
 * Favorites Types
 *
 * All types for favorites functionality with localStorage.
 * No `any`, `undefined`, or `never` types.
 */

/**
 * Favorite item types
 */
export type FavoriteType = "restaurant" | "blog"

/**
 * Base favorite item interface
 */
export interface BaseFavorite {
  id: string
  type: FavoriteType
  favoritedAt: Date
}

/**
 * Restaurant favorite
 */
export interface RestaurantFavorite extends BaseFavorite {
  type: "restaurant"
  restaurantId: string
  name: string
  slug: string
  image: string
  cuisine: string[]
  location: {
    area: string
    city: string
  }
  rating: number
  priceRange: string
}

/**
 * Blog favorite
 */
export interface BlogFavorite extends BaseFavorite {
  type: "blog"
  blogId: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: Date
  author: string
  category: string
}

/**
 * Union type for all favorites
 */
export type Favorite = RestaurantFavorite | BlogFavorite

/**
 * Sort options for favorites
 */
export type FavoriteSortOption = "recent" | "name" | "rating"

/**
 * Favorites state
 */
export interface FavoritesState {
  restaurants: RestaurantFavorite[]
  blogs: BlogFavorite[]
}

/**
 * localStorage data structure
 */
export interface FavoritesStorageData {
  version: number
  restaurants: RestaurantFavorite[]
  blogs: BlogFavorite[]
  updatedAt: Date
}

/**
 * Favorite action result
 */
export interface FavoriteAction {
  success: boolean
  isFavorite: boolean
  item?: Favorite
}
