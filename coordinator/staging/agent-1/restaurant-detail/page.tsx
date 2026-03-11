/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT DETAIL CLIENT - Complete restaurant detail page
   All sections: Hero, Overview, Menu, Reviews, Gallery, Location, Action buttons
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { RestaurantCard } from "@/components/card"
import type { RestaurantCardData } from "@/components/card"
import { ImageRail } from "@/components/gallery/ImageRail"
import {
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  ShareIcon,
  StarIcon,
  XMarkIcon,
} from "@/components/icons"
import { StickyTabs } from "@/components/tabs/StickyTabs"
import { Badge } from "@/components/ui/Badge"
import { useTheme } from "@/context/ThemeContext"
import { mockRestaurants } from "@/data/mocks"
import { memo, useCallback, useState } from "react"
import { LocationSection } from "./components/LocationSection"
import { MenuSection } from "./components/MenuSection"
import { ReviewsSection } from "./components/ReviewsSection"

type ActiveTab = "overview" | "menu" | "gallery" | "reviews" | "location"

interface RestaurantDetailClientProps {
  restaurant: RestaurantCardData
}

/**
 * Restaurant Detail Client - Complete page with all sections
 *
 * Features:
 * - Hero gallery with image navigation
 * - Quick info bar (status, rating, price, location)
 * - Overview tab with description, hours, action buttons
 * - Menu tab with categories and items
 * - Reviews tab with rating breakdown and list
 * - Gallery tab with image rail
 * - Location tab with map and address
 * - Similar restaurants
 */
export function RestaurantDetailClient({ restaurant }: RestaurantDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite || false)
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview")
  const { mode } = useTheme()

  /* ─────────────────────────────────────────────────────────────────────────
     Image gallery handlers
     ───────────────────────────────────────────────────────────────────────── */
  const nextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % restaurant.images.length)
  }, [restaurant.images.length])

  const prevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length)
  }, [restaurant.images.length])

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev)
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
     Similar restaurants (exclude current, max 4)
     ───────────────────────────────────────────────────────────────────────── */
  const similarRestaurants = mockRestaurants.filter((r) => r.id !== restaurant.id).slice(0, 4)

  /* ─────────────────────────────────────────────────────────────────────────
     Price range display
     ───────────────────────────────────────────────────────────────────────── */
  const priceRange =
    restaurant.priceMin && restaurant.priceMax
      ? `$${restaurant.priceMin} - $${restaurant.priceMax}`
      : undefined

  /* ─────────────────────────────────────────────────────────────────────────
     Get current status (open/closed) based on time
     ───────────────────────────────────────────────────────────────────────── */
  const getCurrentStatus = (): "open" | "closed" | "closing-soon" => {
    const hour = new Date().getHours()
    if (hour >= 10 && hour < 22) return "open"
    if (hour >= 21 && hour < 22) return "closing-soon"
    return "closed"
  }

  const currentStatus = getCurrentStatus()

  /* ─────────────────────────────────────────────────────────────────────────
     Tab definitions
     ───────────────────────────────────────────────────────────────────────── */
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "menu" as const, label: "Menu", count: 24 },
    { id: "gallery" as const, label: "Gallery", count: restaurant.images.length },
    { id: "reviews" as const, label: "Reviews", count: 128 },
    { id: "location" as const, label: "Location" },
  ]

  /* ─────────────────────────────────────────────────────────────────────────
     Render tab content
     ───────────────────────────────────────────────────────────────────────── */
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-[var(--spacing-3xl)]">
            {/* Quick Info Bar */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-md)]">
              <div className="p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--fg-5)] text-center">
                <ClockIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)] mx-auto mb-[var(--spacing-xs)]" />
                <Badge variant="status" status={currentStatus} size="sm" />
              </div>
              <div className="p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--fg-5)] text-center">
                <StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-warning)] mx-auto mb-[var(--spacing-xs)]" />
                <p className="text-[var(--font-size-lg)] font-bold text-[var(--fg)]">
                  {restaurant.rating}
                </p>
              </div>
              <div className="p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--fg-5)] text-center">
                <CurrencyDollarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-success)] mx-auto mb-[var(--spacing-xs)]" />
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  {priceRange || "-"}
                </p>
              </div>
              <div className="p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--fg-5)] text-center">
                <MapPinIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-error)] mx-auto mb-[var(--spacing-xs)]" />
                <p className="text-[var(--font-size-xs)] text-[var(--fg-70)] line-clamp-2">
                  {restaurant.location || "-"}
                </p>
              </div>
            </section>

            {/* Description */}
            {restaurant.description && (
              <section>
                <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
                  About
                </h2>
                <p className="text-[var(--font-size-lg)] text-[var(--fg-70)] leading-relaxed">
                  {restaurant.description}
                </p>
              </section>
            )}

            {/* Opening Hours */}
            <section>
              <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
                Opening Hours
              </h2>
              <div className="p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--fg-5)]">
                <div className="space-y-[var(--spacing-sm)]">
                  {[
                    { days: "Monday - Thursday", hours: "10:00 AM - 10:00 PM" },
                    { days: "Friday - Saturday", hours: "10:00 AM - 11:00 PM" },
                    { days: "Sunday", hours: "10:00 AM - 10:00 PM" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-[var(--spacing-xs)] border-b border-[var(--fg-10)] last:border-0"
                    >
                      <span className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
                        {schedule.days}
                      </span>
                      <span className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-md)]">
              <a
                href={"tel:+97144444444"}
                className="flex flex-col items-center justify-center gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--color-primary)] text-[var(--color-white)] font-bold hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <PhoneIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
                <span className="text-[var(--font-size-sm)]">Call</span>
              </a>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-xl)] bg-[var(--color-primary)] text-[var(--color-white)] font-bold hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                <ClockIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
                <span className="text-[var(--font-size-sm)]">Reserve</span>
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.location || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-xl)] border-[2px] border-[var(--color-primary)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                <MapPinIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
                <span className="text-[var(--font-size-sm)]">Directions</span>
              </a>
              <button
                type="button"
                onClick={toggleFavorite}
                className="flex flex-col items-center justify-center gap-[var(--spacing-xs)] p-[var(--spacing-md)] rounded-[var(--radius-xl)] border-[2px] border-[var(--fg-20)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <HeartIcon
                  className={`h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] ${isFavorite ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""}`}
                />
                <span className="text-[var(--font-size-sm)]">{isFavorite ? "Saved" : "Save"}</span>
              </button>
            </section>
          </div>
        )

      case "menu":
        return <MenuSection />

      case "gallery":
        return (
          <div className="space-y-[var(--spacing-xl)]">
            <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">Gallery</h2>
            <ImageRail
              images={restaurant.images}
              alt={`${restaurant.title} photo`}
              size="lg"
              onImageClick={setActiveImageIndex}
            />
          </div>
        )

      case "reviews":
        return <ReviewsSection />

      case "location":
        return <LocationSection restaurant={restaurant} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main
        id="main-content"
        className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]"
      >
        {/* Back Button */}
        <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mb-[var(--spacing-lg)]">
          <a
            href="/"
            className="inline-flex items-center gap-[var(--spacing-xs)] text-[var(--fg)] hover:text-[var(--color-primary)] transition-colors duration-[var(--duration-normal)]"
          >
            <ArrowLeftIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
            <span className="text-[var(--font-size-sm)] font-medium">Back to Home</span>
          </a>
        </div>

        {/* Hero - Image Gallery */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
          <div
            className="relative rounded-[var(--radius-2xl)] overflow-hidden bg-[var(--fg-5)]"
            style={{ aspectRatio: "16/9" }}
          >
            {/* Main Image */}
            <img
              src={restaurant.images[activeImageIndex]}
              alt={restaurant.title}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation */}
            {restaurant.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center p-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--bg)]/80 backdrop-blur-sm hover:bg-[var(--bg)] transition-all duration-[var(--duration-normal)]"
                  aria-label="Previous image"
                >
                  <ArrowLeftIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)]" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-[var(--spacing-md)] top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center p-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--bg)]/80 backdrop-blur-sm hover:bg-[var(--bg)] transition-all duration-[var(--duration-normal)]"
                  aria-label="Next image"
                >
                  <ArrowLeftIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)] rotate-180" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-[var(--spacing-md)] left-1/2 -translate-x-1/2 flex gap-[var(--spacing-xs)]">
                  {restaurant.images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      style={{
                        transition: "all var(--duration-normal) var(--ease-out-quart)",
                      }}
                      className={`rounded-full min-h-[44px] min-w-[44px] ${
                        index === activeImageIndex
                          ? "bg-[var(--bg)] w-[var(--spacing-lg)]"
                          : "bg-[var(--bg)]/50 hover:bg-[var(--bg)]/70 w-[var(--spacing-xs)]"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Favorite & Share Buttons */}
            <div className="absolute top-[var(--spacing-md)] right-[var(--spacing-md)] flex gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={toggleFavorite}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--bg)]/80 backdrop-blur-sm hover:bg-[var(--bg)] transition-all duration-[var(--duration-normal)]"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <HeartIcon
                  className={`h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] ${
                    isFavorite
                      ? "text-[var(--color-primary)] fill-[var(--color-primary)]"
                      : "text-[var(--fg)]"
                  }`}
                />
              </button>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-[var(--spacing-md)] rounded-[var(--radius-full)] bg-[var(--bg)]/80 backdrop-blur-sm hover:bg-[var(--bg)] transition-all duration-[var(--duration-normal)]"
                aria-label="Share restaurant"
              >
                <ShareIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg)]" />
              </button>
            </div>
          </div>
        </section>

        {/* Title & Badges */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-2xl)]">
          <div className="flex flex-wrap items-start justify-between gap-[var(--spacing-md)]">
            <div className="flex-1 min-w-0">
              <h1 className="text-[var(--font-size-4xl)] font-bold text-[var(--fg)] tracking-tight">
                {restaurant.title}
              </h1>

              {/* Rating & Location */}
              <div className="flex flex-wrap items-center gap-[var(--spacing-md)] mt-[var(--spacing-sm)]">
                <div className="flex items-center gap-[var(--spacing-xs)]">
                  <StarIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-warning)] fill-[var(--color-warning)]" />
                  <span className="text-[var(--font-size-lg)] font-bold text-[var(--fg)]">
                    {restaurant.rating}
                  </span>
                </div>

                {restaurant.location && (
                  <>
                    <span className="text-[var(--fg-20)]">•</span>
                    <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--fg-70)]">
                      <MapPinIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                      <span className="text-[var(--font-size-md)]">{restaurant.location}</span>
                    </div>
                  </>
                )}

                {priceRange && (
                  <>
                    <span className="text-[var(--fg-20)]">•</span>
                    <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--fg-70)]">
                      <CurrencyDollarIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                      <span className="text-[var(--font-size-md)]">{priceRange}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          {restaurant.badges && restaurant.badges.length > 0 && (
            <div className="flex flex-wrap gap-[var(--spacing-sm)] mt-[var(--spacing-md)]">
              {restaurant.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Sticky Tabs */}
        <StickyTabs
          tabs={tabs}
          defaultTabId="overview"
          onChange={(id) => setActiveTab(id as ActiveTab)}
        />

        {/* Tab Content */}
        <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-3xl)]">
          {renderTabContent()}
        </div>

        {/* Similar Restaurants */}
        {similarRestaurants.length > 0 && activeTab === "overview" && (
          <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-3xl)]">
            <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mb-[var(--spacing-xl)]">
              Similar Restaurants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {similarRestaurants.map((r) => (
                <RestaurantCard key={r.id} {...r} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-[var(--spacing-4xl)] border-t border-[var(--fg-10)] mt-[var(--spacing-3xl)]">
          <div className="flex flex-col items-center gap-[var(--spacing-xl)]">
            <img
              src="/LOGO/logo.svg"
              alt="Shadi"
              className={`h-[var(--logo-size-footer)] opacity-[var(--opacity-quiet)] ${mode === "dark" ? "invert" : ""}`}
            />
            <p className="text-[var(--font-size-xs)] font-bold uppercase tracking-[var(--letter-spacing-wider)] opacity-[var(--opacity-muted)]">
              Your Gateway to Great Food
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
