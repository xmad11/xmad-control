/* ═══════════════════════════════════════════════════════════════════════════════
   THEME CONTEXT - Restaurant Platform 2025-2026
   Single Source of Truth for theme state and accent colors
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { STORAGE_KEYS, storage } from "@/lib/storage"
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */
export type ThemeMode = "light" | "warm" | "dark"

export type AccentColorName =
  | "shadi"
  | "honey"
  | "amber"
  | "rose"
  | "berry"
  | "lavender"
  | "indigo"
  | "emerald"
  | "azure"
  | "lime"

export interface ThemeContextType {
  mode: ThemeMode
  accentColor: AccentColorName
  setMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColorName) => void
  mounted: boolean
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ACCENT COLORS - Matches tokens.css exactly (OKLCH format)
   2025-2026 Trendy Palette
   Row 1 (Warm): shadi, honey, amber, rose, berry
   Row 2 (Cool): lavender, indigo, emerald, azure, lime
   ═══════════════════════════════════════════════════════════════════════════════ */
export const ACCENT_COLORS: Record<AccentColorName, { oklch: string; label: string }> = {
  // Row 1 - Warm Tones
  shadi: { oklch: "oklch(0.60 0.19 40.0)", label: "Shadi Orange" },
  honey: { oklch: "oklch(0.7 0.12 85.0)", label: "Honey" },
  amber: { oklch: "oklch(0.72 0.16 70.0)", label: "Amber" },
  rose: { oklch: "oklch(0.65 0.16 350.0)", label: "Rose" },
  berry: { oklch: "oklch(0.52 0.18 350.0)", label: "Berry" },
  // Row 2 - Cool Tones
  lavender: { oklch: "oklch(0.68 0.10 280.0)", label: "Lavender" },
  indigo: { oklch: "oklch(0.45 0.18 270.0)", label: "Indigo" },
  emerald: { oklch: "oklch(0.58 0.18 160.0)", label: "Emerald" },
  azure: { oklch: "oklch(0.6 0.14 250.0)", label: "Azure" },
  lime: { oklch: "oklch(0.75 0.15 120.0)", label: "Lime" },
} as const

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/* ═══════════════════════════════════════════════════════════════════════════════
   THEME PROVIDER
   ═══════════════════════════════════════════════════════════════════════════════ */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from pre-hydration script or default to light for SSR
  const [mode, setModeState] = useState<ThemeMode>("light")
  const [accentColor, setAccentColorState] = useState<AccentColorName>("amber")
  const [mounted, setMounted] = useState(false)

  /* ─────────────────────────────────────────────────────────────────────────
	   Apply mode to DOM (memoized to prevent recreating on every render)
	   ───────────────────────────────────────────────────────────────────────── */
  const applyMode = useCallback((m: ThemeMode) => {
    if (typeof document === "undefined") return
    document.documentElement.setAttribute("data-theme", m)
    document.documentElement.classList.toggle("dark", m === "dark")
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
	   Apply accent color using CSS variable (memoized to prevent recreating)
	   ───────────────────────────────────────────────────────────────────────── */
  const applyAccentColor = useCallback((color: AccentColorName) => {
    if (typeof document === "undefined") return
    // Validate color exists (handles legacy colors from localStorage)
    const colorData = ACCENT_COLORS[color]
    if (!colorData) {
      console.warn(`Invalid accent color: ${color}, falling back to amber`)
      return
    }
    document.documentElement.style.setProperty("--color-brand-primary", colorData.oklch)
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
	   Mode setter (memoized - stable reference for consumers)
	   ───────────────────────────────────────────────────────────────────────── */
  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m)
      if (typeof window !== "undefined") {
        storage.setRaw(STORAGE_KEYS.THEME_MODE, m)
        applyMode(m)
      }
    },
    [applyMode]
  )

  /* ─────────────────────────────────────────────────────────────────────────
	   Accent color setter (memoized - stable reference for consumers)
	   ───────────────────────────────────────────────────────────────────────── */
  const setAccentColor = useCallback(
    (color: AccentColorName) => {
      setAccentColorState(color)
      if (typeof window !== "undefined") {
        storage.setRaw(STORAGE_KEYS.THEME_ACCENT_COLOR, color)
        applyAccentColor(color)
      }
    },
    [applyAccentColor]
  )

  /* ─────────────────────────────────────────────────────────────────────────
	   Initialize on mount - sync with pre-hydration script without re-render
	   ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true)
    const savedMode = (storage.getRaw(STORAGE_KEYS.THEME_MODE) as ThemeMode) || "light"
    let savedColor = (storage.getRaw(STORAGE_KEYS.THEME_ACCENT_COLOR) as AccentColorName) || "amber"

    // Validate saved color exists (handles legacy colors)
    if (!ACCENT_COLORS[savedColor]) {
      console.warn(`Legacy accent color "${savedColor}" no longer available, resetting to amber`)
      savedColor = "amber"
      storage.setRaw(STORAGE_KEYS.THEME_ACCENT_COLOR, savedColor)
    }

    // Set theme state without re-applying (pre-hydration script already set DOM)
    // This prevents flash by avoiding re-render
    setModeState(savedMode)
    setAccentColorState(savedColor)
  }, [])

  /* ─────────────────────────────────────────────────────────────────────────
	   Memoize context value to prevent unnecessary re-renders in consumers
	   ───────────────────────────────────────────────────────────────────────── */
  const contextValue = useMemo(
    () => ({ mode, accentColor, setMode, setAccentColor, mounted }),
    [mode, accentColor, setMode, setAccentColor, mounted]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

/* ═══════════════════════════════════════════════════════════════════════════════
   useTheme HOOK
   ═══════════════════════════════════════════════════════════════════════════════ */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
