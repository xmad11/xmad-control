# Shadi-v2 → Shadi.ae Migration Plan

> **Read-Only Plan**: No implementation yet. This document outlines the exact folder structure and file mapping for creating the new Shadi.ae project.

## Overview

**Source**: `/Users/ahmadabdullah/Projects/shadi-V2` (Keep untouched)
**Target**: `/Users/ahmadabdullah/Projects/Shadi.ae` (New clean project)

**Strategy**: Start fresh, copy only what's needed

---

## 1. PACKAGE DEPENDENCIES

### Shadi-v2 → Shadi.ae Dependency Map

#### REMOVE (Not Used in Active Routes):

```json
{
  "keen-slider": "^6.8.6",      // ❌ Only in audit scripts
  "recharts": "^3.6.0",         // ❌ Only in admin (will rebuild)
  "critters": "^0.0.25",        // ❌ SSR CSS optimization (not needed yet)
  "ts-morph": "^27.0.2",        // ❌ Only in audit scripts
  "dotenv": "^17.2.3",          // ❌ Use Bun's built-in env
  "husky": "^9.1.7",            // ❌ Will set up fresh
  "lint-staged": "^15.5.2"      // ❌ Will set up fresh
}
```

#### KEEP (Core Dependencies):

```json
{
  "@supabase/ssr": "^0.8.0",          // ✅ Auth
  "@tailwindcss/postcss": "^4.1.18",  // ✅ Styling
  "blurhash": "^2.0.5",               // ✅ Image placeholders
  "clsx": "^2.1.1",                   // ✅ Class merging
  "embla-carousel-react": "^8.6.0",   // ✅ Card carousels
  "lucide-react": "^0.562.0",         // ✅ Icons
  "mapbox-gl": "^3.18.1",             // ✅ Maps
  "next": "^16.1.1",                  // ✅ Framework
  "postcss": "^8.5.6",                // ✅ Tailwind dependency
  "react": "^19.2.3",                 // ✅ Framework
  "react-dom": "^19.2.3",             // ✅ Framework
  "sharp": "^0.34.5",                 // ✅ Image optimization
  "sonner": "^2.0.7",                 // ✅ Toast notifications
  "tailwind-merge": "^3.4.0",         // ✅ Class merging
  "tailwindcss": "^4.1.18",           // ✅ Styling
  "zod": "^4.3.5"                     // ✅ Validation
}
```

#### KEEP (Dev Dependencies):

```json
{
  "@biomejs/biome": "^1.9.4",         // ✅ Linting (ESLint removed)
  "@types/mapbox-gl": "^3.4.1",       // ✅ Map types
  "@types/node": "^25.0.9",           // ✅ Node types
  "@types/react": "^19.2.7",          // ✅ React types
  "@types/react-dom": "^19.2.3",      // ✅ React DOM types
  "typescript": "^5.9.3"              // ✅ TypeScript
}
```

---

## 2. EXACT FOLDER STRUCTURE MAPPING

### Root Level Files

```
Shadi-v2/                          Shadi.ae/
─────────────────────────────────────────────────────────────────
├── package.json            →      ├── package.json (minimal)
├── biome.json              →      ├── biome.json (simplified)
├── tsconfig.json           →      ├── tsconfig.json
├── next.config.mjs         →      ├── next.config.mjs (simplified)
├── tailwind.config.ts      →      ├── tailwind.config.ts
├── postcss.config.mjs      →      ├── postcss.config.mjs
├── middleware.ts           →      ├── middleware.ts (simplified)
├── .env.local              →      ├── .env.local (copy from Shadi-v2)
├── .gitignore              →      ├── .gitignore (fresh)
├── CLAUDE.md               →      ├── CLAUDE.md (simplified)
├── README.md               →      ├── README.md (fresh)
└── vercel.json             →      └── vercel.json (fresh)
```

### App Directory (Routes)

```
Shadi-v2/app/                      Shadi.ae/app/
─────────────────────────────────────────────────────────────────
├── layout.tsx              →      ├── layout.tsx (keep, simplify)
├── error.tsx               →      ├── error.tsx (keep)
├── not-found.tsx           →      ├── not-found.tsx (keep)
│
├── (marketing)/                   ├── (marketing)/
│   ├── privacy/page.tsx    →      │   ├── privacy/page.tsx ✅
│   ├── terms/page.tsx      →      │   └── terms/page.tsx ✅
│   ├── layout.tsx          →      │   └── layout.tsx (minimal)
│   └── page.tsx            →      ❌ SKIP (use /restaurants as home)
│
├── (auth)/                         ├── (auth)/
│   ├── layout.tsx          →      │   ├── layout.tsx ✅
│   ├── login/page.tsx      →      │   ├── login/page.tsx ✅
│   ├── register/page.tsx   →      │   ├── register/page.tsx ✅
│   └── forgot-password/    →      │   └── forgot-password/
│       └── page.tsx        →      │       └── page.tsx ✅
│
├── (dashboard)/                   ❌ SKIP (build fresh admin)
│
├── restaurants/                    ├── restaurants/
│   ├── page.tsx            →      │   ├── page.tsx ✅
│   └── [slug]/             →      │   └── [slug]/
│       └── page.tsx        →      │       └── page.tsx ✅
│
├── favorites/                     ❌ SKIP (move to /restaurants?favorites)
│
├── blog/                          ❌ SKIP (disabled)
├── nearby/                        ❌ SKIP (disabled)
├── top-rated/                     ❌ SKIP (disabled)
├── settings/                      ❌ SKIP (disabled)
├── dashboard/                     ❌ SKIP (disabled)
├── profile/                       ❌ SKIP (disabled)
├── profiles/                      ❌ SKIP (disabled)
├── business/                      ❌ SKIP (disabled)
├── pages/                         ❌ SKIP (disabled)
├── blogger/                       ❌ SKIP (disabled)
└── test/                          ❌ SKIP (disabled)

├── api/                           ❌ SKIP (no API routes yet)
└── auth/                          ❌ SKIP (Supabase SSR handles this)
```

### Components Directory

```
Shadi-v2/components/                Shadi.ae/components/
─────────────────────────────────────────────────────────────────
├── icons/                  →      ├── icons/ ✅ (all Lucide icons)
│
├── card/                          ├── card/
│   ├── Card.tsx           →      │   ├── Card.tsx ✅
│   ├── CardContent.tsx    →      │   ├── CardContent.tsx ✅
│   ├── CardMedia.tsx      →      │   ├── CardMedia.tsx ✅
│   ├── BaseCard.tsx       →      │   ├── BaseCard.tsx ✅
│   ├── RestaurantCard.tsx →      │   ├── RestaurantCard.tsx ✅
│   ├── BlogCard.tsx       →      │   ├── BlogCard.tsx ❌ SKIP
│   └── variants/                 │   └── variants/
│       ├── list.tsx        →      │       ├── list.tsx ✅
│       ├── detailed.tsx    →      │       ├── detailed.tsx ✅
│       ├── compact.tsx     →      │       ├── compact.tsx ✅
│       └── image.tsx       →      │       └── image.tsx ✅
│
├── filters/                       ├── filters/
│   ├── FilterBar.tsx       →      │   ├── FilterBar.tsx ✅
│   ├── FilterOptionChip.tsx→      │   ├── FilterOptionChip.tsx ✅
│   ├── CuisineCategoryChip.tsx→   │   ├── CuisineCategoryChip.tsx ✅
│   └── FilterPillButton.tsx→      │   └── FilterPillButton.tsx ✅
│
├── search/                        ├── search/
│   └── SearchContainer.tsx →      │   └── SearchContainer.tsx ✅
│
├── layout/                        ├── layout/
│   ├── Header.tsx         →      │   ├── Header.tsx ✅ (simplified)
│   ├── SideMenu.tsx       →      │   ├── SideMenu.tsx ✅
│   ├── Footer.tsx         →      │   ├── Footer.tsx ✅ (simplified)
│   ├── ThemeModal.tsx     →      │   ├── ThemeModal.tsx ✅
│   ├── LanguageToggle.tsx →      │   ├── LanguageToggle.tsx ✅
│   ├── ConditionalHeader.tsx→     │   └── ConditionalHeader.tsx ✅
│   ├── DashboardLayout.tsx→      │   ❌ SKIP
│   ├── ContextBar.tsx     →      │   ❌ SKIP
│   └── PageContainer.tsx  →      │   ❌ SKIP
│
├── auth/                          ├── auth/
│   ├── AuthHeader.tsx     →      │   ├── AuthHeader.tsx ✅
│   ├── SocialGoogleButton.tsx→    │   ├── SocialGoogleButton.tsx ✅
│   └── AuthShell.tsx      →      │   └── AuthShell.tsx ✅
│
├── images/                        ├── images/
│   └── OptimizedImage.tsx →      │   └── OptimizedImage.tsx ✅
│
├── ui/                            ❌ SKIP (build from components/card/)
│   ├── Card.tsx                  │   (Card already exists in /card)
│   ├── Button.tsx                │   (Build simple Button component)
│   ├── modal-dialog/              │   (Build if needed)
│   ├── rich-text-editor/          │   ❌ SKIP (admin only)
│   ├── file-upload/               │   ❌ SKIP (admin only)
│   ├── data-table/                │   ❌ SKIP (admin only)
│   ├── charts/                    │   ❌ SKIP (admin only)
│   └── pwa-components/            │   (Keep for later PWA)
│
├── tabs/                          ❌ SKIP (used in home/blog only)
├── view-switcher/                 ❌ SKIP (admin only)
├── navigation/                    ❌ SKIP (build fresh)
├── loading/                       ❌ SKIP (build fresh)
└── types.ts                →      └── types.ts ✅
```

### Features Directory

```
Shadi-v2/features/                  Shadi.ae/features/
─────────────────────────────────────────────────────────────────
├── restaurant/                    ├── restaurant/
│   └── RestaurantDetailClient.tsx→│   └── RestaurantDetailClient.tsx ✅
│
├── favorites/                     ❌ SKIP (move to restaurant detail)
│
├── admin/                         ❌ SKIP (build fresh admin)
│
├── home/                          ❌ SKIP (disabled)
│
└── blog/                          ❌ SKIP (disabled)
```

### Context Directory

```
Shadi-v2/context/                   Shadi.ae/context/
─────────────────────────────────────────────────────────────────
├── UserContext.tsx         →      ├── UserContext.tsx ✅
├── ThemeContext.tsx        →      ├── ThemeContext.tsx ✅ (simplify to 2 modes)
├── LanguageContext.tsx     →      └── LanguageContext.tsx ✅
```

### Lib Directory

```
Shadi-v2/lib/                       Shadi.ae/lib/
─────────────────────────────────────────────────────────────────
├── supabase/                      ├── supabase/
│   ├── client.ts          →      │   ├── client.ts ✅
│   ├── server.ts          →      │   ├── server.ts ✅
│   ├── auth.ts            →      │   ├── auth.ts ✅
│   └── index.ts           →      │   └── index.ts ✅
│
├── locales/                       ├── locales/
│   ├── en.json            →      │   ├── en.json ✅
│   └── ar.json            →      │   └── ar.json ✅
│
├── maps/                          ├── maps/
│   ├── components/        →      │   ├── components/ ✅
│   │   └── MapboxMap.tsx  │       │       └── MapboxMap.tsx
│   ├── hooks/             →      │   └── hooks/ ✅
│   │       └── useGeolocation.ts  │       └── useGeolocation.ts
│   ├── utils/             →      │   └── utils/ ✅
│   │       └── distance.ts        │       └── distance.ts
│   └── index.ts           →      │   └── index.ts
│
├── images/                        ├── images/
│   ├── decode-blurhash.ts →      │   ├── decode-blurhash.ts ✅
│   ├── image-loader.ts    →      │   ├── image-loader.ts ✅
│   ├── precomputed-blurhash.ts→  │   ├── precomputed-blurhash.ts ✅
│   ├── image-tokens.ts    →      │   ├── image-tokens.ts ✅
│   ├── generate-blurhash.ts→     │   ├── generate-blurhash.ts ✅
│   └── index.ts           →      │   └── index.ts
│
├── favorites/                     ❌ SKIP (move to lib/)
│   ├── types.ts            →      │   └── types.ts ✅ (move to lib/favorites.ts)
│   ├── useFavorites.ts     →      │   └── useFavorites.ts ✅ (move to lib/)
│   └── index.ts            →      │
│
├── utils.ts                →      ├── utils.ts ✅
├── filter-helpers.ts       →      ├── filter-helpers.ts ✅
├── routes.ts               →      ├── routes.ts ✅ (simplify)
├── breakpoints.ts          →      ├── breakpoints.ts ✅
├── i18n.ts                 →      ├── i18n.ts ✅
├── storage.ts              →      ├── storage.ts ✅
│
├── security/                      ❌ SKIP (over-engineered for v1)
│
├── constants/                    ├── constants/
│   └── page-content.ts    →      │   └── page-content.ts ✅
│
└── __mock__/                     └── __mock__/
    └── restaurants.ts     →          └── restaurants.ts ✅ (modify for bilingual)
```

### Styles Directory

```
Shadi-v2/styles/                    Shadi.ae/styles/
─────────────────────────────────────────────────────────────────
├── globals.css              →      ├── globals.css ✅
├── tokens.css               →      ├── tokens.css ✅ (keep all)
└── tailwind.css             →      ❌ SKIP (merged into globals.css)
```

### Documentation (SKIP for v1)

```
Shadi-v2/documentation/              ❌ SKIP (keep in Shadi-v2 only)
Shadi-v2/docs/                       ❌ SKIP (keep in Shadi-v2 only)
Shadi-v2/archive/                    ❌ SKIP (keep in Shadi-v2 only)
```

### Scripts (SKIP for v1)

```
Shadi-v2/scripts/                    ❌ SKIP (audit system not needed yet)
```

---

## 3. CRITICAL MODIFICATIONS DURING COPY

### Theme Simplification

**File**: `context/ThemeContext.tsx`

**Before** (3 modes):
```typescript
type ThemeMode = "light" | "dark" | "warm"
```

**After** (2 modes):
```typescript
type ThemeMode = "light" | "dark"
```

Remove all `warm` mode logic from the component.

### Bilingual Restaurant Data

**File**: `lib/__mock__/restaurants.ts`

**Before**:
```typescript
interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  // ... single language
}
```

**After**:
```typescript
interface Restaurant {
  id: string
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  cuisine: {
    en: string
    ar: string
  }
  // ... bilingual
}
```

### Side Menu Simplification

**File**: `components/layout/SideMenu.tsx`

**Remove**:
- Dashboard nav items (owner/admin only)
- Settings nav items (build later)
- Profile nav items (build later)

**Keep**:
- Restaurants
- Search
- Favorites (link to /restaurants?favorites)
- Theme toggle
- Language toggle
- Sign In/Out

### Header Simplification

**File**: `components/layout/Header.tsx`

**Remove**:
- Blog link
- Nearby link
- Profile link

**Keep**:
- Logo (links to /restaurants)
- Menu toggle
- Favorites link (if authenticated)

---

## 4. CONFIGURATION FILE CHANGES

### biome.json (Simplified)

**Remove**:
- All ESLint-related overrides
- Complex ignore patterns
- Audit-specific rules

**Keep**:
- Basic lint rules
- Formatter configuration
- TypeScript rules

### next.config.mjs (Simplified)

**Remove**:
- i18n config (use custom implementation)
- PWA config (add later)
- Image domains (keep only needed)

**Keep**:
- Basic Next.js config
- Experimental features

### middleware.ts (Simplified)

**Remove**:
- Disabled route protection
- Blog/admin middleware
- Complex session checks

**Keep**:
- Auth redirect logic
- Public route handling

---

## 5. COPY ORDER (Step-by-Step)

### Phase 1: Project Setup
```bash
# 1. Create new project
mkdir Shadi.ae
cd Shadi.ae

# 2. Initialize package.json (minimal)
bun init -y

# 3. Install core dependencies
bun add next@latest react@latest react-dom@latest
bun add -d @biomejs/biome typescript @types/react @types/node

# 4. Create initial structure
mkdir -p app components context lib styles
```

### Phase 2: Config Files
```bash
# Copy and modify config files
cp ../Shadi-v2/biome.json ./biome.json
cp ../Shadi-v2/tsconfig.json ./tsconfig.json
cp ../Shadi-v2/next.config.mjs ./next.config.mjs
cp ../Shadi-v2/postcss.config.mjs ./postcss.config.mjs
cp ../Shadi-v2/tailwind.config.ts ./tailwind.config.ts
```

### Phase 3: Core Dependencies
```bash
# Add remaining core dependencies
bun add @supabase/ssr blurhash clsx embla-carousel-react lucide-react \
        mapbox-gl sharp sonner tailwind-merge tailwindcss zod
bun add -d @types/mapbox-gl @types/react-dom
```

### Phase 4: Styles
```bash
# Copy styles
cp -r ../Shadi-v2/styles .
```

### Phase 5: Context
```bash
# Copy context providers
cp ../Shadi-v2/context/UserContext.tsx ./context/
cp ../Shadi-v2/context/ThemeContext.tsx ./context/  # Then simplify
cp ../Shadi-v2/context/LanguageContext.tsx ./context/
```

### Phase 6: Lib (Core)
```bash
# Copy lib files
cp ../Shadi-v2/lib/utils.ts ./lib/
cp ../Shadi-v2/lib/filter-helpers.ts ./lib/
cp ../Shadi-v2/lib/routes.ts ./lib/
cp ../Shadi-v2/lib/breakpoints.ts ./lib/
cp ../Shadi-v2/lib/i18n.ts ./lib/
cp ../Shadi-v2/lib/storage.ts ./lib/

# Copy supabase
mkdir lib/supabase
cp ../Shadi-v2/lib/supabase/*.ts ./lib/supabase/

# Copy locales
mkdir lib/locales
cp ../Shadi-v2/lib/locales/*.json ./lib/locales/

# Copy images
mkdir lib/images
cp ../Shadi-v2/lib/images/*.ts ./lib/images/

# Copy maps
mkdir -p lib/maps/{components,hooks,utils}
cp ../Shadi-v2/lib/maps/components/* ./lib/maps/components/
cp ../Shadi-v2/lib/maps/hooks/* ./lib/maps/hooks/
cp ../Shadi-v2/lib/maps/utils/* ./lib/maps/utils/
cp ../Shadi-v2/lib/maps/index.ts ./lib/maps/

# Copy favorites (simplified)
cp ../Shadi-v2/lib/favorites/*.ts ./lib/
```

### Phase 7: Components (Core)
```bash
# Copy icons
cp -r ../Shadi-v2/components/icons ./components/

# Copy card system
cp -r ../Shadi-v2/components/card ./components/

# Copy filters
cp -r ../Shadi-v2/components/filters ./components/

# Copy search
mkdir components/search
cp ../Shadi-v2/components/search/SearchContainer.tsx ./components/search/

# Copy layout (selected)
cp ../Shadi-v2/components/layout/Header.tsx ./components/layout/
cp ../Shadi-v2/components/layout/SideMenu.tsx ./components/layout/
cp ../Shadi-v2/components/layout/Footer.tsx ./components/layout/
cp ../Shadi-v2/components/layout/ThemeModal.tsx ./components/layout/
cp ../Shadi-v2/components/layout/LanguageToggle.tsx ./components/layout/
cp ../Shadi-v2/components/layout/ConditionalHeader.tsx ./components/layout/

# Copy auth
cp -r ../Shadi-v2/components/auth ./components/

# Copy images
mkdir components/images
cp ../Shadi-v2/components/images/OptimizedImage.tsx ./components/images/

# Copy types
cp ../Shadi-v2/components/types.ts ./components/
```

### Phase 8: Features
```bash
# Copy restaurant detail
mkdir -p features/restaurant
cp ../Shadi-v2/features/restaurant/RestaurantDetailClient.tsx ./features/restaurant/
```

### Phase 9: App (Routes)
```bash
# Copy root files
cp ../Shadi-v2/app/layout.tsx ./app/
cp ../Shadi-v2/app/error.tsx ./app/
cp ../Shadi-v2/app/not-found.tsx ./app/
cp ../Shadi-v2/app/middleware.ts ./

# Copy marketing routes
mkdir -p app/\(marketing\)
cp ../Shadi-v2/app/\(marketing\)/layout.tsx ./app/\(marketing\)/
cp ../Shadi-v2/app/\(marketing\)/privacy/page.tsx ./app/\(marketing\)/privacy/
cp ../Shadi-v2/app/\(marketing\)/terms/page.tsx ./app/\(marketing\)/terms/

# Copy auth routes
mkdir -p app/\(auth\)
cp ../Shadi-v2/app/\(auth\)/layout.tsx ./app/\(auth\)/
cp ../Shadi-v2/app/\(auth\)/login/page.tsx ./app/\(auth\)/login/
cp ../Shadi-v2/app/\(auth\)/register/page.tsx ./app/\(auth\)/register/
cp ../Shadi-v2/app/\(auth\)/forgot-password/page.tsx ./app/\(auth\)/forgot-password/

# Copy restaurants
mkdir -p app/restaurants
cp ../Shadi-v2/app/restaurants/page.tsx ./app/restaurants/
mkdir -p app/restaurants/\[slug\]
cp ../Shadi-v2/app/restaurants/\[slug\]/page.tsx ./app/restaurants/\[slug\]/
```

### Phase 10: Environment & Assets
```bash
# Copy environment
cp ../Shadi-v2/.env.local ./.env.local

# Copy images
mkdir -p public/images
cp ../Shadi-v2/public/images/* ./public/images/  # Review first
```

### Phase 11: Post-Copy Modifications

```bash
# 1. Simplify ThemeContext (remove warm mode)
# 2. Modify restaurant data for bilingual
# 3. Simplify SideMenu navigation items
# 4. Simplify Header (remove blog, nearby links)
# 5. Update biome.json (remove audit rules)
# 6. Update next.config.mjs (remove PWA, simplify i18n)
# 7. Update middleware.ts (remove disabled routes)
# 8. Run biome check --write
# 9. Test build: bun run build
```

---

## 6. POST-COPY CHECKLIST

### Code Modifications (Manual)

- [ ] **ThemeContext.tsx**: Remove `warm` mode option
- [ ] **restaurants.ts**: Change to bilingual data structure
- [ ] **SideMenu.tsx**: Remove dashboard/settings/profile nav items
- [ ] **Header.tsx**: Remove blog/nearby/profile links
- [ ] **biome.json**: Remove audit-specific rules
- [ ] **next.config.mjs**: Simplify i18n config
- [ ] **middleware.ts**: Remove disabled route protection

### Import Path Updates

After copying, update imports in copied files:

```typescript
// Remove unused imports
import { Marquee } from "@/components/marquee"  // ❌ DELETE
import { AdminDashboard } from "@/features/admin"  // ❌ DELETE

// Keep only used imports
import { RestaurantCard } from "@/components/card"  // ✅ KEEP
```

### Test Build

```bash
# 1. Type check
bun run check:ts

# 2. Biome check
bun run biome check

# 3. Build
bun run build

# 4. Start dev server
bun run dev
```

---

## 7. FINAL PROJECT STRUCTURE

```
Shadi.ae/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (marketing)/
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── restaurants/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── layout.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── auth/
│   ├── card/
│   ├── filters/
│   ├── icons/
│   ├── images/
│   ├── layout/
│   ├── search/
│   └── types.ts
├── context/
│   ├── UserContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── features/
│   └── restaurant/
│       └── RestaurantDetailClient.tsx
├── lib/
│   ├── favorites/
│   ├── images/
│   ├── locales/
│   ├── maps/
│   ├── supabase/
│   ├── utils.ts
│   ├── filter-helpers.ts
│   ├── routes.ts
│   ├── breakpoints.ts
│   ├── i18n.ts
│   └── storage.ts
├── styles/
│   ├── globals.css
│   └── tokens.css
├── biome.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── middleware.ts
```

---

## 8. SUMMARY

### Files to Copy: ~60 files
### Files to Skip: ~200+ files
### Dependencies to Remove: 6 packages
### Dependencies to Keep: 15 packages

### Estimated Time: 2-3 hours

This plan creates a minimal, clean Shadi.ae project with:
- Only active routes (restaurants, auth, privacy, terms)
- Bilingual restaurant data structure
- Simplified theme (light/dark only)
- Biome-only linting (no ESLint)
- All unnecessary code removed

---

**NEXT STEP**: Do you want me to proceed with the copy implementation, or would you like to review/modify this plan first?
