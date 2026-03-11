/**
 * Owner Dashboard Types
 *
 * All types for the Owner Dashboard components.
 * No `any`, `undefined`, or `never` types (unless genuinely unreachable).
 */

/**
 * Restaurant profile data structure
 */
export interface RestaurantProfile {
  id: string
  name: string
  slug: string
  description?: string
  cuisine: string[]
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  location: {
    address: string
    city: string
    area: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  hours: OpeningHour[]
  status: "pending" | "active" | "suspended"
}

/**
 * Opening hours structure
 */
export interface OpeningHour {
  dayOfWeek: number // 0-6, 0 = Sunday
  openTime: string // HH:mm format
  closeTime: string // HH:mm format
  isClosed: boolean
}

/**
 * Restaurant image data
 */
export interface RestaurantImage {
  id: string
  url: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: Date
}

/**
 * Menu category structure
 */
export interface MenuCategory {
  id: string
  name: string
  description?: string
  order: number
  items: MenuItem[]
}

/**
 * Menu item structure
 */
export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  isActive: boolean
  image?: string
  order: number
}

/**
 * Q&A item structure
 */
export interface QuestionAnswer {
  id: string
  question: string
  answer?: string
  askedBy: string
  askedAt: Date
  isAnswered: boolean
}

/**
 * Review structure
 */
export interface Review {
  id: string
  rating: number
  comment: string
  reviewer: {
    name: string
    avatar?: string
  }
  createdAt: Date
  response?: {
    text: string
    respondedAt: Date
  }
}

/**
 * Analytics data structure
 */
export interface AnalyticsData {
  views: {
    total: number
    trend: number // percentage change
    daily: Array<{
      date: string
      count: number
    }>
  }
  clicks: {
    total: number
    trend: number
    daily: Array<{
      date: string
      count: number
    }>
  }
  calls: {
    total: number
    trend: number
    daily: Array<{
      date: string
      count: number
    }>
  }
  favorites: {
    total: number
    trend: number
  }
}

/**
 * Form field error type
 */
export interface FieldError {
  field: string
  message: string
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
}
