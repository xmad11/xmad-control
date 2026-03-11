# Card System Documentation

## Overview

The card system is built on a single `BaseCard` component with 4 locked variants. All cards must use this system - no custom card implementations allowed.

## Architecture

```
BaseCard (1 component)
├── 4 variants: mini | standard | rich | full
├── 2 types: restaurant | blog
└── Fixed heights (never expand)

RestaurantCard (extends BaseCard)
├── Warm accent: oklch(0.65 0.16 45.0)
├── Food-oriented badges
└── Emphasized rating

BlogCard (extends BaseCard)
├── Cool accent: oklch(0.58 0.14 250.0)
├── Instagram-style header (rich/full)
└── Author emphasis
```

## Variant Specifications

| Variant | Height | Use Case | Layout |
|---------|--------|----------|--------|
| **mini** | 140px | Explore tab, high-density grids | Image + title only, no badges, no meta |
| **standard** | 220px | Restaurant/blog listing cards | Image top, name left, rating right with truncation |
| **rich** | 300px | Featured cards | Rating/favorite ON image, 2-line title, small inline badges |
| **full** | 420px | Detail views | Fixed height with scroll inside card, never expands container |

## Height Rules (NON-NEGOTIABLE)

- Card height NEVER expands
- Content must adapt inside fixed height
- Use `line-clamp` for text truncation
- Full variant: scroll inside card, not container

```css
/* Tokens - reference only, don't hardcode */
--card-height-mini: 140px;
--card-height-standard: 220px;
--card-height-rich: 300px;
--card-height-full: 420px;
```

## Type-Specific Styling

### Restaurant Cards
- **Accent**: `--card-accent-restaurant` (warm orange)
- **Badges**: Food-oriented (cuisine type, price range)
- **Rating**: Always visible, emphasized with star icon
- **Mini**: No badges, no meta, 1-line title
- **Standard**: Title left, rating right with truncation
- **Rich/Full**: Rating badge ON image (top-left), favorite button ON image (top-right)

### Blog Cards
- **Accent**: `--card-accent-blog` (cool blue/purple)
- **Badges**: Category, read time
- **Author**: Emphasized in rich/full variants
- **Mini**: Image + title only
- **Standard**: Title, category badge, read time
- **Rich/Full**: Instagram-style author header with avatar

## Usage Examples

### Mini Variant (Explore Tab)
```tsx
import { RestaurantCard, BlogCard } from "@/components/card"

// Restaurant
<RestaurantCard {...item} variant="mini" />

// Blog
<BlogCard {...item} variant="mini" />
```

### Standard Variant (Listings)
```tsx
// Restaurant with favorite
<RestaurantCard
  {...restaurant}
  variant="standard"
  isFavorite={isFav}
  onFavoriteToggle={toggleFavorite}
/>

// Blog
<BlogCard {...blog} variant="standard" />
```

### Rich Variant (Featured)
```tsx
// Restaurant with overlay
<RestaurantCard
  {...restaurant}
  variant="rich"
  isFavorite={isFav}
  onFavoriteToggle={toggleFavorite}
  onShare={shareRestaurant}
/>

// Blog with author header
<BlogCard {...blog} variant="rich" />
```

## Forbidden Patterns

❌ **DON'T** create custom card components
❌ **DON'T** use inline heights on cards
❌ **DON'T** let card height expand based on content
❌ **DON'T** hardcode spacing/values - use tokens only
❌ **DON'T** duplicate card logic across components

✅ **DO** use BaseCard, RestaurantCard, or BlogCard
✅ **DO** use variant prop for layout changes
✅ **DO** truncate text with `line-clamp`
✅ **DO** use design tokens for all styling
✅ **DO** keep card content inside fixed height

## Component API

### BaseCard
```tsx
interface BaseCardProps {
  variant: "mini" | "standard" | "rich" | "full"
  type: "restaurant" | "blog"
  children: React.ReactNode
  className?: string
}
```

### RestaurantCard
```tsx
interface RestaurantCardProps {
  id: string
  slug: string
  title: string
  images: string[]
  rating: number
  isFavorite?: boolean
  priceMin?: number
  priceMax?: number
  location?: string
  badges?: string[]
  description?: string
  href?: string
  variant?: "mini" | "standard" | "rich" | "full"
  onFavoriteToggle?: (id: string) => void
  onShare?: (id: string) => void
}
```

### BlogCard
```tsx
interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  coverImage: string
  author: { name: string; avatar?: string }
  publishedAt: string
  category?: string
  readTime?: number
  href?: string
  variant?: "mini" | "standard" | "rich" | "full"
}
```

## Responsive Widths

Cards are used in responsive grids with these widths:

- **Mobile**: `calc(50% - var(--spacing-sm))` - 2 cards per row with peek
- **Tablet**: `calc(33.333% - var(--spacing-md))` - 3 cards per row
- **Desktop**: `calc(25% - var(--spacing-lg))` - 4 cards per row

```tsx
<div className="flex-shrink-0 snap-start
  w-[calc(50%-var(--spacing-sm))]
  md:w-[calc(33.333%-var(--spacing-md))]
  lg:w-[calc(25%-var(--spacing-lg))]"
>
  <RestaurantCard {...item} variant="mini" />
</div>
```

## Token Reference

```css
/* Card System Tokens */
--card-bg: var(--bg);
--card-accent-restaurant: oklch(0.65 0.16 45.0);
--card-accent-blog: oklch(0.58 0.14 250.0);
--card-height-mini: 140px;
--card-height-standard: 220px;
--card-height-rich: 300px;
--card-height-full: 420px;
```

## Migration Notes

When migrating existing cards to the new system:

1. **Identify variant** based on content density
2. **Choose type** (restaurant vs blog)
3. **Remove inline styles** - use variant prop instead
4. **Truncate content** with `line-clamp` if needed
5. **Test at all breakpoints** - cards maintain fixed height

## Files

- `components/card/BaseCard.tsx` - Core card component
- `components/card/RestaurantCard.tsx` - Restaurant-specific card
- `components/card/BlogCard.tsx` - Blog-specific card
- `components/card/index.ts` - Public exports
- `styles/tokens.css` - Card system tokens
