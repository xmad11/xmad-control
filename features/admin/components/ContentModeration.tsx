/* ═══════════════════════════════════════════════════════════════════════════════
   CONTENT MODERATION - Reviews and photos moderation queue
   Flagged content management with approve/reject actions
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  ChatBubbleLeftIcon,
  CheckIcon,
  EyeIcon,
  FlagIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"

type ContentType = "review" | "photo"
type ModerationStatus = "pending" | "approved" | "rejected"
type FlagReason = "spam" | "inappropriate" | "fake" | "offensive" | "other"

interface FlaggedContent {
  id: string
  type: ContentType
  userId: string
  userName: string
  restaurantId: string
  restaurantName: string
  content: string
  imageUrl?: string
  rating?: number
  flagReason: FlagReason
  flagCount: number
  flaggedDate: string
  status: ModerationStatus
}

/**
 * Content Moderation Component
 *
 * Features:
 * - Filter by content type (reviews, photos)
 * - Filter by status
 * - Bulk approve/reject/delete
 * - Detail view for reviews
 * - Image preview for photos
 */
export function ContentModeration() {
  const [contentType, setContentType] = useState<ContentType>("review")
  const [statusFilter, setStatusFilter] = useState<ModerationStatus | "all">("all")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  /**
   * Mock flagged reviews - replace with API call
   */
  const flaggedReviews: FlaggedContent[] = [
    {
      id: "r1",
      type: "review",
      userId: "u1",
      userName: "John Smith",
      restaurantId: "rest1",
      restaurantName: "The Arabian Grill",
      content:
        "This place is absolute garbage! Worst experience ever. The staff was rude and the food was cold.",
      rating: 1,
      flagReason: "offensive",
      flagCount: 3,
      flaggedDate: "2025-12-30",
      status: "pending",
    },
    {
      id: "r2",
      type: "review",
      userId: "u2",
      userName: "Jane Doe",
      restaurantId: "rest2",
      restaurantName: "Sakura Sushi",
      content:
        "I've never been to this restaurant but I want to warn everyone not to go here. Trust me!",
      rating: 1,
      flagReason: "fake",
      flagCount: 5,
      flaggedDate: "2025-12-29",
      status: "pending",
    },
    {
      id: "r3",
      type: "review",
      userId: "u3",
      userName: "Mike Johnson",
      restaurantId: "rest3",
      restaurantName: "Bella Italia",
      content: "Visit my website for the best food deals! www.spam-food-deals.com",
      rating: 5,
      flagReason: "spam",
      flagCount: 8,
      flaggedDate: "2025-12-28",
      status: "pending",
    },
  ]

  /**
   * Mock flagged photos - replace with API call
   */
  const flaggedPhotos: FlaggedContent[] = [
    {
      id: "p1",
      type: "photo",
      userId: "u4",
      userName: "Sarah Wilson",
      restaurantId: "rest4",
      restaurantName: "Spice Garden",
      content: "Food photo uploaded",
      imageUrl: "/images/placeholder.jpg",
      flagReason: "inappropriate",
      flagCount: 2,
      flaggedDate: "2025-12-27",
      status: "pending",
    },
  ]

  /**
   * Get current content list based on type
   */
  const currentContent = contentType === "review" ? flaggedReviews : flaggedPhotos

  /**
   * Filter by status
   */
  const filteredContent = useMemo(() => {
    if (statusFilter === "all") return currentContent
    return currentContent.filter((c) => c.status === statusFilter)
  }, [currentContent, statusFilter])

  /**
   * Handle approve action
   */
  const handleApprove = useCallback((id: string) => {
    console.log("Approve content:", id)
    // TODO: Call API to approve
  }, [])

  /**
   * Handle reject action
   */
  const handleReject = useCallback((id: string) => {
    console.log("Reject content:", id)
    // TODO: Call API to reject
  }, [])

  /**
   * Handle delete action
   */
  const handleDelete = useCallback((id: string) => {
    console.log("Delete content:", id)
    // TODO: Call API to delete
  }, [])

  /**
   * Handle bulk approve
   */
  const handleBulkApprove = useCallback(() => {
    console.log("Bulk approve:", Array.from(selectedItems))
    // TODO: Call API
    setSelectedItems(new Set())
  }, [selectedItems])

  /**
   * Handle bulk reject
   */
  const handleBulkReject = useCallback(() => {
    console.log("Bulk reject:", Array.from(selectedItems))
    // TODO: Call API
    setSelectedItems(new Set())
  }, [selectedItems])

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = useCallback(() => {
    console.log("Bulk delete:", Array.from(selectedItems))
    // TODO: Call API
    setSelectedItems(new Set())
  }, [selectedItems])

  /**
   * Handle select item
   */
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            Content Moderation
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            {filteredContent.filter((c) => c.status === "pending").length} items pending review
          </p>
        </div>

        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Content Type Filter */}
          <div className="flex items-center border border-[var(--fg-20)] rounded-[var(--radius-md)] overflow-hidden">
            <button
              type="button"
              onClick={() => setContentType("review")}
              className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] transition-colors ${
                contentType === "review"
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--bg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)]"
              }`}
            >
              <ChatBubbleLeftIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Reviews
            </button>
            <button
              type="button"
              onClick={() => setContentType("photo")}
              className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] transition-colors ${
                contentType === "photo"
                  ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                  : "bg-[var(--bg)] text-[var(--fg-60)] hover:bg-[var(--fg-5)]"
              }`}
            >
              <PhotoIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Photos
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ModerationStatus | "all")}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] p-[var(--spacing-md)] mb-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
          <p className="text-[var(--font-size-sm)] text-[var(--fg)]">
            <span className="font-semibold">{selectedItems.size}</span> items selected
          </p>
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-success)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Approve
            </button>
            <button
              type="button"
              onClick={handleBulkReject}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-warning)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Reject
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <StatCard
          icon={<FlagIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={flaggedReviews.length + flaggedPhotos.length}
          label="Total Flagged"
        />
        <StatCard
          icon={<ClockIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={filteredContent.filter((c) => c.status === "pending").length}
          label="Pending Review"
          variant="warning"
        />
        <StatCard
          icon={<CheckIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={filteredContent.filter((c) => c.status === "approved").length}
          label="Approved"
          variant="success"
        />
        <StatCard
          icon={<XMarkIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
          value={filteredContent.filter((c) => c.status === "rejected").length}
          label="Rejected"
          variant="error"
        />
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <EmptyState contentType={contentType} />
      ) : (
        <div className="space-y-[var(--spacing-md)]">
          {filteredContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              selected={selectedItems.has(content.id)}
              onSelect={handleSelectItem}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Stat Card - Moderation stats
 */
interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  variant?: "default" | "warning" | "success" | "error"
}

function StatCard({ icon, value, label, variant = "default" }: StatCardProps) {
  const colors = {
    default: "border-[var(--fg-10)]",
    warning: "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5",
    success: "border-[var(--color-success)]/30 bg-[var(--color-success)]/5",
    error: "border-[var(--color-error)]/30 bg-[var(--color-error)]/5",
  }

  return (
    <div className={`p-[var(--spacing-md)] rounded-[var(--radius-lg)] border ${colors[variant]}`}>
      <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-xs)]">
        <div className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--fg-5)] text-[var(--fg-60)]">
          {icon}
        </div>
        <span className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">{value}</span>
      </div>
      <p className="text-[var(--font-size-xs)] text-[var(--fg-60)]">{label}</p>
    </div>
  )
}

/**
 * Content Card - Single flagged content item
 */
interface ContentCardProps {
  content: FlaggedContent
  selected: boolean
  onSelect: (id: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}

function ContentCard({
  content,
  selected,
  onSelect,
  onApprove,
  onReject,
  onDelete,
}: ContentCardProps) {
  return (
    <div
      className={`p-[var(--spacing-md)] rounded-[var(--radius-lg)] border transition-colors ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
          : "border-[var(--fg-10)] bg-[var(--card-bg)]"
      }`}
    >
      <div className="flex gap-[var(--spacing-md)]">
        {/* Checkbox */}
        <div className="pt-[var(--spacing-xs)]">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(content.id)}
            className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded border-[var(--fg-30)]"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
            <div className="flex-1">
              {/* User and Restaurant */}
              <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-xs)]">
                <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)]">
                  {content.userName}
                </span>
                <span className="text-[var(--fg-30)]">→</span>
                <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  {content.restaurantName}
                </span>
              </div>

              {/* Flag Reason Badge */}
              <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-sm)]">
                <FlagReasonBadge reason={content.flagReason} />
                <span className="text-[var(--font-size-xs)] text-[var(--fg-50)]">
                  Flagged {content.flagCount}x •{" "}
                  {new Date(content.flaggedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Status */}
            <ModerationStatusBadge status={content.status} />
          </div>

          {/* Content/Preview */}
          {content.type === "review" ? (
            <div className="mb-[var(--spacing-sm)]">
              {/* Rating */}
              {content.rating !== undefined && (
                <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-xs)]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] ${
                        i < content.rating ? "text-[var(--color-rating)]" : "text-[var(--fg-20)]"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              )}
              {/* Review Text */}
              <p className="text-[var(--font-size-sm)] text-[var(--fg)] bg-[var(--fg-3)] p-[var(--spacing-sm)] rounded-[var(--radius-md)] line-clamp-3">
                {content.content}
              </p>
            </div>
          ) : (
            <div className="flex gap-[var(--spacing-md)]">
              <div className="h-[120px] w-[120px] flex-shrink-0 rounded-[var(--radius-md)] bg-[var(--fg-5)] flex items-center justify-center overflow-hidden">
                <PhotoIcon className="h-[var(--icon-size-2xl)] w-[var(--icon-size-2xl)] text-[var(--fg-30)]" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  Photo uploaded by user
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {content.status === "pending" && (
            <div className="flex items-center justify-end gap-[var(--spacing-xs)] pt-[var(--spacing-sm)] border-t border-[var(--fg-10)]">
              <button
                type="button"
                onClick={() => onApprove(content.id)}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-success)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(content.id)}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-warning)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Reject
              </button>
              <button
                type="button"
                onClick={() => onDelete(content.id)}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Flag Reason Badge
 */
interface FlagReasonBadgeProps {
  reason: FlagReason
}

function FlagReasonBadge({ reason }: FlagReasonBadgeProps) {
  const config = {
    spam: { label: "Spam", color: "bg-[var(--color-info)]/10 text-[var(--color-info)]" },
    inappropriate: {
      label: "Inappropriate",
      color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    },
    fake: { label: "Fake", color: "bg-[var(--color-error)]/10 text-[var(--color-error)]" },
    offensive: {
      label: "Offensive",
      color: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
    },
    other: { label: "Other", color: "bg-[var(--fg-10)] text-[var(--fg-70)]" },
  }

  const { label, color } = config[reason]

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-semibold uppercase ${color}`}
    >
      {label}
    </span>
  )
}

/**
 * Moderation Status Badge
 */
interface ModerationStatusBadgeProps {
  status: ModerationStatus
}

function ModerationStatusBadge({ status }: ModerationStatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending",
      color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    },
    approved: {
      label: "Approved",
      color: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    },
    rejected: { label: "Rejected", color: "bg-[var(--fg-10)] text-[var(--fg-60)]" },
  }

  const { label, color } = config[status]

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium ${color}`}
    >
      {label}
    </span>
  )
}

/**
 * Empty State
 */
interface EmptyStateProps {
  contentType: ContentType
}

function EmptyState({ contentType }: EmptyStateProps) {
  return (
    <div className="text-center py-[var(--spacing-5xl)]">
      <FlagIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
      <h2 className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
        No flagged {contentType}s
      </h2>
      <p className="text-[var(--font-size-base)] text-[var(--fg-60)]">
        All {contentType}s are clean. Great job keeping the platform safe!
      </p>
    </div>
  )
}
