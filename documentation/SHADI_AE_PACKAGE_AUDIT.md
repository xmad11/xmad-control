# Shadi-v2 → Shadi.ae: Complete Package & Feature Audit

> **Status**: Read-Only Analysis | **Date**: 2026-01-30
>
> Complete breakdown of what Shadi-v2 has, what Shadi.ae needs, and what to skip.

---

## TABLE OF CONTENTS

1. [All Current Dependencies (Shadi-v2)](#all-current-dependencies)
2. [Feature Analysis by Category](#feature-analysis-by-category)
3. [Package Decision Matrix](#package-decision-matrix)
4. [Components Copy Decision](#components-copy-decision)
5. [Final Package List for Shadi.ae](#final-package-list-for-shadiae)

---

## 1. ALL CURRENT DEPENDENCIES (Shadi-v2)

### Production Dependencies (15 packages)

| Package | Version | Status | Used For |
|---------|---------|--------|----------|
| `@supabase/ssr` | ^0.8.0 | ✅ Keep | Supabase Server-Side Rendering auth |
| `@tailwindcss/postcss` | ^4.1.18 | ✅ Keep | Tailwind CSS PostCSS integration |
| `blurhash` | ^2.0.5 | ✅ Keep | Image blur placeholder generation |
| `clsx` | ^2.1.1 | ✅ Keep | Conditional class names |
| `embla-carousel-react` | ^8.6.0 | ✅ Keep | Image carousel in cards |
| `keen-slider` | ^6.8.6 | ❌ SKIP | Only in audit scripts |
| `lucide-react` | ^0.562.0 | ✅ Keep | Icon library (100+ icons) |
| `mapbox-gl` | ^3.18.1 | ✅ Keep | Map rendering |
| `next` | ^16.1.1 | ✅ Keep | Framework (App Router, PPR) |
| `postcss` | ^8.5.6 | ✅ Keep | CSS processing |
| `react` | ^19.2.3 | ✅ Keep | UI library |
| `react-dom` | ^19.2.3 | ✅ Keep | React DOM renderer |
| `recharts` | ^3.6.0 | ❌ SKIP | Admin charts (will rebuild admin) |
| `sharp` | ^0.34.5 | ✅ Keep | Image optimization |
| `sonner` | ^2.0.7 | ✅ Keep | Toast notifications |
| `tailwind-merge` | ^3.4.0 | ✅ Keep | Merge Tailwind classes |
| `tailwindcss` | ^4.1.18 | ✅ Keep | Styling framework |
| `zod` | ^4.3.5 | ✅ Keep | Schema validation |

**Keep**: 13 packages
**Skip**: 2 packages

### Dev Dependencies (9 packages)

| Package | Version | Status | Used For |
|---------|---------|--------|----------|
| `@biomejs/biome` | ^1.9.4 | ✅ Keep | Linting & formatting |
| `@types/mapbox-gl` | ^3.4.1 | ✅ Keep | Mapbox types |
| `@types/node` | ^25.0.9 | ✅ Keep | Node types |
| `@types/react` | ^19.2.7 | ✅ Keep | React types |
| `@types/react-dom` | ^19.2.3 | ✅ Keep | React DOM types |
| `critters` | ^0.0.25 | ❌ SKIP | SSR CSS optimization (not needed yet) |
| `dotenv` | ^17.2.3 | ❌ SKIP | Use Bun's built-in env |
| `husky` | ^9.1.7 | 🔁 Fresh | Git hooks (set up fresh) |
| `lint-staged` | ^15.5.2 | 🔁 Fresh | Pre-commit linting (set up fresh) |
| `ts-morph` | ^27.0.2 | ❌ SKIP | Only in audit scripts |
| `typescript` | ^5.9.3 | ✅ Keep | TypeScript compiler |

**Keep**: 6 packages
**Skip**: 3 packages
**Fresh Install**: 2 packages

---

## 2. FEATURE ANALYSIS BY CATEGORY

### 🔒 SECURITY

**Current Implementation in Shadi-v2:**

```
lib/security/
├── audit.ts          # Audit logging for security events
├── headers.ts        # Security headers helper
├── index.ts          # Barrel exports
├── session.ts        # Cookie/session settings
├── validation.ts     # Input validation
└── zero-trust.ts     # Zero-trust security model
```

**What It Does:**
- Centralized audit logging for auth attempts
- Security headers verification (CSP, HSTS)
- Session management with secure cookies
- Input validation with Zod schemas
- Zero-trust pattern implementation

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `validation.ts` | ✅ Keep | Input validation needed for forms |
| `session.ts` | ✅ Keep | Secure auth cookies needed |
| `audit.ts` | ⚠️ Simplify | Keep basic logging, remove complex audit |
| `headers.ts` | ❌ Skip | Over-engineered for v1 |
| `zero-trust.ts` | ❌ Skip | Over-engineered for v1 |

**Action**: Copy `validation.ts` and `session.ts` only. Simplify audit to basic console logs.

---

### 📱 PWA (Progressive Web App)

**Current Implementation in Shadi-v2:**

```
public/manifest.json          # PWA manifest
components/ui/pwa-components/
├── InstallPrompt.tsx         # Install banner
├── OfflineBanner.tsx         # Offline status banner
└── OfflineSupport.tsx        # Full offline sync manager
app/_sw_cleanup.ts            # Service worker cleanup (dev only)
```

**What It Does:**
- PWA install prompt banner
- Online/offline status detection
- Offline action queue (favorites, reviews)
- Auto-sync when reconnecting
- **NO Service Worker** (intentionally disabled due to iOS issues)

**Packages Required:**
- ✅ **None** - All native browser APIs

**Shadi.ae Decision:**

| Component | Keep? | Priority | Reason |
|-----------|-------|----------|--------|
| `manifest.json` | ✅ Keep | High | Required for PWA |
| `InstallPrompt.tsx` | ✅ Keep | Medium | Nice-to-have for installs |
| `OfflineBanner.tsx` | ✅ Keep | High | Critical UX for offline |
| `OfflineSupport.tsx` | ⚠️ Simplify | Medium | Keep offline detection, remove complex sync |
| Service Worker | ❌ Skip | - | iOS compatibility issues |

**Action**: Copy `manifest.json`, `InstallPrompt.tsx`, and `OfflineBanner.tsx`. Simplify `OfflineSupport.tsx` to basic online/offline detection only (remove action queue and sync logic).

---

### ⚡ PPR (Partial Prerendering)

**Current Implementation in Shadi-v2:**

```javascript
// next.config.mjs
// PPR - Disabled cacheComponents due to refresh loops in development
// cacheComponents: true,

// App routes use Suspense boundaries
<Suspense fallback={<RestaurantDetailSkeleton />}>
  <RestaurantDetailClient />
</Suspense>
```

**What It Does:**
- Suspense boundaries in all route pages
- Shell renders immediately, content loads async
- Skeleton screens shown during async load

**Packages Required:**
- ✅ **None** - Built into Next.js 16

**Shadi.ae Decision:**

| Feature | Keep? | Reason |
|---------|-------|--------|
| Suspense boundaries | ✅ Keep | Core Next.js 16 feature |
| Skeleton fallbacks | ✅ Keep | Required for PPR UX |
| `cacheComponents` | ❌ Skip | Caused refresh loops in dev |

**Action**: Keep Suspense wrappers in all route pages. Copy skeleton components.

---

### 🐫 LAZY LOADING

**Current Implementation in Shadi-v2:**

```typescript
// Two types of lazy loading:

// 1. React Suspense + dynamic import
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>

// 2. Intersection Observer (manual lazy load)
<LazyLoad fallback={<Skeleton />}>
  <ExpensiveComponent />
</LazyLoad>
```

**Components:**
- `LazyLoad` component in `components/loading/LoadingStates.tsx`
- Uses `IntersectionObserver` API
- Falls back to skeleton when not in viewport

**Packages Required:**
- ✅ **None** - Native browser APIs

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `LazyLoad` component | ✅ Keep | Useful for below-fold content |
| Suspense boundaries | ✅ Keep | Core Next.js feature |
| `loading="lazy"` on images | ✅ Keep | Native image lazy loading |

**Action**: Copy `LoadingStates.tsx` with `LazyLoad` component.

---

### 🖼️ BLURHASH

**Current Implementation in Shadi-v2:**

```
lib/images/
├── decode-blurhash.ts          # Decode blurhash to canvas
├── generate-blurhash.ts        # Generate blurhash from image
├── precomputed-blurhash.ts     # Pre-generated hashes for mock data
└── image-tokens.ts             # Image-related CSS tokens

components/images/
└── OptimizedImage.tsx          # Image with blurhash fallback

components/card/variants/
└── detailed.tsx                # Uses blurhash in carousel
```

**What It Does:**
- Generate blurhash from restaurant images
- Decode blurhash to colored placeholder
- Show placeholder while real image loads
- Smooth blur-up transition effect

**Packages Required:**
- ✅ `blurhash` ^2.0.5 - **KEEP**

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `blurhash` package | ✅ Keep | Core image optimization |
| `decode-blurhash.ts` | ✅ Keep | Decoding logic |
| `generate-blurhash.ts` | ⚠️ Maybe | Script to generate hashes (dev only) |
| `precomputed-blurhash.ts` | ✅ Keep | Mock data hashes |
| `OptimizedImage.tsx` | ✅ Keep | Image component with blurhash |

**Action**: Copy all blurhash-related files. Keep `blurhash` package.

---

### 🦴 SKELETON / SHIMMER

**Current Implementation in Shadi-v2:**

```
components/ui/SkeletonCard.tsx           # Best-practice skeleton
components/loading/LoadingStates.tsx     # Multiple skeleton types
components/ui/loading-states/            # Duplicate (legacy)

styles/components/skeleton.css           # Shimmer animation
```

**Skeleton Components:**
- `SkeletonCard` - Card placeholder (image + lines)
- `Skeleton` - Generic skeleton (text, circular, rectangular)
- `SkeletonList` - List item with avatar
- `StaggeredLoading` - Bouncing dots

**Shimmer Implementation:**
```css
/* Shimmer ONLY on image placeholder */
.skeleton-shimmer {
  background: linear-gradient(90deg, transparent, oklch(...), transparent);
  animation: shimmer 1.5s infinite;
}

/* Text lines have NO shimmer (2026 best practice) */
.skeleton-line {
  background: var(--fg-10);
  /* No animation */
}
```

**Packages Required:**
- ✅ **None** - Pure CSS animations

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `SkeletonCard.tsx` | ✅ Keep | Best-practice component |
| `LoadingStates.tsx` | ✅ Keep | Multiple skeleton types |
| `skeleton.css` | ✅ Keep | Shimmer animation |
| `components/ui/loading-states/` | ❌ Skip | Duplicate |

**Action**: Copy `SkeletonCard.tsx`, `LoadingStates.tsx`, and `skeleton.css`.

---

### 🗺️ MAPS

**Current Implementation in Shadi-v2:**

```
lib/maps/
├── components/MapboxMap.tsx   # Mapbox GL wrapper
├── hooks/useGeolocation.ts    # Browser geolocation
├── utils/distance.ts          # Distance calculations
└── index.ts

features/restaurant/           # Uses MapboxMap in detail page
```

**What It Does:**
- Show restaurant location on map
- Get user's current location
- Calculate distance between points
- Markers for nearby restaurants

**Packages Required:**
- ✅ `mapbox-gl` ^3.18.1 - **KEEP**
- ✅ `@types/mapbox-gl` ^3.4.1 - **KEEP**

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `MapboxMap.tsx` | ✅ Keep | Restaurant location display |
| `useGeolocation.ts` | ✅ Keep | "Near Me" feature |
| `distance.ts` | ✅ Keep | Distance calculations |

**Action**: Copy entire `lib/maps/` folder.

---

### 🔔 TOAST NOTIFICATIONS

**Current Implementation in Shadi-v2:**

```typescript
import { toast } from "sonner"

// Usage
toast.success("Added to favorites")
toast.error("Failed to load")
```

**What It Does:**
- Success/error/info toasts
- Auto-dismiss after timeout
- Stack multiple toasts
- Custom icons

**Packages Required:**
- ✅ `sonner` ^2.0.7 - **KEEP**

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `sonner` package | ✅ Keep | Lightweight toast library |
| `Toaster` in layout | ✅ Keep | Render outlet for toasts |

**Action**: Keep `sonner` package. Add `<Toaster />` to root layout.

---

### 🎨 CAROUSEL

**Current Implementation in Shadi-v2:**

```
components/carousel/
└── index.ts                    # Embla-based carousel

components/card/variants/detailed.tsx   # Uses carousel
```

**What It Does:**
- Swipeable image gallery
- Auto-play with pause on hover
- Navigation dots
- Arrow buttons
- Touch-friendly

**Packages Required:**
- ✅ `embla-carousel-react` ^8.6.0 - **KEEP**

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `embla-carousel-react` | ✅ Keep | Used in card detailed variant |
| `carousel/index.ts` | ✅ Keep | Carousel wrapper |

**Action**: Copy `components/carousel/`. Keep `embla-carousel-react` package.

---

### 📊 ADMIN CHARTS

**Current Implementation in Shadi-v2:**

```
components/ui/charts/
├── BarChart.tsx         # Recharts bar chart
├── LineChart.tsx        # Recharts line chart
└── PieChart.tsx         # Recharts pie chart

features/admin/          # Uses charts in dashboard
```

**What It Does:**
- Analytics visualization
- Restaurant stats
- User engagement metrics

**Packages Required:**
- ✅ `recharts` ^3.6.0 - **SKIP** (admin will be rebuilt)

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `recharts` package | ❌ Skip | Admin only, will rebuild |
| `charts/` folder | ❌ Skip | Admin only |

**Action**: SKIP all chart components and `recharts` package. Admin will be built fresh later.

---

### 📝 RICH TEXT EDITOR

**Current Implementation in Shadi-v2:**

```
components/ui/rich-text-editor/
└── index.tsx                    # Quill-based editor

features/admin/                  # Used for content creation
```

**What It Does:**
- WYSIWYG text editing
- Blog post creation
- Restaurant descriptions

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| Rich text editor | ❌ Skip | Admin only, will rebuild |

**Action**: SKIP rich text editor. Admin will be built fresh later.

---

### 📤 FILE UPLOAD

**Current Implementation in Shadi-v2:**

```
components/ui/file-upload/
├── FileItem.tsx          # Uploaded file display
└── FileUpload.tsx        # Drag-drop upload

features/admin/           # Used for restaurant images
```

**What It Does:**
- Drag-and-drop file upload
- Image preview
- Progress tracking
- Multiple file support

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| File upload | ❌ Skip | Admin only, will rebuild |

**Action**: SKIP file upload components. Admin will be built fresh later.

---

### 📋 DATA TABLE

**Current Implementation in Shadi-v2:**

```
components/ui/data-table/
├── DataTable.tsx         # Sortable/filterable table
└── example.tsx           # Usage example

features/admin/           # Used for user/restaurant lists
```

**What It Does:**
- Sortable columns
- Filterable rows
- Pagination
- Row selection

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| Data table | ❌ Skip | Admin only, will rebuild |

**Action**: SKIP data table components. Admin will be built fresh later.

---

### 🎭 MODAL

**Current Implementation in Shadi-v2:**

```
components/ui/modal-dialog/
└── Modal.tsx             # Accessible modal
```

**What It Does:**
- ARIA-compliant modal
- Focus trap
- Escape to close
- Backdrop click to close

**Shadi.ae Decision:**

| Component | Keep? | Reason |
|-----------|-------|--------|
| `Modal.tsx` | ⚠️ Maybe | May need for confirm dialogs |

**Action**: **SKIP for v1**. Can add later if needed. Most modals are admin-only.

---

## 3. PACKAGE DECISION MATRIX

### ✅ KEEP (13 production + 6 dev)

| Package | Size | Why Keep |
|---------|------|----------|
| `@supabase/ssr` | 48 KB | Auth & database |
| `@tailwindcss/postcss` | 12 KB | Tailwind CSS |
| `blurhash` | 4 KB | Image placeholders |
| `clsx` | 1 KB | Class utils |
| `embla-carousel-react` | 9 KB | Image carousels |
| `lucide-react` | 120 KB* | Icons (tree-shakeable) |
| `mapbox-gl` | 380 KB | Maps |
| `next` | 4 MB | Framework |
| `postcss` | 35 KB | CSS processing |
| `react` | 130 KB | UI library |
| `react-dom` | 180 KB | React DOM |
| `sharp` | 650 KB** | Image optimization (dev only) |
| `sonner` | 3 KB | Toast notifications |
| `tailwind-merge` | 2 KB | Class merging |
| `tailwindcss` | 2.5 MB | Styling |
| `zod` | 65 KB | Validation |
| `@biomejs/biome` | 25 MB | Linting (dev only) |
| `@types/mapbox-gl` | - | Mapbox types |
| `@types/node` | - | Node types |
| `@types/react` | - | React types |
| `@types/react-dom` | - | React DOM types |
| `typescript` | 60 MB | TypeScript (dev only) |

\* Lucide icons are tree-shakeable, only used icons are bundled
\*\* Sharp is dev-only, not in production bundle

**Total Production Bundle**: ~3.5 MB (minified + gzipped ~250 KB)

---

### ❌ SKIP (5 packages)

| Package | Why Skip |
|---------|----------|
| `keen-slider` | Only in audit scripts |
| `recharts` | Admin only (will rebuild) |
| `critters` | SSR CSS optimization (not needed yet) |
| `dotenv` | Use Bun's built-in env |
| `ts-morph` | Only in audit scripts |

**Savings**: ~2.5 MB from production

---

### 🔁 FRESH INSTALL (2 packages)

| Package | Why Fresh |
|---------|-----------|
| `husky` | Set up fresh for new git hooks |
| `lint-staged` | Set up fresh for pre-commit |

---

## 4. COMPONENTS COPY DECISION

### ✅ COPY TO SHADI.AE

```
components/
├── icons/                    ✅ All Lucide icon exports
├── card/                     ✅ Entire folder (5 files)
├── filters/                  ✅ Entire folder (4 files)
├── search/                   ✅ SearchContainer.tsx
├── auth/                     ✅ Entire folder (3 files)
├── images/                   ✅ OptimizedImage.tsx
├── layout/
│   ├── Header.tsx           ✅ (simplified)
│   ├── SideMenu.tsx         ✅ (simplified)
│   ├── Footer.tsx           ✅ (simplified)
│   ├── ThemeModal.tsx       ✅ (2 modes only)
│   ├── LanguageToggle.tsx   ✅
│   └── ConditionalHeader.tsx ✅
├── ui/
│   ├── SkeletonCard.tsx     ✅
│   ├── Button.tsx           ✅
│   └── pwa-components/
│       ├── InstallPrompt.tsx ✅
│       └── OfflineBanner.tsx ✅
└── loading/                   ✅ LoadingStates.tsx

features/
└── restaurant/                ✅ RestaurantDetailClient.tsx

context/                       ✅ All 3 providers

lib/
├── supabase/                  ✅ All 4 files
├── locales/                   ✅ en.json, ar.json
├── maps/                      ✅ Entire folder
├── images/                    ✅ Entire folder
├── favorites/                 ✅ types.ts, useFavorites.ts
├── utils.ts                   ✅
├── filter-helpers.ts          ✅
├── routes.ts                  ✅
├── breakpoints.ts             ✅
├── i18n.ts                    ✅
├── storage.ts                 ✅
├── security/
│   ├── validation.ts         ✅
│   └── session.ts            ✅
└── __mock__/
    └── restaurants.ts        ✅ (modify for bilingual)

styles/
├── globals.css                ✅
├── tokens.css                 ✅
└── components/
    └── skeleton.css           ✅

app/
├── layout.tsx                 ✅
├── error.tsx                  ✅
├── not-found.tsx              ✅
├── (auth)/                    ✅ All auth routes
├── (marketing)/               ✅ privacy, terms
└── restaurants/               ✅ listing + [slug]
```

**Total Files to Copy**: ~60 files

---

### ❌ SKIP FROM SHADI.V2

```
components/
├── ui/
│   ├── Card.tsx              ❌ Duplicate (card/ folder exists)
│   ├── loading-states/       ❌ Duplicate (loading/ exists)
│   ├── charts/               ❌ Admin only
│   ├── rich-text-editor/     ❌ Admin only
│   ├── file-upload/          ❌ Admin only
│   ├── data-table/           ❌ Admin only
│   ├── modal-dialog/         ❌ Not needed for v1
│   └── pwa-components/
│       └── OfflineSupport.tsx ❌ Simplify version only
├── layout/
│   ├── DashboardLayout.tsx   ❌ Admin only
│   ├── ContextBar.tsx        ❌ Admin only
│   └── PageContainer.tsx     ❌ Not needed
├── tabs/                     ❌ Home/blog only
├── view-switcher/            ❌ Admin only
├── navigation/               ❌ Build fresh
└── carousel/                 ✅ KEEP (used in cards)

features/
├── admin/                    ❌ Rebuild later
├── home/                     ❌ Disabled
└── favorites/                ❌ Move to restaurant detail

lib/
├── security/
│   ├── audit.ts             ❌ Over-engineered
│   ├── headers.ts           ❌ Not needed
│   └── zero-trust.ts        ❌ Over-engineered
└── constants/
    └── page-content.ts      ❌ Maybe copy

app/
├── (dashboard)/             ❌ Rebuild later
├── blog/                    ❌ Disabled
├── favorites/               ❌ Merge into restaurants
├── nearby/                  ❌ Disabled
├── top-rated/               ❌ Disabled
├── settings/                ❌ Build later
├── dashboard/               ❌ Disabled
├── profile/                 ❌ Build later
├── profiles/                ❌ Disabled
├── business/                ❌ Disabled
├── pages/                   ❌ Disabled
├── blogger/                 ❌ Disabled
└── test/                    ❌ Test route
```

**Total Files to Skip**: ~200+ files

---

## 5. FINAL PACKAGE LIST FOR SHADI.AE

### package.json (Production Dependencies)

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@tailwindcss/postcss": "^4.1.18",
    "blurhash": "^2.0.5",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^0.562.0",
    "mapbox-gl": "^3.18.1",
    "next": "^16.1.1",
    "postcss": "^8.5.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "sharp": "^0.34.5",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^4.1.18",
    "zod": "^4.3.5"
  }
}
```

**Total**: 16 packages

### package.json (Dev Dependencies)

```json
{
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/mapbox-gl": "^3.4.1",
    "@types/node": "^25.0.9",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "husky": "^9.1.7",
    "lint-staged": "^15.5.2",
    "typescript": "^5.9.3"
  }
}
```

**Total**: 8 packages

---

## SUMMARY

### By The Numbers

| Metric | Count |
|--------|-------|
| **Production packages to keep** | 16 |
| **Production packages to skip** | 2 |
| **Dev packages to keep** | 6 |
| **Dev packages to skip** | 3 |
| **Dev packages to reinstall** | 2 |
| **Components to copy** | ~60 files |
| **Components to skip** | ~200 files |

### Key Features Included

✅ Security (validation, session)
✅ PWA (install prompt, offline detection)
✅ PPR (Suspense boundaries)
✅ Lazy loading (IntersectionObserver)
✅ Blurhash (image placeholders)
✅ Skeleton/shimmer (loading states)
✅ Maps (Mapbox GL)
✅ Toasts (Sonner)
✅ Carousel (Embla)
✅ i18n (custom implementation)
✅ Theme (light/dark modes)

### Key Features Excluded

❌ Admin dashboard (rebuild later)
❌ Charts (Recharts)
❌ Rich text editor
❌ File upload
❌ Data table
❌ Complex audit system
❌ Zero-trust security (simplified)
❌ Service worker (iOS issues)

---

**NEXT STEP**: Ready to proceed with Shadi.ae implementation using this package list and component map.
