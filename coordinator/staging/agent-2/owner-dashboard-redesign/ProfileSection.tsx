/**
 * Profile Section - Restaurant profile editing
 *
 * Form-based section for editing restaurant basic information,
 * location details, contact info, and opening hours.
 */

"use client"

import {
  BuildingStorefrontIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  XIcon,
} from "@/components/icons"
import { memo, useState } from "react"
import type { OpeningHour, RestaurantProfile } from "./types"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/**
 * Form input component with token-based styling
 */
function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  disabled = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "tel" | "url"
  placeholder?: string
  error?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)]">
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
      >
        {label}
      </label>
      <input
        id={label.replace(/\s+/g, "-").toLowerCase()}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] transition-all duration-[var(--duration-fast)] ${
          error
            ? "border-[var(--color-error)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-error)] focus:outline-offset-[var(--focus-ring-offset)]"
            : "border-[var(--fg-20)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${label.replace(/\s+/g, "-").toLowerCase()}-error` : undefined}
      />
      {error && (
        <p
          id={`${label.replace(/\s+/g, "-").toLowerCase()}-error`}
          className="text-[var(--font-size-xs)] text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Form textarea component
 */
function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  error?: string
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)]">
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
      >
        {label}
      </label>
      <textarea
        id={label.replace(/\s+/g, "-").toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] transition-all duration-[var(--duration-fast)] resize-y ${
          error
            ? "border-[var(--color-error)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-error)] focus:outline-offset-[var(--focus-ring-offset)]"
            : "border-[var(--fg-20)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${label.replace(/\s+/g, "-").toLowerCase()}-error` : undefined}
      />
      {error && (
        <p
          id={`${label.replace(/\s+/g, "-").toLowerCase()}-error`}
          className="text-[var(--font-size-xs)] text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Opening hours editor component
 */
function OpeningHoursEditor({
  hours,
  onChange,
}: {
  hours: OpeningHour[]
  onChange: (hours: OpeningHour[]) => void
}) {
  const updateDay = (index: number, updates: Partial<OpeningHour>) => {
    const newHours = [...hours]
    newHours[index] = { ...newHours[index], ...updates }
    onChange(newHours)
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      {hours.map((hour, index) => (
        <div
          key={index}
          className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]"
        >
          {/* Day name */}
          <span className="min-w-[var(--spacing-3xl)] text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
            {DAY_NAMES[index]}
          </span>

          {/* Closed toggle */}
          <label className="flex items-center gap-[var(--spacing-xs)]">
            <input
              type="checkbox"
              checked={hour.isClosed}
              onChange={(e) => updateDay(index, { isClosed: e.target.checked })}
              className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] rounded border-[var(--fg-30)] text-[var(--color-primary)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
            <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">Closed</span>
          </label>

          {/* Time inputs */}
          {!hour.isClosed && (
            <>
              <input
                type="time"
                value={hour.openTime}
                onChange={(e) => updateDay(index, { openTime: e.target.value })}
                className="px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
              />
              <span className="text-[var(--fg-40)]">-</span>
              <input
                type="time"
                value={hour.closeTime}
                onChange={(e) => updateDay(index, { closeTime: e.target.value })}
                className="px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
              />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Profile Section Component
 *
 * @example
 * <ProfileSection data={profileData} onSave={(data) => console.log(data)} />
 */
export function ProfileSection({
  data,
  onSave,
  isLoading = false,
}: {
  data: RestaurantProfile
  onSave: (data: RestaurantProfile) => void
  isLoading?: boolean
}) {
  const [profile, setProfile] = useState<RestaurantProfile>(data)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof RestaurantProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleLocationChange = (field: keyof RestaurantProfile["location"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }))
  }

  const handleContactChange = (field: keyof RestaurantProfile["contact"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!profile.name.trim()) {
      newErrors.name = "Restaurant name is required"
    }
    if (!profile.location.address.trim()) {
      newErrors.address = "Address is required"
    }
    if (!profile.location.city.trim()) {
      newErrors.city = "City is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave(profile)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setProfile(data)
    setIsEditing(false)
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Restaurant Profile
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Basic information, location, and operating hours
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
            >
              <XIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-success)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <CheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 gap-[var(--spacing-xl)] lg:grid-cols-2">
        {/* Basic Information */}
        <section className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <h3 className="flex items-center gap-[var(--spacing-sm)] text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
            <BuildingStorefrontIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
            Basic Information
          </h3>

          <div className="flex flex-col gap-[var(--spacing-md)]">
            <FormInput
              label="Restaurant Name"
              value={profile.name}
              onChange={(value) => handleChange("name", value)}
              placeholder="Enter restaurant name"
              error={errors.name}
              disabled={!isEditing}
            />

            <FormTextarea
              label="Description"
              value={profile.description ?? ""}
              onChange={(value) => handleChange("description", value)}
              placeholder="Brief description of your restaurant"
              rows={4}
              disabled={!isEditing}
            />

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]">
                Cuisine Type
              </label>
              <input
                type="text"
                value={profile.cuisine.join(", ")}
                onChange={(e) =>
                  handleChange("cuisine", e.target.value.split(", ").filter(Boolean))
                }
                placeholder="e.g., Italian, Mediterranean, Seafood"
                disabled={!isEditing}
                className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
              />
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]">
                Price Range
              </label>
              <select
                value={profile.priceRange}
                onChange={(e) => handleChange("priceRange", e.target.value)}
                disabled={!isEditing}
                className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
              >
                <option value="$">$ - Budget Friendly</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Expensive</option>
                <option value="$$$$">$$$$ - Fine Dining</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location & Contact */}
        <section className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <h3 className="flex items-center gap-[var(--spacing-sm)] text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
            <MapPinIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
            Location & Contact
          </h3>

          <div className="flex flex-col gap-[var(--spacing-md)]">
            <FormInput
              label="Address"
              value={profile.location.address}
              onChange={(value) => handleLocationChange("address", value)}
              placeholder="Street address"
              error={errors.address}
              disabled={!isEditing}
            />

            <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
              <FormInput
                label="City"
                value={profile.location.city}
                onChange={(value) => handleLocationChange("city", value)}
                placeholder="e.g., Dubai"
                error={errors.city}
                disabled={!isEditing}
              />
              <FormInput
                label="Area"
                value={profile.location.area}
                onChange={(value) => handleLocationChange("area", value)}
                placeholder="e.g., Downtown"
                disabled={!isEditing}
              />
            </div>

            <FormInput
              label="Phone"
              type="tel"
              value={profile.contact.phone ?? ""}
              onChange={(value) => handleContactChange("phone", value)}
              placeholder="+971 XX XXX XXXX"
              disabled={!isEditing}
            />

            <FormInput
              label="Email"
              type="email"
              value={profile.contact.email ?? ""}
              onChange={(value) => handleContactChange("email", value)}
              placeholder="contact@restaurant.com"
              disabled={!isEditing}
            />

            <FormInput
              label="Website"
              type="url"
              value={profile.contact.website ?? ""}
              onChange={(value) => handleContactChange("website", value)}
              placeholder="https://restaurant.com"
              disabled={!isEditing}
            />
          </div>
        </section>
      </div>

      {/* Opening Hours */}
      <section className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
        <h3 className="flex items-center gap-[var(--spacing-sm)] text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          <ClockIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-primary)]" />
          Opening Hours
        </h3>

        <OpeningHoursEditor
          hours={profile.hours}
          onChange={(hours) => handleChange("hours", hours)}
        />
      </section>
    </div>
  )
}

export const ProfileSection = memo(ProfileSection)
