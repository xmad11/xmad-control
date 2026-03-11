# 🎨 Shadi V2 - Design System & UI Guidelines

> **Version:** 1.0.0
> **Last Updated:** 2026-01-02
> **Purpose:** Complete guide for agents working on UI/UX in this codebase

---

## 📋 Table of Contents

1. [Core Principles](#core-principles)
2. [Design Tokens](#design-tokens)
3. [Theme System](#theme-system)
4. [Layout & Spacing](#layout--spacing)
5. [Component Guidelines](#component-guidelines)
6. [Responsive Design](#responsive-design)
7. [Typography](#typography)
8. [Colors](#colors)
9. [Icons](#icons)
10. [Images](#images)
11. [Animations](#animations)
12. [Special Components](#special-components)
13. [Performance](#performance)
14. [Forms](#forms)
15. [Accessibility](#accessibility)
16. [TypeScript Rules](#typescript-rules)
17. [CSS Rules](#css-rules)
18. [File Organization](#file-organization)
19. [Common Patterns](#common-patterns)
20. [What NOT to Do](#what-not-to-do)
21. [Modification Checklist](#modification-checklist)
22. [Related Documentation](#related-documentation)

---

## 1. CORE PRINCIPLES

### 1.1 Golden Rules

| Rule | Description |
|------|-------------|
| **🚫 NO HARDCODED VALUES** | Never use raw numbers (colors, spacing, sizes) |
| **🚫 NO INLINE STYLES** | Use utility classes or CSS modules, never `style={{}}` |
| **🚫 NO ANY TYPES** | Never use `any`, `unknown`, or TypeScript escapes |
| **✅ USE DESIGN TOKENS** | Always use `var(--token-name)` CSS variables |
| **✅ MOBILE FIRST** | Design for mobile, enhance for larger screens |
| **✅ 2-GRID MOBILE** | Dashboards use 2-column grid on mobile |

### 1.2 File Locations

```
styles/
├── tokens.css          # All design tokens (REQUIRED READING)
├── globals.css         # Global styles, utilities
└── themes.css          # Theme-related styles

components/
├── ui/                 # Reusable UI components (Button, Card, Badge)
├── layout/             # Layout components (Header, SideMenu, PageContainer)
├── grid/               # Grid components (ResponsiveGrid)
├── card/               # Card components (RestaurantCard, BlogCard)
└── form/               # Form components (Input, Select, etc.) - ADD IF MISSING

.audit/
├── design-exceptions.json  # Approved exceptions to design rules
└── token-coverage-report.json
```

---

## 2. DESIGN TOKENS

### 2.1 What are Design Tokens?

Design tokens are CSS custom properties that store design decisions. They are the **ONLY** way to specify values in this codebase.

**Location:** `styles/tokens.css`

### 2.2 Token Categories

#### Colors (OKLCH Space)
```css
/* Brand Colors */
--color-brand-primary      /* Main brand color - Terracotta Coral */
--color-brand-secondary    /* Secondary brand - Serene Blue */
--color-primary            /* Alias for brand-primary */
--color-secondary          /* Alias for brand-secondary */

/* Accent Colors */
--color-accent-rust        /* Warm, comfort food */
--color-accent-sage        /* Fresh, organic */
--color-accent-teal        /* Sophisticated, premium */
--color-accent-berry       /* Sweet, indulgent */
--color-accent-honey       /* Golden hour, comfort */

/* Semantic Colors */
--color-success
--color-warning
--color-error
--color-info

/* Neutral Scale */
--color-white
--color-black
--color-gray-50 through --color-gray-900  /* 10 steps */
```

#### Spacing (4px base unit)
```css
--spacing-unit: 0.25rem;

--spacing-xs    /* 0.25rem (4px) */
--spacing-sm    /* 0.5rem (8px) */
--spacing-md    /* 1rem (16px) */
--spacing-lg    /* 1.5rem (24px) */
--spacing-xl    /* 2rem (32px) */
--spacing-2xl   /* 3rem (48px) */
--spacing-3xl   /* 4rem (64px) */
--spacing-4xl   /* 6rem (96px) */
```

#### Section Gaps
```css
--section-gap-sm      /* Small sections */
--section-gap-md      /* Medium sections */
--section-gap-lg      /* Large sections */
--section-gap-mobile  /* Mobile sections */
--section-gap-tablet  /* Tablet sections */
--section-gap-desktop /* Desktop sections */
```

#### Typography
```css
/* Font Sizes */
--font-size-2xs   /* 0.625rem (10px) */
--font-size-xs    /* 0.75rem (12px) */
--font-size-sm    /* 0.875rem (14px) */
--font-size-base  /* 1rem (16px) */
--font-size-lg    /* 1.125rem (18px) */
--font-size-xl    /* 1.25rem (20px) */
--font-size-2xl   /* 1.5rem (24px) */
--font-size-3xl   /* 1.875rem (30px) */
--font-size-4xl   /* 2.25rem (36px) */
--font-size-5xl   /* 3rem (48px) */
--font-size-6xl   /* 3.75rem (60px) */

/* Line Heights */
--line-height-tight     /* 1.25 */
--line-height-normal    /* 1.5 */
--line-height-relaxed   /* 1.625 */

/* Letter Spacing */
--letter-spacing-tight    /* -0.025em */
--letter-spacing-normal   /* 0em */
--letter-spacing-wide     /* 0.025em */
--letter-spacing-wider    /* 0.05em */
```

#### Border Radius
```css
--radius-xs     /* 0.125rem (2px) */
--radius-sm     /* 0.25rem (4px) */
--radius-md     /* 0.375rem (6px) */
--radius-lg     /* 0.5rem (8px) */
--radius-xl     /* 0.75rem (12px) */
--radius-2xl    /* 1rem (16px) */
--radius-3xl    /* 2rem (32px) */
--radius-full   /* 9999px */
```

#### Shadows
```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl
--shadow-glass
--shadow-glass-strong
--shadow-card
```

#### Blur Effects
```css
--blur-xs    /* 4px */
--blur-sm    /* 8px */
--blur-md    /* 12px */
--blur-lg    /* 16px */
--blur-xl    /* 24px */
--blur-2xl   /* 40px */
```

#### Component-Specific Tokens
```css
/* Cards */
--card-height-mini      /* 140px */
--card-height-standard  /* 220px */
--card-height-rich      /* 300px */
--card-height-full      /* 420px */

/* Icons */
--icon-size-xs   /* 0.75rem */
--icon-size-sm   /* 1rem */
--icon-size-md   /* 1.25rem */
--icon-size-lg   /* 1.875rem */

/* Toggle Switch */
--toggle-width: 44px
--toggle-height: 24px
--toggle-thumb-size: 20px
--toggle-thumb-gap: 2px
--toggle-thumb-on-position: 22px

/* Touch Targets */
--touch-target-min: 2.75rem  /* 44px - minimum touch target size */
```

#### Layout Tokens
```css
/* Page */
--page-max-width        /* Maximum content width */
--page-padding-x        /* Horizontal page padding */
--page-top-offset       /* Offset for fixed header */

/* Header */
--header-height
--header-total-height
--header-logo-size

/* Side Menu */
--side-menu-width

/* Sections */
--section-spacing-mobile
--section-spacing-tablet
--section-spacing-desktop

/* Hero */
--hero-bg-height
--hero-marquee-gap

/* Forms */
--form-max-width
```

#### Z-Index Layers
```css
--z-skip-link: 200
--z-header: 100
--z-side-menu: 110
--z-side-menu-backdrop: 60
--z-theme-modal: 120
--z-theme-modal-backdrop: 80
--z-marquee-content: 10
```

#### Animation Tokens
```css
/* Durations */
--duration-fast:   /* Fast transitions */
--duration-normal:  /* Normal transitions */
--duration-slow:    /* Slow transitions */

/* Easing */
--ease-out-quart    /* Quartic ease out */
```

### 2.3 Using Tokens Correctly

#### ✅ CORRECT
```tsx
// Use CSS variables
<div className="p-[var(--spacing-md)] text-[var(--font-size-lg)]">
<div className="bg-[var(--color-primary)] text-[var(--color-white)]">
<div className="rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
```

#### ❌ WRONG
```tsx
// NEVER use hardcoded values
<div className="p-4 text-lg">           // Wrong!
<div className="bg-red-500 text-white"> // Wrong!
<div className="rounded-lg shadow-md">  // Wrong!

// NEVER use inline styles
<div style={{ padding: '16px' }}>      // Wrong!
<div style={{ color: '#f00' }}>        // Wrong!
```

---

## 3. THEME SYSTEM

### 3.1 Theme Provider

**File:** `context/ThemeContext.tsx`

The theme system provides:
1. **Light/Dark modes** - 3 themes total (light, dark, system)
2. **Accent colors** - 5 accent options (rust, sage, teal, berry, honey)
3. **Automatic detection** - Respects system preference

### 3.2 Using Theme Context

```tsx
import { useTheme } from "@/context/ThemeContext"

function MyComponent() {
  const { mode, accentColor, setMode, setAccentColor } = useTheme()

  // mode: "light" | "dark" | "system"
  // accentColor: "rust" | "sage" | "teal" | "berry" | "honey"
}
```

### 3.3 Theme-Aware Styling

```tsx
// Use CSS variables that automatically adapt to theme
<div className="bg-[var(--bg)] text-[var(--fg)]">
<div className="border border-[var(--fg-10)]">

// For theme-dependent classes
<div className={mode === "dark" ? "invert" : ""}>
```

### 3.4 Available CSS Variables by Theme

| Variable | Light | Dark |
|----------|-------|------|
| `--bg` | White (#FFFFFF) | Dark gray (#0A0A0A) |
| `--fg` | Nearly black (#0A0A0A) | Nearly white (#F5F5F5) |
| `--fg-10` through `--fg-90` | Opacity variants of fg | Same |

---

## 4. LAYOUT & SPACING

### 4.1 Container Pattern

**Component:** `components/layout/PageContainer.tsx`

```tsx
import { PageContainer } from "@/components/layout/PageContainer"

function MyPage() {
  return (
    <PageContainer>
      {/* Content automatically gets max-width and padding */}
      <section>...</section>
    </PageContainer>
  )
}
```

**What PageContainer does:**
- Sets `max-width: var(--page-max-width)`
- Sets `margin: 0 auto` (centering)
- Sets `padding: 0 var(--page-padding-x)`
- Responsive padding

### 4.2 Dashboard Layout

**Component:** `components/layout/DashboardLayout.tsx`

```tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout"

function MyDashboard() {
  return (
    <DashboardLayout userRole="user"> {/* or "owner" or "admin" */}
      <PageContainer>
        {/* Dashboard content */}
      </PageContainer>
    </DashboardLayout>
  )
}
```

**What DashboardLayout does:**
- Includes Header with role badge
- Includes SideMenu (role-aware)
- Includes ThemeModal support
- Panel management (menu, theme)
- Click-outside-to-close behavior

### 4.3 Grid Patterns

#### Responsive Grid (Preferred)

**Component:** `components/grid/ResponsiveGrid.tsx`

```tsx
import { ResponsiveGrid } from "@/components/grid/ResponsiveGrid"

<ResponsiveGrid variant="default">
  {/* Automatically: 2-col mobile, 3-col tablet, 4-col desktop */}
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

**Variants:**
- `default` - Standard gap
- `compact` - Smaller gap
- `spacious` - Larger gap

#### Manual Grid (When needed)

```tsx
{/* 2-Grid Mobile - REQUIRED for dashboards */}
<div className="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-3 lg:grid-cols-4">
  {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
</div>
```

### 4.4 Section Spacing

```tsx
{/* Standard section */}
<section className="py-[var(--spacing-lg)]">
  {/* Content */}
</section>

{/* Large section */}
<section className="py-[var(--section-gap-md)]">
  {/* Content */}
</section>

{/* Mobile-specific spacing */}
<section className="py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing-tablet)] lg:py-[var(--section-spacing-desktop)]">
  {/* Responsive vertical padding */}
</section>
```

### 4.5 Gap Between Sections

```tsx
{/* Standard gap */}
<div className="mb-[var(--section-gap-md)]">

{/* Or use margin bottom on sections */}
<section className="mb-[var(--section-gap-lg)]">
```

---

## 5. COMPONENT GUIDELINES

### 5.1 Using Existing Components

#### UI Components (`components/ui/`)

```tsx
import { Button, Badge, DashboardCard } from "@/components/ui"

// Button - ALWAYS use this, never create custom buttons
<Button variant="primary" size="md" leftIcon={<Icon />}>
  Click me
</Button>

// Badge
<Badge variant="success">Active</Badge>

// DashboardCard - ONLY for dashboards
<DashboardCard variant="primary" size="sm" title="24" subtitle="Saved" />
```

#### Card Components (`components/card/`)

```tsx
import { RestaurantCard, BlogCard, BaseCard } from "@/components/card"

// RestaurantCard - Display restaurant info
<RestaurantCard
  {...restaurantData}
  variant="standard"  // mini | standard | rich | full
  isFavorite={false}
  onFavoriteToggle={(id) => console.log(id)}
/>

// BlogCard - Display blog info
<BlogCard
  {...blogData}
  variant="standard"
/>

// BaseCard - ONLY for creating new card types
<BaseCard variant="standard" type="restaurant">
  {children}
</BaseCard>
```

### 5.2 Creating New Components

#### Component Template

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT NAME - Brief description
   What it does, when to use it
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client" // Only if using hooks or interactivity

import { memo } from "react"

// 1. Define props interface
export interface MyComponentProps {
  // Required props
  title: string
  // Optional props with defaults
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  // HTML attributes
  className?: string
  // Children
  children?: React.ReactNode
}

// 2. Default values
const defaultProps: Partial<MyComponentProps> = {
  variant: "primary",
  size: "md",
  className: "",
}

// 3. Component function
export const MyComponent = memo(function MyComponent({
  title,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: MyComponentProps) {

  // 4. Component logic here

  return (
    <div className={/* token-based classes */}>
      {/* JSX */}
    </div>
  )
})
```

#### Component Rules

| Rule | Description |
|------|-------------|
| **ALWAYS memo** | Wrap component exports in `memo()` for performance |
| **USE TypeScript** | Never omit type annotations |
| **NO ANY TYPES** | Always type props, never use `any` |
| **USE TOKENS** | Never use hardcoded values in className |
| **DEFAULT VALUES** | Provide sensible defaults for optional props |
| **DESTRUCTURE PROPS** | Destructure all props for clarity |
| **COMMENT HEADER** | Add header comment explaining component |
| **PROPS INTERFACE** | Export props interface for reuse |

### 5.3 Component DOs and DON'Ts

#### ✅ DO

```tsx
// Use design tokens
className="p-[var(--spacing-md)] text-[var(--font-size-lg)]"

// Use proper variants
<Button variant="primary" size="md">Click</Button>

// Use proper TypeScript
interface Props { title: string; count?: number }

// Memoize components
export const Component = memo(function Component({ title }: Props) {
  return <div>{title}</div>
})

// Use className for styling
className="flex items-center gap-[var(--spacing-sm)]"

// Use proper semantic HTML
<section>, <article>, <nav>, <main>, <header>, <footer>
```

#### ❌ DON'T

```tsx
// NEVER hardcode values
className="p-4 text-lg"

// NEVER use inline styles
style={{ padding: '16px', color: 'red' }}

// NEVER use any types
const data: any = await fetchData()

// NEVER use TypeScript escapes
// @ts-ignore, // @ts-expect-error (unless absolutely necessary)

// NEVER use div for everything
Use <section>, <article>, etc. where appropriate

// NEVER forget aria labels
<button> {/* Missing aria-label or content */} </button>

// NEVER use event handlers without types
onClick={(e: any) => { ... }} // Wrong!
onClick={(e: React.MouseEvent) => { ... }} // Correct
```

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints

```css
/* Mobile First Approach */
/* No @media needed for mobile - it's the default */

/* Tablet */
@media (min-width: 768px) { /* sm: */ }

/* Desktop */
@media (min-width: 1024px) { /* lg: */ }

/* Large Desktop */
@media (min-width: 1280px) { /* xl: */ }
```

### 6.2 Tailwind Responsive Classes

```tsx
{/* Mobile first, then enhance */}
<div className="
  text-[var(--font-size-sm)]        /* Mobile: small */
  sm:text-[var(--font-size-base)]    /* Tablet: base */
  lg:text-[var(--font-size-lg)]      /* Desktop: large */
">

{/* Grid columns */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">

{/* Hide/show elements */}
<div className="hidden lg:block"> {/* Desktop only */}
<div className="block lg:hidden"> {/* Mobile/tablet only */}

{/* Padding */}
<div className="px-[var(--spacing-md)] sm:px-[var(--spacing-xl)]">
```

### 6.3 Mobile Requirements

| Requirement | Description |
|-------------|-------------|
| **2-Grid Dashboards** | Dashboards MUST use `grid-cols-2` on mobile |
| **Touch Targets** | Minimum `44px` (`var(--touch-target-min)`) |
| **Full-width cards** | Cards take full available width on mobile |
| **Horizontal scroll** | Use for card lists on mobile |
| **Readable text** | Minimum `16px` (`var(--font-size-base)`) body text |

### 6.4 Dashboard Mobile Pattern

```tsx
{/* REQUIRED: 2-column grid for dashboards */}
<section>
  <h2 className="text-[var(--font-size-lg)] mb-[var(--spacing-md)]">
    Section Title
  </h2>
  <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
    {/* Exactly 2 columns on mobile */}
    <DashboardCard />
    <DashboardCard />
    <DashboardCard />
    <DashboardCard />
  </div>
</section>
```

---

## 7. TYPOGRAPHY

### 7.1 Font Sizes

```tsx
{/* Use design token font sizes */}
<h1 className="text-[var(--font-size-6xl)]"> {/* 60px - Hero title */}
<h2 className="text-[var(--font-size-4xl)]"> {/* 36px - Page title */}
<h3 className="text-[var(--font-size-2xl)]"> {/* 24px - Section title */}
<h4 className="text-[var(--font-size-xl)]">   {/* 20px - Card title */}
<p className="text-[var(--font-size-base)]">  {/* 16px - Body text */}
<small className="text-[var(--font-size-sm)]">  {/* 14px - Small text */}
<span className="text-[var(--font-size-xs)]">   {/* 12px - Caption */}
```

### 7.2 Font Weights

```tsx
{/* Using Tailwind utility classes */}
className="font-light"     /* 300 */
className="font-normal"    /* 400 */
className="font-medium"    /* 500 */
className="font-semibold"  /* 600 */
className="font-bold"      /* 700 */
className="font-black"     /* 900 */
```

### 7.3 Text Colors

```tsx
{/* Use semantic color variables */}
className="text-[var(--fg)]"          {/* Primary text */}
className="text-[var(--fg-90)]"       {/* Slightly muted */}
className="text-[var(--fg-70)]"       {/* Muted */}
className="text-[var(--fg-50)]"       {/* More muted */}
className="text-[var(--fg-30)]"       {/* Very muted */}

{/* Brand colors */}
className="text-[var(--color-primary)]"
className="text-[var(--color-secondary)]"
```

### 7.4 Heading Patterns

```tsx
{/* Page Title */}
<h1 className="text-[var(--font-size-4xl)] font-black tracking-tight">
  My <span className="text-[var(--color-primary)] italic">Page</span>
</h1>

{/* Section Title */}
<h2 className="text-[var(--font-size-2xl)] font-bold">
  Section <span className="text-[var(--color-primary)] italic">Title</span>
</h2>

{/* Card Title */}
<h3 className="text-[var(--font-size-xl)] font-semibold">
  Card Title
</h3>
```

---

## 8. COLORS

### 8.1 Using Colors Correctly

#### Background Colors
```tsx
{/* Theme-aware backgrounds */}
bg-[var(--bg)]           /* Main background */
bg-[var(--bg-50)]        /* Slightly lighter */
bg-[var(--fg-5)]         /* Very subtle tint */

{/* Brand colors */}
bg-[var(--color-primary)]
bg-[var(--color-secondary)]
bg-[var(--color-accent-rust)]

{/* Semantic colors */}
bg-[var(--color-success)]
bg-[var(--color-warning)]
bg-[var(--color-error)]
bg-[var(--color-info)]
```

#### Text Colors
```tsx
{/* Theme-aware text */}
text-[var(--fg)]         /* Primary text */
text-[var(--fg-90)]
text-[var(--fg-70)]
text-[var(--fg-50)]

{/* Brand text */}
text-[var(--color-primary)]
text-[var(--color-secondary)]
```

#### Border Colors
```tsx
{/* Theme-aware borders */}
border-[var(--fg-10)]    /* Subtle border */
border-[var(--fg-20)]    /* Medium border */
border-[var(--fg)]       /* Strong border */

{/* Brand borders */}
border-[var(--color-primary)]
```

#### Opacity with Tokens
```tsx
{/* Use opacity variable or / notation */}
bg-[var(--color-primary)]/10     /* 10% opacity */
opacity-[var(--opacity-medium)] /* Predefined opacity */
```

### 8.2 Available Opacity Tokens

```css
--opacity-faint   /* Very low opacity */
--opacity-quiet   /* Low opacity */
--opacity-muted   /* Medium opacity */
--opacity-medium  /* Medium-high opacity */
--opacity-strong  /* Strong opacity */
--opacity-full    /* Full opacity */
```

### 8.3 Color DOs and DON'Ts

#### ✅ DO
```tsx
// Use CSS variables
className="text-[var(--color-primary)]"
className="bg-[var(--fg-10)]"
className="border-[var(--fg-20)]"

// Use OKLCH color space in CSS
color: oklch(0.65 0.16 45.0);
```

#### ❌ DON'T
```tsx
// NEVER use hex colors
className="text-red-500"
className="bg-blue-600"
className="border-gray-300"

// NEVER use RGB/HSL
className="text-rgb(255-0-0)"

// NEVER use Tailwind default colors
className="bg-gray-500"
className="text-blue-400"
```

---

## 9. ICONS

### 9.1 Icon Library

We use **Heroicons** (React)

```bash
import {
  HeartIcon,
  StarIcon,
  MapPinIcon,
  // etc.
} from "@heroicons/react/24/outline"
```

### 9.2 Icon Sizes

```tsx
import { HeartIcon } from "@heroicons/react/24/outline"

{/* Use design token sizes */}
<HeartIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />  {/* 16px */}
<HeartIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />  {/* 20px */}
<HeartIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />  {/* 30px */}
```

### 9.3 Icon with Button/Card

```tsx
<button className="flex items-center gap-[var(--spacing-xs)]">
  <HeartIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
  <span>Save</span>
</button>

<DashboardCard
  icon={<StarIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
  title="24"
  subtitle="Saved"
/>
```

### 9.4 Icon Accessibility

```tsx
{/* Decorative icons */}
<HeartIcon aria-hidden="true" />

{/* Icons as buttons */}
<button aria-label="Add to favorites">
  <HeartIcon />
</button>

{/* Icons with meaning */}
<HeartIcon aria-label="Save to favorites" />
```

---

## 10. IMAGES

### 10.1 Image Components

#### Next.js Image (Preferred)

```tsx
import Image from "next/image"

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  className="rounded-[var(--radius-lg)]"
/>
```

#### Standard img Tag

```tsx
<img
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-auto rounded-[var(--radius-lg)]"
/>
```

### 10.2 Image Patterns

#### Responsive Images
```tsx
{/* Mobile-first images */}
<Image
  src="/restaurant.jpg"
  alt="Restaurant"
  width={800}
  height={600}
  className="w-full h-auto object-cover"
/>
```

#### Avatar Images
```tsx
<div className="h-[120px] w-[120px] rounded-[var(--radius-full)] overflow-hidden">
  <img src="/avatar.jpg" alt="User" className="w-full h-full object-cover" />
</div>
```

### 10.3 Image DOs and DON'Ts

#### ✅ DO
```tsx
// Always provide alt text
<img src="/photo.jpg" alt="Delicious food at restaurant" />

// Use object-cover for containers
className="w-full h-full object-cover"

// Use appropriate rounded corners
className="rounded-[var(--radius-lg)]"

// Optimize images
<Image width={800} height={600} />
```

#### ❌ DON'T
```tsx
// NEVER omit alt
<img src="/photo.jpg" alt="" />  // Wrong!

// NEVER stretch images
className="w-full h-full"  // Without object-fit

// NEVER use placeholder alt unless decorative
<img src="/icon.jpg" alt="icon" />  // Use aria-hidden instead
```

---

## 11. ANIMATIONS

### 11.1 Animation Tokens

```css
/* Durations */
--duration-fast   /* Fast, snappy transitions */
--duration-normal  /* Standard transitions */
--duration-slow    /* Slow, deliberate transitions */

/* Easing */
--ease-out-quart   /* Quartic ease out for smooth feel */
```

### 11.2 Common Animations

#### Transitions
```tsx
{/* Smooth color transition */}
className="transition-colors duration-[var(--duration-normal)]"

{/* Smooth transform */}
className="transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]"

{/* All transitions */}
className="transition-all duration-[var(--duration-normal)]"
```

#### Hover Effects
```tsx
{/* Scale on hover */}
className="hover:scale-105 transition-transform duration-[var(--duration-normal)]"

{/* Color change on hover */}
className="hover:text-[var(--color-primary)] transition-colors duration-[var(--duration-normal)]"

{/* Shadow change on hover */}
className="hover:shadow-[var(--shadow-lg)] transition-shadow duration-[var(--duration-normal)]"
```

### 11.3 Built-in Animations

```css
/* Available in tokens.css */
@keyframes fade-in
@keyframes fade-in-up
@keyframes slide-in-right
@keyframes slide-in-left
@keyframes scale-in
@keyframes float
@keyframes marquee-scroll-left
@keyframes marquee-scroll-right
@keyframes cursor-blink
```

### 11.4 Animation DOs and DON'Ts

#### ✅ DO
```tsx
// Use design tokens for duration
duration-[var(--duration-normal)]

// Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  /* Disable or simplify animations */
}

// Keep animations subtle
scale-105  /* 5% increase */
translate-y-1  /* Small movement */
```

#### ❌ DON'T
```tsx
// NEVER use long durations
duration-1000  // Too long!

// NEVER use jarring animations
scale-150  // Too much!

// NEVER ignore accessibility
// Always respect prefers-reduced-motion
```

---

## 12. FORMS

### 12.1 Form Component Structure

```tsx
{/* Form container */}
<form className="space-y-[var(--spacing-md)]">
  {/* Form fields with consistent spacing */}
  <div className="space-y-[var(--spacing-sm)]">
    <label>...</label>
    <input />
    {error && <p>{error}</p>}
  </div>
</form>
```

### 12.2 Form Spacing

```tsx
{/* Vertical spacing between fields */}
<div className="space-y-[var(--spacing-md)]">
  {/* Each field gets consistent spacing */}
</div>

{/* Gap between label and input */}
<label className="block mb-[var(--spacing-xs)]">Label</label>
```

### 12.3 Form Input Styling

```tsx
{/* Input field */}
<input
  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)]
             rounded-[var(--radius-md)] border border-[var(--fg-20)]
             bg-[var(--bg)] text-[var(--fg)]
             focus:ring-[var(--focus-ring-width)]
             focus:ring-[var(--color-primary)]"
/>

{/* Button */}
<button className="px-[var(--spacing-lg)] py-[var(--spacing-md)]
                   rounded-[var(--radius-lg)]
                   bg-[var(--color-primary)] text-[var(--color-white)]">
  Submit
</button>
```

### 12.4 Form DOs and DON'Ts

#### ✅ DO
```tsx
// Use proper input types
<input type="email" />
<input type="password" />
<input type="tel" />

// Provide labels
<label htmlFor="email">Email</label>
<input id="email" />

// Show validation errors
{error && <p className="text-[var(--color-error)]">{error}</p>}

// Use loading states
<button disabled={isLoading}>
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

#### ❌ DON'T
```tsx
// NEVER omit labels
<input placeholder="Email" />  // Label missing!

// NEVER use placeholder as label
<input placeholder="Enter your name" />  // Wrong!

// NEVER ignore validation
<input />  // No validation, no error handling
```

---

## 13. ACCESSIBILITY

### 13.1 Semantic HTML

```tsx
{/* Use semantic elements */}
<header>     {/* Page header */}
<nav>        {/* Navigation */}
<main>       {/* Main content */}
<section>    {/* Section of content */}
<article>    {/* Self-contained content */}
<aside>      {/* Sidebar content */}
<footer>     {/* Page footer */}
```

### 13.2 ARIA Labels

```tsx
{/* Decorative icons */}
<HeartIcon aria-hidden="true" />

{/* Buttons with icons */}
<button aria-label="Add to favorites">
  <HeartIcon />
</button>

{/* Links */}
<a aria-label="View restaurant details" href="/restaurants/1">

{/* Live regions for dynamic content */}
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### 13.3 Keyboard Navigation

```tsx
{/* Ensure all interactive elements are keyboard accessible */}
<button> {/* Works with keyboard */} </button>
<a href="/"> {/* Works with keyboard */} </a>

{/* Add visible focus indicators */}
<button className="focus:ring-[var(--focus-ring-width)]
                 focus:ring-[var(--color-primary)]">
```

### 13.4 Contrast Ratios

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 contrast ratio

---

## 14. TYPESCRIPT RULES

### 14.1 Strict Type Requirements

```tsx
// ✅ CORRECT - Always type props
interface ButtonProps {
  variant: "primary" | "secondary"
  size: "sm" | "md" | "lg"
  children: React.ReactNode
}

// ❌ WRONG - Never use any
interface ButtonProps {
  variant: any  // Wrong!
  size: any     // Wrong!
}
```

### 14.2 Type Imports

```tsx
// Import types from their source
import type { RestaurantCardData } from "@/components/card"
import type { Metadata } from "next"
```

### 14.3 Component Props Pattern

```tsx
// 1. Extend HTML attributes for interactive elements
export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

// 2. Use for non-interactive elements
export interface CardProps {
  title: string
  description?: string
}

// 3. Destructure with ...props for rest
export const Button = memo(function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props  // Pass through to button
}: ButtonProps) {
  return (
    <button
      className={/* ... */}
      {...props}
    >
      {children}
    </button>
  )
})
```

### 14.4 Typing Event Handlers

```tsx
// ✅ CORRECT
onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  // Handle click
}}

onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}}

// ❌ WRONG
onClick={(e: any) => { ... }}  // Never!
onClick={(e) => { ... }}       // Always type events
```

### 14.5 Avoiding TypeScript Escapes

```tsx
// ❌ AVOID - Only use when absolutely necessary
// @ts-ignore
// @ts-expect-error
as any
as unknown
as never

// ✅ INSTEAD - Properly type the data
interface UserData {
  name: string
  email: string
}
const data: UserData = await fetchData()
```

---

## 15. CSS RULES

### 15.1 Forbidden Patterns

#### ❌ NEVER Use These

```tsx
// Hardcoded colors
"text-red-500"
"bg-blue-600"
"border-gray-300"
"#FF0000"
"rgb(255, 0, 0)"

// Hardcoded spacing
"p-4"              // Use p-[var(--spacing-md)]
"m-8"              // Use m-[var(--spacing-xl)]
"gap-2"            // Use gap-[var(--spacing-sm)]
"w-44"             // Use w-[var(--toggle-width)]

// Hardcoded sizes
"h-20"             // Check if token exists first
"w-16"
"text-lg"          // Use text-[var(--font-size-lg)]

// Inline styles
style={{ padding: '16px' }}
style={{ color: 'red' }}
style={{ width: '100px' }}

// Old Tailwind colors
"bg-gray-500"       // Use bg-[var(--fg)]
"text-blue-400"     // Use text-[var(--color-primary)]
```

### 15.2 Required Patterns

#### ✅ ALWAYS Use These

```tsx
// Design tokens for everything
"text-[var(--font-size-lg)]"
"p-[var(--spacing-md)]"
"bg-[var(--color-primary)]"
"rounded-[var(--radius-lg)]"
"shadow-[var(--shadow-md)]"

// CSS custom properties with oklch
"bg-oklch(var(--color-brand-primary))"
"text-oklch(var(--color-primary))"

// Proper utility classes
"flex items-center gap-[var(--spacing-sm)]"
"grid grid-cols-2 gap-[var(--spacing-md)]"
```

### 15.3 CSS Variable Pattern

```tsx
{/* Single variable */}
className="text-[var(--color-primary)]"

{/* Variable with fallback */}
className="text-[var(--color-primary, oklch(0.65 0.16 45.0))]"

{/* Variable with opacity */}
className="bg-[var(--color-primary)]/10"
```

---

## 16. FILE ORGANIZATION

### 16.1 Component File Structure

```
components/
├── ui/
│   ├── Button.tsx          # Reusable button
│   ├── Badge.tsx           # Reusable badge
│   ├── Card.tsx            # DashboardCard
│   └── index.ts            # Barrel export
├── layout/
│   ├── Header.tsx          # Site header
│   ├── SideMenu.tsx        # Navigation menu
│   ├── PageContainer.tsx   # Page wrapper
│   └── DashboardLayout.tsx # Dashboard wrapper
├── card/
│   ├── BaseCard.tsx        # Card base
│   ├── RestaurantCard.tsx  # Restaurant card
│   ├── BlogCard.tsx        # Blog card
│   └── index.ts
├── grid/
│   ├── ResponsiveGrid.tsx  # Responsive grid
│   └── index.ts
└── form/                   # ADD THIS IF MISSING
    ├── Input.tsx           # Text input
    ├── Select.tsx          # Select dropdown
    ├── Checkbox.tsx        # Checkbox
    └── index.ts
```

### 16.2 Features File Structure

```
features/
├── home/
│   ├── HomeClient.tsx      # Home page
│   ├── hero.tsx            # Hero section
│   ├── sections/           # Home sections
│   │   ├── index.ts
│   │   ├── HomeTabs.tsx
│   │   ├── ForYouSections.tsx
│   │   ├── PlacesSections.tsx
│   │   └── StoriesSections.tsx
│   └── index.ts
├── blog/
│   ├── BlogClient.tsx      # Blog listing
│   ├── BlogDetailClient.tsx # Blog detail
│   ├── BlogSearch.tsx      # Blog search
│   └── index.ts
├── restaurant/
│   ├── RestaurantDetailClient.tsx
│   └── index.ts
└── dashboard/
    ├── UserDashboard.tsx
    ├── OwnerDashboard.tsx
    ├── AdminDashboard.tsx
    └── index.ts
```

### 16.3 Page File Structure

```
app/
├── (marketing)/
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Marketing layout
│   └── globals.css
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── user/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── owner/
│   └── admin/
├── blog/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   ├── loading.tsx
│   └── error.tsx
└── restaurants/
    ├── page.tsx
    ├── [slug]/page.tsx
    ├── loading.tsx
    └── error.tsx
```

---

## 17. COMMON PATTERNS

### 17.1 Page Pattern

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE NAME - Brief description
   ═══════════════════════════════════════════════════════════════════════════════ */

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title - Shadi V2",
  description: "Page description",
}

function PageClient() {
  return (
    <DashboardLayout userRole="user">
      <PageContainer>
        {/* Page content */}
      </PageContainer>
    </DashboardLayout>
  )
}

export default function Page() {
  return <PageClient />
}
```

### 17.2 Section Pattern

```tsx
{/* Section with proper spacing */}
<section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-lg)]">
  {/* Section header */}
  <div className="flex items-center justify-between mb-[var(--spacing-md)]">
    <h2 className="text-[var(--font-size-2xl)] font-bold">
      Section <span className="text-[var(--color-primary)] italic">Title</span>
    </h2>
  </div>

  {/* Section content */}
  <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
    {/* Cards */}
  </div>
</section>
```

### 17.3 Card Pattern

```tsx
{/* Dashboard card with icon */}
<DashboardCard
  variant="primary"    // primary | default | success | warning | error
  size="md"            // sm | md | lg
  icon={<Icon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]" />}
  title="24"
  subtitle="Saved Restaurants"
/>

{/* Restaurant card */}
<RestaurantCard
  {...restaurantData}
  variant="standard"    // mini | standard | rich | full
  isFavorite={false}
  onFavoriteToggle={(id) => console.log(id)}
/>
```

### 17.4 Button Pattern

```tsx
{/* Standard button */}
<Button
  variant="primary"    // primary | secondary | outline | ghost
  size="md"            // sm | md | lg
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  isLoading={false}
>
  Click me
</Button>
```

### 17.5 Loading Pattern

```tsx
import { PageLoadingFallback } from "@/components/layout"

export default function Page() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <AsyncContent />
    </Suspense>
  )
}
```

### 17.6 Error Boundary Pattern

```tsx
// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-[var(--font-size-2xl)] font-bold mb-[var(--spacing-md)]">
          Something went wrong!
        </h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  )
}
```

---

## 18. WHAT NOT TO DO

### 18.1 Forbidden Patterns

#### ❌ NEVER Hardcode Values

```tsx
// Colors
className="bg-red-500 text-white"
className="border-gray-300"
style={{ color: '#FF0000' }}

// Spacing
className="p-4 m-2 gap-2"
className="w-44 h-24"

// Sizes
className="text-lg"
className="text-xl"
className="w-full h-20"

// Border radius
className="rounded-lg"
className="rounded-full"

// Shadows
className="shadow-md"
```

#### ❌ NEVER Use Inline Styles

```tsx
// All of these are WRONG
style={{ padding: '16px' }}
style={{ margin: '0 auto' }}
style={{ backgroundColor: 'red' }}
style={{ width: '100px' }}
<div style={customStyleObject}>
```

#### ❌ NEVER Use TypeScript Escapes

```tsx
// All of these are WRONG
const data: any = ...
const item: unknown = ...
// @ts-ignore
// @ts-expect-error
as any
as never
```

#### ❌ NEVER Skip Accessibility

```tsx
// All of these are WRONG
<button> {/* No aria-label, no content */} </button>
<img src="/photo.jpg" />  {/* No alt */}
<div onClick={...}>      {/* Should be button */}
```

#### ❌ NEVER Create Duplicate Components

```tsx
// WRONG - Creating custom button
// Use components/ui/Button.tsx instead!

// WRONG - Creating custom card
// Use components/card/RestaurantCard.tsx or BlogCard.tsx!

// WRONG - Creating custom grid
// Use components/grid/ResponsiveGrid.tsx!
```

### 18.2 When You Can Break Rules

#### ✅ ALLOWED Exceptions

```tsx
// 1. Design exceptions (must be documented)
/* @design-exception HARDCODED_SPACING: Reason for exception */

// 2. In .audit/design-exceptions.json
{
  "id": "exception-id",
  "component": "path/to/component.tsx",
  "reason": "EXCEPTION_TYPE",
  "annotation": "Detailed explanation",
  "status": "active"
}

// 3. Third-party library requirements
// Some libraries require inline styles - document why
```

---

## 19. QUICK REFERENCE

### 19.1 Token Quick Reference

| Category | Token | Value | Usage |
|----------|-------|-------|-------|
| **Spacing** | `--spacing-xs` | 4px | Tight spacing |
| **Spacing** | `--spacing-sm` | 8px | Small gap |
| **Spacing** | `--spacing-md` | 16px | Default spacing |
| **Spacing** | `--spacing-lg` | 24px | Medium spacing |
| **Spacing** | `--spacing-xl` | 32px | Large spacing |
| **Text** | `--font-size-xs` | 12px | Caption |
| **Text** | `--font-size-sm` | 14px | Small text |
| **Text** | `--font-size-base` | 16px | Body text |
| **Text** | `--font-size-lg` | 18px | Subtitle |
| **Text** | `--font-size-xl` | 20px | Section title |
| **Text** | `--font-size-2xl` | 24px | Card title |
| **Text** | `--font-size-4xl` | 36px | Page title |
| **Radius** | `--radius-md` | 6px | Default radius |
| **Radius** | `--radius-lg` | 8px | Cards |
| **Radius** | `--radius-xl` | 12px | Larger cards |
| **Radius** | `--radius-full` | 9999px | Circular |

### 19.2 Component Quick Reference

| Component | Import | Usage |
|-----------|--------|-------|
| **Button** | `@/components/ui` | All buttons |
| **Badge** | `@/components/ui` | Status indicators |
| **DashboardCard** | `@/components/ui` | Dashboard cards only |
| **RestaurantCard** | `@/components/card` | Restaurant display |
| **BlogCard** | `@/components/card` | Blog display |
| **PageContainer** | `@/components/layout` | Page wrapper |
| **DashboardLayout** | `@/components/layout` | Dashboard wrapper |
| **ResponsiveGrid** | `@/components/grid` | Responsive grids |

### 19.3 Pattern Quick Reference

| Pattern | Code |
|---------|------|
| **2-Grid Mobile** | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` |
| **Section spacing** | `py-[var(--spacing-lg)]` or `py-[var(--section-gap-md)]` |
| **Card grid** | `<ResponsiveGrid variant="default">` |
| **Centered flex** | `flex items-center justify-center` |
| **Gap between items** | `gap-[var(--spacing-md)]` |
| **Horizontal scroll** | `flex overflow-x-auto gap-[var(--spacing-md)] scrollbar-hide` |

---

## 20. CHECKLIST FOR NEW COMPONENTS

Before creating a new component, check:

- [ ] Does an existing component serve this purpose?
- [ ] Have I checked `components/ui/`, `components/card/`, etc.?
- [ ] Am I using design tokens for ALL values?
- [ ] Is my component properly typed (no `any`)?
- [ ] Did I wrap my component in `memo()`?
- [ ] Is my component accessible (aria labels, keyboard nav)?
- [ ] Did I add a header comment explaining the component?
- [ ] Is my component responsive (mobile-first)?
- [ ] Did I export the props interface?
- [ ] Did I add the component to an index.ts barrel export?

---

## 21. GETTING HELP

### 21.1 Design Token Reference

**File:** `styles/tokens.css`

This is your SOURCE OF TRUTH for all design tokens. Read it before creating new components.

### 21.2 Component Examples

**Best Places to Learn:**
- `components/ui/Button.tsx` - Proper component structure
- `components/card/RestaurantCard.tsx` - Card pattern
- `features/dashboard/UserDashboard.tsx` - Dashboard pattern
- `app/(marketing)/page.tsx` - Page pattern

### 21.3 Design Exceptions

**File:** `.audit/design-exceptions.json`

Before adding a hardcoded value, check if an exception exists or needs to be added.

---

## 22. SPECIAL COMPONENTS

> **IMPORTANT:** These components have unique implementation details. See `documentation/DESIGN_SUMMARY.md` for complete reference.

### 22.1 Hero Section (`features/home/hero/`)

#### HeroTitle Component

**Location:** `features/home/hero/HeroTitle.tsx`

```tsx
// Font Sizes (responsive)
text-[calc(var(--font-size-5xl)*1.0)]       // 3rem mobile
sm:text-[calc(var(--font-size-5xl)*1.3)]     // 3.9rem tablet+
lg:text-[calc(var(--font-size-6xl)*1.2)]     // 4.5rem desktop (actual: 1.2, not 1.5)

// Typography
font-black                                    // Weight 900
tracking-[var(--letter-spacing-tight)]       // -0.025em
leading-[var(--hero-display-line-height)]    // 1.04
text-left                                     // Alignment

// Spacing between lines
space-y-[var(--spacing-xs)]                  // Vertical gap between title lines
```

#### HeroSubtitle Component

**Location:** `features/home/hero/HeroSubtitle.tsx`

```tsx
// Font Size (responsive - uses token)
text-[var(--hero-subtitle-size)]              // clamp(1rem, 2vw, 1.25rem)

// Typography
font-normal                                   // Weight 400
leading-[var(--line-height-normal)]          // 1.5
mt-[var(--hero-subtitle-gap)]                // 0.5rem - very small spacing for typing

// Layout
inline-block align-baseline                   // Prevent layout shifts
```

#### Hero Layout

**Location:** `features/home/hero/Hero.tsx`

```tsx
// Grid Layout
grid-cols-1                                   // Mobile: stacked
lg:grid-cols-[1fr_1fr]                        // Desktop: 50/50 split
lg:min-h-[calc(100vh-var(--header-total-height))]  // Full viewport height minus header
gap-[var(--hero-gap-tight)]                   // Tight gap between sections

// Z-Index Layering
z-20 (title + subtitle)                       // Always on top
z-10 (marquee - desktop only, pointer-events-none)

// Mobile: Top spacer to break vertical centering
block lg:hidden h-[var(--spacing-xl)]         // Mobile-only spacer
```

### 22.2 Morphing Text Animation

**Location:** `components/typography/MorphingText.tsx`

#### Animation Constants
```tsx
MORPH_TIME = 1.5        // Seconds for morph transition
COOLDOWN_TIME = 0.5     // Seconds pause between words
```

#### Current Rotating Words
```tsx
["Experiences", "Flavors", "Spots", "Discoveries", "Moments"]
```
**Location:** Defined in `HeroTitle.tsx` as `MORPH_WORDS_EN`

#### Filter Values (CRITICAL - DO NOT CHANGE)
```tsx
// Container filter during morph
container.style.filter = "url(#threshold) blur(var(--text-morph-blur))"
// --text-morph-blur = 0.4px (defined in tokens.css)

// Blur calculations (per-frame)
blur2 = Math.min(8 / fraction - 8, 100)       // Incoming text blur
blur1 = Math.min(8 / (1 - fraction) - 8, 100) // Outgoing text blur

// Opacity calculations
opacity2 = fraction ** 0.4 * 100%             // Incoming text opacity
opacity1 = (1 - fraction) ** 0.4 * 100%       // Outgoing text opacity
```

#### SVG Threshold Filter (DO NOT MODIFY)
```xml
<filter id="threshold">
  <feColorMatrix
    type="matrix"
    values="1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 255 -140"
  />
</filter>
```

#### Performance Optimizations (DO NOT REMOVE)
1. `IntersectionObserver` with `rootMargin: "100px"` - pauses animation when off-screen
2. CSS containment `contain: "layout style paint"`
3. `memo()` on SvgFilters and Texts components
4. Batch DOM updates via `cssText`

### 22.3 Typing Animation

**Location:** `components/TypingAnimation/index.tsx`

#### Current Phrases
```tsx
[
  "personally visited and reviewed",
  "hidden gems across the UAE",
  "real food experiences, no ads",
  "places worth your time",
  "honest recommendations only",
]
```
**Location:** Defined in `HeroSubtitle.tsx` as `TYPING_PHRASES`

#### Animation Timing
```tsx
typingSpeed = 50          // ms per character (default prop)
phraseDelay = 2000        // ms pause at end of phrase (default prop)
deletingSpeed = typingSpeed / 2   // 25ms (calculated inline in useEffect)
```
**Component Props:** `typingSpeed?`, `phraseDelay?`, `showCursor?` (all optional)

#### Cursor Styles
```tsx
w-[var(--cursor-width)]   // 2px width
mr-[var(--cursor-gap)]    // 2px gap from text
animate-[cursor-blink_var(--cursor-blink-duration)_step-end_infinite]
// cursor-blink-duration = 1s
```

### 22.4 Marquee Component

**Location:** `components/marquee/Marquee.tsx`

#### Modes
- `horizontal-dual`: 2 rows, opposing motion (mobile)
- `vertical-3d-dual`: 3 columns, 3D perspective (desktop)

#### Size Control Tokens
```css
--marquee-gap: var(--spacing-md)                    /* 16px desktop */
--marquee-gap-mobile: var(--spacing-xs)             /* 4px mobile */
--marquee-row-gap: var(--spacing-md)                /* 16px desktop */
--marquee-row-gap-mobile: var(--spacing-sm)         /* 8px mobile */
--marquee-card-size-mobile: 80px                    /* Square cards mobile (actual: 80px, not 70px) */
--marquee-card-size-tablet: 100px                   /* Square cards tablet */
--marquee-card-size-desktop: 120px                  /* Square cards desktop */
--marquee-card-size-large: 140px                    /* Large cards */
--marquee-card-fluid: clamp(80px, 12vw, 140px)      /* Fluid responsive sizing */
--marquee-3d-gap: 16px                              /* 3D mode gap */
--marquee-3d-duration: 20s                          /* 3D mode animation duration */
--marquee-fade-width: 32px                          /* Edge fade width (actual: 32px, not 80px) */
```

#### Performance Requirements
- **CRITICAL**: Use `CardPreview` (not `Card`) for marquee items
- `CardPreview` has DOM < 15 nodes, no glass, no carousel
- **Smart fill**: Automatically duplicates children to minimum of 6 cards for seamless loop
- 2x duplication required for seamless loop (firstCopy + secondCopy)
- GPU-only transforms (translate3d)
- `useVisibilityPause` hook pauses animation when off-screen
- `content-visibility: auto` for performance

#### Edge Fade Gradients
```css
/* Horizontal mode - fades left/right edges */
.fade-horizontal {
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* 3D mode - fades all edges */
.fade-3d {
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
}
```
**Note:** These are defined in `styles/globals.css` and applied via `marquee-container` classes.

#### Animation Durations (Horizontal Mode)
```tsx
// Top row (moves left)
animation-duration: 35s

// Bottom row (moves right)
animation-duration: 40s
```

### 22.5 Theme Modal

**Location:** `components/layout/ThemeModal.tsx`

#### Size & Position
```tsx
w-[var(--side-menu-width)]              /* Same width as SideMenu */
fixed right-0 top-[var(--theme-modal-top-aligned)]  /* Aligned with header icon */
z-[var(--z-theme-modal)]
p-[var(--spacing-md)]
```

#### Special Behaviors
- Close on backdrop click
- Close on Escape key
- Compact design (no scrolling)
- Glass effect with backdrop blur

### 22.6 SideMenu

**Location:** `components/layout/SideMenu.tsx`

#### Size & Position
```tsx
w-[var(--side-menu-width)]              /* 13.2rem */
fixed right-0 top-[var(--header-offset-top)]  /* Aligned with header */
h-[calc(100vh-var(--header-offset-top))]      /* Full viewport height minus offset */
z-[var(--z-side-menu)]
animate-in slide-in-from-right            /* Slides from right, not left */
rounded-l-[var(--panel-radius)]           /* Left border radius only */
```

#### Special Behaviors
- Locks body scroll when open
- Close on Escape key
- Close on backdrop click
- Role-aware menu items

### 22.7 Card Components

#### CardPreview (Marquee Only)

**Location:** `components/card/CardPreview.tsx`

```tsx
// Purpose: Lightweight marquee-only card
// DOM: < 15 nodes
// NO carousel, badges, rating, actions, glass (performance-critical)
// Size: Uses --marquee-card-size-* tokens
```

#### RestaurantCard / BlogCard

**Location:** `components/card/RestaurantCard.tsx`, `components/card/BlogCard.tsx`

```tsx
// Variants: mini | standard | rich | full
// Heights locked:
//   mini: 140px
//   standard: 220px
//   rich: 300px
//   full: 420px
```

---

## 23. PERFORMANCE

### 23.1 Performance Guidelines

#### Component Performance

| Component | Performance Notes |
|-----------|-------------------|
| **Marquee** | Use `CardPreview` not `Card`, GPU-only transforms, `content-visibility: auto` |
| **MorphingText** | `IntersectionObserver` to pause when off-screen, CSS containment |
| **TypingAnimation** | Pauses on focus, respects `prefers-reduced-motion` |
| **Hero** | Optimize images, defer non-critical JS |

#### Performance DOs

```tsx
// ✅ Use CSS containment
contain: "layout style paint"

// ✅ Use content-visibility
content-visibility: auto

// ✅ Use IntersectionObserver for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Resume animation
    } else {
      // Pause animation
    }
  })
}, { rootMargin: "100px" })

// ✅ Use GPU-only transforms
transform: translate3d(x, y, z)
transform: translateZ(0)  // Force GPU

// ✅ Memoize expensive components
export const ExpensiveComponent = memo(function ExpensiveComponent({ ... }) {
  // ...
})
```

#### Performance DON'Ts

```tsx
// ❌ DON'T use heavy components in marquees
<Marquee>
  <Card {...data} />  {/* WRONG! Use CardPreview instead */}
</Marquee>

// ❌ DON'T animate when off-screen
// Always use IntersectionObserver to pause

// ❌ DON'T use layout thrashing
// Don't read then write to DOM in loop
element.style.height = element.offsetHeight + 'px'  // WRONG!

// ❌ DON'T create new functions in render
onClick={() => handleClick()}  // WRONG if handleclick is recreated each render
```

---

## 24. GLASS EFFECT PATTERN

### 24.1 Glassmorphism Utility

```tsx
// Apply glass effect to any element
className="glass"
```

#### Glass Effect CSS

```css
/* Base glass effect defined in globals.css */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-2xl));
  border: var(--border-width-thin) solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}
```

### 24.2 Glass Variants

```tsx
// Header glass (on scroll)
className="glass-header"

// Card with glass
className="glass-card"

// Modal glass
className="glass-modal"
```

### 24.3 Theme-Aware Glass

```css
/* Glass colors change by theme mode */

/* Light Mode */
--glass-bg: rgba(255, 255, 255, 0.35);
--glass-border: rgba(255, 255, 255, 0.5);

/* Dark Mode */
--glass-bg: rgba(30, 35, 45, 0.5);
--glass-border: rgba(255, 255, 255, 0.08);

/* Warm Mode */
--glass-bg: rgba(245, 235, 220, 0.4);
--glass-border: rgba(200, 180, 150, 0.3);
```

---

## 25. MODIFICATION CHECKLIST

> **BEFORE modifying any component, complete this checklist:**

### 25.1 Pre-Modification Checklist

- [ ] Have I read `documentation/DESIGN_SUMMARY.md` for current implementation?
- [ ] Have I checked `styles/tokens.css` for available CSS variables?
- [ ] Does an existing component already serve this purpose?
- [ ] Am I using design tokens for ALL values?
- [ ] Is my change backward compatible?
- [ ] Have I tested in all 3 theme modes (light, warm, dark)?
- [ ] Have I tested responsive breakpoints (mobile, tablet, desktop)?
- [ ] Have I tested with `prefers-reduced-motion`?
- [ ] Will this affect performance? (use React DevTools Profiler)
- [ ] Does this violate any design token rules?

### 25.2 Animation-Specific Checklist

- [ ] Does animation respect `prefers-reduced-motion`?
- [ ] Does animation pause when element is off-screen?
- [ ] Is animation using GPU-only transforms?
- [ ] Is animation using CSS containment?
- [ ] Are animation durations using design tokens?
- [ ] Does animation use proper easing functions?

### 25.3 Accessibility Checklist

- [ ] Are touch targets at least `var(--touch-target-min)` (44px)?
- [ ] Do interactive elements have visible focus indicators?
- [ ] Are images properly alt-tagged?
- [ ] Are buttons properly labeled?
- [ ] Does keyboard navigation work correctly?
- [ ] Are ARIA labels present where needed?
- [ ] Is color contrast sufficient (4.5:1 for normal text)?

### 25.4 TypeScript Checklist

- [ ] Are all props properly typed?
- [ ] Am I avoiding `any` types?
- [ ] Am I avoiding TypeScript escapes (`@ts-ignore`, etc.)?
- [ ] Are event handlers properly typed?
- [ ] Are all interfaces exported?

### 25.5 CSS Checklist

- [ ] Am I using CSS variables for ALL values?
- [ ] Are there NO hardcoded colors (hex, rgb, Tailwind defaults)?
- [ ] Are there NO hardcoded spacing values?
- [ ] Are there NO inline styles?
- [ ] Am I using proper Tailwind token syntax?

---

## 26. RELATED DOCUMENTATION

### 26.1 Essential Reading

| Document | Purpose | Location |
|----------|---------|----------|
| **DESIGN_SUMMARY.md** | Current implementation details | `documentation/DESIGN_SUMMARY.md` |
| **DESIGN_SYSTEM_CANONICAL.md** | Design system canonical reference | `documentation/DESIGN_SYSTEM_CANONICAL.md` |
| **COMPONENT_INVENTORY.md** | Complete component inventory | `documentation/COMPONENT_INVENTORY.md` |
| **MOBILE_FIRST.md** | Mobile-first methodology | `documentation/MOBILE_FIRST.md` |

### 26.2 Design Reference Documents

| Document | Purpose |
|----------|---------|
| **AGENT_INSTRUCTIONS.md** | Agent-specific instructions |
| **MEMORY_OPTIMIZATION.md** | Performance optimization techniques |
| **PROJECT_STRUCTURE.md** | Codebase structure reference |
| **UI-IMPLEMENTATION-PLAN.md** | UI implementation roadmap |

### 26.3 Audit Reports

| Report | Location |
|--------|----------|
| **Token Coverage** | `.audit/token-coverage-report.json` |
| **UI Normalization** | `.audit/ui-normalization-report.json` |
| **Design Exceptions** | `.audit/design-exceptions.json` |

### 26.4 Component Quick Reference (Current Implementation)

#### Layout Components (`components/layout/`)

| Component | File | Notes |
|-----------|------|-------|
| **Header** | `Header.tsx` | Hide on scroll down, show on scroll up |
| **SideMenu** | `SideMenu.tsx` | Width: 13.2rem, slide-in animation |
| **ThemeModal** | `ThemeModal.tsx` | Top-right aligned, compact design |
| **PageContainer** | `PageContainer.tsx` | Max-width + auto margins |
| **DashboardLayout** | `DashboardLayout.tsx` | Includes Header + SideMenu + ThemeModal |

#### Card Components (`components/card/`)

| Component | Variants | Heights |
|-----------|----------|--------|
| **BaseCard** | - | Uses `--card-height-*` tokens |
| **RestaurantCard** | mini, standard, rich, full | 140px, 220px, 300px, 420px |
| **BlogCard** | mini, standard, rich, full | 140px, 220px, 300px, 420px |
| **CardPreview** | - | Uses `--marquee-card-size-*` (marquee only) |

#### Animation Components

| Component | Location | Notes |
|-----------|----------|-------|
| **MorphingText** | `components/typography/` | SVG filter, 1.5s morph, 0.5s cooldown |
| **TypingAnimation** | `components/TypingAnimation/` | 50ms typing, 30ms deleting, 2s pause |
| **Marquee** | `components/marquee/` | GPU-only, CSS keyframes, pause when off-screen |

---

**END OF DESIGN GUIDE**

**Remember:** When in doubt, use design tokens, check existing components, and follow the patterns in this guide.
