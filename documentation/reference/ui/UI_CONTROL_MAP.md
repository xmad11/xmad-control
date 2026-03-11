# Reference Document

> **Reference only — not required for agent execution**
>
> This document is preserved for detailed reference and troubleshooting.
> For core rules, see `documentation/core/`.

---

# UI Control Map — shadi-v2

## Global Rules (DO NOT VIOLATE)

- ❌ Never use negative margins to fix spacing
- ❌ Never hardcode pixel values
- ❌ Never change hero font sizes without explicit approval
- ❌ Never modify morph logic or animation timing
- ✅ Always use tokens from tokens.css
- ✅ Mobile flow ≠ Desktop centering
- ✅ Desktop-only vertical centering must use lg:*

---

## Hero Section

### Files
- `features/home/hero/Hero.tsx`
- `features/home/hero/HeroTitle.tsx`
- `features/home/hero/HeroSubtitle.tsx`

### Mobile Vertical Position
- Controlled by: mobile spacer div
- Location: `Hero.tsx` (first child inside `<section>`)
- Class: `block lg:hidden h-[var(--spacing-xl)]`

❌ DO NOT adjust padding-top to move hero
❌ DO NOT add flex centering on section for mobile

### Desktop Vertical Centering
- Controlled by inner grid
- Classes: `lg:flex lg:items-center lg:min-h-[calc(100vh-var(--header-total-height))]`

### Title Color Rules
- Light mode: Static text → `--fg` (black), Morph text → `--accent`
- Dark / Warm: Static text → muted gray, Morph text → `--accent`

❌ Never set text color directly

---

## Hero Vertical Spacing (Mobile)

### Typing Subtitle
- Controlled by: `--hero-subtitle-gap`
- Location: `HeroSubtitle.tsx`
- Default: 0.5rem

❌ Do not add margins elsewhere

### Marquees
- Controlled by: `--hero-marquee-gap`
- Location: `Hero.tsx`
- Default: 2rem (4× subtitle gap)

### Marquee Width
- Full-bleed using negative margins
- Must ignore page container padding

---

## Morph Text (LOCKED COMPONENT)

### File
- `components/typography/MorphingText.tsx`

### Rules
- Animation logic MUST NOT be modified
- Timing MUST NOT be changed
- Blur / filter logic MUST NOT be touched

### Allowed Customization
- Color ONLY via CSS variable: `--accent`

### Where Color Is Applied
- Wrapper span class
- Uses `text-[var(--accent)]`

---

## Typing Subtitle

### Files
- `features/home/hero/HeroSubtitle.tsx`
- `components/TypingAnimation/index.tsx`

### Fixed Element
- "@the.ss" must NEVER move
- Must be `inline-block` and stable

### Animated Element
- Only typing text animates
- Must wrap naturally without shifting prefix

### Alignment Rule
- Subtitle always center-aligned with title
- No translate / motion on container

---

## Marquees

### Horizontal Marquee (Mobile)
- File: `components/marquee/Marquee.tsx` (`horizontal-dual` mode)
- **Full-bleed Pattern** (PERMANENT):
  - Wrapper uses viewport breakout: `w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`
  - Independent of containers, max-width, or page padding
  - Marquee component MUST NOT add padding/layout logic
  - Root element: `w-full overflow-hidden` only

❌ NEVER use `marquee-full-width` class in Marquee component
❌ NEVER add `px-*`, `container`, or `max-w-*` to horizontal marquee

**Source:** CSS-Tricks – Full-width containers inside constrained parents

### 3D Marquee (Desktop)
- File: `components/marquee/Marquee.tsx` (`vertical-3d-dual` mode)
- **Fade Edges** (PERMANENT):
  - Uses CSS mask utility: `.fade-x`
  - Defined in `styles/globals.css`
  - GPU-safe, no JS fade logic allowed
  - Fade: 8% transparent → 92% black → 100% transparent

❌ NEVER use overlay divs for fade (`.marquee-fade-left/right` in marquee)
❌ NEVER add JS-based fade logic

**Source:** MDN – CSS mask-image

### Mobile Placement
- Lives immediately under Hero subtitle
- Full-bleed using viewport breakout pattern
- Margin controlled by: `--hero-marquee-gap`

### Desktop 3D Properties
- Orientation: `rotateZ(45deg)`
- Depth controlled by tokens: `--marquee-3d-offset-x`, `--marquee-3d-offset-z`
- No hardcoded px transforms

---

## Containers & Layout

### Page Containers
- Width: `max-w-[var(--page-max-width)]`
- Padding: `px-[var(--page-padding-x)]`

### Full-bleed Components
- Use `relative` + `overflow-hidden`
- Use negative margin pattern: `-ml-[50vw] -mr-[50vw] w-screen`
- DO NOT use `w-screen` unless documented

---

## Tokens Reference

### Spacing Tokens Used
- `--spacing-sm` / `--spacing-md` / `--spacing-lg` / `--spacing-xl`
- `--section-gap-sm`
- `--hero-gap-tight`
- `--hero-subtitle-gap` (0.5rem)
- `--hero-marquee-gap` (2rem)

### Color Tokens
- `--accent` (morph text, primary actions)
- `--fg` (foreground text)
- `--bg` (background)

### Layout Tokens
- `--header-total-height`
- `--page-max-width`
- `--page-padding-x`

---

## Change Protocol

For ANY UI change:
1. Identify the controlling file from this document
2. Change ONE variable or class only
3. Verify on: Mobile portrait, Mobile landscape, Desktop
4. Update this document if behavior changes
5. Commit with message: `ui: adjust <component> via <token/class>`

---

## Forbidden Patterns

❌ **NEVER DO THESE**
- Add `items-center` without `lg:` prefix
- Use negative margins (except full-bleed pattern)
- Hardcode px values in components
- Change morph animation timing
- Modify hero title font sizes
- Add `w-screen` without proper context

✅ **ALWAYS DO THESE**
- Use design tokens from `tokens.css`
- Apply centering with `lg:` prefix only
- Document spacing in this control map
- Test on all screen sizes
- Commit changes atomically

---

**Last Updated:** 2026-01-02
**Purpose:** Prevent UI regressions and provide single source of truth for layout control
