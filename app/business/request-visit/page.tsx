/* ═══════════════════════════════════════════════════════════════════════════════
   REQUEST A VISIT PAGE - Business requests @the.ss to visit and review
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { BuildingStorefrontIcon, CalendarDaysIcon } from "@/components/icons"
import { type FormEvent, memo, useState } from "react"

interface FormData {
  businessName: string
  businessType: string
  contactName: string
  email: string
  phone: string
  location: string
  visitReason: string
  preferredDates: string
  preferredTime: string
  additionalInfo: string
}

const businessTypes = [
  "Restaurant",
  "Café",
  "Home Business",
  "Bakery",
  "Sweets Shop",
  "Juice Bar",
  "Ice Cream",
  "Food Truck",
  "Cloud Kitchen",
  "Other",
]

const visitReasons = [
  "Grand Opening",
  "Menu Launch",
  "Special Promotion",
  "Anniversary",
  "Rebranding",
  "New Chef",
  "Food Review",
  "Collaboration",
  "Other",
]

const timeSlots = [
  "Morning (9AM - 12PM)",
  "Afternoon (12PM - 4PM)",
  "Evening (4PM - 8PM)",
  "Late Night (8PM - 11PM)",
]

function RequestVisitPage() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    contactName: "",
    email: "",
    phone: "",
    location: "",
    visitReason: "",
    preferredDates: "",
    preferredTime: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--fg-10)]">
        <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-xl)]">
          <div className="flex items-center gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
            <div className="h-[var(--icon-size-xl)] w-[var(--icon-size-xl)] rounded-[var(--radius-full)] bg-[var(--color-primary)] flex items-center justify-center">
              <CalendarDaysIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-white)]" />
            </div>
            <div>
              <h1 className="text-[var(--font-size-2xl)] md:text-[var(--font-size-3xl)] font-black text-[var(--fg)]">
                Request a Visit
              </h1>
              <p className="text-[var(--font-size-sm)] text-secondary-gray">
                Get reviewed by Shadi Shawqi (@the.ss)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-2xl)]">
        <form onSubmit={handleSubmit} className="max-w-[50rem] mx-auto space-y-[var(--spacing-lg)]">
          {/* Business Information Section */}
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-2xl)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <BuildingStorefrontIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
                Business Information
              </h2>
            </div>

            <div className="space-y-[var(--spacing-md)]">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Enter your business name"
                />
              </div>

              {/* Business Type */}
              <div>
                <label
                  htmlFor="businessType"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Business Type *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Name */}
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="+971 XX XXX XXXX"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Location / Address *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Area, street, building details"
                />
              </div>
            </div>
          </div>

          {/* Visit Details Section */}
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-2xl)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <CalendarDaysIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
                Visit Details
              </h2>
            </div>

            <div className="space-y-[var(--spacing-md)]">
              {/* Reason for Visit */}
              <div>
                <label
                  htmlFor="visitReason"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Reason for Visit *
                </label>
                <select
                  id="visitReason"
                  name="visitReason"
                  required
                  value={formData.visitReason}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                >
                  <option value="">Select reason</option>
                  {visitReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Dates */}
              <div>
                <label
                  htmlFor="preferredDates"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Suggested Dates *
                </label>
                <input
                  type="text"
                  id="preferredDates"
                  name="preferredDates"
                  required
                  value={formData.preferredDates}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="e.g., Next week, weekdays, specific dates"
                />
                <p className="text-[var(--font-size-xs)] text-secondary-gray mt-[var(--spacing-xs)]">
                  We'll try our best to accommodate your preferred schedule
                </p>
              </div>

              {/* Preferred Time */}
              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Preferred Time Slot *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Info */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                  placeholder="Any special requests, dietary restrictions, parking info, etc."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)]">
            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="flex-1 px-[var(--spacing-xl)] py-[var(--spacing-md)] bg-[var(--color-primary)] text-[var(--fg)] font-bold rounded-[var(--radius-lg)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                  ? "Request Submitted ✓"
                  : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-[var(--spacing-xl)] py-[var(--spacing-md)] border border-[var(--fg-20)] text-[var(--fg)] font-bold rounded-[var(--radius-lg)] hover:bg-[var(--fg-5)] transition-all"
            >
              Cancel
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-[var(--color-primary)]/10 rounded-[var(--radius-lg)] p-[var(--spacing-md)] border border-[var(--color-primary)]/20">
            <p className="text-[var(--font-size-sm)] text-[var(--fg)]">
              <strong>Note:</strong> We'll review your request and send you a confirmation email
              with the scheduled visit date within 2-3 business days.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(RequestVisitPage)
