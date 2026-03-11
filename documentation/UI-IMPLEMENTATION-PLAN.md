# SHADI-V2 — UI IMPLEMENTATION PLAN

> **UI-Only Phase** • **No Database Work** • **Aligned with PROJECT-STRUCTURE.md**

**Date:** 2025-12-31
**Status:** Ready to Start
**Priority:** HIGH

---

## Overview

This plan implements the **UI structure only** from the PROJECT-STRUCTURE.md. No database, API, or server work will be done in this phase.

---

## Phase 0 — Pre-Flight Checks (DO FIRST)

### 0.1 Verify Current State

```bash
# Check existing files
ls -la app/
ls -la components/
ls -la features/
ls -la design-system/

# Run audit
bun run audit:local
```

### 0.2 Backup Current Work

```bash
# Commit current state if needed
git add .
git commit -m "backup: before UI structure implementation"
```

---

## Phase 1 — Design System Foundation

### Goal
Create the design-system directory with tokens and primitives.

### 1.1 Create Directory Structure

```bash
mkdir -p design-system/tokens
mkdir -p design-system/foundations
mkdir -p design-system/primitives
```

### 1.2 Create Token Files

#### `design-system/tokens/colors.ts`

```typescript
/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS - Colors
   Maps to CSS variables in styles/tokens.css
   ═══════════════════════════════════════════════════════════════════════════════ */

export const colors = {
  // Brand
  brand: {
    primary: 'var(--color-brand-primary)',
    secondary: 'var(--color-brand-secondary)',
  },

  // Accent colors (5 accents)
  accent: {
    rust: 'var(--accent-rust)',
    sage: 'var(--accent-sage)',
    teal: 'var(--accent-teal)',
    berry: 'var(--accent-berry)',
    honey: 'var(--accent-honey)',
  },

  // Semantic
  semantic: {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  },

  // Neutral
  neutral: {
    white: 'var(--color-white)',
    black: 'var(--color-black)',
    gray: {
      50: 'var(--color-gray-50)',
      100: 'var(--color-gray-100)',
      200: 'var(--color-gray-200)',
      300: 'var(--color-gray-300)',
      400: 'var(--color-gray-400)',
      500: 'var(--color-gray-500)',
      600: 'var(--color-gray-600)',
      700: 'var(--color-gray-700)',
      800: 'var(--color-gray-800)',
      900: 'var(--color-gray-900)',
    },
  },
} as const

export type AccentColor = keyof typeof colors.accent
export type AccentColorKey = 'rust' | 'sage' | 'teal' | 'berry' | 'honey'
```

#### `design-system/tokens/spacing.ts`

```typescript
export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
  '4xl': 'var(--spacing-4xl)',
} as const
```

#### `design-system/tokens/radius.ts`

```typescript
export const radius = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const
```

#### `design-system/tokens/typography.ts`

```typescript
export const typography = {
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
  },
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
  lineHeight: {
    tight: 'var(--line-height-tight)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
  },
} as const
```

#### `design-system/tokens/motion.ts`

```typescript
export const motion = {
  duration: {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
  },
  easing: {
    default: 'var(--ease-default)',
    in: 'var(--ease-in)',
    out: 'var(--ease-out)',
    'in-out': 'var(--ease-in-out)',
    'out-quart': 'var(--ease-out-quart)',
  },
} as const
```

### 1.3 Create Foundation Files

#### `design-system/foundations/glass.ts`

```typescript
/* ═══════════════════════════════════════════════════════════════════════════════
   FOUNDATION - Glass Morphism
   Light glass only - no heavy blur or neon
   ═══════════════════════════════════════════════════════════════════════════════ */

export const glass = {
  base: 'glass',
  card: 'glass-card',
  header: 'glass-header',
  light: 'glass-light',
} as const

export type GlassVariant = keyof typeof glass
```

#### `design-system/foundations/grid.ts`

```typescript
export const grid = {
  gap: {
    mobile: 'var(--grid-gap-mobile)',
    tablet: 'var(--grid-gap-tablet)',
    desktop: 'var(--grid-gap-desktop)',
  },
  columns: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
} as const
```

#### `design-system/foundations/container.ts`

```typescript
export const container = {
  maxWidth: {
    sm: 'var(--max-w-sm)',
    md: 'var(--max-w-md)',
    lg: 'var(--max-w-lg)',
    xl: 'var(--max-w-xl)',
    '2xl': 'var(--max-w-2xl)',
    full: 'var(--max-w-full)',
  },
  padding: {
    mobile: 'var(--spacing-md)',
    tablet: 'var(--spacing-lg)',
    desktop: 'var(--spacing-xl)',
  },
} as const
```

### 1.4 Create Design System Index

#### `design-system/index.ts`

```typescript
/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM - Single Source of Truth
   Export all tokens and foundations
   ═══════════════════════════════════════════════════════════════════════════════ */

export * from './tokens/colors'
export * from './tokens/spacing'
export * from './tokens/radius'
export * from './tokens/typography'
export * from './tokens/motion'

export * from './foundations/glass'
export * from './foundations/grid'
export * from './foundations/container'
```

---

## Phase 2 — Primitives Creation

### Goal
Create basic UI primitives using design tokens only.

### 2.1 Create Primitives

#### `design-system/primitives/Button.tsx`

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   PRIMITIVE - Button
   Uses design tokens only - no hardcoded values
   ═══════════════════════════════════════════════════════════════════════════════ */

import { ButtonHTMLAttributes } from 'react'
import { spacing, radius, typography, motion } from '../tokens'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  accent?: 'rust' | 'sage' | 'teal' | 'berry' | 'honey'
}

export function Button({
  variant = 'primary',
  size = 'md',
  accent = 'rust',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const accentClass = {
    rust: 'bg-accent-rust',
    sage: 'bg-accent-sage',
    teal: 'bg-accent-teal',
    berry: 'bg-accent-berry',
    honey: 'bg-accent-honey',
  }[accent]

  const sizeClasses = {
    sm: `px-[var(--spacing-sm)] py-[var(--spacing-xs)] ${typography.fontSize.sm}`,
    md: `px-[var(--spacing-md)] py-[var(--spacing-sm)] ${typography.fontSize.base}`,
    lg: `px-[var(--spacing-lg)] py-[var(--spacing-md)] ${typography.fontSize.lg}`,
  }

  const variantClasses = {
    primary: `${accentClass} text-white rounded-[var(--radius-md)]`,
    secondary: `bg-[var(--color-gray-200)] text-[var(--color-gray-800)] rounded-[var(--radius-md)]`,
    ghost: `bg-transparent text-[var(--color-gray-600)] rounded-[var(--radius-md)]`,
  }

  return (
    <button
      className={`${sizeClasses[size]} ${variantClasses[variant]} transition-all duration-[var(--duration-normal)] ${motion.easing.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### `design-system/primitives/Card.tsx`

```tsx
import { HTMLAttributes } from 'react'
import { spacing, radius, glass } from '../tokens'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'bordered'
}

export function Card({
  variant = 'solid',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    glass: `${glass.card} backdrop-blur-md`,
    solid: 'bg-[var(--color-white)] dark:bg-[var(--color-gray-900)]',
    bordered: 'border border-[var(--color-gray-200)] dark:border-[var(--color-gray-700)]',
  }

  return (
    <div
      className={`p-[var(--spacing-md)] rounded-[var(--radius-lg)] ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
```

#### `design-system/primitives/Badge.tsx`

```tsx
import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info'
}

export function Badge({
  variant = 'info',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-black',
    error: 'bg-[var(--color-error)] text-white',
    info: 'bg-[var(--color-info)] text-white',
  }

  return (
    <div
      className={`inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
```

#### `design-system/primitives/Input.tsx`

```tsx
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({
  error = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={`w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border ${
        error
          ? 'border-[var(--color-error)]'
          : 'border-[var(--color-gray-300)]'
      } bg-[var(--color-white)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-900)] dark:text-[var(--color-gray-100)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rust)] ${className}`}
      {...props}
    />
  )
}
```

### 2.2 Export Primitives

#### `design-system/primitives/index.ts`

```tsx
export * from './Button'
export * from './Card'
export * from './Badge'
export * from './Input'
```

---

## Phase 3 — Reorganize Components

### Goal
Move existing components into proper structure.

### 3.1 Create Component Subdirectories

```bash
# Layout components
mkdir -p components/layout

# Search components
mkdir -p components/search

# Marquee components
mkdir -p components/marquee

# Dashboard components
mkdir -p components/dashboard

# Shared components
mkdir -p components/shared
```

### 3.2 Move Existing Components

```bash
# Move layout components
mv components/Header.tsx components/layout/ 2>/dev/null || echo "Already moved or doesn't exist"
mv components/SideMenu.tsx components/layout/ 2>/dev/null || echo "Already moved or doesn't exist"
mv components/ThemeModal.tsx components/layout/ 2>/dev/null || echo "Already moved or doesn't exist"
mv components/SkipLink.tsx components/layout/ 2>/dev/null || echo "Already moved or doesn't exist"
mv components/Providers.tsx components/layout/ 2>/dev/null || echo "Already moved or doesn't exist"

# Move home page components
mv components/HomeClient.tsx components/ 2>/dev/null || echo "Keep in root"

# Move or create search components
# If SearchContainer exists, move it
```

### 3.3 Create Component Index Files

#### `components/layout/index.ts`

```tsx
export { Header } from './Header'
export { SideMenu } from './SideMenu'
export { ThemeModal } from './ThemeModal'
export { SkipLink } from './SkipLink'
export { Providers } from './Providers'
```

---

## Phase 4 — Create Features Structure

### Goal
Create feature modules with UI + logic.

### 4.1 Create Feature Directories

```bash
# Restaurant feature
mkdir -p features/restaurants

# Blog feature
mkdir -p features/blog

# Dashboard feature
mkdir -p features/dashboard

# Auth feature
mkdir -p features/auth
```

### 4.2 Create Feature Skeleton Files

#### `features/restaurants/RestaurantCard.tsx`

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   FEATURE - Restaurant Card
   Domain-specific component for restaurants
   ═══════════════════════════════════════════════════════════════════════════════ */

import { Card } from '@/design-system/primitives/Card'
import type { Restaurant } from '@/types/restaurant'

export interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card variant="glass">
      <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
      <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
    </Card>
  )
}
```

#### `features/restaurants/useRestaurants.ts`

```typescript
/* ═══════════════════════════════════════════════════════════════════════════════
   FEATURE - Restaurant Hook
   Data fetching for restaurants (placeholder - no DB yet)
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useState } from 'react'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([])

  // TODO: Replace with actual API call in database phase
  return {
    restaurants,
    loading: false,
    error: null,
  }
}
```

---

## Phase 5 — App Router Structure

### Goal
Organize app routes into proper route groups.

### 5.1 Create Route Groups

```bash
# Marketing routes
mkdir -p "app/(marketing)"

# Dashboard routes
mkdir -p "app/(dashboard)"
mkdir -p "app/(dashboard)/admin/overview"
mkdir -p "app/(dashboard)/admin/restaurants"
mkdir -p "app/(dashboard)/admin/users"
mkdir -p "app/(dashboard)/owner/dashboard"
mkdir -p "app/(dashboard)/user/dashboard"

# Auth routes
mkdir -p "app/(auth)"
mkdir -p "app/(auth)/login"
mkdir -p "app/(auth)/register"

# Restaurant routes
mkdir -p "app/restaurants"
```

### 5.2 Move Existing Pages

```bash
# Move home page to marketing
mv app/page.tsx "app/(marketing)/page.tsx" 2>/dev/null || echo "Already moved"

# Move blog pages
mv app/blog/page.tsx "app/(marketing)/blog/page.tsx" 2>/dev/null || echo "Keep as is"
```

### 5.3 Create Dashboard Layout

#### `app/(dashboard)/layout.tsx`

```tsx
import { Header } from '@/components/layout/Header'
import { SideMenu } from '@/components/layout/SideMenu'
import { ThemeModal } from '@/components/layout/ThemeModal'

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

---

## Phase 6 — Type Definitions

### Goal
Create shared TypeScript types.

### 6.1 Create Type Files

#### `types/restaurant.ts`

```typescript
export interface Restaurant {
  id: string
  name: string
  slug: string
  cuisine: string
  description: string
  rating: number
  image: string
  location: {
    address: string
    city: string
    lat: number
    lng: number
  }
  createdAt: string
  updatedAt: string
}
```

#### `types/blog.ts`

```typescript
export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

#### `types/user.ts`

```typescript
export type UserRole = 'user' | 'owner' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}
```

#### `types/index.ts`

```typescript
export * from './restaurant'
export * from './blog'
export * from './user'
```

---

## Phase 7 — Pre-Commit Checklist

Before committing UI work:

### 7.1 Run Audit

```bash
# Quick local audit (critical layers only)
bun run audit:local

# Full audit if needed
bun run audit:ci
```

### 7.2 Run Biome

```bash
# Format
bun run biome format --write .

# Check
bun run biome check .
```

### 7.3 Type Check

```bash
bun run type-check
```

### 7.4 Manual Verification

- [ ] No hardcoded colors (all use `var(--color-*)` or accent classes)
- [ ] No hardcoded spacing (all use `var(--spacing-*)`)
- [ ] No hardcoded font sizes (all use `var(--font-size-*)`)
- [ ] All imports use `@/` alias
- [ ] No `any` types
- [ ] All components have TypeScript props interfaces
- [ ] Glass effects are light only (no heavy blur/neon)

---

## Implementation Order

### Week 1: Foundation
1. ✅ Phase 0 - Pre-flight checks
2. ✅ Phase 1 - Design system (tokens, foundations)
3. ✅ Phase 2 - Primitives (Button, Card, Badge, Input)

### Week 2: Structure
4. ✅ Phase 3 - Reorganize components
5. ✅ Phase 4 - Create features structure
6. ✅ Phase 6 - Type definitions

### Week 3: Routes
7. ✅ Phase 5 - App router structure with route groups

### Week 4: Polish
8. ✅ Phase 7 - Audit and verification
9. ✅ Test all three themes (light, dark, warm)
10. ✅ Responsive testing (mobile, tablet, desktop)

---

## What's NOT in This Phase

❌ **Database work** - Will be done in BACKEND-PLAN phase
❌ **API routes** - Will be done in BACKEND-PLAN phase
❌ **Server actions** - Will be done in BACKEND-PLAN phase
❌ **Auth implementation** - Will be done in BACKEND-PLAN phase

---

## After This Phase

Once UI structure is complete:
1. Run full audit: `bun run audit:ci`
2. Commit with message: `feat(ui): implement design system and component structure`
3. Proceed to BACKEND-PLAN for database and API work

---

**Last Updated:** 2025-12-31
**Next Phase:** BACKEND-PLAN (Database & API)
