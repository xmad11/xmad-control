/**
 * Owner Dashboard - Complete redesign with tabbed interface
 *
 * Data-entry focused dashboard for restaurant owners to manage
 * their profile, images, menu, Q&A, reviews, and view analytics.
 *
 * Design tokens used throughout - NO hardcoded values.
 * Named exports only - NO default exports.
 * Proper TypeScript - NO `any` types.
 */

"use client"

import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChatBubbleQuestionIcon,
  PhotoIcon,
  StarIcon,
  UtensilsIcon,
} from "@/components/icons"
import { memo, useState } from "react"

import { AnalyticsSection } from "./AnalyticsSection"
import { ImageGallerySection } from "./ImageGallerySection"
import { MenuBuilderSection } from "./MenuBuilderSection"
import { ProfileSection } from "./ProfileSection"
import { QASection } from "./QASection"
import { ReviewsSection } from "./ReviewsSection"
// Import section components
import { Tabs } from "./Tabs"

// Import types
import type {
  AnalyticsData,
  MenuCategory,
  QuestionAnswer,
  RestaurantImage,
  RestaurantProfile,
  Review,
} from "./types"

// ============================================================================
// TYPES
// ============================================================================

export type TabValue = "profile" | "images" | "menu" | "qa" | "reviews" | "analytics"

export interface OwnerDashboardProps {
  /** Restaurant profile data */
  profile: RestaurantProfile
  /** Restaurant images */
  images: RestaurantImage[]
  /** Menu categories and items */
  menu: MenuCategory[]
  /** Customer questions */
  questions: QuestionAnswer[]
  /** Customer reviews */
  reviews: Review[]
  /** Analytics data */
  analytics: AnalyticsData
  /** Loading state */
  isLoading?: boolean
  /** Save profile handler */
  onSaveProfile?: (profile: RestaurantProfile) => void
  /** Upload images handler */
  onUploadImages?: (files: File[]) => void
  /** Delete image handler */
  onDeleteImage?: (id: string) => void
  /** Update image handler */
  onUpdateImage?: (id: string, data: Partial<RestaurantImage>) => void
  /** Reorder images handler */
  onReorderImages?: (images: RestaurantImage[]) => void
  /** Save menu handler */
  onSaveMenu?: (categories: MenuCategory[]) => void
  /** Answer question handler */
  onAnswerQuestion?: (id: string, answer: string) => void
  /** Delete question handler */
  onDeleteQuestion?: (id: string) => void
  /** Respond to review handler */
  onRespondReview?: (id: string, response: string) => void
  /** Delete review handler */
  onDeleteReview?: (id: string) => void
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Owner Dashboard Component
 *
 * A comprehensive dashboard for restaurant owners with tabbed navigation
 * across Profile, Images, Menu, Q&A, Reviews, and Analytics sections.
 *
 * @example
 * <OwnerDashboard
 *   profile={profileData}
 *   images={imagesData}
 *   menu={menuData}
 *   questions={questionsData}
 *   reviews={reviewsData}
 *   analytics={analyticsData}
 * />
 */
export function OwnerDashboard({
  profile,
  images,
  menu,
  questions,
  reviews,
  analytics,
  isLoading = false,
  onSaveProfile,
  onUploadImages,
  onDeleteImage,
  onUpdateImage,
  onReorderImages,
  onSaveMenu,
  onAnswerQuestion,
  onDeleteQuestion,
  onRespondReview,
  onDeleteReview,
}: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("profile")

  // Tab configuration
  const tabs = [
    { value: "profile" as TabValue, label: "Profile", icon: BuildingStorefrontIcon },
    { value: "images" as TabValue, label: "Images", icon: PhotoIcon },
    { value: "menu" as TabValue, label: "Menu", icon: UtensilsIcon },
    { value: "qa" as TabValue, label: "Q&A", icon: ChatBubbleQuestionIcon },
    { value: "reviews" as TabValue, label: "Reviews", icon: StarIcon },
    { value: "analytics" as TabValue, label: "Analytics", icon: ChartBarIcon },
  ]

  return (
    <div className="w-full min-h-[calc(100vh-var(--header-total-height))]">
      {/* Page Header */}
      <header className="mb-[var(--section-gap-md)]">
        <h1 className="text-[var(--heading-page)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-sm)]">
          Owner <span className="text-[var(--color-primary)] italic">Dashboard</span>
        </h1>
        <p className="text-[var(--font-size-lg)] text-[var(--fg-70)]">
          Manage your restaurant profile, menu, and customer interactions
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="mb-[var(--spacing-xl)]">
        <Tabs
          activeTab={activeTab}
          onChange={(value) => setActiveTab(value as TabValue)}
          items={tabs}
        />
      </div>

      {/* Tab Content */}
      <main className="min-h-[var(--spacing-4xl)]">
        {activeTab === "profile" && (
          <ProfileSection
            data={profile}
            onSave={onSaveProfile ?? (() => {})}
            isLoading={isLoading}
          />
        )}

        {activeTab === "images" && (
          <ImageGallerySection
            images={images}
            onUpload={onUploadImages ?? (() => {})}
            onDelete={onDeleteImage ?? (() => {})}
            onUpdate={onUpdateImage ?? (() => {})}
            onReorder={onReorderImages ?? (() => {})}
            isLoading={isLoading}
          />
        )}

        {activeTab === "menu" && (
          <MenuBuilderSection
            categories={menu}
            onSave={onSaveMenu ?? (() => {})}
            isLoading={isLoading}
          />
        )}

        {activeTab === "qa" && (
          <QASection
            questions={questions}
            onAnswer={onAnswerQuestion ?? (() => {})}
            onDelete={onDeleteQuestion ?? (() => {})}
            isLoading={isLoading}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsSection
            reviews={reviews}
            onRespond={onRespondReview ?? (() => {})}
            onDelete={onDeleteReview ?? (() => {})}
            isLoading={isLoading}
          />
        )}

        {activeTab === "analytics" && <AnalyticsSection data={analytics} isLoading={isLoading} />}
      </main>
    </div>
  )
}

export const OwnerDashboard = memo(OwnerDashboard)
