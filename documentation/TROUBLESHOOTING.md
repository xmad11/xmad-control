# Troubleshooting Guide

This document contains solutions to common issues encountered during development and deployment of the Shadi platform.

---

## 📱 Mobile Refresh Loop Issue

### Problem Description
When testing the app on a mobile device using the local IP address (e.g., `http://192.168.1.193:3000`), the app continuously refreshes every 2 minutes or enters a non-stop refresh loop.

### Symptoms
- App loads initially
- After 2 minutes: refresh loop begins
- Sometimes refreshes non-stop immediately
- Only happens on mobile devices accessing via IP
- Does not occur on localhost or production

### Root Cause
**DHCP Lease Expiration + `allowedDevOrigins` Configuration**

1. **Router DHCP lease expires** → IP address changes
   - Old IP: `192.168.1.159`
   - New IP: `192.168.1.193`

2. **Next.js `allowedDevOrigins` blocks the new IP**
   - The old IP was in the allowed list
   - The new IP is not recognized
   - Next.js blocks cross-origin requests from the new IP
   - App cannot establish WebSocket connection for HMR
   - Result: Infinite refresh loop

### Failed Solutions (Do NOT Use)

❌ **Setting `allowedDevOrigins: ["*"]`**
```javascript
// next.config.mjs
const nextConfig = {
  allowedDevOrigins: ["*"],  // DOES NOT WORK as wildcard!
}
```
The `*` wildcard does NOT work for `allowedDevOrigins`. This was attempted by a previous agent and failed.

### The Actual Fix

✅ **Remove `allowedDevOrigins` entirely**

**Before:**
```javascript
const nextConfig = {
  allowedDevOrigins: ["*"],  // Blocking new IPs
}
```

**After:**
```javascript
const nextConfig = {
  experimental: {
    viewTransition: false,  // Also fixes mobile Safari AbortError
  },
  // No allowedDevOrigins - let Next.js warn instead of block
}
```

**Result:** Next.js now warns about origins instead of blocking them, allowing your app to work with any IP from your local network.

### Verification Steps

1. Check your current IP:
   ```bash
   # macOS
   ipconfig getifaddr en0

   # Windows
   ipconfig

   # Linux
   hostname -I
   ```

2. Access the app from mobile:
   ```
   http://YOUR_IP:3000
   ```

3. Expected behavior:
   - App loads without refresh loop
   - HMR (Hot Module Reload) works
   - No console errors about blocked origins

### Prevention

**For Development:**
- Keep `allowedDevOrigins` undefined or removed
- Use `viewTransition: false` in experimental config

**For Production:**
- This issue does NOT affect production deployments
- Production uses proper domain names, not IP addresses
- Vercel/production deployments have their own CORS configuration

---

## 🔴 Mobile Safari AbortError

### Problem Description
`Runtime AbortError: Skipping view transition` appears in console on mobile Safari.

### Root Cause
React 19's `ViewTransition` API conflicts with mobile Safari's implementation when using `router.back()` or other navigation actions.

### The Fix
Add to `next.config.mjs`:
```javascript
experimental: {
  viewTransition: false,
}
```

### Related Files
- `/app/layout.tsx` - Root layout
- `/features/restaurant/RestaurantDetailClient.tsx` - Uses `router.back()`

---

## 🌓 Theme Flash (Light Mode Shows Briefly)

### Problem Description
When navigating to dark or warm theme pages, a flash of light mode appears before the correct theme loads.

### Root Cause
React hydration happens AFTER initial render. Theme stored in `localStorage` isn't applied until React mounts, causing a flash.

### The Fix
Add `ThemeScript` in `app/layout.tsx` that runs BEFORE React hydration:

```tsx
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const mode = localStorage.getItem('themeMode') || 'light';
              const color = localStorage.getItem('themeAccentColor') || 'rust';
              document.documentElement.setAttribute('data-theme', mode);
              document.documentElement.classList.toggle('dark', mode === 'dark');

              const colors = {
                rust: 'oklch(0.58 0.15 50.0)',
                warm: 'oklch(0.65 0.15 50.0)',
                // ... all colors
              };
              if (colors[color]) {
                document.documentElement.style.setProperty('--color-brand-primary', colors[color]);
              }
            } catch (e) {
              console.error('Failed to apply theme:', e);
            }
          })();
        `,
      }}
    />
  )
}
```

### Implementation
Place in `<body>` BEFORE `<Providers>`:
```tsx
<body>
  <ThemeScript />
  <SkipLink />
  <Providers>{children}</Providers>
</body>
```

---

## 🖼️ Logo Color Flash (Black → White on Dark/Warm Mode)

### Problem Description
When app starts in dark or warm mode, the logo appears black first, then flashes to white color. This also happens when navigating between pages.

### Root Cause
Logo uses `invert` class applied conditionally via React state (`mode === "dark" ? "invert" : ""`). This only happens AFTER React hydration, causing a flash of incorrect color.

### The Fix
Move logo inversion to CSS based on `data-theme` attribute:

**Add to `/styles/tokens.css`:**
```css
/* Logo Inversion - Applied immediately based on data-theme (before React hydration) */
[data-theme="dark"] img[src*="/LOGO/"],
[data-theme="warm"] img[src*="/LOGO/"] {
  filter: invert(1);
}
```

**Remove React-state-based invert from components:**

❌ **Before (Wrong):**
```tsx
const logoClasses = `h-[var(--header-logo-size)] ${mode === "dark" ? "invert" : ""}`
```

✅ **After (Correct):**
```tsx
const logoClasses = `h-[var(--header-logo-size)]` // CSS handles it
```

### Files Updated
- `/styles/tokens.css` - Added CSS rules for logo inversion
- `/components/layout/Header.tsx` - Removed React-state-based invert
- `/components/layout/Footer.tsx` - Removed React-state-based invert
- `/features/restaurant/RestaurantDetailClient.tsx` - Removed React-state-based invert

### Result
Logo color is correct immediately when page loads, no flash of incorrect color.

---

## 🔙 Back Button Implementation

### Correct Pattern
Use the unified `BackButton` component from `@/components/navigation/BackButton`:

```tsx
import { BackButton } from "@/components/navigation/BackButton"

// Basic usage
<BackButton />

// With custom className
<BackButton className="fixed top-[calc(var(--header-total-height)+var(--spacing-md))]" />

// With custom onClick handler (default is router.back())
<BackButton onClick={() => router.push('/custom-path')} />
```

### Wrong Patterns (Do NOT Use)

❌ **Inline SVG in component:**
```tsx
<button onClick={() => router.back()}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="..." />
  </svg>
</button>
```

❌ **Creating multiple back button implementations**
- Use the single `BackButton` component
- Import from `@/components/navigation/BackButton`

### Icon Standards
All icons must use heroicons from `@/components/icons`:
```tsx
import { ArrowLeftIcon, StarIcon, MapPinIcon } from "@/components/icons"
```

---

## 🔌 Development Setup Issues

### Dev Server Not Accessible from Other Devices

**Symptoms:**
- Works on localhost:3000
- Cannot access from mobile/other devices via IP

**Solution:**

1. Ensure dev server binds to all interfaces:
   ```bash
   bun run dev
   ```

2. Check next.config.mjs has NO `allowedDevOrigins`

3. Verify firewall allows port 3000:
   ```bash
   # macOS
   sudo pfctl -d  # Temporarily disable firewall for testing
   ```

4. Check both devices are on same network

5. Use correct IP address (not localhost):
   ```
   http://192.168.1.XXX:3000
   ```

### Port Already in Use

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
bun run dev
```

---

## 🎨 Design Token Violations

### Common Spacing Mistakes

❌ **Hardcoded values:**
```tsx
<div className="p-3 mt-4 px-6">  // WRONG
```

✅ **Using design tokens:**
```tsx
<div className="p-[var(--spacing-xs)] mt-[var(--spacing-md)] px-[var(--page-padding-x)]">  // CORRECT
```

### Correct Top Spacing Token
For main content that needs to clear the header:
```tsx
<main className="pt-[var(--page-top-offset)]">
```

### Token Reference
See `/styles/tokens.css` for complete token definitions.

---

## 🖼️ Image 404 Errors

### Problem
Restaurant cards return 404 when clicked.

### Root Cause
Multiple mock data sources with different restaurant slugs.

### Solution
Ensure all imports use the same data source:
```tsx
// CORRECT - All restaurants exist here
import { mockRestaurants } from "@/__mock__/restaurants"

// WRONG - Different dataset
import { mockRestaurants } from "@/data/mocks"
```

### Verification
Check that the slug exists in `@/__mock__/restaurants.ts` before creating routes.

---

## 📊 Related Issues

### Service Worker Registration Issues
- **Issue:** `_sw_cleanup.ts` causing AbortError
- **Fix:** Disabled in `app/layout.tsx`
- **Status:** Service workers are NOT used in this PWA implementation

### HMR (Hot Module Reload) Not Working
- **Cause:** WebSocket connection blocked
- **Fix:** Remove `allowedDevOrigins` from config
- **Verify:** Check browser console for WebSocket errors

---

## 🚨 Emergency Quick Fixes

### App Immediately Refreshes on Mobile
```bash
# 1. Kill dev server
# 2. Check next.config.mjs - remove allowedDevOrigins
# 3. Restart server
bun run dev
```

### Theme Flashing on Page Load
- Verify `ThemeScript` is present in `app/layout.tsx`
- Ensure it's placed BEFORE `<Providers>`

### Images Not Loading
- Check image exists in correct path
- Verify `next.config.mjs` has correct `remotePatterns`
- Ensure using `OptimizedImage` component

---

## 📝 Checklist Before Deploying

- [ ] `allowedDevOrigins` removed from `next.config.mjs`
- [ ] `viewTransition: false` in experimental config
- [ ] `ThemeScript` present in root layout
- [ ] All inline SVGs replaced with heroicons
- [ ] All hardcoded spacing uses design tokens
- [ ] Back buttons use unified `BackButton` component
- [ ] No client components rendering `AppHeader`
- [ ] All imports use `@/__mock__/restaurants.ts`

---

## 🔍 Debug Mode

Enable detailed logging:
```tsx
// In app/layout.tsx
export const metadata = {
  debug: process.env.NODE_ENV === 'development',
}
```

Check browser console for:
- WebSocket connection errors
- Theme hydration warnings
- Navigation errors
- Failed resource loads

---

## 📞 Additional Resources

- **Design Tokens:** `/styles/tokens.css`
- **Component Documentation:** `/documentation/COMPONENT_INVENTORY.md`
- **Mobile-First Guide:** `/documentation/MOBILE_FIRST.md`
- **Testing Protocol:** `/documentation/TESTING_PROTOCOL.md`

---

**Last Updated:** 2026-01-06
**Related Issues:** Mobile refresh loop, DHCP IP changes, Next.js allowedDevOrigins
**Status:** ✅ Resolved
