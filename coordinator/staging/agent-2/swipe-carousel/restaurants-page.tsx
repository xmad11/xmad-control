/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANTS LIST PAGE - Discover all restaurants
   Filter bar + HORIZONTAL SWIPE CAROUSEL (replaced grid)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { mockRestaurants } from "@/__mock__/restaurants"
import { RestaurantCard } from "@/components/card"
import { ChevronDownIcon, FunnelIcon } from "@/components/icons"
import { PageContainer } from "@/components/layout/PageContainer"
import { SwipeCarousel } from "./SwipeCarousel"

function FilterBar() {
  return (
    <div className="sticky top-[var(--header-total-height)] z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--fg-10)] py-[var(--spacing-md)] mb-[var(--spacing-lg)]">
      <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto no-scrollbar">
        {/* Filter Button */}
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] whitespace-nowrap"
        >
          <FunnelIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Filters
        </button>

        {/* Emirate Filter */}
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
        >
          All Emirates
          <ChevronDownIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
        </button>

        {/* Cuisine Filter */}
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
        >
          Cuisine
          <ChevronDownIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
        </button>

        {/* Price Filter */}
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
        >
          Price
          <ChevronDownIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
        </button>

        {/* Family/Kids Filter */}
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
        >
          Family Friendly
        </button>
      </div>
    </div>
  )
}

function RestaurantsListClient() {
  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]">
        <PageContainer>
          {/* Page Header */}
          <section className="py-[var(--spacing-3xl)]">
            <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
              All <span className="text-[var(--color-primary)] italic">Restaurants</span>
            </h1>
            <p className="opacity-[var(--opacity-medium)] text-[var(--font-size-lg)]">
              Discover amazing dining experiences across the UAE
            </p>
          </section>

          {/* Filter Bar - Sticky */}
          <FilterBar />

          {/* Results Count */}
          <div className="mb-[var(--spacing-md)]">
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Showing{" "}
              <span className="font-semibold text-[var(--fg)]">{mockRestaurants.length}</span>{" "}
              restaurants
            </p>
          </div>

          {/* Restaurant Cards with SwipeCarousel for Multi-Image Galleries */}
          {/* Each card shows a carousel of restaurant images */}
          <div className="space-y-[var(--spacing-lg)]">
            {mockRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-[var(--bg)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden"
              >
                {/* Image Carousel */}
                {restaurant.images && restaurant.images.length > 0 && (
                  <SwipeCarousel
                    images={restaurant.images}
                    height="16rem"
                    showIndicators={restaurant.images.length > 1}
                    autoPlay={false}
                    cardIndex={0}
                    restaurantName={restaurant.name}
                  />
                )}

                {/* Restaurant Info */}
                <div className="p-[var(--spacing-md)]">
                  <RestaurantCard variant="compact" {...restaurant} />
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </main>
    </div>
  )
}

export function RestaurantsPage() {
  return <RestaurantsListClient />
}
