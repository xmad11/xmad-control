/* ═══════════════════════════════════════════════════════════════════════════════
   SYSTEM CONFIGURATION - Platform settings with toggles and forms
   System-wide configuration management
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ShieldCheckIcon,
} from "@/components/icons"
import { memo, useCallback, useState } from "react"

type ConfigCategory = "general" | "notifications" | "content" | "security" | "integrations"

interface ToggleConfig {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface InputConfig {
  id: string
  label: string
  value: string
  type: "text" | "email" | "number" | "url"
  placeholder?: string
}

/**
 * System Configuration Component
 *
 * Features:
 * - Categorized settings
 * - Toggle switches
 * - Input fields
 * - Save/reset actions
 */
export function SystemConfiguration() {
  const [activeCategory, setActiveCategory] = useState<ConfigCategory>("general")
  const [hasChanges, setHasChanges] = useState(false)

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    console.log("Save configuration")
    // TODO: Call API to save
    setHasChanges(false)
  }, [])

  /**
   * Handle reset
   */
  const handleReset = useCallback(() => {
    console.log("Reset configuration")
    // TODO: Call API to reset
    setHasChanges(false)
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            System Configuration
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Platform-wide settings and preferences
          </p>
        </div>

        {/* Actions */}
        {hasChanges && (
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <button
              type="button"
              onClick={handleReset}
              className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-[var(--spacing-xl)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)] mb-[var(--spacing-lg)] scrollbar-hide">
        {configCategories.map((category) => {
          const isActive = activeCategory === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
                rounded-[var(--radius-full)] whitespace-nowrap transition-all duration-[var(--duration-fast)]
                ${
                  isActive
                    ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                    : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                }
              `}
            >
              <category.icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              <span className="text-[var(--font-size-sm)] font-medium">{category.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Content */}
      <div className="p-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
        {activeCategory === "general" && <GeneralSettings onChange={() => setHasChanges(true)} />}
        {activeCategory === "notifications" && (
          <NotificationSettings onChange={() => setHasChanges(true)} />
        )}
        {activeCategory === "content" && <ContentSettings onChange={() => setHasChanges(true)} />}
        {activeCategory === "security" && <SecuritySettings onChange={() => setHasChanges(true)} />}
        {activeCategory === "integrations" && (
          <IntegrationSettings onChange={() => setHasChanges(true)} />
        )}
      </div>
    </div>
  )
}

/**
 * Config categories
 */
const configCategories: Array<{
  id: ConfigCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { id: "general", label: "General", icon: GlobeIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "content", label: "Content", icon: DocumentTextIcon },
  { id: "security", label: "Security", icon: ShieldCheckIcon },
  { id: "integrations", label: "Integrations", icon: EnvelopeIcon },
]

/**
 * General Settings
 */
function GeneralSettings({ onChange }: { onChange: () => void }) {
  const [toggles, setToggles] = useState<ToggleConfig[]>([
    {
      id: "maintenance",
      label: "Maintenance Mode",
      description: "Put the platform in maintenance mode",
      enabled: false,
    },
    {
      id: "registration",
      label: "Allow New Registrations",
      description: "Enable new user signups",
      enabled: true,
    },
    {
      id: "search",
      label: "Enable Search",
      description: "Allow users to search for content",
      enabled: true,
    },
  ])

  const handleToggle = useCallback(
    (id: string) => {
      setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
      onChange()
    },
    [onChange]
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
          General Settings
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Basic platform configuration
        </p>
      </div>

      <div className="space-y-[var(--spacing-lg)]">
        {toggles.map((toggle) => (
          <ToggleItem key={toggle.id} {...toggle} onToggle={() => handleToggle(toggle.id)} />
        ))}
      </div>
    </div>
  )
}

/**
 * Notification Settings
 */
function NotificationSettings({ onChange }: { onChange: () => void }) {
  const [toggles, setToggles] = useState<ToggleConfig[]>([
    {
      id: "email-notifications",
      label: "Email Notifications",
      description: "Send email notifications to users",
      enabled: true,
    },
    {
      id: "push-notifications",
      label: "Push Notifications",
      description: "Send push notifications to mobile apps",
      enabled: true,
    },
    {
      id: "sms-notifications",
      label: "SMS Notifications",
      description: "Send SMS notifications for important updates",
      enabled: false,
    },
    {
      id: "digest-email",
      label: "Weekly Digest",
      description: "Send weekly digest emails to users",
      enabled: true,
    },
  ])

  const handleToggle = useCallback(
    (id: string) => {
      setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
      onChange()
    },
    [onChange]
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
          Notification Settings
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Configure how notifications are sent
        </p>
      </div>

      <div className="space-y-[var(--spacing-lg)]">
        {toggles.map((toggle) => (
          <ToggleItem key={toggle.id} {...toggle} onToggle={() => handleToggle(toggle.id)} />
        ))}
      </div>
    </div>
  )
}

/**
 * Content Settings
 */
function ContentSettings({ onChange }: { onChange: () => void }) {
  const [toggles, setToggles] = useState<ToggleConfig[]>([
    {
      id: "auto-moderation",
      label: "Auto-Moderation",
      description: "Automatically flag inappropriate content",
      enabled: true,
    },
    {
      id: "photo-approval",
      label: "Photo Approval Required",
      description: "Require admin approval for uploaded photos",
      enabled: true,
    },
    {
      id: "review-approval",
      label: "Review Approval Required",
      description: "Require admin approval for reviews",
      enabled: false,
    },
    {
      id: "allow-anonymous",
      label: "Allow Anonymous Reviews",
      description: "Allow users to post reviews without account",
      enabled: false,
    },
  ])

  const [inputs, setInputs] = useState<InputConfig[]>([
    {
      id: "min-review-length",
      label: "Minimum Review Length",
      value: "50",
      type: "number",
      placeholder: "50",
    },
    {
      id: "max-photos-per-restaurant",
      label: "Max Photos per Restaurant",
      value: "20",
      type: "number",
      placeholder: "20",
    },
  ])

  const handleToggle = useCallback(
    (id: string) => {
      setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
      onChange()
    },
    [onChange]
  )

  const handleInputChange = useCallback(
    (id: string, value: string) => {
      setInputs((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)))
      onChange()
    },
    [onChange]
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
          Content Settings
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Manage user-generated content settings
        </p>
      </div>

      <div className="space-y-[var(--spacing-lg)]">
        {toggles.map((toggle) => (
          <ToggleItem key={toggle.id} {...toggle} onToggle={() => handleToggle(toggle.id)} />
        ))}
      </div>

      <div className="space-y-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--fg-10)]">
        {inputs.map((input) => (
          <InputItem
            key={input.id}
            {...input}
            onChange={(value) => handleInputChange(input.id, value)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Security Settings
 */
function SecuritySettings({ onChange }: { onChange: () => void }) {
  const [toggles, setToggles] = useState<ToggleConfig[]>([
    {
      id: "two-factor",
      label: "Two-Factor Authentication",
      description: "Require 2FA for admin accounts",
      enabled: true,
    },
    {
      id: "session-timeout",
      label: "Session Timeout",
      description: "Automatically log out inactive users",
      enabled: true,
    },
    {
      id: "ip-whitelist",
      label: "IP Whitelist",
      description: "Restrict admin access to whitelisted IPs",
      enabled: false,
    },
    {
      id: "audit-log",
      label: "Audit Logging",
      description: "Log all admin actions for security",
      enabled: true,
    },
  ])

  const handleToggle = useCallback(
    (id: string) => {
      setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
      onChange()
    },
    [onChange]
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
          Security Settings
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Platform security configuration
        </p>
      </div>

      <div className="space-y-[var(--spacing-lg)]">
        {toggles.map((toggle) => (
          <ToggleItem key={toggle.id} {...toggle} onToggle={() => handleToggle(toggle.id)} />
        ))}
      </div>
    </div>
  )
}

/**
 * Integration Settings
 */
function IntegrationSettings({ onChange }: { onChange: () => void }) {
  const [inputs, setInputs] = useState<InputConfig[]>([
    {
      id: "google-maps-api",
      label: "Google Maps API Key",
      value: "",
      type: "text",
      placeholder: "Enter your API key",
    },
    {
      id: "sendgrid-api",
      label: "SendGrid API Key",
      value: "",
      type: "text",
      placeholder: "Enter your API key",
    },
    {
      id: "support-email",
      label: "Support Email",
      value: "support@shadi.ae",
      type: "email",
      placeholder: "support@example.com",
    },
  ])

  const handleInputChange = useCallback(
    (id: string, value: string) => {
      setInputs((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)))
      onChange()
    },
    [onChange]
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
          Integrations
        </h3>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Third-party service configuration
        </p>
      </div>

      <div className="space-y-[var(--spacing-md)]">
        {inputs.map((input) => (
          <InputItem
            key={input.id}
            {...input}
            onChange={(value) => handleInputChange(input.id, value)}
          />
        ))}
      </div>

      {/* Test Integration Button */}
      <div className="pt-[var(--spacing-md)] border-t border-[var(--fg-10)]">
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
        >
          <MagnifyingGlassIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          Test Connections
        </button>
      </div>
    </div>
  )
}

/**
 * Toggle Item Component
 */
interface ToggleItemProps extends ToggleConfig {
  onToggle: () => void
}

function ToggleItem({ label, description, enabled, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[var(--font-size-base)] font-medium text-[var(--fg)]">{label}</p>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`
          relative inline-flex h-[28px] w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          ${enabled ? "bg-[var(--color-primary)]" : "bg-[var(--fg-20)]"}
        `}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-[var(--color-white)] shadow ring-0 transition duration-200 ease-in-out
            ${enabled ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  )
}

/**
 * Input Item Component
 */
interface InputItemProps extends InputConfig {
  onChange: (value: string) => void
}

function InputItem({ label, value, type, placeholder, onChange }: InputItemProps) {
  return (
    <div>
      <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-base)] text-[var(--fg)] placeholder:text-[var(--fg-40)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)]/20"
      />
    </div>
  )
}

export const SystemConfiguration = memo(SystemConfiguration)
