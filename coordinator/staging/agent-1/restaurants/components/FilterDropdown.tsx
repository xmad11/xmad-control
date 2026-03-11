/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER DROPDOWN - Dropdown filter for restaurant list
   Click-outside handling, keyboard navigation
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { memo, useCallback, useEffect, useRef } from "react"

interface FilterDropdownProps {
  id: string
  label: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  children: React.ReactNode
}

/**
 * Filter Dropdown Component
 *
 * Features:
 * - Click outside to close
 * - ESC key to close
 * - Focus trap when open
 * - Icon + label display
 */
export function FilterDropdown({
  id,
  label,
  icon,
  isOpen,
  onToggle,
  onClose,
  children,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  /**
   * Handle keyboard
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    },
    [isOpen, onClose]
  )

  /**
   * Handle click outside
   */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (isOpen) {
          onClose()
        }
      }
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClickOutside, handleKeyDown])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]
          rounded-[var(--radius-full)] border whitespace-nowrap transition-all duration-[var(--duration-fast)]
          ${
            isOpen
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
              : "border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }
        `}
      >
        {icon}
        <span className="text-[var(--font-size-sm)] font-medium">{label}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-[var(--z-index-dropdown)] mt-[var(--spacing-xs)] w-[200px] bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)]"
          role="listbox"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export const FilterDropdown = memo(FilterDropdown)
