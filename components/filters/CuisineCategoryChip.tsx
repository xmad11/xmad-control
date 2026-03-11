/* ═══════════════════════════════════════════════════════════════════════════════
   CUISINE CATEGORY CHIP - With subcategory expansion arrow
   Shows count of selected subcategories
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Check, ChevronRight } from "lucide-react"

interface CuisineCategoryChipProps {
  category: string
  subcategories?: string[]
  isSelected: boolean // Main category selected (all subs)
  hasSubsSelected: boolean // Any subcategories selected
  subsSelectedCount: number
  onToggle: (category: string) => void
  onExpand: (category: string) => void
}

export function CuisineCategoryChip({
  category,
  subcategories,
  isSelected,
  hasSubsSelected,
  subsSelectedCount,
  onToggle,
  onExpand,
}: CuisineCategoryChipProps) {
  const hasSubcategories = subcategories && subcategories.length > 0

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onToggle(category)}
        className={`
          relative px-[var(--spacing-md)] py-[var(--spacing-sm)]
          rounded-[var(--radius-xl)]
          text-[var(--font-size-sm)] font-medium
          border-2
          transition-all duration-[var(--duration-fast)]
          active:scale-95
          whitespace-nowrap
          flex items-center gap-2
          ${
            isSelected || hasSubsSelected
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] border-transparent text-white shadow-md"
              : "bg-[var(--bg)] border-[var(--fg-20)] text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
          }
        `}
      >
        <span className="flex items-center gap-1.5">
          {(isSelected || hasSubsSelected) && <Check strokeWidth={3} className="w-3.5 h-3.5" />}
          {category}
          {hasSubcategories && subsSelectedCount > 0 && (
            <span className="ml-1 text-xs opacity-90">({subsSelectedCount})</span>
          )}
        </span>
        {hasSubcategories && (
          <ChevronRight
            strokeWidth={2.5}
            className={`w-3.5 h-3.5 transition-transform ${hasSubsSelected ? "" : "opacity-50"}`}
            onClick={(e) => {
              e.stopPropagation()
              onExpand(category)
            }}
          />
        )}
      </button>
    </div>
  )
}
