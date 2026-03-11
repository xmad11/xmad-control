/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SUBTITLE - Inline-block approach for @the.ss + typing
   ═══════════════════════════════════════════════════════════════════════════════ */

import TypingAnimation from "@/components/TypingAnimation"

const TYPING_PHRASES = [
  "personally visited and reviewed",
  "hidden gems across the UAE",
  "real food experiences, no ads",
  "places worth your time",
  "honest recommendations only",
]

export function HeroSubtitle() {
  return (
    <p
      className="
        hero-subtitle
        text-left
        text-[var(--hero-subtitle-size)]
        font-normal
        leading-[var(--line-height-normal)]
        mt-[var(--hero-subtitle-gap)]
        mt-4
      "
    >
      <span className="inline-block align-baseline text-[var(--color-primary)]">@the.ss&nbsp;</span>
      <span className="inline-block max-w-full align-baseline">
        <TypingAnimation phrases={TYPING_PHRASES} />
      </span>
    </p>
  )
}
