/* ═════════════════════───────────────────────────────────────────────────────────────
   REVIEWS SECTION - Customer reviews with rating breakdown
   Rating distribution, review list, filters
   ═════════════════════─────────────────────────────────────────────────────────────── */

"use client"

import { StarIcon } from "@/components/icons"
import { StarIcon as StarSolid } from "@/components/icons"
import { memo } from "react"

interface Review {
  id: string
  author: string
  avatar?: string
  rating: number
  date: string
  content: string
  helpful: number
}

/**
 * Reviews Section - Customer reviews with rating breakdown
 *
 * Features:
 * - Rating breakdown (5-1 stars)
 * - Average rating display
 * - Review list with avatars
 * - Helpful voting
 * - Filter by rating
 * - Sort options
 */
export function ReviewsSection() {
  // TODO: Replace with actual reviews from API
  const reviews: Review[] = [
    {
      id: "1",
      author: "Sarah Ahmed",
      rating: 5,
      date: "2 days ago",
      content:
        "Amazing food and wonderful atmosphere! The staff was incredibly friendly and the portions were generous. Highly recommend the lamb machboos!",
      helpful: 24,
    },
    {
      id: "2",
      author: "Mohammed Ali",
      rating: 4,
      date: "1 week ago",
      content:
        "Great place for authentic Emirati cuisine. The flavors were authentic and the presentation was beautiful. Service was a bit slow but worth the wait.",
      helpful: 18,
    },
    {
      id: "3",
      author: "Lisa Johnson",
      rating: 5,
      date: "2 weeks ago",
      content:
        "A hidden gem! The food here is exceptional and the prices are reasonable. The staff goes above and beyond to make you feel welcome.",
      helpful: 31,
    },
    {
      id: "4",
      author: "Ahmed Hassan",
      rating: 4,
      date: "3 weeks ago",
      content:
        "Love this restaurant! The food is always fresh and delicious. The only issue is parking can be difficult during peak hours.",
      helpful: 12,
    },
  ]

  const ratingBreakdown = [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 28, percentage: 22 },
    { stars: 3, count: 7, percentage: 5 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ]

  const averageRating = 4.7
  const totalReviews = 128

  /**
   * Render star rating
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarSolid
        key={index}
        className={`h-[var(--icon-size-md)] w-[var(--icon-size-md)] ${
          index < rating
            ? "text-[var(--color-warning)] fill-[var(--color-warning)]"
            : "text-[var(--fg-20)]"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-[var(--spacing-2xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">Reviews</h2>
        <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          {totalReviews} reviews
        </span>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-xl)] p-[var(--spacing-xl)] bg-[var(--fg-5)] rounded-[var(--radius-xl)]">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-[var(--font-size-6xl)] font-black text-[var(--fg)]">
            {averageRating}
          </div>
          <div className="flex items-center justify-center gap-[var(--spacing-xs)] my-[var(--spacing-sm)]">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-[var(--spacing-sm)]">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-[var(--spacing-sm)]">
              <span className="text-[var(--font-size-sm)] text-[var(--fg-70)] w-[var(--spacing-lg)]">
                {item.stars} ⭐
              </span>
              <div className="flex-1 h-[var(--spacing-sm)] bg-[var(--fg-10)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-warning)] rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-[var(--font-size-sm)] text-[var(--fg-60)] w-[var(--spacing-lg)] text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-[var(--spacing-md)]">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="p-[var(--spacing-md)] bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--fg-10)]"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-[var(--spacing-md)]">
              <div className="flex items-center gap-[var(--spacing-md)]">
                {/* Avatar */}
                <div className="flex items-center justify-center w-[var(--icon-size-xl)] h-[var(--icon-size-xl)] rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[var(--font-size-lg)]">
                  {review.author.charAt(0)}
                </div>

                {/* Author Info */}
                <div>
                  <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                    {review.author}
                  </h3>
                  <div className="flex items-center gap-[var(--spacing-xs)]">
                    <div className="flex gap-[var(--spacing-xs)]">{renderStars(review.rating)}</div>
                    <span className="text-[var(--font-size-xs)] text-[var(--fg-60)]">•</span>
                    <span className="text-[var(--font-size-xs)] text-[var(--fg-60)]">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <p className="text-[var(--font-size-base)] text-[var(--fg-80)] leading-relaxed mb-[var(--spacing-md)]">
              {review.content}
            </p>

            {/* Helpful Button */}
            <button
              type="button"
              className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] text-[var(--fg-60)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg
                className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Helpful ({review.helpful})
            </button>
          </article>
        ))}
      </div>

      {/* Load More */}
      <button
        type="button"
        className="w-full py-[var(--spacing-md)] text-[var(--font-size-base)] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-[var(--radius-lg)] transition-colors"
      >
        Load More Reviews
      </button>
    </div>
  )
}

export const ReviewsSection = memo(ReviewsSection)
