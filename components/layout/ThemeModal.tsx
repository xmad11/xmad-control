/* ═══════════════════════════════════════════════════════════════════════════════
   THEME MODAL COMPONENT - Restaurant Platform 2025-2026
   Simple compact design - no scrolling, icons in one row
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { CheckIcon } from "@/components/icons"
import { THEME_MODES } from "@/components/theme-constants"
import type { PanelProps } from "@/components/types"
import { ACCENT_COLORS, type AccentColorName, useTheme } from "@/context/ThemeContext"
import { useCallback, useEffect, useRef, useState } from "react"

export default function ThemeModal({ isOpen, onClose }: PanelProps) {
  const { mode, accentColor, setMode, setAccentColor } = useTheme()
  const [mounted, setMounted] = useState(false)

  /* ─────────────────────────────────────────────────────────────────────────
	   Store onClose in ref to prevent effect re-running when onClose changes
	   ───────────────────────────────────────────────────────────────────────── */
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => setMounted(true), [])

  /* ─────────────────────────────────────────────────────────────────────────
	   Close on escape key - only run once, use ref for latest onClose
	   ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
	   Memoized backdrop key handler
	   ───────────────────────────────────────────────────────────────────────── */
  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen || !mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[var(--z-theme-modal-backdrop)] animate-in fade-in duration-[var(--duration-normal)]"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        aria-hidden="true"
      />

      {/* Compact Panel - No scrolling */}
      <div
        className="
          fixed right-0 top-[var(--theme-modal-top-aligned)]
          z-[var(--z-theme-modal)]
          w-[var(--side-menu-width)]
          glass rounded-l-[var(--panel-radius)]
          shadow-[var(--shadow-2xl)]
          p-[var(--spacing-md)]
          animate-in slide-in-from-right-[var(--theme-modal-slide-distance)]
          duration-[var(--duration-slow)] var(--ease-out-quart)
        "
      >
        <div className="space-y-[var(--spacing-sm)]">
          {/* Theme Modes - One Row */}
          <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
            {THEME_MODES.map((theme) => {
              const Icon = theme.icon
              const isActive = mode === theme.id

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setMode(theme.id)}
                  className={`
                    flex flex-col items-center justify-center gap-[var(--spacing-xs)]
                    px-[var(--spacing-md)] py-[var(--spacing-md)]
                    min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)]
                    rounded-[var(--radius-md)]
                    transition-transform duration-[var(--duration-normal)]
                    hover:scale-105 active:scale-95 flex-1
                    ${
                      isActive
                        ? "bg-primary/20 shadow-[var(--shadow-md)]"
                        : "opacity-[var(--opacity-medium)] hover:opacity-[var(--opacity-full)]"
                    }
                  `}
                  aria-label={`Switch to ${theme.label} mode`}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={`h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] stroke-[2px] ${isActive ? "text-primary" : ""}`}
                  />
                  <span
                    className={`text-[var(--font-size-xs)] font-medium ${isActive ? "text-[var(--fg)]" : ""}`}
                  >
                    {theme.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="h-[var(--divider-width)] bg-[var(--color-gray-500)] opacity-[var(--opacity-subtle)]" />

          {/* Accent Colors - 2 Rows of 5 */}
          <div className="grid grid-cols-5 gap-[var(--spacing-xs)]">
            {(Object.keys(ACCENT_COLORS) as AccentColorName[]).map((color) => {
              const isActive = accentColor === color
              const { oklch, label } = ACCENT_COLORS[color]

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className="relative group outline-none flex items-center justify-center"
                  style={{
                    minHeight: "var(--touch-target-min)",
                    minWidth: "var(--touch-target-min)",
                  }}
                  aria-label={`Select ${label} accent color`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`
                      w-[32px] h-[32px]
                      rounded-[var(--radius-md)]
                      transition-transform duration-[var(--duration-normal)]
                      flex items-center justify-center
                      group-hover:scale-110
                      ${isActive ? "scale-110 ring-[var(--ring-width-focus)] ring-primary ring-offset-[var(--ring-offset)]" : ""}
                    `}
                    style={{ backgroundColor: oklch }}
                  >
                    {/* Checkmark for active */}
                    {isActive && (
                      <CheckIcon className="h-[var(--font-size-sm)] w-[var(--font-size-sm)] text-[var(--color-white)] stroke-[3px]" />
                    )}
                  </div>

                  {/* Label on hover - completely hidden until hover */}
                  <div
                    className={`
                      absolute -bottom-[var(--spacing-lg)] left-1/2 -translate-x-1/2
                      px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)]
                      bg-[var(--bg)] shadow-[var(--shadow-md)]
                      text-[var(--font-size-xs)] font-medium capitalize
                      opacity-0 group-hover:opacity-[var(--opacity-full)]
                      transition-opacity duration-[var(--duration-fast)]
                      pointer-events-none whitespace-nowrap z-10
                    `}
                  >
                    {label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
