# Shadi V2 - Project Overview & Architecture

**Project:** Restaurant Discovery Platform 2025-2026
**Tech Stack:** Next.js 16.1.1, TypeScript, Tailwind CSS, Bun
**Last Updated:** 2026-01-02

---

## 🏗️ Project Structure

```
shadi-V2/
├── app/                          # Next.js App Router (pages)
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── (dashboard)/              # Dashboard routes
│   │   ├── admin/page.tsx       # Admin dashboard
│   │   ├── owner/page.tsx       # Owner dashboard
│   │   └── user/page.tsx        # User dashboard
│   ├── (marketing)/             # Marketing pages
│   ├── blog/                    # Blog routes
│   ├── restaurants/             # Restaurant routes
│   ├── profile/page.tsx         # User profile
│   ├── settings/page.tsx        # Settings
│   └── page.tsx                 # Home page
├── components/                   # Shared components
│   ├── card/                    # Card components (BaseCard, RestaurantCard, BlogCard)
│   ├── layout/                  # Layout components (Header, SideMenu, ThemeModal)
│   ├── marquee/                 # Marquee component
│   └── ui/                      # UI components (Button, Badge, Card)
├── features/                     # Feature-specific components
│   ├── home/                    # Home page features
│   │   ├── hero/                # Hero section
│   │   └── sections/            # Home sections (ForYou, Places, Stories)
│   ├── dashboard/              # Dashboard components
│   └── restaurant/             # Restaurant features
├── data/                        # Data files
│   ├── marquee.ts              # Marquee data
│   └── mocks/                  # Mock data files
├── __mock__/                   # Mock data (UI only)
│   ├── restaurants.ts          # Restaurant mock data
│   ├── blogs.ts                # Blog mock data
│   └── dashboard.ts            # Dashboard mock data
├── styles/                     # Styles
│   ├── globals.css            # Global styles
│   ├── tokens.css             # Design tokens
│   └── utilities.css          # Utility classes (fade effects)
├── scripts/audit/             # Audit scripts
│   └── ...                    # Quality check scripts
└── documentation/             # Documentation
```

---

## 📱 Home Page Architecture

### Home Client Component (`features/home/HomeClient.tsx`)

The home page uses a **tab-based navigation system** with three main tabs:

#### Tab 1: "For You" (default open)
- **Trending Now** - Mixed discovery (restaurants + blogs), mini variant, horizontal scroll
- **Editor's Picks** - Rich cards, 2-column grid
- **Exclusive Offers** - Restaurants with "Shadi Exclusive" badge, standard variant

#### Tab 2: "Places & Experiences"
- **Family Friendly** - Standard cards
- **Street Classics (1 Dirham Bites)** - Mini cards, tight spacing
- **Traditional UAE** - Rich cards, heritage food
- **Experiences** - Rich cards (max 4 shown)
- **Meat Lovers** - Standard cards

#### Tab 3: "Stories"
- **Latest Stories** - BlogCard standard, vertical list
- **Trending Posts** - BlogCard mini, horizontal scroll
- **Guides** - BlogCard rich, 2-column grid

### Home Page Sections (In Order)

1. **Hero Section** - Full-screen with gradient overlay & fade system
   - Vertical 3D marquee (desktop)
   - CTA text

2. **Marquee** - Horizontal dual marquee (mobile)
   - Card previews in infinite scroll

3. **Home Search** - Search bar with filters
   - Location, cuisine, price filters

4. **Home Tabs** - Tab navigation
   - For You, Places, Stories

5. **Tab Sections** - Dynamic content based on active tab
   - For You Sections, Places Sections, or Stories Sections

6. **Home Values** - Platform values
   - Trust, Quality, Community

7. **Home CTA** - Call-to-action
   - Join as owner/food lover

8. **Footer** - Logo + tagline
   - Minimal footer

---

## 🎯 Card System (APPROVED - Do Not Modify)

The card system uses a **single BaseCard architecture** with 4 locked variants:

### Card Variants

| Variant | Height | Use Case |
|---------|--------|----------|
| `mini` | 140px | Marquees, tight grids, no badges/meta |
| `standard` | 220px | Default restaurant/blog cards |
| `rich` | 300px | Featured content, rating on image, 2-line title |
| `full` | 420px | Detailed views with scroll inside |

### Card Types

| Type | Accent Color | Components |
|------|--------------|-------------|
| `restaurant` | Warm (`--card-accent-restaurant`) | RestaurantCard |
| `blog` | Cool (`--card-accent-blog`) | BlogCard |

### Card Components

```tsx
// RestaurantCard - For restaurants
<RestaurantCard
  {...restaurantData}
  variant="standard" // | "mini" | "rich" | "full"
/>

// BlogCard - For blogs
<BlogCard
  {...blogData}
  variant="standard" // | "mini" | "rich" | "full"
/>

// CardPreview - For marquees only (lightweight)
<CardPreview
  images={images}
  showTitle={false}
  size="square" // | "default"
/>
```

---

## 🎨 Design Tokens

### Key Token Categories

```css
/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
--spacing-3xl: 64px
--spacing-4xl: 96px

/* Typography */
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem
--font-size-4xl: 2.25rem

/* Colors (OKLCH) */
--color-primary: oklch(var(--color-brand-primary))
--fg: oklch(var(--color-fg-base))
--bg: oklch(var(--color-bg-base))

/* Opacity */
--opacity-quiet: 0.5
--opacity-muted: 0.6
--opacity-medium: 0.7
--opacity-full: 1

/* Radius */
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px

/* Card Heights */
--card-height-mini: 140px
--card-height-standard: 220px
--card-height-rich: 300px
--card-height-full: 420px
```

---

## 📊 Dashboard Architecture

### User Dashboard (`/user`)

**Purpose:** Personal consumption + engagement

**Sections:**
1. **Header** - Title: "My Dashboard"
2. **Overview (Stats)** - 4 cards
   - Saved Restaurants
   - Saved Blogs
   - Recently Viewed
   - Offers Claimed
3. **Quick Actions** - 4 cards
   - Search Restaurants
   - Read Blogs
   - Edit Profile
   - Write Review
4. **Recent Activity** - Al Fanar (Viewed), Saved Places

### Owner Dashboard (`/owner`)

**Purpose:** Business management

**Sections:**
1. **Header** - Title: "Owner Dashboard"
2. **Overview (Stats)** - 4 cards
   - My Restaurants
   - Active Offers
   - Profile Views
   - Blog Posts
3. **My Restaurants** - 2 cards + Add New button
   - Al Fanar (Pending)
   - Arabian Tea House (Active)
4. **Offers & Vouchers** - 2 cards + Create Offer button
   - 50% Off Lunch
   - Free Dessert
5. **Quick Actions** - 2 cards
   - Create Blog Post
   - View Analytics

### Admin Dashboard (`/admin`)

**Purpose:** Platform management

**Sections:**
1. **Header** - Title: "Admin Dashboard"
2. **Overview (Stats)** - 4 cards
   - Total Users
   - Active Restaurants
   - Pending Approvals
   - Total Blogs
3. **Home Management** - 4 cards
   - Tabs Manager
   - Categories
   - Featured Cards
   - Traffic Analytics
4. **Content Moderation** - 4 cards + sections
   - Pending (X)
   - All Restaurants
   - Blog Management
   - Reports
5. **User Management** - 2 cards + Add User button
   - Total Users
   - Flagged Accounts

---

## 🎭 Key Features

### 1. Marquee System

**Desktop:** Vertical 3D dual marquee with 3 columns
- Column 1: Moves down
- Column 2: Moves up (most prominent)
- Column 3: Moves down

**Mobile:** Horizontal dual marquee with 2 rows
- Top row: Moves left
- Bottom row: Moves right

**Data Source:** `data/marquee.ts` (derived from first 8 restaurants)

**Fade Effects:**
- Horizontal: `.fade-horizontal` (left/right edges)
- 3D: `.fade-3d` (all four edges)

### 2. Tab Navigation

**Component:** `features/home/sections/HomeTabs.tsx`

**Tabs:**
1. **For You** (`for-you`) - Mixed discovery feed
2. **Places & Experiences** (`places`) - Restaurants & experiences
3. **Stories** (`stories`) - Pure blog content

**Default Tab:** `for-you`

### 3. Search Functionality

**Component:** `features/home/sections/HomeSearch.tsx`

**Filters:**
- Location (emirate)
- Cuisine type
- Price range
- Family friendly

### 4. Theme System

**Provider:** `context/ThemeContext.tsx`

**Modes:**
- Light
- Dark
- Warm (auto-detects)

**Accent Colors:**
- Blue (default)
- Purple
- Pink
- Orange

---

## 📦 Component Library

### Layout Components

- **Header** - Top navigation with menu, theme, profile buttons
- **SideMenu** - Slide-out menu with role-based navigation
- **ThemeModal** - Theme switcher (mode + accent color)
- **DashboardLayout** - Shared layout for all dashboards
- **PageContainer** - Max-width container with padding

### Card Components

- **BaseCard** - Single source of truth for all cards
- **RestaurantCard** - Restaurant-specific card
- **BlogCard** - Blog-specific card
- **CardPreview** - Lightweight marquee-only card
- **DashboardCard** - Dashboard stat/action cards

### UI Components

- **Button** - Primary, secondary, ghost variants
- **Badge** - Status badges
- **ResponsiveGrid** - Auto-sizing grid (2→3→4 columns)

---

## 🔐 Role-Based Navigation

### Guest (Not Logged In)
- Discover (Home)
- Restaurants
- Near Me
- Top Rated
- Favorites
- Blog
- Login

### User (Logged In)
- Discover
- Saved
- Blog
- Dashboard (`/user`)
- Settings (`/settings`)
- Profile (`/profile`)

### Owner (Restaurant Owner)
- Discover
- Dashboard (`/owner`)
- My Restaurants
- Offers
- Blog Posts
- Settings
- Profile

### Admin (Platform Admin)
- Discover
- Home Manager
- Restaurants
- Blogs
- Users
- Reports
- Dashboard (`/admin`)
- Settings
- Profile

---

## 🚦 Audit System

### Audit Layers

| Layer | Purpose | Status |
|-------|---------|--------|
| 00 | Pre-flight checks | ✅ Pass |
| 03 | TypeScript compilation | ✅ Pass |
| 04 | Design tokens (OKLCH, no hardcoded values) | ✅ Pass |
| 07.5 | UI normalization | ✅ Pass |
| 08 | Ownership & CODEOWNERS | ✅ Pass |

### Running Audits

```bash
# Run all audits
bun run audit

# Run specific layers
bun run scripts/audit-runner.ts --layer=03 --layer=04

# Quick pre-flight check
bun run scripts/audit/00-pre-flight.ts
```

---

## 🎯 Design Rules

### Do's ✅

1. **Use design tokens** for all spacing, colors, typography
2. **Use BaseCard variants** - never create custom card UI
3. **Use 2-column mobile grids** (never 1-column)
4. **Show 2 full cards + partial 3rd** in horizontal scrolling sections
5. **Use snap scrolling** for proper affordance
6. **Follow visual hierarchy:** Title → Helper text → Cards → "Show more" button

### Don'ts ❌

1. **NO hardcoded pixel values** in CSS
2. **NO new card UI** unless it's a BaseCard variant
3. **NO height expansion** on cards (locked heights)
4. **NO mixing more than 2 variants** in same section
5. **NO fade effects on cards** (only on marquees)
6. **NO inline height styles**

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default:  < 640px (Mobile, 2-column)
sm:      ≥ 640px (Small tablet, 3-column)
md:      ≥ 768px (Tablet, 3-column)
lg:      ≥ 1024px (Desktop, 4-column)
xl:      ≥ 1280px (Large desktop)
```

---

## 🔄 Data Flow

### Mock Data

**Location:** `__mock__/` directory

**Files:**
- `restaurants.ts` - 8 restaurants for marquee
- `blogs.ts` - Mock blog posts
- `dashboard.ts` - Dashboard stats data

**Usage:** All mock data is imported and used directly (no API calls yet)

### Marquee Data

**Source:** `data/marquee.ts`

**Derivation:** First 8 restaurants from mockRestaurants

```typescript
export const MARQUEE_ITEMS: MarqueeItem[] = mockRestaurants.slice(0, 8)
```

---

## 🎨 Visual Design System

### Colors (OKLCH)

**Primary:** Brand color (blue/purple)
**Foreground:** Text hierarchy with opacity levels
**Background:** Clean white/dark bases

### Typography

**Font:** System font stack
**Scale:** xs → sm → base → lg → xl → 2xl → 4xl
**Weights:** Normal (400), Medium (500), Semibold (600), Black (900)

### Spacing

**Scale:** 4px → 8px → 16px → 24px → 32px → 48px → 64px → 96px
**Used for:** Margins, padding, gaps, component sizing

### Border Radius

**MD:** 8px (small elements)
**LG:** 12px (medium elements)
**XL:** 16px (cards, buttons)
**Full:** 9999px (pills, circles)

---

## 📝 Important Notes for Agents

### When Modifying Home Page

1. **Always** use existing BaseCard variants
2. **Always** use design tokens for spacing/colors
3. **Never** add new card UI (extend BaseCard instead)
4. **Always** test on mobile (2-column grid)
5. **Always** include helper text for sections
6. **Never** add fade effects to cards (only marquees)

### When Modifying Dashboards

1. **Always** use DashboardCard for stats/actions
2. **Always** use ResponsiveGrid for layouts
3. **Always** follow role-based navigation
4. **Never** hardcode spacing values

### When Deploying

1. **Always** run audits first
2. **Always** verify correct Vercel project (shadi-v2)
3. **Always** check git author is set correctly
4. **Never** skip pre-commit hooks unless necessary

---

## 📚 Documentation Files

- `/documentation/tasks/gitdeploy.md` - Git & Vercel deployment guide
- `/documentation/tasks/project-overview.md` - This file
- `/documentation/ui/CARDS.md` - Card system documentation

---

## 🚀 Quick Start for Agents

### To Add a New Section to Home Page:

1. Create section component in `features/home/sections/`
2. Use existing cards (RestaurantCard, BlogCard, DashboardCard)
3. Follow visual hierarchy: Title → Helper text → Cards → "Show more"
4. Use 2-column mobile grid with horizontal scroll
5. Add to appropriate tab section (ForYouSections, PlacesSections, StoriesSections)
6. Run audits and deploy

### To Add a New Dashboard:

1. Create component in `features/dashboard/`
2. Use DashboardLayout wrapper
3. Add sections with DashboardCard stats
4. Create route in `app/(dashboard)/<role>/page.tsx`
5. Add navigation to SideMenu ROLE_NAV_ITEMS
6. Test at `/<role>` route

---

*Last updated: 2026-01-02*
*Maintained in: `/documentation/tasks/project-overview.md`*
