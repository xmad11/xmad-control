# UI SYSTEM — CANONICAL DOCUMENTATION

## 📖 Single Source of Truth

**All UI rules are now defined in:** `../DESIGN_SYSTEM_CANONICAL.md`

This document is the authoritative source for:
- Design tokens (colors, spacing, typography, shadows)
- Theme system (light, dark, warm modes)
- Component rules and protocols
- Page layout standards
- Responsive design (via tokens.css)
- Audit and enforcement rules

---

## 🚫 Deprecated Files

The following files have been consolidated into `DESIGN_SYSTEM_CANONICAL.md`:
- ~~CHANGE_CHECKLIST.md~~
- ~~COMPONENT_EDIT_RULES.md~~
- ~~DESIGN_TOKENS.md~~
- ~~THEME_SYSTEM.md~~
- ~~UI_INVARIANTS.md~~
- ~~UI_RULES.md~~

---

## 📁 Remaining Files

| File | Purpose |
|------|---------|
| `CHEATSHEET.html` | Token reference visual guide |
| `UI-cheatshaeet.html` | Alternative token reference |

---

## ✅ Quick Start

1. **Read:** `../DESIGN_SYSTEM_CANONICAL.md`
2. **Reference:** `styles/tokens.css` for token values
3. **Import:** `ACCENT_COLORS` from `context/ThemeContext.tsx`
4. **Build:** Use only token-based classes

---

> **Note:** This folder no longer contains multiple documentation files. All UI rules are consolidated in the canonical document above.
