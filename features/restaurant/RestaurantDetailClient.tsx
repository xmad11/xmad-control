/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANT DETAIL CLIENT - Clean, simple design
   Image carousel with CardCarousel (same as cards), badges, contact, social, map
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { OptimizedPreviewCard } from "@/components/cards/preview/OptimizedPreviewCard"
import { CardCarousel } from "@/components/carousel"
import {
  Facebook,
  Globe as GlobeIcon,
  Heart,
  Heart as HeartIcon,
  InstagramIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Share as ShareIcon,
} from "@/components/icons"
import { SimpleFooter } from "@/components/layout/SimpleFooter"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { useLanguage } from "@/context/LanguageContext"
import type { ShadiRestaurant } from "@/types/restaurant"
import { useCallback, useEffect, useState } from "react"

interface SimilarRestaurant {
  id: string
  slug: string
  name: string
  images: string[]
  rating: number
  cuisine: string
  blurHash?: string
  district?: string
  emirate?: string
}

interface RestaurantDetailClientProps {
  restaurant: ShadiRestaurant
  similarRestaurants: SimilarRestaurant[]
}

// Interface for Embla carousel DOM element with API
interface EmblaCarouselElement extends HTMLElement {
  emblaApi?: {
    scrollTo: (index: number) => void
  }
}

export default function RestaurantDetailClient({
  restaurant,
  similarRestaurants,
}: RestaurantDetailClientProps) {
  const { t } = useLanguage()
  const { showBackButtonInHeader, hideBackButton } = useNavigation()
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite || false)

  // Show back button in header on mount, hide on unmount
  useEffect(() => {
    showBackButtonInHeader()
    return () => {
      hideBackButton()
    }
  }, [showBackButtonInHeader, hideBackButton])

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev)
  }, [])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: restaurant.description || `Check out ${restaurant.name}`,
        url: window.location.href,
      })
    }
  }, [restaurant.name, restaurant.description])

  // Get recommended restaurants (similar restaurants)
  const recommendedRestaurants = similarRestaurants.slice(0, 4)

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="relative max-w-[var(--page-max-width)] mx-auto">
        {/* Image Carousel - Matching blogger page design */}
        <div className="relative mx-0 md:mx-[var(--spacing-xl)] lg:mx-[var(--spacing-2xl)] mb-[var(--spacing-xl)]">
          <div className="relative">
            {/* CardCarousel with border wrapper */}
            <div className="rounded-[var(--radius-2xl)] overflow-hidden border border-[var(--fg-10)]">
              <CardCarousel
                images={restaurant.images}
                alt={restaurant.name}
                height="min(49vh, 727px)"
                className="h-full"
                cardIndex={0}
                restaurantName={restaurant.name}
                showIndicators
              />
            </div>

            {/* Thumbnail Strip - Below carousel */}
            {restaurant.images.length > 1 && (
              <div className="flex justify-center gap-[var(--spacing-xs)] pt-[var(--spacing-xs)]">
                {restaurant.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => {
                      const carousel = document.querySelector(
                        '[class*="carousel-container"]'
                      ) as EmblaCarouselElement | null
                      if (carousel?.emblaApi) {
                        carousel.emblaApi.scrollTo(index)
                      }
                    }}
                    className="relative flex-shrink-0 w-[45px] h-[45px] md:w-[50px] md:h-[50px] overflow-hidden rounded-[var(--radius-md)] border-2 transition-all duration-200 hover:scale-105 border-[var(--fg-10)] opacity-60 hover:opacity-100 hover:border-[var(--color-primary)]"
                  >
                    <img
                      src={image}
                      alt={`${restaurant.name} ${t("restaurantDetail.gallery")} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons - Floating on Image (circular with backdrop) */}
            <div className="absolute top-[var(--spacing-md)] right-[var(--spacing-md)] flex gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={toggleFavorite}
                className={`h-[var(--touch-target-min)] w-[var(--touch-target-min)] flex items-center justify-center rounded-[var(--radius-full)] backdrop-blur-[var(--blur-md)] border border-[rgb(255_255_255/0.3)] transition-all duration-200 hover:scale-110 ${isFavorite ? "bg-[var(--color-favorite)] text-[var(--color-white)]" : "bg-[rgb(0_0_0/0.4)] text-[var(--color-white)]"}`}
                aria-label={
                  isFavorite
                    ? t("restaurantDetail.removeFromFavorites")
                    : t("restaurantDetail.addToFavorites")
                }
              >
                <HeartIcon
                  className={`h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="h-[var(--touch-target-min)] w-[var(--touch-target-min)] flex items-center justify-center rounded-[var(--radius-full)] bg-[rgb(0_0_0/0.4)] backdrop-blur-[var(--blur-md)] border border-[rgb(255_255_255/0.3)] text-[var(--color-white)] transition-all duration-200 hover:scale-110"
                aria-label={t("restaurantDetail.shareRestaurant")}
              >
                <ShareIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Consistent spacing throughout */}
        <div className="px-[var(--page-padding-x)] pt-[var(--spacing-lg)] pb-[var(--spacing-2xl)] space-y-[var(--spacing-xl)]">
          {/* Title + Location Section (no divider between) */}
          <section className="space-y-[var(--spacing-xs)]">
            <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
              {restaurant.name}
            </h1>
            {(restaurant.district || restaurant.emirate) && (
              <div className="flex items-center gap-[var(--card-gap-xs)]">
                <MapPinIcon
                  className="w-[var(--font-size-sm)] h-[var(--font-size-sm)] text-secondary-gray flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[var(--font-size-sm)] text-secondary-gray">
                  {[restaurant.district, restaurant.emirate].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-[var(--divider-width)] bg-[var(--fg-8)]" />

          {/* Social/Contact Icons */}
          <section>
            <div className="flex justify-center gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-md)] snap-x scrollbar-hide">
              {restaurant.phone && (
                <a
                  key="phone"
                  href={`tel:${restaurant.phone}`}
                  className="flex-shrink-0 snap-start flex items-center justify-center w-[60px] h-[60px] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-colors"
                  aria-label={t("restaurantDetail.callRestaurant")}
                >
                  <PhoneIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-success)]" />
                </a>
              )}
              {restaurant.instagram && (
                <a
                  key="instagram"
                  href={
                    restaurant.instagram.startsWith("http")
                      ? restaurant.instagram
                      : `https://instagram.com/${restaurant.instagram}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 snap-start flex items-center justify-center w-[60px] h-[60px] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-colors"
                  aria-label={t("restaurantDetail.instagram")}
                >
                  <InstagramIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)]" />
                </a>
              )}
              {restaurant.facebook && (
                <a
                  key="facebook"
                  href={
                    restaurant.facebook.startsWith("http")
                      ? restaurant.facebook
                      : `https://facebook.com/${restaurant.facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 snap-start flex items-center justify-center w-[60px] h-[60px] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-colors"
                  aria-label={t("restaurantDetail.facebook")}
                >
                  <Facebook className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)]" />
                </a>
              )}
              {restaurant.website && (
                <a
                  key="website"
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 snap-start flex items-center justify-center w-[60px] h-[60px] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)] hover:border-[var(--color-primary)] transition-colors"
                  aria-label={t("restaurantDetail.visitWebsite")}
                >
                  <GlobeIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--color-info)]" />
                </a>
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="h-[var(--divider-width)] bg-[var(--fg-8)]" />

          {/* Description */}
          {restaurant.description && (
            <section className="space-y-[var(--spacing-sm)]">
              <h2 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {t("restaurantDetail.about")}
              </h2>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] leading-relaxed">
                {restaurant.description}
              </p>
            </section>
          )}

          {/* Divider */}
          <div className="h-[var(--divider-width)] bg-[var(--fg-8)]" />

          {/* Location Map */}
          {restaurant.mapCoordinates && (
            <section className="space-y-[var(--spacing-sm)]">
              <h2 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {t("restaurantDetail.location")}
              </h2>
              <div
                className="rounded-[var(--radius-xl)] overflow-hidden bg-[var(--fg-5)]"
                style={{ aspectRatio: "16/9" }}
              >
                <iframe
                  src={`https://www.google.com/maps/embed?pb=${encodeURIComponent(
                    `!1m18!1m12!1m3!1d0!2d${restaurant.mapCoordinates.lng}!3d${restaurant.mapCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzMwLjAiTiA1M8KwMTgnMTMuMCJF!5e0!3m2!1sen!2sae!4v1234567890`
                  )}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant Location"
                />
              </div>
            </section>
          )}

          {/* Divider */}
          <div className="h-[var(--divider-width)] bg-[var(--fg-8)]" />

          {/* Recommended Restaurants */}
          {recommendedRestaurants.length > 0 && (
            <section className="space-y-[var(--spacing-sm)]">
              <h2 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                {t("restaurantDetail.recommended")}
              </h2>
              <div className="flex gap-[var(--spacing-md)] overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory snap-start scroll-smooth">
                {recommendedRestaurants.map((r) => (
                  <div
                    key={r.id}
                    className="flex-shrink-0 w-[var(--card-width-mobile)] sm:w-[var(--card-width-sm)] md:w-[var(--card-width-md)] lg:w-[var(--card-width-lg)] xl:w-[var(--card-width-xl)] snap-start"
                  >
                    <OptimizedPreviewCard
                      id={r.id}
                      title={r.name}
                      image={r.images[0]}
                      blurHash={r.blurHash}
                      rating={r.rating}
                      href={`/restaurants/${r.slug}`}
                      location={[r.district, r.emirate].filter(Boolean).join(", ")}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}
