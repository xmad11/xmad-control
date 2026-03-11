/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER OPTION CHIP - For simple options (meal, atmosphere)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

type FilterKey = "meal" | "cuisine" | "atmosphere"

interface FilterOptionChipProps {
  option: string
  isSelected: boolean
  onToggle: (option: string) => void
  isExpanded?: boolean
  filterKey?: FilterKey
  isLiked?: boolean
  onLikeToggle?: (option: string) => void
}

// Filter color mapping
const FILTER_COLORS: Record<FilterKey, string> = {
  meal: "var(--filter-badge-meal)", // Red
  cuisine: "var(--filter-badge-cuisine)", // Green
  atmosphere: "var(--filter-badge-atmosphere)", // Blue
}

// Filter neon glow mapping
const FILTER_GLOW: Record<FilterKey, string> = {
  meal: "var(--neon-glow-filter-meal)",
  cuisine: "var(--neon-glow-filter-cuisine)",
  atmosphere: "var(--neon-glow-filter-atmosphere)",
}

export function FilterOptionChip({
  option,
  isSelected,
  onToggle,
  isExpanded,
  filterKey,
  isLiked = false,
  onLikeToggle,
}: FilterOptionChipProps) {
  const isCuisineCategory = filterKey === "cuisine"
  const filterColor = filterKey ? FILTER_COLORS[filterKey] : "var(--color-primary)"
  const filterGlow = filterKey ? FILTER_GLOW[filterKey] : undefined

  return (
    <button
      type="button"
      onClick={() => onToggle(option)}
      className={`
        relative px-[var(--spacing-sm)] py-[var(--spacing-xs)]
        rounded-[var(--radius-lg)]
        text-[var(--font-size-sm)] font-medium
        ${!isCuisineCategory ? "border-2" : "border-0"}
        transition-all duration-[var(--duration-fast)]
        active:scale-95
        whitespace-nowrap
        ${
          isSelected
            ? `bg-[var(--bg)] shadow-md border-[${filterColor}] text-[${filterColor}]`
            : isExpanded
              ? "bg-[var(--bg)] text-[var(--fg-60)]"
              : "bg-[var(--bg)] border-[var(--fg-20)] text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
        }
      `}
    >
      <span className="flex items-center gap-[var(--spacing-xs)] justify-center">
        {option}

        {/* Like/Heart Icon - Toggleable */}
        {onLikeToggle && (
          <button
            type="button"
            className={`ml-[var(--spacing-xs)] transition-colors duration-[var(--duration-fast)] ${
              isLiked ? `text-[${filterColor}]` : "text-[var(--fg-30)]"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onLikeToggle(option)
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation()
                onLikeToggle(option)
              }
            }}
            aria-label={isLiked ? `Unlike ${option}` : `Like ${option}`}
          >
            {isLiked ? "♥" : "♡"}
          </button>
        )}
      </span>

      {/* Bottom indicator for cuisine categories - very thin neon glow line */}
      {isCuisineCategory && filterGlow && (
        <span
          className={`
            absolute left-0 right-0
            bg-[${filterColor}]
            transition-all duration-[var(--duration-fast)]
            ${isExpanded ? "opacity-[var(--opacity-full)]" : "opacity-[var(--opacity-hidden)]"}
          `}
          style={{ bottom: "-1px", height: "0.5px", filter: filterGlow }} // @design-exception DYNAMIC_VALUE: Bottom offset and height are specific neon glow values that cannot be expressed with static tokens
        />
      )}
    </button>
  )
}
