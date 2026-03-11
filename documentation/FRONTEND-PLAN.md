# SHADI-V2 — FRONTEND IMPLEMENTATION PLAN

> **UI Designer Agent Scope** • **Design Token System** • **Audit-Safe**

This document is the authoritative frontend implementation plan for shadi-v2.

---

## Agent Responsibilities

**UI Designer Agent** handles:
- `app/` - Routes, pages, layouts
- `components/` - Pure UI components
- `features/` - Feature modules (UI + logic)
- `design-system/` - Tokens, primitives, foundations
- `styles/` - Global CSS

**NOT in scope:**
- `server/` - Database, services, cache (Database Agent)
- DB queries and mutations (Database Agent)
- API route implementation (Database Agent)

---

## Phase 1 — Design System & Tokens

### Goal
One visual language across the platform

### Deliverables

#### 1.1 Token System (Complete - Already in `styles/tokens.css`)

The token system is already complete. Verify it includes:

- **Colors:** Brand, accent (5), semantic, neutral scale
- **Spacing:** xs through 4xl
- **Typography:** Font sizes, letter spacing, line heights
- **Border Radius:** xs through 3xl, full
- **Shadows:** sm through 2xl, glass variants
- **Blur:** xs through 2xl
- **Animations:** Keyframes, easing, durations
- **Component-specific:** Header, hero, marquee, grid

#### 1.2 Create `design-system/` Directory Structure

```
design-system/
├── tokens/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── typography.ts
│   └── motion.ts
│
├── foundations/
│   ├── glass.ts
│   ├── grid.ts
│   └── container.ts
│
├── primitives/
│   ├── Button.tsx
│   ├── IconButton.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Tabs.tsx
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── Switch.tsx
│
└── index.ts
```

#### 1.3 Prerequisites

- Run `bun run biome check --write design-system/`
- Run `bun run scripts/audit/04-design-tokens.ts`
- All must pass before proceeding

---

## Phase 2 — Home Page (Marketing)

### Goal
First impression + performance

### Pages to Create

#### 2.1 Home Page (`app/(marketing)/page.tsx`)

**Components needed:**
```tsx
// Already exist, verify they work:
- Hero.tsx / HeroContent.tsx
- SearchContainer.tsx
- SearchResults.tsx
- RestaurantGrid.tsx
- Marquee.tsx
- BlogClient.tsx (for blog section)
```

**Requirements:**
- Hero is responsive without jumps
- Morph animation uses exact existing code
- Marquees fade on all sides
- No duplicate marquees across breakpoints
- Search = shared component

**Grid Rules (Mobile):**
- Always 2-column grid for stats
- Never single vertical stacking
- Use horizontal scroll when needed

**File structure:**
```
app/(marketing)/
├── page.tsx
└── layout.tsx
```

#### 2.2 Blog Page (`app/blog/page.tsx`)

Already exists. Verify:
- Uses same search system
- Uses same card components
- Responsive grid

#### 2.3 Restaurant Pages (`app/restaurants/`)

```
app/restaurants/
├── page.tsx              # Listing with search/filter
└── [slug]/page.tsx       # Detail page
```

**Detail page sections:**
- Hero (image/video)
- Shadi recommendation badge
- Gallery
- Key info
- Offers
- Blog entries
- Reviews
- Map preview

**Rules:**
- Tabs inside page (not separate pages)
- Horizontal scroll for content blocks
- No navigation hopping

---

## Phase 3 — Dashboard Shell (Unified)

### Goal
One dashboard, role-aware (User, Owner, Admin)

### Structure

```
app/(dashboard)/
├── layout.tsx              # Shared shell
├── admin/
│   ├── overview/page.tsx
│   ├── restaurants/page.tsx
│   ├── users/page.tsx
│   └── settings/page.tsx
├── owner/
│   ├── dashboard/page.tsx
│   ├── restaurant/page.tsx
│   └── analytics/page.tsx
└── user/
    ├── dashboard/page.tsx
    ├── saved/page.tsx
    └── profile/page.tsx
```

### Shared Layout (`app/(dashboard)/layout.tsx`)

```tsx
import { Header } from "@/components/Header"
import { SideMenu } from "@/components/SideMenu"
import { ThemeModal } from "@/components/ThemeModal"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <SideMenu />
      <ThemeModal />
      <main className="pt-[var(--page-top-offset)]">
        {children}
      </main>
    </>
  )
}
```

### Dashboard Grid Rules

**Mobile:**
- Always 2-column grid
- Compact cards
- Information dense

**Desktop:**
- 3-4 column adaptive grid
- Maximize screen usage
- No wasted vertical space

### Components to Use

Already created in `components/dashboard/`:
- `StatCard` - Dashboard stat cards
- `ChartCard` - Chart wrapper
- `DataTable` - Data table with sorting
- `SectionContainer` - Section wrapper

---

## Phase 4 — Search & Discovery System

### Goal
One search system for restaurants + blogs

### Components

Already exist in `components/`:
- `SearchContainer.tsx` - Search input + filters
- `EnhancedFilterBar.tsx` - Filter bar (in `components/ui/`)

### Verify Search System

```tsx
// Unified search component pattern
<SearchContainer>
  <FilterBar />
  <Categories />
  <ResultsCount />
  <SortLoop />
  <ViewToggle />
</SearchContainer>
```

**Features:**
- Row 1: Search (85%) + Filter button (15%)
- Row 2: Filter options (hidden, horizontal scroll)
- Row 3: Categories (horizontal scroll, small)
- Row 4: Results count (left) + View/Sort loop buttons (right)

**Rules:**
- Icon-only square buttons
- Loop states (no dropdowns)
- Same component everywhere
- No variants per page

---

## Phase 5 — Auth Pages

### Goal
Minimal, clean authentication flow

### Structure (Already Created)

```
app/(auth)/
├── login/page.tsx         # ✅ Already created
└── register/page.tsx      # ✅ Already created
```

**Verify:**
- Email/password forms
- OAuth buttons (Google, GitHub)
- Role selection (user vs owner)
- Form validation
- Responsive design

---

## Phase 6 — Settings Page

### Goal
Unified settings with role-based sections

### Structure (Already Created)

```
app/settings/page.tsx       # ✅ Already created
```

**Sections:**
- Appearance (theme, accent)
- Notifications
- Privacy & Security
- Account

---

## Component Creation Guidelines

### When Creating New Components

1. **Check if it exists first** - Reuse over duplicate
2. **Use tokens only** - No hardcoded values
3. **Follow naming convention**
4. **Add TypeScript types**
5. **Export from index**

### Component Template

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT NAME - Restaurant Platform 2025-2026
   Brief description
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { ComponentProps } from "@/types/ui"

export interface MyComponentProps {
  // Props here
}

export function MyComponent({ prop }: MyComponentProps) {
  return (
    <div className="p-[var(--spacing-md)]">
      {/* Use tokens only */}
    </div>
  )
}
```

### Always Use Tokens

```tsx
// ✅ CORRECT
<div className="p-[var(--spacing-md)] bg-[var(--bg)] text-[var(--fg)]">

// ❌ WRONG
<div className="p-4 bg-white text-black">
```

---

## Responsive Design Rules

### Mobile First Approach

```tsx
// Mobile: 2 columns (minimum)
<div className="grid grid-cols-2 gap-[var(--spacing-md)]">

// Tablet: 3 columns
<div className="grid grid-cols-2 md:grid-cols-3 gap-[var(--spacing-md)]">

// Desktop: 4 columns
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--spacing-md)]">
```

### Horizontal Scroll Priority

For long lists on mobile:
```tsx
<div className="flex gap-[var(--spacing-md)] overflow-x-auto snap-x">
  {/* Items */}
</div>
```

---

## Glass Morphism Rules

### When to Use Glass

✅ **Allowed:**
- Header
- Filters
- Floating controls
- Cards (light glass only)

❌ **Not Allowed:**
- Heavy blur
- Neon glow
- Visual noise

### Glass Classes

Already defined in `styles/globals.css`:
```css
.glass { /* Base glass */ }
.glass-card { /* Card with hover */ }
.glass-header { /* Header glass */ }
```

---

## Icon System

### Use Heroicons

```tsx
import { IconName } from "@heroicons/react/24/outline"
```

**Rules:**
- Use outline icons by default
- Use 24/outline for consistency
- Size via tokens: `h-[var(--icon-size-md)]`
- No emojis as icons

---

## Animation System

### Use Defined Tokens

```tsx
// Easing
transition-all duration-[var(--duration-normal)] var(--ease-out-quart)

// Built-in animations
animate-[fade-in_0.3s_ease-out]
animate-[slide-in-right_0.3s_var(--ease-out-quart)]
```

### Keyframes Available

- `fade-in`
- `fade-in-up`
- `slide-in-right`
- `slide-in-left`
- `scale-in`
- `float`
- `morph-in` / `morph-out`
- `gradient-x`

---

## Type Safety

### Always Define Props

```tsx
export interface MyComponentProps {
  title: string
  description?: string
  onChange?: (value: string) => void
}

export function MyComponent({ title, description, onChange }: MyComponentProps) {
  // ...
}
```

### No `any` Types

```tsx
// ❌ WRONG
const data: any = await fetch()

// ✅ CORRECT
const data: Restaurant[] = await fetch()
```

---

## Pre-Commit Checklist

Before committing any UI work:

- [ ] No hardcoded values (colors, spacing, sizes)
- [ ] All spacing uses `--spacing-*`
- [ ] All colors use `--color-*` or accent classes
- [ ] All typography uses `--font-size-*`
- [ ] No inline styles
- [ ] Tested in all three theme modes
- [ ] `bun run biome check --write` passes
- [ ] `bun run scripts/audit/04-design-tokens.ts` passes

---

## Common Patterns

### Accent Color Button

```tsx
import { useTheme } from "@/context/ThemeContext"

const { accentColor } = useTheme()

const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
}

<button className={`${accentClasses[accentColor]} text-white px-[var(--spacing-2xl)]`}>
  Click me
</button>
```

### Section Container

```tsx
<section className="space-y-[var(--section-gap-md)] px-[var(--spacing-lg)]">
  <div className="max-w-[var(--max-w-2xl)] mx-auto">
    {/* Content */}
  </div>
</section>
```

### Grid with Responsive Gaps

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap-mobile)] md:gap-[var(--grid-gap-tablet)] lg:gap-[var(--grid-gap-desktop)]">
  {/* Items */}
</div>
```

---

## Files Already Created (Do Not Recreate)

### Dashboard Components (`components/dashboard/`)
- ✅ `StatCard.tsx`
- ✅ `ChartCard.tsx`
- ✅ `DataTable.tsx`
- ✅ `SectionContainer.tsx`

### Auth Pages (`app/(auth)/`)
- ✅ `login/page.tsx`
- ✅ `register/page.tsx`

### Admin Pages (`app/admin/`)
- ✅ `overview/page.tsx`
- ✅ `restaurants/page.tsx`
- ✅ `users/page.tsx`

### Dashboard Pages
- ✅ `owner/dashboard/page.tsx`
- ✅ `dashboard/page.tsx` (user)
- ✅ `settings/page.tsx`

---

## Next Steps

After reviewing this plan:

1. **Verify existing components** pass audit
2. **Create missing design-system primitives**
3. **Organize existing pages** into route groups
4. **Ensure responsive design** on all pages
5. **Run full audit** before merge

---

**Last Updated:** 2025-12-30
**Owner:** UI Designer Agent
**Dependencies:** None (Frontend-only work)
