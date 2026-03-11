# COMPONENT INVENTORY — Restaurant Platform 2025-2026

> **Complete catalog of all UI components** with usage guidelines and token dependencies

---

## Table of Contents

1. [Infrastructure Components](#1-infrastructure-components)
2. [Navigation Components](#2-navigation-components)
3. [Content Components](#3-content-components)
4. [Form Components](#4-form-components)
5. [Utility Components](#5-utility-components)

---

## 1. Infrastructure Components

### Header

**File**: `components/Header.tsx`

**Purpose**: Site navigation header with logo, menu toggle, and theme selector

**Props**:
```tsx
interface HeaderProps {
  onMenuClick: () => void;
  onThemeClick: () => void;
  onHeaderClick?: () => void;
}
```

**Tokens Used**:
```css
--header-width
--header-offset-top
--header-padding-y
--header-padding-x-normal
--header-padding-x-scrolled
--header-logo-size
--header-logo-gap
--header-actions-gap
--header-height
--header-total-height
--header-icon-center-y
```

**Classes**: `glass-header`

**Responsive Behavior**:
- Mobile: Smaller logo, reduced padding
- Desktop: Full size logo, expanded padding

**Usage**:
```tsx
<Header
  onMenuClick={() => setActivePanel("menu")}
  onThemeClick={() => setActivePanel("theme")}
  onHeaderClick={closeAll}
/>
```

---

### SideMenu

**File**: `components/SideMenu.tsx`

**Purpose**: Slide-out navigation menu from left side

**Props**:
```tsx
interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Tokens Used**:
```css
--side-menu-width
--panel-radius
--z-side-menu
--z-side-menu-backdrop
```

**Classes**: `glass`

**Animation**: `slide-in-right`

**Usage**:
```tsx
{activePanel === "menu" && (
  <SideMenu isOpen={true} onClose={closeAll} />
)}
```

---

### ThemeModal

**File**: `components/ThemeModal.tsx`

**Purpose**: Theme mode (light/dark/warm) and accent color selector

**Props**:
```tsx
interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Tokens Used**:
```css
--panel-radius
--theme-modal-inset
--theme-modal-slide-distance
--ring-width
--ring-offset
--icon-scale-down
--theme-modal-top-aligned
--z-theme-modal
--z-theme-modal-backdrop
```

**Accent Colors**:
```tsx
ACCENT_COLORS = {
  rust, sage, teal, berry, honey
}
```

**Usage**:
```tsx
{activePanel === "theme" && (
  <ThemeModal isOpen={true} onClose={closeAll} />
)}
```

---

## 2. Navigation Components

### Navigation Links

**File**: `components/SideMenu.tsx` (embedded)

**Purpose**: Main site navigation links

**Links**:
- Home
- Restaurants
- Cuisines
- About
- Contact

**Tokens Used**:
```css
--spacing-md
--spacing-lg
--radius-lg
```

**Hover Effect**: `hover:bg-[oklch(var(--fg)/0.05)]`

---

## 3. Content Components

### HomeClient

**File**: `components/HomeClient.tsx`

**Purpose**: Main landing page with hero, features, and cuisine showcase

**Sections**:

#### Hero Section
**Tokens Used**:
```css
--font-size-5xl
--font-size-lg
--spacing-2xl
--section-gap-md
--radius-full
--hero-bg-height
--hero-deco-1-top/left/size
--hero-deco-2-bottom/right/size
```

**Features**:
- Status badge with sparkle icon
- Large heading with gradient text
- CTA buttons with hover effects

#### FeatureCard (Embedded)
**Props**:
```tsx
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorClass: "rust" | "sage" | "teal" | "berry" | "honey";
}
```

**Features**:
- Icon with glow effect
- Title and description
- Hover animations (scale, brightness)

**Accent Classes**:
```tsx
bg-accent-${colorClass}/30    // Glow
bg-accent-${colorClass}/15    // Background
text-accent-${colorClass}     // Text
```

#### Cuisine Showcase
**Tokens Used**:
```css
--font-size-3xl
--spacing-md
--spacing-sm
--section-gap-md
--spacing-3xl
--radius-xl
```

**Cuisines**: Local, Italian, Japanese, Mexican, Indian, Chinese

---

## 4. Form Components

### Buttons

**Pattern** (reusable):

```tsx
// Primary Button
<button className="
  group flex items-center gap-[var(--spacing-md)]
  bg-primary text-white
  px-[var(--spacing-2xl)] py-[var(--spacing-md)]
  rounded-[var(--radius-full)]
  font-bold shadow-xl
  hover:brightness-110 hover:scale-105
  active:scale-95
  transition-all
  w-full sm:w-auto
">
  Button Text
  <ArrowRightIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)]
    transition-transform group-hover:translate-x-1" />
</button>

// Secondary Button (Glass)
<button className="
  flex items-center gap-[var(--spacing-sm)]
  glass px-[var(--spacing-2xl)] py-[var(--spacing-md)]
  rounded-[var(--radius-full)]
  font-bold hover:bg-[oklch(var(--fg)/0.05)]
  active:scale-95
  transition-all
  w-full sm:w-auto
">
  Button Text
</button>
```

**Tokens Used**:
```css
--spacing-md
--spacing-2xl
--radius-full
--icon-size-lg
--touch-target-min
```

---

## 5. Utility Components

### Glass Card

**CSS Class** (in `globals.css`):
```css
.glass-card {
  @apply glass;
  transition: all 0.3s var(--ease-out-quart);
}

.glass-card:hover {
  background: oklch(var(--fg) / 0.05);
  transform: translateY(-2px);
}
```

**Usage**:
```tsx
<div className="glass-card p-[var(--spacing-xl)] rounded-[var(--radius-2xl)]">
  {/* Content */}
</div>
```

### Gradient Text

**CSS Class** (in `globals.css`):
```css
.gradient-text {
  background: linear-gradient(135deg,
    oklch(var(--color-brand-primary)),
    oklch(var(--color-brand-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Usage**:
```tsx
<span className="gradient-text italic">
  Restaurants
</span>
```

---

## Component Token Dependencies

### Header
```css
/* Sizing */
--header-logo-size: 2.8rem (mobile: 2.38rem)
--header-logo-gap: var(--spacing-md) (mobile: var(--spacing-sm))
--header-actions-gap: var(--spacing-xl) (mobile: 0.75rem)
--header-padding-x-normal: var(--spacing-xl) (mobile: var(--spacing-sm))
--header-padding-x-scrolled: var(--spacing-3xl) (mobile: var(--spacing-md))
--header-height: 4rem
--header-total-height: calc(...)

/* Positioning */
--header-offset-top: var(--spacing-md)
--header-icon-center-y: calc(...)
```

### SideMenu
```css
--side-menu-width: 13.2rem
--panel-radius: var(--radius-2xl)
--z-side-menu: 110
--z-side-menu-backdrop: 60
```

### ThemeModal
```css
--panel-radius: var(--radius-2xl)
--theme-modal-inset: var(--spacing-md)
--theme-modal-slide-distance: var(--spacing-xl)
--ring-width: 1px
--ring-offset: var(--spacing-xs)
--icon-scale-down: 0.85
--theme-modal-top-aligned: calc(...)
--z-theme-modal: 120
--z-theme-modal-backdrop: 80
```

### HomeClient
```css
/* Hero */
--hero-bg-height: 600px
--hero-deco-1-top: -10%
--hero-deco-1-left: -10%
--hero-deco-1-size: 40%
--hero-deco-2-bottom: 20%
--hero-deco-2-right: -5%
--hero-deco-2-size: 30%

/* Layout */
--page-top-offset: var(--header-total-height)
--section-gap-md: var(--spacing-3xl)
--spacing-4xl: 6rem
--spacing-xl: 2rem

/* Feature Cards */
--radius-2xl: 1rem
--icon-size-lg: 1.875rem
```

---

## Responsive Behavior Summary

| Component | Mobile Override | Desktop Default |
|-----------|----------------|-----------------|
| Header | `--header-logo-size: 2.38rem` | `2.8rem` |
| Header | `--header-padding-x-normal: var(--spacing-sm)` | `var(--spacing-xl)` |
| HomeClient | `md:text-[calc(var(--font-size-5xl)*1.25)]` | `text-[var(--font-size-5xl)]` |
| FeatureCard | `grid-cols-1` | `md:grid-cols-2 lg:grid-cols-4` |
| Cuisines | `grid-cols-2` | `md:grid-cols-3 lg:grid-cols-6` |
| Buttons | `w-full` | `sm:w-auto` |

---

## Component Creation Guidelines

### When Creating New Components:

1. **Import Required Context**
```tsx
import { useTheme } from "@/context/ThemeContext";
import { ACCENT_COLORS, AccentColorKey } from "@/context/ThemeContext";
```

2. **Use Token-Based Classes**
```tsx
<div className="p-[var(--spacing-md)] gap-[var(--spacing-lg)]">
```

3. **Support All Three Themes**
```tsx
const { mode } = useTheme();
// Test with light, dark, warm modes
```

4. **Responsive with Hybrid Approach**
```tsx
// Layout changes via Tailwind classes
<div className="grid grid-cols-1 md:grid-cols-2">

// Value changes via tokens
<h1 className="text-[var(--font-size-5xl)]">
```

5. **Dynamic Color Pattern**
```tsx
const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  // ...
};

<div className={accentClasses[colorKey]}>
```

---

## File Structure

```
components/
├── Header.tsx           # Site header with navigation
├── SideMenu.tsx         # Slide-out menu
├── ThemeModal.tsx       # Theme + accent selector
├── HomeClient.tsx       # Landing page
└── icons/               # Heroicons re-exports
    ├── └── index.tsx
```

---

## Component Status

| Component | Status | Responsive | Accessible |
|-----------|--------|------------|------------|
| Header | ✅ Complete | ✅ Yes | ✅ Yes |
| SideMenu | ✅ Complete | ✅ Yes | ✅ Yes |
| ThemeModal | ✅ Complete | ✅ Yes | ✅ Yes |
| HomeClient | ✅ Complete | ✅ Yes | ⚠️ Some touch targets |
| FeatureCard | ✅ Complete | ✅ Yes | ✅ Yes |

---

## Next Steps

1. Add Form Components (input, textarea, select)
2. Add Feedback Components (toast, alert, modal)
3. Add Data Display Components (table, list, card)
4. Improve accessibility (touch targets, ARIA labels)

---

**Last Updated**: 2025-12-25
**Design System Version**: 2.0 (OKLCH)
