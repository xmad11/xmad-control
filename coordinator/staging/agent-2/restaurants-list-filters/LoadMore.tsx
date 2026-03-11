/**
 * Load More Component
 *
 * "Load more" button for pagination with loading state.
 * Uses design tokens exclusively.
 */

"use client"

import { PlusIcon } from "@/components/icons"
import { memo } from "react"

export interface LoadMoreProps {
  /** Whether more items are available */
  hasMore: boolean
  /** Whether currently loading */
  isLoading: boolean
  /** Load more handler */
  onLoadMore: () => void
  /** Current page */
  currentPage?: number
  /** Total pages */
  totalPages?: number
  /** Items per page */
  itemsPerPage?: number
  /** Total items */
  totalItems?: number
  /** Display mode */
  mode?: "button" | "infinite"
}

/**
 * Load More Component
 *
 * @example
 * <LoadMore
 *   hasMore={hasMore}
 *   isLoading={isLoading}
 *   onLoadMore={loadMore}
 *   currentPage={page}
 *   totalPages={totalPages}
 * />
 */
export function LoadMore({
  hasMore,
  isLoading,
  onLoadMore,
  currentPage = 1,
  totalPages,
  itemsPerPage,
  totalItems,
  mode = "button",
}: LoadMoreProps) {
  if (!hasMore && !isLoading) {
    return (
      <div className="flex items-center justify-center py-[var(--spacing-xl)]">
        <p className="text-[var(--font-size-sm)] text-[var(--fg-50)]">
          {totalItems !== undefined
            ? `Showing all ${totalItems} restaurants`
            : "You've reached the end"}
        </p>
      </div>
    )
  }

  const showingCount =
    itemsPerPage && totalItems ? Math.min(itemsPerPage * currentPage, totalItems) : null

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-md)] py-[var(--spacing-xl)]">
      {/* Progress indicator */}
      {totalPages !== undefined && currentPage <= totalPages && (
        <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
          {showingCount !== null && totalItems !== undefined
            ? `Showing ${showingCount} of ${totalItems} restaurants`
            : `Page ${currentPage} of ${totalPages}`}
        </p>
      )}

      {/* Load More Button */}
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-xl)] py-[var(--spacing-md)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)] text-[var(--color-primary)] text-[var(--font-size-base)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)]"
      >
        {isLoading ? (
          <>
            <div className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] animate-spin rounded-full border-[var(--border-width-thin)] border-[var(--color-primary)] border-t-transparent" />
            Loading...
          </>
        ) : (
          <>
            <PlusIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
            Load More
          </>
        )}
      </button>
    </div>
  )
}

export const LoadMore = memo(LoadMore)
