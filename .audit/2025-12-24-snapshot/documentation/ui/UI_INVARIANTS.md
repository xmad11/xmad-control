# UI INVARIANTS (DO NOT BREAK)

These rules are absolute.

## 1. State & Mounting
- All panels MUST be mutually exclusive
- Only ONE panel may exist in the DOM at a time
- Inactive panels MUST be unmounted (not hidden)

## 2. Tokens
- NO hardcoded:
  - heights
  - widths
  - spacing
  - colors
- Only CSS variables / tokens are allowed

## 3. Animations
- Direction is FIXED:
  - Right-side slide-in only
- No custom keyframes unless explicitly documented

## 4. Layout Integrity
- No layout may depend on wrapping behavior
- If rows matter, CSS Grid MUST be used

## 5. Text Rules
- Icon-only controls MUST NOT contain text nodes
- No labels, headings, or hidden text unless specified

Breaking any invariant = invalid change.

Source:
UI invariants are required to prevent regression in component-driven systems
