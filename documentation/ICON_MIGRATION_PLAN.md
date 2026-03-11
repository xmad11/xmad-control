# 🔍 COMPREHENSIVE AUDIT REPORT & IMPLEMENTATION PLAN
## Icon Migration & Navigation Unification

**Date**: 2026-01-06
**Status**: ✅ APPROVED WITH MANDATORY CORRECTIONS
**Scope**: Phase 1 - Icon System & Navigation Refactoring

---

## 🔒 HARD RULES (NON-NEGOTIABLE)

**These rules MUST be enforced throughout implementation:**

### Icon System
- ❌ NO inline SVGs for navigation (CI must fail)
- ❌ NO icon imports outside `@/components/icons`
- ✅ ONLY lucide-react as icon library
- ✅ ALL icon usage through centralized exports

### Header & Navigation
- ❌ NO Header imports outside layout components
- ❌ NO navigation logic in feature components
- ✅ Header lives ONLY in root layout
- ✅ Back navigation uses `router.back()` ONLY

### Spacing
- ❌ NO spacing utilities (pt-*, mt-*) above page root
- ❌ NO per-page padding compensation for header
- ✅ ALL top spacing uses `var(--page-top-offset)`
- ✅ ContextBar height managed via tokens

### State Management
- ❌ NO panel state (menu/theme) in client components
- ✅ Navigation state in NavigationProvider ONLY
- ✅ Single source of truth for active panel

**Sources:**
- Next.js App Router Architecture
- Design System Governance
- UI Invariants (documentation/ui/UI_INVARIANTS.md)

---

## 📊 EXECUTIVE SUMMARY

### Current State Assessment
| Area | Status | Issues Found | Files Affected |
|------|--------|--------------|----------------|
| **Icon System** | ⚠️ FRAGMENTED | Heroicons (125+ files) + Inline SVGs (11 files) | 136+ |
| **Header Usage** | ❌ VIOLATES | Header rendered in client components | 27+ |
| **Back Buttons** | ❌ INCONSISTENT | 3 different patterns (inline SVG, router.back(), window.location) | 13+ |
| **Providers** | ✅ CLEAN | Single Providers component | 1 |
| **Navigation** | ❌ NO ABSTRACTION | No ContextBar, scattered logic | Multiple |

### Critical Violations of Design System

1. **❌ Header rendered inside client components** (`RestaurantDetailClient`, `RestaurantsPageClient`)
   - Violates: "Header never changes"
   - Causes: Duplicate header logic, panel state duplication

2. **❌ Multiple back button implementations**
   - Inline SVG in `RestaurantDetailClient.tsx` (line 140-142)
   - Inline SVG in `SearchContainer.tsx` (line 137-139)
   - `window.location.href = "/"` in `restaurants/page.tsx` (line 263)
   - `router.back()` in `language/page.tsx` (line 23)

3. **❌ No ContextBar abstraction**
   - Search bars are page-specific, not unified
   - Sticky positioning duplicated across pages

---

## 📁 DETAILED FINDINGS

### 1. ICON SYSTEM AUDIT

#### A. Heroicons Usage (125+ files)

**Pattern found:**
```tsx
import { ArrowLeftIcon, StarIcon, HeartIcon } from "@heroicons/react/24/outline"
```

**Major importers:**
- `components/layout/Header.tsx` - `Bars3BottomRightIcon`
- `components/layout/SideMenu.tsx` - 10 different icons
- `features/restaurant/RestaurantDetailClient.tsx` - 9 icons (ArrowLeft, Clock, CurrencyDollar, Envelope, Heart, MapPin, Phone, Share, Star, Tag)
- `components/search/SearchContainer.tsx` - `MagnifyingGlassIcon`, `XMarkIcon`
- Plus 120+ more files

**Bundle size impact:**
- Heroicons: ~1.1-1.3 KB per icon (tree-shaken)
- Current estimated: 125 icons × 1.2 KB = ~150 KB
- **Lucide: ~0.6-0.8 KB per icon** (35-45% lighter)

#### B. Inline SVG Icons (11 files)

**Critical violations:**

| File | Line | SVG Purpose |
|------|------|-------------|
| `features/restaurant/RestaurantDetailClient.tsx` | 140-142 | **Back button** (main navigation!) |
| `components/search/SearchContainer.tsx` | 137-139 | **Back button** (conditional!) |
| `app/profile/page.tsx` | 38-45, 51-64 | Avatar icons |
| `components/search/SortSystem.tsx` | 46-162 | Sort arrows |
| `components/search/ViewModeSystem.tsx` | 30-103 | Grid/list icons |
| `features/home/sections/HomeTabs.tsx` | 26, 46, 65 | Tab icons |
| `components/search/FilterSystem.tsx` | 269 | Filter checkmarks |

**Example violation:**
```tsx
// RestaurantDetailClient.tsx - Line 140-142
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
</svg>
```

---

### 2. HEADER/NAVIGATION AUDIT

#### A. Header in Client Components ❌ CRITICAL

**Files violating "Header never changes":**

| File | Lines | Issue |
|------|-------|-------|
| `features/restaurant/RestaurantDetailClient.tsx` | 10, 122-126 | Header imported, rendered with panel state |
| `app/restaurants/page.tsx` | 10, 243-262 | Header imported, rendered with panel state |
| `features/blog/BlogClient.tsx` | 5 | Header imported |
| `features/blog/BlogDetailClient.tsx` | 4 | Header imported |
| `features/favorites/FavoritesPage.tsx` | 12 | Header imported |
| Plus 20+ more... | | |

**Pattern of violation:**
```tsx
// RestaurantDetailClient.tsx - Lines 122-130
<Header
  onMenuClick={handleMenuClick}
  onThemeClick={handleThemeClick}
  onHeaderClick={showHeaderClick ? handleCloseAll : undefined}
/>

{/* Panels */}
{activePanel === "menu" && <SideMenu isOpen={true} onClose={handleCloseAll} />}
{activePanel === "theme" && <ThemeModal isOpen={true} onClose={handleCloseAll} />}
```

**Problems:**
1. Panel state duplicated across components
2. Header not truly "global" if rendered per page
3. Theme/menu may not work consistently

#### B. Back Button Chaos

**3 Different Patterns Found:**

**Pattern 1: router.back()**
```tsx
// language/page.tsx - Line 23
onClick={() => router.back()}

// RestaurantDetailClient.tsx - Line 136
onClick={() => router.back()}
```

**Pattern 2: window.location.href**
```tsx
// restaurants/page.tsx - Line 263
onBack={() => (window.location.href = "/")}
```

**Pattern 3: Inline SVG**
```tsx
// RestaurantDetailClient.tsx - Lines 134-143
<button onClick={() => router.back()}>
  <svg><!-- inline arrow --></svg>
</button>

// SearchContainer.tsx - Lines 130-141
<button onClick={onBack}>
  <svg><!-- inline arrow --></svg>
</button>
```

#### C. No ContextBar Abstraction

**What exists instead:**
- Page-specific search bars
- Sticky filter bars with inline positioning
- No unified component for context-aware navigation

---

### 3. PROVIDER AUDIT

#### ✅ GOOD: Single Providers Component

**File**: `components/layout/Providers.tsx`
```tsx
<LanguageProvider>
  <ThemeProvider>{children}</ThemeProvider>
</LanguageProvider>
```

**Root Layout**: `app/layout.tsx`
```tsx
<Providers>{children}</Providers>
```

**Assessment:** Clean, no duplication, proper structure.

**Issue:** Panel state (menu/theme) is managed in client components, not providers.

**CORRECTION REQUIRED:**
- Create separate `NavigationProvider` for UI-only navigation state
- NOT part of global Providers (Theme/Language/Auth)

---

### 4. SPACING AUDIT

#### Current State: Good Pattern, Wrong Ownership

**Pattern found across 32 files:**
```tsx
<main className="pt-[var(--page-top-offset)]">
```

**Token defined in `styles/tokens.css`:**
```css
--page-top-offset: var(--header-total-height);
--header-total-height: calc(
  var(--header-offset-top) +
  var(--header-padding-y) +
  var(--header-logo-size) +
  var(--header-padding-y)
);
```

**Assessment:** Spacing system is well-defined, BUT ownership is wrong.

**CORRECTION REQUIRED:**
- ContextBar must own its height via tokens
- Pages use `var(--page-top-offset)` WITHOUT knowing about ContextBar
- Token system calculates total offset automatically

---

## 🎯 CRITICAL ISSUES SUMMARY

### Priority 1: MUST FIX (Blocking Navigation UX)

| Issue | Impact | Files |
|-------|--------|-------|
| **Header in client components** | Theme/menu inconsistent | 27+ |
| **3 back button patterns** | User confusion | 13+ |
| **Inline SVG for navigation** | No single source of truth | 2 critical |
| **No ContextBar** | Scattered implementation | N/A |
| **Panel state duplication** | Complex state management | 27+ |

### Priority 2: SHOULD FIX (Design System Compliance)

| Issue | Impact | Files |
|-------|--------|-------|
| **Heroicons everywhere** | Bundle size, inconsistency | 125+ |
| **Inline SVGs** | Maintenance nightmare | 11 |
| **NavigationContext in wrong scope** | Architectural violation | N/A |

---

## 📋 IMPLEMENTATION PLAN

### PHASE 1: Icon System Migration

#### Step 1.1: Install Lucide
```bash
bun add lucide-react
bun remove @heroicons/react
```

**Rationale:**
- Lucide: ~0.6-0.8 KB per icon (35-45% lighter)
- Single style (no outline/solid split)
- Better scalability

#### Step 1.2: Unique Icons First Strategy ⚠️ CORRECTED

**DO NOT migrate file-by-file.**

**Correct execution:**
1. Identify ALL unique icons (≈20)
2. Map Heroicons → Lucide equivalents
3. Create centralized export in `/components/icons/index.ts`
4. Replace imports via find-replace (single operation)

**This avoids churn and review noise.**

#### Step 1.3: Create Centralized Icon System

**New file**: `components/icons/index.ts`
```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   ICON SYSTEM - Single Source of Truth
   ALL icons must come from this file
   NO direct lucide-react imports in components
   ═══════════════════════════════════════════════════════════════════════════════ */

// Re-export ALL icons from lucide-react
export * from "lucide-react"

// Convenience re-exports for commonly used icons
// Maps old Heroicons names to Lucide equivalents
export {
  Menu as MenuIcon,
  ChevronLeft as ArrowLeftIcon,
  Search as MagnifyingGlassIcon,
  X as XMarkIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  Home as HomeIcon,
  User as UserIcon,
  Settings as CogIcon,
  Check as CheckIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Clock as ClockIcon,
  Phone as PhoneIcon,
  Mail as EnvelopeIcon,
  Share as ShareIcon,
  Tag as TagIcon,
  DollarSign as CurrencyDollarIcon,
  Building2 as BuildingStorefrontIcon,
  FileText as DocumentTextIcon,
  AlertTriangle as ExclamationTriangleIcon,
  Users as UsersIcon,
  Globe as LanguageIcon,
} from "lucide-react"
```

**Hard rule:**
```tsx
// ✅ CORRECT
import { Star, Heart, Menu } from "@/components/icons"

// ❌ FORBIDDEN
import { Star } from "lucide-react"
import { Star } from "@heroicons/react"
```

#### Step 1.4: Icon Mapping Table

| Heroicons | Lucide | Files Using | Priority |
|-----------|--------|-------------|----------|
| `Bars3BottomRightIcon` | `Menu` | Header.tsx | P0 |
| `ArrowLeftIcon` | `ChevronLeft` | 11 files | P0 |
| `MagnifyingGlassIcon` | `Search` | SearchContainer | P0 |
| `XMarkIcon` | `X` | SearchContainer | P0 |
| `StarIcon` | `Star` | 50+ files | P0 |
| `HeartIcon` | `Heart` | 30+ files | P0 |
| `MapPinIcon` | `MapPin` | 20+ files | P1 |
| `HomeIcon` | `Home` | SideMenu | P1 |
| `UserIcon` | `User` | SideMenu | P1 |
| `Cog6ToothIcon` | `Settings` | SideMenu | P1 |
| `CheckIcon` | `Check` | ThemeModal | P1 |
| `MoonIcon` | `Moon` | theme-constants.ts | P1 |
| `SunIcon` | `Sun` | theme-constants.ts | P1 |
| `ClockIcon` | `Clock` | RestaurantDetail | P1 |
| `PhoneIcon` | `Phone` | RestaurantDetail | P1 |
| `EnvelopeIcon` | `Mail` | 15+ files | P1 |
| `ShareIcon` | `Share` | RestaurantDetail | P2 |
| `TagIcon` | `Tag` | RestaurantDetail | P2 |
| `CurrencyDollarIcon` | `DollarSign` | RestaurantDetail | P2 |

**Total unique icons**: ~20

#### Step 1.5: Migration Command

```bash
# Single find-replace operation
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  's|@heroicons/react/24/outline|@/components/icons|g' {} +

find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  's|@heroicons/react/24/solid|@/components/icons|g' {} +
```

Then run TypeScript check to fix any breaking imports.

---

### PHASE 2: Create ContextBar Component (NEW)

**New file**: `components/layout/ContextBar.tsx`

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   CONTEXT BAR - Page-aware navigation layer
   Sits between Header and page content
   Owns spacing via tokens (NOT page responsibility)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft } from "@/components/icons"
import { useRouter } from "next/navigation"
import { forwardRef, HTMLAttributes } from "react"

export type ContextBarVariant = "none" | "search" | "detail"

interface ContextBarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContextBarVariant
  title?: string
  showBack?: boolean
  sticky?: boolean
  children?: React.ReactNode
}

export const ContextBar = forwardRef<HTMLDivElement, ContextBarProps>(
  ({ variant = "none", title, showBack = false, sticky = true, className, children, ...props }, ref) => {
    const router = useRouter()

    const handleBack = () => {
      router.back()
    }

    // variant="none" renders nothing
    if (variant === "none") return null

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "w-full bg-[var(--bg)] border-b border-[var(--fg-10)]",
          // Sticky behavior ONLY for ContextBar
          sticky && "sticky top-[var(--header-total-height)] z-40",
          // Spacing - uses tokens, NOT hardcoded
          "px-[var(--page-padding-x)] py-[var(--spacing-sm)]",
          // Height is controlled by content, not fixed
          "min-h-[var(--context-bar-height)]",
          // Custom classes allowed
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Back Button - single source of truth */}
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="p-[var(--spacing-xs)] rounded-full hover:bg-[var(--fg-5)] transition-colors text-[var(--fg)]"
              aria-label="Go back"
            >
              <ChevronLeft className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
            </button>
          )}

          {/* Content slot */}
          {variant === "search" && <div className="flex-1">{children}</div>}

          {variant === "detail" && title && (
            <h1 className="text-[var(--font-size-lg)] font-semibold text-[var(--fg)]">
              {title}
            </h1>
          )}
        </div>
      </div>
    )
  }
)

ContextBar.displayName = "ContextBar"
```

#### Token additions to `styles/tokens.css`:

```css
/* ═══════════════════════════════════════════════════════════════════════════════
   CONTEXT BAR TOKENS
   Controls spacing for ContextBar component
   Pages do NOT need to know about ContextBar height
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ContextBar minimum height */
--context-bar-height: 3.5rem;

/* Page top offset - AUTOMATICALLY includes ContextBar when present */
/* Pages ALWAYS use this token, never calculate manually */
--page-top-offset: calc(var(--header-total-height) + var(--context-bar-height));
```

**Important:** Pages use `var(--page-top-offset)` without knowing whether ContextBar exists. The token system handles it.

---

### PHASE 3: Create NavigationProvider (CORRECTED SCOPE)

**CRITICAL CORRECTION**: NavigationContext must be in a SEPARATE provider, NOT in global Providers.

**New file**: `components/navigation/NavigationProvider.tsx`

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   NAVIGATION PROVIDER - UI-only navigation state
   Manages panel state (menu/theme) for Header/SideMenu/ThemeModal
   Imported ONLY by app/layout.tsx
   NOT part of global Providers (Theme/Language/Auth)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type ActivePanel = "none" | "menu" | "theme"

interface NavigationContextType {
  activePanel: ActivePanel
  setActivePanel: (panel: ActivePanel) => void
  openMenu: () => void
  openTheme: () => void
  closeAll: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider")
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none")

  const openMenu = useCallback(() => setActivePanel("menu"), [])
  const openTheme = useCallback(() => setActivePanel("theme"), [])
  const closeAll = useCallback(() => setActivePanel("none"), [])

  return (
    <NavigationContext.Provider
      value={{ activePanel, setActivePanel, openMenu, openTheme, closeAll }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
```

---

### PHASE 4: Update Root Layout (FINAL STRUCTURE)

**Updated file**: `app/layout.tsx`

```tsx
import { Providers } from "@/components/layout/Providers"
import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import { AppHeader } from "@/components/layout/Header"  // Rename from Header
import { SkipLink } from "@/components/layout/SkipLink"
import { ThemeScript } from "@/components/theme-script"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <SkipLink />

        {/* Global Providers (Theme, Language) */}
        <Providers>
          {/* Navigation Provider (UI-only state) */}
          <NavigationProvider>

            {/* Header - ALWAYS rendered, NEVER in client components */}
            <AppHeader />

            {/* Page content */}
            {children}

            {/* Toast notifications */}
            <Toaster position="top-right" richColors closeButton />

          </NavigationProvider>
        </Providers>
      </body>
    </html>
  )
}
```

**Key changes:**
1. NavigationProvider is SEPARATE from Providers
2. Header lives in root layout ONLY
3. Client components NEVER render Header

---

### PHASE 5: Update Header to Use NavigationContext

**Updated file**: `components/layout/Header.tsx` (rename to AppHeader.tsx)

```tsx
"use client"

import { useNavigation } from "@/components/navigation/NavigationProvider"
import { useTheme } from "@/context/ThemeContext"
import { Menu, Moon, Sun } from "@/components/icons"
// ... rest of header code

export function AppHeader() {
  const { activePanel, openMenu, openTheme, closeAll } = useNavigation()
  const { mode, setMode } = useTheme()

  const handleMenuClick = () => {
    if (activePanel === "menu") {
      closeAll()
    } else {
      openMenu()
    }
  }

  const handleThemeClick = () => {
    if (activePanel === "theme") {
      closeAll()
    } else {
      openTheme()
    }
  }

  const showHeaderClick = activePanel !== "none"

  return (
    <>
      <header
        onClick={showHeaderClick ? closeAll : undefined}
        className={/* existing header classes */}
      >
        {/* Logo, Menu button, Theme button */}
      </header>

      {/* Panels - rendered here, NOT in client components */}
      {activePanel === "menu" && <SideMenu isOpen={true} onClose={closeAll} />}
      {activePanel === "theme" && <ThemeModal isOpen={true} onClose={closeAll} />}
    </>
  )
}
```

---

### PHASE 6: Remove Header from Client Components

**Files to update (27+):**

1. `features/restaurant/RestaurantDetailClient.tsx`
   ```tsx
   // REMOVE these lines:
   import Header from "@/components/layout/Header"
   import SideMenu from "@/components/layout/SideMenu"
   import ThemeModal from "@/components/layout/ThemeModal"
   const [activePanel, setActivePanel] = useState<ActivePanel>("none")
   const handleMenuClick = ...
   const handleThemeClick = ...
   <Header ... />
   {activePanel === "menu" && <SideMenu ... />}

   // ADD:
   import { ContextBar } from "@/components/layout/ContextBar"

   <ContextBar variant="detail" title={restaurant.name} showBack />
   ```

2. `app/restaurants/page.tsx`
   ```tsx
   // REMOVE: All Header, SideMenu, ThemeModal imports and state
   // ADD:
   import { ContextBar } from "@/components/layout/ContextBar"

   <ContextBar variant="search" showBack>
     <SearchContainer />
   </ContextBar>
   ```

3. Similar changes for ALL 27 files...

---

### PHASE 7: Create Single BackButton Component

**New file**: `components/navigation/BackButton.tsx`

```tsx
/* ═══════════════════════════════════════════════════════════════════════════════
   BACK BUTTON - Single source of truth for back navigation
   Uses router.back() ONLY
   NO window.location.href
   NO inline SVGs
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChevronLeft } from "@/components/icons"
import { useRouter } from "next/navigation"
import { forwardRef, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const BackButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const router = useRouter()

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => router.back()}
        className={cn(
          "p-[var(--spacing-xs)]",
          "rounded-full",
          "bg-[var(--bg)]",
          "shadow-lg",
          "border border-[var(--fg-10)]",
          "text-[var(--fg)]",
          "hover:text-[var(--color-primary)]",
          "hover:bg-[var(--fg-5)]",
          "transition-all",
          className
        )}
        aria-label="Go back"
        {...props}
      >
        <ChevronLeft className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
      </button>
    )
  }
)

BackButton.displayName = "BackButton"
```

**Replace ALL back button patterns:**
```tsx
// ❌ Remove all these:
<svg><!-- inline arrow --></svg>
onClick={() => window.location.href = "/"}

// ✅ Use only:
<BackButton />
```

---

## 🧪 VERIFICATION CHECKLIST (Per Phase)

### Before Starting
- [ ] Backup current branch: `git branch backup-before-migration`
- [ ] Run baseline audit: `bun run audit:ci > baseline.txt`
- [ ] Document current violations count

### Phase 1: Icon System
- [ ] No layout shift
- [ ] No duplicate navigation state
- [ ] No new spacing utilities
- [ ] No mixed icon imports (all from `@/components/icons`)
- [ ] TypeScript compiles without errors
- [ ] All icons render correctly

### Phase 2: ContextBar
- [ ] No layout shift
- [ ] Sticky positioning works
- [ ] All 3 variants (none, search, detail) work
- [ ] Spacing uses tokens only
- [ ] No per-page padding adjustments

### Phase 3: NavigationProvider
- [ ] No layout shift
- [ ] Panel state NOT in client components
- [ ] Theme toggle works on ALL pages
- [ ] Menu toggle works on ALL pages
- [ ] No duplicate panel state

### Phase 4: Root Layout
- [ ] No layout shift
- [ ] Header renders in root layout ONLY
- [ ] NavigationProvider wraps page content
- [ ] No Header imports in client components

### Phase 5: Header Update
- [ ] No layout shift
- [ ] Header uses NavigationContext
- [ ] Panels render from Header, NOT client components
- [ ] Menu/theme work consistently

### Phase 6: Client Components
- [ ] No layout shift
- [ ] Header removed from ALL 27 client components
- [ ] ContextBar added where needed
- [ ] Panel state removed from ALL client components
- [ ] No navigation logic in feature components

### Phase 7: BackButton
- [ ] No layout shift
- [ ] All inline SVG back buttons replaced
- [ ] No window.location.href patterns
- [ ] All back navigation uses BackButton component
- [ ] Back navigation works from all entry points

### Final Verification
- [ ] No layout shift on ANY page
- [ ] No duplicate navigation state
- [ ] No new spacing utilities
- [ ] No mixed icon imports
- [ ] Theme works on ALL pages
- [ ] Menu works on ALL pages
- [ ] Back navigation works from all entry points
- [ ] Audit passes: `bun run audit:ci`
- [ ] Bundle size reduced by 30-40 KB
- [ ] No console errors
- [ ] No console warnings

---

## 📊 MIGRATION CHECKLIST

### Pre-Migration
- [ ] Create backup branch
- [ ] Run baseline audit
- [ ] Document current state

### Phase 1: Icon System
- [ ] Install lucide-react
- [ ] Remove @heroicons/react
- [ ] Create /components/icons/index.ts
- [ ] Map all unique icons (≈20)
- [ ] Run find-replace for imports
- [ ] Fix any breaking imports
- [ ] Run audit: Layer 04 (design tokens)
- [ ] Verify no inline SVGs for navigation

### Phase 2: ContextBar
- [ ] Create ContextBar component
- [ ] Add --context-bar-height token
- [ ] Update --page-top-offset calculation
- [ ] Test all 3 variants
- [ ] Verify sticky positioning

### Phase 3: NavigationProvider
- [ ] Create NavigationProvider.tsx
- [ ] Create useNavigation hook
- [ ] Export from components/navigation

### Phase 4: Root Layout
- [ ] Update app/layout.tsx
- [ ] Add NavigationProvider wrapper
- [ ] Move Header to root layout
- [ ] Rename Header to AppHeader

### Phase 5: Header Update
- [ ] Update AppHeader to use NavigationContext
- [ ] Remove panel state from AppHeader
- [ ] Move panel rendering to AppHeader

### Phase 6: Client Components
- [ ] Remove Header from RestaurantDetailClient
- [ ] Remove Header from restaurants page
- [ ] Remove Header from blog pages
- [ ] Remove Header from favorites page
- [ ] Remove Header from all 27 files
- [ ] Add ContextBar where needed

### Phase 7: BackButton
- [ ] Create BackButton component
- [ ] Replace inline SVG back buttons
- [ ] Remove window.location.href patterns
- [ ] Update all back navigation

### Phase 8: Verification
- [ ] Run full audit
- [ ] Test theme toggle on all pages
- [ ] Test side menu on all pages
- [ ] Test back navigation from all entry points
- [ ] Verify spacing consistent
- [ ] Verify no layout flash
- [ ] Compare bundle size
- [ ] Commit with atomic commits

---

## 🚦 SUCCESS CRITERIA

### Must Have (Blocking)
- [ ] Lucide is ONLY icon library
- [ ] NO inline SVG icons for navigation
- [ ] ONE BackButton component
- [ ] ONE ContextBar component
- [ ] Header NEVER in client components
- [ ] NavigationProvider SEPARATE from Providers
- [ ] Theme/menu work on ALL pages
- [ ] router.back() used consistently

### Should Have (Quality)
- [ ] All spacing uses tokens
- [ ] No hardcoded values
- [ ] Audit passes all layers
- [ ] Bundle size reduced by 30-40 KB
- [ ] No panel state duplication

### Nice to Have (Polish)
- [ ] Icon documentation
- [ ] Migration guide for contributors
- [ ] CI rule to enforce icon imports
- [ ] Automated icon import linter

---

## ⚠️ RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | High | Atomic commits, easy revert |
| Bundle regression | Medium | Measure before/after |
| Missing icons | Medium | Map all icons first |
| Navigation breakage | High | Test all back paths |
| Theme/menu broken | High | Test on every page |
| Layout shift | High | Verify spacing after each phase |

---

## 📝 FINAL NOTES

### Estimated Effort
- **Phase 1 (Icons)**: 3-4 hours (unique-icons-first strategy)
- **Phase 2 (ContextBar)**: 2-3 hours
- **Phase 3-5 (Navigation)**: 3-4 hours
- **Phase 6 (Client Components)**: 4-5 hours
- **Phase 7 (BackButton)**: 1-2 hours
- **Phase 8 (Verification)**: 2-3 hours

**Total**: 15-21 hours

### Execution Rules
1. **Sequential phases only** - No parallel work
2. **Verify after each phase** - Run audit, test manually
3. **Atomic commits** - One phase = one commit
4. **Rollback ready** - Each phase can be reverted independently

### Source References
- Next.js App Router Architecture
- Design System Governance (documentation/GOVERNANCE.md)
- UI Invariants (documentation/ui/UI_INVARIANTS.md)
- Component Inventory (documentation/COMPONENT_INVENTORY.md)

---

## ✅ APPROVAL STATUS

**Status**: ✅ APPROVED WITH MANDATORY CORRECTIONS APPLIED

### Corrections Applied:
1. ✅ NavigationContext moved to separate NavigationProvider
2. ✅ ContextBar owns spacing via tokens
3. ✅ Icon migration uses unique-icons-first strategy
4. ✅ Hard Rules section added
5. ✅ Verification Checklist added per phase

### Conditions Before Starting:
- [ ] Review updated plan
- [ ] Confirm Hard Rules understood
- [ ] Confirm sequential execution (no parallel phases)

### Approved To Proceed:
- ✅ Phase 1 (Lucide migration) - Ready to start
- ❌ Phase 2-7 - Wait for Phase 1 completion

---

**Next Step**: Awaiting your final "GO" to begin Phase 1.

Once you confirm, I will:
1. Create backup branch
2. Run baseline audit
3. Begin Phase 1 (Icon migration)
4. Report completion before Phase 2
