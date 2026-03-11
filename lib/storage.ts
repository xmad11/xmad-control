/* ═══════════════════════════════════════════════════════════════════════════════
   STORAGE UTILITY - Unified localStorage/sessionStorage operations
   Single Source of Truth for all client-side storage operations
   Handles JSON parsing, errors, and type safety
   ═══════════════════════════════════════════════════════════════════════════════ */

// Reserved for future use
// type StorageType = "localStorage" | "sessionStorage"

/* ─────────────────────────────────────────────────────────────────────────
   STORAGE API - Type-safe storage operations with error handling
   ───────────────────────────────────────────────────────────────────────── */

export const storage = {
  /* ─────────────────────────────────────────────────────────────────────────
     GET - Retrieve and parse a stored value
     Returns fallback value if key doesn't exist or on error
     ───────────────────────────────────────────────────────────────────────── */
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback

    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : fallback
    } catch {
      return fallback
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     SET - Stringify and store a value
     Silently fails if storage is disabled or full
     ───────────────────────────────────────────────────────────────────────── */
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silent fail - localStorage might be disabled or full
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     REMOVE - Delete a stored value
     ───────────────────────────────────────────────────────────────────────── */
  remove: (key: string): void => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.removeItem(key)
    } catch {
      // Silent fail
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     CLEAR - Remove all stored values
     ───────────────────────────────────────────────────────────────────────── */
  clear: (): void => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.clear()
    } catch {
      // Silent fail
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     GET RAW - Retrieve raw string without JSON parsing
     Useful for simple string values
     ───────────────────────────────────────────────────────────────────────── */
  getRaw: (key: string): string | null => {
    if (typeof window === "undefined") return null

    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     SET RAW - Store raw string without JSON stringifying
     ───────────────────────────────────────────────────────────────────────── */
  setRaw: (key: string, value: string): void => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Silent fail
    }
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   SESSION STORAGE - Same API but for sessionStorage (ephemeral)
   ───────────────────────────────────────────────────────────────────────── */
export const sessionStorage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback

    try {
      const item = window.sessionStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : fallback
    } catch {
      return fallback
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silent fail
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return

    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Silent fail
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return

    try {
      window.sessionStorage.clear()
    } catch {
      // Silent fail
    }
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   STORAGE KEYS - Centralized key constants to prevent typos
   ───────────────────────────────────────────────────────────────────────── */
export const STORAGE_KEYS = {
  THEME_MODE: "themeMode",
  THEME_ACCENT_COLOR: "themeAccentColor",
  LANGUAGE: "shadi_language",
  LEGACY_LANGUAGE: "locale",
  RESTAURANT_FILTERS: "restaurantFilters",
} as const
