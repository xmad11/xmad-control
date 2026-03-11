# SHADI-V2 — PRODUCTION PROJECT STRUCTURE

> **Authoritative Reference** • **Best Practices** • **Next.js 16.1 + React + Tailwind v4 + Bun + Biome + Supabase**

This is the official production-grade project structure and architecture for shadi-v2.

---

## Table of Contents

1. [Root Structure](#1-root-structure)
2. [App Router Structure](#2-app-router-structure)
3. [Design System](#3-design-system)
4. [Components vs Features](#4-components-vs-features)
5. [Server Layer](#5-server-layer)
6. [Performance Rules](#6-performance-rules)
7. [Tooling](#7-tooling)

---

## 1. Root Structure

```
shadi-v2/
├── app/                      # Next.js App Router (UI + routing)
├── components/               # Shared UI components (pure, reusable)
├── features/                 # Feature-scoped UI + logic
├── design-system/            # Tokens, primitives, foundations
├── lib/                      # Core utilities (non-UI)
├── server/                   # Server-only logic (db, cache, services)
├── styles/                   # Global CSS & Tailwind layers
├── public/                   # Static assets only
├── types/                    # Global shared TypeScript types
├── scripts/                  # Audit, tooling, automation
├── tests/                    # Unit + integration tests
├── documentation/            # Project docs (this folder)
├── .env.example
├── next.config.mjs
├── biome.json
├── tsconfig.json
├── package.json
└── bun.lockb
```

### Directory Purpose

| Directory | Owner | Purpose |
|-----------|-------|---------|
| `app/` | Frontend | Routes, pages, layouts |
| `components/` | Frontend | Pure UI components |
| `features/` | Frontend | Feature modules (UI + logic) |
| `design-system/` | Frontend | Tokens, primitives, foundations |
| `lib/` | Both | Shared utilities (non-UI) |
| `server/` | Backend | DB, cache, services |
| `styles/` | Frontend | Global CSS |
| `types/` | Both | TypeScript types |

---

## 2. App Router Structure

```
app/
├── (marketing)/             # Route group: public pages
│   ├── page.tsx             # Home (Hero, Marquees, Search)
│   └── layout.tsx
│
├── (dashboard)/             # Route group: authenticated dashboards
│   ├── layout.tsx           # Shared dashboard shell
│   ├── admin/
│   │   ├── overview/
│   │   ├── restaurants/
│   │   ├── users/
│   │   └── settings/
│   ├── owner/
│   │   ├── dashboard/
│   │   ├── restaurant/
│   │   └── analytics/
│   └── user/
│       ├── dashboard/
│       ├── saved/
│       └── profile/
│
├── (auth)/                  # Route group: authentication
│   ├── login/
│   └── register/
│
├── blog/
│   ├── page.tsx             # Blog listing
│   └── [slug]/page.tsx      # Blog detail
│
├── restaurants/
│   ├── page.tsx             # Restaurant listing
│   └── [slug]/page.tsx      # Restaurant detail
│
├── api/                     # Route handlers only
│   ├── restaurants/
│   ├── blogs/
│   └── auth/
│
├── settings/
│   └── page.tsx             # Unified settings
│
├── layout.tsx               # Root layout
├── error.tsx
├── loading.tsx
├── not-found.tsx
└── viewport.ts              # Next.js 16 viewport export
```

### Route Groups Explained

- `(marketing)` - Public pages, no layout inheritance
- `(dashboard)` - Shared dashboard shell for all roles
- `(auth)` - Authentication pages

**Why Route Groups?**
- Clean URLs (no group name in URL)
- Shared layouts within group
- No duplication
- Server Components by default

---

## 3. Design System

```
design-system/
├── tokens/
│   ├── colors.ts            # Color tokens (OKLCH)
│   ├── spacing.ts           # Spacing scale
│   ├── radius.ts            # Border radius
│   ├── typography.ts        # Font sizes, weights
│   └── motion.ts            # Animation tokens
│
├── foundations/
│   ├── glass.ts             # Glass morphism styles
│   ├── grid.ts              # Grid system
│   └── container.ts         # Container queries
│
├── primitives/
│   ├── Button.tsx           # Button component
│   ├── Card.tsx             # Card component
│   ├── Badge.tsx            # Badge component
│   ├── IconButton.tsx       # Icon button
│   ├── Tabs.tsx             # Tabs component
│   └── Input.tsx            # Input component
│
└── index.ts                 # Exports
```

### Design System Rules

1. **No component can define colors/sizes** - Everything maps to tokens
2. **Tailwind v4 uses tokens as CSS variables** - See `styles/tokens.css`
3. **Glass is a foundation** - Not per-component
4. **Accent colors tokenized** - 5 accents: rust, sage, teal, berry, honey

### Token Hierarchy

```
styles/tokens.css (SSOT)
    ↓
design-system/tokens/*.ts (Type-safe access)
    ↓
components via var(--token-name)
```

---

## 4. Components vs Features

### Components (`/components`)

Pure UI components, reusable, no business logic:

```
components/
├── layout/
│   ├── Header.tsx           # Site navigation
│   ├── SideMenu.tsx         # Slide-out menu
│   ├── PageContainer.tsx    # Page wrapper
│   └── FullBleed.tsx        # Full-bleed sections
│
├── search/
│   ├── SearchBar.tsx        # Search input
│   ├── FilterRow.tsx        # Filter toggles
│   └── CategoryRow.tsx      # Category pills
│
├── marquee/
│   ├── MarqueeBase.tsx      # Base marquee
│   ├── MarqueeCircle.tsx    # 3D circle marquee
│   ├── MarqueeSquare.tsx    # Square card marquee
│   └── useMarqueeMotion.ts  # Motion hook
│
├── dashboard/
│   ├── StatCard.tsx         # Dashboard stat card
│   ├── ChartCard.tsx        # Chart wrapper
│   ├── DataTable.tsx        # Data table
│   └── SectionContainer.tsx # Section wrapper
│
└── shared/
    ├── GlassCard.tsx        # Glass morphism card
    ├── GradientText.tsx     # Gradient text
    └── ...
```

### Features (`/features`)

Feature-scoped modules with UI + logic:

```
features/
├── restaurants/
│   ├── RestaurantCard.tsx
│   ├── RestaurantGrid.tsx
│   └── useRestaurants.ts    # Hook for data
│
├── blog/
│   ├── BlogCard.tsx
│   ├── BlogGrid.tsx
│   └── useBlogs.ts
│
├── dashboard/
│   ├── StatsGrid.tsx
│   ├── ActivityFeed.tsx
│   └── useDashboardStats.ts
│
└── auth/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    └── useAuth.ts
```

**Key Difference:**
- `components/` = pure UI, can be used anywhere
- `features/` = domain-specific, includes hooks and logic

---

## 5. Server Layer

Backend code lives in `/server` - no DB in components:

```
server/
├── db/
│   ├── client.ts            # Supabase client
│   ├── pool.ts              # Connection pool
│   └── queries/             # Database queries
│       ├── restaurants.ts
│       ├── blogs.ts
│       ├── users.ts
│       └── ...
│
├── cache/
│   ├── revalidate.ts        # Cache revalidation
│   └── keys.ts              # Cache keys
│
└── services/
    ├── restaurants.ts       # Business logic
    ├── blogs.ts
    ├── users.ts
    └── auth.ts
```

### Server Rules

1. **No DB in components** - All DB calls in `/server`
2. **No fetch logic in UI** - Use server actions
3. **Bounded caching** - Time-based cache invalidation
4. **Server Actions preferred** - For mutations

---

## 6. Performance Rules

### Marquee Optimization

```
marquee/
├── data/
│   └── home-marquee.ts      # Static config (IDs only)
│
└── MarqueeBase.tsx          # No images inside
```

**Rules:**
- Use static CDN images
- Next Image with `priority={false}`
- Blur placeholder
- Max 12-16 items per marquee
- Loop with CSS transform only
- Fade on all sides

### Mobile Experience

- **2-column grids** on mobile (never single column stats)
- **Horizontal scroll** over vertical stacking
- **Compact cards** with information density
- **Touch targets** min 44px

### Performance Budget

- Lighthouse score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 200KB gzipped

---

## 7. Tooling

### Bun

```
# Install dependencies
bun install

# Run dev server
bun dev

# Run build
bun run build

# Run tests
bun test
```

**Why Bun?**
- Faster installs
- Native TypeScript
- Better dev server

### Biome

```
# Format code
bun run biome format --write .

# Check code
bun run biome check .

# Fix issues
bun run biome check --write .
```

**Why Biome?**
- Formatting + linting in one tool
- No ESLint + Prettier split
- CI-friendly

### Next.js 16.1 Features

✅ React Compiler (root config)
✅ Viewport export
✅ Partial Prerendering
✅ Streaming Server Components
✅ Route Handlers
✅ Metadata API v2
✅ `useOptimistic` (client)

---

## 8. Agent Responsibilities

| Agent | Scope | Directories |
|-------|-------|-------------|
| **UI Designer** | Frontend UI | `app/`, `components/`, `features/`, `design-system/`, `styles/` |
| **Database** | Backend | `server/`, `lib/db/`, types (DB types) |
| **Audit** | Quality | `scripts/audit/`, config files |

### Handoff Points

1. **API Contract** - Database agent defines API, UI consumes
2. **Type Safety** - Shared types in `/types`
3. **Audit** - Both agents must pass audit before merge

---

## 9. File Naming Conventions

```
# Components
PascalCase.tsx         # Header.tsx, SearchBar.tsx

# Pages
lowercase.tsx          # page.tsx, layout.tsx

# Utilities
camelCase.ts           # formatDate.ts, classNames.ts

# Types
PascalCase.ts          # Restaurant.ts, User.ts

# Config
lowercase.config.*      # next.config.mjs, biome.json
```

---

## 10. Import Order

```tsx
// 1. React
import { useState } from "react"

// 2. Next.js
import Link from "next/link"
import { useRouter } from "next/navigation"

// 3. Third-party
import { ChevronRightIcon } from "@heroicons/react/24/outline"

// 4. Local components
import { Header } from "@/components/Header"
import { Button } from "@/design-system/primitives/Button"

// 5. Features
import { useRestaurants } from "@/features/restaurants"

// 6. Lib
import { formatDate } from "@/lib/utils"

// 7. Types
import type { Restaurant } from "@/types/restaurant"

// 8. Styles
import "./styles.css"
```

---

## 11. Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=
```

---

## 12. Git Workflow

```
main (protected)
  └── develop
        ├── ui/dashboard-phase
        ├── ui/blog-phase
        ├── db/restaurants-api
        └── refactor/structure
```

**Rules:**
- All work done in feature branches
- Must pass audit before merge
- PR description must reference phase
- No direct commits to main

---

**Last Updated:** 2025-12-30
**Version:** 2.0
**Status:** Authoritative
