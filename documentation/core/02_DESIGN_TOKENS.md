# DESIGN TOKENS — Single Source of Truth

**All visual values MUST use tokens**

**Last Updated:** 2026-01-28

---

## 1. SSOT LOCATION (MANDATORY)

**ALL design tokens live in:** `styles/tokens.css`

**Accent colors constant lives in:** `context/ThemeContext.tsx`

**No other sources allowed.**

---

## 2. OKLCH COLOR SYSTEM

### Format

```
oklch(lightness chroma hue)
```

- **Lightness:** 0 (black) to 1 (white)
- **Chroma:** 0 (gray) to ~0.4 (vivid)
- **Hue:** 0-360° (color wheel)

### Brand Colors

```css
--color-brand-primary: oklch(0.65 0.16 45.0);   /* Terracotta Coral */
--color-brand-secondary: oklch(0.58 0.14 250.0); /* Serene Blue */
--color-primary: var(--color-brand-primary);     /* Alias */
```

### Accent Colors (5 Options)

```css
--color-accent-rust: oklch(0.58 0.15 50.0);      /* Warmth, comfort */
--color-accent-sage: oklch(0.62 0.08 150.0);     /* Fresh, organic */
--color-accent-teal: oklch(0.55 0.12 220.0);     /* Sophisticated */
--color-accent-berry: oklch(0.52 0.18 350.0);    /* Sweet, indulgent */
--color-accent-honey: oklch(0.7 0.12 85.0);      /* Golden hour */
```

**Usage:** Import from ThemeContext
```tsx
import { ACCENT_COLORS, AccentColorKey } from "@/context/ThemeContext";

const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};
```

### Semantic Colors

```css
--color-success: oklch(0.68 0.15 145.0);  /* Green */
--color-warning: oklch(0.72 0.14 85.0);   /* Amber */
--color-error: oklch(0.55 0.2 25.0);      /* Red */
--color-info: oklch(0.58 0.14 250.0);     /* Blue */
```

### Neutral Scale

```css
--color-gray-50:  oklch(0.97 0.005 250.0);
--color-gray-100: oklch(0.94 0.008 250.0);
--color-gray-200: oklch(0.88 0.012 250.0);
--color-gray-300: oklch(0.78 0.018 250.0);
--color-gray-400: oklch(0.62 0.025 250.0);
--color-gray-500: oklch(0.48 0.028 250.0);
--color-gray-600: oklch(0.38 0.025 250.0);
--color-gray-700: oklch(0.3 0.022 250.0);
--color-gray-800: oklch(0.24 0.018 250.0);
--color-gray-900: oklch(0.18 0.015 250.0);
```

### Theme-Aware Foreground/Background

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

## 3. SPACING SCALE (MANDATORY)

```css
--spacing-xs:  0.25rem;  /* 4px */
--spacing-sm:  0.5rem;   /* 8px */
--spacing-md:  1rem;     /* 16px ← Most common */
--spacing-lg:  1.5rem;   /* 24px */
--spacing-xl:  2rem;     /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
```

### Usage

```tsx
// Padding
<div className="p-[var(--spacing-md)]">
<div className="px-[var(--spacing-xl)] py-[var(--spacing-md)]">

// Gap
<div className="gap-[var(--spacing-sm)]">
<div className="gap-[var(--spacing-xl)]">

// Space (vertical)
<div className="space-y-[var(--spacing-xl)]">
```

---

## 4. TYPOGRAPHY SCALE (MANDATORY)

### Font Sizes

```css
--font-size-xs:   0.75rem;  /* 12px */
--font-size-sm:   0.875rem; /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg:   1.125rem; /* 18px */
--font-size-xl:   1.25rem;  /* 20px */
--font-size-2xl:  1.5rem;   /* 24px */
--font-size-3xl:  1.875rem; /* 30px */
--font-size-4xl:  2.25rem;  /* 36px */
--font-size-5xl:  3rem;     /* 48px */
--font-size-6xl:  3.75rem;  /* 60px */
```

### Letter Spacing

```css
--letter-spacing-tight:  -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide:   0.025em;
--letter-spacing-wider:  0.05em;
```

### Line Heights

```css
--line-height-tight:    1.25;
--line-height-normal:   1.5;
--line-height-relaxed:  1.625;
```

### Usage

```tsx
<h1 className="text-[var(--font-size-5xl)] font-black">
<h2 className="text-[var(--font-size-3xl)] font-bold">
<h3 className="text-[var(--font-size-2xl)] font-semibold">
<p className="text-[var(--font-size-base)]">
<span className="text-[var(--font-size-sm)] uppercase tracking-[var(--letter-spacing-wider)]">
```

---

## 5. BORDER RADIUS

```css
--radius-xs:   0.125rem;  /* 2px */
--radius-sm:   0.25rem;   /* 4px */
--radius-md:   0.375rem;  /* 6px */
--radius-lg:   0.5rem;    /* 8px */
--radius-xl:   0.75rem;   /* 12px */
--radius-2xl:  1rem;      /* 16px */
--radius-3xl:  1.5rem;    /* 24px */
--radius-full: 9999px;    /* circles, pills */
```

### Usage

```tsx
<div className="rounded-[var(--radius-2xl)]">  // Modal
<button className="rounded-[var(--radius-full)]"> // Pill button
```

---

## 6. SHADOWS

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Glass-Specific

```css
--shadow-glass:        0 8px 32px rgb(0 0 0 / 0.1);
--shadow-glass-strong: 0 8px 32px rgb(0 0 0 / 0.25);
--shadow-card:         0 10px 25px rgb(0 0 0 / 0.12);
```

---

## 7. BACKDROP BLUR

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

---

## 8. ANIMATION TOKENS (MANDATORY)

### Durations

```css
--duration-fast:   120ms;   /* Micro interactions */
--duration-normal: 240ms;   /* Standard transitions */
--duration-slow:   500ms;   /* Entrance animations */
```

### Easing Functions

```css
--ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);      /* Smooth exit */
--ease-out-quart:    cubic-bezier(0.23, 1, 0.32, 1);     /* Natural motion */
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);     /* Bidirectional */
```

### Usage

```tsx
// Hover effects
<div className="hover:scale-105 hover:brightness-110 transition-all">

// With custom duration
<div className="transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]">
```

---

## 9. GLASS TOKENS (THEME-AWARE)

```css
/* Automatically adjusts per theme */
--glass-bg: rgba(...);        /* Different per theme */
--glass-border: rgba(...);    /* Different per theme */
--glass-shadow: ...;          /* Different per theme */
```

### Light Mode
```css
--glass-bg: rgba(255, 255, 255, 0.35);
--glass-border: rgba(255, 255, 255, 0.5);
--glass-shadow: var(--shadow-glass);
```

### Dark Mode
```css
--glass-bg: rgba(30, 35, 45, 0.5);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-shadow: var(--shadow-glass-strong);
```

### Warm Mode
```css
--glass-bg: rgba(245, 235, 220, 0.4);
--glass-border: rgba(200, 180, 150, 0.3);
--glass-shadow: 0 8px 32px rgb(90 70 50 / 0.12);
```

---

## 10. LAYOUT TOKENS

```css
/* Header */
--header-height: 4rem;
--header-total-height: calc(var(--header-height) + var(--header-offset-top) * 2);
--header-offset-top: var(--spacing-md);

/* Panel */
--panel-width: 13.2rem;
--panel-radius: var(--radius-2xl);
--panel-offset-top: var(--spacing-md);

/* Page */
--page-top-offset: var(--header-total-height);
--page-max-width: 64rem;
--page-padding-x: var(--spacing-md);

/* Section */
--section-gap-sm: var(--spacing-2xl);
--section-gap-md: var(--spacing-3xl);
--section-gap-lg: var(--spacing-4xl);
```

---

## 11. BREAKPOINTS

```css
--breakpoint-sm:  40rem;  /* 640px */
--breakpoint-md:  48rem;  /* 768px */
--breakpoint-lg:  64rem;  /* 1024px */
--breakpoint-xl:  80rem;  /* 1280px */
--breakpoint-2xl: 96rem;  /* 1536px */
```

### Tailwind Responsive Classes

| Breakpoint | Min Width | Tailwind |
|------------|-----------|----------|
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |

---

## 12. CARD TOKENS

```css
/* Card Types */
--card-accent-restaurant: oklch(0.65 0.16 45.0);  /* Warm orange */
--card-accent-blog: oklch(0.58 0.14 250.0);      /* Cool blue */

/* Card Heights (NON-NEGOTIABLE) */
--card-height-mini: 140px;
--card-height-standard: 220px;
--card-height-rich: 300px;
--card-height-full: 420px;
```

**Card height NEVER expands.** Content must adapt via line-clamp.

---

## 13. ICON SIZES

```css
--icon-size-sm: 1rem;      /* 16px */
--icon-size-md: 1.25rem;   /* 20px */
--icon-size-lg: 1.875rem;  /* 30px */
--icon-size-xl: 2.5rem;    /* 40px */
```

---

## 14. Z-INDEX LAYERS

```css
--z-header: 100;
--z-side-menu: 110;
--z-side-menu-backdrop: 60;
--z-theme-modal: 120;
--z-theme-modal-backdrop: 80;
```

---

## 15. ALLOWED VS FORBIDDEN (MANDATORY)

### ✅ ALLOWED

```tsx
// Using token reference in Tailwind
<div className="p-[var(--spacing-md)] gap-[var(--spacing-xl)]">

// Dynamic color with class mapping
const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};

// Theme-aware foreground/background
<div className="text-[rgb(var(--fg))] bg-[rgb(var(--bg))]">
```

### ❌ FORBIDDEN

```tsx
// Inline styles
<div style={{ color: "#ff0000", padding: "20px" }}>

// Hardcoded hex
<div className="bg-[#ff0000]">

// Tailwind literals (use tokens instead)
<div className="bg-blue-500 p-8">

// getComputedStyle
const color = getComputedStyle(el).getPropertyValue(...);

// Local color constants
const MY_COLORS = { primary: "#ff0000" };
```

---

## 16. QUICK REFERENCE

```tsx
// Colors
var(--fg) / var(--bg)
var(--color-primary)
var(--color-accent-rust)

// Spacing
var(--spacing-md)
var(--spacing-xl)
var(--section-gap-md)

// Typography
var(--font-size-base)
var(--font-size-5xl)
var(--line-height-normal)

// Effects
var(--shadow-glass)
var(--blur-md)
var(--radius-2xl)

// Animation
var(--duration-fast)
var(--ease-out-quart)

// Layout
var(--header-total-height)
var(--page-top-offset)
var(--touch-target-min)
```

---

## 17. AUDIT COMPLIANCE

**Layer 04: Design Tokens** checks for:
- Hardcoded colors (hex/rgb in JSX)
- Inline styles (`style={{}}`)
- Non-token spacing/sizes
- Forbidden patterns

**Run:**
```bash
bun run audit --layer=04
```

**Failure means:** Code contains hardcoded values that MUST be replaced with tokens.

---

**This document is the SSOT for all design tokens.** Use tokens ONLY. No exceptions.

**For detailed examples, see:** `documentation/reference/DESIGN_SYSTEM_CANONICAL.md`
