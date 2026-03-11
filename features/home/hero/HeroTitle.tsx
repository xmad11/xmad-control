/* ═══════════════════════════════════════════════════════════════════════════════
   HERO TITLE - Large responsive sizes using design tokens
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { MorphingText } from "@/components/typography/MorphingText"

// Single words only - clean morph curves
const MORPH_WORDS_EN = ["Places", "Restaurants", "Cafés", "Experiences", "Flavors", "Spots"]

export function HeroTitle() {
  return (
    <h1
      className="
        font-black
        tracking-tight
        leading-[1.05]
        text-center
        text-[calc(var(--font-size-5xl)*1.05)]
        sm:text-[calc(var(--font-size-5xl)*1.3)]
        lg:text-[calc(var(--font-size-6xl)*1.2)]
      "
    >
      <span className="block whitespace-nowrap hero-title-muted leading-[1.05]">Curated</span>

      <MorphingText
        texts={MORPH_WORDS_EN}
        className="block whitespace-nowrap text-[var(--color-primary)] leading-[1.05]"
      />

      <span className="block whitespace-nowrap hero-title-muted leading-[1.05] -mt-2">
        Near You
      </span>
    </h1>
  )
}
