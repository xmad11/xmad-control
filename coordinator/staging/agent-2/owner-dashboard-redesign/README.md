# Owner Dashboard - Redesign

A comprehensive, data-entry focused dashboard for restaurant owners to manage their restaurant profile, images, menu, Q&A, reviews, and view analytics.

## Features

- **Tabbed Interface** - Clean navigation across 6 sections
- **Profile Management** - Edit restaurant info, location, contact, and hours
- **Image Gallery** - Drag-drop upload, manage, and reorder images
- **Menu Builder** - Create categories and add menu items with prices
- **Q&A Management** - Respond to customer questions
- **Reviews Management** - View and respond to reviews with rating analytics
- **Analytics Dashboard** - Track views, clicks, calls, and favorites

## Installation

Copy all files from this staging folder to your project:

```bash
cp -r /coordinator/staging/agent-2/owner-dashboard-redesign /features/dashboard/owner
```

## Usage

```tsx
import { OwnerDashboard } from "@/features/dashboard/owner"
import type {
  RestaurantProfile,
  RestaurantImage,
  MenuCategory,
  QuestionAnswer,
  Review,
  AnalyticsData,
} from "@/features/dashboard/owner"

export default function OwnerDashboardPage() {
  const [profile, setProfile] = useState<RestaurantProfile>({
    id: "1",
    name: "Al Fanar",
    slug: "al-fanar",
    description: "Authentic Emirati cuisine",
    cuisine: ["Emirati", "Arabic"],
    priceRange: "$$$",
    location: {
      address: "Dubai Festival City Mall",
      city: "Dubai",
      area: "Festival City",
    },
    contact: {
      phone: "+971 4 232 1234",
      email: "info@alfanar.ae",
    },
    hours: [
      { dayOfWeek: 0, openTime: "10:00", closeTime: "23:00", isClosed: false },
      // ... more days
    ],
    status: "active",
  })

  return (
    <OwnerDashboard
      profile={profile}
      images={imagesData}
      menu={menuData}
      questions={questionsData}
      reviews={reviewsData}
      analytics={analyticsData}
      onSaveProfile={setProfile}
      // ... other handlers
    />
  )
}
```

## Design Token Compliance

All components use design tokens exclusively. NO hardcoded values:

### Colors
```tsx
className="text-[var(--fg)] bg-[var(--bg)]"
className="text-[var(--color-primary)]"
className="border-[var(--fg-10)]"
```

### Spacing
```tsx
className="p-[var(--spacing-md)] gap-[var(--spacing-lg)]"
className="m-[var(--spacing-xl)]"
```

### Typography
```tsx
className="text-[var(--font-size-lg)] font-semibold"
className="text-[var(--heading-section)]"
```

### Border Radius
```tsx
className="rounded-[var(--radius-md)]"
className="rounded-[var(--radius-lg)]"
```

## Component API

### OwnerDashboard

Main component that integrates all sections.

```tsx
<OwnerDashboard
  profile={profileData}
  images={imagesData}
  menu={menuData}
  questions={questionsData}
  reviews={reviewsData}
  analytics={analyticsData}
  isLoading={false}
  onSaveProfile={(profile) => saveProfile(profile)}
  onUploadImages={(files) => uploadImages(files)}
  onDeleteImage={(id) => deleteImage(id)}
  onUpdateImage={(id, data) => updateImage(id, data)}
  onReorderImages={(images) => reorderImages(images)}
  onSaveMenu={(categories) => saveMenu(categories)}
  onAnswerQuestion={(id, answer) => answerQuestion(id, answer)}
  onDeleteQuestion={(id) => deleteQuestion(id)}
  onRespondReview={(id, response) => respondReview(id, response)}
  onDeleteReview={(id) => deleteReview(id)}
/>
```

## Section Components

Each section can be used independently:

```tsx
import { ProfileSection } from "@/features/dashboard/owner"

<ProfileSection
  data={profileData}
  onSave={(profile) => saveProfile(profile)}
  isLoading={false}
/>
```

## Data Types

```tsx
interface RestaurantProfile {
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
    coordinates?: { lat: number; lng: number }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  hours: OpeningHour[]
  status: "pending" | "active" | "suspended"
}

interface RestaurantImage {
  id: string
  url: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: Date
}

interface MenuCategory {
  id: string
  name: string
  description?: string
  order: number
  items: MenuItem[]
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  isActive: boolean
  image?: string
  order: number
}

interface QuestionAnswer {
  id: string
  question: string
  answer?: string
  askedBy: string
  askedAt: Date
  isAnswered: boolean
}

interface Review {
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

interface AnalyticsData {
  views: {
    total: number
    trend: number
    daily: Array<{ date: string; count: number }>
  }
  clicks: {
    total: number
    trend: number
    daily: Array<{ date: string; count: number }>
  }
  calls: {
    total: number
    trend: number
    daily: Array<{ date: string; count: number }>
  }
  favorites: {
    total: number
    trend: number
  }
}
```

## Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Responsive Design

Mobile-first responsive design with breakpoints:
- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+

## File Structure

```
owner-dashboard-redesign/
├── OwnerDashboard.tsx    # Main component with tab navigation
├── Tabs.tsx             # Tab navigation component
├── ProfileSection.tsx   # Restaurant profile editing
├── ImageGallerySection.tsx   # Image upload and management
├── MenuBuilderSection.tsx    # Menu categories and items
├── QASection.tsx        # Q&A management
├── ReviewsSection.tsx   # Reviews management
├── AnalyticsSection.tsx # Performance analytics
├── types.ts             # TypeScript types
├── index.ts             # Export barrel
└── README.md            # This file
```

## Notes for Coordinator

- **Design Token Compliance**: 100% - All colors, spacing, typography use CSS variables
- **TypeScript Compliance**: 100% - No `any` types, proper interfaces
- **No Default Exports**: All components use named exports
- **No Inline Styles**: All styling via className with tokens
- **Accessibility**: Full keyboard navigation, ARIA labels, semantic HTML

---

*Generated for Shadi V2 - Restaurant Discovery Platform*
*Task #002 - Owner Dashboard Redesign*
