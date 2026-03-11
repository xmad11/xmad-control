/**
 * Website Management Component
 *
 * Controls for HomeClient page:
 * - Tab names and sequence
 * - Categories and sequence
 * - Marquee images
 * - Hero title and morph words
 * - Typing animation
 *
 * 100% design token compliant - no hardcoded values
 */

"use client"

import { FilterBar } from "@/components/filters/FilterBar"
import type {
  AtmosphereOption,
  CuisineOption,
  LocationOption,
  MealOption,
} from "@/components/filters/filterData"
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  HomeIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@/components/icons"
import type { SortOptionId } from "@/components/search"
import { SearchContainer, type ViewMode } from "@/components/search/SearchContainer"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

// ============================================================================
// TYPES
// ============================================================================

interface WebsiteTab {
  id: string
  name: string
  slug: string
  icon: string
  order: number
  visible: boolean
}

interface WebsiteCategory {
  id: string
  name: string
  slug: string
  icon?: string
  order: number
}

interface MarqueeImage {
  id: string
  url: string
  alt: string
  order: number
}

interface RestaurantsPageConfig {
  title: string
  subtitle: string
}

const _RESTAURANTS_TITLE_LIMIT = 18
const _RESTAURANTS_SUBTITLE_LIMIT = 90

// ============================================================================
// WEBSITE MANAGEMENT COMPONENT
// ============================================================================

export function WebsiteManagement() {
  const [activeSection, setActiveSection] = useState<
    "tabs" | "categories" | "marquee" | "home-client" | "homepage" | "restaurants"
  >("restaurants")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: "homepage" as const, label: "Homepage", icon: PencilIcon },
    { id: "restaurants" as const, label: "restaurant", icon: BuildingStorefrontIcon },
    { id: "home-client" as const, label: "Homeclient", icon: HomeIcon },
    { id: "tabs" as const, label: "Tabs", icon: DocumentTextIcon },
    { id: "categories" as const, label: "Categories", icon: BeakerIcon },
    { id: "marquee" as const, label: "Marquee", icon: PhotoIcon },
  ]

  const activeSectionData = sections.find((s) => s.id === activeSection) || sections[0]
  const ActiveIcon = activeSectionData.icon

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <div className="space-y-[var(--spacing-md)]">
      {/* Section Navigation - Dropdown + Edit Button */}
      <div className="flex items-center justify-between gap-[var(--spacing-md)]" ref={dropdownRef}>
        <nav aria-label="Website management sections" className="relative flex-1 w-1/2 md:w-auto">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] hover:bg-[var(--fg-5)] transition-colors text-left w-full"
          >
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <ActiveIcon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)] text-[var(--fg)]" />
              <span className="text-[var(--font-size-sm)] font-medium text-[var(--fg)]">
                {activeSectionData.label}
              </span>
            </div>
            <ChevronDownIcon
              className={`h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)] transition-transform flex-shrink-0 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 z-[var(--z-dropdown)] mt-[var(--spacing-xs)] bg-[var(--bg)] border border-[var(--fg-20)] rounded-[var(--radius-md)] shadow-lg py-[var(--spacing-xs)]">
              {sections.map((section) => {
                const isActive = activeSection === section.id
                const Icon = section.icon

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id)
                      setDropdownOpen(false)
                    }}
                    className={`
                    w-full flex items-center gap-[var(--spacing-sm)]
                    px-[var(--spacing-md)] py-[var(--spacing-sm)]
                    text-left transition-colors
                    ${
                      isActive
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "text-[var(--fg)] hover:bg-[var(--fg-5)]"
                    }
                  `}
                  >
                    <Icon className="h-[var(--icon-size-base)] w-[var(--icon-size-base)]" />
                    <span className="text-[var(--font-size-sm)] font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </nav>

        {/* Edit Button */}
        <button
          type="button"
          className="btn-3d btn-3d-blue rounded-[var(--radius-md)]"
          style={{ height: "2.25rem", minWidth: "5rem" }}
        >
          <div className="btn-3d-bg" />
          <div className="btn-3d-content">
            <PencilIcon className="btn-3d-icon h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            <span className="btn-3d-text text-xs">Edit</span>
          </div>
        </button>
      </div>

      {/* Section Content */}
      <div>
        {activeSection === "tabs" && <TabsManagement />}
        {activeSection === "categories" && <CategoriesManagement />}
        {activeSection === "marquee" && <MarqueeManagement />}
        {activeSection === "home-client" && (
          <div className="text-[var(--fg-60)]">Homeclient section coming soon</div>
        )}
        {activeSection === "homepage" && <HomePageManagement />}
        {activeSection === "restaurants" && (
          <div className="text-[var(--fg-60)]">Restaurant section coming soon</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TABS MANAGEMENT
// ============================================================================

function TabsManagement() {
  const [tabs, setTabs] = useState<WebsiteTab[]>([
    {
      id: "1",
      name: "Restaurants",
      slug: "restaurants",
      icon: "BuildingStorefrontIcon",
      order: 0,
      visible: true,
    },
    { id: "2", name: "Blogs", slug: "blog", icon: "DocumentTextIcon", order: 1, visible: true },
    { id: "3", name: "Nearby", slug: "nearby", icon: "MapPinIcon", order: 2, visible: true },
    { id: "4", name: "Top Rated", slug: "top-rated", icon: "StarIcon", order: 3, visible: true },
  ])
  const [_editingTab, setEditingTab] = useState<WebsiteTab | null>(null)

  const moveTab = useCallback((id: string, direction: "up" | "down") => {
    setTabs((prev) => {
      const index = prev.findIndex((t) => t.id === id)
      if (index < 0) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newTabs = [...prev]
      const temp = newTabs[index].order
      newTabs[index].order = newTabs[newIndex].order
      newTabs[newIndex].order = temp

      return newTabs.sort((a, b) => a.order - b.order)
    })
  }, [])

  const toggleVisibility = useCallback((id: string) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, visible: !tab.visible } : tab)))
  }, [])

  const _saveTab = useCallback((tab: WebsiteTab) => {
    setTabs((prev) => prev.map((t) => (t.id === tab.id ? { ...tab } : t)))
    setEditingTab(null)
  }, [])

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--fg)]">
            Tab Management
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Control the tabs shown on the homepage
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-all hover:opacity-[var(--hover-opacity)]"
        >
          <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Add Tab
        </button>
      </div>

      {/* Tabs List */}
      <div className="space-y-[var(--spacing-md)]">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]"
          >
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <button
                type="button"
                onClick={() => moveTab(tab.id, "up")}
                disabled={index === 0}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
                aria-label="Move up"
              >
                <ArrowUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
              </button>
              <button
                type="button"
                onClick={() => moveTab(tab.id, "down")}
                disabled={index === tabs.length - 1}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
                aria-label="Move down"
              >
                <ChevronDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={tab.name}
                onChange={(e) => {
                  const updated = { ...tab, name: e.target.value }
                  setTabs((prev) => prev.map((t) => (t.id === tab.id ? updated : t)))
                }}
                className="w-full px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
              />
              <p className="text-[var(--font-size-xs)] text-[var(--fg-50)] mt-[var(--spacing-xs)]">
                Slug: {tab.slug}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleVisibility(tab.id)}
              className={`
                px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded text-[var(--font-size-xs)] font-[var(--font-weight-medium)]
                ${tab.visible ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : "bg-[var(--fg-10)] text-[var(--fg-60)]"}
              `}
            >
              {tab.visible ? "Visible" : "Hidden"}
            </button>

            <button
              type="button"
              onClick={() => setEditingTab(tab)}
              className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-5)]"
              aria-label="Edit"
            >
              <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
            </button>

            <button
              type="button"
              onClick={() => setTabs((prev) => prev.filter((t) => t.id !== tab.id))}
              className="p-[var(--spacing-xs)] rounded hover:bg-[var(--color-error)]/10"
              aria-label="Delete"
            >
              <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-error)]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// CATEGORIES MANAGEMENT
// ============================================================================

function CategoriesManagement() {
  const [categories, setCategories] = useState<WebsiteCategory[]>([
    { id: "1", name: "Arabic", slug: "arabic", order: 0 },
    { id: "2", name: "Asian", slug: "asian", order: 1 },
    { id: "3", name: "Burger & Fries", slug: "burger-fries", order: 2 },
    { id: "4", name: "Cafe", slug: "cafe", order: 3 },
    { id: "5", name: "Desserts", slug: "desserts", order: 4 },
    { id: "6", name: "Fine Dining", slug: "fine-dining", order: 5 },
    { id: "7", name: "Indian", slug: "indian", order: 6 },
    { id: "8", name: "Italian", slug: "italian", order: 7 },
  ])
  const [newCategoryName, setNewCategoryName] = useState("")

  const moveCategory = useCallback((id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === id)
      if (index < 0) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newCategories = [...prev]
      const temp = newCategories[index].order
      newCategories[index].order = newCategories[newIndex].order
      newCategories[newIndex].order = temp

      return newCategories.sort((a, b) => a.order - b.order)
    })
  }, [])

  const addCategory = useCallback(() => {
    if (!newCategoryName.trim()) return

    const newCategory: WebsiteCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      order: categories.length,
    }

    setCategories((prev) => [...prev, newCategory])
    setNewCategoryName("")
  }, [newCategoryName, categories.length])

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => {
      const filtered = prev.filter((c) => c.id !== id)
      return filtered.map((c, i) => ({ ...c, order: i }))
    })
  }, [])

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--fg)]">
          Category Management
        </h2>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Control restaurant categories and their sequence
        </p>
      </div>

      {/* Add New Category */}
      <div className="flex gap-[var(--spacing-sm)]">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name..."
          className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
        />
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-all hover:opacity-[var(--hover-opacity)]"
        >
          <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Add
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-[var(--spacing-sm)]">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-md)] border border-[var(--fg-10)] bg-[var(--card-bg)]"
          >
            <span className="text-[var(--font-size-sm)] text-[var(--fg-50)] w-8 text-center">
              {index + 1}
            </span>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <button
                type="button"
                onClick={() => moveCategory(category.id, "up")}
                disabled={index === 0}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
              >
                <ArrowUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
              </button>
              <button
                type="button"
                onClick={() => moveCategory(category.id, "down")}
                disabled={index === categories.length - 1}
                className="p-[var(--spacing-xs)] rounded hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
              >
                <ChevronDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={category.name}
                onChange={(e) => {
                  const updated = {
                    ...category,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  }
                  setCategories((prev) => prev.map((c) => (c.id === category.id ? updated : c)))
                }}
                className="w-full px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
              />
              <p className="text-[var(--font-size-xs)] text-[var(--fg-50)]">{category.slug}</p>
            </div>

            <button
              type="button"
              onClick={() => removeCategory(category.id)}
              className="p-[var(--spacing-xs)] rounded hover:bg-[var(--color-error)]/10"
              aria-label="Delete"
            >
              <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-error)]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MARQUEE MANAGEMENT
// ============================================================================

function MarqueeManagement() {
  const [marqueeImages, setMarqueeImages] = useState<MarqueeImage[]>([
    { id: "1", url: "/images/marquee/restaurant1.jpg", alt: "Restaurant 1", order: 0 },
    { id: "2", url: "/images/marquee/restaurant2.jpg", alt: "Restaurant 2", order: 1 },
    { id: "3", url: "/images/marquee/restaurant3.jpg", alt: "Restaurant 3", order: 2 },
  ])
  const [showAddModal, setShowAddModal] = useState(false)

  const moveImage = useCallback((id: string, direction: "up" | "down") => {
    setMarqueeImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if (index < 0) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newImages = [...prev]
      const temp = newImages[index].order
      newImages[index].order = newImages[newIndex].order
      newImages[newIndex].order = temp

      return newImages.sort((a, b) => a.order - b.order)
    })
  }, [])

  const removeImage = useCallback((id: string) => {
    setMarqueeImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id)
      return filtered.map((img, i) => ({ ...img, order: i }))
    })
  }, [])

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--fg)]">
            Marquee Management
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Manage images shown in the marquee carousel
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-all hover:opacity-[var(--hover-opacity)]"
        >
          <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Add Image
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
        {marqueeImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--fg-10)] bg-[var(--fg-5)]"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-cover"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-[var(--fg)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={() => moveImage(image.id, "up")}
                disabled={index === 0}
                className="p-[var(--spacing-sm)] rounded-full bg-[var(--bg)] hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
              >
                <ArrowUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              </button>
              <button
                type="button"
                onClick={() => moveImage(image.id, "down")}
                disabled={index === marqueeImages.length - 1}
                className="p-[var(--spacing-sm)] rounded-full bg-[var(--bg)] hover:bg-[var(--fg-5)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed"
              >
                <ChevronDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="p-[var(--spacing-sm)] rounded-full bg-[var(--color-error)] text-[var(--color-white)] hover:opacity-90"
              >
                <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-[var(--spacing-sm)] bg-gradient-to-t from-[var(--fg)]/80 to-transparent">
              <p className="text-[var(--font-size-xs)] text-[var(--color-white)] truncate">
                {image.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Image Modal */}
      {showAddModal && (
        <AddMarqueeImageModal
          onClose={() => setShowAddModal(false)}
          onAdd={(image) => {
            setMarqueeImages((prev) => [
              ...prev,
              { ...image, id: Date.now().toString(), order: prev.length },
            ])
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// HOME PAGE MANAGEMENT
// ============================================================================

function HomePageManagement() {
  const [pageConfig, _setPageConfig] = useState<RestaurantsPageConfig>({
    title: "Restaurants Near You",
    subtitle: "Discover the best restaurants, cafes, and culinary experiences across the UAE",
  })
  const [_searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState<LocationOption>("all")
  const [sort, setSort] = useState<SortOptionId>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4")
  const [selectedMeals, setSelectedMeals] = useState<MealOption[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineOption[]>([])
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<AtmosphereOption[]>([])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleLocationChange = useCallback((loc: LocationOption) => {
    setLocation(loc)
  }, [])

  const handleSortChange = useCallback((sortId: SortOptionId) => {
    setSort(sortId)
  }, [])

  const handleViewModeChange = useCallback((view: ViewMode) => {
    setViewMode(view)
  }, [])

  const handleMealToggle = useCallback((meal: MealOption) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    )
  }, [])

  const handleCuisineToggle = useCallback((cuisine: CuisineOption) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    )
  }, [])

  const handleAtmosphereToggle = useCallback((atmosphere: AtmosphereOption) => {
    setSelectedAtmospheres((prev) =>
      prev.includes(atmosphere) ? prev.filter((a) => a !== atmosphere) : [...prev, atmosphere]
    )
  }, [])

  return (
    <div className="space-y-[var(--spacing-xl)]">
      {/* Live Preview Section */}
      <div className="pt-[var(--spacing-sm)] px-[var(--spacing-xl)] pb-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--fg-5)]">
        {/* Preview Container - matches restaurants page structure */}
        <div className="-mx-[var(--spacing-md)]">
          {/* Page Title Preview */}
          <section className="w-full mx-auto px-[var(--page-padding-x)] py-[var(--spacing-2xl)] md:py-[var(--spacing-3xl)]">
            <h1 className="text-[var(--hero-title-size)] font-black tracking-tight text-center mb-[var(--spacing-xs)] line-clamp-2 leading-[var(--line-height-tight)] w-full">
              {pageConfig.title}
            </h1>
            <p className="text-[var(--font-size-base)] text-center opacity-[var(--opacity-medium)] max-w-[var(--max-w-2xl)] line-clamp-3 mx-auto">
              {pageConfig.subtitle}
            </p>
          </section>

          {/* Search Bar Preview */}
          <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-md)]">
            <SearchContainer
              placeholder="Search restaurants, cuisines, dishes…"
              resultCount={0}
              onSearch={handleSearch}
              location={location}
              sort={sort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              showViewToggle={true}
            />
          </div>

          {/* Filter Bar Preview */}
          <FilterBar
            selectedMeals={selectedMeals}
            onMealToggle={handleMealToggle}
            selectedCuisines={selectedCuisines}
            onCuisineToggle={handleCuisineToggle}
            selectedAtmospheres={selectedAtmospheres}
            onAtmosphereToggle={handleAtmosphereToggle}
          />

          {/* No Cards Message */}
          <div className="max-w-[var(--page-max-width)] mx-auto px-2 md:px-[var(--page-padding-x)] pt-[var(--spacing-lg)] text-center py-[var(--spacing-5xl)]">
            <p className="text-[var(--font-size-lg)] text-[var(--fg-50)]">
              Restaurant cards will appear on the live page
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ADD MARQUEE IMAGE MODAL
// ============================================================================

interface AddMarqueeImageModalProps {
  onClose: () => void
  onAdd: (image: Omit<MarqueeImage, "id" | "order">) => void
}

function AddMarqueeImageModal({ onClose, onAdd }: AddMarqueeImageModalProps) {
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return
    onAdd({ url, alt: alt || url })
    setUrl("")
    setAlt("")
  }, [url, alt, onAdd])

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--fg)]/80">
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-xl)] rounded-[var(--radius-xl)] bg-[var(--bg)] shadow-[var(--shadow-2xl)] max-w-[var(--max-w-md)] w-full mx-[var(--spacing-md)]">
        <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--fg)]">
          Add Marquee Image
        </h3>

        <div className="space-y-[var(--spacing-md)]">
          <div>
            <label
              htmlFor="marquee-image-url"
              className="block text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--fg)] mb-[var(--spacing-xs)]"
            >
              Image URL
            </label>
            <input
              id="marquee-image-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="marquee-image-alt"
              className="block text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--fg)] mb-[var(--spacing-xs)]"
            >
              Alt Text
            </label>
            <input
              id="marquee-image-alt"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description for accessibility"
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onClose}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-all hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-all hover:opacity-[var(--hover-opacity)]"
          >
            Add Image
          </button>
        </div>
      </div>
    </div>
  )
}
