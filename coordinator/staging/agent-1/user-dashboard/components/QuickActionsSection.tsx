/* ═══════════════════════════════════════════════════════════════════════════════
   QUICK ACTIONS SECTION - Profile, settings, notifications
   2-grid mobile layout with action cards
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ArrowRightIcon, BellIcon, CogIcon, HeartIcon, UserIcon } from "@/components/icons"
import { memo } from "react"

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: "primary" | "accent" | "neutral"
}

/**
 * Quick Actions Section - Profile settings and preferences
 *
 * Features:
 * - 2-grid mobile layout
 * - Quick access to profile, settings, notifications
 * - Visual indicators for each action
 */
export function QuickActionsSection() {
  const quickActions: QuickAction[] = [
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your information",
      icon: UserIcon,
      href: "/profile",
      color: "primary",
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "Preferences & privacy",
      icon: CogIcon,
      href: "/settings",
      color: "neutral",
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Email & push preferences",
      icon: BellIcon,
      href: "/settings#notifications",
      color: "accent",
    },
    {
      id: "favorites",
      title: "All Favorites",
      subtitle: "Manage saved places",
      icon: HeartIcon,
      href: "/favorites",
      color: "neutral",
    },
  ]

  /**
   * Get color classes based on action color type
   */
  const getColorClasses = (color: QuickAction["color"]) => {
    const baseClasses = "rounded-[var(--radius-full)]"

    switch (color) {
      case "primary":
        return `${baseClasses} bg-[var(--color-primary)]/10 text-[var(--color-primary)]`
      case "accent":
        return `${baseClasses} bg-[var(--color-accent-rust)]/10 text-[var(--color-accent-rust)]`
      case "neutral":
        return `${baseClasses} bg-[var(--fg-10)] text-[var(--fg)]`
      default:
        return `${baseClasses} bg-[var(--fg-10)] text-[var(--fg)]`
    }
  }

  return (
    <section>
      {/* Section Header */}
      <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
        Quick Actions
      </h2>

      {/* Actions Grid - 2-Grid Mobile */}
      <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <a
              key={action.id}
              href={action.href}
              className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] ${getColorClasses(action.color)}`}
              >
                <Icon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[var(--font-size-sm)] font-semibold text-[var(--fg)] truncate">
                  {action.title}
                </h3>
                <p className="text-[var(--font-size-xs)] text-[var(--fg-60)] truncate">
                  {action.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-30)] group-hover:text-[var(--color-primary)] group-hover:translate-x-[var(--spacing-xs)] transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )
        })}
      </div>
    </section>
  )
}
