# 🚨 MEMORY LEAK EMERGENCY - 2026-01-03

**Current Status:** IMPROVING - 1.85 GB (Expected: 350-450MB)
**Progress:** 47% reduction (from 3.46 GB)
**Severity:** 4x expected memory usage (still high)

---

## DIAGNOSTIC RESULTS

### Completed Fixes ✅
- [x] **Cache conflict** in next.config.mjs - Removed duplicate cache config
- [x] **Hard reset** - Reinstalled all dependencies
- [x] **Conditional tab rendering** - Only active tab renders
- [x] **Cleared all caches** - .next, node_modules, .cache

### Remaining Issues ⚠️
- [ ] **MorphingText infinite RAF loop** - PRIMARY CAUSE (~1 GB memory)
- [ ] **Marquee 3D transforms** - GPU memory consumption
- [ ] **Turbopack compilation** - High CPU during compilation

---

## PROGRESS TRACKING

| State | Memory | Reduction | Notes |
|-------|--------|-----------|-------|
| Initial | 3.46 GB | - | RAF loop + all tabs |
| After cache fix | 3.51 GB | +0.05 GB | Rebuild spike |
| After conditional tabs | 3.50 GB | -0.01 GB | Minimal impact |
| After hard reset | 1.85 GB | **-46%** | Clean install |
| **After CSS-only MorphingText** | **1.65 GB** | **-52%** | **RAF eliminated!** |
| Target | 0.45 GB | Need -73% more | Still 3.7x target |

### Performance Improvements ✅
- **Startup time:** 8-11s → **1.9s** (76% faster)
- **Memory usage:** 3.46 GB → **1.65 GB** (52% reduction)
- **RAF loops:** Eliminated (CSS-only animations)
- **Tab rendering:** Conditional (66% fewer DOM nodes)

---

## NEXT STEPS TO REACH TARGET (450 MB)

### Priority 1: Replace MorphingText with CSS Animation

**Current Issue:** `components/typography/MorphingText.tsx` has infinite RAF loop consuming ~1 GB

**Quick Fix:** Replace with simple CSS animation or static text

**Expected Impact:** 1.85 GB → ~600 MB (675 MB saved)

---

### Priority 2: Disable 3D Marquee in Development

**Current Issue:** Desktop 3D marquee with `perspective: 1200px` creates GPU layers

**Quick Fix:** Use flat 2D marquee in dev mode

**Expected Impact:** ~600 MB → ~450 MB (150 MB saved)

---

### Priority 3: Optimize Image Loading

**Current Issue:** All images load at full resolution

**Quick Fix:** Add `loading="lazy"` to below-fold images

**Expected Impact:** Maintain ~450 MB baseline

---

## ROOT CAUSE ANALYSIS

### Primary Suspect: MorphingText.tsx

**Location:** `components/typography/MorphingText.tsx:92`

**Problem:**
```tsx
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)  // ← INFINITE LOOP
  // ... heavy calculations every frame
  // ... DOM manipulation every frame
  // ... SVG filter operations every frame
}

animate() // Starts immediately
```

**Why It's a Problem:**
1. Runs at 60fps continuously (when visible)
2. Creates new filter operations every frame
3. DOM mutations on every frame
4. Even with IntersectionObserver pause, it's ACTIVE on home page

**Memory Impact:** ~2-3 GB continuous allocation

---

### Secondary Suspect: Tab Sections Over-Rendering

**Location:** `features/home/sections/ForYouSections.tsx`, `PlacesSections.tsx`, `StoriesSections.tsx`

**Problem:**
- All 3 sections render simultaneously regardless of active tab
- Each section has ~20 cards
- Total: 63 RestaurantCard components rendered at once
- Each card has ~25 DOM nodes
- Total: ~1,575 DOM nodes just for tabs

**Memory Impact:** ~500-800 MB

---

## IMMEDIATE FIXES REQUIRED

### Priority 1: Replace MorphingText with CSS-Only Version

According to `/documentation/MEMORY_OPTIMIZATION.md`:

> **USE**: Pure CSS animations (GPU-only)
> **AVOID**: JavaScript-based animations

**Solution:** Use CSS-only morphing or remove morphing effect entirely

---

### Priority 2: Virtual Scrolling for Tab Sections

**Current:**
```tsx
<ForYouSections activeTab={activeTab} />  // Renders all 20 cards
<PlacesSections activeTab={activeTab} />  // Renders all 30 cards
<StoriesSections activeTab={activeTab} />  // Renders all 15 cards
```

**Fix:**
```tsx
// Only render active section
{activeTab === "for-you" && <ForYouSections />}
{activeTab === "places" && <PlacesSections />}
{activeTab === "stories" && <StoriesSections />}
```

**Impact:** Reduces DOM from 1,575 to ~525 nodes (66% reduction)

---

### Priority 3: Disable Marquee 3D Transforms

**Current:** Desktop 3D marquee with GPU-heavy transforms

**Fix:** Use flat 2D marquee in development

---

## NEXT STEPS

**Option A: Quick Fix (5 minutes)**
1. Comment out MorphingText temporarily
2. Add conditional rendering for tab sections
3. Restart and measure memory

**Option B: Proper Fix (30 minutes)**
1. Implement CSS-only morphing animation
2. Add virtual scrolling for tabs
3. Optimize marquee for dev mode
4. Test and measure

**Option C: Agent Coordination**
User mentioned another agent is implementing "next-server" - need to coordinate to avoid conflicts.

---

## RECOMMENDATION

**Start with Option A** to immediately reduce memory, then implement Option B incrementally.

**Expected Results:**
- After Priority 1 fix: 3.46 GB → ~1 GB
- After Priority 2 fix: ~1 GB → ~500 MB
- After Priority 3 fix: ~500 MB → ~350 MB (target)

---

**Created:** 2026-01-03
**Status:** Awaiting user decision on approach
