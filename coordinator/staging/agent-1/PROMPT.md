# AGENT-1 PROMPT - shadi-nextjs-uae MIGRATION PHASE 1

**Role:** Page Components & Infrastructure Migration Specialist
**Phase:** Critical Infrastructure (PWA, SkipLinks)
**Date:** 2026-01-04

---

## 🎯 YOUR MISSION

Migrate **3 critical components** from **shadi-nextjs-uae** to **Shadi V2**:

1. **M01: PWA Hooks & Infrastructure** (usePWA.ts - 451 lines)
2. **M02: PWA UI Components** (InstallPrompt, OfflineBanner, OfflineSupport)
3. **M03: SkipLinks Migration** (144 lines, WCAG 2.1 AA)

---

## 📋 TASK QUEUE (Work in Order)

### Task M01: PWA Hooks & Infrastructure 🔴 CRITICAL

**Source File:** `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/hooks/usePWA.ts`

**Your Job:**
1. Read the source file carefully
2. Copy to `/coordinator/staging/agent-1/pwa-hooks/usePWA.ts`
3. Replace ALL hardcoded values with Shadi V2 design tokens
4. Replace lucide-react icons with Heroicons (where used)
5. Ensure TypeScript compliance (no `any`, `never`, `undefined`)
6. Add proper JSDoc comments

**Source Files to Copy:**
- `usePWA.ts` (main hook)
- `useOfflineActions.ts` (included in same file)
- `useOfflineFavorites.ts` (included in same file)
- `useCachedRestaurants.ts` (included in same file)

**What to Fix:**
- Replace `bg-gray-200` → `bg-[var(--bg-70)]`
- Replace `text-gray-600` → `text-[var(--fg-70)]`
- Replace any [token pattern] → `bg-[var(--color-primary)]`
- Replace `w-4 h-4` icons → `w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]`

**Deliverables:**
```
/coordinator/staging/agent-1/pwa-hooks/
├── usePWA.ts (main)
├── useOfflineActions.ts
├── useOfflineFavorites.ts
└── useCachedRestaurants.ts
```

---

### Task M02: PWA UI Components 🔴 CRITICAL

**Source Files:**
- `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/pwa/InstallPrompt.tsx`
- `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/pwa/OfflineBanner.tsx`
- `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/pwa/OfflineSupport.tsx`

**Your Job:**
1. Read all three source files
2. Copy to `/coordinator/staging/agent-1/pwa-components/`
3. Replace ALL hardcoded values with design tokens
4. Replace lucide-react with Heroicons
5. Ensure TypeScript compliance
6. Add proper JSDoc comments
7. Create barrel export in `index.ts`

**What to Fix:**
- Replace all hardcoded colors/spacing
- Replace icons with Heroicons equivalents
- Ensure proper token usage

**Deliverables:**
```
/coordinator/staging/agent-1/pwa-components/
├── InstallPrompt.tsx
├── OfflineBanner.tsx
├── OfflineSupport.tsx
└── index.ts (exports)
```

---

### Task M03: SkipLinks Migration 🟡 HIGH

**Source File:** `/Users/ahmadabdullah/Desktop/shadi-nextjs-uae/components/accessibility/SkipLinks.tsx` (144 lines)

**Your Job:**
1. Read the source file
2. Copy to `/coordinator/staging/agent-1/skip-links/SkipLinks.tsx`
3. Replace hardcoded values with design tokens
4. Ensure WCAG 2.1 AA compliance maintained
5. Add proper JSDoc comments

**Features to Preserve:**
- 4 configurable skip links (main, nav, search, footer)
- Tab key detection for showing
- Focus management with restoration
- Proper ARIA attributes
- Smooth scroll to targets

**Deliverables:**
```
/coordinator/staging/agent-1/skip-links/
└── SkipLinks.tsx
```

---

## 🚨 CRITICAL RULES

### 1. Design Token Compliance (NON-NEGOTIABLE)
```css
/* ✅ CORRECT */
className="bg-[var(--bg-70)] text-[var(--fg-70)]"

/* ❌ WRONG */
className="bg-gray-200 text-gray-600"
```

### 2. Icon Replacements
| lucide-react | Heroicons |
|--------------|-----------|
| Check | CheckIcon |
| ChevronUp | ChevronUpIcon |
| ChevronDown | ChevronDownIcon |
| X | XMarkIcon |

### 3. TypeScript Standards
```typescript
// ✅ CORRECT
export interface Props {
  name: string
  count?: number
}

// ❌ WRONG
export interface Props {
  name: string
  count: undefined  // Use ? instead
}
```

### 4. Named Exports Only
```typescript
// ✅ CORRECT
export function SkipLinks() { }

// ❌ WRONG
export default function SkipLinks() { }
```

---

## 📤 SUBMISSION PROCESS

After completing EACH task:

1. **Post message:**
   ```
   Task MXX ready for review - [Component Name]
   Files: [list of files]
   Changes: [brief description of fixes]
   ```

2. **Wait for coordinator approval** before copying to main project

---

## 🎯 SUCCESS CRITERIA

Your submission will be approved when:
- ✅ All hardcoded values replaced with design tokens
- ✅ All lucide-react icons replaced with Heroicons
- ✅ Zero TypeScript violations (no `any`, `never`, `undefined`)
- ✅ Named exports only
- ✅ JSDoc comments on all exports
- ✅ Features preserved from source
- ✅ Proper file structure

---

## 📁 REFERENCE DOCUMENTS

- Migration Analysis: `/docs/shadi-nextjs-uae-component-migration-analysis.md`
- Design Tokens: `/styles/tokens.css`
- Template Ratings: `/docs/TEMPLATE-RATINGS.md`

---

**READY TO START? Begin with Task M01.**

Good luck! 🚀
