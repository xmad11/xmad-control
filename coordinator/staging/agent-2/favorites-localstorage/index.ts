/**
 * Favorites with localStorage - Index
 *
 * Centralized exports for favorites functionality.
 * All components use design tokens exclusively - NO hardcoded values.
 * Proper TypeScript - NO `any` types.
 */

// Main page component
export { default as FavoritesPage } from "./FavoritesPage"

// Hooks
export { default as useFavorites } from "./useFavorites"
export type { UseFavoritesOptions, UseFavoritesReturn } from "./useFavorites"

// Components
export { default as FavoriteButton } from "./FavoriteButton"
export type { FavoriteButtonProps } from "./FavoriteButton"

export { default as FavoritesSortDropdown } from "./SortDropdown"
export type { FavoritesSortDropdownProps, SortOption } from "./SortDropdown"

export { default as FavoritesEmptyState } from "./EmptyState"
export type { FavoritesEmptyStateProps } from "./EmptyState"

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
