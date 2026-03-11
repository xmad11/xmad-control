# M02: PWA Components Migration

**Status:** ❌ REVISION REQUIRED
**Priority:** 🔴 CRITICAL
**Reviewed:** 2026-01-04 15:00
**Violations Found:** 1 default export, 2 `as any` type assertions, 4 hardcoded values

---

## 🚨 REVISION REQUIRED - VIOLATIONS FOUND

### Violation 1: Default Export (OfflineSupport.tsx)

**Line 414:**
```typescript
// ❌ WRONG - Default export not allowed
export default OfflineSupport;
```

**✅ CORRECT:**
```typescript
// REMOVE the default export line
// The component is already properly exported at line 58:
export function OfflineSupport({ ... }: OfflineSupportProps) {
```

---

### Violation 2: TypeScript Type Assertions (InstallPrompt.tsx)

**Lines 71, 305:**
```typescript
// ❌ WRONG
(window.navigator as any).standalone
```

**✅ CORRECT:**
```typescript
// Add this interface at the top of the file
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// Then use proper type
const isInStandaloneMode =
  (window.navigator as NavigatorWithStandalone).standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
```

---

### Violation 3: Hardcoded Icon Sizes (InstallPrompt.tsx)

**Lines 192-193, 236-237, 267:**
```typescript
// ❌ WRONG - Hardcoded rem values
<DevicePhoneMobileIcon className="w-[1.5rem] h-[1.5rem]" />
<ArrowDownTrayIcon className="w-[1rem] h-[1rem]" />
<XMarkIcon className="w-[1rem] h-[1rem]" />
```

**✅ CORRECT:**
```typescript
// Use icon size tokens
<DevicePhoneMobileIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]" />
<ArrowDownTrayIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
<XMarkIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
```

---

## ✅ HOW TO FIX

### Fix 1: Remove Default Export

**File:** `/coordinator/staging/agent-1/pwa-components/OfflineSupport.tsx`

Go to line 414 and DELETE this line:
```typescript
export default OfflineSupport;
```

The component is already properly exported at line 58. The default export is not needed and violates the export standards.

---

### Fix 2: Fix TypeScript Type Assertions

**File:** `/coordinator/staging/agent-1/pwa-components/InstallPrompt.tsx`

**Step 1:** Add this interface after the import statements (around line 13):

```typescript
/**
 * Navigator with standalone property (iOS Safari)
 */
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}
```

**Step 2:** Replace line 71:
```typescript
// ❌ BEFORE
const isInStandaloneMode =
  ("standalone" in window.navigator &&
    (window.navigator as any).standalone) ||
  window.matchMedia("(display-mode: standalone)").matches;

// ✅ AFTER
const isInStandaloneMode =
  (window.navigator as NavigatorWithStandalone).standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
```

**Step 3:** Replace line 305 (same pattern):
```typescript
// ❌ BEFORE
const isInStandaloneMode =
  ("standalone" in window.navigator &&
    (window.navigator as any).standalone) ||
  window.matchMedia("(display-mode: standalone)").matches;

// ✅ AFTER
const isInStandaloneMode =
  (window.navigator as NavigatorWithStandalone).standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
```

---

### Fix 3: Replace Hardcoded Icon Sizes

**File:** `/coordinator/staging/agent-1/pwa-components/InstallPrompt.tsx`

**Line 192-193:**
```tsx
// ❌ BEFORE
<DevicePhoneMobileIcon
  className="w-[1.5rem] h-[1.5rem] text-[var(--color-accent-rust)]"
/>

// ✅ AFTER
<DevicePhoneMobileIcon
  className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-accent-rust)]"
/>
```

**Line 236-237:**
```tsx
// ❌ BEFORE
<ArrowDownTrayIcon className="w-[1rem] h-[1rem]" />

// ✅ AFTER
<ArrowDownTrayIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
```

**Line 267:**
```tsx
// ❌ BEFORE
<XMarkIcon className="w-[1rem] h-[1rem]" />

// ✅ AFTER
<XMarkIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
```

---

## 📋 VERIFICATION CHECKLIST

Before submitting, verify:
- [ ] Zero default exports (search: `export default`)
- [ ] Zero `as any` type assertions (search: `as any`)
- [ ] Zero hardcoded icon sizes (search: `w-\[.*rem\]`, `h-\[.*rem\]`)
- [ ] All proper TypeScript interfaces defined
- [ ] Code compiles: `bun run build`
- [ ] All exports have JSDoc comments

---

## 📤 SUBMISSION FORMAT

When done, post:

```
Task M02 REVISION COMPLETE - Fixed all violations
Files: InstallPrompt.tsx, OfflineSupport.tsx
Changes:
- Removed 1 default export violation
- Fixed 2 'as any' type assertions with proper interfaces
- Replaced 4 hardcoded icon sizes with tokens
TypeScript violations: 0
Export violations: 0
Token violations: 0
Build status: ✅ PASSING
```
