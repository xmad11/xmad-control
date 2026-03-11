# DESIGN-FINAL2026 - Single Source of Truth (SSOT)

> **Restaurant Platform 2025-2026** | Next.js 16.1 + Tailwind 4.1.18 + React 19.2
>
> **Last Updated**: 2026-01-07
> **Status**: LOCKED & ACTIVE - This is the authoritative source for all design decisions
>
> **This document is the SSOT for:**
> - Theme system architecture
> - Design token governance
> - Component patterns
> - All UI/UX standards
> - Lock/unlock procedures
> - Best practices enforcement

---

## TABLE OF CONTENTS

1. [CRITICAL WARNINGS](#1-critical-warnings)
2. [Tech Stack & Versions](#2-tech-stack--versions)
3. [Design System Architecture](#3-design-system-architecture)
4. [Token Structure & Organization](#4-token-structure--organization)
5. [Theme Provider Implementation](#5-theme-provider-implementation)
6. [Best Practices](#6-best-practices)
7. [Critical Blockers & Fixes](#7-critical-blockers--fixes)
8. [Lock/Unlock Procedures](#8-lockunlock-procedures)
9. [Component Patterns](#9-component-patterns)
10. [Responsive Design Standards](#10-responsive-design-standards)
11. [Icon System](#11-icon-system)
12. [Animation Standards](#12-animation-standards)
13. [Audit & Enforcement](#13-audit--enforcement)
14. [Sources & References](#14-sources--references)

---

## 1. CRITICAL WARNINGS

### 🔒 READ-ONLY FILES (NEVER EDIT DIRECTLY)

The following files are **LOCKED** at filesystem level:

```
❌ DO NOT EDIT (Read-only):
styles/tokens.core.css
styles/tokens.components.css
styles/tokens.motion.css
styles/tokens.css
styles/themes.css
```

**Violations will cause:**
- Pre-commit hook to fail
- CI to reject the PR
- Design system inconsistencies

### ⚠️ CRITICAL BLOCKERS (MUST READ)

#### Blocker 1: Multiple @import "tailwindcss"

**Status:** ✅ FIXED (2026-01-07)

**Problem:**
- Multiple `@import "tailwindcss"` statements cause:
  - Tailwind to recompile utilities multiple times
  - Duplicated CSS classes
  - Refresh loops in dev server
  - Memory spikes

**Solution:**
- ONLY `globals.css` may have `@import "tailwindcss";`
- All other token files must NOT import Tailwind

**Verification:**
```bash
grep -R '@import "tailwindcss"' styles/
# Must return ONLY: styles/globals.css:@import "tailwindcss";
```

#### Blocker 2: Token Auto-Mutation

**Status:** ✅ FIXED (2026-01-07)

**Problem:**
- Tools were silently rewriting token files:
  - Biome CSS formatter
  - Editor auto-format on save
  - Agent retries
  - CI never saw the changes (too late)

**Solution:**
- Biome now ignores all token files
- Husky pre-commit blocks token edits
- Filesystem is read-only

**Verification:**
```bash
# Check Biome ignore
grep "styles/tokens" biome.json

# Check Husky blocking
grep "styles/tokens" .husky/pre-commit

# Check filesystem lock
ls -la styles/tokens*.css | grep "^-r--"
```

---

## 2. TECH STACK & VERSIONS

### Core Framework

```toml
Next.js     : 16.1.1    (App Router, PPR, React 19.2)
React       : 19.2.3    (Server Components by default)
Tailwind CSS : 4.1.18    (@theme directive, OKLCH support)
TypeScript  : 5.9.3     (Strict mode)
Bun         : Latest    (Runtime, not Node.js)
Biome       : 1.9.4     (Linting/Formatting, not ESLint/Prettier)
```

### Key Dependencies

```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "lucide-react": "^0.562.0",
    "next": "^16.1.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "tailwindcss": "^4.1.18"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "husky": "^9.1.7",
    "lint-staged": "^15.5.2"
  }
}
```

---

## 3. DESIGN SYSTEM ARCHITECTURE

### File Structure (ITCSS + CUBE CSS + Tailwind 4)

```
/styles/
├── globals.css              ← Entry point (ONLY @import "tailwindcss" here)
├── tokens.css               ← Monolithic legacy (764 lines, to be deprecated)
├── tokens.core.css          ← LOCKED: Colors, spacing, typography
├── tokens.components.css    ← LOCKED: Cards, marquee, hero
├── tokens.motion.css        ← LOCKED: Animations ONLY
├── utilities.visual.css     ← LOCKED: Fade masks ONLY
├── themes.css               ← LOCKED: Theme switching ONLY
└── tokens/
    └── mask.css              ← Duplicate (will be removed)

/context/
└── ThemeContext.tsx         ← "use client" (React 19 pattern)
```

### Import Order (CRITICAL)

**globals.css MUST follow this exact order:**

```css
/* ═══════════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES - Entry Point
   ═══════════════════════════════════════════════════════════════════════════════ */

@import "tailwindcss";         /* ← FIRST LINE - Tailwind v4 */
@import "./tokens.css";         /* Legacy monolith */
@import "./themes.css";         /* Theme switching */
@import "./tokens/mask.css";    /* Fade masks (legacy) */
@import "./utilities.css";     /* Utilities */
```

**Rules:**
1. `@import "tailwindcss";` must be FIRST
2. No other file may have `@import "tailwindcss";`
3. Token files import in dependency order

---

## 4. TOKEN STRUCTURE & ORGANIZATION

### Token Categories

#### 4.1 Core Tokens (tokens.core.css)

**Purpose:** Static design tokens that NEVER change

**Contains:**
- Brand colors (primary, secondary)
- Accent colors (10 options)
- Semantic colors (success, warning, error, info)
- Neutral scale (gray-50 through gray-900)
- Spacing scale (space-1 through space-24)
- Typography (font sizes, line heights, letter spacing)
- Border radius (sm through full)
- Shadows (sm through 2xl)
- Breakpoints (sm through 2xl)
- Icon sizes (xs through xl)
- Z-index layers

**Location:** `@theme { }` block

#### 4.2 Component Tokens (tokens.components.css)

**Purpose:** Component-specific sizing and spacing

**Contains:**
- Card heights (image, compact, detailed, list)
- Card gaps
- Marquee sizing (card size, gap, duration, translate)
- Marquee 3D tilt values
- Hero typography (fluid with clamp)
- Header sizing
- Modal widths
- Panel/overlay sizes

**Rules:**
- NO colors
- NO animations
- Only layout/spacing tokens

**Location:** `@theme { }` block

#### 4.3 Motion Tokens (tokens.motion.css)

**Purpose:** ALL animations and easing

**Contains:**
- Easing functions (ease-out, ease-in-out)
- Animation durations (instant, fast, normal, slow)
- Keyframes (fade-in, slide-in, marquee, cursor-blink, gradient-x)

**Rules:**
- NO layout tokens
- NO component tokens
- Only animation-related tokens

**Location:** `@theme { }` for easing/durations, root level for keyframes

#### 4.4 Runtime Tokens (themes.css)

**Purpose:** Theme-switching and JS-modified values

**Contains:**
- `--fg` (foreground color)
- `--bg` (background color)
- `--fg-*` (foreground opacity variants)
- `--bg-*` (background opacity variants)
- `--glass-*` (glassmorphism values)
- `--hero-gradient` (theme-specific gradients)
- `--gray` (constant gray - will move to tokens.core.css)

**Rules:**
- Defined in `:root` for light mode
- Overridden in `[data-theme="dark"]` and `[data-theme="warm"]`
- May be modified by JavaScript

**Location:** `:root` and `[data-theme="*"]` blocks

### Token Naming Convention

```css
/* Pattern: --category-property-variant */

/* Colors */
--color-brand-primary          /* Brand color */
--color-accent-rust           /* Accent color */
--gray-500                    /* Neutral scale */

/* Spacing */
--space-1                     /* 4px increments */
--space-4                     /* 16px (most common) */

/* Typography */
--text-base                   /* 16px */
--text-lg                     /* 18px */
--leading-normal              /* 1.5 */

/* Components */
--card-height-detailed        /* Component-specific */
--marquee-duration            /* Animation duration */

/* Runtime */
--fg                          /* Foreground (theme-switching) */
--glass-blur                  /* JS-modified value */
```

### OKLCH Color System (OFFICIAL)

**Why OKLCH?**
- Perceptually uniform (better than HSL)
- Full browser support (2025)
- Official in Tailwind CSS 4
- Better accessibility

**Format:**
```css
oklch(lightness chroma hue)
```

**Examples:**
```css
--color-brand-primary: oklch(0.65 0.16 45);      /* Terracotta Coral */
--color-accent-rust: oklch(0.58 0.15 50);        /* Warmth */
--gray-500: oklch(0.48 0.028 250);               /* Mid gray */
```

---

## 5. THEME PROVIDER IMPLEMENTATION

### React 19 Pattern (Official)

**File:** `context/ThemeContext.tsx`

```typescript
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type ThemeMode = "light" | "warm" | "dark"

export type AccentColorName =
  | "rust" | "sage" | "teal" | "berry" | "honey"
  | "lavender" | "indigo" | "mint" | "turquoise" | "lime"

export interface ThemeContextType {
  mode: ThemeMode
  accentColor: AccentColorName
  setMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColorName) => void
}

export const ACCENT_COLORS: Record<AccentColorName, { oklch: string; label: string }> = {
  rust: { oklch: "oklch(0.58 0.15 50)", label: "Rust" },
  sage: { oklch: "oklch(0.62 0.08 150)", label: "Sage" },
  teal: { oklch: "oklch(0.55 0.12 220)", label: "Teal" },
  berry: { oklch: "oklch(0.52 0.18 350)", label: "Berry" },
  honey: { oklch: "oklch(0.70 0.12 85)", label: "Honey" },
  lavender: { oklch: "oklch(0.68 0.10 280)", label: "Lavender" },
  indigo: { oklch: "oklch(0.45 0.18 270)", label: "Indigo" },
  mint: { oklch: "oklch(0.72 0.08 180)", label: "Mint" },
  turquoise: { oklch: "oklch(0.65 0.12 200)", label: "Turquoise" },
  lime: { oklch: "oklch(0.75 0.15 120)", label: "Lime" },
} as const

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light")
  const [accentColor, setAccentColorState] = useState<AccentColorName>("rust")
  const [mounted, setMounted] = useState(false)

  const applyMode = useCallback((m: ThemeMode) => {
    if (typeof document === "undefined") return
    document.documentElement.setAttribute("data-theme", m)
    document.documentElement.classList.toggle("dark", m === "dark")
  }, [])

  const applyAccentColor = useCallback((color: AccentColorName) => {
    if (typeof document === "undefined") return
    const colorData = ACCENT_COLORS[color]
    if (!colorData) {
      console.warn(`Invalid accent color: ${color}, falling back to rust`)
      return
    }
    document.documentElement.style.setProperty("--color-brand-primary", colorData.oklch)
  }, [])

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    if (typeof window !== "undefined") {
      localStorage.setItem("themeMode", m)
      applyMode(m)
    }
  }, [applyMode])

  const setAccentColor = useCallback((color: AccentColorName) => {
    setAccentColorState(color)
    if (typeof window !== "undefined") {
      localStorage.setItem("themeAccentColor", color)
      applyAccentColor(color)
    }
  }, [applyAccentColor])

  useEffect(() => {
    setMounted(true)
    const savedMode = (localStorage.getItem("themeMode") as ThemeMode) || "light"
    let savedColor = (localStorage.getItem("themeAccentColor") as AccentColorName) || "rust"

    if (!ACCENT_COLORS[savedColor]) {
      console.warn(`Legacy accent color "${savedColor}" no longer available, resetting to rust`)
      savedColor = "rust"
      localStorage.setItem("themeAccentColor", savedColor)
    }

    setModeState(savedMode)
    setAccentColorState(savedColor)
    applyMode(savedMode)
    applyAccentColor(savedColor)
  }, [applyMode, applyAccentColor])

  const contextValue = useMemo(
    () => ({ mode, accentColor, setMode, setAccentColor }),
    [mode, accentColor, setMode, setAccentColor]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
```

### Usage Pattern

```tsx
// In any Client Component
import { useTheme } from "@/context/ThemeContext"

function ThemeToggle() {
  const { mode, setMode } = useTheme()
  return (
    <button onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
      Toggle theme (current: {mode})
    </button>
  )
}
```

---

## 6. BEST PRACTICES

### 6.1 Tailwind CSS 4 Best Practices

#### ✅ DO

```tsx
/* Use tokens in Tailwind classes */
<div className="bg-[var(--color-brand-primary)] p-[var(--space-4)]">

/* Use fluid typography with clamp() */
<h1 className="text-[var(--text-5xl)]">  {/* 48-80px fluid */}

/* Use mobile-first approach */
<div className="p-4 md:p-6 lg:p-8">  {/* Mobile base, enhance up */

/* Use container queries */
<div className="@container">
  <div className="@lg:block @md:hidden">
```

#### ❌ DON'T

```tsx
/* Never hardcoded values */
<div className="bg-[#ff0000] p-4">

/* Never Tailwind literals */
<div className="bg-blue-500 p-8">

/* Never inline styles */
<div style={{ color: "#ff0000", padding: "20px" }}>

/* Never getComputedStyle */
const color = getComputedStyle(el).getPropertyValue("--token");
```

### 6.2 React 19 Best Practices

#### Server Components (Default)

```tsx
// ✅ CORRECT - Server Component (no "use client")
async function RestaurantList() {
  const restaurants = await db.restaurants.findMany()
  return <div>{restaurants.map(/* ... */)}</div>
}
```

#### Client Components (When Needed)

```tsx
// ✅ CORRECT - Client Component (uses hooks)
"use client"

import { useTheme } from "@/context/ThemeContext"

function ThemeToggle() {
  const { mode, setMode } = useTheme()
  return <button onClick={() => setMode("dark")}>Toggle</button>
}
```

### 6.3 Typography Best Practices

#### Fluid Typography (Official 2025 Standard)

```css
/* In tokens.core.css */
@theme {
  /* Fluid with clamp() - seamless scaling across devices */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);        /* 14-16px */
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16-18px */
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);       /* 18-20px */
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);        /* 20-24px */
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);         /* 24-32px */
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);     /* 30-40px */
  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem);         /* 36-48px */
  --text-5xl: clamp(3rem, 2rem + 5vw, 5rem);                 /* 48-80px */
  --text-6xl: clamp(3.75rem, 2.5rem + 6.25vw, 6rem);         /* 60-96px */
}
```

**Usage:**
```tsx
<h1 className="text-[var(--text-5xl)]">  {/* Automatically scales 48-80px */}
```

### 6.4 Spacing Best Practices

#### Use the Spacing Scale

```css
/* 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px ← Most common */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Usage:**
```tsx
<div className="p-[var(--space-4)] md:p-[var(--space-8)]">
```

### 6.5 Color Best Practices

#### Use Tokens, Never Hardcode

```tsx
/* ✅ CORRECT */
<button className="bg-[var(--color-brand-primary)] text-white">
<button className="bg-[var(--color-accent-rust)]">

/* ❌ WRONG */
<button className="bg-[#ff0000] text-white">
<button className="bg-blue-500 text-white">
```

#### Semantic Colors

```css
/* Use for UI states */
--color-success: oklch(0.68 0.15 145);  /* Green */
--color-warning: oklch(0.72 0.14 85);   /* Yellow/Orange */
--color-error: oklch(0.55 0.20 25);     /* Red */
--color-info: oklch(0.58 0.14 250);     /* Blue */
```

### 6.6 Icon Best Practices

#### Lucide React (Official 2025 Standard)

```tsx
import { ChevronDown, User, Search, Menu } from "lucide-react"

/* Size using tokens */
<ChevronDown className="h-[var(--icon-md)] w-[var(--icon-md)]" />
<User className="h-[var(--icon-lg)] w-[var(--icon-lg)]" />

/* Standard sizes */
<Search className="h-4 w-4" />
<Menu className="h-6 w-6" />
```

**Why Lucide?**
- Tree-shakable ES modules
- Official icon set for shadcn/ui
- Perfect for Next.js 16 Server Components

---

## 7. CRITICAL BLOCKERS & FIXES

### Blocker 1: Multiple @import "tailwindcss"

**Discovered:** 2026-01-07
**Fixed:** 2026-01-07
**Impact:** Critical (caused refresh loops, memory spikes)

**Problem:**
```css
/* ❌ WRONG - Multiple imports */
/* styles/tokens.css */
@import "tailwindcss";

/* styles/tokens.core.css */
@import "tailwindcss";

/* styles/globals.css */
@import "tailwindcss";
```

**Fix Applied:**
```css
/* ✅ CORRECT - Only one import */
/* styles/globals.css */
@import "tailwindcss";

/* styles/tokens.css */
@theme {  /* No import */ }

/* styles/tokens.core.css */
@theme {  /* No import */ }
```

**Verification:**
```bash
grep -R '@import "tailwindcss"' styles/
# Must return ONLY: styles/globals.css:@import "tailwindcss";
```

---

### Blocker 2: Token Auto-Mutation

**Discovered:** 2026-01-07
**Fixed:** 2026-01-07
**Impact:** Critical (tools silently rewriting tokens)

**Problem Sources:**
1. **Biome CSS formatter** - Enabled by default, not ignoring token files
2. **Husky pre-commit** - No blocking check for token edits
3. **Filesystem permissions** - All files writable

**Fixes Applied:**

#### Fix 2.1: Biome Ignore (biome.json)

```json
{
  "files": {
    "ignore": [
      ".next/**",
      "dist/**",
      "build/**",
      "node_modules/**",
      ".turbo/**",
      "coverage/**",
      "*.lock",
      "*.log",
      "next-env.d.ts",
      "styles/tokens*.css",    /* ← ADDED */
      "styles/themes.css"     /* ← ADDED */
    ]
  }
}
```

#### Fix 2.2: Husky Pre-commit Block (.husky/pre-commit)

```bash
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Block token file modifications
if git diff --cached --name-only | grep -E "styles/tokens"; then
  echo "❌ Token files are locked. Edit themes.css instead."
  exit 1
fi

# Run lint-staged
bun run lint-staged

# Quick audit
bun run audit:local

echo ""
echo "✅ Pre-commit checks passed!"
```

#### Fix 2.3: Filesystem Lock

```bash
# Applied to all token files:
chmod -w styles/tokens*.css styles/themes.css

# Result: -r--r--r-- (read-only)
```

**Verification:**
```bash
# Check Biome ignore
grep -A 12 '"files"' biome.json | grep "styles/tokens"

# Check Husky blocking
grep "styles/tokens" .husky/pre-commit

# Check filesystem lock
ls -la styles/tokens*.css styles/themes.css | grep "^-r--"
```

---

## 8. LOCK/UNLOCK PROCEDURES

### 8.1 Current Lock Status

**All token files are READ-ONLY:**

```bash
$ ls -la styles/tokens*.css styles/themes.css
-r--r--r--  styles/tokens.core.css       /* Read-only */
-r--r--r--  styles/tokens.components.css /* Read-only */
-r--r--r--  styles/tokens.motion.css     /* Read-only */
-r--r--r--  styles/tokens.css           /* Read-only */
-r--r--r--  styles/themes.css          /* Read-only */
```

### 8.2 When to Unlock

**Valid reasons to unlock:**
1. New product line requiring new tokens
2. Full redesign
3. Brand refresh
4. Bug fix in token values

**Invalid reasons (DO NOT UNLOCK):**
1. Component styling (use themes.css)
2. Page-specific styles (use globals.css or component CSS)
3. Animation tweaks (use tokens.motion.css)
4. Temporary experiments (use separate file)

### 8.3 Unlock Procedure (Controlled)

**Step 1: Unlock files temporarily**
```bash
chmod +w styles/tokens*.css styles/themes.css
```

**Step 2: Make your changes**
```bash
# Edit the files
vim styles/tokens.core.css
```

**Step 3: Test thoroughly**
```bash
# Run dev server
bun run dev

# Run audit
bun run audit:local

# Build verification
bun run build
```

**Step 4: Commit changes**
```bash
git add styles/tokens*.css styles/themes.css
git commit -m "chore(tokens): intentional update - [reason]"
```

**Step 5: Re-lock immediately**
```bash
chmod -w styles/tokens*.css styles/themes.css
```

**Step 6: Verify lock**
```bash
ls -la styles/tokens*.css styles/themes.css | grep "^-r--"
```

### 8.4 Emergency Recovery

**If you accidentally commit without re-locking:**

```bash
# Lock files now
chmod -w styles/tokens*.css styles/themes.css

# Commit the lock
git add -A
git commit -m "chore(tokens): re-lock after update"
```

---

## 9. COMPONENT PATTERNS

### 9.1 Card System

**Architecture:**
- 2 card types: `RestaurantCard`, `BlogCard`
- 4 variants each: `image`, `compact`, `detailed`, `list`

**File Structure:**
```
components/card/
├── RestaurantCard.tsx
├── BlogCard.tsx
├── CardMedia.tsx      (shared utility)
├── CardContent.tsx    (shared utility)
└── variants/
    ├── image.tsx
    ├── compact.tsx
    ├── detailed.tsx
    └── list.tsx
```

**Usage:**
```tsx
import { RestaurantCard } from "@/components/card/RestaurantCard"
import type { CardVariant } from "@/components/card/variants"

<RestaurantCard variant="detailed" restaurant={data} />
```

### 9.2 Container Queries (2025 Standard)

**When to use:**
- Component should adapt to container size, not viewport
- Sidebar vs main content different layouts
- Nested responsive components

**Pattern:**
```tsx
<div className="@container">
  <div className="@lg:block @md:hidden">
    Adapts to container, not viewport
  </div>
</div>
```

### 9.3 Glassmorphism System

**Tokens (in themes.css):**
```css
:root {
  --glass-blur: 20px;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.12);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

[data-theme="dark"] {
  --glass-blur: 24px;
  --glass-bg: rgba(30, 35, 45, 0.75);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

[data-theme="warm"] {
  --glass-blur: 18px;
  --glass-bg: rgba(245, 235, 220, 0.8);
  --glass-border: rgba(200, 180, 150, 0.4);
  --glass-shadow: 0 8px 32px rgba(90, 70, 50, 0.2);
}
```

**Usage:**
```tsx
<div className="
  bg-[var(--glass-bg)]
  backdrop-blur-[var(--glass-blur)]
  -webkit-backdrop-blur-[var(--glass-blur)]
  border border-[var(--glass-border)]
  shadow-[var(--glass-shadow)]
">
  Glass card content
</div>
```

**Chrome Requirements:**
- `backdrop-filter` required
- `-webkit-backdrop-filter` required
- Alpha < 1 required

---

## 10. RESPONSIVE DESIGN STANDARDS

### 10.1 Breakpoints (Mobile-First)

```css
/* Tailwind 4 standard */
--bp-sm: 640px;    /* sm */
--bp-md: 768px;    /* md */
--bp-lg: 1024px;   /* lg */
--bp-xl: 1280px;   /* xl */
--bp-2xl: 1536px;  /* 2xl */
```

**Usage:**
```tsx
/* Mobile-first: base is mobile, enhance up */
<div className="p-4 md:p-6 lg:p-8">
  {/* 16px mobile → 24px tablet → 32px desktop */}
</div>
```

### 10.2 Touch Targets (Accessibility)

**Minimum:** 44px (Apple HIG)

```tsx
/* ✅ CORRECT */
<button className="px-4 py-3 min-h-[44px]">
  Touch-friendly button
</button>

/* ❌ WRONG - Too small */
<button className="px-2 py-1">
  Hard to tap
</button>
```

### 10.3 Container Queries (2025)

**Official Support:** Full browser support (2025)

```tsx
/* Component adapts to container, not viewport */
<div className="@container">
  <div className="@lg:block @md:hidden">
    Shows when container is large
  </div>
</div>
```

---

## 11. ICON SYSTEM

### 11.1 Icon Library: Lucide React

**Why Lucide?**
- Tree-shakable ES modules
- Official icon set for shadcn/ui
- Perfect for Next.js 16 Server Components
- Consistent stroke width

**Import:**
```tsx
import { ChevronDown, User, Search, Menu, X, Check, Plus } from "lucide-react"
```

### 11.2 Icon Sizes (Tokens)

```css
/* In tokens.core.css */
--icon-xs: 0.75rem;    /* 12px */
--icon-sm: 1rem;       /* 16px */
--icon-md: 1.25rem;    /* 20px */
--icon-lg: 1.5rem;     /* 24px */
--icon-xl: 2rem;       /* 32px */
```

**Usage:**
```tsx
/* Using tokens */
<ChevronDown className="h-[var(--icon-md)] w-[var(--icon-md)]" />

/* Standard sizes */
<Search className="h-4 w-4" />
<User className="h-5 w-5" />
<Menu className="h-6 w-6" />
```

### 11.3 Icon Accessibility

**Always include aria-label for icon-only buttons:**
```tsx
<button aria-label="Close menu">
  <X className="h-5 w-5" />
</button>
```

---

## 12. ANIMATION STANDARDS

### 12.1 Easing Functions (Physics-Based)

```css
/* In tokens.motion.css */
@theme {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
}
```

### 12.2 Durations

```css
/* In tokens.motion.css */
@theme {
  --duration-instant: 80ms;
  --duration-fast: 120ms;
  --duration-normal: 240ms;
  --duration-slow: 500ms;
}
```

### 12.3 Keyframes (ONLY in tokens.motion.css)

```css
/* Allowed animations */
@keyframes fade-in {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px) }
  to { opacity: 1; transform: translateY(0) }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(100%) }
  to { opacity: 1; transform: translateX(0) }
}

@keyframes marquee-left {
  from { transform: translateX(0) }
  to { transform: translateX(var(--marquee-translate)) }
}

@keyframes cursor-blink {
  50% { opacity: 0 }
}
```

**Rule:** NO new keyframes without approval

---

## 13. AUDIT & ENFORCEMENT

### 13.1 Local Development

**Quick audit (3 layers):**
```bash
bun run audit
```

**Full audit (11 layers):**
```bash
bun run audit:ci
```

### 13.2 CI/CD Enforcement

**GitHub Actions:** `.github/workflows/audit.yml`

**Triggers:**
- Push to main/develop
- Pull requests to main/develop

**Runs:**
1. Full 11-layer audit
2. Build verification
3. Uploads audit reports
4. Comments PR with results
5. Fails if critical violations

### 13.3 Pre-commit Enforcement

**Husky:** `.husky/pre-commit`

**Blocks:**
- Token file modifications
- Lint errors
- Audit failures

### 13.4 Audit Layers

**Quick Audit (Local):**
- Layer 03: TypeScript
- Layer 04: Design tokens
- Layer 07.5: UI normalization

**Full Audit (CI):**
- All 11 layers including:
  - Documentation verification
  - Phase locking
  - Security checks
  - Git protocol

---

## 14. SOURCES & REFERENCES

### Official Documentation

**Next.js 16:**
- [Next.js 16 Announcement](https://nextjs.org/blog/next-16)
- [App Router Documentation](https://nextjs.org/docs/app)
- [App Router Guides](https://nextjs.org/docs/app/guides)

**Tailwind CSS 4:**
- [Tailwind CSS v4.0 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Theme Variables Documentation](https://tailwindcss.com/docs/theme)
- [Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles)

**React 19:**
- [React 19 Official Blog](https://react.dev/blog/2024/12/05/react-19)
- [Server Components](https://react.dev/reference/react/use)

**CSS Standards:**
- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
- [MDN CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)

**Tools:**
- [Biome Configuration](https://biomejs.dev/reference/configuration/)
- [Husky Git Hooks](https://github.com/typicode/husky)
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)

**Best Practices:**
- [Tailwind CSS in Large Projects](https://www.wisp.blog/blog/best-practices-for-using-tailwind-css-in-large-projects)
- [Design System Governance](https://uxplanet.org/design-system-governance-8ab10e806e24)
- [Enterprise Design System](https://www.designstudiouiux.com/blog/enterprise-design-system/)

### Architecture Patterns

**ITCSS:**
- [ITCSS Architecture](https://www.smashingmagazine.com/2015/08/itcss-scalable-maintainable-css-architecture/)

**CUBE CSS:**
- [CUBE CSS](https://cube.fyi)

**Design Systems:**
- [Shopify Polaris Design Tokens](https://polaris.shopify.com/design/design-tokens)
- [GOV.UK Design System](https://design-system.service.gov.uk/design-tokens/)

---

## CHANGELOG

### 2026-01-07 - Critical Fixes Applied

**Fixes:**
1. ✅ Removed duplicate `@import "tailwindcss"` from token files
2. ✅ Added token files to Biome ignore list
3. ✅ Added token blocking to Husky pre-commit
4. ✅ Applied filesystem lock (read-only) to all token files

**Impact:**
- Eliminated refresh loops
- Prevented token auto-mutation
- Locked design system at all levels

**Verification:**
```bash
# All 4 checks pass
grep -R '@import "tailwindcss"' styles/
grep -A 12 '"files"' biome.json | grep "styles/tokens"
grep "styles/tokens" .husky/pre-commit
ls -la styles/tokens*.css | grep "^-r--"
```

---

## MAINTENANCE

### How to Update This Document

1. Make changes in this file
2. Update "Last Updated" date at top
3. Add entry to CHANGELOG
4. Run audit: `bun run audit:ci`
5. Commit: `git commit -m "docs: update DESIGN-FINAL2026.md"`

### Document Owners

**Primary:** Design System Architect
**Review:** Tech Lead
**Approval:** CTO

---

## EMERGENCY CONTACT

If this document conflicts with implementation:

1. **This document is authoritative**
2. Implementation must change to match this document
3. If this document is wrong, update it first
4. Never work around this document

**Violations will cause audit failures.**

---

**END OF DESIGN-FINAL2026**
