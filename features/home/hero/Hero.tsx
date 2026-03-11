/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SECTION - Final layout contract with z-index layering
   Desktop: Title left, marquee right | Mobile: Stacked with marquee below
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react"
import { HeroSubtitle } from "./HeroSubtitle"
import { HeroTitle } from "./HeroTitle"

export interface HeroProps {
  marquee?: ReactNode
}

export function Hero({ marquee }: HeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden

        /* MOBILE */
        pt-[var(--spacing-2xl)]
        pb-[var(--spacing-lg)]

        /* DESKTOP */
        lg:pt-[calc(var(--header-total-height)+var(--spacing-md))]
        lg:pb-[var(--spacing-lg)]
      "
    >
      {/* Full coverage peach gradient - breaks out to viewport edges using token-based calc */}
      <div
        className="absolute top-0 z-0 pointer-events-none h-full"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          background: "var(--hero-gradient)",
        }}
      />

      {/* ONE grid - TWO children - layout changes via CSS only */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[var(--page-max-width)]
          grid
          grid-cols-1
          lg:grid-cols-[1fr_1fr]
          gap-[var(--hero-gap-tight)]
          lg:items-start
          lg:content-start
          px-[var(--page-padding-x)]
        "
      >
        {/* Child 1: Title + Subtitle - ALWAYS present */}
        <div className="relative z-20 flex flex-col items-center lg:items-start">
          <HeroTitle />
          <HeroSubtitle />
        </div>

        {/* Child 2: Marquee - ALWAYS present, layout changes via CSS */}
        <div className="relative z-10 pointer-events-none w-full mt-[var(--spacing-sm)] lg:mt-0">
          <div className="-mx-[var(--page-padding-x)] lg:mx-0 w-[calc(100%+2*var(--page-padding-x))] lg:w-full">
            {marquee}
          </div>
        </div>
      </div>
    </section>
  )
}
