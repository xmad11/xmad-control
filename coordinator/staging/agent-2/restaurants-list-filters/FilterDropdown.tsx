/**
 * Filter Dropdown Component
 *
 * Reusable dropdown for filter selection with search and checkboxes.
 * Uses design tokens exclusively.
 */

"use client"

import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@/components/icons"
import { memo, useCallback, useEffect, useRef, useState } from "react"

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterDropdownProps {
  /** Button label when nothing selected */
  label: string
  /** Currently selected value(s) */
  value: string | string[]
  /** Available options */
  options: FilterOption[]
  /** Selection change handler */
  onChange: (value: string | string[]) => void
  /** Whether multiple selections are allowed */
  multiple?: boolean
  /** Whether to show count badges */
  showCount?: boolean
  /** Whether search is enabled */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Whether dropdown is disabled */
  disabled?: boolean
  /** Optional icon for button */
  icon?: React.ComponentType<{ className?: string }>
  /** Max height of dropdown */
  maxHeight?: string
}

/**
 * Filter Dropdown Component
 *
 * @example
 * <FilterDropdown
 *   label="Cuisine"
 *   value={selectedCuisine}
 *   options={cuisineOptions}
 *   onChange={setSelectedCuisine}
 *   showCount
 * />
 */
export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  multiple = false,
  showCount = false,
  searchable = false,
  searchPlaceholder = "Search...",
  disabled = false,
  icon: Icon,
  maxHeight = "var(--spacing-4xl)",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter options based on search query
  const filteredOptions = useCallback(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(query))
  }, [options, searchQuery])

  // Get display value for button
  const getDisplayValue = () => {
    if (multiple) {
      const values = value as string[]
      if (values.length === 0 || values[0] === "all") return label
      if (values.length === 1) {
        const option = options.find((o) => o.value === values[0])
        return option?.label ?? label
      }
      return `${values.length} selected`
    }
    const singleValue = value as string
    if (!singleValue || singleValue === "all") return label
    const option = options.find((o) => o.value === singleValue)
    return option?.label ?? label
  }

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (multiple) {
      const values = value as string[]
      return values.includes(optionValue)
    }
    return value === optionValue
  }

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const values = value as string[]
      if (optionValue === "all") {
        onChange(["all"])
      } else if (values.includes(optionValue)) {
        onChange(values.filter((v) => v !== optionValue))
      } else {
        onChange([...values.filter((v) => v !== "all"), optionValue])
      }
    } else {
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(multiple ? ["all"] : "all")
  }

  // Check if has selection
  const hasSelection = () => {
    if (multiple) {
      const values = value as string[]
      return values.length > 0 && values[0] !== "all"
    }
    return value && value !== "all"
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-full)] border transition-all duration-[var(--duration-fast)] whitespace-nowrap ${
          isOpen
            ? "border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)] text-[var(--color-primary)]"
            : hasSelection()
              ? "border-[var(--color-primary)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)] text-[var(--color-primary)]"
              : "border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && <Icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
        <span className="text-[var(--font-size-sm)]">{getDisplayValue()}</span>
        {hasSelection() && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-10)]"
            aria-label="Clear selection"
          >
            <XMarkIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
          </button>
        )}
        <ChevronDownIcon
          className={`h-[var(--icon-size-xs)] w-[var(--icon-size-xs)] transition-transform duration-[var(--duration-fast)] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-[var(--spacing-sm)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border-[var(--border-width-thin)] border-[var(--fg-10)] bg-[var(--bg)] shadow-[var(--shadow-lg)] min-w-[var(--spacing-5xl)]"
          style={{ maxHeight }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="px-[var(--spacing-sm)] pb-[var(--spacing-sm)] border-b border-[var(--fg-10)]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] border-[var(--border-width-thin)] border-[var(--fg-20)] bg-[var(--bg-70)] text-[var(--fg)] text-[var(--font-size-sm)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
              />
            </div>
          )}

          {/* Options List */}
          <div
            className="py-[var(--spacing-xs)] overflow-y-auto"
            style={{ maxHeight: "calc(var(--spacing-4xl) - 3rem)" }}
            role="listbox"
          >
            {filteredOptions().length > 0 ? (
              filteredOptions().map((option) => {
                const selected = isSelected(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] transition-all duration-[var(--duration-fast)] ${
                      selected
                        ? "bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] text-[var(--color-primary)]"
                        : "text-[var(--fg)] hover:bg-[var(--bg-80)]"
                    }`}
                    role="option"
                    aria-selected={selected}
                  >
                    <span className="flex items-center gap-[var(--spacing-sm)]">
                      {multiple && (
                        <div
                          className={`flex h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] items-center justify-center rounded-[var(--radius-sm)] border transition-all duration-[var(--duration-fast)] ${
                            selected
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                              : "border-[var(--fg-30)]"
                          }`}
                        >
                          {selected && (
                            <CheckIcon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)] text-white" />
                          )}
                        </div>
                      )}
                      <span className="text-[var(--font-size-sm)]">{option.label}</span>
                    </span>
                    {showCount && option.count !== undefined && (
                      <span
                        className={`text-[var(--font-size-xs)] ${
                          selected ? "text-[var(--color-primary)]" : "text-[var(--fg-50)]"
                        }`}
                      >
                        {option.count}
                      </span>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="px-[var(--spacing-md)] py-[var(--spacing-lg)] text-center">
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">No options found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const FilterDropdown = memo(FilterDropdown)
