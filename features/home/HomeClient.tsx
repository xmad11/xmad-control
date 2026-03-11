/* ═══════════════════════════════════════════════════════════════════════════════
   HOME CLIENT COMPONENT - Restaurant Platform 2025-2026
   Discovery-focused home page with curated tabs and sections
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Footer } from "@/components/layout/Footer"
import { Marquee, MarqueeCard } from "@/components/marquee"
import { MARQUEE_ITEMS, MARQUEE_ITEMS_2 } from "@/data/marquee"
import { useCallback, useState } from "react"
import { Hero } from "./hero"
import {
  BusinessCTA,
  FAQSection,
  HomeSearch,
  HomeTabs,
  RestaurantsSections,
  type TabId,
} from "./sections"

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<TabId>("restaurants")

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      {/* Main Content */}
      <main id="main-content" className="relative overflow-hidden">
        {/* Hero Section with Dual Marquee - Phase 1: BlurHash for instant load */}
        <Hero
          marquee={
            <div className="flex flex-col gap-2 lg:gap-[var(--spacing-md)]">
              <Marquee direction="left">
                {MARQUEE_ITEMS.map((item, index) => (
                  <MarqueeCard
                    key={item.id}
                    id={item.id}
                    images={item.images}
                    title={item.name}
                    blurHash={item.blurHash}
                    index={index}
                  />
                ))}
              </Marquee>
              <Marquee direction="right">
                {MARQUEE_ITEMS_2.map((item, index) => (
                  <MarqueeCard
                    key={item.id}
                    id={item.id}
                    images={item.images}
                    title={item.name}
                    blurHash={item.blurHash}
                    index={index}
                  />
                ))}
              </Marquee>
            </div>
          }
        />

        {/* Home Search */}
        <HomeSearch />

        {/* NEW: Tab Navigation */}
        <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab-specific Sections - Only restaurants shown */}
        {activeTab === "restaurants" && <RestaurantsSections activeTab={activeTab} />}

        {/* Business CTA - Partnership opportunities */}
        <BusinessCTA />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
