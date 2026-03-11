/* ═══════════════════════════════════════════════════════════════════════════════
   RESTAURANTS TAB SECTIONS - Horizontal Scroll with 8 Cards Max
   Core browsing categories - 8 max + special categories
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { memo } from "react"
import { ScrollableCards, Section } from "./shared/SectionComponents"

export interface RestaurantsSectionsProps {
  activeTab: string
}

/**
 * Cafes & Coffee
 */
const CafesCoffee = memo(function CafesCoffee() {
  return (
    <Section title="Cafes & Coffee" categorySlug="/restaurants?cuisine=cafe">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=cafe" />
    </Section>
  )
})

/**
 * Quick Bites
 */
const QuickBites = memo(function QuickBites() {
  return (
    <Section title="Quick Bites" categorySlug="/restaurants?cuisine=fast-food">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=fast-food" />
    </Section>
  )
})

/**
 * Family Friendly
 */
const FamilyFriendly = memo(function FamilyFriendly() {
  return (
    <Section title="Family Friendly" categorySlug="/restaurants?filter=family-friendly">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=family-friendly" />
    </Section>
  )
})

/**
 * Fine Dining
 */
const FineDining = memo(function FineDining() {
  return (
    <Section title="Fine Dining" categorySlug="/restaurants?filter=fine-dining">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=fine-dining" />
    </Section>
  )
})

/**
 * Desserts & Sweets
 */
const DessertsSweets = memo(function DessertsSweets() {
  return (
    <Section title="Desserts & Sweets" categorySlug="/restaurants?cuisine=desserts">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=desserts" />
    </Section>
  )
})

/**
 * Date Night
 */
const DateNight = memo(function DateNight() {
  return (
    <Section title="Date Night" categorySlug="/restaurants?filter=romantic">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=romantic" />
    </Section>
  )
})

/**
 * Rooftop Dining
 */
const RooftopDining = memo(function RooftopDining() {
  return (
    <Section title="Rooftop Dining" categorySlug="/restaurants?filter=outdoor-seating">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=outdoor-seating" />
    </Section>
  )
})

/**
 * Food Trucks
 */
const FoodTrucks = memo(function FoodTrucks() {
  return (
    <Section title="Food Trucks" categorySlug="/restaurants?cuisine=food-truck">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=food-truck" />
    </Section>
  )
})

/**
 * Food Experiences (Special)
 */
const FoodExperiences = memo(function FoodExperiences() {
  return (
    <Section title="Food Experiences" categorySlug="/restaurants?filter=trending">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?filter=trending" />
    </Section>
  )
})

/**
 * Home Business
 */
const HomeBusiness = memo(function HomeBusiness() {
  return (
    <Section title="Home Business" categorySlug="/restaurants?cuisine=home-food">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=home-food" />
    </Section>
  )
})

/**
 * Juice & Fruits
 */
const JuiceFruits = memo(function JuiceFruits() {
  return (
    <Section title="Juice & Fruits" categorySlug="/restaurants?cuisine=juices-and-fruits">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=juices-and-fruits" />
    </Section>
  )
})

/**
 * Heritage Restaurants
 */
const HeritageRestaurants = memo(function HeritageRestaurants() {
  return (
    <Section title="Heritage Restaurants" categorySlug="/restaurants?cuisine=emirati">
      <ScrollableCards itemCount={8} categorySlug="/restaurants?cuisine=emirati" />
    </Section>
  )
})

/**
 * Restaurants Sections
 */
export function RestaurantsSections({ activeTab }: RestaurantsSectionsProps) {
  if (activeTab !== "restaurants") return null

  return (
    <>
      <CafesCoffee />
      <QuickBites />
      <FamilyFriendly />
      <FineDining />
      <DessertsSweets />
      <DateNight />
      <RooftopDining />
      <FoodTrucks />
      <FoodExperiences />
      <HomeBusiness />
      <JuiceFruits />
      <HeritageRestaurants />
    </>
  )
}
