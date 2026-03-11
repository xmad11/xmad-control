/* ═══════════════════════════════════════════════════════════════════════════════
   ACTIVITY FEED - Platform activity log with timeline
   Timeline view of platform activities
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"

type ActivityType =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "restaurant_approved"
  | "restaurant_rejected"
  | "review_moderated"
  | "content_flagged"
  | "settings_changed"
  | "login"
  | "logout"

type ActivityFilter = "all" | "users" | "restaurants" | "content" | "security" | "system"

interface Activity {
  id: string
  type: ActivityType
  actor: string
  actorRole: string
  action: string
  target?: string
  details?: string
  timestamp: string
  category: ActivityFilter
}

/**
 * Activity Feed Component
 *
 * Features:
 * - Timeline view of activities
 * - Filter by category
 * - Search functionality
 * - Pagination
 */
export function ActivityFeed() {
  const [filter, setFilter] = useState<ActivityFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Mock activity data - replace with API call
   */
  const activities: Activity[] = [
    {
      id: "1",
      type: "restaurant_approved",
      actor: "Admin User",
      actorRole: "admin",
      action: "approved restaurant",
      target: "The Arabian Grill",
      details: "Restaurant approved and published to platform",
      timestamp: "2025-12-30T14:30:00Z",
      category: "restaurants",
    },
    {
      id: "2",
      type: "content_flagged",
      actor: "System",
      actorRole: "system",
      action: "flagged review",
      target: "Review by John Smith",
      details: "Auto-flagged for inappropriate language",
      timestamp: "2025-12-30T14:15:00Z",
      category: "content",
    },
    {
      id: "3",
      type: "user_created",
      actor: "System",
      actorRole: "system",
      action: "new user registered",
      target: "Jane Doe",
      details: "User account created via email signup",
      timestamp: "2025-12-30T13:45:00Z",
      category: "users",
    },
    {
      id: "4",
      type: "review_moderated",
      actor: "Admin User",
      actorRole: "admin",
      action: "approved review",
      target: "Review for Sakura Sushi",
      details: "Review approved and published",
      timestamp: "2025-12-30T12:30:00Z",
      category: "content",
    },
    {
      id: "5",
      type: "settings_changed",
      actor: "Admin User",
      actorRole: "admin",
      action: "updated system settings",
      details: "Enabled email notifications for all users",
      timestamp: "2025-12-30T11:00:00Z",
      category: "system",
    },
    {
      id: "6",
      type: "restaurant_rejected",
      actor: "Admin User",
      actorRole: "admin",
      action: "rejected restaurant",
      target: "Spam Restaurant",
      details: "Rejected due to incomplete information",
      timestamp: "2025-12-30T10:30:00Z",
      category: "restaurants",
    },
    {
      id: "7",
      type: "login",
      actor: "Admin User",
      actorRole: "admin",
      action: "logged in",
      details: "Login from Dubai, UAE",
      timestamp: "2025-12-30T09:00:00Z",
      category: "security",
    },
    {
      id: "8",
      type: "user_updated",
      actor: "Admin User",
      actorRole: "admin",
      action: "updated user role",
      target: "Jane Smith",
      details: "Role changed from user to owner",
      timestamp: "2025-12-29T16:45:00Z",
      category: "users",
    },
  ]

  /**
   * Filter activities
   */
  const filteredActivities = useMemo(() => {
    let result = activities

    if (filter !== "all") {
      result = result.filter((a) => a.category === filter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.action.toLowerCase().includes(query) ||
          a.actor.toLowerCase().includes(query) ||
          a.target?.toLowerCase().includes(query) ||
          a.details?.toLowerCase().includes(query)
      )
    }

    return result
  }, [activities, filter, searchQuery])

  /**
   * Get activity icon
   */
  const getActivityIcon = useCallback((type: ActivityType) => {
    const iconMap = {
      user_created: UserPlusIcon,
      user_updated: PencilIcon,
      user_deleted: TrashIcon,
      restaurant_approved: CheckIcon,
      restaurant_rejected: XMarkIcon,
      review_moderated: ChatBubbleLeftRightIcon,
      content_flagged: ExclamationTriangleIcon,
      settings_changed: FunnelIcon,
      login: ClockIcon,
      logout: ClockIcon,
    }

    return iconMap[type] || ClockIcon
  }, [])

  /**
   * Get activity color
   */
  const getActivityColor = useCallback((type: ActivityType) => {
    if (type.includes("approved") || type.includes("created")) return "text-[var(--color-success)]"
    if (type.includes("rejected") || type.includes("deleted")) return "text-[var(--color-error)]"
    if (type.includes("flagged")) return "text-[var(--color-warning)]"
    return "text-[var(--fg-60)]"
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">Activity Feed</h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            {filteredActivities.length} activities logged
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-[300px]">
          <FunnelIcon className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-50)]" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[var(--spacing-2xl)] pr-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)] placeholder:text-[var(--fg-40)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)]/20"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-md)] mb-[var(--spacing-lg)] scrollbar-hide">
        {filterOptions.map((option) => {
          const isActive = filter === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`
                flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
                rounded-[var(--radius-full)] whitespace-nowrap transition-all
                ${
                  isActive
                    ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                    : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                }
              `}
            >
              <option.icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              <span className="text-[var(--font-size-sm)] font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-[var(--spacing-5xl)]">
          <ClockIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
          <h2 className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
            No activities found
          </h2>
          <p className="text-[var(--font-size-base)] text-[var(--fg-60)]">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[20px] top-[0] bottom-[0] w-[2px] bg-[var(--fg-10)]" />

          {/* Activities */}
          <div className="space-y-[var(--spacing-lg)]">
            {filteredActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              const color = getActivityColor(activity.type)

              return (
                <div key={activity.id} className="relative flex gap-[var(--spacing-md)]">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`h-[40px] w-[40px] rounded-[var(--radius-full)] bg-[var(--bg)] border-[2px] border-[var(--fg-10)] flex items-center justify-center ${color}`}
                    >
                      <Icon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
                      <div>
                        <p className="text-[var(--font-size-base)] text-[var(--fg)]">
                          <span className="font-semibold">{activity.actor}</span>
                          <span className="text-[var(--fg-60)]"> {activity.action}</span>
                          {activity.target && (
                            <span className="font-semibold"> {activity.target}</span>
                          )}
                        </p>
                        {activity.details && (
                          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mt-[var(--spacing-xs)]">
                            {activity.details}
                          </p>
                        )}
                      </div>
                      <span className="text-[var(--font-size-xs)] text-[var(--fg-50)] whitespace-nowrap">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>

                    {/* Actor Role Badge */}
                    <div className="flex items-center gap-[var(--spacing-xs)]">
                      <span className="inline-flex items-center px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-full)] bg-[var(--fg-5)] text-[var(--font-size-xs)] text-[var(--fg-60)]">
                        {activity.actorRole}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Filter options
 */
const filterOptions: Array<{
  id: ActivityFilter
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { id: "all", label: "All Activity", icon: ClockIcon },
  { id: "users", label: "Users", icon: UserPlusIcon },
  { id: "restaurants", label: "Restaurants", icon: BuildingStorefrontIcon },
  { id: "content", label: "Content", icon: DocumentTextIcon },
  { id: "security", label: "Security", icon: ExclamationTriangleIcon },
  { id: "system", label: "System", icon: FunnelIcon },
]

/**
 * Format timestamp
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}
