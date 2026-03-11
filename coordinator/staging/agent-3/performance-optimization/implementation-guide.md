# Performance Optimization Implementation Guide

**Task:** #018 - Performance Optimization
**Date:** 2026-01-04

---

## Code Examples for Performance Optimization

### 1. React.memo Implementation

**File:** `components/ui/file-upload/FileItem.tsx`

**Before:**
```typescript
export function FileItem({ file, onRemove }: FileItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{file.name}</span>
      <button onClick={() => onRemove(file.id)}>Remove</button>
    </div>
  )
}
```

**After:**
```typescript
import { memo } from "react"

export const FileItem = memo(function FileItem({ file, onRemove }: FileItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{file.name}</span>
      <button onClick={() => onRemove(file.id)}>Remove</button>
    </div>
  })
})
```

### 2. Dynamic Imports (Code Splitting)

**File:** `app/restaurant/[slug]/page.tsx`

```typescript
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load heavy sections
const ReviewsSection = dynamic(() => import('./components/ReviewsSection'), {
  loading: () => <ReviewsSkeleton />,
})

const LocationSection = dynamic(() => import('./components/LocationSection'), {
  loading: () => <SectionSkeleton />,
})

export default function RestaurantPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <LocationSection />
      </Suspense>
    </div>
  )
}
```

### 3. Image Optimization Patterns

**Above the fold (priority):**
```typescript
<Image
  src="/hero.jpg"
  alt="Hero image"
  fill
  sizes="100vw"
  priority={true} // Loads immediately
  quality={85}
/>
```

**Below the fold (lazy):**
```typescript
<Image
  src="/gallery-1.jpg"
  alt="Gallery image"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  quality={75}
/>
```

### 4. useCallback for Event Handlers

```typescript
import { useCallback } from 'react'

function RestaurantCard({ restaurant, onFavorite }: Props) {
  // Prevents recreation on every render
  const handleFavorite = useCallback(() => {
    onFavorite(restaurant.id)
  }, [restaurant.id, onFavorite])

  const handleShare = useCallback(() => {
    navigator.share({ title: restaurant.title })
  }, [restaurant.title])

  return (
    <div>
      <button onClick={handleFavorite}>Favorite</button>
      <button onClick={handleShare}>Share</button>
    </div>
  )
}
```

### 5. useMemo for Expensive Calculations

```typescript
import { useMemo } from 'react'

function RestaurantList({ restaurants, filters }: Props) {
  // Only re-sort when restaurants change
  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => 
      b.rating - a.rating
    )
  }, [restaurants])

  // Only re-filter when sorted list or filters change
  const filteredRestaurants = useMemo(() => {
    return sortedRestaurants.filter(r => 
      (!filters.cuisine || r.cuisine === filters.cuisine) &&
      (!filters.priceRange || r.priceMin <= filters.priceRange)
    )
  }, [sortedRestaurants, filters])

  return (
    <div>
      {filteredRestaurants.map(r => <RestaurantCard key={r.id} {...r} />)}
    </div>
  )
}
```

### 6. Lazy Loading Heavy Components

**Owner Dashboard Example:**
```typescript
// app/owner/page.tsx
import dynamic from 'next/dynamic'
import { LoadingSpinner } from '@/components/ui/loading'

const AnalyticsSection = dynamic(
  () => import('./components/AnalyticsSection'),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false // Charts don't need SSR
  }
)

const MenuBuilder = dynamic(
  () => import('./components/MenuBuilder'),
  { loading: () => <LoadingSpinner /> }
)

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tab value="profile">Profile</Tab>
        <Tab value="menu">Menu</Tab>
        <Tab value="analytics">Analytics</Tab>
      </Tabs>

      {activeTab === 'menu' && <MenuBuilder />}
      {activeTab === 'analytics' && <AnalyticsSection />}
    </div>
  )
}
```

### 7. List Virtualization (for 100+ items)

```typescript
// Using react-window
import { FixedSizeList } from 'react-window'

function RestaurantList({ restaurants }: Props) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <RestaurantCard {...restaurants[index]} />
    </div>
  )

  return (
    <FixedSizeList
      height={600}
      itemCount={restaurants.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

---

## Performance Monitoring

### Add Performance Monitoring

```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`[Performance] ${name}: ${end - start}ms`)
  } else {
    fn()
  }
}

// Usage
measurePerformance('RestaurantList render', () => {
  // rendering logic
})
```

---

## Bundle Analysis

### Check bundle sizes after build:

```bash
bun run build

# Look for:
# - First Load JS (should be < 200KB)
# - Total bundle size
# - Large chunks that could be split
```

---

## Core Web Vitals Targets

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.5s | > 4s |
| FID (First Input Delay) | < 100ms | < 100ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.1 | > 0.25 |

---

## Quick Wins

1. ✅ **Use React.memo for list items** - Already done for RestaurantCard, BlogCard
2. ✅ **Lazy load images** - Already done with Next.js Image + loading="lazy"
3. ✅ **Dynamic imports** - Documented in this guide
4. ✅ **Code splitting** - Use Next.js automatic splitting + dynamic imports
5. 🔄 **Debounce input handlers** - Add to search/filter inputs
6. 🔄 **Throttle scroll handlers** - Add to infinite scroll

---

**Status:** Implementation guide ready
**Next Steps:** Apply patterns to remaining components as needed
