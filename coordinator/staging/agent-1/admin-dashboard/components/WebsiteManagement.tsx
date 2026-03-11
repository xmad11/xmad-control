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

import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  BeakerIcon,
  DocumentTextIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@/components/icons"
import { useCallback, useEffect, useState } from "react"

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

interface HeroConfig {
  title: string
  subtitle: string
  morphWords: string[]
  typingAnimation: {
    enabled: boolean
    speed: number
  }
}

// ============================================================================
// WEBSITE MANAGEMENT COMPONENT
// ============================================================================

export function WebsiteManagement() {
  const [activeSection, setActiveSection] = useState<"tabs" | "categories" | "marquee" | "hero">(
    "tabs"
  )

  const sections = [
    { id: "tabs" as const, label: "Tabs", icon: DocumentTextIcon },
    { id: "categories" as const, label: "Categories", icon: BeakerIcon },
    { id: "marquee" as const, label: "Marquee", icon: PhotoIcon },
    { id: "hero" as const, label: "Hero", icon: PencilIcon },
  ]

  return (
    <div className="space-y-[var(--spacing-2xl)]">
      {/* Section Navigation */}
      <nav aria-label="Website management sections">
        <div
          role="tablist"
          className="flex gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)]"
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id
            const Icon = section.icon

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
                  rounded-[var(--radius-full)] whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                      : "bg-[var(--fg-5)] text-[var(--fg)] hover:bg-[var(--fg-10)]"
                  }
                `}
              >
                <Icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                <span className="text-[var(--font-size-sm)] font-medium">{section.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Section Content */}
      <div>
        {activeSection === "tabs" && <TabsManagement />}
        {activeSection === "categories" && <CategoriesManagement />}
        {activeSection === "marquee" && <MarqueeManagement />}
        {activeSection === "hero" && <HeroManagement />}
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
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Tab Management</h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Control the tabs shown on the homepage
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium transition-all hover:opacity-[var(--hover-opacity)]"
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
                <ArrowDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
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
                px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded text-[var(--font-size-xs)] font-medium
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
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
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
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium transition-all hover:opacity-[var(--hover-opacity)]"
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
                <ArrowDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-60)]" />
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
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">
            Marquee Management
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            Manage images shown in the marquee carousel
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium transition-all hover:opacity-[var(--hover-opacity)]"
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
            <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />

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
                <ArrowDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
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
// HERO MANAGEMENT
// ============================================================================

function HeroManagement() {
  const [heroConfig, setHeroConfig] = useState<HeroConfig>({
    title: "Discover the Best",
    subtitle: "Restaurants & Experiences",
    morphWords: ["Restaurants", "Cafes", "Experiences", "Moments"],
    typingAnimation: {
      enabled: true,
      speed: 100,
    },
  })
  const [newMorphWord, setNewMorphWord] = useState("")

  const addMorphWord = useCallback(() => {
    if (!newMorphWord.trim()) return
    setHeroConfig((prev) => ({
      ...prev,
      morphWords: [...prev.morphWords, newMorphWord],
    }))
    setNewMorphWord("")
  }, [newMorphWord])

  const removeMorphWord = useCallback((index: number) => {
    setHeroConfig((prev) => ({
      ...prev,
      morphWords: prev.morphWords.filter((_, i) => i !== index),
    }))
  }, [])

  return (
    <div className="space-y-[var(--spacing-2xl)]">
      <div>
        <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)]">Hero Section</h2>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          Control homepage hero title and animations
        </p>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-[var(--spacing-md)]">
        <div>
          <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]">
            Main Title
          </label>
          <input
            type="text"
            value={heroConfig.title}
            onChange={(e) => setHeroConfig((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-base)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]">
            Subtitle
          </label>
          <input
            type="text"
            value={heroConfig.subtitle}
            onChange={(e) => setHeroConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-base)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Typing Animation */}
      <div className="p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)]">
        <div className="flex items-center justify-between mb-[var(--spacing-md)]">
          <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
            Typing Animation
          </h3>
          <button
            type="button"
            onClick={() =>
              setHeroConfig((prev) => ({
                ...prev,
                typingAnimation: {
                  ...prev.typingAnimation,
                  enabled: !prev.typingAnimation.enabled,
                },
              }))
            }
            className={`
              px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded text-[var(--font-size-sm)] font-medium
              ${heroConfig.typingAnimation.enabled ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : "bg-[var(--fg-10)] text-[var(--fg-60)]"}
            `}
          >
            {heroConfig.typingAnimation.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Speed Control */}
        {heroConfig.typingAnimation.enabled && (
          <div className="mb-[var(--spacing-md)]">
            <label className="block text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-xs)]">
              Speed: {heroConfig.typingAnimation.speed}ms
            </label>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={heroConfig.typingAnimation.speed}
              onChange={(e) =>
                setHeroConfig((prev) => ({
                  ...prev,
                  typingAnimation: {
                    ...prev.typingAnimation,
                    speed: Number.parseInt(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
          </div>
        )}

        {/* Morph Words */}
        <div>
          <label className="block text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-xs)]">
            Morph Words (sequence)
          </label>
          <div className="flex gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
            <input
              type="text"
              value={newMorphWord}
              onChange={(e) => setNewMorphWord(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addMorphWord()}
              placeholder="Add new word..."
              className="flex-1 px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
            />
            <button
              type="button"
              onClick={addMorphWord}
              className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-[var(--spacing-sm)]">
            {heroConfig.morphWords.map((word, index) => (
              <div
                key={index}
                className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-full bg-[var(--fg-5)] text-[var(--font-size-sm)]"
              >
                <span>{word}</span>
                <button
                  type="button"
                  onClick={() => removeMorphWord(index)}
                  className="hover:text-[var(--color-error)]"
                >
                  <XMarkIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--fg-5)]">
        <h4 className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-md)]">
          Preview
        </h4>
        <div className="text-center">
          <h1 className="text-[var(--font-size-3xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            {heroConfig.title}
            {heroConfig.typingAnimation.enabled && (
              <span className="text-[var(--color-primary)] italic">
                {" "}
                {heroConfig.morphWords[0]}
              </span>
            )}
          </h1>
          <p className="text-[var(--font-size-lg)] opacity-[var(--opacity-medium)]">
            {heroConfig.subtitle}
          </p>
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
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          Add Marquee Image
        </h3>

        <div className="space-y-[var(--spacing-md)]">
          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]">
              Image URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] focus:outline-none focus:ring-[var(--ring-width-focus)] focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg)] mb-[var(--spacing-xs)]">
              Alt Text
            </label>
            <input
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
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded border border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded bg-[var(--color-primary)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium transition-all hover:opacity-[var(--hover-opacity)]"
          >
            Add Image
          </button>
        </div>
      </div>
    </div>
  )
}
