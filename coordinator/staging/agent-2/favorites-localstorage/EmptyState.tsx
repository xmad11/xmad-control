/**
 * Empty State Component for Favorites
 *
 * Displayed when user has no favorites.
 * Uses design tokens exclusively.
 */

"use client"

import { DocumentTextIcon, HeartIcon } from "@/components/icons"
import { memo } from "react"

export interface FavoritesEmptyStateProps {
  /** Type of favorites to show empty state for */
  type: "all" | "restaurants" | "blogs"
  /** Optional CTA button */
  cta?: {
    label: string
    href: string
  }
  /** Optional custom message */
  message?: string
  /** Optional subtitle */
  subtitle?: string
}

/**
 * Favorites Empty State Component
 *
 * @example
 * <FavoritesEmptyState
 *   type="restaurants"
 *   cta={{ label: "Explore Restaurants", href: "/restaurants" }}
 * />
 */
export function FavoritesEmptyState({ type, cta, message, subtitle }: FavoritesEmptyStateProps) {
  const _isRestaurants = type === "all" || type === "restaurants"
  const _isBlogs = type === "all" || type === "blogs"

  const Icon = type === "blogs" ? DocumentTextIcon : HeartIcon

  const defaultTitle = type === "all" ? "No favorites yet" : `No ${type} favorited`

  const defaultSubtitle =
    subtitle ??
    (type === "all"
      ? "Start saving your favorite restaurants and blogs"
      : type === "restaurants"
        ? "Start saving your favorite restaurants"
        : "Start saving your favorite blog posts")

  const defaultMessage =
    message ??
    "Click the heart icon on any item to save it to your favorites and access them quickly later."

  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-5xl)] px-[var(--spacing-xl)]">
      <div className="flex flex-col items-center gap-[var(--spacing-md)] text-center max-w-[var(--max-w-xl)]">
        {/* Icon */}
        <div className="flex h-[var(--spacing-4xl)] w-[var(--spacing-4xl)] items-center justify-center rounded-full bg-[var(--fg-10)]">
          <Icon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-30)]" />
        </div>

        {/* Title */}
        <h3 className="text-[var(--font-size-2xl)] font-semibold text-[var(--fg)]">
          {defaultTitle}
        </h3>

        {/* Subtitle */}
        <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">{defaultSubtitle}</p>

        {/* Message */}
        {message && (
          <p className="text-[var(--font-size-sm)] text-[var(--fg-50)]">{defaultMessage}</p>
        )}

        {/* CTA Button */}
        {cta && (
          <a
            href={cta.href}
            className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--color-primary)] text-white text-[var(--font-size-base)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90"
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  )
}

export const FavoritesEmptyState = memo(FavoritesEmptyState)
