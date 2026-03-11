/* ═══════════════════════════════════════════════════════════════════════════════
   SEARCH CONTAINER - Restaurant/Blog search with filters
   Location icon inside search box (left), Search icon inside (right)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import TypingAnimation from "@/components/TypingAnimation"
import {
  ATMOSPHERE_OPTIONS,
  type AtmosphereOption,
  CUISINE_CATEGORIES,
  CUISINE_OPTIONS,
  type CuisineCategory,
  type CuisineOption,
  LOCATION_OPTIONS,
  type LocationOption,
  MEAL_OPTIONS,
  type MealOption,
} from "@/components/filters/filterData"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MicrophoneIcon,
  XMarkIcon,
} from "@/components/icons"
import { FunnelIcon } from "@/components/icons"
import { BackButton } from "@/components/navigation/BackButton"
import { ViewModeButton, type ViewModeId } from "@/components/view-mode"
import { useLanguage } from "@/context/LanguageContext"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type ViewMode = ViewModeId

export type SortOptionId = "price-desc" | "price-asc" | "distance" | "newest"

const SORT_OPTIONS = [
  {
    id: "price-desc" as const,
    label: "Price: High to Low",
    icon: CurrencyDollarIcon,
    direction: "down" as const,
  },
  {
    id: "price-asc" as const,
    label: "Price: Low to High",
    icon: CurrencyDollarIcon,
    direction: "up" as const,
  },
  { id: "distance" as const, label: "Nearest", icon: MapPinIcon, direction: null },
  { id: "newest" as const, label: "Newest First", icon: ClockIcon, direction: null },
]

// Helper to create translated phrases array
function getTypingPhrases(t: (key: string) => string): string[] {
  return [
    t("searchPhrases.searchRestaurants"),
    t("searchPhrases.topRatedPlaces"),
    t("searchPhrases.bestBrunchSpots"),
    t("searchPhrases.outdoorSeating"),
    t("searchPhrases.familyFriendly"),
    t("searchPhrases.romanticDinner"),
    t("searchPhrases.seafoodSpots"),
    t("searchPhrases.budgetFriendly"),
    t("searchPhrases.fineDining"),
    t("searchPhrases.petFriendly"),
    t("searchPhrases.vegetarianOptions"),
    t("searchPhrases.hotelRestaurants"),
    t("searchPhrases.buffetStyle"),
    t("searchPhrases.coffeeAndDesserts"),
    t("searchPhrases.hiddenGems"),
  ]
}

// Translation key mapping for filter options
const FILTER_LABEL_KEYS: Record<string, string> = {
  // Meal options
  breakfast: "filters.breakfast",
  lunch: "filters.lunch",
  dinner: "filters.dinner",
  brunch: "filters.brunch",
  buffet: "filters.buffet",
  desserts: "filters.desserts",
  "coffee-juice": "filters.coffeeJuice",
  // Cuisine categories
  "famous": "filters.famousFoods",
  "arabic": "filters.arabic",
  "asian": "filters.asian",
  "international": "filters.internationalFood",
  "cafe": "filters.cafeDesserts",
  // Cuisine options
  shawarma: "filters.shawarma",
  burger: "filters.burger",
  pizza: "filters.pizza",
  falafel: "filters.falafel",
  steak: "filters.steak",
  bbq: "filters.bbq",
  taco: "filters.taco",
  emirati: "filters.emirati",
  lebanese: "filters.lebanese",
  turkish: "filters.turkish",
  syrian: "filters.syrian",
  jordanian: "filters.jordanian",
  persian: "filters.persian",
  indian: "filters.indian",
  pakistani: "filters.pakistani",
  chinese: "filters.chinese",
  japanese: "filters.japanese",
  thai: "filters.thai",
  korean: "filters.korean",
  italian: "filters.italian",
  french: "filters.french",
  spanish: "filters.spanish",
  greek: "filters.greek",
  mexican: "filters.mexican",
  american: "filters.american",
  bakery: "filters.bakery",
  juices: "filters.juices",
  "ice-cream": "filters.iceCream",
  // Atmosphere options
  romantic: "filters.romantic",
  iconic: "filters.iconic",
  "family-friendly": "filters.familyFriendly",
  casual: "filters.casual",
  "fine-dining": "filters.fineDining",
  "budget-friendly": "filters.budgetFriendly",
  trendy: "filters.trendy",
  traditional: "filters.traditional",
  "hidden-gem": "filters.hiddenGem",
  outdoor: "filters.outdoor",
  business: "filters.businessDining",
  "kids-friendly": "filters.kidsFriendly",
  "outdoor-seating": "filters.outdoorSeating",
  "late-night": "filters.lateNight",
  "pet-friendly": "filters.petFriendly",
  // Location options
  all: "filters.allLocations",
  "near-me": "filters.nearMe",
  "abu-dhabi": "filters.abuDhabi",
  dubai: "filters.dubai",
  sharjah: "filters.sharjah",
  ajman: "filters.ajman",
  "umm-al-quwain": "filters.ummAlQuwain",
  "ras-al-khaimah": "filters.rasAlKhaimah",
  fujairah: "filters.fujairah",
}

// Helper function to get translated label for filter option
function getFilterLabel(id: string, t: (key: string) => string): string {
  const key = FILTER_LABEL_KEYS[id]
  return key ? t(key) : id
}

interface SearchContainerProps {
  placeholder?: string
  resultCount?: number
  onSearch?: (query: string) => void
  searchQuery?: string // Controlled search query from parent
  // Filter states
  location?: LocationOption
  selectedMeals?: MealOption[]
  onMealToggle?: (meal: MealOption) => void
  selectedCuisines?: CuisineOption[]
  onCuisineToggle?: (cuisine: CuisineOption) => void
  selectedAtmospheres?: AtmosphereOption[]
  onAtmosphereToggle?: (atmosphere: AtmosphereOption) => void
  // Sort & View props
  sort?: SortOptionId
  onSortChange?: (sortId: SortOptionId) => void
  viewMode?: ViewModeId
  onViewModeChange?: (view: ViewModeId) => void
  showViewToggle?: boolean
  showBackButton?: boolean
  onBack?: () => void
  autoFocus?: boolean
  className?: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SEARCH CONTAINER COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export function SearchContainer({
  placeholder: _placeholder = "Search restaurants, cuisines, dishes…",
  resultCount = 0,
  onSearch,
  searchQuery: controlledSearchQuery = "",
  location = "all",
  selectedMeals = [],
  onMealToggle,
  selectedCuisines = [],
  onCuisineToggle,
  selectedAtmospheres = [],
  onAtmosphereToggle,
  sort = "newest",
  onSortChange,
  viewMode = "grid-4",
  onViewModeChange,
  showViewToggle = true,
  showBackButton = false,
  onBack,
  autoFocus = false,
  className = "",
}: SearchContainerProps) {
  const { t } = useLanguage()

  // Translated typing phrases
  const typingPhrases = useMemo(() => getTypingPhrases(t), [t])

  const [isFocused, setIsFocused] = useState(false)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [activeFilterTab, setActiveFilterTab] = useState<"meal" | "cuisine" | "atmosphere">("meal") // Changed default from "location" to "meal"
  const [activeCuisineCategory, setActiveCuisineCategory] = useState<CuisineCategory["id"]>(
    CUISINE_CATEGORIES[0]?.id || "famous"
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const filterSheetRef = useRef<HTMLDivElement>(null)

  // Auto-focus search input when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleClear = useCallback(() => {
    onSearch?.("")
    inputRef.current?.focus()
  }, [onSearch])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch?.(e.target.value)
    },
    [onSearch]
  )

  // Close filter sheet when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterSheetRef.current && !filterSheetRef.current.contains(e.target as Node)) {
        setIsFilterSheetOpen(false)
      }
    }

    if (isFilterSheetOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterSheetOpen])

  // Get selected count for each filter type
  const selectedCount = {
    location: location !== "all" ? 1 : 0,
    meal: selectedMeals.length,
    cuisine: selectedCuisines.length,
    atmosphere: selectedAtmospheres.length,
  }

  return (
    <div className={`space-y-[var(--spacing-xl)] ${className}`}>
      {/* ─────────────────────────────────────────────────────────────────────────
          Row 1: Back Icon + Search Container + Filter Button
          ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-[var(--spacing-sm)]">
        {/* Back Icon */}
        {showBackButton && onBack && (
          <BackButton onClick={onBack} className="flex-shrink-0 p-[var(--spacing-xs)]" />
        )}

        {/* Main Search Container - Search Input Only */}
        <div className="relative flex-1">
          <div className="flex items-stretch bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-xl)] overflow-hidden focus-within:border-[var(--color-primary)]/50 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all duration-[var(--duration-normal)]">
            {/* Search Icon */}
            <div className="flex items-center justify-center basis-[4.5%] min-w-[calc(var(--spacing-xl)+var(--spacing-xs))] px-[var(--spacing-xs)]">
              <MagnifyingGlassIcon className="w-[var(--icon-size-search)] h-[var(--icon-size-search)] text-[var(--fg)] opacity-[var(--opacity-muted)] flex-shrink-0" />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="search"
                value={controlledSearchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-[var(--spacing-md)] py-[0.75rem] bg-transparent text-[var(--font-size-search)] text-[var(--fg)] focus:outline-none"
                aria-label="Search restaurants"
              />

              {/* Typing Animation Placeholder - Shows when empty and not focused */}
              {!controlledSearchQuery && !isFocused && (
                <div className="absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 pointer-events-none">
                  <TypingAnimation
                    phrases={typingPhrases}
                    typingSpeed={50}
                    phraseDelay={2000}
                    className="text-[var(--font-size-search)] opacity-[var(--opacity-muted)]"
                    showCursor={false}
                  />
                </div>
              )}

              {/* Clear Icon - Shows when there's text */}
              {controlledSearchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-[var(--spacing-md)] top-1/2 -translate-y-1/2 flex items-center justify-center w-[var(--icon-size-search)] h-[var(--icon-size-search)] hover:bg-[var(--fg-5)] rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-[var(--icon-size-search)] h-[var(--icon-size-search)] text-[var(--fg)]" />
                </button>
              )}

              {/* Microphone Icon - Shows when empty, inside search box */}
              {!controlledSearchQuery && (
                <button
                  type="button"
                  className="absolute right-[var(--spacing-md)] top-1/2 -translate-y-1/2 flex items-center justify-center w-[var(--icon-size-search)] h-[var(--icon-size-search)] hover:bg-[var(--fg-5)] rounded-full transition-colors"
                  aria-label="Voice search"
                >
                  <MicrophoneIcon className="w-[var(--icon-size-search)] h-[var(--icon-size-search)] text-[var(--fg)] opacity-[var(--opacity-muted)]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Button - Same Height Container as Search */}
        <div className="relative flex-shrink-0" ref={filterSheetRef}>
          <div className="flex items-stretch bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-xl)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-[var(--duration-normal)]">
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
              className="flex items-center justify-center px-[var(--spacing-md)] md:px-[var(--spacing-lg)] py-[0.75rem] hover:bg-[var(--fg-5)] transition-colors relative flex-1"
              aria-label={t("filters.openFilters")}
            >
              <FunnelIcon className="w-[var(--icon-size-search)] h-[var(--icon-size-search)] text-[var(--fg)] opacity-[var(--opacity-muted)] flex-shrink-0" />
              {/* Filter count badge - exclude location from count */}
              {selectedCount.meal + selectedCount.cuisine + selectedCount.atmosphere > 0 && (
                <span className="absolute -top-1 -right-1 w-[var(--spacing-sm)] h-[var(--spacing-sm)] bg-[var(--color-primary)] text-white text-[var(--font-size-2xs)] font-bold rounded-full flex items-center justify-center">
                  {selectedCount.meal + selectedCount.cuisine + selectedCount.atmosphere}
                </span>
              )}
            </button>
          </div>

          {/* Filter Sheet - 50% Height with Tabs */}
          {isFilterSheetOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/20 z-60"
                onClick={() => setIsFilterSheetOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsFilterSheetOpen(false)
                }}
                role="presentation"
              />
              {/* Bottom Drawer - 50% Height */}
              <div className="fixed left-0 right-0 bottom-0 z-[var(--z-dropdown)] h-[50vh] bg-[var(--bg)] border-t border-[var(--fg-20)] rounded-t-[var(--radius-2xl)] shadow-[var(--shadow-2xl)] flex flex-col">
                {/* Handle + Close */}
                <div className="flex justify-between items-center px-[var(--spacing-md)] pt-[var(--spacing-sm)] pb-0 flex-shrink-0">
                  <div className="flex justify-center flex-1">
                    <div className="w-[var(--spacing-2xl)] h-[var(--spacing-xs)] bg-[var(--fg-30)] rounded-full" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="p-[var(--spacing-xs)] hover:bg-[var(--fg-10)] rounded-full"
                    aria-label={t("filters.closeFilters")}
                  >
                    <XMarkIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--fg)]" />
                  </button>
                </div>

                {/* Filter Tabs - Location removed */}
                <div className="flex gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--fg-10)] overflow-x-auto scrollbar-hide flex-shrink-0">
                  {[
                    { key: "meal" as const, label: t("filters.meal"), count: selectedCount.meal },
                    { key: "cuisine" as const, label: t("filters.cuisine"), count: selectedCount.cuisine },
                    {
                      key: "atmosphere" as const,
                      label: t("filters.atmosphere"),
                      count: selectedCount.atmosphere,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilterTab(tab.key)}
                      className={`flex-shrink-0 flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-fast)] whitespace-nowrap relative ${
                        activeFilterTab === tab.key
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--fg-10)] text-[var(--fg)] hover:bg-[var(--fg-20)]"
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          className={`ml-1 px-[var(--spacing-xs)] rounded-full text-[var(--font-size-2xs)] ${
                            activeFilterTab === tab.key
                              ? "bg-white/20"
                              : "bg-[var(--color-primary)] text-white"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Filter Options - Vertical List with Checkboxes */}
                <div className="flex-1 overflow-y-auto px-[var(--spacing-md)] py-[var(--spacing-sm)]">
                  <div className="space-y-[var(--spacing-sm)]">
                    {/* Meal Options - Multi Select with Checkbox */}
                    {activeFilterTab === "meal" &&
                      MEAL_OPTIONS.map((option) => {
                        const isSelected = selectedMeals.includes(option.id)
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              onMealToggle?.(option.id)
                            }}
                            className={`w-full flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-fast)] ${
                              isSelected
                                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                            }`}
                          >
                            {/* Checkbox */}
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                                  : "border-[var(--fg-30)]"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span>{getFilterLabel(option.id, t)}</span>
                          </button>
                        )
                      })}

                    {/* Cuisine Options - Categories with Subcategories */}
                    {activeFilterTab === "cuisine" && (
                      <div className="flex flex-col h-full">
                        {/* Category Tabs - Sub-tabs within cuisine */}
                        <div className="flex gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-sm)] border-b border-[var(--fg-10)] overflow-x-auto scrollbar-hide flex-shrink-0">
                          {CUISINE_CATEGORIES.map((category) => {
                            // Count how many items from this category are selected
                            const categorySelectedCount = category.subcategories.filter((sub) =>
                              selectedCuisines.includes(sub)
                            ).length

                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCuisineCategory(category.id)}
                                className={`flex-shrink-0 flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] text-[var(--font-size-xs)] font-medium transition-colors duration-[var(--duration-fast)] whitespace-nowrap ${
                                  activeCuisineCategory === category.id
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "bg-[var(--fg-10)] text-[var(--fg)] hover:bg-[var(--fg-20)]"
                                }`}
                              >
                                {getFilterLabel(category.id, t)}
                                {categorySelectedCount > 0 && (
                                  <span
                                    className={`ml-1 px-[var(--spacing-xs)] rounded-full text-[var(--font-size-2xs)] ${
                                      activeCuisineCategory === category.id
                                        ? "bg-white/20"
                                        : "bg-[var(--color-primary)] text-white"
                                    }`}
                                  >
                                    {categorySelectedCount}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {/* Subcategories - Checkboxes */}
                        <div className="flex-1 overflow-y-auto py-[var(--spacing-sm)] space-y-[var(--spacing-xs)]">
                          {CUISINE_CATEGORIES.find(
                            (cat) => cat.id === activeCuisineCategory
                          )?.subcategories.map((subcategoryId) => {
                            const subcategoryLabel = getFilterLabel(subcategoryId, t)
                            const isSelected = selectedCuisines.includes(subcategoryId)

                            return (
                              <button
                                key={subcategoryId}
                                type="button"
                                onClick={() => {
                                  onCuisineToggle?.(subcategoryId)
                                }}
                                className={`w-full flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-fast)] ${
                                  isSelected
                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                    : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                                }`}
                              >
                                {/* Checkbox */}
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                                      : "border-[var(--fg-30)]"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      aria-hidden="true"
                                      focusable="false"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span>{subcategoryLabel}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Atmosphere Options - Multi Select with Checkbox */}
                    {activeFilterTab === "atmosphere" &&
                      ATMOSPHERE_OPTIONS.map((option) => {
                        const isSelected = selectedAtmospheres.includes(option.id)
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              onAtmosphereToggle?.(option.id)
                            }}
                            className={`w-full flex items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-fast)] ${
                              isSelected
                                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                            }`}
                          >
                            {/* Checkbox */}
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                                  : "border-[var(--fg-30)]"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span>{getFilterLabel(option.id, t)}</span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          Row 2: Results Count (Left) + Sort & View Options (Right, Aligned Left)
          ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-[var(--spacing-md)]">
        {/* Results Count - Left */}
        <span className="text-[var(--font-size-xs)] text-[var(--fg)] opacity-[var(--opacity-medium)] whitespace-nowrap">
          <span className="font-medium">{resultCount}</span> {t("restaurants.searchResults")}
        </span>

        {/* Right Controls - Sort + View, Aligned Left */}
        <div className="flex items-center gap-[var(--spacing-xs)] flex-shrink-0">
          {/* Sort Button Container */}
          <div className="relative">
            <div className="flex items-stretch bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-xl)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-[var(--duration-normal)]">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = SORT_OPTIONS.findIndex((opt) => opt.id === sort)
                  const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length
                  onSortChange?.(SORT_OPTIONS[nextIndex].id)
                }}
                className="flex items-center justify-center p-[var(--spacing-sm)] hover:bg-[var(--fg-5)] transition-colors"
                aria-label="Cycle sort options"
              >
                {(() => {
                  const sortOption = SORT_OPTIONS.find((opt) => opt.id === sort)
                  const Icon = sortOption?.icon || CurrencyDollarIcon
                  const direction = sortOption?.direction

                  return (
                    <div className="relative">
                      <Icon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg)] opacity-[var(--opacity-muted)]" />
                      {direction && (
                        <svg
                          className={`absolute w-[10px] h-[10px] text-[var(--fg)] opacity-[var(--opacity-muted)] ${
                            direction === "up"
                              ? "top-0 left-1/2 -translate-x-1/2 -translate-y-[4px]"
                              : "bottom-0 left-1/2 -translate-x-1/2 translate-y-[4px]"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-label={direction === "up" ? "Sort ascending" : "Sort descending"}
                          role="img"
                        >
                          <title>{direction === "up" ? "Sort ascending" : "Sort descending"}</title>
                          {direction === "up" ? (
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          ) : (
                            <path d="M12 5v14M5 12l7 7 7-7" />
                          )}
                        </svg>
                      )}
                    </div>
                  )
                })()}
              </button>
            </div>
          </div>

          {/* View Mode Button Container */}
          {showViewToggle && (
            <div className="relative flex items-stretch bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-xl)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-[var(--duration-normal)]">
              <ViewModeButton
                currentView={viewMode}
                onViewChange={onViewModeChange || (() => {})}
                className="hover:bg-[var(--fg-5)] flex-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
