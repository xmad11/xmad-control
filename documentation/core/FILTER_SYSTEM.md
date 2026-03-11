# FILTER SYSTEM - Single Source of Truth

> **Authoritative documentation for restaurant filtering logic**
> **Last Updated**: 2026-01-28
> **Status**: 🔒 STABLE - Production-Grade

---

## Filter Semantics (AND/OR Logic)

### Core Rules

| Rule | Description |
|------|-------------|
| **Within Category** | OR logic - any selected option matches = pass |
| **Between Categories** | AND logic - all active categories must match |
| **Empty Category** | Ignored - no filtering applied |
| **Priority Sorting** | Total matches descending (more matches = higher rank) |

---

## Examples

### Example 1: Within Category (OR)
```typescript
selectedMeals = ["breakfast", "lunch"]

// Restaurant with "Breakfast" badge → PASS ✓
// Restaurant with "Lunch" badge → PASS ✓
// Restaurant with both → PASS ✓
// Restaurant with neither → FAIL ✗
```

### Example 2: Between Categories (AND)
```typescript
selectedMeals = ["breakfast"]
selectedCuisines = ["emirati"]

// Restaurant with breakfast + emirati → PASS ✓
// Restaurant with breakfast only → FAIL ✗
// Restaurant with emirati only → FAIL ✗
// Restaurant with neither → FAIL ✗
```

### Example 3: Empty Category (Ignored)
```typescript
selectedMeals = []
selectedCuisines = ["emirati"]

// Meal filter NOT applied (empty array)
// Only cuisine filter matters
// Restaurant with emirati cuisine → PASS ✓
```

### Example 4: Priority Sorting
```typescript
selectedMeals = ["breakfast", "lunch"]
selectedCuisines = ["emirati"]

// Restaurant A: matches 3 options → rank 1
// Restaurant B: matches 1 option → rank 2
```

---

## Type Architecture

### Domain Types (Data Layer)

```typescript
// Actual emirate locations from restaurant data
export type EmirateLocation =
  | "abu-dhabi"
  | "dubai"
  | "sharjah"
  | "ajman"
  | "umm-al-quwain"
  | "ras-al-khaimah"
  | "fujairah"

// Domain locations that appear in restaurant records
export type DomainLocation = EmirateLocation | "international"
```

### UI State Types (Presentation Layer)

```typescript
// UI filter selector includes sentinel values
export type LocationFilter = DomainLocation | "all" | "near-me"

// Legacy alias for backward compatibility
export type LocationOption = LocationFilter
```

### Strict Union Types

```typescript
// Category IDs - not loose "string"
export type CuisineCategoryId =
  | "famous"
  | "arabic"
  | "asian"
  | "international"
  | "cafe"

export interface CuisineCategory {
  id: CuisineCategoryId  // Strict type, not "string"
  label: string
  subcategories: CuisineOption[]
}
```

---

## Implementation Guidelines

### ✅ CORRECT Patterns

```typescript
// 1. Immutable sorting (preserve React references)
results = [...results].sort((a, b) => b.rating - a.rating)

// 2. Type-safe domain checks
if (location === "international") {
  results = results.filter((r) => !r.emirate)
} else if (location !== "all") {
  results = results.filter((r) => r.emirate === locationEmirateMap[location])
}

// 3. Derived state (no useEffect for filters)
const filteredRestaurants = useMemo(() => {
  // Filter logic here
}, [searchQuery, selectedMeals, selectedCuisines, selectedAtmospheres, sort])
```

### ❌ FORBIDDEN Patterns

```typescript
// 1. Mutable sorting (breaks React memoization)
results.sort((a, b) => b.rating - a.rating)  // ❌

// 2. Loose typing
interface Category { id: string }  // ❌

// 3. Domain/UI mixing
type Location = "all" | "abu-dhabi" | ...  // ❌ "all" is UI-only
```

---

## Filter Categories

| Category | Color | Options Count | Example |
|----------|-------|---------------|---------|
| Meal | Red (--filter-badge-meal) | 7 | breakfast, lunch, dinner |
| Cuisine | Green (--filter-badge-cuisine) | 25 | emirati, lebanese, italian |
| Atmosphere | Blue (--filter-badge-atmosphere) | 16 | romantic, family-friendly |
| Location | Purple (--filter-badge-location) | 10 | abu-dhabi, dubai, international |

---

## Related Files

| File | Purpose |
|------|---------|
| `components/filters/filterData.ts` | Filter option definitions and types |
| `lib/utils/filter-helpers.ts` | Shared filter utilities (not used in page) |
| `app/restaurants/page.tsx` | Filter implementation with useMemo |

---

## Sources

- [React Filtering Best Practices](https://react.dev/learn/you-might-not-need-an-effect)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Domain vs UI State Separation](https://martinfowler.com/bliki/PresentationDomainSeparation.html)
- [Search UX Patterns](https://www.nngroup.com/articles/filtering/)
- [Array Immutability in React](https://react.dev/learn/updating-arrays-in-state)

---

**This document is the Single Source of Truth for filter system behavior.**
**If code comments contradict this document, this document takes precedence.**
