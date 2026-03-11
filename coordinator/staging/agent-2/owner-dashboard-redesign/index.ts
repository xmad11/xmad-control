/**
 * Owner Dashboard - Index
 *
 * Centralized exports for the Owner Dashboard redesign.
 * All components use design tokens exclusively - NO hardcoded values.
 * Proper TypeScript - NO `any` types.
 */

// Main component
export { OwnerDashboard } from "./OwnerDashboard"
export type { OwnerDashboardProps, TabValue } from "./OwnerDashboard"

// Section components
export { ProfileSection } from "./ProfileSection"
export { ImageGallerySection } from "./ImageGallerySection"
export { MenuBuilderSection } from "./MenuBuilderSection"
export { QASection } from "./QASection"
export { ReviewsSection } from "./ReviewsSection"
export { AnalyticsSection } from "./AnalyticsSection"

// Utility components
export { Tabs } from "./Tabs"
export { Tab } from "./Tabs"

// Types
export type {
  RestaurantProfile,
  OpeningHour,
  RestaurantImage,
  MenuCategory,
  MenuItem,
  QuestionAnswer,
  Review,
  AnalyticsData,
  FieldError,
  ValidationResult,
} from "./types"
