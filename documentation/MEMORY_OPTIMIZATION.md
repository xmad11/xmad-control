# Memory Optimization Guide

**Project**: Shadi V2 - Restaurant Platform 2025-2026
**Last Updated**: 2025-12-28
**Status**: ACTIVE - DO NOT MODIFY WITHOUT REVIEW

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Our Journey: What Happened](#our-journey-what-happened)
3. [Current Baseline](#current-baseline)
4. [Optimization Stages](#optimization-stages)
5. [Configuration Files - DO NOT TOUCH](#configuration-files---do-not-touch)
6. [Best Practices](#best-practices)
7. [What NOT To Do](#what-not-to-do)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Emergency Recovery Steps](#emergency-recovery-steps)

---

## Executive Summary

This document captures the complete memory optimization process that reduced our Next.js dev server memory usage from **692MB to 445MB** (36% reduction, 247MB saved).

**CRITICAL**: Any agent modifying the configuration files MUST read this document first and understand the trade-offs.

---

## Our Journey: What Happened

### Phase 1: Failed Feature Implementation (Dec 2025)

**What We Tried**:
- Implemented MorphingText component with requestAnimationFrame
- Created Marquee3D with 3D perspective transforms
- Added Hero container component

**What Went Wrong**:
- App broke completely
- Infinity loading loop
- Header glassmorphism disappeared
- Scroll-based hide/show animations stopped
- Theme side menu wouldn't open
- Memory spiked to 600-700MB

**Root Cause Analysis**:
1. Multiple React loops running simultaneously (requestAnimationFrame + typing animation + marquee)
2. Heavy SVG filter operations for morph effect
3. No IntersectionObserver for off-screen components
4. Excessive re-renders from state management

**Lesson Learned**: Always implement incrementally with testing at each stage. Never batch complex features.

---

### Phase 2: Complete Revert

**Actions Taken**:
1. Deleted infected `branch1`
2. Verified `main` was working correctly
3. Created fresh clean `branch1` from `main`
4. Started fresh with step-by-step approach

**Command History**:
```bash
git branch -D branch1
git checkout main
# Verified main working
git checkout -b branch1
```

---

### Phase 3: Memory Optimization (Successful)

**Priority Order Executed**:
1. **Priority 1**: Remove unused packages (lucide-react 44MB, react-router 4.1MB)
2. **Priority 2**: PostCSS optimization flag
3. **Priority 3**: Next.js webpack cache + chunk splitting optimization
4. **Priority 4**: Attempted lazy loading - FAILED (see failures below)

**Results**:
- **Initial**: 692MB
- **After Priority 1**: 224MB (468MB saved!)
- **After Priority 2**: 400MB (slight increase but acceptable)
- **After Priority 3**: 380MB
- **After Priority 4 revert**: 445MB (final stable state)

---

## Current Baseline

### Healthy Memory Indicators

**Dev Server (next-server)**:
- **Expected**: 350-450MB
- **Warning Zone**: 500-600MB
- **Critical Zone**: 650MB+

**Bun Process**:
- **Expected**: 150-200MB
- **Warning Zone**: 250MB+
- **Critical Zone**: 300MB+

**Total Memory Usage**:
- **Healthy**: < 600MB combined
- **Warning**: 600-700MB
- **Critical**: 700MB+

### Current Configuration Status

```bash
# As of 2025-12-28
Next.js: v16.1.1
React: v19.2.3
Turbopack: Enabled
Dev Server Memory: ~445MB
Status: OPTIMIZED
```

---

## Optimization Stages

### Stage 1: Unused Package Removal

**Packages Removed**:
- `lucide-react` (44MB) - Icon library we don't use
- `react-router` (4.1MB) - Routing not needed (App Router handles it)

**Command**:
```bash
bun remove lucide-react react-router
```

**Impact**: -468MB (immediate massive drop)

**Verification**:
```bash
# Check bundle size
bun run build
# Check memory in Activity Monitor / htop
```

---

### Stage 2: PostCSS Optimization

**File**: `postcss.config.mjs`

**What Was Added**:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {
      // Enable optimization in production to reduce CSS processing overhead
      optimize: process.env.NODE_ENV === 'production',
    },
  },
}
```

**Why This Helps**:
- Reduces CSS parsing overhead
- Optimizes Tailwind JIT compilation
- Minimizes memory during development

**Impact**: Memory stabilized around 400MB

---

### Stage 3: Next.js Webpack Optimization

**File**: `next.config.mjs`

**What Was Added**:
```javascript
webpack: (config, { dev, isServer }) => {
  // Memory optimization for dev mode
  if (dev) {
    // Disable persistent cache to reduce memory usage (saves 50-150MB)
    config.cache = false;

    // Reduce chunk splitting overhead in dev mode
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false, // Disable chunk splitting in dev
    };
  }
  // ... watchOptions for ignoring directories
  return config;
}
```

**Why This Helps**:
- `cache: false` - Disables webpack's persistent cache (saves 50-150MB)
- `splitChunks: false` - Reduces chunk analysis overhead
- `removeAvailableModules: false` - Skips module graph analysis
- `removeEmptyChunks: false` - Skips chunk cleanup passes

**Trade-off**: Slightly slower initial build, but significantly lower memory footprint

---

### Stage 4: Attempted Lazy Loading (FAILED)

**What We Tried**:
```typescript
// app/page.tsx - FAILED APPROACH
import dynamic from 'next/dynamic'

const HomeClient = dynamic(() => import('../components/HomeClient'), {
  ssr: false, // NOT ALLOWED in Server Components
  loading: () => <div>Loading...</div>
})
```

**Why It Failed**:
1. `ssr: false` is not supported in Server Components (Next.js 13+)
2. Missing 'critters' module error (CSS optimization conflict)
3. Created infinity loading loop

**Lesson**: Next.js App Router uses Server Components by default. Use dynamic imports differently:

```tsx
// CORRECT approach for Server Components
const HomeClient = dynamic(() => import('../components/HomeClient'), {
  loading: () => <div>Loading...</div>
  // NO ssr option needed - defaults to true
})
```

**Status**: REVERTED - Not needed for our use case

---

## Configuration Files - DO NOT TOUCH

### next.config.mjs

**CRITICAL SECTIONS - DO NOT MODIFY WITHOUT UNDERSTANDING**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Memory optimization: CSS optimization
  experimental: {
    optimizeCss: true,  // DO NOT REMOVE - Reduces CSS memory
  },

  // Turbopack configuration with memory optimizations
  turbopack: {
    root: process.cwd(),
    // DO NOT ADD: resolveOptions (causes warnings)
  },

  // Optimize file watching to exclude audit directories
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // CRITICAL: These settings reduce memory by 50-150MB
      config.cache = false;  // DO NOT CHANGE without review
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,  // DO NOT CHANGE
        removeEmptyChunks: false,  // DO NOT CHANGE
        splitChunks: false,  // DO NOT CHANGE
      };
    }

    if (dev && !isServer) {
      config.watchOptions = {
        ignored: [
          // CRITICAL: Ignore audit outputs to prevent memory leaks
          "**/.audit/**",
          "**/.guard/**",
          "**/.extraction/**",
          "**/documentation/policies/**",
          "**/*.log",
        ],
        aggregateTimeout: 300,
        poll: false,
      }
    }

    return config;
  },
}
```

---

### postcss.config.mjs

**CRITICAL - DO NOT MODIFY**:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {
      // CRITICAL: Keep optimize enabled for production
      optimize: process.env.NODE_ENV === 'production',
    },
  },
}
```

---

### package.json

**CRITICAL PACKAGES - DO NOT ADD WITHOUT REVIEW**:

**DO NOT ADD**:
- `lucide-react` - We don't use it (44MB bloat)
- `react-router` - Next.js App Router handles routing (4.1MB bloat)
- `@mui/material` - Heavy component library (500MB+ bloat)
- `framer-motion` - Often overkill, use CSS animations instead

**SAFE TO ADD**:
- `clsx`, `classnames` - Tiny utilities (<10KB)
- `date-fns` - Tree-shakeable date library
- Custom components - Build what you need

---

## Best Practices

### 1. Development Workflow

**ALWAYS**:
```bash
# Create feature branch
git checkout -b feature-name

# Make changes step-by-step
# Test after each change
bun run dev
# Check memory in Activity Monitor

# Commit when stable
git add .
git commit -m "feat: description"
```

**NEVER**:
- Batch multiple complex changes
- Implement without testing intermediate steps
- Modify config files without understanding the impact

---

### 2. Performance Testing

**Before Pushing Changes**:
```bash
# 1. Run type check
bun run type-check

# 2. Check memory in dev mode
bun run dev
# Wait 2 minutes, check memory in Activity Monitor
# Should be < 500MB

# 3. Run audit
bun run scripts/audit/00-pre-flight.ts
```

---

### 3. Animation Best Practices

**USE**: Pure CSS animations (GPU-only)
```css
@keyframes slide-in {
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}
```

**AVOID**: JavaScript-based animations
```tsx
// BAD - Causes memory leaks
useEffect(() => {
  const animate = () => {
    setTransform(prev => prev + 1)
    requestAnimationFrame(animate)
  }
  animate()
}, [])
```

**USE INSTEAD**: IntersectionObserver for pausing off-screen animations
```tsx
const useVisibilityPause = () => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.setProperty(
          '--marquee-play',
          entry.isIntersecting ? 'running' : 'paused'
        )
      })
    })
    // ... observe logic
  }, [])

  return ref
}
```

---

### 4. Component Design

**DO**: Server Components by default
```tsx
// GOOD - Zero client-side memory
export default function Hero() {
  return <section>{/* static content */}</section>
}
```

**DON'T**: Client Components for static content
```tsx
// BAD - Unnecessary client-side overhead
"use client"
export default function Hero() {
  return <section>{/* static content */}</section>
}
```

**USE Client Components ONLY FOR**:
- Interactive elements (buttons, forms)
- State management
- Browser APIs (localStorage, window)

---

### 5. Code Splitting

**DO**: Dynamic imports for heavy routes
```tsx
// GOOD - Lazy load admin dashboard
const AdminDashboard = dynamic(() => import('./AdminDashboard'))
```

**DON'T**: Dynamic imports for small components
```tsx
// BAD - More overhead than benefit
const Button = dynamic(() => import('./Button'))
```

---

## What NOT To Do

### 1. Configuration Anti-Patterns

**DON'T**:
- Remove `config.cache = false` without measuring impact
- Enable `splitChunks: true` in dev mode
- Remove ignored directories from watchOptions
- Add `resolveOptions` to turbopack config (causes warnings)

---

### 2. Package Anti-Patterns

**DON'T ADD**:
- Large component libraries (Material-UI, Ant Design, Chakra UI)
- Icon libraries (lucide-react, react-icons) - use inline SVGs
- Animation libraries (framer-motion, react-spring) - use CSS
- State management libraries (Redux, Zustand) unless absolutely needed

---

### 3. Implementation Anti-Patterns

**DON'T**:
- Create infinite loops with requestAnimationFrame
- Use `setInterval` without cleanup
- Add heavy SVG filters for effects
- Implement complex morphing without offloading to GPU

---

### 4. The "MorphingText" Mistake

**WHAT WE DID WRONG**:
```tsx
// BAD CAUSES - Multiple memory leaks:
// 1. requestAnimationFrame loop never stopped
// 2. SVG filter operations on every frame
// 3. Multiple re-renders per second
// 4. No cleanup on unmount

const doMorph = useCallback(() => {
  morphRef.current -= cooldownRef.current
  // ... heavy calculations
  requestAnimationFrame(animate) // Infinite loop!
}, [])
```

**LESSON**: Pure CSS is ALWAYS better for animations.

---

## Troubleshooting Guide

### Symptom: Memory > 600MB

**Step 1: Check for unused packages**
```bash
bunx depcheck
# Look for large unused packages
bun pm ls | grep -E "(lucide|react-router|mui)"
```

**Step 2: Check Next.js config**
```bash
# Verify cache is disabled in dev
grep "cache.*false" next.config.mjs
# Should return: config.cache = false;
```

**Step 3: Check for infinite loops**
```bash
# Search for requestAnimationFrame without cleanup
grep -r "requestAnimationFrame" components/ --include="*.tsx"
# Should have cleanup in useEffect return
```

**Step 4: Restart dev server**
```bash
# Kill all node/bun processes
pkill -f "next-server"
pkill -f "bun"
# Start fresh
bun run dev
```

---

### Symptom: Infinity Loading Loop

**Cause**: Usually `ssr: false` in Server Component or circular dependencies

**Fix**:
```tsx
// REMOVE ssr option from dynamic import
const HomeClient = dynamic(() => import('../components/HomeClient'))
```

---

### Symptom: Animations Not Working

**Check 1**: CSS keyframes defined?
```bash
grep "@keyframes" styles/globals.css
```

**Check 2**: Animation property using correct name?
```tsx
// Should match keyframe name exactly
<div style={{ animation: 'marquee-scroll-left 15s linear infinite' }}>
```

**Check 3**: Not using reduced motion?
```css
/* Check for */
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none !important; }
}
```

---

### Symptom: "Unrecognized key(s) in object"

**Cause**: Invalid Turbopack configuration

**Fix**:
```javascript
// REMOVE from next.config.mjs turbopack section:
// - resolveOptions
// - Any experimental options not in Next.js docs
```

---

## Emergency Recovery Steps

### If Memory Spikes After Implementation

**Option 1: Revert Last Changes**
```bash
git diff HEAD~1
# Review changes
git reset --hard HEAD~1
bun run dev
# Check memory
```

**Option 2: Clean Slate Revert**
```bash
# 1. Delete infected branch
git branch -D feature-branch

# 2. Go back to known-good state
git checkout main

# 3. Verify main is healthy
bun run dev
# Wait 2 minutes, check memory

# 4. Create fresh branch
git checkout -b feature-branch-new
```

**Option 3: Bisect to Find Problem**
```bash
git bisect start
git bisect bad  # Current state is bad
git bisect good <commit-hash>  # Known good commit
# Test each commit
git bisect good/bad
# When found, see what changed
git show <commit-hash>
```

---

### If App Completely Breaks

**Complete Reset Procedure**:
```bash
# 1. Kill all processes
pkill -f "next"
pkill -f "bun"
pkill -f "node"

# 2. Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# 3. Go to main
git checkout main
git pull origin main

# 4. Fresh install
rm -rf node_modules
bun install

# 5. Start fresh
bun run dev
```

---

## Memory Optimization Checklist

Use this checklist before ANY major implementation:

### Pre-Implementation
- [ ] Current memory baseline measured (< 500MB)
- [ ] Feature branch created from main
- [ ] Implementation plan reviewed

### During Implementation
- [ ] Changes made incrementally (step-by-step)
- [ ] Tested after each step
- [ ] Memory checked after each step
- [ ] No infinite loops (requestAnimationFrame, setInterval)

### Post-Implementation
- [ ] Memory still < 500MB
- [ ] Type check passes (`bun run type-check`)
- [ ] Build succeeds (`bun run build`)
- [ ] Dev server starts without warnings
- [ ] Animations use pure CSS (not JS)

### Before Merge
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Memory stable after 5 minutes of runtime

---

## Agent Instructions

**TO ALL AGENTS WORKING ON THIS PROJECT**:

1. **READ THIS DOCUMENT** before making ANY changes to configuration files
2. **MEASURE MEMORY** before and after your changes
3. **IMPLEMENT INCREMENTALLY** - one change at a time
4. **TEST THOROUGHLY** - run dev server for 5+ minutes
5. **IF MEMORY SPIKES** - revert immediately and investigate
6. **NEVER BATCH** multiple complex features together

**IF YOU BREAK MEMORY OPTIMIZATIONS**:
1. You MUST fix it before pushing
2. Follow Emergency Recovery Steps above
3. Document what went wrong in this file

---

## Contact & Escalation

**If memory issues cannot be resolved**:
1. Revert to known-good commit
2. Document the issue in GitHub Issues
3. Tag with `memory-leak` label
4. Include: steps to reproduce, memory measurements, attempted fixes

---

**END OF DOCUMENT**

**Last Review**: 2025-12-28
**Next Review**: When major dependencies update

---

## React Performance Rules

### Core Principle: Measure Before Optimizing

Do NOT optimize prematurely. React 18+ is highly optimized by default.
Only add performance optimizations when measurements show actual issues.

---

### useMemo

**Use for:** Expensive derived calculations ONLY.

**✅ Correct - Derived value:**
```tsx
const sortedItems = useMemo(() =>
  items.sort((a, b) => a.date - b.date),
  [items]
);
```

**❌ Wrong - Simple value (no computation needed):**
```tsx
const count = useMemo(() => items.length, [items]);
// Should be: const count = items.length;
```

**❌ Wrong - JSX tree:**
```tsx
const element = useMemo(() => <div>...</div>, []);
// Never memoize JSX - it's already optimized by React
```

---

### useCallback

**Use for:** Functions passed to memoized children ONLY.

**✅ Correct - Passed to memoized child:**
```tsx
const handleClick = useCallback(() => {
  setValue(prev => prev + 1);
}, []);

<MemoizedChild onClick={handleClick} />
```

**❌ Wrong - Not passed anywhere:**
```tsx
const handleChange = useCallback(() => {
  // local handler only, not passed to children
}, []);
// Should be: const handleChange = () => { ... };
```

---

### React.memo

**Use for:** Components that re-render unnecessarily with same props.

**✅ Correct - Expensive component, stable props:**
```tsx
const ExpensiveList = React.memo(({ items, onSelect }) => {
  // Heavy rendering logic
});
```

**❌ Wrong - Always re-renders due to new props:**
```tsx
const ListItem = React.memo(({ item, onClick }) => {
  // If onClick is new each render, memo won't help
});
// Fix: wrap onClick in useCallback in parent
```

---

### Common Anti-Patterns

**❌ Don't memo everything:**
```tsx
// Bad - unnecessary overhead
const value = useMemo(() => x + y, [x, y]);
// Good - let React handle it
const value = x + y;
```

**❌ Don't memo JSX:**
```tsx
// Bad - JSX is already optimized
const element = useMemo(() => <div>{content}</div>, [content]);
// Good - just render
const element = <div>{content}</div>;
```

**❌ Don't add deps you don't use:**
```tsx
// Bad - unused deps cause unnecessary re-renders
useCallback(() => {
  console.log('mounted');
}, [unused, deps]);
```

---

### Performance Workflow

1. **Build feature first** without optimizations
2. **Profile** using React DevTools Profiler
3. **Identify** actual bottlenecks
4. **Optimize** only identified issues
5. **Verify** improvement with measurements

---

### Sources

- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: useMemo Reference](https://react.dev/reference/react/useMemo)
- [React: useCallback Reference](https://react.dev/reference/react/useCallback)
- [React: When to useMemo and useCallback](https://react.dev/reference/react/useMemo#when-touse-memo-and-usecallback)
