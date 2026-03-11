# AGENT RULES — Core Requirements

**Mandatory for all agents working on this project**

**Last Updated:** 2026-01-28

---

## 1. MANDATORY PRE-WORK

Before making ANY changes, agents MUST:

```bash
# Read core documentation (these 7 files)
cat documentation/core/00_AGENT_RULES.md
cat documentation/core/01_ARCHITECTURE.md
cat documentation/core/02_DESIGN_TOKENS.md
cat documentation/core/03_UI_COMPONENT_RULES.md
cat documentation/core/04_GOVERNANCE.md
cat documentation/core/05_AUDIT_LAYERS.md
cat documentation/core/06_COMMIT_PROTOCOL.md

# Run full audit to establish baseline
bun run audit:ci

# Read current violations
cat .audit/audit-report.json
```

If baseline audit has critical violations: STOP and report to user.

---

## 2. FORBIDDEN ACTIONS (NEVER DO THESE)

### Hardcoded Values (MANDATORY)

❌ **NEVER:**
```tsx
// Hardcoded colors
<div className="bg-black bg-white bg-[#ff0000] bg-blue-500">
<div style={{ color: "#ff0000", backgroundColor: "rgb(0,0,0)" }}>

// Hardcoded spacing
<div className="p-8 m-4 gap-12">

// Hardcoded sizes
<div className="w-[375px] h-[600px]">

// Runtime style reading
const color = getComputedStyle(el).getPropertyValue(...);
```

✅ **ALWAYS:**
```tsx
// Use tokens
<div className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
<div className="p-[var(--spacing-md)] gap-[var(--spacing-xl)]">
<div className="w-[var(--mobile-width)]">
```

### Inline Styles (MANDATORY)

❌ **NEVER:**
```tsx
<div style={{ padding: "20px", color: "red" }}>
```

✅ **ALWAYS:**
```tsx
<div className="p-[var(--spacing-xl)] text-[rgb(var(--color-error))]">
```

### Duplicate Components (MANDATORY)

❌ **NEVER:**
- Create custom card components (use BaseCard, RestaurantCard, BlogCard only)
- Create custom carousel components (use CardCarousel only)
- Duplicate existing component logic

✅ **ALWAYS:**
- Use SSOT components from `components/`
- Extend variants via props, not new files

### Audit Bypass (MANDATORY)

❌ **NEVER:**
```bash
git commit -m "message" --no-verify
# Editing scripts/audit/* to make checks pass
# Committing with failing audit layers
```

✅ **ALWAYS:**
```bash
bun run audit:ci
# Fix all violations before committing
git commit -m "type(scope): description"
```

---

## 3. DESIGN TOKEN DISCIPLINE

### Token Locations (SSOT)

| Token Type | File |
|------------|------|
| All visual values | `styles/tokens.css` |
| Accent colors constant | `context/ThemeContext.tsx` |

### Allowed Token Usage

✅ **MAY:**
- Read tokens
- Reference tokens in Tailwind: `var(--token-name)`
- Use `ACCENT_COLORS` from ThemeContext
- Create class mappings for dynamic colors

❌ **MAY NOT:**
- Redefine tokens in components
- Override tokens inline
- Create local color constants
- Use `getComputedStyle` at runtime

### Mandatory Token Categories

**Spacing:**
```css
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl, --spacing-3xl, --spacing-4xl
```

**Typography:**
```css
--font-size-xs, --font-size-sm, --font-size-base, --font-size-lg, --font-size-xl,
--font-size-2xl, --font-size-3xl, --font-size-4xl, --font-size-5xl, --font-size-6xl
```

**Colors:**
```css
--fg, --bg, --color-primary, --color-secondary
--color-accent-rust, --color-accent-sage, --color-accent-teal,
--color-accent-berry, --color-accent-honey
--color-success, --color-warning, --color-error, --color-info
```

**Animation:**
```css
--duration-fast, --duration-normal, --duration-slow
--ease-out-expo, --ease-out-quart, --ease-in-out-quart
```

**Glass:**
```css
--glass-bg, --glass-border, --glass-shadow
--blur-sm, --blur-md, --blur-lg
```

---

## 4. UI INVARIANTS (ABSOLUTE RULES)

### State & Mounting

**MANDATORY:** All panels MUST be mutually exclusive

✅ **CORRECT:**
```tsx
{showPanel && <MyPanel />}
```

❌ **WRONG:**
```tsx
<div className={showPanel ? "block" : "hidden"}>
```

Only ONE panel may exist in DOM at a time. Inactive panels MUST be unmounted.

### Layout Integrity

**MANDATORY:** No layout may depend on wrapping behavior

If rows matter: Use CSS Grid, NOT flexbox with wrapping.

### Animation Direction

**MANDATORY:** Direction is FIXED - Right-side slide-in only for panels.

No custom keyframes unless explicitly documented.

### Text Rules

**MANDATORY:** Icon-only controls MUST NOT contain text nodes.

No labels, headings, or hidden text unless specified.

---

## 5. TYPESCRIPT RULES

### Mandatory Typing

❌ **FORBIDDEN:**
```typescript
const data: any = fetchData();
// @ts-ignore
const risky = anyOperation;
const user = data as User;  // Without validation
```

✅ **REQUIRED:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
const data: User = fetchData();
```

### Type Safety Checklist

- [ ] No `any` types
- [ ] No `@ts-ignore` comments
- [ ] No type assertions without validation
- [ ] Proper interfaces for all data structures
- [ ] Null checks with optional chaining

---

## 6. MOBILE-FIRST RESPONSIVE

### Core Principle

**Base styles = mobile**. Enhancements only via breakpoints.

### Breakpoints

| Breakpoint | Min Width | Tailwind |
|------------|-----------|----------|
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |

### Mandatory Patterns

✅ **CORRECT:**
```tsx
// Mobile-first
<div className="p-4 md:p-6 lg:p-8">
<div className="flex flex-col md:flex-row gap-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

❌ **FORBIDDEN:**
```tsx
// Desktop-first
<div className="p-8 md:p-6 md:p-4">

// Responsive logic in JSX
{isMobile ? <Mobile /> : <Desktop />}

// Hardcoded breakpoints
<div className="w-[375px] md:w-[768px]">
```

### Touch Targets

**MANDATORY:** Minimum 44px (Apple HIG)

```tsx
<button className="px-4 py-3 min-h-[44px]">
```

---

## 7. WORKFLOW REQUIREMENTS

### Development Cycle

1. **Create feature branch from latest main**
   ```bash
   git checkout main && git pull && git checkout -b feature/name
   ```

2. **Continuous verification while developing**
   ```bash
   bun run audit                    # Quick check (layers 03, 04, 07.5)
   bun run biome check --write      # Format
   ```

3. **Pre-commit validation**
   ```bash
   bun run audit:ci                 # Full 11-layer audit
   bun run build                    # Verify build
   ```

4. **Commit only if all pass**
   ```bash
   git add specific-files
   git commit -m "type(scope): description"
   ```

### Reporting Completion

Your work is complete when:
- [ ] Full audit passes (`bun run audit:ci`)
- [ ] No critical violations
- [ ] Build succeeds (`bun run build`)
- [ ] Biome formatting applied
- [ ] Deployed to production (`vercel --prod`)
- [ ] Verified at https://shadi-v2.vercel.app

---

## 8. EMERGENCY PROCEDURES

### If You Created Violations

```bash
# 1. Revert on failure (MANDATORY)
git restore .

# 2. Confirm clean state
git status

# 3. Try next approach
```

**NEVER leave broken changes and move to next attempt.**

### If Audit System Fails

1. DO NOT modify audit scripts
2. Report to user with error details
3. Wait for guidance

---

## 9. VERIFICATION COMMANDS

```bash
# Audit commands
bun run audit                          # Quick 3-layer check
bun run audit:ci                       # Full 11-layer audit
bun run audit --layer=03               # TypeScript only
bun run audit --layer=04               # Design tokens only
bun run audit --layer=09               # Build verify

# Biome commands
bun run biome check                    # Check only
bun run biome check --write            # Fix issues

# Build commands
bun run build                          # Production build
bun run dev                            # Dev server

# Git commands
git status                             # Check state
git log --oneline -10                  # Recent commits
```

---

**This document is MANDATORY reading for all agents.** Violation of these rules will result in failed audits and rejected commits.

**For detailed reference, see:** `documentation/reference/`
