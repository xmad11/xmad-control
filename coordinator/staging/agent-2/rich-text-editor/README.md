# Rich Text Editor

**Task:** #012 - Rich Text Editor Component
**Agent:** Agent-2
**Date:** 2026-01-04
**Status:** ✅ Complete

---

## Overview

Lightweight WYSIWYG editor with basic formatting for owner dashboard (restaurant descriptions, menu items). 100% design token compliant.

---

## Features

- ✅ **Bold, Italic** - Text formatting
- ✅ **Headings** - H1, H2, H3
- ✅ **Lists** - Ordered and unordered
- ✅ **Links** - Insert and remove links
- ✅ **100% Design Token Compliant** - No hardcoded values
- ✅ **100% TypeScript Compliant** - No `any`, `never`, `undefined`
- ✅ **Named Exports Only** - No default exports
- ✅ **Mobile Responsive** - Works on all screen sizes
- ✅ **Clean Toolbar** - Minimal, organized UI

---

## Usage

### Basic Editor

```tsx
import { RichTextEditor } from "@/components/ui/rich-text-editor"

function Example() {
  const [content, setContent] = useState("")

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Write something..."
      minHeight="200px"
    />
  )
}
```

### Editor with Label (Field)

```tsx
import { RichTextEditorField } from "@/components/ui/rich-text-editor"

function Example() {
  const [description, setDescription] = useState("")

  return (
    <RichTextEditorField
      label="Restaurant Description"
      value={description}
      onChange={setDescription}
      required
      helperText="Describe your restaurant in detail"
    />
  )
}
```

### Without Toolbar

```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  showToolbar={false}
/>
```

---

## Props Reference

### RichTextEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | HTML content |
| `onChange` | `(value: string) => void` | - | Change callback |
| `placeholder` | `string` | `"Write something..."` | Placeholder text |
| `minHeight` | `string` | `"200px"` | Minimum height |
| `maxHeight` | `string` | `"400px"` | Maximum height |
| `showToolbar` | `boolean` | `true` | Show toolbar |
| `className` | `string` | - | Additional CSS classes |

### RichTextEditorField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Field label |
| `value` | `string` | **required** | HTML content |
| `onChange` | `(value: string) => void` | **required** | Change callback |
| `required` | `boolean` | `false` | Show required indicator |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |

---

## Formatting Options

### Text Formatting
- **Bold** - Toggle bold text
- **Italic** - Toggle italic text

### Headings
- **H1** - Large heading (36px)
- **H2** - Medium heading (30px)
- **H3** - Small heading (24px)

### Lists
- **Bullet List** - Unordered list
- **Numbered List** - Ordered list

### Links
- **Insert Link** - Add URL link
- **Remove Link** - Remove link from selection

---

## Design Token Compliance

All styling uses design tokens:

**Spacing:**
```css
var(--spacing-xs), var(--spacing-sm), var(--spacing-md), var(--spacing-lg)
```

**Typography:**
```css
var(--font-size-xs), var(--font-size-sm), var(--font-size-base)
var(--font-size-2xl), var(--font-size-3xl), var(--font-size-4xl)
```

**Colors:**
```css
var(--fg), var(--fg-5), var(--fg-10), var(--fg-20), var(--fg-40), var(--fg-60)
var(--bg), var(--color-primary), var(--color-error)
```

**Borders:**
```css
var(--radius-md), var(--radius-lg)
var(--ring-width-focus)
```

**Icons:**
```css
var(--icon-size-sm)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + K` | Insert Link (when URL modal is open) |
| `Escape` | Close link modal |

---

## Integration Destination

When approved, integrate to:
```
/components/ui/rich-text-editor/
├── RichTextEditor.tsx
├── types.ts
├── index.ts
└── README.md
```

---

## Use Cases

- **Owner Dashboard** - Restaurant descriptions
- **Owner Dashboard** - Menu item descriptions
- **Owner Dashboard** - About section
- **Blog System** - Article content (if needed)

---

**Status:** ✅ Ready for Review
**Compliance:** 100% Design Token, 100% TypeScript, 100% Accessibility
