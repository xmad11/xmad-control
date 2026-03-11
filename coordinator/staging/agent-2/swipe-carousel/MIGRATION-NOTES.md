# SwipeCarousel Migration Notes

## Overview
Migrated `SwipeCarousel` component from `shadi-nextjs-uae` to `Shadi V2` with complete refactor to remove external dependencies and use design tokens exclusively.

## Source File
- **Original**: `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/ui/SwipeCarousel.tsx`
- **Target**: `/Users/ahmadabdullah/Projects/shadi-V2/coordinator/staging/agent-2/swipe-carousel/SwipeCarousel.tsx`
- **Lines**: 502 lines migrated

## Changes Made

### 1. Component Refactor
- **Removed**: `keen-slider` dependency - now uses custom touch/drag implementation
- **Removed**: lucide-react icons (Loader2)
- **Added**: Custom CSS spinner with design tokens
- **Added**: Native Next.js Image component (no SafeImage wrapper)
- **Changed**: All hardcoded values to design tokens (--color-primary, --spacing-md, etc.)

### 2. Key Features Implemented

#### Touch/Swipe Detection
- Velocity-based swipe detection (15% distance OR 0.5px/ms speed)
- Constrained drag distance (max 30% of container width)
- Touch and mouse event handlers
- Prevents parent navigation on swipe with `wasSwipedRef`

#### Performance Optimizations
- Intersection Observer for lazy initialization
- Image preloading for adjacent slides
- Lazy loading for images beyond viewport
- Adjacent slide preloading on navigation

#### Accessibility
- Keyboard navigation (ArrowLeft, ArrowRight)
- ARIA live regions (`aria-roledescription`, `aria-label`)
- Proper focus management
- Screen reader announcements

#### Auto-play
- Configurable interval (default 5000ms)
- Pause on drag/start
- Resume after 4 seconds
- Play/pause toggle button

### 3. Design Tokens Used

| Original Hardcoded | Design Token |
|-------------------|--------------|
| `#primary` | `var(--color-primary)` |
| `h-48` | `height: 12rem` (via prop) |
| `bg-white/80` | `bg-[var(--bg)]/80` |
| `rounded-lg` | `rounded-[var(--radius-lg)]` |
| `p-4` | `p-[var(--spacing-md)]` |
| `gap-2` | `gap-[var(--spacing-xs)]` |
| `w-8` | `w-8` (indicator, inline for visual precision) |
| `duration-300` | `duration-[var(--duration-normal)]` |

### 4. Props Interface

```typescript
export interface SwipeCarouselProps {
  images: string[];           // Array of image URLs
  className?: string;         // Additional CSS classes
  autoPlay?: boolean;         // Enable auto-play (default: false)
  interval?: number;          // Auto-play interval in ms (default: 5000)
  showIndicators?: boolean;   // Show dot indicators (default: true)
  showArrows?: boolean;       // (Not implemented, kept for future)
  height?: string;            // Carousel height (default: "12rem")
  cardIndex?: number;         // For lazy loading logic (default: 0)
  restaurantName?: string;    // For alt text (default: "Restaurant")
}
```

### 5. Files Updated

#### Part A: Component Staged
- ✅ `/coordinator/staging/agent-2/swipe-carousel/SwipeCarousel.tsx`
- ✅ `/coordinator/staging/agent-2/swipe-carousel/index.ts`

#### Part B: Restaurants Page Updated
- ✅ `/coordinator/staging/agent-2/swipe-carousel/restaurants-page.tsx`
- Changed from: Grid layout (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`)
- Changed to: Vertical list with SwipeCarousel for multi-image galleries
- Each restaurant card now shows image carousel + card info

#### Part C: Blog Page Updated
- ✅ `/coordinator/staging/agent-2/swipe-carousel/BlogClient.tsx`
- Changed from: Grid layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Changed to: Vertical list with SwipeCarousel for cover images
- Each blog card now shows image carousel + card info

## Usage Examples

### Basic Carousel
```tsx
import { SwipeCarousel } from "@/components/ui/SwipeCarousel"

<SwipeCarousel
  images={["/image1.jpg", "/image2.jpg"]}
  height="16rem"
  showIndicators={true}
/>
```

### With Auto-play
```tsx
<SwipeCarousel
  images={restaurant.images}
  autoPlay={true}
  interval={5000}
  height="20rem"
  restaurantName="Restaurant Name"
/>
```

### In Restaurant Card
```tsx
<div className="bg-[var(--bg)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
  {/* Image Carousel */}
  {restaurant.images && restaurant.images.length > 0 && (
    <SwipeCarousel
      images={restaurant.images}
      height="16rem"
      showIndicators={restaurant.images.length > 1}
      autoPlay={false}
      cardIndex={index}
      restaurantName={restaurant.name}
    />
  )}

  {/* Restaurant Info */}
  <div className="p-[var(--spacing-md)]">
    <RestaurantCard variant="compact" {...restaurant} />
  </div>
</div>
```

## Migration Checklist

- [x] Migrated SwipeCarousel component (502 lines)
- [x] Removed keen-slider dependency
- [x] Replaced all hardcoded values with design tokens
- [x] Added custom CSS spinners
- [x] Implemented touch/drag handlers
- [x] Added velocity detection
- [x] Implemented lazy loading with Intersection Observer
- [x] Added adjacent image preloading
- [x] Added keyboard navigation
- [x] Added ARIA attributes
- [x] Updated restaurants page to use carousel
- [x] Updated blog page to use carousel
- [x] Created barrel export (index.ts)
- [x] Created migration notes

## Breaking Changes

1. **Import Path Changed**
   - Old: `import { SwipeCarousel } from "@/components/ui/carousel"`
   - New: `import { SwipeCarousel } from "@/components/ui/SwipeCarousel"`

2. **Removed keen-slider**
   - Old component relied on `keen-slider/react` package
   - New component has NO external dependencies

3. **Props Changed**
   - Removed: `options` (keen-slider specific options)
   - Added: `cardIndex`, `restaurantName` for accessibility
   - `showArrows` prop kept but not implemented (future work)

4. **Layout Changed**
   - Old: Grid layout with direct card rendering
   - New: Vertical list with carousel + card info structure

## Testing Recommendations

1. **Touch/Swipe Testing**
   - Test on mobile devices with touch
   - Verify swipe sensitivity and velocity thresholds
   - Test with rapid swipes

2. **Keyboard Navigation**
   - Test ArrowLeft and ArrowRight keys
   - Verify focus management

3. **Auto-play**
   - Test auto-play starts/stops correctly
   - Verify pause on drag
   - Test resume after 4 seconds

4. **Lazy Loading**
   - Test with many images
   - Verify adjacent images preload
   - Check Intersection Observer triggers

5. **Accessibility**
   - Test with screen reader
   - Verify ARIA labels
   - Test keyboard-only navigation

## Known Limitations

1. **showArrows prop**: Currently not implemented, kept for future enhancement
2. **Single image**: Indicators hidden automatically when only 1 image
3. **Carousel width**: Always 100% of container (no maxWidth prop)

## Performance Notes

- Component uses `React.memo` to prevent unnecessary re-renders
- Intersection Observer disconnects after first visibility
- Adjacent images only preload when slide changes
- Auto-play timeout cleared on unmount
- Event listeners properly cleaned up

## Next Steps

1. Review staged files in `/coordinator/staging/agent-2/swipe-carousel/`
2. Test on actual device with touch support
3. Remove old Carousel.tsx after approval
4. Update imports in app/restaurants/page.tsx and features/blog/BlogClient.tsx

---

**Migration Date**: 2026-01-04
**Migrated By**: Agent-2 (Carousel Migration Phase)
**Status**: ✅ Complete (awaiting review and integration)
