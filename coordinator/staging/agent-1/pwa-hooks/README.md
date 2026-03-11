# M01: PWA Hooks & Infrastructure Migration

**Status:** ❌ REVISION REQUIRED
**Priority:** 🔴 CRITICAL
**Reviewed:** 2026-01-04 15:00
**Violations Found:** 12 TypeScript violations

---

## 🚨 REVISION REQUIRED - CRITICAL VIOLATIONS

### TypeScript Violations Found:

**File: usePWA.ts (6 violations)**
- Line 299: `useState<any[]>([])` - Need proper interface
- Line 307: `async (action: any)` - Need proper interface
- Line 345: `useState<any[]>([])` - Need proper interface
- Line 353: `async (restaurant: any)` - Need proper interface
- Line 387: `useState<any[]>([])` - Need proper interface
- Line 401: `async (newRestaurants: any[])` - Need proper interface

**File: utils.ts (multiple violations)**
- Line 6: `/* eslint-disable @typescript-eslint/no-explicit-any */` - REMOVE THIS
- Lines 31, 71, 135, 305, 497, 498, 499: `as any` - Need proper type assertions
- Lines 353, 372, 391, 409: Function parameters with `any` - Need generics

---

## ✅ HOW TO FIX

### Step 1: Define Proper Interfaces

Add these interfaces at the top of `usePWA.ts`:

```typescript
/**
 * Pending offline action
 */
interface PendingAction {
  id: string;
  type: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

/**
 * Restaurant data
 */
interface Restaurant {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

/**
 * Cached restaurant data
 */
interface CachedRestaurant extends Restaurant {
  lastUpdated: number;
}
```

### Step 2: Replace all `any` types in usePWA.ts

```typescript
// ❌ BEFORE - Line 299
const [pendingActions, setPendingActions] = useState<any[]>([]);

// ✅ AFTER
const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

// ❌ BEFORE - Line 307
const addPendingAction = useCallback(async (action: any) => {

// ✅ AFTER
const addPendingAction = useCallback(async (action: PendingAction) => {

// ❌ BEFORE - Line 345
const [favorites, setFavorites] = useState<any[]>([]);

// ✅ AFTER
const [favorites, setFavorites] = useState<Restaurant[]>([]);

// ❌ BEFORE - Line 353
const addFavorite = useCallback(async (restaurant: any) => {

// ✅ AFTER
const addFavorite = useCallback(async (restaurant: Restaurant) => {

// ❌ BEFORE - Line 387
const [restaurants, setRestaurants] = useState<any[]>([]);

// ✅ AFTER
const [restaurants, setRestaurants] = useState<CachedRestaurant[]>([]);

// ❌ BEFORE - Line 401
const cacheRestaurants = useCallback(async (newRestaurants: any[]) => {

// ✅ AFTER
const cacheRestaurants = useCallback(async (newRestaurants: Restaurant[]) => {
```

### Step 3: Fix utils.ts

**Remove the ESLint disable comment:**
```typescript
// ❌ REMOVE THIS LINE (Line 6)
/* eslint-disable @typescript-eslint/no-explicit-any */
```

**Add proper type extensions:**
```typescript
/**
 * Window with standalone property (iOS Safari)
 */
interface WindowWithStandalone extends Window {
  standalone?: boolean;
}

/**
 * Navigator with network connection info
 */
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}
```

**Replace `as any` with proper types:**
```typescript
// ❌ BEFORE - Line 31
(window.navigator as any).standalone

// ✅ AFTER
(window.navigator as WindowWithStandalone).standalone

// ❌ BEFORE - Lines 497-499
(navigator as any).connection ||
(navigator as any).mozConnection ||
(navigator as any).webkitConnection

// ✅ AFTER
(navigator as NavigatorWithConnection).connection
```

**Use generics for IndexedDB methods:**
```typescript
// ❌ BEFORE
async add(storeName: string, data: any): Promise<void>
async update(storeName: string, data: any): Promise<void>
async get(storeName: string, id: string | number): Promise<any>
async getAll(storeName: string): Promise<any[]>

// ✅ AFTER
async add<T = unknown>(storeName: string, data: T): Promise<void>
async update<T = unknown>(storeName: string, data: T): Promise<void>
async get<T = unknown>(storeName: string, id: string | number): Promise<T>
async getAll<T = unknown>(storeName: string): Promise<T[]>
```

---

## 📋 VERIFICATION CHECKLIST

Before submitting, verify:
- [ ] Zero `any` types in usePWA.ts (search: `\bany\b`)
- [ ] Zero `any` types in utils.ts (search: `\bany\b`)
- [ ] Removed `/* eslint-disable @typescript-eslint/no-explicit-any */`
- [ ] All `as any` replaced with proper types
- [ ] Code compiles: `bun run build`
- [ ] All exports have JSDoc comments

---

## 📤 SUBMISSION FORMAT

When done, post:

```
Task M01 REVISION COMPLETE - Fixed all TypeScript violations
Files: usePWA.ts, utils.ts
Changes:
- Defined 4 proper interfaces (PendingAction, Restaurant, CachedRestaurant, etc.)
- Fixed 6 any types in usePWA.ts
- Fixed 6 any types in utils.ts
- Removed eslint-disable comment
- Replaced all as any with proper type assertions
TypeScript violations: 0
Build status: ✅ PASSING
```
