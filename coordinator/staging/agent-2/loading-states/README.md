# M04: Loading States Migration

**Status:** ❌ REVISION REQUIRED - CRITICAL SYNTAX ERROR
**Priority:** 🔴 CRITICAL
**Reviewed:** 2026-01-04 15:00
**Violations Found:** 1 CRITICAL syntax error, 8 hardcoded values

---

## 🚨 CRITICAL - SYNTAX ERROR ON LINE 420

**THIS WILL PREVENT COMPILATION - MUST FIX IMMEDIATELY**

```tsx
// ❌ BROKEN - Line 420
Retry {retryCount > 0 && `(retryCount > 0 '(${'retryCount'})''(${'retryCount'})' `(${retryCount})`}

// ✅ CORRECT
Retry {retryCount > 0 && `(${retryCount})`}
```

---

## ⚠️ TOKEN COMPLIANCE ISSUES

### Hardcoded Icon Sizes (8 violations)

**Lines 368, 455-457, 474, 533:**
```typescript
// ❌ WRONG - Hardcoded rem values
className="w-[0.5rem] h-[0.5rem]"
className="w-[1rem] h-[1rem]"
className="w-[1.5rem] h-[1.5rem]"
className="w-[2rem] h-[2rem]"
className="w-[2.5rem] h-[2.5rem]"

// ✅ CORRECT - Use icon size tokens
className="w-[var(--icon-size-xs)] h-[var(--icon-size-xs)]"
className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]"
className="w-[var(--icon-size-md)] h-[var(--icon-size-md)]"
className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)]"
className="w-[var(--icon-size-xl)] h-[var(--icon-size-xl)]"
```

### Hardcoded Border Width

**Lines 474, 457:**
```typescript
// ❌ WRONG
border-2
border-3

// ✅ CORRECT
border-[var(--border-width)]
border-[calc(var(--border-width)*1.5)]
```

### Hardcoded Margin

**Line 117:**
```typescript
// ❌ WRONG
mb-2

// ✅ CORRECT
mb-[var(--spacing-sm)]
```

---

## ✅ HOW TO FIX

### Fix 1: CRITICAL SYNTAX ERROR (Line 420)

Open `LoadingStates.tsx`, go to line 420, and replace:

```tsx
{/* ❌ DELETE THIS BROKEN CODE */}
Retry {retryCount > 0 && `(retryCount > 0 '(${'retryCount'})''(${'retryCount'})' `(${retryCount})`}

{/* ✅ REPLACE WITH THIS */}
Retry {retryCount > 0 && `(${retryCount})`}
```

### Fix 2: Replace Hardcoded Sizes

**In LoadingSpinner component (lines 454-458):**
```tsx
// ❌ BEFORE
const sizeClasses = {
  sm: "w-[1rem] h-[1rem] border-2",
  md: "w-[1.5rem] h-[1.5rem] border-2",
  lg: "w-[2rem] h-[2rem] border-3",
};

// ✅ AFTER
const sizeClasses = {
  sm: "w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] border-[var(--border-width)]",
  md: "w-[var(--icon-size-md)] h-[var(--icon-size-md)] border-[var(--border-width)]",
  lg: "w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] border-[calc(var(--border-width)*1.5)]",
};
```

**In StaggeredLoading component (line 368):**
```tsx
// ❌ BEFORE
className="w-[0.5rem] h-[0.5rem] bg-[var(--color-primary)] rounded-[var(--radius-full)] animate-bounce"

// ✅ AFTER
className="w-[var(--icon-size-xs)] h-[var(--icon-size-xs)] bg-[var(--color-primary)] rounded-[var(--radius-full)] animate-bounce"
```

**In SkeletonList component (line 533):**
```tsx
// ❌ BEFORE
<div className="w-[2.5rem] h-[2.5rem] bg-[var(--bg-70)] rounded-[var(--radius-full)]" />

// ✅ AFTER
<div className="w-[var(--icon-size-xl)] h-[var(--icon-size-xl)] bg-[var(--bg-70)] rounded-[var(--radius-full)]" />
```

**In SmartLoading component (lines 412-413, 419, 426):**
```tsx
// ❌ BEFORE
<ExclamationCircleIcon className="w-[2rem] h-[2rem] text-[var(--color-error)] mx-auto mb-2" />
<ArrowPathIcon className="w-[1rem] h-[1rem]" />
<Spinner className="w-[2rem] h-[2rem] text-[var(--color-primary)] mx-auto" />

// ✅ AFTER
<ExclamationCircleIcon className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] text-[var(--color-error)] mx-auto mb-[var(--spacing-sm)]" />
<ArrowPathIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
<Spinner className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] text-[var(--color-primary)] mx-auto" />
```

**In DefaultLoading component (line 552):**
```tsx
// ❌ BEFORE
<Spinner className="w-[1.5rem] h-[1.5rem] text-[var(--color-primary)]" />

// ✅ AFTER
<Spinner className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-primary)]" />
```

---

## 📋 VERIFICATION CHECKLIST

Before submitting, verify:
- [ ] **CRITICAL**: Line 420 syntax error fixed
- [ ] Zero hardcoded sizes (search: `w-\[.*rem\]`, `h-\[.*rem\]`)
- [ ] Zero hardcoded border widths (search: `border-[0-9]`)
- [ ] Zero hardcoded margins (search: `mb-[0-9]`, `mr-[0-9]`, etc.)
- [ ] Code compiles: `bun run build`
- [ ] All exports have JSDoc comments

---

## 📤 SUBMISSION FORMAT

When done, post:

```
Task M04 REVISION COMPLETE - Fixed critical syntax error and token violations
Files: LoadingStates.tsx
Changes:
- Fixed CRITICAL syntax error on line 420
- Replaced 8 hardcoded sizes with icon size tokens
- Replaced 2 hardcoded border widths with tokens
- Replaced 1 hardcoded margin with token
Syntax errors: 0
Token violations: 0
Build status: ✅ PASSING
```
