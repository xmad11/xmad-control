/**
 * Favorites Feature - Index
 *
 * Exports favorites page and components from the features/favorites directory.
 */

// Main page component
export { default as FavoritesPage } from "./FavoritesPage"

// Hooks
export { useFavorites } from "./useFavorites"
export type { UseFavoritesOptions, UseFavoritesReturn } from "./useFavorites"

// Components
export { FavoriteButton } from "./components/FavoriteButton"
export type { FavoriteButtonProps } from "./components/FavoriteButton"

export { FavoritesSortDropdown } from "./components/SortDropdown"
export type { FavoritesSortDropdownProps, SortOption } from "./components/SortDropdown"

export { FavoritesEmptyState } from "./components/EmptyState"
export type { FavoritesEmptyStateProps } from "./components/EmptyState"

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
