/**
 * Reviews Section - Customer reviews management
 *
 * View and respond to customer reviews about your restaurant.
 */

"use client"

import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons"
import { StarIcon as StarIconSolid } from "@/components/icons"
import { memo, useState } from "react"
import type { Review } from "./types"

/**
 * Rating stars display component
 */
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`h-[var(--icon-size-md)] w-[var(--icon-size-md)] ${
            index < rating ? "text-[var(--color-rating)]" : "text-[var(--fg-20)]"
          }`}
        >
          {index < rating ? (
            <StarIconSolid className="h-full w-full" />
          ) : (
            <StarIcon className="h-full w-full" />
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * Format relative time (e.g., "2 days ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  }
  return "Just now"
}

/**
 * Review card component
 */
function ReviewCard({
  review,
  onRespond,
  onEditResponse,
  onDelete,
}: {
  review: Review
  onRespond: (id: string, response: string) => void
  onEditResponse: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [isResponding, setIsResponding] = useState(false)
  const [responseText, setResponseText] = useState(review.response?.text ?? "")

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      onRespond(review.id, responseText.trim())
      setIsResponding(false)
    }
  }

  const handleCancelResponse = () => {
    setResponseText(review.response?.text ?? "")
    setIsResponding(false)
  }

  const hasResponse = !!review.response

  return (
    <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg-70)]">
      {/* Review Header */}
      <div className="flex items-start justify-between gap-[var(--spacing-md)]">
        <div className="flex items-start gap-[var(--spacing-md)]">
          {review.reviewer.avatar ? (
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] items-center justify-center rounded-full bg-[var(--fg-10)]">
              <UserIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-70)]" />
            </div>
          )}

          <div>
            <p className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
              {review.reviewer.name}
            </p>
            <div className="flex items-center gap-[var(--spacing-xs)] mt-[var(--spacing-xs)]">
              <RatingStars rating={review.rating} />
              <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                ({review.rating}/5)
              </span>
            </div>
            <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] text-[var(--fg-70)] mt-[var(--spacing-xs)]">
              <CalendarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              <time dateTime={new Date(review.createdAt).toISOString()}>
                {formatRelativeTime(review.createdAt)}
              </time>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(review.id)}
          className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-40)] transition-all duration-[var(--duration-fast)] hover:bg-[oklch(from_var(--color-error)_l_c_h_/0.1)] hover:text-[var(--color-error)]"
          title="Delete review"
        >
          <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
        </button>
      </div>

      {/* Review Comment */}
      <div className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))]">
        <p className="text-[var(--font-size-base)] text-[var(--fg)] whitespace-pre-wrap">
          {review.comment}
        </p>
      </div>

      {/* Response Section */}
      <div className="pl-[calc(var(--icon-size-lg)_+_var(--spacing-md))]">
        {hasResponse && !isResponding ? (
          // Display existing response
          <div className="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--bg)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[var(--spacing-xs)]">
                <ChatBubbleLeftRightIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
                <p className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]">
                  Your Response
                </p>
              </div>
              <div className="flex items-center gap-[var(--spacing-xs)]">
                <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
                  {formatRelativeTime(review.response.respondedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => onEditResponse(review.id)}
                  className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--fg-10)]"
                  title="Edit response"
                >
                  <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                </button>
              </div>
            </div>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] whitespace-pre-wrap">
              {review.response.text}
            </p>
          </div>
        ) : (
          // Response form
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <label
              htmlFor={`response-${review.id}`}
              className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]"
            >
              {hasResponse ? "Edit Your Response" : "Write a Response"}
            </label>
            <textarea
              id={`response-${review.id}`}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Thank you for your feedback! We appreciate..."
              rows={4}
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] resize-y focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={handleSubmitResponse}
                disabled={!responseText.trim()}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasResponse ? "Update Response" : "Post Response"}
              </button>
              {isResponding && (
                <button
                  type="button"
                  onClick={handleCancelResponse}
                  className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {!hasResponse && !isResponding && (
          <button
            type="button"
            onClick={() => setIsResponding(true)}
            className="flex items-center gap-[var(--spacing-xs)] text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:underline"
          >
            <ChatBubbleLeftRightIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Respond to Review
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Reviews Section Component
 *
 * @example
 * <ReviewsSection reviews={reviews} onRespond={(id, response) => saveResponse(id, response)} />
 */
export function ReviewsSection({
  reviews,
  onRespond,
  onDelete,
  isLoading = false,
}: {
  reviews: Review[]
  onRespond: (id: string, response: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}) {
  const [filter, setFilter] = useState<"all" | "responded" | "unresponded">("all")
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)

  const filteredReviews = reviews.filter((review) => {
    // Response filter
    if (filter === "responded" && !review.response) return false
    if (filter === "unresponded" && review.response) return false

    // Rating filter
    if (ratingFilter !== null && review.rating !== ratingFilter) return false

    return true
  })

  const stats = {
    total: reviews.length,
    average:
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    byRating: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
    responded: reviews.filter((r) => r.response).length,
    unresponded: reviews.filter((r) => !r.response).length,
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Reviews
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Read and respond to customer reviews
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-4">
        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Total Reviews</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            {stats.total}
          </span>
        </div>

        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-rating)_l_c_h_/0.1)] border-[var(--border-width-thin)] border-[oklch(from_var(--color-rating)_l_c_h_/0.2)]">
          <span className="text-[var(--font-size-sm)] text-[var(--color-rating)]">Average</span>
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <span className="text-[var(--font-size-2xl)] font-bold text-[var(--color-rating)]">
              {stats.average.toFixed(1)}
            </span>
            <StarIconSolid className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-rating)]" />
          </div>
        </div>

        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-success)_l_c_h_/0.1)] border-[var(--border-width-thin)] border-[oklch(from_var(--color-success)_l_c_h_/0.2)]">
          <span className="text-[var(--font-size-sm)] text-[var(--color-success)]">Responded</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--color-success)]">
            {stats.responded}
          </span>
        </div>

        <div className="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[oklch(from_var(--color-warning)_l_c_h_/0.1)] border-[var(--border-width-thin)] border-[oklch(from_var(--color-warning)_l_c_h_/0.2)]">
          <span className="text-[var(--font-size-sm)] text-[var(--color-warning)]">Pending</span>
          <span className="text-[var(--font-size-2xl)] font-bold text-[var(--color-warning)]">
            {stats.unresponded}
          </span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
        <h3 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)]">
          Rating Distribution
        </h3>
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.byRating[rating as keyof typeof stats.byRating]
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
            return (
              <div key={rating} className="flex items-center gap-[var(--spacing-sm)]">
                <button
                  type="button"
                  onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                  className={`flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] min-w-[var(--spacing-3xl)] transition-all duration-[var(--duration-fast)] ${
                    ratingFilter === rating
                      ? "text-[var(--color-primary)] font-medium"
                      : "text-[var(--fg-70)] hover:text-[var(--fg)]"
                  }`}
                >
                  <span>{rating}</span>
                  <StarIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                </button>
                <div className="flex-1 h-[var(--spacing-sm)] rounded-[var(--radius-sm)] bg-[var(--fg-10)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-rating)] transition-all duration-[var(--duration-normal)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[var(--font-size-sm)] text-[var(--fg-70)] min-w-[var(--spacing-xl)] text-right">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-[var(--spacing-md)]">
        <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Filter:</span>
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] ${
              filter === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--bg-70)] text-[var(--fg-70)] hover:text-[var(--fg)]"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unresponded")}
            className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] ${
              filter === "unresponded"
                ? "bg-[var(--color-warning)] text-white"
                : "bg-[var(--bg-70)] text-[var(--fg-70)] hover:text-[var(--fg)]"
            }`}
          >
            Pending ({stats.unresponded})
          </button>
          <button
            type="button"
            onClick={() => setFilter("responded")}
            className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] ${
              filter === "responded"
                ? "bg-[var(--color-success)] text-white"
                : "bg-[var(--bg-70)] text-[var(--fg-70)] hover:text-[var(--fg)]"
            }`}
          >
            Responded ({stats.responded})
          </button>
        </div>

        {ratingFilter && (
          <button
            type="button"
            onClick={() => setRatingFilter(null)}
            className="ml-auto flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[oklch(from_var(--color-rating)_l_c_h_/0.1)] text-[var(--color-rating)] text-[var(--font-size-sm)]"
          >
            <span>{ratingFilter} stars</span>
            <XIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          </button>
        )}
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="flex flex-col gap-[var(--spacing-md)]">
          {filteredReviews
            .sort((a, b) => {
              // Sort unresponded first, then by date
              if (a.response && !b.response) return 1
              if (!a.response && b.response) return -1
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onRespond={onRespond}
                onEditResponse={(id) => {
                  console.log("Edit response:", id)
                }}
                onDelete={onDelete}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[var(--spacing-4xl)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-30)] mb-[var(--spacing-md)]" />
          <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">
            {filter === "unresponded"
              ? "No pending reviews!"
              : filter === "responded"
                ? "No responded reviews yet."
                : ratingFilter
                  ? `No ${ratingFilter}-star reviews yet.`
                  : "No reviews yet. When customers leave reviews, they'll appear here."}
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-[var(--spacing-2xl)]">
          <div className="flex items-center gap-[var(--spacing-sm)] text-[var(--fg-70)]">
            <div className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] animate-spin rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)]" />
            <span className="text-[var(--font-size-sm)]">Loading reviews...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const ReviewsSection = memo(ReviewsSection)
