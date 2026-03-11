/**
 * Menu Builder Section - Restaurant menu management
 *
 * Create categories, add items with prices, manage menu structure.
 */

"use client"

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UtensilsIcon,
  XIcon,
} from "@/components/icons"
import { memo, useState } from "react"
import type { MenuCategory, MenuItem } from "./types"

/**
 * Menu item card component
 */
function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}) {
  return (
    <div
      className={`flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] transition-all duration-[var(--duration-fast)] ${
        item.isActive
          ? "border-[var(--fg-10)] bg-[var(--bg)]"
          : "border-[var(--fg-10)] bg-[var(--bg-70)] opacity-70"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[var(--spacing-md)]">
        <div className="flex-1">
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <h4 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)]">
              {item.name}
            </h4>
            {!item.isActive && (
              <span className="px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[var(--fg-10)] text-[var(--fg-70)] text-[var(--font-size-2xs)] font-medium">
                Hidden
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] mt-[var(--spacing-xs)] line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-[var(--spacing-xs)]">
          <span className="text-[var(--font-size-lg)] font-bold text-[var(--color-primary)]">
            {item.currency} {item.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[var(--spacing-xs)] pt-[var(--spacing-sm)] border-t border-[var(--fg-10)]">
        <button
          type="button"
          onClick={() => onToggleActive(item.id)}
          className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] ${
            item.isActive
              ? "bg-[var(--color-success)] text-white"
              : "bg-[var(--bg-80)] text-[var(--fg-70)]"
          }`}
        >
          {item.isActive ? "Visible" : "Hidden"}
        </button>

        <button
          type="button"
          onClick={() => onEdit(item)}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[var(--bg-80)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--fg-10)]"
        >
          <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="ml-auto flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--color-error)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[oklch(from_var(--color-error)_l_c_h_/0.1)]"
        >
          <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Delete
        </button>
      </div>
    </div>
  )
}

/**
 * Category section component
 */
function CategorySection({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItemActive,
  isExpanded,
  onToggleExpand,
}: {
  category: MenuCategory
  onEditCategory: (category: MenuCategory) => void
  onDeleteCategory: (id: string) => void
  onAddItem: (categoryId: string) => void
  onEditItem: (categoryId: string, item: MenuItem) => void
  onDeleteItem: (categoryId: string, itemId: string) => void
  onToggleItemActive: (categoryId: string, itemId: string) => void
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      {/* Category Header */}
      <div className="flex items-center justify-between p-[var(--spacing-md)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--fg-10)]"
            aria-expanded={isExpanded}
            aria-label={`Toggle ${category.name} category`}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
            ) : (
              <ChevronRightIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
            )}
          </button>

          <div>
            <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                {category.description}
              </p>
            )}
          </div>

          <span className="px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] bg-[var(--fg-10)] text-[var(--fg-70)] text-[var(--font-size-sm)] font-medium">
            {category.items.length} items
          </span>
        </div>

        <div className="flex items-center gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--fg-10)]"
            title="Edit category"
          >
            <PencilIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteCategory(category.id)}
            className="p-[var(--spacing-sm)] rounded-[var(--radius-md)] text-[var(--color-error)] transition-all duration-[var(--duration-fast)] hover:bg-[oklch(from_var(--color-error)_l_c_h_/0.1)]"
            title="Delete category"
          >
            <TrashIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      {isExpanded && (
        <div className="flex flex-col gap-[var(--spacing-md)] pl-[var(--spacing-lg)]">
          {category.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-[var(--spacing-md)] md:grid-cols-2">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={(item) => onEditItem(category.id, item)}
                    onDelete={(itemId) => onDeleteItem(category.id, itemId)}
                    onToggleActive={(itemId) => onToggleItemActive(category.id, itemId)}
                  />
                ))}
              </div>

              {/* Add Item Button */}
              <button
                type="button"
                onClick={() => onAddItem(category.id)}
                className="flex items-center justify-center gap-[var(--spacing-sm)] p-[var(--spacing-md)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-dashed border-[var(--fg-20)] text-[var(--fg-70)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <PlusIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
                Add Menu Item
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-[var(--spacing-2xl)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-dashed border-[var(--fg-20)]">
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                No items in this category yet.
              </p>
              <button
                type="button"
                onClick={() => onAddItem(category.id)}
                className="mt-[var(--spacing-sm)] flex items-center gap-[var(--spacing-xs)] text-[var(--color-primary)] text-[var(--font-size-sm)] font-medium"
              >
                <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                Add first item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Modal for adding/editing menu items
 */
function MenuItemModal({
  item,
  onSave,
  onCancel,
  currency = "AED",
}: {
  item?: MenuItem
  onSave: (item: Omit<MenuItem, "id">) => void
  onCancel: () => void
  currency?: string
}) {
  const [name, setName] = useState(item?.name ?? "")
  const [description, setDescription] = useState(item?.description ?? "")
  const [price, setPrice] = useState(item?.price.toString() ?? "")
  const [isActive, setIsActive] = useState(item?.isActive ?? true)

  const isEditing = !!item

  const handleSave = () => {
    if (!name.trim() || !price) return

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number.parseFloat(price),
      currency,
      isActive,
      order: item?.order ?? 0,
    })
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--fg-80)] p-[var(--spacing-md)]">
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-xl)] rounded-[var(--radius-xl)] bg-[var(--bg)] shadow-[var(--shadow-2xl)] max-w-[var(--max-w-xl)] w-full">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          {isEditing ? "Edit Menu Item" : "Add Menu Item"}
        </h3>

        <div className="flex flex-col gap-[var(--spacing-md)]">
          {/* Name */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <label
              htmlFor="item-name"
              className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
            >
              Item Name *
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lamb Biryani"
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <label
              htmlFor="item-description"
              className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
            >
              Description
            </label>
            <textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the dish"
              rows={3}
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] resize-y focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <label
              htmlFor="item-price"
              className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
            >
              Price ({currency}) *
            </label>
            <input
              id="item-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
          </div>

          {/* Active Toggle */}
          <label className="flex items-center gap-[var(--spacing-sm)]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] rounded border-[var(--fg-30)] text-[var(--color-primary)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
            <span className="text-[var(--font-size-sm)] text-[var(--fg)]">Visible on menu</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !price}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Category modal for adding/editing categories
 */
function CategoryModal({
  category,
  onSave,
  onCancel,
}: {
  category?: MenuCategory
  onSave: (category: Omit<MenuCategory, "id" | "items">) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")

  const isEditing = !!category

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      order: category?.order ?? 0,
    })
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--fg-80)] p-[var(--spacing-md)]">
      <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-xl)] rounded-[var(--radius-xl)] bg-[var(--bg)] shadow-[var(--shadow-2xl)] max-w-[var(--max-w-xl)] w-full">
        <h3 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
          {isEditing ? "Edit Category" : "Add Category"}
        </h3>

        <div className="flex flex-col gap-[var(--spacing-md)]">
          {/* Name */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <label
              htmlFor="category-name"
              className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
            >
              Category Name *
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Starters, Main Courses"
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <label
              htmlFor="category-description"
              className="text-[var(--font-size-sm)] font-medium text-[var(--fg-70)]"
            >
              Description
            </label>
            <textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this category"
              rows={2}
              className="px-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] text-[var(--font-size-base)] resize-y focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Menu Builder Section Component
 *
 * @example
 * <MenuBuilderSection categories={categories} onSave={(categories) => saveMenu(categories)} />
 */
export function MenuBuilderSection({
  categories,
  onSave,
  isLoading = false,
}: {
  categories: MenuCategory[]
  onSave: (categories: MenuCategory[]) => void
  isLoading?: boolean
}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  )
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item?: MenuItem } | null>(
    null
  )
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)

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

  const handleAddItem = (categoryId: string) => {
    setEditingItem({ categoryId })
  }

  const handleEditItem = (categoryId: string, item: MenuItem) => {
    setEditingItem({ categoryId, item })
  }

  const handleSaveItem = (itemData: Omit<MenuItem, "id">) => {
    if (!editingItem) return

    const updatedCategories = categories.map((category) => {
      if (category.id === editingItem.categoryId) {
        if (editingItem.item) {
          // Update existing item
          return {
            ...category,
            items: category.items.map((item) =>
              item.id === editingItem.item?.id ? { ...item, ...itemData } : item
            ),
          }
        }
        // Add new item
        return {
          ...category,
          items: [...category.items, { ...itemData, id: `item-${Date.now()}` }],
        }
      }
      return category
    })

    onSave(updatedCategories)
    setEditingItem(null)
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter((item) => item.id !== itemId),
        }
      }
      return category
    })

    onSave(updatedCategories)
  }

  const handleToggleItemActive = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, isActive: !item.isActive } : item
          ),
        }
      }
      return category
    })

    onSave(updatedCategories)
  }

  const handleAddCategory = () => {
    setEditingCategory(null as unknown as MenuCategory)
  }

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
  }

  const handleSaveCategory = (categoryData: Omit<MenuCategory, "id" | "items">) => {
    if (editingCategory?.id) {
      // Update existing category
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id ? { ...category, ...categoryData } : category
      )
      onSave(updatedCategories)
    } else {
      // Add new category
      onSave([...categories, { ...categoryData, id: `category-${Date.now()}`, items: [] }])
    }
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category and all its items?")) {
      onSave(categories.filter((category) => category.id !== categoryId))
      setExpandedCategories((prev) => {
        const next = new Set(prev)
        next.delete(categoryId)
        return next
      })
    }
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <UtensilsIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-primary)]" />
          <div>
            <h2 className="text-[var(--heading-section)] font-black tracking-tight text-[var(--fg)]">
              Menu Builder
            </h2>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
              Organize your menu with categories and items
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          Add Category
        </button>
      </div>

      {/* Categories */}
      {categories.length > 0 ? (
        <div className="flex flex-col gap-[var(--spacing-md)]">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onToggleItemActive={handleToggleItemActive}
              isExpanded={expandedCategories.has(category.id)}
              onToggleExpand={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[var(--spacing-4xl)] rounded-[var(--radius-lg)] bg-[var(--bg-70)] border-[var(--border-width-thin)] border-[var(--fg-10)]">
          <UtensilsIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--fg-30)] mb-[var(--spacing-md)]" />
          <p className="text-[var(--font-size-base)] text-[var(--fg-70)]">
            Your menu is empty. Create your first category to get started.
          </p>
          <button
            type="button"
            onClick={handleAddCategory}
            className="mt-[var(--spacing-md)] flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90"
          >
            <PlusIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
            Add First Category
          </button>
        </div>
      )}

      {/* Modals */}
      {editingItem && (
        <MenuItemModal
          item={editingItem.item}
          onSave={handleSaveItem}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {editingCategory !== null && (
        <CategoryModal
          category={editingCategory.id ? editingCategory : undefined}
          onSave={handleSaveCategory}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  )
}

export const MenuBuilderSection = memo(MenuBuilderSection)
