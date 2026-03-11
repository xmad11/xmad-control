# Animation Rules (Strict)

## Overview
Animations are scoped by application area to maintain UX consistency and performance.

---

## Area-Specific Rules

### Home (`/features/home`)

**Allowed:**
- Marquee (continuous scrolling)
- Morphing text
- Entrance transitions
- Typing animation
- Hover effects (opacity, translate, scale)

**Forbidden:**
- None (home page allows marketing animations)

**Rationale:** Home page is marketing-focused; animations attract attention and communicate energy.

**Token Reference:**
- `--duration-fast: 120ms`
- `--duration-normal: 240ms`
- `--duration-slow: 500ms`
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-out-quart: cubic-bezier(0.23, 1, 0.32, 1)`

**Implementation Example:**
```tsx
// ✅ Correct - Home allows marquee and morphing
<Marquee variant="vertical-3d-dual">
  <MorphingText texts={words} />
</Marquee>
```

---

### Blog (`/features/blog`)

**Allowed:**
- Hover feedback (opacity, translate)
- Fade-in transitions (max 240ms duration)

**Forbidden:**
- ❌ Marquee
- ❌ Morphing text
- ❌ Continuous motion
- ❌ Auto-playing animations
- ❌ Entrance animations > 240ms

**Rationale:** Content readability and SEO priority. Animations must not distract from reading.

**Max Duration:** `var(--duration-normal)` (240ms)

**Implementation Example:**
```tsx
// ✅ Correct - Blog has minimal hover effects only
<div className="hover:opacity-80 transition-opacity duration-[var(--duration-fast)]">

// ❌ Wrong - No marquee in blog
<Marquee>{blogPosts}</Marquee>
```

---

### Dashboard (`/features/dashboard`)

**Allowed:**
- Micro hover states only (opacity, brightness)
- Loading spinners (for async operations)

**Forbidden:**
- ❌ Marquee
- ❌ Morphing text
- ❌ Entrance animations
- ❌ Continuous motion
- ❌ Decorative animations
- ❌ Scale transforms on hover

**Rationale:**
- Data density requires stable UI
- Cognitive load minimization
- Professional UX for business users
- Performance predictability

**Implementation Example:**
```tsx
// ✅ Correct - Dashboard uses minimal hover
<div className="hover:bg-[var(--bg-muted)] transition-colors duration-[var(--duration-fast)]">

// ❌ Wrong - No decorative animations in dashboard
<div className="animate-bounce">
<div className="group-hover:scale-105">
```

---

### Modals / Panels

**Allowed:**
- Scale-in (for dialogs)
- Right-side slide-in (for side menu, theme modal)

**Forbidden:**
- ❌ Any other direction
- ❌ Left-side, top, or bottom slide-in
- ❌ Multiple simultaneous panels
- ❌ Panel overlap

**Rule:** All panels MUST be mutually exclusive. Only ONE panel may be in the DOM at a time.

**Source:** `documentation/ui/UI_INVARIANTS.md`

---

## Duration Guidelines

| Context | Max Duration | Token |
|---------|--------------|-------|
| Micro interactions (hover) | 120ms | `--duration-fast` |
| Standard transitions | 240ms | `--duration-normal` |
| Slow/Entrance animations | 500ms | `--duration-slow` |

## Easing Functions

| Use Case | Token | Value |
|----------|-------|-------|
| Smooth exit | `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Natural motion | `--ease-out-quart` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Bidirectional | `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` |

---

## Implementation Checklist

For each feature, verify:
- [ ] Home uses marquee/morphing (appropriate for marketing)
- [ ] Blog has NO continuous animation
- [ ] Dashboard has NO decorative animation
- [ ] All durations use `--duration-*` tokens
- [ ] All easing uses `--ease-*` tokens
- [ ] No hardcoded animation values
- [ ] Panels are mutually exclusive

---

## Sources

- [Nielsen Norman Group: Animation & Usability](https://www.nngroup.com/articles/animation-usability/)
- [Material Design Motion Guidelines](https://m3.material.io/styles/motion/overview)
- [React Suspense Best Practices](https://react.dev/reference/react/Suspense)
- `documentation/ui/UI_INVARIANTS.md`
- `documentation/DESIGN_SYSTEM_CANONICAL.md` (Animation System section)
