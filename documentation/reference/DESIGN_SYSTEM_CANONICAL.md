# Reference Document

> **Reference only — not required for agent execution**
>
> This document is preserved for detailed reference and troubleshooting.
> For core rules, see `documentation/core/`.

---

# DESIGN SYSTEM CANONICAL — Single Source of Truth (SSOT)

> **Authoritative** • **Immutable** • **Enforceable**
>
> Restaurant Platform 2025-2026 | OKLCH Color Space

This document is the single source of truth for all UI design rules, tokens, theme usage, component standards, and page layouts. All developers and agents must follow it.

---

## Table of Contents

1. [Core Principles](#1-core-principles-non-negotiable)
2. [OKLCH Color System](#2-oklch-color-system)
3. [Design Tokens](#3-design-tokens-ssot-location-stylestokenscss)
4. [Theme System](#4-theme-system)
5. [Component Rules](#5-component-rules)
6. [Responsive Design](#6-responsive-design)
7. [Glass Components](#7-glass-components)
8. [Animation System](#8-animation-system)
9. [Page Layout Protocol](#9-page-layout-protocol)
10. [Typography](#10-typography)
11. [Spacing & Layout](#11-spacing--layout)
12. [Audit & Enforcement](#12-audit--enforcement)
13. [Quick Reference](#13-quick-reference)

---

## 1. Core Principles (NON-NEGOTIABLE)

### 1.1 Single Source of Truth (SSOT)
- All visual values live in `styles/tokens.css`
- Components consume tokens, never define visuals
- `context/ThemeContext.tsx` contains `ACCENT_COLORS` constant

### 1.2 OKLCH Color Space
- **Perceptually uniform**: consistent color appearance across devices
- **Eye-friendly**: optimized for long browsing sessions
- **Restaurant-themed**: warm, appetizing palette
- **No pure black/white**: reduces eye strain

### 1.3 Token-First Development
- Use design tokens for ALL visual values
- No hardcoded hex colors in components
- No arbitrary spacing, sizes, shadows
- Use `var(--token-name)` in Tailwind classes

### 1.4 Theme = Background System
- Theme modes (light/dark/warm) change ONLY foreground/background
- Accent color is INDEPENDENT of theme mode
- User selects accent separately from theme

---

## 2. OKLCH Color System

### 2.1 What is OKLCH?

OKLCH is a perceptually uniform color space:
- **Format**: `oklch(lightness chroma hue)`
- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.4 (vivid)
- **Hue**: 0-360° (color wheel)

### 2.2 Brand Colors

```css
/* Primary: Terracotta Coral - appetizing, warm, memorable */
--color-brand-primary: oklch(0.65 0.16 45.0);

/* Secondary: Serene Blue - trust, reliability, calm */
--color-brand-secondary: oklch(0.58 0.14 250.0);

/* Convenience aliases */
--color-primary: var(--color-brand-primary);
--color-secondary: var(--color-brand-secondary);
```

### 2.3 Accent Colors (Theme Selector)

```css
/* rust: warmth, comfort food */
--color-accent-rust: oklch(0.58 0.15 50.0);

/* sage: fresh, organic, healthy */
--color-accent-sage: oklch(0.62 0.08 150.0);

/* teal: sophisticated, premium seafood */
--color-accent-teal: oklch(0.55 0.12 220.0);

/* berry: sweet, indulgent desserts */
--color-accent-berry: oklch(0.52 0.18 350.0);

/* honey: golden hour, comfort */
--color-accent-honey: oklch(0.7 0.12 85.0);
```

### 2.4 Semantic Colors

```css
--color-success: oklch(0.68 0.15 145.0);  /* Green */
--color-warning: oklch(0.72 0.14 85.0);   /* Amber */
--color-error: oklch(0.55 0.2 25.0);      /* Red */
--color-info: oklch(0.58 0.14 250.0);     /* Blue */
```

### 2.5 Neutral Scale (Eye-Friendly)

```css
--color-gray-50:  oklch(0.97 0.005 250.0);  /* Near white */
--color-gray-100: oklch(0.94 0.008 250.0);
--color-gray-200: oklch(0.88 0.012 250.0);
--color-gray-300: oklch(0.78 0.018 250.0);
--color-gray-400: oklch(0.62 0.025 250.0);
--color-gray-500: oklch(0.48 0.028 250.0);
--color-gray-600: oklch(0.38 0.025 250.0);
--color-gray-700: oklch(0.3 0.022 250.0);
--color-gray-800: oklch(0.24 0.018 250.0);
--color-gray-900: oklch(0.18 0.015 250.0);  /* Near black */
```

### 2.6 Theme-Aware Foreground/Background

```css
/* Light Mode (default) */
:root {
  --fg: oklch(0.25 0.02 250.0);   /* Dark gray text */
  --bg: oklch(0.98 0.005 85.0);   /* Cream off-white */
}

/* Dark Mode */
[data-theme="dark"] {
  --fg: oklch(0.88 0.008 250.0);  /* Light gray text */
  --bg: oklch(0.22 0.02 250.0);   /* Deep blue-gray */
}

/* Warm Mode */
[data-theme="warm"] {
  --fg: oklch(0.3 0.04 65.0);     /* Warm brown text */
  --bg: oklch(0.94 0.02 75.0);    /* Honeyed beige */
}
```

---

## 3. Design Tokens (SSOT Location: `styles/tokens.css`)

### 3.1 Spacing Scale

```css
--spacing-xs:  0.25rem;  /* 4px */
--spacing-sm:  0.5rem;   /* 8px */
--spacing-md:  1rem;     /* 16px */
--spacing-lg:  1.5rem;   /* 24px */
--spacing-xl:  2rem;     /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
```

### 3.2 Typography Scale

```css
/* Font Sizes */
--font-size-xs:   0.75rem;   /* 12px */
--font-size-sm:   0.875rem;  /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg:   1.125rem;  /* 18px */
--font-size-xl:   1.25rem;   /* 20px */
--font-size-2xl:  1.5rem;    /* 24px */
--font-size-3xl:  1.875rem;  /* 30px */
--font-size-4xl:  2.25rem;   /* 36px */
--font-size-5xl:  3rem;      /* 48px */
--font-size-6xl:  3.75rem;   /* 60px */

/* Letter Spacing */
--letter-spacing-tight:  -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide:   0.025em;
--letter-spacing-wider:  0.05em;

/* Line Heights */
--line-height-tight:    1.25;
--line-height-normal:   1.5;
--line-height-relaxed:  1.625;
```

### 3.3 Border Radius

```css
--radius-xs:   0.125rem;  /* 2px */
--radius-sm:   0.25rem;   /* 4px */
--radius-md:   0.375rem;  /* 6px */
--radius-lg:   0.5rem;    /* 8px */
--radius-xl:   0.75rem;   /* 12px */
--radius-2xl:  1rem;      /* 16px */
--radius-3xl:  1.5rem;    /* 24px */
--radius-full: 9999px;
```

### 3.4 Shadows

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Glass-specific */
--shadow-glass:        0 8px 32px rgb(0 0 0 / 0.1);
--shadow-glass-strong: 0 8px 32px rgb(0 0 0 / 0.25);
--shadow-card:         0 10px 25px rgb(0 0 0 / 0.12);
```

### 3.5 Backdrop Blur

```css
--blur-xs:  4px;
--blur-sm:  8px;
--blur-md:  12px;
--blur-lg:  16px;
--blur-xl:  24px;
--blur-2xl: 40px;

/* Aliases */
--backdrop-blur-sm: var(--blur-sm);
--backdrop-blur-md: var(--blur-md);
```

### 3.6 Breakpoints

```css
--breakpoint-sm:  40rem;  /* 640px */
--breakpoint-md:  48rem;  /* 768px */
--breakpoint-lg:  64rem;  /* 1024px */
--breakpoint-xl:  80rem;  /* 1280px */
--breakpoint-2xl: 96rem;  /* 1536px */
```

---

## 4. Theme System

### 4.1 Theme Modes

```tsx
type ThemeMode = "light" | "dark" | "warm";
```

### 4.2 Accent Colors Constant

```tsx
// context/ThemeContext.tsx
export const ACCENT_COLORS = {
  rust: { oklch: "oklch(0.58 0.15 50.0)" },
  sage: { oklch: "oklch(0.62 0.08 150.0)" },
  teal: { oklch: "oklch(0.55 0.12 220.0)" },
  berry: { oklch: "oklch(0.52 0.18 350.0)" },
  honey: { oklch: "oklch(0.7 0.12 85.0)" },
} as const;

export type AccentColorKey = keyof typeof ACCENT_COLORS;
```

### 4.3 Theme Mode Rules

| Mode | Background | Foreground | Accent Colors |
|------|------------|------------|---------------|
| **light** | Cream off-white | Dark gray | User-selected |
| **dark** | Deep blue-gray | Off-white | User-selected |
| **warm** | Honeyed beige | Warm brown | User-selected |

**IMPORTANT**: Warm mode does NOT change accent color. Accent remains user-selected.

---

## 5. Component Rules

### 5.1 Components MAY

- Use Tailwind utilities with token references
- Use `var(--token-name)` in classes
- Use `ACCENT_COLORS` from ThemeContext
- Use responsive classes (`md:`, `lg:`) for layout changes
- Use pre-defined class mappings for dynamic colors

```tsx
// ✅ CORRECT - Using token reference
<div className="p-[var(--spacing-md)] bg-[rgb(var(--bg))]">

// ✅ CORRECT - Using class mapping for dynamic colors
const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};

// ✅ CORRECT - Responsive layout with tokens
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-xl)]">
```

### 5.2 Components MAY NOT

- Use `style={{}}` for colors, spacing, or sizes
- Use `#hex` colors in JSX
- Define sizes/colors locally
- Use `getComputedStyle` to read CSS variables at runtime

```tsx
// ❌ WRONG - Inline style
<div style={{ backgroundColor: "#ff0000" }}>

// ❌ WRONG - Hardcoded hex
<div className="bg-[#ff0000]">

// ❌ WRONG - getComputedStyle
const rgb = getComputedStyle(document.documentElement).getPropertyValue(...);
```

---

## 6. Responsive Design

### 6.1 Hybrid Approach

This project uses a **hybrid responsive approach**:

1. **Component-level responsive**: Tailwind responsive classes for layout changes
2. **Token-level responsive**: Media queries in `tokens.css` for value adjustments

### 6.2 When to Use Each

**Use Tailwind responsive classes (`md:`, `lg:`) for:**
- Grid column changes: `grid-cols-1 md:grid-cols-2`
- Flex direction changes: `flex-col md:flex-row`
- Visibility toggles: `hidden md:block`
- Width changes: `w-full md:w-auto`

**Use token overrides in `tokens.css` for:**
- Sizing adjustments: `--font-size-5xl` → smaller on mobile
- Spacing adjustments: `--spacing-xl` → reduced on mobile
- Component-specific values: `--header-logo-size` changes

### 6.3 Mobile Token Overrides

```css
/* styles/tokens.css */
@media (max-width: 640px) {
  :root {
    --header-logo-size: 2.38rem;
    --header-logo-gap: var(--spacing-sm);
    --header-actions-gap: 0.75rem;
    --header-padding-x-normal: var(--spacing-sm);
    --header-padding-x-scrolled: var(--spacing-md);
  }
}
```

### 6.4 Examples

```tsx
// ✅ CORRECT - Layout change via responsive class
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ✅ CORRECT - Token value with responsive override
<h1 className="text-[var(--font-size-5xl)] md:text-[calc(var(--font-size-5xl)*1.25)]">

// ✅ CORRECT - Combined approach
<div className="flex flex-col md:flex-row gap-[var(--spacing-md)]">
```

---

## 7. Glass Components

### 7.1 Base Glass Classes

```css
/* styles/globals.css */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

.glass-card {
  @apply glass;
  transition: all 0.3s var(--ease-out-quart);
}

.glass-card:hover {
  background: oklch(var(--fg) / 0.05);
  transform: translateY(-2px);
}
```

### 7.2 Theme-Aware Glass Colors

```css
/* Light Mode */
:root {
  --glass-bg: rgba(255, 255, 255, 0.35);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-shadow: var(--shadow-glass);
}

/* Dark Mode */
[data-theme="dark"] {
  --glass-bg: rgba(30, 35, 45, 0.5);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: var(--shadow-glass-strong);
}

/* Warm Mode */
[data-theme="warm"] {
  --glass-bg: rgba(245, 235, 220, 0.4);
  --glass-border: rgba(200, 180, 150, 0.3);
  --glass-shadow: 0 8px 32px rgb(90 70 50 / 0.12);
}
```

### 7.3 Usage

```tsx
// ✅ Apply glass class
<div className="glass-card p-[var(--spacing-xl)]">
```

---

## 8. Animation System

### 8.1 Built-in Animations

```css
--animate-fade-in: fade-in 0.3s ease-out;
--animate-fade-in-up: fade-in-up 0.4s cubic-bezier(0.23, 1, 0.32, 1);
--animate-slide-in-right: slide-in-right 0.3s cubic-bezier(0.23, 1, 0.32, 1);
--animate-slide-in-left: slide-in-left 0.3s cubic-bezier(0.23, 1, 0.32, 1);
--animate-scale-in: scale-in 0.2s ease-out;
--animate-float: float 3s ease-in-out infinite;
```

### 8.2 Easing Functions

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
```

### 8.3 Usage Examples

```tsx
// Hover effects
<div className="hover:scale-105 hover:brightness-110 transition-all">

// Group hover
<div className="group">
  <div className="group-hover:translate-x-1 transition-transform">

// Custom animation
<div className="animate-[float_3s_ease-in-out_infinite]">
```

---

## 9. Page Layout Protocol

### 9.1 Standard Structure

```tsx
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import ThemeModal from "@/components/ThemeModal";

export default function NewPage() {
  return (
    <>
      <Header />
      <SideMenu />
      <ThemeModal />
      <main className="pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)] px-[var(--spacing-lg)]">
        <div className="max-w-[var(--max-w-xl)] mx-auto space-y-[var(--section-gap-md)]">
          {/* Page content */}
        </div>
      </main>
    </>
  );
}
```

### 9.2 Page Layout Tokens

```css
--page-top-offset: var(--header-total-height);
--section-gap-sm: var(--spacing-2xl);
--section-gap-md: var(--spacing-3xl);
--section-gap-lg: var(--spacing-4xl);
--section-padding: var(--spacing-xl);
--max-w-xl: 42rem;
--max-w-2xl: 64rem;
```

### 9.3 Z-Index Layers

```css
--z-header: 100;
--z-side-menu: 110;
--z-side-menu-backdrop: 60;
--z-theme-modal: 120;
--z-theme-modal-backdrop: 80;
```

---

## 10. Typography

### 10.1 Type Scale Usage

```tsx
// Display
<h1 className="text-[var(--font-size-5xl)] font-black">

// Headings
<h2 className="text-[var(--font-size-3xl)] font-bold">
<h3 className="text-[var(--font-size-2xl)] font-semibold">

// Body
<p className="text-[var(--font-size-base)]">
<p className="text-[var(--font-size-lg)]">

// Small
<span className="text-[var(--font-size-sm)]">
<span className="text-[var(--font-size-xs)]">
```

### 10.2 Font Weights

- `.font-black` - 900
- `.font-extrabold` - 800
- `.font-bold` - 700
- `.font-semibold` - 600
- `.font-medium` - 500
- `.font-normal` - 400

### 10.3 Special Text Styles

```tsx
// Gradient text
<span className="gradient-text italic">

// Uppercase with tracking
<span className="uppercase tracking-[var(--letter-spacing-wider)]">

// Opacity variants
<span className="opacity-60">  // 60%
<span className="opacity-40">  // 40%
```

---

## 11. Spacing & Layout

### 11.1 Gap/Spacing

```tsx
// Vertical spacing
<div className="space-y-[var(--spacing-md)]">
<div className="space-y-[var(--spacing-xl)]">

// Horizontal gap
<div className="gap-[var(--spacing-sm)]">
<div className="gap-[var(--spacing-xl)]">

// Padding
<div className="p-[var(--spacing-md)]">
<div className="px-[var(--spacing-xl)] py-[var(--spacing-md)]">
```

### 11.2 Touch Targets

```css
--touch-target-min: 2.75rem;  /* 44px */
```

All interactive elements should meet this minimum:

```tsx
// Button with minimum touch target
<button className="px-[var(--spacing-2xl)] py-[var(--spacing-md)]">
```

### 11.3 Section Spacing

```tsx
// Between sections
<section className="space-y-[var(--section-gap-md)]">

// Section container
<div className="px-[var(--spacing-md)] py-[var(--spacing-3xl)]">
```

---

## 12. Audit & Enforcement

### 12.1 Required Checks

All components must pass:
1. **No inline styles** (`style={{}}`)
2. **No hardcoded colors** (hex values in JSX)
3. **Only token-based values** for spacing, typography, colors
4. **OKLCH compliance** - use OKLCH color format

### 12.2 Audit Commands

```bash
# Run full audit
bun run scripts/audit-runner.ts

# Run specific layers
bun run scripts/audit/00-pre-flight.ts      # Environment check
bun run scripts/audit/03-typescript.ts       # TypeScript check
bun run scripts/audit/04-design-tokens.ts    # Token compliance
bun run scripts/audit/07.5-ui-normalization.ts # UI normalization
```

### 12.3 Pre-Commit Checklist

- [ ] No hardcoded values added
- [ ] All spacing uses `--spacing-*`
- [ ] All colors use `--color-*` or accent classes
- [ ] All typography uses `--font-size-*`
- [ ] No inline styles
- [ ] Tested in all three theme modes

---

## 13. Quick Reference

### 13.1 Common Patterns

```tsx
// Spacing container
<div className="p-[var(--spacing-md)] gap-[var(--spacing-lg)]">

// Text with token color
<p className="text-[rgb(var(--fg))] opacity-60">

// Background with token
<div className="bg-[rgb(var(--bg))]">

// Accent color button
<button className="bg-primary text-white px-[var(--spacing-2xl)]">

// Icon size
<Icon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]">

// Border radius
<div className="rounded-[var(--radius-2xl)]">

// Shadow
<div className="shadow-[var(--shadow-glass)]">

// Blur
<div className="blur-[var(--blur-md)]">
```

### 13.2 Dynamic Color Pattern

```tsx
import { ACCENT_COLORS, AccentColorKey } from "@/context/ThemeContext";

// Class mapping
const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};

// Usage
<div className={`${accentClasses[colorKey]} p-[var(--spacing-md)]`}>
```

### 13.3 Responsive Layout

```tsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-xl)]">

// Flex responsive
<div className="flex flex-col md:flex-row items-center gap-[var(--spacing-md)]">

// Hide/show responsive
<br className="hidden md:block" />
```

---

## 14. File Structure

```
styles/
├── tokens.css         # ALL design tokens (SSOT)
├── globals.css        # Theme wiring, base styles, glass

context/
└── ThemeContext.tsx   # ACCENT_COLORS constant, theme provider

components/
├── Header.tsx         # Uses header tokens
├── ThemeModal.tsx     # Uses ACCENT_COLORS
├── SideMenu.tsx       # Uses panel tokens
└── HomeClient.tsx     # Landing page

documentation/
└── DESIGN_SYSTEM_CANONICAL.md  # This file
```

---

## 15. Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-12-25 | OKLCH color system, restaurant palette, hybrid responsive |
| 1.0 | 2025-12-24 | Initial canonical SSOT documentation |

---

**This document is the authoritative SSOT for design, theme, and component rules.**

All developers, agents, and audits should reference only this file.
