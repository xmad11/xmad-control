# TAB SYSTEM AUDIT - 2026-03-18

## Issues Reported
1. **Chat button has too much bottom space between it and the other 5 tabs**
2. **2nd (memory) and 4th (screen) tabs when clicked show only half - top part visible, bottom half covered**

---

## CRITICAL FINDINGS

### 1. DUPLICATE TAB CONFIGURATIONS (HIGH PRIORITY)

**Two different sources of truth for tabs exist:**

| File | Variable | Tabs Count | Values |
|------|----------|------------|--------|
| `config/dashboard.ts:122-129` | `TABS` | 6 | memory, automation, overview, screen, backups, **settings** |
| `config/surfaces.ts:111-117` | `TAB_CONFIG` | 5 | memory, automation, overview, screen, backups |

**Problem:** `HomeClient.tsx` uses `useSurfaceController()` which imports from `TAB_CONFIG` (5 tabs), but `config/dashboard.ts` has a different `TABS` array (6 tabs).

**Files affected:**
- `config/dashboard.ts` - Lines 122-129
- `config/surfaces.ts` - Lines 111-117
- `runtime/useSurfaceController.ts` - Line 15 imports `TAB_CONFIG`
- `features/home/HomeClient.tsx` - Uses tabs from controller

---

### 2. HARDCODED BOTTOM PADDING (HIGH PRIORITY)

**Token defined but NOT used:**

| File | Line | Value | Should Use |
|------|------|-------|------------|
| `config/dashboard.ts` | 177 | `BOTTOM_PADDING: "pb-28"` | Token exists |
| `features/home/HomeClient.tsx` | 81 | Hardcoded `pb-24` | `WIDGET_LAYOUT.BOTTOM_PADDING` |

**Code:**
```tsx
// HomeClient.tsx:81 - HARDCODED
<div className="relative z-10 flex-1 px-3 py-4 md:px-4 lg:px-6 pb-24">

// config/dashboard.ts:177 - TOKEN EXISTS BUT UNUSED
BOTTOM_PADDING: "pb-28"
```

---

### 3. CHAT BUTTON SPACING ISSUE (HIGH PRIORITY)

**Location:** `features/home/HomeClient.tsx` Lines 93-107

**Problems identified:**

1. **Animation offset creates gap:** `y: 8` in enter/exit animation
2. **No explicit gap/margin between chat button and tabs**
3. **Absolute positioning causes layout issues**

**Code:**
```tsx
// Lines 93-107
<AnimatePresence>
  {tabsExpanded && (
    <motion.button
      initial={{ opacity: 0, y: 8 }}  // <-- Creates vertical offset
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}      // <-- Creates vertical offset on exit
      transition={{ duration: 0.15 }}
      className="relative p-2 rounded-lg ..."  // <-- No margin-bottom
    >
```

**The chat button floats above the tab bar with no defined gap.** When it animates in/out, the `y: 8` creates visual separation.

---

### 4. TAB HALF-VISIBLE ISSUE (CRITICAL)

**Affected tabs:** 2nd (memory) and 4th (screen)

**Root causes identified:**

#### 4.1 Content Area Padding Mismatch
```tsx
// HomeClient.tsx:81
<div className="relative z-10 flex-1 px-3 py-4 md:px-4 lg:px-6 pb-24">
```
- Uses `pb-24` (6rem = 96px)
- Tab bar is at `fixed bottom-0` with `pb-2`
- Tab bar height varies based on content/label visibility

#### 4.2 Tab Bar Z-Index and Positioning
```tsx
// HomeClient.tsx:90
<div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-2 pointer-events-none">
```
- Fixed at bottom with only `pb-2` (8px) padding
- No consideration for safe-area-inset-bottom
- Z-index 20 might conflict with sheet (z-30)

#### 4.3 Collapsed/Expanded State Issues
```tsx
// HomeClient.tsx:114-116
className={`
  transition-all duration-300 ease-out select-none
  ${tabsExpanded ? "opacity-0 scale-75 pointer-events-none absolute" : "opacity-100 scale-100"}
```
- When expanded, the collapsed button becomes `absolute` which might cause layout shifts
- The tab list also uses `absolute` when collapsed:
```tsx
// HomeClient.tsx:158-159
${tabsExpanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"}
```

#### 4.4 Surface Content Height Variations
Looking at the surfaces:
- `overview.surface.tsx` - Has multiple rows with carousels (tall content)
- `memory.surface.tsx` - Has 3 rows with carousels and process list (tall content)
- `screen.surface.tsx` - Uses `h-[60vh]` centering (SHORT content)
- `automation.surface.tsx` - Uses `h-[60vh]` centering (SHORT content)

**The short surfaces (screen, automation) might not have enough content to scroll, causing the half-visible issue.**

---

### 5. GLASS TABS LIST SPACING (MEDIUM PRIORITY)

**Location:** `features/home/HomeClient.tsx` Line 162

```tsx
<GlassTabsList className="flex items-center justify-center gap-0.5 px-1.5 py-1 h-auto">
```

- `gap-0.5` = 2px gap between tabs (very tight)
- In `components/glass/glass-tabs.tsx:30` the base class uses `gap-1`
- **Conflict:** Inline `gap-0.5` overrides the component default

---

### 6. INLINE STYLES AND HARDCODED VALUES (MEDIUM PRIORITY)

**Location:** `features/home/HomeClient.tsx` Lines 100, 118-122

```tsx
// Line 100 - Hardcoded shadow
shadow-[0_2px_8px_rgba(0,0,0,0.2)]

// Line 118-122 - Hardcoded shadow and gradient
shadow-[0_4px_16px_rgba(0,0,0,0.2)]
before:bg-gradient-to-b before:from-white/20 before:to-transparent
```

**Should use tokens from `aiDockTokens` in `design/tokens/ai-dock.tokens.ts`**

---

### 7. Z-INDEX INCONSISTENCIES (MEDIUM PRIORITY)

| Component | Z-Index | Source |
|-----------|---------|--------|
| Tab bar | 20 | HomeClient.tsx:90 |
| Chat FAB | 30 | ChatFab.tsx:39 |
| AI Sheet | 120 | aiDockLayer.sheet |
| Backdrop | 110 | aiDockLayer.backdrop |
| Header | 100 | tokens.css:639 |

**Problem:** Mix of Tailwind utilities (`z-20`, `z-30`) and token-based z-index (`aiDockLayer.sheet = 120`)

---

### 8. MISSING SAFE AREA HANDLING (LOW PRIORITY)

**No safe-area-inset-bottom handling for:**
- Tab bar positioning (`HomeClient.tsx:90`)
- Content area bottom padding

**Token exists but unused:**
```ts
// design/tokens/ai-dock.tokens.ts:193
safeAreaBottom: "env(safe-area-inset-bottom, 0px)"
```

---

### 9. ANIMATION TIMING MISMATCH (LOW PRIORITY)

**Multiple animation durations:**

| Location | Duration | Context |
|----------|----------|---------|
| HomeClient.tsx:99 | 0.15s (150ms) | Chat button enter/exit |
| HomeClient.tsx:115 | 0.3s (300ms) | Collapsed button transition |
| HomeClient.tsx:158 | 0.3s (300ms) | Tab list transition |
| aiDockTokens.motion.tabExpand | 220ms | Token value |

**Problem:** Hardcoded durations don't match token values

---

## FILE STRUCTURE MAP

```
features/home/
  HomeClient.tsx          <-- Main dashboard with tabs (ISSUES HERE)

components/glass/
  glass-tabs.tsx          <-- GlassTabs components

components/ui/
  FloatingTabs.tsx        <-- UNUSED duplicate tabs component

config/
  dashboard.ts            <-- TABS array (6 tabs) + WIDGET_LAYOUT tokens
  surfaces.ts             <-- TAB_CONFIG (5 tabs) + SURFACE_REGISTRY

runtime/
  useSurfaceController.ts <-- Uses TAB_CONFIG (5 tabs)
  SurfaceManager.tsx      <-- Loads surfaces dynamically

surfaces/
  overview.surface.tsx    <-- Tab 3 content (works)
  memory.surface.tsx      <-- Tab 2 content (HALF-VISIBLE ISSUE)
  screen.surface.tsx      <-- Tab 4 content (HALF-VISIBLE ISSUE)
  automation.surface.tsx  <-- Tab 2 content
  backups.surface.tsx     <-- Tab 5 content

design/tokens/
  ai-dock.tokens.ts       <-- Motion, size, z-index tokens (PARTIALLY USED)
```

---

## RECOMMENDED FIX ORDER

1. **Consolidate tab configurations** - Remove duplicate, use single source
2. **Fix content padding** - Use `WIDGET_LAYOUT.BOTTOM_PADDING` token
3. **Fix chat button spacing** - Add explicit `mb-2` or use flex gap
4. **Fix tab half-visible** - Increase bottom padding, handle short content surfaces
5. **Replace inline styles** - Use `aiDockTokens` for animations and shadows
6. **Standardize z-index** - Use token-based z-index everywhere
7. **Add safe-area handling** - Use `aiDockPosition.safeAreaBottom`

---

## TOKENS TO USE (EXIST BUT UNUSED)

```ts
// From design/tokens/ai-dock.tokens.ts
aiDockMotion.tabExpand: 220          // Tab expand duration
aiDockMotion.tabTransition: 220      // Tab transition
aiDockMotion.tabCollapseDelay: 2000  // Auto-collapse delay
aiDockPosition.safeAreaBottom        // Safe area inset
aiDockLayer.dock: 80                 // Dock z-index
aiDockLayer.sheet: 120               // Sheet z-index

// From config/dashboard.ts
WIDGET_LAYOUT.BOTTOM_PADDING: "pb-28"  // Content bottom padding
```

---

*Audit completed: 2026-03-18*
*Agent: Claude Opus 4.6*
