# DESIGN SYSTEM REFERENCE

**Project:** Shadi V2 - Restaurant Discovery Platform
**Last Updated:** 2026-01-03

---

## TABLE OF CONTENTS

1. [Design Tokens](#design-tokens)
2. [Component Standards](#component-standards)
3. [Layout Patterns](#layout-patterns)
4. [Color Usage](#color-usage)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Motion & Animation](#motion--animation)
8. [Accessibility](#accessibility)

---

## DESIGN TOKENS

All design values are defined in `/styles/tokens.css`. Use ONLY these tokens in your code.

### Color Tokens

```css
/* Foreground (text) */
--fg                   /* Primary text color */
--fg-10 through --fg-90  /* Opacity variants */

/* Background */
--bg                   /* Primary background */
--bg-5, --bg-10, --bg-20  /* Elevated surfaces */

/* Semantic Colors */
--color-primary        /* Brand color (terracotta/rust) */
--color-accent         /* Accent color */
--color-rating         /* Star rating color (yellow/gold) */
--color-favorite       /* Favorite color (red/pink) */
--color-success        /* Success (green) */
--color-warning        /* Warning (orange) */
--color-error          /* Error (red) */

/* Surface Colors */
--card-bg             /* Card background */
--border              /* Border color */
--glass-bg            /* Glass morphism background */

/* Glass Morphism */
--glass-bg            /* Glass background */
--glass-border        /* Glass border */
--glass-shadow        /* Glass shadow */
```

**Usage:**
```tsx
// ✅ CORRECT
className="bg-[var(--bg)] text-[var(--fg)]"
className="text-[var(--color-primary)]"
className="border-[var(--border)]"

// ❌ WRONG
className="bg-white text-gray-900"
className="text-terracotta"
className="border-gray-200"
```

### Spacing Tokens

```css
--spacing-xs    /* 4px */
--spacing-sm    /* 8px */
--spacing-md    /* 16px */
--spacing-lg    /* 24px */
--spacing-xl    /* 32px */
--spacing-2xl   /* 48px */
--spacing-3xl   /* 64px */
--spacing-4xl   /* 96px */
--spacing-5xl   /* 128px */
--spacing-6xl   /* 160px */
```

**Usage:**
```tsx
// ✅ CORRECT
className="p-[var(--spacing-md)]"
className="gap-[var(--spacing-lg)]"
className="m-[var(--spacing-xl)]"

// ❌ WRONG
className="p-4"
className="gap-6"
className="m-8"
```

### Typography Tokens

```css
/* Font Families */
--font-sans      /* Body text (Inter) */
--font-display   /* Headings (Playfair Display) */
--font-mono      /* Code (JetBrains Mono) */

/* Font Sizes */
--font-size-xs   /* 0.75rem */
--font-size-sm   /* 0.875rem */
--font-size-base /* 1rem */
--font-size-lg   /* 1.125rem */
--font-size-xl   /* 1.25rem */
--font-size-2xl  /* 1.5rem */
--font-size-3xl  /* 1.875rem */
--font-size-4xl  /* 2.25rem */
--font-size-5xl  /* 3rem */
--font-size-6xl  /* 3.75rem */

/* Semantic Headings */
--heading-page   /* Page titles */
--heading-section/* Section headers */
--heading-card   /* Card titles */
--heading-hero   /* Hero/display text */
```

**Usage:**
```tsx
// ✅ CORRECT
className="text-[var(--font-size-2xl)] font-[var(--font-sans)]"
className="text-[var(--heading-page)]"

// ❌ WRONG
className="text-2xl font-sans"
className="text-4xl"
```

### Border Tokens

```css
--radius-sm    /* 4px */
--radius-md    /* 6px */
--radius-lg    /* 8px */
--radius-xl    /* 12px */
--radius-2xl   /* 16px */
--radius-full  /* 9999px */

--border-width-thin  /* 1px */
```

**Usage:**
```tsx
// ✅ CORRECT
className="rounded-[var(--radius-lg)]"
className="border-[var(--border-width-thin)]"

// ❌ WRONG
className="rounded-lg"
className="border"
```

### Motion Tokens

```css
/* Durations */
--duration-instant  /* 80ms */
--duration-fast     /* 120ms */
--duration-normal   /* 240ms */
--duration-slow     /* 500ms */

/* Spin/Rotate Animations */
--duration-spin-fast  /* 2s */
--duration-spin-mid   /* 3s */
--duration-spin-slow  /* 4s */

/* Easing */
--ease-standard    /* Standard easing */
--ease-emphasized  /* Emphasized easing */
```

**Usage:**
```tsx
// ✅ CORRECT
style={{ transitionDuration: 'var(--duration-fast)' }}
className="transition-all duration-[var(--duration-normal)] ease-[var(--ease-standard)]"

// ❌ WRONG
style={{ transitionDuration: '150ms' }}
className="transition-all duration-300"
```

### Shadow Tokens

```css
--shadow-sm   /* Small shadow */
--shadow-md   /* Medium shadow */
--shadow-lg   /* Large shadow */
--shadow-xl   /* Extra large shadow */
--shadow-2xl  /* 2X large shadow */
```

**Usage:**
```tsx
// ✅ CORRECT
className="shadow-[var(--shadow-md)]"

// ❌ WRONG
className="shadow-md"
```

---

## COMPONENT STANDARDS

### File Structure

```
/components/
├── ui/              # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── features/        # Feature-specific components
│   ├── restaurant/
│   └── blog/
└── shared/          # Shared layout components
    ├── header/
    └── footer/
```

### Naming Conventions

- **PascalCase** for components: `Button.tsx`, `RestaurantCard.tsx`
- **camelCase** for utilities: `formatDate.ts`, `cn.ts`
- **kebab-case** for folders: `/restaurant-card/`, `/search-bar/`

### Exports

```tsx
// ✅ CORRECT - Named exports
export function Button() { }
export interface ButtonProps { }
export { Button }

// ❌ WRONG - Default exports
export default function Button() { }
```

---

## LAYOUT PATTERNS

### Page Container

```tsx
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
      {children}
    </div>
  )
}
```

### Section Container

```tsx
export function SectionContainer({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-[var(--spacing-lg)]">
      <h2 className="text-[var(--heading-section)] mb-[var(--spacing-md)]">
        {title}
      </h2>
      {children}
    </section>
  )
}
```

### Grid Patterns

```tsx
// 2 Column Grid (Mobile)
<div className="grid grid-cols-2 gap-[var(--spacing-md)]">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## COLOR USAGE

### Background Colors

```tsx
// Primary background
<div className="bg-[var(--bg)]">

// Elevated surface (card, modal)
<div className="bg-[var(--card-bg)]">

// Glass effect
<div className="bg-[var(--glass-bg)] backdrop-blur-[var(--blur-2xl)]">
```

### Text Colors

```tsx
// Primary text
<p className="text-[var(--fg)]">

// Secondary text
<p className="text-[var(--fg-70)]">

// Muted text
<p className="text-[var(--fg-50)]">
```

### Semantic Colors

```tsx
// Primary/Brand
<button className="bg-[var(--color-primary)] text-white">

// Success
<span className="text-[var(--color-success)]">Success</span>

// Warning
<span className="text-[var(--color-warning)]">Warning</span>

// Error
<span className="text-[var(--color-error)]">Error</span>
```

---

## TYPOGRAPHY

### Heading Hierarchy

```tsx
// Page Title (Hero)
<h1 className="text-[var(--heading-hero)] font-bold">
  {title}
</h1>

// Section Title
<h2 className="text-[var(--heading-section)] font-bold">
  {sectionTitle}
</h2>

// Card Title
<h3 className="text-[var(--heading-card)] font-semibold">
  {cardTitle}
</h3>
```

### Body Text

```tsx
// Large body text
<p className="text-[var(--font-size-lg)] text-[var(--fg)]">

// Standard body text
<p className="text-[var(--font-size-base)] text-[var(--fg-90)]">

// Small text (captions, labels)
<p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
```

---

## SPACING & LAYOUT

### Responsive Breakpoints

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
```

- **Mobile:** < 768px (default styles)
- **Tablet:** >= 768px (`md:` prefix)
- **Desktop:** >= 1024px (`lg:` prefix)

### Padding & Margins

```tsx
// Page padding
<div className="px-[var(--page-padding-x)]">

// Section padding
<section className="py-[var(--spacing-lg)]">

// Component padding
<div className="p-[var(--spacing-md)]">
```

---

## MOTION & ANIMATION

### Transitions

```tsx
// Hover transition
<button className="transition-all duration-[var(--duration-fast)] hover:scale-[var(--hover-scale-factor)]">

// Fade in
<div className="transition-opacity duration-[var(--duration-normal)]">
```

### Animations

```tsx
// Spin animation
<div className="animate-spin duration-[var(--duration-spin-mid)]">

// Pulse animation
<div className="animate-pulse">
```

---

## ACCESSIBILITY

### ARIA Labels

```tsx
// Icon buttons
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Form inputs
<input aria-label="Email address" />
```

### Keyboard Navigation

```tsx
// Handle Enter and Escape
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [onClose])
```

### Focus Management

```tsx
// Focus trap in modals
useEffect(() => {
  const focusableElements = modalRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements?.[0] as HTMLElement
  firstElement?.focus()
}, [])
```

---

## QUICK REFERENCE

### DO's ✅

- Use `var(--token-name)` for ALL values
- Use named exports
- Use proper TypeScript interfaces
- Include JSDoc comments
- Make components reusable
- Handle loading and error states
- Optimize for performance (memo, useCallback, useMemo)
- Ensure accessibility (ARIA, keyboard nav)
- Test responsive design

### DON'Ts ❌

- Don't use hardcoded values (colors, spacing, fonts)
- Don't use inline styles
- Don't use `any`, `never`, or `undefined` types
- Don't use default exports
- Don't skip error handling
- Don't forget accessibility
- Don't ignore performance
- Don't make components too specific (keep them reusable)

---

**Remember:** The design system is your friend. Use it consistently. No exceptions.

---

*Last Updated: 2026-01-03*
