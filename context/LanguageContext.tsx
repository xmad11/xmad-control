/* ═══════════════════════════════════════════════════════════════════════════════
   LANGUAGE CONTEXT - React Context for i18n state management
   Locale switching, RTL/LTR handling, translation access
   Supports 2 languages: Arabic, English
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode, getTextDirection } from "@/lib/i18n"
import { STORAGE_KEYS, storage } from "@/lib/storage"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

/**
 * Language context interface
 */
export interface LanguageContextType {
  /** Current language code */
  language: LanguageCode
  /** Set current language */
  setLanguage: (language: LanguageCode) => void
  /** Check if current language is RTL */
  isRTL: boolean
  /** Text direction (ltr/rtl) */
  dir: "ltr" | "rtl"
  /** Get translation for key (supports dot notation) */
  t: (key: string) => string
  /** All supported languages */
  languages: typeof LANGUAGES
  /** Get language metadata */
  getLanguage: (code: LanguageCode) => (typeof LANGUAGES)[0]
}

/**
 * Language context
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Language Provider Props
 */
export interface LanguageProviderProps {
  children: React.ReactNode
  /** Initial language (defaults to DEFAULT_LANGUAGE) */
  initialLanguage?: LanguageCode
}

/**
 * Load translations file
 */
function loadTranslations(language: LanguageCode): Record<string, unknown> {
  try {
    switch (language) {
      case "ar":
        return require("@/lib/locales/ar.json")
      default:
        return require("@/lib/locales/en.json")
    }
  } catch {
    // Fallback to Arabic if translation file not found
    return require("@/lib/locales/ar.json")
  }
}

/**
 * Language Provider Component
 * Wraps the app to provide i18n context
 */
export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage)

  // Update document attributes when language changes
  // NOTE: We don't set document.dir to keep header LTR always
  useEffect(() => {
    document.documentElement.lang = language

    // Store preference in localStorage
    storage.setRaw(STORAGE_KEYS.LANGUAGE, language)
  }, [language])

  // Load saved language from localStorage on mount
  useEffect(() => {
    // Check new key first, then fallback to old key for backward compatibility
    let saved = storage.getRaw(STORAGE_KEYS.LANGUAGE) as LanguageCode | null
    if (!saved) {
      saved = storage.getRaw(STORAGE_KEYS.LEGACY_LANGUAGE) as LanguageCode | null
    }
    if (saved && LANGUAGES.some((lang) => lang.code === saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    if (LANGUAGES.some((lang) => lang.code === newLanguage)) {
      setLanguageState(newLanguage)
    }
  }, [])

  // Memoize translation function so it updates when language changes
  const t = useMemo(() => {
    const translations = loadTranslations(language)

    return (key: string): string => {
      // Get nested value using dot notation
      const keys = key.split(".")
      let result: unknown = translations

      for (const k of keys) {
        if (result == null || typeof result !== "object") {
          return key
        }
        result = (result as Record<string, unknown>)[k]
      }

      return typeof result === "string" ? result : key
    }
  }, [language])

  // Memoize the entire context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL: getTextDirection(language) === "rtl",
      dir: getTextDirection(language),
      t,
      languages: LANGUAGES,
      getLanguage: (code: LanguageCode) =>
        LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0],
    }),
    [language, setLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/**
 * useLanguage Hook
 * Access language context from components
 *
 * @example
 * ```tsx
 * const { language, t, setLanguage, isRTL } = useLanguage()
 * ```
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

/**
 * Re-export types and utilities for convenience
 */
export type { LanguageCode }
export { DEFAULT_LANGUAGE, LANGUAGES, getTextDirection }
