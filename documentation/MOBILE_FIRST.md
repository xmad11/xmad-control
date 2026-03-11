# MOBILE FIRST — Design Principles

## Core Principle

**Mobile-first design** means starting with the mobile experience and progressively enhancing for larger screens. This ensures:

1. **Performance** - Mobile users get the fastest experience
2. **Accessibility** - Touch targets are properly sized from the start
3. **Simplicity** - Content prioritized over complex layouts

---

## Breakpoint Strategy

### Standard Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| Mobile (default) | 0px | Phones |
| Tablet | 768px (`md:`) | Tablets, small laptops |
| Desktop | 1024px (`lg:`) | Desktops, large laptops |

### Mobile-First Rule

**Base styles = mobile**. Enhancements only via breakpoints.

```tsx
// ✅ CORRECT - Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ❌ FORBIDDEN - Desktop-first
<div className="p-8 md:p-6 md:p-4">
```

---

## Component Guidelines

### Responsive Patterns

#### Spacing
```tsx
className="p-[var(--spacing-md)] md:p-[var(--spacing-lg)]"
```

#### Layout
```tsx
// Stack on mobile, row on desktop
className="flex flex-col md:flex-row gap-4"

// 1 column mobile, 2 tablet, 4 desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

#### Typography
```tsx
className="text-[var(--font-size-xl)] md:text-[var(--font-size-2xl)]"
```

#### Visibility
```tsx
className="hidden md:block"     // Hide mobile, show tablet+
className="block md:hidden"     // Show mobile, hide tablet+
```

---

## Touch Targets

### Minimum Sizes

- **Buttons**: `min-height: 44px` (Apple HIG)
- **Links**: Full-height container
- **Icons**: Use padding, don't rely on hit area alone

### Implementation

```tsx
// ✅ Correct - Touch-friendly
<button className="px-4 py-3 min-h-[44px]">Click</button>

// ❌ Wrong - Too small for touch
<button className="px-2 py-1">Click</button>
```

---

## Content Priority

### Mobile Content Strategy

1. **Essential first** - Primary action above fold
2. **Progressive disclosure** - Hide secondary content
3. **Thumb zone** - Key actions at bottom (easy reach)

### Component Priority

| Priority | Mobile | Tablet+ |
|----------|--------|---------|
| Header | Always visible | Always visible |
| Hero | Full width | Constrained |
| Navigation | Bottom sheet/modal | Inline |
| Tables | Stacked cards | Standard table |

---

## Forbidden Patterns

### ❌ Responsive Logic in JSX

```jsx
// BAD - Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}

// BAD - useMediaQuery for UI branching
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

### ❌ Desktop-First Overrides

```tsx
// BAD - Starts with desktop, overrides for mobile
className="w-full md:w-1/2 lg:w-1/3"

// GOOD - Starts with mobile, enhances for desktop
className="w-full md:w-auto"
```

### ❌ Hardcoded Breakpoint Values

```tsx
// BAD - Magic numbers
className="w-[375px] md:w-[768px]"

// GOOD - Use tokens
className="w-[var(--mobile-width)] md:w-[var(--tablet-width)]"
```

---

## Performance Rules

### CSS Optimizations

1. **Group responsive changes** - Apply all breakpoints at once
2. **Use CSS transitions** - Avoid JS animations
3. **Minimize reflows** - Batch DOM reads/writes

### Image Loading

```tsx
// Lazy load below-fold images
<img loading="lazy" src="..." alt="..." />

// Responsive images
<img
  srcSet="small.jpg 480w, large.jpg 800w"
  sizes="(max-width: 768px) 480px, 800px"
  alt="..."
/>
```

---

## Testing Checklist

### Mobile (< 768px)
- [ ] All content fits without horizontal scroll
- [ ] Touch targets are 44px minimum
- [ ] Text is readable without zoom
- [ ] Navigation is accessible

### Tablet (768px - 1023px)
- [ ] Layout adapts appropriately
- [ ] No horizontal scroll
- [ ] Touch targets still work

### Desktop (1024px+)
- [ ] Layout uses available space efficiently
- [ ] Hover states work
- [ ] Keyboard navigation is smooth

---

## Token Usage

### Responsive Tokens

```css
/* Use these in responsive classes */
--mobile-width: 100%;
--tablet-width: 50rem;
--desktop-width: 64rem;

/* Mobile padding, increases on desktop */
--content-padding: var(--spacing-md);
```

### Implementation

```tsx
<style>{`
  @media (min-width: 768px) {
    :root {
      --content-padding: var(--spacing-xl);
    }
  }
`}</style>
```

---

## References

- `styles/tokens.css` - All design tokens
- `documentation/ui/RESPONSIVE_SCREEN_RULES.md` - Detailed responsive rules
- `documentation/ui/UI_RULES.md` - Component usage rules
