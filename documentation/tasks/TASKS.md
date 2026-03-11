# 🚀 Shadi V2 Platform - Development Roadmap & Tasks

> **Last Updated:** 2026-01-02
> **Status:** In Progress
> **Version:** 2.0.0
> **Purpose:** Single Source of Truth (SSOT) for all platform development tasks

---

## 📋 How to Use This Document

- ✅ **Check the box** when a task is completed
- 🔴 **Critical** = Must fix before proceeding (blocks users or causes errors)
- 🟡 **Medium** = Important but not blocking (affects UX)
- 🟢 **Low** = Nice to have (enhancements)
- ℹ️ **Info** = For reference, no action needed

---

## 📊 Current Implementation Status

### Completed Features ✅

| Feature | Status | Notes |
|---------|--------|-------|
| **Home Page** | ✅ Complete | Hero, marquee, tabs, sections all functional |
| **Hero Section** | ✅ Complete | Morphing text, typing animation, 3D marquee (desktop) |
| **Home Tabs** | ✅ Complete | For You, Places, Stories with tab switching |
| **Marquee System** | ✅ Complete | Horizontal (mobile), Vertical-3D (desktop) |
| **Theme System** | ✅ Complete | Light/Warm/Dark modes, 5 accent colors |
| **Card System** | ✅ Complete | BaseCard with 4 variants (mini/standard/rich/full) |
| **Dashboards** | ✅ Complete | User, Owner, Admin dashboards with layouts |
| **Settings Page** | ✅ Complete | Theme, notification, preference toggles |
| **Profile Page** | ✅ Complete | User info, stats, edit functionality |
| **Blog System** | ✅ Complete | Listing, detail, search, categories |
| **Restaurant System** | ✅ Complete | Listing, detail pages with actions |
| **Header/Navigation** | ✅ Complete | Responsive, sticky, theme toggle, profile |
| **SideMenu** | ✅ Complete | Role-based navigation, mobile-friendly |
| **Design Tokens** | ✅ Complete | Comprehensive CSS variable system |
| **Audit System** | ✅ Complete | 5-layer audit (00, 03, 04, 07.5, 08) |
| **Deployment** | ✅ Complete | Vercel auto-deploy configured |

### Known Issues & Missing Features ⚠️

| Issue | Priority | Impact |
|-------|----------|--------|
| **Broken Navigation Links** | 🔴 Critical | Users clicking dead links (nearby, favorites, etc.) |
| **Missing Auth Pages** | 🔴 Critical | Login/Register forms not functional (no backend) |
| **No Backend Integration** | 🔴 Critical | All data is mock, no real API calls |
| **No Authentication** | 🔴 Critical | No login/session management |
| **Missing Error Boundaries** | 🟡 Medium | No error.tsx for some routes |
| **Console Warnings** | 🟡 Low | Some deprecated components exist |

---

# 📦 CATEGORY 0: PREFLIGHT (COMPLETED ✅)

> **Status:** ALL COMPLETED
> **Completed Date:** 2026-01-02
> These foundational tasks are done and verified.

## ✅ 0.0 GENERAL PREFLIGHT - COMPLETED

- [x] **0.0.1.1** ✅ Dependencies audited - All packages in use
- [x] **0.0.1.2** ✅ Dependencies updated - Latest compatible versions
- [x] **0.0.1.3** ✅ TypeScript configuration verified - `strict: true` enabled
- [x] **0.0.1.4** ✅ Biome configuration verified - Linting working
- [x] **0.0.2.1** ✅ Build errors fixed - `bun run build` passes
- [x] **0.0.2.2** ✅ TypeScript errors fixed - `bunx tsc --noEmit` passes
- [x] **0.0.2.3** ✅ Production build tested - Runs correctly
- [x] **0.0.4.1** ✅ CSS variables consistent - Design tokens used throughout
- [x] **0.0.4.2** ✅ All design tokens defined - Complete token system in `styles/tokens.css`

---

# 🔴 CATEGORY 1: CRITICAL FIXES (BLOCKING ISSUES)

> **Priority:** MUST COMPLETE FIRST
> **Estimated Time:** 2-3 days
> These issues cause broken user experience and must be fixed before any new features.

---

## PHASE 1: Navigation & Link Fixes (Day 1)

### Section 1.1: Fix Broken SideMenu Links

- [ ] **1.1.1** 🔴 Fix "Near Me" navigation
  - [ ] **1.1.1.1** Choose approach:
    - Option A: Create `/app/nearby/page.tsx` (geolocation-based restaurants)
    - Option B: Remove from SideMenu (if not MVP feature)
  - [ ] **1.1.1.2** If creating: Use `navigator.geolocation` API
  - [ ] **1.1.1.3** Add loading state while getting location
  - [ ] **1.1.1.4** Add permission denied fallback
  - [ ] **1.1.1.5** Sort restaurants by distance
  - **File:** `components/layout/SideMenu.tsx:45`

- [ ] **1.1.2** 🔴 Fix "Top Rated" navigation
  - [ ] **1.1.2.1** Choose approach:
    - Option A: Create `/app/top-rated/page.tsx` (filtered restaurants)
    - Option B: Remove from SideMenu
  - [ ] **1.1.2.2** If creating: Filter by rating >= 4.5
  - [ ] **1.1.2.3** Sort by rating descending
  - **File:** `components/layout/SideMenu.tsx:46`

- [ ] **1.1.3** 🔴 Fix "Favorites" navigation
  - [ ] **1.1.3.1** Create `/app/favorites/page.tsx`
  - [ ] **1.1.3.2** Add tab navigation (Restaurants / Blogs)
  - [ ] **1.1.3.3** Display favorited items (from localStorage for now)
  - [ ] **1.1.3.4** Add empty state illustration
  - [ ] **1.1.3.5** Add remove from favorite action
  - **File:** `components/layout/SideMenu.tsx:47`

- [ ] **1.1.4** 🟡 Fix "Language" navigation
  - [ ] **1.1.4.1** Either: Create `/app/language/page.tsx` for language selection
  - [ ] **1.1.4.2** Or: Remove from SideMenu (if out of scope)
  - **File:** `components/layout/SideMenu.tsx:53`

### Section 1.2: Fix Auth Page Links

- [ ] **1.2.1** 🔴 Fix Login page "Forgot Password?" link
  - [ ] **1.2.1.1** Create `/app/(auth)/forgot-password/page.tsx`
  - [ ] **1.2.1.2** Add email input form
  - [ ] **1.2.1.3** Add form validation
  - [ ] **1.2.1.4** Add success state ("Check your email")
  - [ ] **1.2.1.5** Style consistently with login page
  - **File:** `app/(auth)/login/page.tsx:75`

- [ ] **1.2.2** 🟡 Fix Register page legal links
  - [ ] **1.2.2.1** Create `/app/(marketing)/terms/page.tsx`
  - [ ] **1.2.2.2** Create `/app/(marketing)/privacy/page.tsx`
  - [ ] **1.2.2.3** Add basic legal content (can be template for now)
  - [ ] **1.2.2.4** Update register page links
  - **Files:** `app/(auth)/register/page.tsx:140,144`

### Section 1.3: Fix Home Section Links

- [ ] **1.3.1** 🟡 Fix "Editor's Picks" showMoreHref
  - [ ] **1.3.1.1** Either: Create `/app/editors-picks/page.tsx`
  - [ ] **1.3.1.2** Or: Remove `showMoreHref` prop if not needed
  - **File:** `features/home/sections/ForYouSections.tsx:101`

- [ ] **1.3.2** 🟡 Fix "Exclusive Offers" showMoreHref
  - [ ] **1.3.2.1** Either: Create `/app/exclusive/page.tsx`
  - [ ] **1.3.2.2** Or: Remove `showMoreHref` prop if not needed
  - **File:** `features/home/sections/ForYouSections.tsx:138`

---

## PHASE 2: Error Boundaries (Day 1-2)

### Section 1.4: Add Missing Error Boundaries

- [ ] **1.4.1** 🟡 Create error boundaries for all routes
  - [ ] **1.4.1.1** Create `app/blog/error.tsx`
  - [ ] **1.4.1.2** Create `app/blog/[slug]/error.tsx`
  - [ ] **1.4.1.3** Create `app/restaurants/error.tsx`
  - [ ] **1.4.1.4** Create `app/restaurants/[slug]/error.tsx`
  - [ ] **1.4.1.5** Create `app/(dashboard)/user/error.tsx`
  - [ ] **1.4.1.6** Create `app/(dashboard)/owner/error.tsx`
  - [ ] **1.4.1.7** Create `app/(dashboard)/admin/error.tsx`
  - [ ] **1.4.1.8** Test by throwing errors

---

## PHASE 3: Form Setup (Day 2-3)

### Section 1.5: Install Form Validation Library

- [ ] **1.5.1** 🔴 Install form dependencies
  ```bash
  bun add react-hook-form zod @hookform/resolvers
  ```

- [ ] **1.5.2** 🔴 Create shared form components
  - [ ] **1.5.2.1** Create `components/form/Input.tsx`
  - [ ] **1.5.2.2** Create `components/form/Select.tsx`
  - [ ] **1.5.2.3** Create `components/form/Checkbox.tsx`
  - [ ] **1.5.2.4** Create `components/form/FormError.tsx`
  - [ ] **1.5.2.5** Create `components/form/FormLabel.tsx`

- [ ] **1.5.3** 🔴 Create validation schemas
  - [ ] **1.5.3.1** Create `lib/validations/auth.ts` (email, password, name)
  - [ ] **1.5.3.2** Create `lib/validations/restaurant.ts`
  - [ ] **1.5.3.3** Create `lib/validations/review.ts`
  - [ ] **1.5.3.4** Create `lib/validations/reservation.ts`

---

# 🎨 CATEGORY 2: FRONTEND ENHANCEMENTS

> **Priority:** Important for UX
> **Estimated Time:** 1-2 weeks
> Polish existing features, improve user experience

---

## PHASE 1: Interactive Features (Week 1)

### Section 2.1: Favorites System (UI)

- [ ] **2.1.1** 🔴 Implement favorite toggle with localStorage
  - [ ] **2.1.1.1** Update `RestaurantCard.tsx` to save to localStorage
  - [ ] **2.1.1.2** Update `BlogCard.tsx` to save to localStorage
  - [ ] **2.1.1.3** Add optimistic UI updates
  - [ ] **2.1.1.4** Add error handling
  - **Note:** Prepare for backend sync later

### Section 2.2: Search Functionality

- [ ] **2.2.1** 🔴 Implement search UI (prepare for backend)
  - [ ] **2.2.1.1** Update `HomeSearch.tsx` with input state
  - [ ] **2.2.1.2** Add search debouncing (300ms)
  - [ ] **2.2.1.3** Add loading state
  - [ ] **2.2.1.4** Add clear search button
  - **Note:** Actual search will work after backend integration

### Section 2.3: Filter System

- [ ] **2.3.1** 🟡 Implement filter UI state
  - [ ] **2.3.1.1** Create `hooks/useFilters.ts`
  - [ ] **2.3.1.2** Make filter buttons clickable
  - [ ] **2.3.1.3** Add active state styling
  - [ ] **2.3.1.4** Add clear all filters button
  - **Note:** Actual filtering will work after backend integration

### Section 2.4: Settings Page Persistence

- [ ] **2.4.1** 🔴 Connect all settings to localStorage
  - [ ] **2.4.1.1** Create `hooks/useSettings.ts`
  - [ ] **2.4.1.2** Persist theme preferences
  - [ ] **2.4.1.3** Persist notification preferences
  - [ ] **2.4.1.4** Persist dietary preferences (Halal, etc.)

---

## PHASE 2: Restaurant Features (Week 2)

### Section 2.5: Restaurant Actions (UI Only)

- [ ] **2.5.1** 🟡 Reserve Table Modal
  - [ ] **2.5.1.1** Create reservation modal component
  - [ ] **2.5.1.2** Add form fields (date, time, party size)
  - [ ] **2.5.1.3** Add form validation
  - [ ] **2.5.1.4** Prepare for backend integration

- [ ] **2.5.2** 🟡 Get Directions Button
  - [ ] **2.5.2.1** Link to Google Maps with coordinates
  - [ ] **2.5.2.2** Fallback to address search

- [ ] **2.5.3** 🟡 Share Button
  - [ ] **2.5.3.1** Copy URL to clipboard
  - [ ] **2.5.3.2** Show toast notification
  - [ ] **2.5.3.3** Add Web Share API for mobile

---

## PHASE 3: Polish & Performance (Week 2)

### Section 2.6: Loading States

- [ ] **2.6.1** 🟡 Create skeleton components
  - [ ] **2.6.1.1** Create `components/loading/CardSkeleton.tsx`
  - [ ] **2.6.1.2** Create `components/loading/ListSkeleton.tsx`
  - [ ] **2.6.1.3** Add to all list pages

### Section 2.7: Empty States

- [ ] **2.7.1** 🟡 Create empty state components
  - [ ] **2.7.1.1** Create `components/empty/EmptyFavorites.tsx`
  - [ ] **2.7.1.2** Create `components/empty/EmptySearch.tsx`
  - [ ] **2.7.1.3** Create `components/empty/EmptyRestaurants.tsx`

---

# 🔧 CATEGORY 3: BACKEND IMPLEMENTATION

> **Priority:** Critical for full functionality
> **Estimated Time:** 3-4 weeks
> Backend tasks are organized by dependency order

---

## PHASE 0: Backend Decisions (Day 1)

### Section 3.0.1: Technology Stack Selection

> **IMPORTANT:** Make these decisions BEFORE starting backend implementation

- [ ] **3.0.1.1** 🔴 Decide: Authentication Provider
  - Options: NextAuth.js | Clerk | Supabase Auth | Lucia
  - Recommendation: **Supabase Auth** (aligns with database choice)

- [ ] **3.0.1.2** 🔴 Decide: Database Provider
  - Options: Supabase (PostgreSQL) | Neon (PostgreSQL) | PlanetScale (MySQL) | MongoDB
  - Recommendation: **Supabase** (includes auth, storage, database)

- [ ] **3.0.1.3** 🔴 Decide: ORM
  - Options: Prisma | Drizzle | TypeORM
  - Recommendation: **Prisma** (best TypeScript support, great migrations)

- [ ] **3.0.1.4** 🔴 Decide: File Storage
  - Options: Supabase Storage | AWS S3 | Cloudinary | Vercel Blob
  - Recommendation: **Supabase Storage** (included with database)

- [ ] **3.0.1.5** 🔴 Document decisions
  - [ ] Create `docs/ARCHITECTURE.md`
  - [ ] Document reasoning for each choice
  - [ ] Note any alternatives considered

---

## PHASE 1: Foundation Setup (Week 1)

### Section 3.1: Database Setup

- [ ] **3.1.1** 🔴 Set up Supabase project
  - [ ] **3.1.1.1** Create Supabase account
  - [ ] **3.1.1.2** Create new project
  - [ ] **3.1.1.3** Get connection string
  - [ ] **3.1.1.4** Add to `.env.local`

- [ ] **3.1.2** 🔴 Set up Prisma ORM
  ```bash
  bun add prisma @prisma/client
  bun prisma init
  ```
  - [ ] **3.1.2.1** Configure database connection in `.env`
  - [ ] **3.1.2.2** Test connection

- [ ] **3.1.3** 🔴 Create database schema
  - [ ] **3.1.3.1** Define `User` model
    ```prisma
    model User {
      id            String    @id @default(cuid())
      email         String    @unique
      name          String?
      password      String?
      role          Role      @default(USER)
      avatar        String?
      settings      Json?
      createdAt     DateTime  @default(now())
      updatedAt     DateTime  @updatedAt
      restaurants   Restaurant[]
      blogs         Blog[]
      reviews       Review[]
      favorites     Favorite[]
      reservations  Reservation[]
    }

    enum Role {
      USER
      OWNER
      ADMIN
    }
    ```
  - [ ] **3.1.3.2** Define `Restaurant` model
  - [ ] **3.1.3.3** Define `Blog` model
  - [ ] **3.1.3.4** Define `Review` model
  - [ ] **3.1.3.5** Define `Reservation` model
  - [ ] **3.1.3.6** Define `Offer` model
  - [ ] **3.1.3.7** Define `Favorite` model
  - [ ] **3.1.3.8** Define `Category` model
  - [ ] **3.1.3.9** Define relationships
  - [ ] **3.1.3.10** Run `bun prisma migrate dev --init`

- [ ] **3.1.4** 🔴 Seed initial data
  - [ ] **3.1.4.1** Create `prisma/seed.ts`
  - [ ] **3.1.4.2** Add categories from mock data
  - [ ] **3.1.4.3** Add restaurants from `__mock__/restaurants.ts`
  - [ ] **3.1.4.4** Add blogs from `__mock__/blogs.ts`
  - [ ] **3.1.4.5** Configure seed in package.json
  - [ ] **3.1.4.6** Run `bun prisma db seed`

### Section 3.2: Authentication Setup

- [ ] **3.2.1** 🔴 Set up Supabase Auth
  - [ ] **3.2.1.1** Install `@supabase/supabase-js`
  - [ ] **3.2.1.2** Create `lib/supabase.ts`
  - [ ] **3.2.1.3** Configure auth client
  - [ ] **3.2.1.4** Add environment variables

- [ ] **3.2.2** 🔴 Create auth API routes
  - [ ] **3.2.2.1** POST `/api/auth/register` - Register new user
  - [ ] **3.2.2.2** POST `/api/auth/login` - Login with email/password
  - [ ] **3.2.2.3** POST `/api/auth/logout` - Logout
  - [ ] **3.2.2.4** POST `/api/auth/forgot-password` - Request reset
  - [ ] **3.2.2.5** POST `/api/auth/reset-password` - Reset password
  - [ ] **3.2.2.6** GET `/api/auth/me` - Get current user

- [ ] **3.2.3** 🔴 Configure OAuth providers
  - [ ] **3.2.3.1** Enable Google OAuth in Supabase
  - [ ] **3.2.3.2** Add Google login button to UI
  - [ ] **3.2.3.3** Test OAuth flow

### Section 3.3: File Storage Setup

- [ ] **3.3.1** 🔴 Set up Supabase Storage
  - [ ] **3.3.1.1** Create "restaurants" bucket
  - [ ] **3.3.1.2** Create "avatars" bucket
  - [ ] **3.3.1.3** Configure bucket permissions (public read, auth write)

- [ ] **3.3.2** 🔴 Create upload API routes
  - [ ] **3.3.2.1** POST `/api/upload/image` - Upload single
  - [ ] **3.3.2.2** POST `/api/upload/gallery` - Upload multiple
  - [ ] **3.3.2.3** DELETE `/api/upload/:id` - Delete image
  - [ ] **3.3.2.4** Add validation (size, type)

---

## PHASE 2: Core API Implementation (Week 2)

### Section 3.4: Restaurants API

- [ ] **3.4.1** 🔴 Create restaurants endpoints
  - [ ] **3.4.1.1** GET `/api/restaurants` - List all (with filters)
  - [ ] **3.4.1.2** GET `/api/restaurants/:id` - Get single
  - [ ] **3.4.1.3** GET `/api/restaurants/search` - Search
  - [ ] **3.4.1.4** GET `/api/restaurants/nearby` - Near location

- [ ] **3.4.2** 🔴 Owner restaurant management
  - [ ] **3.4.2.1** POST `/api/restaurants` - Create (owner)
  - [ ] **3.4.2.2** PATCH `/api/restaurants/:id` - Update (owner)
  - [ ] **3.4.2.3** DELETE `/api/restaurants/:id` - Delete (owner)
  - [ ] **3.4.2.4** GET `/api/users/:id/restaurants` - Get user's

- [ ] **3.4.3** 🟡 Admin approval workflow
  - [ ] **3.4.3.1** GET `/api/admin/restaurants/pending`
  - [ ] **3.4.3.2** PATCH `/api/admin/restaurants/:id/approve`
  - [ ] **3.4.3.3** PATCH `/api/admin/restaurants/:id/reject`

### Section 3.5: Blogs API

- [ ] **3.5.1** 🔴 Create blogs endpoints
  - [ ] **3.5.1.1** GET `/api/blogs` - List all
  - [ ] **3.5.1.2** GET `/api/blogs/:id` - Get single
  - [ ] **3.5.1.3** GET `/api/blogs/search` - Search
  - [ ] **3.5.1.4** GET `/api/blogs/category/:id` - By category

- [ ] **3.5.2** 🔴 Blog management (owner/admin)
  - [ ] **3.5.2.1** POST `/api/blogs` - Create
  - [ ] **3.5.2.2** PATCH `/api/blogs/:id` - Update
  - [ ] **3.5.2.3** DELETE `/api/blogs/:id` - Delete
  - [ ] **3.5.2.4** PATCH `/api/blogs/:id/publish` - Publish draft

### Section 3.6: Categories API

- [ ] **3.6.1** 🔴 Create categories endpoints
  - [ ] **3.6.1.1** GET `/api/categories` - List all
  - [ ] **3.6.1.2** GET `/api/categories/:id` - Get single
  - [ ] **3.6.1.3** GET `/api/categories/type/:type` - By type
  - [ ] **3.6.1.4** POST `/api/categories` - Create (admin)

---

## PHASE 3: User Features (Week 2-3)

### Section 3.7: Favorites System

- [ ] **3.7.1** 🔴 Create favorites endpoints
  - [ ] **3.7.1.1** POST `/api/favorites` - Add to favorites
  - [ ] **3.7.1.2** DELETE `/api/favorites/:id` - Remove
  - [ ] **3.7.1.3** GET `/api/favorites` - Get user's favorites
  - [ ] **3.7.1.4** GET `/api/favorites/check` - Check if favorited

### Section 3.8: Reviews System

- [ ] **3.8.1** 🔴 Create reviews endpoints
  - [ ] **3.8.1.1** POST `/api/reviews` - Create review
  - [ ] **3.8.1.2** GET `/api/reviews/restaurant/:id` - Get restaurant reviews
  - [ ] **3.8.1.3** PATCH `/api/reviews/:id` - Update (owner)
  - [ ] **3.8.1.4** DELETE `/api/reviews/:id` - Delete (owner/admin)

- [ ] **3.8.2** 🟡 Review moderation
  - [ ] **3.8.2.1** GET `/api/admin/reviews/pending`
  - [ ] **3.8.2.2** PATCH `/api/admin/reviews/:id/approve`
  - [ ] **3.8.2.3** PATCH `/api/admin/reviews/:id/reject`

### Section 3.9: Reservations

- [ ] **3.9.1** 🔴 Create reservations endpoints
  - [ ] **3.9.1.1** POST `/api/reservations` - Create reservation
  - [ ] **3.9.1.2** GET `/api/reservations` - Get user's
  - [ ] **3.9.1.3** GET `/api/reservations/:id` - Get single
  - [ ] **3.9.1.4** DELETE `/api/reservations/:id` - Cancel

- [ ] **3.9.2** 🟡 Owner management
  - [ ] **3.9.2.1** GET `/api/restaurants/:id/reservations` - Get restaurant's
  - [ ] **3.9.2.2** PATCH `/api/reservations/:id/status` - Update status

### Section 3.10: Offers & Vouchers

- [ ] **3.10.1** 🔴 Create offers endpoints
  - [ ] **3.10.1.1** POST `/api/offers` - Create (owner)
  - [ ] **3.10.1.2** GET `/api/offers` - List active
  - [ ] **3.10.1.3** GET `/api/offers/:id` - Get single
  - [ ] **3.10.1.4** PATCH `/api/offers/:id` - Update (owner)

- [ ] **3.10.2** 🔴 Offer claiming
  - [ ] **3.10.2.1** POST `/api/offers/:id/claim` - Claim offer
  - [ ] **3.10.2.2** GET `/api/offers/claimed` - Get user's claimed
  - [ ] **3.10.2.3** GET `/api/offers/:id/validate/:code` - Validate QR

---

## PHASE 4: Advanced Features (Week 3-4)

### Section 3.11: Search Implementation

- [ ] **3.11.1** 🔴 Implement full-text search
  - [ ] **3.11.1.1** Add PostgreSQL full-text search
  - [ ] **3.11.1.2** Create search indexes
  - [ ] **3.11.1.3** Implement search API with ranking
  - [ ] **3.11.1.4** Add autocomplete/suggestions

- [ ] **3.11.2** 🟡 Advanced filtering
  - [ ] **3.11.2.1** Implement cuisine filter
  - [ ] **3.11.2.2** Implement price range filter
  - [ ] **3.11.2.3** Implement location filter
  - [ ] **3.11.2.4** Implement rating filter

### Section 3.12: Analytics

- [ ] **3.12.1** 🟡 Event tracking
  - [ ] **3.12.1.1** Create analytics models
  - [ ] **3.12.1.2** POST `/api/analytics/track` - Track event
  - [ ] **3.12.1.3** Add tracking to frontend

- [ ] **3.12.2** 🟡 Analytics dashboard
  - [ ] **3.12.2.1** GET `/api/analytics/restaurant/:id` - Restaurant stats
  - [ ] **3.12.2.2** GET `/api/analytics/blog/:id` - Blog stats
  - [ ] **3.12.2.3** GET `/api/analytics/platform` - Platform stats (admin)

---

# 📊 CATEGORY 4: INTEGRATION & TESTING

> **Priority:** Critical before launch
> **Estimated Time:** 1-2 weeks

---

## PHASE 1: Frontend-Backend Integration (Week 1)

### Section 4.1: Connect All Data Sources

- [ ] **4.1.1** 🔴 Replace mock data with API calls
  - [ ] **4.1.1.1** Update home page sections to fetch from API
  - [ ] **4.1.1.2** Update restaurant pages to fetch from API
  - [ ] **4.1.1.3** Update blog pages to fetch from API
  - [ ] **4.1.1.4** Update dashboards to fetch from API

- [ ] **4.1.2** 🔴 Implement real auth flow
  - [ ] **4.1.2.1** Connect login form to API
  - [ ] **4.1.2.2** Connect register form to API
  - [ ] **4.1.2.3** Implement session management
  - [ ] **4.1.2.4** Add protected routes middleware

- [ ] **4.1.3** 🔴 Implement real favorites
  - [ ] **4.1.3.1** Connect toggle to API
  - [ ] **4.1.3.2** Sync favorites across devices
  - [ ] **4.1.3.3** Update favorites page

### Section 4.2: Testing

- [ ] **4.2.1** 🟡 Unit tests
  - [ ] **4.2.1.1** Test utility functions
  - [ ] **4.2.1.2** Test hooks
  - [ ] **4.2.1.3** Test components

- [ ] **4.2.2** 🟡 Integration tests
  - [ ] **4.2.2.1** Test API routes
  - [ ] **4.2.2.2** Test database operations
  - [ ] **4.2.2.3** Test auth flow

---

## PHASE 2: Polish & Launch Prep (Week 2)

### Section 4.3: Performance Optimization

- [ ] **4.3.1** 🟡 Image optimization
  - [ ] **4.3.1.1** Use Next.js Image for all images
  - [ ] **4.3.1.2** Add placeholder blur
  - [ ] **4.3.1.3** Optimize image sizes

- [ ] **4.3.2** 🟡 Code splitting
  - [ ] **4.3.2.1** Dynamic imports for heavy components
  - [ ] **4.3.2.2** Lazy load below-fold content
  - [ ] **4.3.2.3** Analyze bundle size

### Section 4.4: Accessibility Audit

- [ ] **4.4.1** 🟡 Keyboard navigation
  - [ ] **4.4.1.1** Test all interactive elements
  - [ ] **4.4.1.2** Add visible focus indicators
  - [ ] **4.4.1.3** Ensure logical tab order

- [ ] **4.4.2** 🟡 Screen reader support
  - [ ] **4.4.2.1** Add ARIA labels
  - [ ] **4.4.2.2** Test with VoiceOver/NVDA
  - [ ] **4.4.2.3** Fix violations

### Section 4.5: Launch Checklist

- [ ] **4.5.1** 🔴 Pre-launch checks
  - [ ] **4.5.1.1] All critical bugs fixed
  - [ ] **4.5.1.2** All tests passing
  - [ ] **4.5.1.3** Performance acceptable (<3s load)
  - [ ] **4.5.1.4] Accessibility score >90
  - [ ] **4.5.1.5** SEO meta tags complete
  - [ ] **4.5.1.6** Analytics configured
  - [ ] **4.5.1.7** Error tracking setup
  - [ ] **4.5.1.8** Backup strategy in place

---

# 📈 PROGRESS TRACKING

## Overall Progress

| Category | Sub-tasks Complete | Total Sub-tasks | Progress |
|----------|-------------------|----------------|----------|
| **Preflight** | 11 | 11 | ✅ 100% |
| **Critical Fixes** | 0 | 45 | 0% |
| **Frontend Enh.** | 0 | 35 | 0% |
| **Backend Setup** | 0 | 60 | 0% |
| **Integration** | 0 | 30 | 0% |
| **Testing** | 0 | 20 | 0% |
| **TOTAL** | **11** | **201** | **5%** |

## Milestone Tracking

| Milestone | Target | Status | Date |
|-----------|--------|--------|------|
| ✅ Preflight Complete | Week 1 | ✅ Done | 2026-01-02 |
| Critical Fixes Complete | Week 1 | ⏳ Pending | - |
| Frontend Enh. Complete | Week 2 | ⏳ Pending | - |
| Backend Setup Complete | Week 3-4 | ⏳ Pending | - |
| Integration Complete | Week 5 | ⏳ Pending | - |
| Beta Launch | Week 6 | ⏳ Pending | - |

---

# 📝 NOTES FOR AGENTS

### Before Starting Any Task:

1. **Read the relevant SSOT documents:**
   - `project-overview.md` - Understand architecture
   - `design.md` - Follow design system rules
   - `gitdeploy.md` - Deployment process
   - This file - Know what to work on

2. **Check existing components:**
   - Don't create duplicates
   - Use existing patterns
   - Follow established conventions

3. **Always use design tokens:**
   - Never hardcode values
   - Check `styles/tokens.css` first
   - Run audits before committing

4. **Test your changes:**
   - Run `bun run build`
   - Run `bunx tsc --noEmit`
   - Test on mobile viewport
   - Test all theme modes

### After Completing a Task:

1. **Run audits:** `bun run audit`
2. **Fix any violations:** `bun run fix`
3. **Commit with proper format:** `feat: description` or `fix: description`
4. **Check git status:** Ensure only expected files changed
5. **Deploy if needed:** `vercel --prod --yes`

---

# 🔗 QUICK REFERENCE

### Related SSOT Documents

| Document | Purpose | Location |
|----------|---------|----------|
| **project-overview.md** | Architecture, structure, components | `/documentation/tasks/project-overview.md` |
| **design.md** | Design system, tokens, guidelines | `/documentation/tasks/design.md` |
| **gitdeploy.md** | Git workflow, Vercel deployment | `/documentation/tasks/gitdeploy.md` |
| **tasks.md** | This file - Development roadmap | `/documentation/tasks/tasks.md` |

### Quick Commands

```bash
# Run audits
bun run audit

# Type check
bunx tsc --noEmit

# Build
bun run build

# Deploy
vercel --prod --yes

# Check git status
git status

# Fix code issues
bun run fix
```

### Key File Locations

```
Project Root: /Users/ahmadabdullah/Projects/shadi-V2/

Routes:          app/
Features:        features/
Components:      components/
Styles:          styles/
Mock Data:       __mock__/
Audit Scripts:   scripts/audit/
Documentation:   documentation/
```

---

**Document Version:** 2.0.0
**Last Modified:** 2026-01-02
**Maintained By:** Development Team
**Status:** ✅ Active SSOT for Platform Roadmap

---

*This document is the Single Source of Truth (SSOT) for all development tasks. Always check here before starting new work.*
