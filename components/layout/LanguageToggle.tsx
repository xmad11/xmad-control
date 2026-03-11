/* ═══════════════════════════════════════════════════════════════════════════════
   LANGUAGE TOGGLE - Simple E/ع button to toggle between English and Arabic
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useLanguage } from "@/context/LanguageContext"
import { memo } from "react"

interface LanguageToggleProps {
  className?: string
}

function LanguageToggleComponent({ className = "" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  const handleToggle = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`
        flex items-center justify-center
        w-[44px] h-[44px]
        min-w-[44px] min-h-[44px]
        rounded-[var(--radius-lg)]
        text-[22px]
        font-black
        bg-transparent hover:bg-transparent
        text-[var(--fg)]
        transition-all duration-200
        active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${language === "ar" ? "English" : "العربية"}`}
    >
      {language === "ar" ? (
        <span className="font-mono font-bold text-[26px] text-[var(--fg)] opacity-[var(--opacity-muted)]">
          E
        </span>
      ) : (
        <span className="font-black text-[var(--fg)] opacity-[var(--opacity-muted)]">ع</span>
      )}
    </button>
  )
}

export const LanguageToggle = memo(LanguageToggleComponent)
export default LanguageToggle
