/* ═══════════════════════════════════════════════════════════════════════════════
   I18N UTILITIES - Internationalization support
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Supported languages
 */
export type LanguageCode = "ar" | "en"

/**
 * Locale type (for backward compatibility with LanguageContext)
 */
export type Locale = "ar" | "en"

/**
 * Language metadata
 */
export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  dir: "ltr" | "rtl"
  flag: string
}

/**
 * All supported languages
 */
export const LANGUAGES: Language[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇦🇪" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
]

/**
 * Locale names for display (for LanguageContext compatibility)
 */
export const LOCALE_NAMES = {
  ar: "العربية",
  en: "English",
} as const

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: LanguageCode = "en"

/**
 * Default locale (for LanguageContext compatibility)
 */
export const DEFAULT_LOCALE: Locale = "ar"

/**
 * localStorage key for language preference
 */
const LANGUAGE_STORAGE_KEY = "shadi_language"

/**
 * Get language from localStorage
 */
export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && LANGUAGES.some((lang) => lang.code === stored)) {
      return stored as LanguageCode
    }
  } catch {
    // localStorage not available
  }

  // Detect from browser
  const browserLang = navigator.language.split("-")[0] as LanguageCode
  if (LANGUAGES.some((lang) => lang.code === browserLang)) {
    return browserLang
  }

  return DEFAULT_LANGUAGE
}

/**
 * Set language in localStorage
 */
export function setStoredLanguage(code: LanguageCode): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
  } catch {
    // localStorage not available
  }
}

/**
 * Get language metadata by code
 */
export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0]
}

/**
 * Check if language is RTL
 */
export function isRTL(language: LanguageCode | Locale): boolean {
  return language === "ar"
}

/**
 * Get text direction for a language (alias for isRTL compatibility)
 */
export function getDirection(language: LanguageCode | Locale): "ltr" | "rtl" {
  return isRTL(language) ? "rtl" : "ltr"
}

/**
 * Get text direction for a language
 */
export function getTextDirection(language: LanguageCode): "ltr" | "rtl" {
  return getLanguage(language).dir
}
