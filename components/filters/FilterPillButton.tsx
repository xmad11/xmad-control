/* ═══════════════════════════════════════════════════════════════════════════════
   FILTER PILL BUTTON - 3D Style from al-kabab-recovery project
   Expands when active, shows badge with selected count
   Neon rotating light animation on hover/focus (gradient shine only)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChefHat, Sparkles, Utensils } from "@/components/icons"

type FilterKey = "meal" | "cuisine" | "atmosphere"

interface FilterPillButtonProps {
  filterKey: FilterKey
  isActive: boolean
  onClick: () => void
  selectedCount: number
  isAnyActive: boolean
  forceNeon?: boolean
}

const FILTER_CONFIG = {
  meal: { label: "Meal", icon: Utensils, theme: "filter-3d-meal" },
  cuisine: { label: "Cuisine", icon: ChefHat, theme: "filter-3d-cuisine" },
  atmosphere: { label: "Atmosphere", icon: Sparkles, theme: "filter-3d-atmosphere" },
} as const

export function FilterPillButton({
  filterKey,
  isActive,
  onClick,
  selectedCount,
  isAnyActive,
  forceNeon = false,
}: FilterPillButtonProps) {
  const config = FILTER_CONFIG[filterKey]
  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Filter by ${config.label}${selectedCount > 0 ? `, ${selectedCount} selected` : ""}`}
      aria-pressed={isActive}
      className={`
        group relative flex items-center justify-center overflow-visible
        filter-button-base
        rounded-full
        ${config.theme}
        ${isActive ? "filter-button-expanded" : ""}
        ${!isActive && isAnyActive ? "opacity-50 scale-90" : ""}
        ${forceNeon ? "force-neon" : ""}
      `}
    >
      {/* 3D Background Layer */}
      <div className="filter-3d-bg" />

      {/* Neon Shine Effect - White gradient shine animation */}
      <div className="absolute inset-0 overflow-hidden rounded-full neon-shine pointer-events-none" />

      {/* 3D Content Layer - With gradient background, visible when expanded */}
      <div className="filter-3d-content relative z-20">
        {/* Icon - Hidden when active */}
        <Icon strokeWidth={2.5} className={`filter-pill-icon ${isActive ? "hidden" : ""}`} />

        {/* Label - Width animation, hidden when collapsed */}
        <span className="filter-pill-label">{config.label}</span>
      </div>

      {/* Badge - Shows selected count, positioned outside button */}
      {selectedCount > 0 && !isActive && (
        <span
          className={`
            absolute -top-1 -right-1
            filter-badge rounded-[var(--radius-full)]
            text-white border-2 border-white
            text-[var(--font-size-2xs)] font-medium
            flex items-center justify-center
            shadow-sm z-50 pointer-events-none
            ${filterKey === "meal" ? "bg-[var(--filter-badge-meal)]" : ""}
            ${filterKey === "cuisine" ? "bg-[var(--filter-badge-cuisine)]" : ""}
            ${filterKey === "atmosphere" ? "bg-[var(--filter-badge-atmosphere)]" : ""}
          `}
        >
          {selectedCount}
        </span>
      )}
    </button>
  )
}
