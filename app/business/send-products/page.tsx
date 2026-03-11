/* ═══════════════════════════════════════════════════════════════════════════════
   SEND PRODUCTS PAGE - Businesses send products for @the.ss to review on Instagram
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { PackageIcon, SparklesIcon, TruckIcon } from "@/components/icons"
import { type FormEvent, memo, useState } from "react"

interface FormData {
  businessName: string
  contactName: string
  email: string
  phone: string
  productName: string
  productType: string
  description: string
  ingredients: string
  dietaryInfo: string
  deliveryAddress: string
  deliveryDate: string
  deliveryTime: string
  productImages: string
  socialHandle: string
}

const productTypes = [
  "Sweets / Desserts",
  "Baked Goods",
  "Packaged Food",
  "Beverages",
  "Snacks",
  "Condiments / Sauces",
  "Health Food",
  "Traditional Dish",
  "Other",
]

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Sugar-Free",
  "Low-Calorie",
  "Halal Certified",
  "None",
]

function SendProductsPage() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    productName: "",
    productType: "",
    description: "",
    ingredients: "",
    dietaryInfo: "",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    productImages: "",
    socialHandle: "",
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
              <PackageIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-white)]" />
            </div>
            <div>
              <h1 className="text-[var(--font-size-2xl)] md:text-[var(--font-size-3xl)] font-black text-[var(--fg)]">
                Send Products for Review
              </h1>
              <p className="text-[var(--font-size-sm)] text-secondary-gray">
                Get featured on Shadi Shawqi (@the.ss) Instagram
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-2xl)]">
        <form onSubmit={handleSubmit} className="max-w-[50rem] mx-auto space-y-[var(--spacing-lg)]">
          {/* Business Information */}
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-2xl)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <SparklesIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
                Business Information
              </h2>
            </div>

            <div className="space-y-[var(--spacing-md)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
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
                    placeholder="Your business name"
                  />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
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
              </div>

              {/* Social Handle */}
              <div>
                <label
                  htmlFor="socialHandle"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="socialHandle"
                  name="socialHandle"
                  value={formData.socialHandle}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="@yourbusiness"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-2xl)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <PackageIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
                Product Information
              </h2>
            </div>

            <div className="space-y-[var(--spacing-md)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                {/* Product Name */}
                <div>
                  <label
                    htmlFor="productName"
                    className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    required
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="Name of your product"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label
                    htmlFor="productType"
                    className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                  >
                    Product Category *
                  </label>
                  <select
                    id="productType"
                    name="productType"
                    required
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Product Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                  placeholder="Describe your product, what makes it special, taste profile, etc."
                />
              </div>

              {/* Ingredients */}
              <div>
                <label
                  htmlFor="ingredients"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Key Ingredients *
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  required
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                  placeholder="Main ingredients used"
                />
              </div>

              {/* Dietary Info */}
              <div>
                <label
                  htmlFor="dietaryInfo"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Dietary Information *
                </label>
                <select
                  id="dietaryInfo"
                  name="dietaryInfo"
                  required
                  value={formData.dietaryInfo}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                >
                  <option value="">Select dietary option</option>
                  {dietaryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Images */}
              <div>
                <label
                  htmlFor="productImages"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Product Images Link
                </label>
                <input
                  type="url"
                  id="productImages"
                  name="productImages"
                  value={formData.productImages}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-[var(--font-size-xs)] text-secondary-gray mt-[var(--spacing-xs)]">
                  Share a link to your product photos (Google Drive, Dropbox, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-2xl)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
              <TruckIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
                Delivery Information
              </h2>
            </div>

            <div className="space-y-[var(--spacing-md)]">
              {/* Delivery Address */}
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                >
                  Delivery Address *
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Full address for product pickup/delivery"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                {/* Delivery Date */}
                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                  >
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    required
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>

                {/* Delivery Time */}
                <div>
                  <label
                    htmlFor="deliveryTime"
                    className="block text-[var(--font-size-sm)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]"
                  >
                    Preferred Time *
                  </label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    required
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  >
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div className="bg-[var(--color-primary)]/10 rounded-[var(--radius-lg)] p-[var(--spacing-md)] border border-[var(--color-primary)]/20">
                <p className="text-[var(--font-size-sm)] text-[var(--fg)]">
                  <strong>Delivery Note:</strong> Please ensure products are freshly prepared,
                  properly packaged, and labeled with your business name. We'll contact you to
                  confirm the delivery slot.
                </p>
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
                  : "Submit Product"}
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
              <strong>Review Process:</strong> Our team will review your product submission. If
              selected, @the.ss will feature your product on Instagram with full credit to your
              business.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(SendProductsPage)
