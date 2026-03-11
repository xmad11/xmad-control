# 3D Marquee - Isolated Component

**Status**: 🔒 Archived - Not used in production
**Purpose**: 📦 Showcase/Portfolio demonstration
**Date**: 2026-01-22

---

## 📋 What This Is

This is an **isolated archive** of the 3D marquee system that was previously used in the main application. It has been removed from the production codebase to reduce complexity and improve performance.

---

## 🎯 Why It Was Removed

1. **Performance**: 3D transforms added unnecessary visual weight
2. **Simplicity**: Normal horizontal marquee is cleaner and faster
3. **Mobile**: 3D effects disabled on mobile anyway (responsive design)
4. **Maintenance**: Less code to maintain

---

## 📦 How To Use In Another Project

### Step 1: Copy Files

```bash
# Copy the CSS file to your project
cp marquee-3d.css your-project/styles/components/
```

### Step 2: Import in Your CSS

```css
/* In your main CSS file */
@import "./components/marquee-3d.css";
```

### Step 3: Copy Required Tokens

Add these tokens to your design tokens (or use the `:root` block from the file):

```css
:root {
  /* Spacing */
  --spacing-md: 1rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;

  /* Border radius */
  --radius-xl: 1rem;

  /* Background color */
  --bg: #ffffff;
}
```

### Step 4: Use the HTML Structure

```html
<div class="marquee-3d-container">
  <div class="marquee-3d-wrapper">
    <div class="marquee-col marquee-col-small">
      <!-- Cards here -->
      <div class="marquee-card">...</div>
      <div class="marquee-card">...</div>
    </div>
    <div class="marquee-col marquee-col-medium">
      <!-- Cards here -->
      <div class="marquee-card">...</div>
      <div class="marquee-card">...</div>
    </div>
    <div class="marquee-col marquee-col-large">
      <!-- Cards here -->
      <div class="marquee-card">...</div>
      <div class="marquee-card">...</div>
    </div>
  </div>
</div>
```

---

## 🎨 Features

- ✅ GPU-accelerated 3D transforms
- ✅ Depth perception with scale + brightness
- ✅ Responsive (disabled on mobile)
- ✅ Accessibility (respects `prefers-reduced-motion`)
- ✅ Smooth infinite scroll animations

---

## ⚠️ Important Notes

1. **No Dependencies**: This file is completely self-contained
2. **No Conflicts**: Uses specific class names that won't conflict
3. **Token-Based**: Requires design tokens to be defined
4. **Mobile-First**: 3D effects disabled below 1024px

---

## 📊 Technical Details

- **Lines of Code**: ~250 lines
- **Performance**: GPU accelerated (transform: translateZ, rotateZ)
- **Animation**: CSS keyframes with `linear` timing
- **Responsive**: Breakpoint at 1024px

---

## 🔧 Customization

### Adjust 3D Rotation

```css
:root {
  --marquee-rotate-z: 15deg; /* Change this value */
}
```

### Adjust Depth

```css
:root {
  --marquee-gap-tight: 0.75rem;   /* Small column */
  --marquee-gap-normal: 1.25rem;  /* Medium column */
  --marquee-gap-loose: 1.75rem;   /* Large column */
}
```

### Adjust Animation Speed

```css
:root {
  --marquee-3d-duration: 20s; /* Slower */
  --marquee-3d-duration: 15s; /* Faster */
}
```

---

## 📝 License

This component is part of the Shadi V2 project. You are free to use it in your own projects.

---

## 🤝 Contributing

This is an archived component and no longer maintained. Use as-is for your showcase projects.
