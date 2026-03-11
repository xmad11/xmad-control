# OWNER CHEATSHEET — Quick Reference for Design System

> **Restaurant Platform 2025-2026 | OKLCH Color System**
>
> For project owners and agents working on UI changes

---

## TL;DR — What You MUST Know

1. **OKLCH Color Format**: `oklch(lightness chroma hue)` - perceptually uniform
2. **SSOT**: All tokens in `styles/tokens.css`, colors in `context/ThemeContext.tsx`
3. **No hardcoded values**: Use `var(--token-name)` in Tailwind classes
4. **Hybrid responsive**: `md:` classes for layout, token overrides for sizing
5. **Three theme modes**: light, dark, warm (independent of accent color)

---

## Color Quick Reference

### Brand Colors

```css
--color-brand-primary: oklch(0.65 0.16 45.0);   /* Terracotta Coral */
--color-brand-secondary: oklch(0.58 0.14 250.0); /* Serene Blue */
--color-primary: var(--color-brand-primary);     /* Alias */
```

### Accent Colors (5 Options)

| Name | OKLCH Value | Emotion |
|------|-------------|---------|
| rust | `oklch(0.58 0.15 50.0)` | Warmth, comfort food |
| sage | `oklch(0.62 0.08 150.0)` | Fresh, organic |
| teal | `oklch(0.55 0.12 220.0)` | Sophisticated, premium |
| berry | `oklch(0.52 0.18 350.0)` | Sweet, indulgent |
| honey | `oklch(0.7 0.12 85.0)` | Golden hour, comfort |

### Utility Classes

```tsx
// Tailwind v4 with OKLCH tokens
className="bg-primary"           // Terracotta Coral
className="bg-secondary"         // Serene Blue
className="bg-accent-rust"       // Rust accent
className="bg-accent-sage"       // Sage accent
className="text-primary"         // Primary text color
className="text-accent-teal"     // Teal text
```

---

## Spacing Scale

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
<div className="p-[var(--spacing-md)]">        // padding: 1rem
<div className="gap-[var(--spacing-xl)]">      // gap: 2rem
<div className="space-y-[var(--spacing-2xl)]"> // vertical gap: 3rem
```

---

## Typography Scale

```css
--font-size-xs:   0.75rem;  /* 12px - captions */
--font-size-sm:   0.875rem; /* 14px - small text */
--font-size-base: 1rem;     /* 16px - body */
--font-size-lg:   1.125rem; /* 18px - emphasis */
--font-size-xl:   1.25rem;  /* 20px - subheading */
--font-size-2xl:  1.5rem;   /* 24px - h3 */
--font-size-3xl:  1.875rem; /* 30px - h2 */
--font-size-4xl:  2.25rem;  /* 36px - h1 */
--font-size-5xl:  3rem;     /* 48px - display */
```

### Usage

```tsx
<h1 className="text-[var(--font-size-5xl)] font-black">
<p className="text-[var(--font-size-base)]">
<span className="text-[var(--font-size-xs)] uppercase tracking-widest">
```

---

## Border Radius

```css
--radius-sm:   0.25rem;  /* 4px - small corners */
--radius-md:   0.375rem; /* 6px - medium */
--radius-lg:   0.5rem;   /* 8px - cards */
--radius-xl:   0.75rem;  /* 12px - panels */
--radius-2xl:  1rem;     /* 16px - modals */
--radius-full: 9999px;   /* circles, pills */
```

### Usage

```tsx
<div className="rounded-[var(--radius-2xl)]">  // Modal
<button className="rounded-[var(--radius-full)]"> // Pill button
```

---

## Responsive Design — Hybrid Approach

### When to Use What

| Use Case | Method | Example |
|----------|--------|---------|
| Grid layout changes | `md:`, `lg:` classes | `grid-cols-1 md:grid-cols-2` |
| Flex direction | `md:`, `lg:` classes | `flex-col md:flex-row` |
| Hide/show | `md:`, `lg:` classes | `hidden md:block` |
| Font size on mobile | Token override in `tokens.css` | `--header-logo-size` |
| Spacing on mobile | Token override in `tokens.css` | `--header-padding-x` |

### Examples

```tsx
// ✅ Grid responsive (component-level)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-xl)]">

// ✅ Flex responsive (component-level)
<div className="flex flex-col md:flex-row items-center gap-[var(--spacing-md)]">

// ✅ Font size responsive (token-level in tokens.css)
<h1 className="text-[var(--font-size-5xl)] md:text-[calc(var(--font-size-5xl)*1.25)]">
```

---

## Glass Components

### Apply Glass Class

```tsx
<div className="glass-card p-[var(--spacing-xl)]">
```

### Glass Tokens (Theme-Aware)

```css
/* Automatically adjusts per theme */
--glass-bg: rgba(...);        /* Different per theme */
--glass-border: rgba(...);    /* Different per theme */
--glass-shadow: ...;          /* Different per theme */
```

---

## Theme System

### Three Modes

| Mode | Background | Foreground | Best For |
|------|------------|------------|----------|
| light | Cream off-white | Dark gray | Daytime, bright |
| dark | Deep blue-gray | Off-white | Nighttime, low light |
| warm | Honeyed beige | Warm brown | Cozy, comfort |

### Accent Color (Independent)

User selects accent separately:
- rust, sage, teal, berry, honey

### Theme Mode ≠ Accent Color

```tsx
// ❌ WRONG - Warm mode does NOT change accent
if (mode === "warm") accentColor = "rust"; // NO!

// ✅ CORRECT - Accent is independent
accentColor = userSelected; // Stays same across themes
```

---

## Common Patterns

### Button

```tsx
<button className="
  bg-primary text-white
  px-[var(--spacing-2xl)] py-[var(--spacing-md)]
  rounded-[var(--radius-full)]
  font-bold
  hover:brightness-110 hover:scale-105
  active:scale-95
  transition-all
">
```

### Card with Glass

```tsx
<div className="
  glass-card
  p-[var(--spacing-xl)]
  rounded-[var(--radius-2xl)]
  group
">
  <div className="group-hover:scale-105 transition-transform">
    {/* Content */}
  </div>
</div>
```

### Section Container

```tsx
<section className="
  space-y-[var(--section-gap-md)]
  px-[var(--spacing-md)]
  py-[var(--spacing-3xl)]
">
```

### Icon

```tsx
<Icon className="
  h-[var(--icon-size-lg)]
  w-[var(--icon-size-lg)]
  text-primary
"/>
```

---

## Dynamic Color Pattern

```tsx
import { ACCENT_COLORS, AccentColorKey } from "@/context/ThemeContext";

// Create class mapping
const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};

// Use with dynamic color
<div className={`${accentClasses[colorKey]} p-[var(--spacing-md)]`}>
```

---

## Forbidden Patterns

```tsx
// ❌ NEVER - Inline styles
<div style={{ color: "#ff0000", padding: "20px" }}>

// ❌ NEVER - Hardcoded hex
<div className="bg-[#ff0000]">

// ❌ NEVER - Hardcoded spacing
<div className="p-8">  // Use p-[var(--spacing-2xl)]

// ❌ NEVER - getComputedStyle
const color = getComputedStyle(el).getPropertyValue(...);

// ❌ NEVER - Define colors locally
const MY_COLORS = { primary: "#ff0000" };
```

---

## File Locations

| File | Purpose |
|------|---------|
| `styles/tokens.css` | ALL design tokens (SSOT) |
| `styles/globals.css` | Glass classes, base styles |
| `context/ThemeContext.tsx` | ACCENT_COLORS constant |
| `documentation/DESIGN_SYSTEM_CANONICAL.md` | Full documentation |

---

## Audit Commands

```bash
# Run full audit
bun run scripts/audit-runner.ts

# Check token compliance
bun run scripts/audit/04-design-tokens.ts

# Check UI patterns
bun run scripts/audit/07.5-ui-normalization.ts
```

---

## Pre-Commit Checklist

- [ ] No hardcoded colors (hex/rgb in JSX)
- [ ] No inline styles (`style={{}}`)
- [ ] All spacing uses `--spacing-*`
- [ ] All typography uses `--font-size-*`
- [ ] All colors use tokens or accent classes
- [ ] Tested in light, dark, and warm modes
- [ ] Audit passes

---

## Quick Token Reference

```tsx
// Colors
var(--color-brand-primary)
var(--color-accent-rust)
var(--fg) / var(--bg)

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

// Layout
var(--max-w-xl)
var(--page-top-offset)
var(--touch-target-min)
```

---

## Need More?

- **Full documentation**: `documentation/DESIGN_SYSTEM_CANONICAL.md`
- **Component inventory**: `documentation/COMPONENT_INVENTORY.md`
- **Agent instructions**: `documentation/AGENT_INSTRUCTIONS.md`

---

**Remember**: OKLCH is the standard. Tokens are the truth. Hybrid responsive is the approach.
