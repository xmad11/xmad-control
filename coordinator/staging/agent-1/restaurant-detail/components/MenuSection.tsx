/* ═══════════════════════════════════════════════════════════════════════════════
   MENU SECTION - Restaurant menu with categories and items
   Expandable categories, prices, descriptions
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons"
import { memo, useState } from "react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  popular?: boolean
  vegetarian?: boolean
  spicy?: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

/**
 * Menu Section - Restaurant menu with categories
 *
 * Features:
 * - Expandable/collapsible categories
 * - Item prices in AED
 * - Dietary badges (vegetarian, spicy, popular)
 * - Item descriptions
 * - Search filter
 */
export function MenuSection() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["starters", "mains"])
  )

  // TODO: Replace with actual menu data from API
  const menuCategories: MenuCategory[] = [
    {
      id: "starters",
      name: "Starters",
      items: [
        {
          id: "s1",
          name: "Hummus",
          description: "Creamy chickpea dip with olive oil and paprika",
          price: 15,
          vegetarian: true,
          popular: true,
        },
        {
          id: "s2",
          name: "Falafel",
          description: "Crispy chickpea fritters with tahini sauce",
          price: 18,
          vegetarian: true,
        },
        {
          id: "s3",
          name: "Sambusa",
          description: "Crispy pastry filled with spiced meat or vegetables",
          price: 12,
        },
        {
          id: "s4",
          name: "Tabbouleh",
          description: "Fresh parsley salad with tomatoes and bulgur",
          price: 14,
          vegetarian: true,
        },
      ],
    },
    {
      id: "mains",
      name: "Main Courses",
      items: [
        {
          id: "m1",
          name: "Lamb Machboos",
          description: "Slow-cooked lamb with aromatic rice and spices",
          price: 65,
          popular: true,
        },
        {
          id: "m2",
          name: "Grilled King Fish",
          description: "Marinated king fish with rice and vegetables",
          price: 75,
        },
        {
          id: "m3",
          name: "Chicken Mandi",
          description: "Yemeni-style rice with tender chicken",
          price: 55,
          spicy: true,
        },
        {
          id: "m4",
          name: "Vegetarian Platter",
          description: "Assortment of grilled vegetables and rice",
          price: 45,
          vegetarian: true,
        },
      ],
    },
    {
      id: "grills",
      name: "Grills & BBQ",
      items: [
        {
          id: "g1",
          name: "Mixed Grill",
          description: "Assortment of kebabs and grilled meats",
          price: 85,
          popular: true,
        },
        {
          id: "g2",
          name: "Shish Tawook",
          description: "Marinated chicken skewers",
          price: 55,
        },
        {
          id: "g3",
          name: "Lamb Kebab",
          description: "Tender lamb kebabs with rice",
          price: 65,
        },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          id: "d1",
          name: "Umm Ali",
          description: "Traditional Egyptian bread pudding",
          price: 22,
          popular: true,
        },
        {
          id: "d2",
          name: "Kunafa",
          description: "Crispy pastry with cheese and sugar syrup",
          price: 25,
        },
        {
          id: "d3",
          name: "Dates",
          description: "Assorted premium dates",
          price: 18,
        },
      ],
    },
  ]

  /**
   * Toggle category expansion
   */
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  /**
   * Get dietary badges for item
   */
  const getDietaryBadges = (item: MenuItem) => {
    const badges: { label: string; color: string }[] = []

    if (item.popular)
      badges.push({
        label: "Popular",
        color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
      })
    if (item.vegetarian)
      badges.push({
        label: "Vegetarian",
        color: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
      })
    if (item.spicy)
      badges.push({ label: "Spicy", color: "bg-[var(--color-error)]/10 text-[var(--color-error)]" })

    return badges
  }

  return (
    <div className="space-y-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">Menu</h2>
        <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          {menuCategories.reduce((total, cat) => total + cat.items.length, 0)} items
        </span>
      </div>

      {/* Menu Categories */}
      <div className="space-y-[var(--spacing-md)]">
        {menuCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon

          return (
            <div
              key={category.id}
              className="bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--fg-10)] overflow-hidden"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-[var(--spacing-md)] hover:bg-[var(--fg-3)] transition-colors"
              >
                <span className="text-[var(--font-size-lg)] font-bold text-[var(--fg)]">
                  {category.name}
                </span>
                <div className="flex items-center gap-[var(--spacing-sm)]">
                  <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                    {category.items.length} items
                  </span>
                  <Icon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-60)]" />
                </div>
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="border-t border-[var(--fg-10)] divide-y divide-[var(--fg-10)]">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-[var(--spacing-md)] hover:bg-[var(--fg-3)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-[var(--spacing-md)]">
                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-xs)]">
                            <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
                              {item.name}
                            </h3>
                            {getDietaryBadges(item).map((badge) => (
                              <span
                                key={badge.label}
                                className={`px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium ${badge.color}`}
                              >
                                {badge.label}
                              </span>
                            ))}
                          </div>
                          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <span className="text-[var(--font-size-lg)] font-bold text-[var(--color-primary)]">
                            {item.price}
                          </span>
                          <span className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                            {" "}
                            AED
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Note */}
      <div className="p-[var(--spacing-md)] bg-[var(--fg-5)] rounded-[var(--radius-lg)]">
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] text-center">
          Prices are in AED and may vary. Prices do not include service charge or VAT.
        </p>
      </div>
    </div>
  )
}

export const MenuSection = memo(MenuSection)
