# ARCHITECTURE — Boundaries & Rules

**Single Source of Truth for Project Structure**

**Last Updated:** 2026-01-28

---

## 1. FOLDER RESPONSIBILITIES (MANDATORY)

### `app/` — Next.js App Router

**Role:** Routing, Layouts, Metadata

**Rules:**
- Components here should be high-level orchestrators
- Root layout and globals are frozen (Phase 2)
- Follow Next.js 16 App Router conventions

**Forbidden:**
- Direct database access
- Business logic that belongs in `lib/`

---

### `components/` — UI Elements

**Role:** Reusable React components

**Rules:**
- MUST use Design Tokens
- MUST be Atomic/Molecular
- No direct DB access
- No business logic that belongs in `lib/`

**Forbidden:**
- Hardcoded values (colors, spacing, sizes)
- Duplicate component implementations

---

### `lib/` — Core Logic

**Role:** Utilities, Hooks, Data fetching logic

**Rules:**
- Framework agnostic where possible
- Pure functions preferred

**Sub-folder:** `lib/supabase/` — **LOCKED** (Database contract is UNTOUCHABLE)

---

### `types/` — Type Definitions

**Role:** Centralized TypeScript interfaces and types

**Rules:**
- No logic
- Only declarations

**File:** `types/database.ts` — **LOCKED**

---

### `styles/` — Design Tokens

**Role:** Tailwind 4 configuration and CSS variables

**Rules:**
- This is the SSOT for all visual properties
- All tokens defined in `tokens.css`
- Theme wiring in `globals.css`

**Files:**
- `styles/tokens.css` — All design tokens
- `styles/globals.css` — Theme, glass classes, base styles

---

### `context/` — React Context

**Role:** State management providers

**Files:**
- `context/ThemeContext.tsx` — Theme modes + ACCENT_COLORS constant

**Rules:**
- State management only
- No UI components

---

### `scripts/` — Enforcement & Tooling

**Role:** CI/CD, Phase Gate verification, maintenance scripts

**Rules:**
- MUST NOT be imported by app components

---

## 2. FORBIDDEN CHANGES (MANDATORY)

### Core Prohibitions

❌ **STRICTLY FORBIDDEN:**

1. **Database Integration:** No new `.sql`, `prisma`, or Supabase-specific DB files without authorization
2. **Git Bypass:** No modification of `.git/`, `.gitignore`, or git hooks unless by owner
3. **Hardcoded UI:** No HEX/RGB values in `.tsx` or `.css` (except in `tokens.css`)
4. **Duplicate Configs:** No adding `prettier.config.js` or `.eslintrc.json` (use Biome exclusively)
5. **Layer 0 Violation:** No writing code that contradicts rules in `documentation/core/`
6. **Direct Style Props:** No large `style={{ ... }}` objects (use Tailwind classes)
7. **Legacy CSS:** No `.scss` or `.less` (Vanilla CSS + Tailwind 4 only)

---

### Phase 2 Lock Constraints

**LOCKED (No changes without explicit approval):**

- `/lib/supabase/` — Database layer
- `/types/database.ts` — Database types

**OPEN (Active development):**
- `/components/` — UI components
- `/app/` — App Router
- `/styles/` — Design tokens

---

## 3. SSOT COMPONENT RULES (MANDATORY)

### Card System

**Single Source of Truth:** `components/card/`

**Components:**
- `BaseCard.tsx` — Core card (4 variants: mini, standard, rich, full)
- `RestaurantCard.tsx` — Restaurant-specific
- `BlogCard.tsx` — Blog-specific

**Rules:**
- No custom card implementations allowed
- Use variant prop for layout changes
- Card height NEVER expands (content adapts via line-clamp)

**Forbidden:**
```tsx
// ❌ Custom card
<div className="my-custom-card">

// ✅ Use BaseCard
<BaseCard variant="standard" type="restaurant">
```

---

### Carousel System

**Single Source of Truth:** `components/marquee/Marquee.tsx`

**Rules:**
- Marquee only for home page (marketing animations)
- Blog: NO marquee, NO continuous motion
- Dashboard: NO decorative animations

**Forbidden:**
- Duplicate carousel implementations
- Marquee in blog/dashboard features

---

### Panel System

**Components:** SideMenu, ThemeModal, SearchModal (any panel)

**MANDATORY Rule:** Only ONE panel may be mounted at a time

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

**Animation:** Right-side slide-in ONLY (no other directions)

---

### Glass Components

**Single Source of Truth:** `styles/globals.css` — `.glass`, `.glass-card`

**Components using glass:** Header, SideMenu, ThemeModal

**Rules:**
- Use `.glass-card` class for glass effect
- Theme-aware colors via CSS variables

**Tokens:**
```css
--glass-bg, --glass-border, --glass-shadow
--blur-sm, --blur-md, --blur-lg
```

---

## 4. ROUTING RULES (MANDATORY)

### App Router Structure

```
app/
├── layout.tsx         # Root layout (frozen)
├── page.tsx           # Home page
├── globals.css        # Global styles (frozen)
├── (routes)/          # Route groups
│   ├── restaurants/
│   ├── cuisines/
│   └── blog/
```

**Rules:**
- Follow Next.js 16 App Router conventions
- Use Server Components by default
- Client Components only when needed (interactivity)

---

## 5. IMPORT RULES (MANDATORY)

### Allowed Imports

```tsx
// ✅ From components
import { Header } from "@/components/Header";
import { RestaurantCard } from "@/components/card";

// ✅ From context
import { useTheme, ACCENT_COLORS } from "@/context/ThemeContext";

// ✅ From lib (business logic)
import { formatPrice } from "@/lib/utils";
```

### Forbidden Imports

```tsx
// ❌ Scripts in app components
import { auditRunner } from "@/scripts/audit-runner";

// ❌ Direct database access in components
import { supabase } from "@/lib/supabase/client";
```

---

## 6. FILE NAMING CONVENTIONS

### Components

```tsx
// PascalCase for component files
Header.tsx
SideMenu.tsx
ThemeModal.tsx
RestaurantCard.tsx

// kebab-case for folders
components/card/
components/marquee/
features/home/
```

### Utilities

```tsx
// camelCase for utility files
formatPrice.ts
validateEmail.ts
fetchRestaurants.ts
```

---

## 7. ARCHITECTURAL AUDITS

### Layer 02: Architecture Check

**What it verifies:**
- Files in correct folders
- No violations of folder responsibilities
- No circular dependencies

**Run:**
```bash
bun run audit --layer=02
```

**Failure means:**
- File is in wrong location
- Business logic in UI component
- UI component in lib folder

---

## 8. BOUNDARY VIOLATIONS (HOW TO FIX)

### Business Logic in Component

**Wrong:**
```tsx
// components/RestaurantCard.tsx
const calculatePrice = (base: number, tax: number) => {
  return base * (1 + tax);  // Business logic!
};
```

**Correct:**
```tsx
// lib/pricing.ts
export const calculatePrice = (base: number, tax: number) => {
  return base * (1 + tax);
};

// components/RestaurantCard.tsx
import { calculatePrice } from "@/lib/pricing";
```

---

### Hardcoded Values in Component

**Wrong:**
```tsx
<div className="bg-[#ff0000] p-8">
```

**Correct:**
```tsx
<div className="bg-[rgb(var(--color-error))] p-[var(--spacing-2xl)]">
```

---

## 9. COMPONENT CREATION GUIDELINES

### When Creating New Components

1. **Choose correct location:**
   - Reusable UI → `components/`
   - Feature-specific → `features/`
   - Page-level → `app/`

2. **Use tokens only:**
   ```tsx
   <div className="p-[var(--spacing-md)] text-[rgb(var(--fg))]">
   ```

3. **Support all themes:**
   ```tsx
   import { useTheme } from "@/context/ThemeContext";
   const { mode } = useTheme();  // Test light, dark, warm
   ```

4. **Responsive (mobile-first):**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2">
   ```

5. **Dynamic color pattern:**
   ```tsx
   const accentClasses: Record<AccentColorKey, string> = {
     rust: "bg-accent-rust",
     sage: "bg-accent-sage",
     // ...
   };
   ```

---

## 10. QUICK REFERENCE

| Folder | Purpose | Rules | Locked? |
|--------|---------|-------|---------|
| `app/` | Routing | App Router conventions | Partially |
| `components/` | UI elements | Use tokens, atomic | No |
| `lib/` | Core logic | Framework agnostic | Partially |
| `lib/supabase/` | Database | **UNTOUCHABLE** | **YES** |
| `types/` | Type definitions | Declarations only | Partially |
| `types/database.ts` | DB types | **UNTOUCHABLE** | **YES** |
| `styles/` | Design tokens | SSOT for visuals | No |
| `context/` | State management | Providers only | No |
| `scripts/` | Tooling | Don't import in app | No |
| `documentation/core/` | SSOT rules | Authoritative | N/A |
| `documentation/reference/` | Reference | Read-only | N/A |

---

**This document enforces Layer 02 (Architecture) compliance.**
