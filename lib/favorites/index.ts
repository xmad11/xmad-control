/**
 * Favorites with localStorage - Index
 *
 * Re-exports from features/favorites for backward compatibility.
 * Business logic (useFavorites, types) remains in lib/favorites.
 */

// Main page component
export { FavoritesPage } from "@/features/favorites"

// Hooks (business logic - stays in lib)
export { useFavorites } from "./useFavorites"
export type { UseFavoritesOptions, UseFavoritesReturn } from "./useFavorites"

// Components
export { FavoriteButton } from "@/features/favorites"
export type { FavoriteButtonProps } from "@/features/favorites"

export { FavoritesSortDropdown } from "@/features/favorites"
export type { FavoritesSortDropdownProps, SortOption } from "@/features/favorites"

export { FavoritesEmptyState } from "@/features/favorites"
export type { FavoritesEmptyStateProps } from "@/features/favorites"

// Types
export type {
  FavoriteType,
  BaseFavorite,
  RestaurantFavorite,
  BlogFavorite,
  Favorite,
  FavoriteSortOption,
  FavoritesState,
  FavoritesStorageData,
  FavoriteAction,
} from "./types"
