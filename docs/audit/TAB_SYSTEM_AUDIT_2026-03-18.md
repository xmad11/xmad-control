# TAB SYSTEM AUDIT - 2026-03-18

## Issues Reported
1. **Chat button has too much bottom space between it and the other 5 tabs**
2. **2nd (memory) and 4th (Screen) tabs when clicked show only half - top part visible, bottom half covered**

---

## ROOT CAUSES IDENTIFIED

### 1. COLLAPSED BUTTON VISIBILITY ISSUE (CRITICAL)

**Location:** `features/home/HomeClient.tsx` lines 132-176

**Problem:** The collapsed button uses `relative` positioning with `z-10`, but its gradient has `absolute` with `-inset-1`. When tabsExpand:
- The `relative` class makes it a stacking context issue
- The gradient (`-inset-1`) extends beyond the button's border
- This creates a visual artifact at the bottom of the button is cut off
- When collapsed, the gradient is visible,    - The expanded, the gradient is still there

**Evidence:**
```tsx
{/* Collapsed state - single floating button */}
<button
  className={`
    transition-all ease-out select-none
    ${tabsExpanded ? "opacity-0 scale-75 pointer-events-none absolute" : "opacity-100 scale-100"}
    relative p-3 rounded-xl
    ...
  before:absolute before:inset-0 before:rounded-xl
  before:bg-gradient-to-b before:from-white/20 before:to-transparent
```

**Why it2nd/4th tabs are affected:** These tabs have the longer labels ("Automation" = 10 chars, "Screen" = 6 chars). When these are active:
the expanded tab bar is taller due to label width, potentially causing layout shifts.

### 2. CHAT BUTTON SPACING

**Current:** `gap-1.5` between chat button and tabs
**Issue:** The user said "too much space" - may want less

### 3. Z-INDEX INCONSISTENCIES

| Location | Z-Index | Source |
|----------|--------|--------|
| Tab bar | 20 | Tailwind `z-20` |
| Chat FAB | 30 | `components/ui/ChatFab.tsx` |
| Glass sheet | 50 | Tailwind `z-50` |
| Theme Modal | 120 | CSS var `--z-theme-modal` |
| aiDockLayer.sheet | 120 | TypeScript token |

**Problem:** Mix of Tailwind utilities and CSS variables.

### 4. MOBILE VIEWPORT HEIGHT ISSUE

Using `100vh` on mobile browsers includes address bar height, causing elements at bottom to be cut off.

---

## RECOMMENDED FIXES

1. **Fix collapsed button:** Add `hidden` class when expanded instead of `opacity-0`
2. **Reduce chat button gap:** Change `gap-1.5` to `gap-1`
3. **Fix z-index:** Use CSS variable `--z-dock` consistently
4. **Use `100dvh`** instead of `100vh` for mobile compatibility

---

*Audit completed: 2026-03-18*
