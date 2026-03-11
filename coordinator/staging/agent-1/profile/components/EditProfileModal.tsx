/* ═══════════════════════════════════════════════════════════════════════════════
   EDIT PROFILE MODAL - Edit user profile information
   Form modal with validation
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { XMarkIcon } from "@/components/icons"
import { memo, useCallback, useState } from "react"

/**
 * User profile data interface
 */
interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  joinedDate: string
  stats: {
    savedRestaurants: number
    savedBlogs: number
    recentlyViewed: number
    offersClaimed: number
  }
}

interface EditProfileModalProps {
  profile: UserProfile
  onSave: (data: Partial<UserProfile>) => void
  onClose: () => void
}

/**
 * Edit Profile Modal - Form for editing user profile
 *
 * Features:
 * - Name input
 * - Email input (readonly)
 * - Phone input
 * - Form validation
 * - Save/Cancel buttons
 */
export function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * Handle form input change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
    },
    [errors]
  )

  /**
   * Validate form
   */
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (validate()) {
        onSave({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
        })
      }
    },
    [formData, validate, onSave]
  )

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <div
      className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-[var(--spacing-md)]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--fg)]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-[var(--modal-width-md)] bg-[var(--bg)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-[var(--spacing-xl)] border-b border-[var(--fg-10)]">
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-[var(--spacing-xs)] rounded-[var(--radius-full)] hover:bg-[var(--fg-10)] transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-60)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-[var(--spacing-xl)] space-y-[var(--spacing-lg)]">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]"
            >
              Name <span className="text-[var(--color-error)]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all ${
                errors.name ? "border-[var(--color-error)]" : "border-[var(--fg-20)]"
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-[var(--font-size-xs)] text-[var(--color-error)] mt-[var(--spacing-xs)]"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]"
            >
              Email <span className="text-[var(--color-error)]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              readOnly
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-[var(--fg-20)] bg-[var(--fg-5)] text-[var(--fg-50)] cursor-not-allowed"
              aria-describedby="email-readonly"
            />
            <p
              id="email-readonly"
              className="text-[var(--font-size-xs)] text-[var(--fg-50)] mt-[var(--spacing-xs)]"
            >
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+971 50 123 4567"
              className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all ${
                errors.phone ? "border-[var(--color-error)]" : "border-[var(--fg-20)]"
              }`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="text-[var(--font-size-xs)] text-[var(--color-error)] mt-[var(--spacing-xs)]"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--fg-10)]">
            <button
              type="button"
              onClick={onClose}
              className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--fg)] hover:bg-[var(--fg-5)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[var(--spacing-xl)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EditProfileModal = memo(EditProfileModal)
