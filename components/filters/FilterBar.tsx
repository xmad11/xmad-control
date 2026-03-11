/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER BAR - 3-button floating filter bar with bottom sheet
   Meal (Red), Cuisine (Green), Atmosphere (Blue)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { FilterOptionChip } from "@/components/filters/FilterOptionChip"
import { FilterPillButton } from "@/components/filters/FilterPillButton"
import {
  ATMOSPHERE_OPTIONS,
  type AtmosphereOption,
  CUISINE_CATEGORIES,
  CUISINE_OPTIONS,
  type CuisineCategory,
  type CuisineOption,
  MEAL_OPTIONS,
  type MealOption,
} from "@/components/filters/filterData"
import { useDragToClose } from "@/components/filters/hooks/useDragToClose"
import { useScrollVisibility } from "@/components/filters/hooks/useScrollVisibility"
import { ChefHat, Sparkles, Sun, Utensils, X } from "lucide-react"
import { useEffect } from "react"
import { useCallback, useState } from "react"

type FilterKey = "meal" | "cuisine" | "atmosphere"

interface FilterBarProps {
  selectedMeals?: MealOption[]
  onMealToggle?: (meal: MealOption) => void
  selectedCuisines?: CuisineOption[]
  onCuisineToggle?: (cuisine: CuisineOption) => void
  selectedAtmospheres?: AtmosphereOption[]
  onAtmosphereToggle?: (atmosphere: AtmosphereOption) => void
}

// Removed SubcategoryChip - now using FilterOptionChip for consistency

export function FilterBar({
  selectedMeals = [],
  onMealToggle = () => {},
  selectedCuisines = [],
  onCuisineToggle = () => {},
  selectedAtmospheres = [],
  onAtmosphereToggle = () => {},
}: FilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const isVisible = useScrollVisibility()

  const { handleTouchStart, handleTouchMove, handleTouchEnd, dragOffset } = useDragToClose(
    () => setActiveFilter(null),
    activeFilter !== null
  )

  // Filter configs - Updated icons
  const _FILTER_CONFIG = {
    meal: { label: "Meal", icon: Utensils },
    cuisine: { label: "Cuisine", icon: ChefHat },
    atmosphere: { label: "Atmosphere", icon: Sparkles },
  } as const

  const handleFilterClick = (filterKey: FilterKey) => {
    if (activeFilter === filterKey) {
      setActiveFilter(null)
      setExpandedCategory(null)
    } else {
      setActiveFilter(filterKey)
      // Auto-expand first category for cuisine filter
      if (filterKey === "cuisine") {
        setExpandedCategory("famous") // Famous Foods is first category
      } else {
        setExpandedCategory(null)
      }
    }
  }

  const handleClearAll = useCallback(() => {
    // Clear all selections
    selectedMeals.forEach((meal) => onMealToggle(meal))
    selectedCuisines.forEach((cuisine) => onCuisineToggle(cuisine))
    selectedAtmospheres.forEach((atm) => onAtmosphereToggle(atm))
    setActiveFilter(null)
    setExpandedCategory(null)
  }, [
    selectedMeals,
    selectedCuisines,
    selectedAtmospheres,
    onMealToggle,
    onCuisineToggle,
    onAtmosphereToggle,
  ])

  const hasAnySelection =
    selectedMeals.length > 0 || selectedCuisines.length > 0 || selectedAtmospheres.length > 0
  const isAnyActive = activeFilter !== null

  // Find which category has selected subcategories
  const _activeCategoryWithSelection = CUISINE_CATEGORIES.find((cat) =>
    cat.subcategories.some((sub) => selectedCuisines.includes(sub))
  )

  // Lock body scroll and hide header when filter is active
  useEffect(() => {
    if (activeFilter) {
      // Lock body scroll
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"

      // Hide header
      const header = document.querySelector('[class*="z-[var(--z-header)]"]')
      if (header) {
        ;(header as HTMLElement).style.display = "none"
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""

      // Show header
      const header = document.querySelector('[class*="z-[var(--z-header)]"]')
      if (header) {
        ;(header as HTMLElement).style.display = ""
      }
    }

    return () => {
      // Cleanup: restore everything
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""

      const header = document.querySelector('[class*="z-[var(--z-header)]"]')
      if (header) {
        ;(header as HTMLElement).style.display = ""
      }
    }
  }, [activeFilter])

  return (
    <>
      {/* Backdrop - blur effect */}
      {activeFilter && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[var(--z-filter-backdrop)] transition-opacity duration-700 var(--ease-out-quart)"
          onClick={() => setActiveFilter(null)}
        />
      )}

      {/* Filter Title + Clear All - Outside sheet, same line */}
      {activeFilter && (
        <div className="fixed bottom-[var(--filter-sheet-height)] left-0 right-0 z-[calc(var(--z-filter-sheet)+1)] flex items-center justify-between px-[var(--spacing-md)] md:px-[var(--spacing-2xl)] py-[var(--spacing-sm)]">
          {/* Left: Title with emoji */}
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--fg)]">
            {activeFilter === "meal" && "🍔 What should I eat now?"}
            {activeFilter === "cuisine" && "🌍 Shadi's flavors"}
            {activeFilter === "atmosphere" && "✨ What's the vibe?"}
          </h2>

          {/* Right: Clear All (only shows when filters active) */}
          {hasAnySelection && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-[var(--font-size-sm)] font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Bottom Sheet */}
      {activeFilter && (
        <div
          className={`
            fixed left-0 right-0 bottom-0 z-[var(--z-filter-sheet)]
            bg-[var(--bg)] rounded-t-[var(--radius-2xl)]
            shadow-[var(--shadow-2xl)]
            transition-transform duration-700 var(--ease-out-quart)
            ${isVisible ? "translate-y-0" : "translate-y-full"}
          `}
          style={{
            transform: `translateY(${dragOffset}px)`,
            height: "var(--filter-sheet-height)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-[var(--spacing-xs)] pb-0 cursor-grab active:cursor-grabbing">
            <div className="w-[var(--spacing-2xl)] h-[var(--spacing-xs)] bg-[var(--fg-30)] rounded-full" />
          </div>

          {/* Sheet Content */}
          <div className="px-[var(--spacing-md)] pt-[var(--spacing-sm)] pb-[var(--spacing-xl)] h-full overflow-y-auto touch-pan-y relative">
            {/* Meal Options - 2 lines with horizontal scrolling */}
            {activeFilter === "meal" && (
              <div className="flex flex-col gap-[var(--spacing-sm)] mt-[var(--spacing-md)]">
                {/* Line 1: First 4 options */}
                <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                  {MEAL_OPTIONS.slice(0, 4).map((option) => (
                    <FilterOptionChip
                      key={option.id}
                      option={option.label}
                      isSelected={selectedMeals.includes(option.id)}
                      onToggle={() => onMealToggle(option.id)}
                      filterKey="meal"
                    />
                  ))}
                </div>
                {/* Line 2: Last 3 options */}
                <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                  {MEAL_OPTIONS.slice(4).map((option) => (
                    <FilterOptionChip
                      key={option.id}
                      option={option.label}
                      isSelected={selectedMeals.includes(option.id)}
                      onToggle={() => onMealToggle(option.id)}
                      filterKey="meal"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cuisine Categories - Single line, horizontal scrolling */}
            {activeFilter === "cuisine" && (
              <div className="flex flex-col gap-[var(--spacing-sm)] mt-[var(--spacing-md)]">
                {/* Line 1: Categories (single line, horizontal scroll) */}
                <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                  {CUISINE_CATEGORIES.map((category) => {
                    const selectedInCategory = category.subcategories.filter((c) =>
                      selectedCuisines.includes(c)
                    )
                    const hasSubsSelected = selectedInCategory.length > 0
                    const isExpanded = expandedCategory === category.id

                    return (
                      <FilterOptionChip
                        key={category.id}
                        option={category.label}
                        isSelected={hasSubsSelected}
                        isExpanded={isExpanded}
                        filterKey="cuisine"
                        onToggle={() => {
                          // Toggle expanded category - show neon indicator
                          if (isExpanded) {
                            setExpandedCategory(null)
                          } else {
                            setExpandedCategory(category.id)
                          }
                        }}
                      />
                    )
                  })}
                </div>

                {/* Line 2: Subcategories (same shape as meal/atmosphere, horizontal scroll) */}
                {expandedCategory && (
                  <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                    {CUISINE_CATEGORIES.find((c) => c.id === expandedCategory)?.subcategories.map(
                      (subId) => {
                        const subOption = CUISINE_OPTIONS.find((opt) => opt.id === subId)
                        return subOption ? (
                          <FilterOptionChip
                            key={subId}
                            option={subOption.label}
                            isSelected={selectedCuisines.includes(subId)}
                            onToggle={() => onCuisineToggle(subId)}
                          />
                        ) : null
                      }
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Atmosphere Options - 2 lines with horizontal scrolling */}
            {activeFilter === "atmosphere" && (
              <div className="flex flex-col gap-[var(--spacing-sm)] mt-[var(--spacing-md)]">
                {/* Line 1: First 8 options */}
                <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                  {ATMOSPHERE_OPTIONS.slice(0, 8).map((option) => (
                    <FilterOptionChip
                      key={option.id}
                      option={option.label}
                      isSelected={selectedAtmospheres.includes(option.id)}
                      onToggle={() => onAtmosphereToggle(option.id)}
                      filterKey="atmosphere"
                    />
                  ))}
                </div>
                {/* Line 2: Last 8 options */}
                <div className="flex gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden pb-[var(--spacing-sm)] scrollbar-hide md:justify-center">
                  {ATMOSPHERE_OPTIONS.slice(8).map((option) => (
                    <FilterOptionChip
                      key={option.id}
                      option={option.label}
                      isSelected={selectedAtmospheres.includes(option.id)}
                      onToggle={() => onAtmosphereToggle(option.id)}
                      filterKey="atmosphere"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Bar - 3 Floating Pills */}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2 bottom-[var(--header-padding-y)]
          z-[var(--z-filter-bar)]
          flex items-center gap-[var(--spacing-sm)]
          transition-transform duration-700 var(--ease-out-quart)
          ${isVisible ? "translate-y-0" : "translate-y-[200%]"}
        `}
      >
        <div className="flex items-center gap-[var(--spacing-sm)] p-[var(--spacing-sm)]">
          <FilterPillButton
            filterKey="meal"
            isActive={activeFilter === "meal"}
            onClick={() => handleFilterClick("meal")}
            selectedCount={selectedMeals.length}
            isAnyActive={isAnyActive}
          />

          <FilterPillButton
            filterKey="cuisine"
            isActive={activeFilter === "cuisine"}
            onClick={() => handleFilterClick("cuisine")}
            selectedCount={selectedCuisines.length}
            isAnyActive={isAnyActive}
          />

          <FilterPillButton
            filterKey="atmosphere"
            isActive={activeFilter === "atmosphere"}
            onClick={() => handleFilterClick("atmosphere")}
            selectedCount={selectedAtmospheres.length}
            isAnyActive={isAnyActive}
          />
        </div>
      </div>
    </>
  )
}
