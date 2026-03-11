# AGENT-2 PROMPT - shadi-nextjs-uae MIGRATION PHASE 1

**Role:** UI Components Migration Specialist
**Phase:** Critical Infrastructure (Loading States, Carousel)
**Date:** 2026-01-04

---

## 🎯 YOUR MISSION

Migrate **2 major component systems** from **shadi-nextjs-uae** to **Shadi V2**:

1. **M04: Loading States Migration** (12 components from LoadingStates.tsx - 454 lines)
2. **M05: Carousel Migration** (SwipeCarousel custom - 502 lines, replace grids with carousels)

---

## 📋 TASK QUEUE (Work in Order)

### Task M04: Loading States Migration 🔴 CRITICAL

**Source File:** `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/ui/LoadingStates.tsx` (454 lines)

**Your Job:**
1. Read the source file carefully (it has 12 components inside)
2. Copy to `/coordinator/staging/agent-2/loading-states/LoadingStates.tsx`
3. Replace ALL hardcoded values with Shadi V2 design tokens
4. Replace lucide-react icons with Heroicons
5. Ensure TypeScript compliance
6. Add proper JSDoc comments
7. Create barrel export in `index.ts`

**Components to Extract:**
| Component | Lines | Features |
|-----------|-------|----------|
| SuspenseLoading | 66 | Delay before show, min display time, smooth fade |
| Skeleton | 52 | Text, circular, rectangular variants, shimmer |
| ProgressiveImage | 80 | Blur-up placeholder, lazy loading, error state |
| LazyLoad | 31 | Intersection Observer, configurable threshold |
| StaggeredLoading | 23 | Bouncing dots with staggered delays |
| SmartLoading | 49 | Retry capability, error handling, retry counter |
| LoadingSpinner | 24 | Multiple sizes (sm, md, lg) |
| SkeletonCard | 19 | Card placeholder with content structure |
| SkeletonList | 23 | List item skeleton with avatars |
| Plus utilities | 87 | Helper functions and types |

**What to Fix:**
- Replace `bg-gray-200` → `bg-[var(--bg-70)]`
- Replace `text-gray-600` → `text-[var(--fg-70)]`
- Replace `bg-brand-primary` → `bg-[var(--color-primary)]`
- Replace `w-4 h-4` icons → `w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]`

**Icon Replacements:**
| lucide-react | Heroicons |
|--------------|-----------|
| Loader2 | CSS spinner or create SVG |
| AlertCircle | ExclamationCircleIcon |
| RefreshCw | ArrowPathIcon |

**Deliverables:**
```
/coordinator/staging/agent-2/loading-states/
├── LoadingStates.tsx (all 12 components)
└── index.ts (exports)
```

---

### Task M05: Carousel Migration 🔴 CRITICAL

**Source File:** `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/ui/SwipeCarousel.tsx` (502 lines)

**IMPORTANT:**
- ⚠️ **Replace GRID layouts with CAROUSEL** in restaurants and blog pages
- ⚠️ **These pages currently use grids** - you will update them to use SwipeCarousel
- ⚠️ **Remove old unused Carousel.tsx** after migration (it uses keen-slider and isn't used anywhere)

**Your Job:**

**Part A: Stage SwipeCarousel Component**
1. Read the source file carefully
2. Copy to `/coordinator/staging/agent-2/swipe-carousel/SwipeCarousel.tsx`
3. Replace ALL hardcoded values with design tokens
4. Ensure TypeScript compliance
5. Add proper JSDoc comments

**Part B: Update Restaurants Page to Use Carousel**
1. Read `/Users/ahmadabdullah/Projects/shadi-V2/app/restaurants/page.tsx`
2. Copy to `/coordinator/staging/agent-2/swipe-carousel/restaurants-page.tsx`
3. Replace the GRID layout with SwipeCarousel
4. Keep the FilterBar and header - only replace the restaurant grid
5. Show restaurants in a horizontal swipeable carousel

**Part C: Update Blog Page to Use Carousel**
1. Read `/Users/ahmadabdullah/Projects/shadi-V2/features/blog/BlogClient.tsx`
2. Copy to `/coordinator/staging/agent-2/swipe-carousel/BlogClient.tsx`
3. Replace the GRID layout with SwipeCarousel
4. Keep the search, filters, and header - only replace the blog grid
5. Show blogs in a horizontal swipeable carousel

**Features to Preserve:**
- Custom touch/drag implementation (NO external dependencies)
- Velocity detection with configurable thresholds
- Lazy loading with Intersection Observer
- Image preloading for next/previous slides
- Auto-play with pause on drag
- Keyboard navigation (arrow keys)
- ARIA live regions for screen readers
- Swipe-to-prevent-click navigation

**What to Fix in SwipeCarousel:**
- Replace all hardcoded colors/spacing
- Ensure proper token usage

**Files to Update (Replace Grid with Carousel):**
1. `/app/restaurants/page.tsx` - Replace grid with SwipeCarousel
2. `/features/blog/BlogClient.tsx` - Replace grid with SwipeCarousel

**Files to Remove After Migration:**
- `/components/carousel/Carousel.tsx` (old keen-slider version - UNUSED)

**Deliverables:**
```
/coordinator/staging/agent-2/swipe-carousel/
├── SwipeCarousel.tsx (migrated component)
├── restaurants-page.tsx (updated to use carousel)
├── BlogClient.tsx (updated to use carousel)
└── MIGRATION-NOTES.md (summary of changes)
```

**MIGRATION-NOTES.md should include:**
```
# SwipeCarousel Migration Notes

## Changes Made

### 1. Restaurants Page (/app/restaurants/page.tsx)
**Before:** Grid layout (grid-cols-2 sm:grid-cols-3 lg:grid-cols-4)
**After:** SwipeCarousel with horizontal swipe
**Preserved:** FilterBar, header, results count

### 2. Blog Page (/features/blog/BlogClient.tsx)
**Before:** Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
**After:** SwipeCarousel with horizontal swipe
**Preserved:** Search, filters, categories, header

### 3. Old Component Removed
- /components/carousel/Carousel.tsx (keen-slider version - UNUSED)

## Carousel Features
- Touch/swipe gestures
- Keyboard navigation
- Lazy loading
- Image preloading
- Auto-play with pause on drag
- ARIA compliant

## Testing Checklist
- [ ] Touch swipe works on mobile
- [ ] Keyboard navigation works
- [ ] Images load lazily
- [ ] Auto-play pauses on interaction
- [ ] Screen reader announces changes
```

---

## 🚨 CRITICAL RULES

### 1. Design Token Compliance (NON-NEGOTIABLE)
```css
/* ✅ CORRECT */
className="bg-[var(--bg-70)] text-[var(--fg-70)]"

/* ❌ WRONG */
className="bg-gray-200 text-gray-600"
```

### 2. Icon Replacements
| lucide-react | Heroicons |
|--------------|-----------|
| Loader2 | Create CSS spinner |
| AlertCircle | ExclamationCircleIcon |
| RefreshCw | ArrowPathIcon |
| ChevronUp | ChevronUpIcon |
| ChevronDown | ChevronDownIcon |
| ChevronLeft | ChevronLeftIcon |
| ChevronRight | ChevronRightIcon |

### 3. TypeScript Standards
```typescript
// ✅ CORRECT
export interface Props {
  images: string[]
  autoPlay?: boolean
}

// ❌ WRONG
export interface Props {
  images: any
  autoPlay: undefined  // Use ? instead
}
```

### 4. Named Exports Only
```typescript
// ✅ CORRECT
export function SwipeCarousel() { }

// ❌ WRONG
export default function SwipeCarousel() { }
```

---

## 📤 SUBMISSION PROCESS

After completing EACH task:

1. **Post message:**
   ```
   Task MXX ready for review - [Component Name]
   Files: [list of files]
   Changes: [brief description of fixes]
   Tokens replaced: [count]
   Icons replaced: [count]
   Grids replaced with carousel: [count]
   ```

2. **Wait for coordinator approval** before copying to main project

---

## 🎯 SUCCESS CRITERIA

Your submission will be approved when:
- ✅ All hardcoded values replaced with design tokens
- ✅ All lucide-react icons replaced with Heroicons
- ✅ Zero TypeScript violations (no `any`, `never`, `undefined`)
- ✅ Named exports only
- ✅ JSDoc comments on all exports
- ✅ All 12 loading components included (M04)
- ✅ Touch/swipe features preserved (M05)
- ✅ Restaurants grid replaced with carousel (M05)
- ✅ Blog grid replaced with carousel (M05)
- ✅ Proper file structure

---

## 📁 REFERENCE DOCUMENTS

- Migration Analysis: `/docs/shadi-nextjs-uae-component-migration-analysis.md`
- Design Tokens: `/styles/tokens.css`
- Template Ratings: `/docs/TEMPLATE-RATINGS.md`

---

## 💡 TIPS

**For LoadingStates.tsx:**
- Take your time extracting each component
- Maintain the exact structure
- Don't miss the utility functions at the bottom

**For SwipeCarousel.tsx:**
- This is a complex component (502 lines)
- Focus on preserving all the touch/swipe logic
- The drag detection is critical - don't break it

**For Updating Pages:**
- Keep ALL the existing functionality (filters, search, headers)
- ONLY replace the grid layout with carousel
- Make sure cards are properly sized for carousel
- Test that all props pass through correctly

---

**READY TO START? Begin with Task M04.**

Good luck! 🚀
