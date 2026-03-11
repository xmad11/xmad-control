/* ═══════════════════════════════════════════════════════════════════════════════
   STORIES TAB SECTIONS - Horizontal Scroll with 8 Cards Max
   Content / Blogs - 4 categories max
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { memo } from "react"
import { ScrollableCards, Section } from "./shared/SectionComponents"

export interface StoriesSectionsProps {
  activeTab: string
}

/**
 * Food Guides
 */
const FoodGuides = memo(function FoodGuides() {
  return (
    <Section title="Food Guides" categorySlug="/blog?filter=latest">
      <ScrollableCards itemCount={8} categorySlug="/blog?filter=latest" cardType="blog" />
    </Section>
  )
})

/**
 * Hidden Gems Stories
 */
const HiddenGemsStories = memo(function HiddenGemsStories() {
  return (
    <Section title="Hidden Gems Stories" categorySlug="/blog?filter=shadi-picks">
      <ScrollableCards itemCount={8} categorySlug="/blog?filter=shadi-picks" cardType="blog" />
    </Section>
  )
})

/**
 * Chef Stories
 */
const ChefStories = memo(function ChefStories() {
  return (
    <Section title="Chef Stories" categorySlug="/blog?filter=owner-stories">
      <ScrollableCards itemCount={8} categorySlug="/blog?filter=owner-stories" cardType="blog" />
    </Section>
  )
})

/**
 * New Openings
 */
const NewOpenings = memo(function NewOpenings() {
  return (
    <Section title="New Openings" categorySlug="/blog?filter=latest">
      <ScrollableCards itemCount={8} categorySlug="/blog?filter=latest" cardType="blog" />
    </Section>
  )
})

/**
 * Stories Sections
 */
export function StoriesSections({ activeTab }: StoriesSectionsProps) {
  if (activeTab !== "stories") return null

  return (
    <>
      <FoodGuides />
      <HiddenGemsStories />
      <ChefStories />
      <NewOpenings />
    </>
  )
}
