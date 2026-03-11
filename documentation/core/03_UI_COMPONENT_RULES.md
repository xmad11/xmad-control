# UI COMPONENT RULES — Single Source of Truth

**Component usage, variants, and patterns**

**Last Updated:** 2026-01-28

---

## 1. CARD SYSTEM (SSOT)

### Single Source of Truth

**Location:** `components/card/`

**Components:**
- `BaseCard.tsx` — Core card with 4 variants
- `RestaurantCard.tsx` — Restaurant-specific
- `BlogCard.tsx` — Blog-specific

**MANDATORY:** No custom card implementations allowed.

---

### Card Variants (NON-NEGOTIABLE)

| Variant | Height | Use Case | Layout |
|---------|--------|----------|--------|
| **mini** | 140px | Explore tab, high-density grids | Image + title only, no badges |
| **standard** | 220px | Restaurant/blog listings | Image top, name left, rating right |
| **rich** | 300px | Featured cards | Rating/favorite ON image, 2-line title |
| **full** | 420px | Detail views | Fixed height, scroll inside card |

**Card height NEVER expands.** Content adapts via `line-clamp`.

---

### Card Types

#### Restaurant Cards

**Accent:** `--card-accent-restaurant` (warm orange)

**Badges:** Food-oriented (cuisine type, price range)

**Rating:** Always visible, emphasized with star icon

**Features by variant:**
- **Mini:** No badges, no meta, 1-line title
- **Standard:** Title left, rating right with truncation
- **Rich/Full:** Rating badge ON image (top-left), favorite button ON image (top-right)

#### Blog Cards

**Accent:** `--card-accent-blog` (cool blue/purple)

**Badges:** Category, read time

**Author:** Emphasized in rich/full variants

**Features by variant:**
- **Mini:** Image + title only
- **Standard:** Title, category badge, read time
- **Rich/Full:** Instagram-style author header with avatar

---

### Usage Examples

```tsx
import { RestaurantCard, BlogCard } from "@/components/card";

// Mini variant (Explore tab)
<RestaurantCard {...item} variant="mini" />
<BlogCard {...item} variant="mini" />

// Standard variant (Listings)
<RestaurantCard
  {...restaurant}
  variant="standard"
  isFavorite={isFav}
  onFavoriteToggle={toggleFavorite}
/>

// Rich variant (Featured)
<RestaurantCard
  {...restaurant}
  variant="rich"
  isFavorite={isFav}
  onFavoriteToggle={toggleFavorite}
  onShare={shareRestaurant}
/>
```

---

### Card Tokens

```css
--card-bg: var(--bg);
--card-accent-restaurant: oklch(0.65 0.16 45.0);
--card-accent-blog: oklch(0.58 0.14 250.0);
--card-height-mini: 140px;
--card-height-standard: 220px;
--card-height-rich: 300px;
--card-height-full: 420px;
```

---

### Forbidden Patterns

❌ **NEVER:**
- Create custom card components
- Use inline heights on cards
- Let card height expand based on content
- Hardcode spacing/values — use tokens only
- Duplicate card logic across components

✅ **ALWAYS:**
- Use BaseCard, RestaurantCard, or BlogCard
- Use variant prop for layout changes
- Truncate text with `line-clamp`
- Keep card content inside fixed height

---

## 2. CAROUSEL SYSTEM (SSOT)

### Single Source of Truth

**Location:** `components/marquee/Marquee.tsx`

**MANDATORY:** No duplicate carousel implementations.

---

### Marquee Usage by Feature Area

#### Home (`/features/home`)

**Allowed:**
- Marquee (continuous scrolling)
- Morphing text
- Entrance transitions
- Hover effects

**Rationale:** Marketing-focused, animations attract attention

```tsx
// ✅ Correct
<Marquee variant="vertical-3d-dual">
  <MorphingText texts={words} />
</Marquee>
```

#### Blog (`/features/blog`)

**Allowed:**
- Hover feedback (opacity, translate)
- Fade-in transitions (max 240ms)

**Forbidden:**
- ❌ Marquee
- ❌ Morphing text
- ❌ Continuous motion
- ❌ Auto-playing animations

**Rationale:** Content readability and SEO priority

```tsx
// ✅ Correct - minimal hover
<div className="hover:opacity-80 transition-opacity duration-[var(--duration-fast)]">

// ❌ Wrong - no marquee in blog
<Marquee>{blogPosts}</Marquee>
```

#### Dashboard

**Allowed:**
- Micro hover states only (opacity, brightness)
- Loading spinners (async operations)

**Forbidden:**
- ❌ Marquee
- ❌ Morphing text
- ❌ Entrance animations
- ❌ Scale transforms on hover

**Rationale:** Data density requires stable UI, cognitive load minimization

---

### Marquee Tokens

```css
--duration-fast: 120ms;
--duration-normal: 240ms;
--duration-slow: 500ms;
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.23, 1, 0.32, 1);
```

---

## 3. PANEL SYSTEM (MANDATORY RULES)

### Components

**SideMenu** — Slide-out navigation from left
**ThemeModal** — Theme mode and accent color selector
**SearchModal** — Search interface (if exists)

### MANDATORY: Panel Mutual Exclusivity

**Only ONE panel may exist in the DOM at a time.**

**Correct:**
```tsx
{activePanel === "menu" && <SideMenu />}
{activePanel === "theme" && <ThemeModal />}
```

**Wrong:**
```tsx
<SideMenu className={showMenu ? "block" : "hidden"} />
<ThemeModal className={showTheme ? "block" : "hidden"} />
```

Inactive panels MUST be unmounted (not hidden with CSS).

---

### Panel Animation (FIXED)

**Direction:** Right-side slide-in ONLY

**No other directions allowed.**

```tsx
// ✅ Correct - Right-side slide-in
<div className="animate-[slide-in-right_0.3s_cubic-bezier(0.23,1,0.32,1)]">

// ❌ Wrong - Left, top, or bottom
<div className="animate-[slide-in-left_...]">
```

---

### Panel Tokens

```css
--panel-width: 13.2rem;
--panel-radius: var(--radius-2xl);
--panel-offset-top: var(--spacing-md);
--z-side-menu: 110;
--z-side-menu-backdrop: 60;
--z-theme-modal: 120;
--z-theme-modal-backdrop: 80;
```

---

## 4. GLASS COMPONENTS

### Single Source of Truth

**Location:** `styles/globals.css`

**Classes:**
- `.glass` — Base glass effect
- `.glass-card` — Glass with hover animation

### Components Using Glass

**Header**, **SideMenu**, **ThemeModal**

### Usage

```tsx
// Apply glass class
<div className="glass-card p-[var(--spacing-xl)]">
```

### Glass Tokens (Theme-Aware)

```css
/* Light Mode */
:root {
  --glass-bg: rgba(255, 255, 255, 0.35);
  --glass-border: rgba(255, 255, 255, 0.5);
}

/* Dark Mode */
[data-theme="dark"] {
  --glass-bg: rgba(30, 35, 45, 0.5);
  --glass-border: rgba(255, 255, 255, 0.08);
}

/* Warm Mode */
[data-theme="warm"] {
  --glass-bg: rgba(245, 235, 220, 0.4);
  --glass-border: rgba(200, 180, 150, 0.3);
}
```

---

## 5. HEADER COMPONENT

### File

`components/Header.tsx`

### Purpose

Site navigation header with logo, menu toggle, and theme selector

### Props

```tsx
interface HeaderProps {
  onMenuClick: () => void;
  onThemeClick: () => void;
  onHeaderClick?: () => void;
}
```

### Tokens Used

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

### Responsive Behavior

- **Mobile:** Smaller logo, reduced padding
- **Desktop:** Full size logo, expanded padding

### Usage

```tsx
<Header
  onMenuClick={() => setActivePanel("menu")}
  onThemeClick={() => setActivePanel("theme")}
  onHeaderClick={closeAll}
/>
```

---

## 6. HERO SECTION

### Files

- `features/home/hero/Hero.tsx`
- `features/home/hero/HeroTitle.tsx`
- `features/home/hero/HeroSubtitle.tsx`
- `components/typography/MorphingText.tsx` (LOCKED)

### Hero Rules

**Mobile Vertical Position:**
- Controlled by mobile spacer div
- Class: `block lg:hidden h-[var(--spacing-xl)]`
- ❌ DO NOT adjust padding-top to move hero
- ❌ DO NOT add flex centering on section for mobile

**Desktop Vertical Centering:**
- Controlled by inner grid
- Classes: `lg:flex lg:items-center lg:min-h-[calc(100vh-var(--header-total-height))]`

### MorphingText (LOCKED COMPONENT)

**File:** `components/typography/MorphingText.tsx`

**Rules:**
- Animation logic MUST NOT be modified
- Timing MUST NOT be changed
- Blur/filter logic MUST NOT be touched

**Allowed Customization:**
- Color ONLY via CSS variable: `--accent`

---

### Hero Tokens

```css
--font-size-5xl
--font-size-lg
--spacing-2xl
--section-gap-md
--radius-full
--hero-bg-height
--hero-subtitle-gap: 0.5rem
--hero-marquee-gap: 2rem
```

---

## 7. BUTTON PATTERNS

### Primary Button

```tsx
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
```

### Secondary Button (Glass)

```tsx
<button className="
  flex items-center gap-[var(--spacing-sm)]
  glass px-[var(--spacing-2xl)] py-[var(--spacing-md)]
  rounded-[var(--radius-full)]
  font-bold hover:bg-[oklch(var(--fg)/0.05)]
  active:scale-95
  transition-all
  w-full sm:w-auto
">
```

### Touch Targets

**MANDATORY:** Minimum 44px (Apple HIG)

```tsx
<button className="px-4 py-3 min-h-[44px]">
```

---

## 8. COMPONENT CREATION CHECKLIST

When creating new components:

- [ ] Import required context: `useTheme`, `ACCENT_COLORS`
- [ ] Use token-based classes: `p-[var(--spacing-md)]`
- [ ] Support all three themes (light, dark, warm)
- [ ] Responsive with hybrid approach
- [ ] Dynamic color pattern for accents
- [ ] No hardcoded values
- [ ] No inline styles
- [ ] Proper TypeScript interfaces

---

## 9. UI AUDIT COMPLIANCE

**Layer 07.5: UI Normalization** checks for:
- Consistent UI patterns
- No inline styles
- Proper token usage

**Layer 07: UI Responsive** checks for:
- Mobile-first breakpoints
- Touch target minimums
- No desktop-first overrides

**Run:**
```bash
bun run audit --layer=07
bun run audit --layer=07.5
```

---

**This document is the SSOT for component usage.** Use only these components. No duplicates allowed.

**For detailed component inventory, see:** `documentation/reference/COMPONENT_INVENTORY.md`
**For card system details, see:** `documentation/reference/ui/CARDS.md`
