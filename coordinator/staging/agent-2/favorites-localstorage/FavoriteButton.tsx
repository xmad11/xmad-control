/**
 * Favorite Button Component
 *
 * Heart icon button for toggling favorites.
 * Uses design tokens exclusively.
 */

"use client"

import { HeartIcon } from "@/components/icons"
import { HeartIcon as HeartSolidIcon } from "@/components/icons"
import { memo } from "react"

export interface FavoriteButtonProps {
  /** Whether the item is currently favorited */
  isFavorite: boolean
  /** Toggle handler */
  onToggle: () => void
  /** Button size variant */
  size?: "sm" | "md" | "lg"
  /** Whether to show the icon only (no background) */
  iconOnly?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Optional label */
  label?: string
  /** CSS class name */
  className?: string
}

/**
 * Favorite Button Component
 *
 * @example
 * <FavoriteButton
 *   isFavorite={isFavorite}
 *   onToggle={() => toggleFavorite(item)}
 *   size="md"
 * />
 */
export function FavoriteButton({
  isFavorite,
  onToggle,
  size = "md",
  iconOnly = false,
  disabled = false,
  label,
  className = "",
}: FavoriteButtonProps) {
  // Size styles
  const sizeStyles = {
    sm: "h-[var(--icon-size-md)] w-[var(--icon-size-md)]",
    md: "h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]",
    lg: "h-[var(--icon-size-xl)] w-[var(--icon-size-xl)]",
  }

  const paddingStyles = {
    sm: "p-[var(--spacing-xs)]",
    md: "p-[var(--spacing-sm)]",
    lg: "p-[var(--spacing-md)]",
  }

  const Icon = isFavorite ? HeartSolidIcon : HeartIcon

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center justify-center rounded-full transition-all duration-[var(--duration-fast)] ${
          isFavorite
            ? "text-[var(--color-favorite)] hover:text-[var(--color-favorite)] opacity-100"
            : "text-[var(--fg-50)] hover:text-[var(--color-favorite)]"
        } disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${className}`}
        aria-label={label ?? (isFavorite ? "Remove from favorites" : "Add to favorites")}
        aria-pressed={isFavorite}
      >
        <Icon className="h-full w-full" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex items-center justify-center gap-[var(--spacing-xs)] rounded-full transition-all duration-[var(--duration-fast)] ${
        isFavorite
          ? "bg-[oklch(from_var(--color-favorite)_l_c_h_/0.15)] text-[var(--color-favorite)] hover:bg-[oklch(from_var(--color-favorite)_l_c_h_/0.2)]"
          : "bg-[var(--fg-5)] text-[var(--fg-70)] hover:bg-[oklch(from_var(--color-favorite)_l_c_h_/0.1)] hover:text-[var(--color-favorite)]"
      } disabled:opacity-50 disabled:cursor-not-allowed ${paddingStyles[size]} ${className}`}
      aria-label={label ?? (isFavorite ? "Remove from favorites" : "Add to favorites")}
      aria-pressed={isFavorite}
    >
      <Icon className={sizeStyles[size]} />
      {label && <span className="text-[var(--font-size-sm)] font-medium">{label}</span>}
    </button>
  )
}

export const FavoriteButton = memo(FavoriteButton)
