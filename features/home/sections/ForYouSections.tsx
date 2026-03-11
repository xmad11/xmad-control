/* ═══════════════════════════════════════════════════════════════════════════════
   FOR YOU TAB SECTIONS - Horizontal Scroll with 8 Cards Max
   Editorial / Smart Picks - 5 categories max
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { memo } from "react"
import { ScrollableCards, Section } from "./shared/SectionComponents"

export interface ForYouSectionsProps {
  activeTab: string
}

/**
 * Top Rated
 */
const TopRated = memo(function TopRated() {
  return (
    <Section title="Top Rated" categorySlug="/restaurants?filter=top-rated">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=top-rated" />
    </Section>
  )
})

/**
 * Hidden Gems
 */
const HiddenGems = memo(function HiddenGems() {
  return (
    <Section title="Hidden Gems" categorySlug="/restaurants?filter=hidden-gems">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=hidden-gems" />
    </Section>
  )
})

/**
 * Budget Friendly
 */
const BudgetFriendly = memo(function BudgetFriendly() {
  return (
    <Section title="Budget Friendly" categorySlug="/restaurants?filter=budget-friendly">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=budget-friendly" />
    </Section>
  )
})

/**
 * Trending Now
 */
const TrendingNow = memo(function TrendingNow() {
  return (
    <Section title="Trending Now" categorySlug="/restaurants?filter=trending">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=trending" />
    </Section>
  )
})

/**
 * Near You
 */
const NearYou = memo(function NearYou() {
  return (
    <Section title="Near You" categorySlug="/restaurants?filter=near-me">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=near-me" />
    </Section>
  )
})

/**
 * For You Sections
 */
export function ForYouSections({ activeTab }: ForYouSectionsProps) {
  if (activeTab !== "for-you") return null

  return (
    <>
      <TopRated />
      <HiddenGems />
      <BudgetFriendly />
      <TrendingNow />
      <NearYou />
    </>
  )
}
