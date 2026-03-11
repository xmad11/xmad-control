# CLAUDE.md — Project Rules & Instructions for AI Agents

> **Restaurant Platform 2025-2026 | Shadi Shawqi (@the.ss) | UAE Restaurant Reviews**
> **Next.js 16 + Tailwind 4 + Bun + TypeScript + Supabase**
>
> **Last Updated**: 2026-01-21 (Documentation restructure)
>
> **This is the authoritative source of truth for all agent behavior.**

---

## 📁 DOCUMENTATION STRUCTURE (NEW)

### Three Locations:

1. **`/docs/`** - Quick reference for daily development
   - Compressed, developer-friendly docs
   - Fast lookup for common tasks
   - Single source of truth for quick answers

2. **`/documentation/`** - Authoritative complete documentation
   - **REQUIRED READING** before any task
   - Audit system dependencies (DO NOT MOVE)
   - Complete detailed documentation

3. **`/archive/`** - Historical documentation (not committed to git)
   - Old implementation plans
   - Audit reports
   - Historical analyses

### Required Reading (Before ANY Task):

Read these files in `/documentation/`:
1. `DESIGN_SYSTEM_CANONICAL.md` - Design tokens and OKLCH colors
2. `GOVERNANCE.md` - Governance rules and enforcement
3. `ui/UI_INVARIANTS.md` - Absolute UI rules
4. `MOBILE_FIRST.md` - Responsive design principles
5. `git/GIT_PROTOCOL.md` - Git workflow and commit format

---

## TABLE OF CONTENTS

1. [CRITICAL: Revert on Failure Protocol](#1-critical-revert-on-failure-protocol-most-important)
2. [Documentation Rules](#2-documentation-rules)
3. [Zero-Trust Governance](#3-zero-trust-governance)
4. [Design Token Rules](#4-design-token-rules)
5. [TypeScript Rules](#5-typescript-rules)
6. [Mobile-First Responsive](#6-mobile-first-responsive)
7. [UI Invariants](#7-ui-invariants-absolute-rules)
8. [Git Protocol](#8-git-protocol)
9. [Vercel Deployment](#9-vercel-deployment)
10. [Biome - Linting & Formatting](#10-biome---linting--formatting)
11. [Audit & Verification](#11-audit--verification)
12. [Required Workflow](#12-required-workflow)
13. [Emergency Recovery](#13-emergency-recovery)
14. [Quick Reference](#14-quick-reference)

---

## 1. CRITICAL: REVERT ON FAILURE PROTOCOL (MOST IMPORTANT)

### The Golden Rule

**When an agent makes changes to fix an issue and testing shows it didn't work, the agent MUST revert ALL changes before trying the next approach.**

**NEVER leave broken changes and move to the next trial.**

### Example of Correct Behavior

```
ATTEMPT 1: Agent suspects image optimizer is causing issue
  1. Disable image optimizer
  2. Test - issue persists
  3. ❌ DON'T move to attempt 2 yet!
  4. ✅ REVERT: Re-enable image optimizer
  5. Confirm back to original state

ATTEMPT 2: Agent suspects PWA manifest is causing issue
  1. Modify PWA manifest
  2. Test - issue persists
  3. ❌ DON'T move to attempt 3 yet!
  4. ✅ REVERT: Restore PWA manifest
  5. Confirm back to original state

ATTEMPT 3: Agent tries different approach
  (Now working from clean state, not accumulated broken changes)
```

### Why This Is Critical

1. **Accumulated broken changes** make debugging impossible
2. **False assumptions** compound when changes stack
3. **Clean state** is required for proper diagnosis
4. **Revert is fast** - testing on broken code wastes hours

### How to Revert

```bash
# If changes are staged but not committed:
git restore .

# If changes were committed:
git reset --hard HEAD~1

# Always confirm clean state:
git status

# Should show: "nothing to commit, working tree clean"
```

### NEVER Do This

```
❌ "Well that didn't work, let me try something else"
   (leaves broken code in place)

❌ "I'll fix this later"
   (forgets about broken changes)

❌ "Let me stack changes until something works"
   (impossible to debug which change fixed/broke things)
```

### ALWAYS Do This

```
✅ Make assumption → Implement change → Test
✅ If test fails → Revert ALL changes → Confirm clean state
✅ Then → Make next assumption
```

---

## 2. DOCUMENTATION RULES

### 2.1 Documentation Location

**READ FROM**: `/documentation` folder

**DO NOT READ FROM**: `/docs` folder (used for temporary files only)

### 2.2 Ignore Tasks Folder

**IGNORE**: `/documentation/tasks/` folder

The tasks folder contains historical task documents that are NOT part of the authoritative documentation.

### 2.3 Trust Code, Not Documents

**CRITICAL RULE**: Don't believe audit reports or old documentation as absolute truth. Only trust actual code behavior.

- Audit reports may be outdated
- Issues in reports may already be solved
- Documents may not reflect current state
- **ONLY TRUST**: What you observe in the actual code

### 2.4 Required Reading Before Any Task

Before starting ANY task, you MUST read:

```bash
# Design system (colors, spacing, tokens)
cat documentation/DESIGN_SYSTEM_CANONICAL.md

# Governance (layer enforcement, phase locking)
cat documentation/GOVERNANCE.md

# UI rules (invariants, patterns)
cat documentation/ui/UI_INVARIANTS.md

# Mobile-first responsive rules
cat documentation/MOBILE_FIRST.md

# Agent instructions
cat documentation/AGENT_INSTRUCTIONS.md
```

### 2.5 Quick Reference

| File | Purpose |
|------|---------|
| `OWNER_CHEATSHEET.md` | Quick token reference |
| `DESIGN_SYSTEM_CANONICAL.md` | Complete design system |
| `GOVERNANCE.md` | Zero-trust layers, phase locking |
| `UI_INVARIANTS.md` | Absolute UI rules |
| `MOBILE_FIRST.md` | Responsive design principles |

---

## 3. ZERO-TRUST GOVERNANCE

### 3.1 Current Phase

**PHASE 2 (UI & Hardening)** - Active development

**PHASE 1 LOCKED** - No changes without explicit approval

**DATABASE CONTRACT LOCKED** - `lib/supabase/` is UNTOUCHABLE

### 3.2 Six Enforcement Layers

| Layer | What It Enforces | Mechanism |
|-------|-----------------|-----------|
| **Layer 0** | Documentation is truth | Hash verification |
| **Layer 1** | Phase progression | `scripts/verify-phase2.ts` |
| **Layer 2** | Design token discipline | `scripts/validate-all.ts` |
| **Layer 3** | Architectural boundaries | File location checks |
| **Layer 4** | State invariants | Panel mutual exclusivity |
| **Layer 5** | Security & environment | `scripts/env-guard.ts` |
| **Layer 6** | Git protocol | Pre-commit hooks |

### 3.3 What This System Does NOT Enforce

- Business logic complexity
- Third-party library security
- Legacy browser support
- External API availability

---

## 4. DESIGN TOKEN RULES

### 4.1 Single Source of Truth (SSOT)

**ALL design tokens live in**: `styles/tokens.css`

**Accents constant lives in**: `context/ThemeContext.tsx`

### 4.2 Color System (OKLCH)

```css
/* Brand Colors */
--color-brand-primary: oklch(0.65 0.16 45.0);   /* Terracotta Coral */
--color-brand-secondary: oklch(0.58 0.14 250.0); /* Serene Blue */

/* Accent Colors (5 options) */
--color-accent-rust: oklch(0.58 0.15 50.0);      /* Warmth, comfort */
--color-accent-sage: oklch(0.62 0.08 150.0);     /* Fresh, organic */
--color-accent-teal: oklch(0.55 0.12 220.0);     /* Sophisticated */
--color-accent-berry: oklch(0.52 0.18 350.0);    /* Sweet, indulgent */
--color-accent-honey: oklch(0.7 0.12 85.0);      /* Golden hour */

/* Theme-aware foreground/background */
--fg: ...;  /* Changes per theme mode */
--bg: ...;  /* Changes per theme mode */
```

### 4.3 Spacing Scale

```css
--spacing-xs:  0.25rem;  /* 4px */
--spacing-sm:  0.5rem;   /* 8px */
--spacing-md:  1rem;     /* 16px ← Most common */
--spacing-lg:  1.5rem;   /* 24px */
--spacing-xl:  2rem;     /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

### 4.4 Typography Scale

```css
--font-size-xs:   0.75rem;  /* 12px */
--font-size-sm:   0.875rem; /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg:   1.125rem; /* 18px */
--font-size-xl:   1.25rem;  /* 20px */
--font-size-2xl:  1.5rem;   /* 24px */
--font-size-3xl:  1.875rem; /* 30px */
--font-size-5xl:  3rem;     /* 48px */
```

### 4.5 ✅ CORRECT Usage

```tsx
// Using token reference in Tailwind
<div className="p-[var(--spacing-md)] gap-[var(--spacing-xl)]">

// Dynamic color with class mapping
const accentClasses = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};
```

### 4.6 ❌ FORBIDDEN Usage

```tsx
// NEVER - Inline styles
<div style={{ color: "#ff0000", padding: "20px" }}>

// NEVER - Hardcoded hex
<div className="bg-[#ff0000]">

// NEVER - Tailwind literals (use tokens instead)
<div className="bg-blue-500 p-8">

// NEVER - getComputedStyle
const color = getComputedStyle(el).getPropertyValue(...);
```

---

## 5. TYPESCRIPT RULES

### 5.1 ✅ CORRECT Typing

```typescript
// Define proper interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

function processUser(user: User): void {
  // ...
}
```

### 5.2 ❌ FORBIDDEN Patterns

```typescript
// NO any types
const data: any = fetchData();                    // ❌

// NO undefined without proper typing
const value: string | undefined = undefined;     // ⚠️ Use optional instead

// NO @ts-ignore
// @ts-ignore                                   // ❌
const risky = anyOperation;

// NO type assertions without validation
const user = data as User;                        // ❌
```

### 5.3 Type Safety Checklist

- [ ] No `any` types
- [ ] No `@ts-ignore` comments
- [ ] No type assertions without validation
- [ ] Proper interfaces for all data structures
- [ ] Null checks with optional chaining

---

## 6. MOBILE-FIRST RESPONSIVE

### 6.1 Core Principle

**Base styles = mobile**. Enhancements only via breakpoints.

### 6.2 Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| Mobile (default) | 0px | Phones |
| Tablet (`md:`) | 768px | Tablets |
| Desktop (`lg:`) | 1024px | Desktops |

### 6.3 ✅ CORRECT Patterns

```tsx
// Mobile-first: base is mobile, enhance up
<div className="p-4 md:p-6 lg:p-8">

// Stack mobile, row desktop
<div className="flex flex-col md:flex-row gap-4">

// 1 column mobile, 2 tablet, 4 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### 6.4 ❌ FORBIDDEN Patterns

```tsx
// Desktop-first: starts big, overrides down
<div className="p-8 md:p-6 md:p-4">              // ❌

// Responsive logic in JSX
{isMobile ? <Mobile /> : <Desktop />}           // ❌

// Hardcoded breakpoints
<div className="w-[375px] md:w-[768px]">        // ❌
```

### 6.5 Touch Targets

**Minimum**: 44px (Apple HIG)

```tsx
// ✅ Correct
<button className="px-4 py-3 min-h-[44px]">

// ❌ Too small
<button className="px-2 py-1">                  // ❌
```

---

## 7. UI INVARIANTS (ABSOLUTE RULES)

These rules are absolute. Breaking any invariant = invalid change.

### 7.1 State & Mounting

- All panels MUST be mutually exclusive
- Only ONE panel may exist in the DOM at a time
- Inactive panels MUST be unmounted (not hidden with CSS)

```tsx
// ✅ CORRECT - Conditional rendering
{showPanel && <MyPanel />}

// ❌ WRONG - Hidden with CSS
<div className={showPanel ? "block" : "hidden"}>
```

### 7.2 Token-Only Values

- NO hardcoded heights
- NO hardcoded widths
- NO hardcoded spacing
- NO hardcoded colors
- Only CSS variables / tokens allowed

### 7.3 Animations

- Direction is FIXED: Right-side slide-in only
- No custom keyframes unless explicitly documented
- Use built-in animations from tokens

### 7.4 Layout Integrity

- No layout may depend on wrapping behavior
- If rows matter, CSS Grid MUST be used
- Flex wrapping requires explicit size constraints

### 7.5 Text Rules

- Icon-only controls MUST NOT contain text nodes
- No labels, headings, or hidden text unless specified
- Icons are purely visual, require aria-label for accessibility

---

## 8. GIT PROTOCOL

### 8.1 Branch Creation

```bash
# ALWAYS create feature branch from latest main
git checkout main
git pull origin main
git checkout -b feature/descriptive-name

# Naming conventions:
# feature/add-language-switcher
# fix/auth-redirect-loop
# ui/update-hero-section
# refactor/database-connection

# NEVER commit directly to main
```

### 8.2 Commit Format

```
type(scope): brief description

Optional detailed explanation

Closes #123
```

**Types**: `feat:`, `fix:`, `ui:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`, `chore:`

**Examples**:
```
ui(header): remove hardcoded warm background color

feat(theme): add hydration guard to ThemeModal

fix(i18n): resolve language switching bug

feat(seo): update metadata for social sharing
```

### 8.3 Pre-Commit Hooks (Automatic)

This project uses **Husky** for git hooks. On every commit:

```bash
# 1. Biome formatting and linting
bun run biome check --write

# 2. Quick audit on staged files only
bun run scripts/audit-runner.ts --layer=03 --layer=04 --layer=07.5
```

If hooks fail, your commit is blocked. Fix the issues and try again.

### 8.4 Forbidden Git Operations

❌ NEVER:
- Commit directly to main
- Create branches from stale feature branches
- Use `git merge` without reviewing
- Force push to shared branches
- Mix unrelated changes in one commit
- Bypass pre-commit hooks: `git commit --no-verify`

### 8.5 Agent Safe Mode Checklist

Before any git operation:
- [ ] Am I on a feature branch? (NEVER main)
- [ ] Have I run `git status` recently?
- [ ] Am I committing node_modules or .next?
- [ ] Is my commit message clear?
- [ ] Is this one logical change?
- [ ] Has `bun run audit:ci` passed?
- [ ] Has `bun run build` passed?

---

## 9. VERCEL DEPLOYMENT

### 9.1 Production URL (PERMANENT)

```
https://shadi-v2.vercel.app
```

**This URL:**
- ✅ Never changes
- ✅ Always shows latest production deployment
- ✅ Is the ONLY URL to share with clients
- ✅ Works for social media previews

**DO NOT share preview URLs** like `shadi-v2-xyz123-ahmad-s-projects.vercel.app`

### 9.2 Vercel Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview (for testing)
vercel

# List recent deployments
vercel ls

# Open project in Vercel dashboard
vercel open

# Check environment variables
vercel env ls

# Set environment variable
vercel env add VARIABLE_NAME production
```

### 9.3 Vercel Project Configuration

- **Project Name:** shadi-v2
- **Organization:** ahmad-s-projects-7e32bc62
- **Framework:** Next.js 16.1.1 (Turbopack)
- **Build Command:** `bun run build`
- **Install Command:** `bun install`
- **Output Directory:** `.next`

### 9.4 Vercel Protection Settings (IMPORTANT)

**CRITICAL:** The following must be DISABLED for public access:

1. Go to: https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings
2. Under **Protection** tab:
   - ❌ Disable "Vercel Authentication"
   - ❌ Disable "Preview Authentication"
   - ❌ Disable "Password Protection"
3. Under **General** → **Visibility**:
   - ✅ Set to "Public"

**Clients should see the website directly, NOT a Vercel login prompt.**

### 9.5 Deployment Workflow

```bash
# 1. Create feature branch
git checkout main && git pull && git checkout -b feature/your-task

# 2. Make changes and verify
bun run audit:ci && bun run build

# 3. Commit changes
git add specific-files
git commit -m "type(scope): description"

# 4. Push to GitHub
git push origin feature/your-task

# 5. Deploy to Vercel
vercel --prod

# 6. Verify deployment
open https://shadi-v2.vercel.app
```

---

## 10. BIOME - LINTING & FORMATTING

### 10.1 Biome Commands

```bash
# Check all files (read-only)
bun run biome check

# Check and auto-fix
bun run biome check --write

# Check specific file
bun run biome check components/Header.tsx

# Format only (no linting)
bun run biome format --write

# Lint only (no formatting)
bun run biome lint
```

### 10.2 Biome Configuration

**File:** `biome.json`

Biome replaces ESLint/Prettier. Configuration is in `biome.json` at project root.

### 10.3 Pre-Commit Integration

Biome runs automatically before every commit via Husky hooks.

---

## 11. AUDIT & VERIFICATION

### 11.1 Two-Tier Audit System

**Quick Audit (Development):**
```bash
bun run audit
```
- Layers: 03 (TypeScript), 04 (Design Tokens), 07.5 (UI Normalization)
- Time: ~2 seconds
- Purpose: Fast feedback during development

**Full Audit (Pre-Commit & CI):**
```bash
bun run audit:ci
```
- Layers: All 11 layers (00-09)
- Time: ~15 seconds
- Purpose: Comprehensive verification

### 11.2 Complete Layer Reference

| Layer | Name | Checks | Critical | Time |
|-------|------|--------|----------|------|
| 00 | Pre-Flight | Environment, required files | ✅ | 0.1s |
| 01 | Documentation | Docs exist and current | ✅ | 0.1s |
| 02 | Architecture | Files in correct folders | ✅ | 0.2s |
| 03 | TypeScript | No `any`, proper typing | ✅ | 12s |
| 04 | Design Tokens | No hardcoded values | ✅ | 0.2s |
| 05 | Dependencies | No unauthorized packages | ⚠️ | 0.5s |
| 06 | Git Health | Clean history | ⚠️ | 0.3s |
| 07 | UI Responsive | Mobile-first | ⚠️ | 1s |
| 07.5 | UI Normalization | Consistent patterns | ✅ | 0.1s |
| 08 | Ownership | CODEOWNERS respected | ⚠️ | 0.5s |
| 09 | Build Verify | Project builds | ✅ | 25s |

### 11.3 Audit Commands

```bash
# Run specific layer
bun run audit --layer=03

# Run multiple layers
bun run audit --layer=03 --layer=04

# Auto-fix safe violations
bun run audit --layer=04 --fix

# List all layers
bun run audit --list
```

### 11.4 TRUST CODE, NOT AUDITS

**CRITICAL**: Audit reports may be outdated. Only trust actual code behavior.

### 11.5 When to Run

- **Before starting**: Establish baseline with `bun run audit:ci`
- **While developing**: Continuous verification with `bun run audit`
- **Before committing**: MUST pass full audit `bun run audit:ci`
- **After completing**: Generate completion report

### 11.6 Pre-Commit Checklist

- [ ] No hardcoded colors (hex/rgb in JSX)
- [ ] No inline styles (`style={{}}`)
- [ ] All spacing uses `--spacing-*`
- [ ] All typography uses `--font-size-*`
- [ ] No `any` types
- [ ] Biome formatting applied
- [ ] Tested in light, dark, and warm modes
- [ ] Full audit passes (`bun run audit:ci`)
- [ ] Build succeeds (`bun run build`)

---

## 12. REQUIRED WORKFLOW

### Before ANY Task

```bash
# 1. Read documentation
cat documentation/DESIGN_SYSTEM_CANONICAL.md
cat documentation/GOVERNANCE.md
cat documentation/ui/UI_INVARIANTS.md
cat documentation/MOBILE_FIRST.md

# 2. Run baseline audit
bun run audit:ci
cat .audit/audit-report.json

# 3. Create feature branch from latest main
git checkout main
git pull origin main
git checkout -b feature/your-task

# 4. Check for existing files
find . -name "filename" -type f
```

### During Implementation

1. Use design tokens for ALL visual values
2. Follow mobile-first responsive pattern
3. Maintain UI invariants
4. Run audit continuously while developing
5. **REVERT ON FAILURE** (see section 1)

### After EVERY Task

```bash
# 1. Run full audit
bun run audit:ci

# 2. Run biome formatting
bun run biome check --write

# 3. Build verification
bun run build

# 4. Show results
cat .audit/audit-report.json

# 5. Deploy to production
vercel --prod

# 6. Verify deployment
open https://shadi-v2.vercel.app
```

---

## 13. EMERGENCY RECOVERY

### 13.1 If Main is Corrupted

```bash
# Assess damage
git log --stat | head -20
git diff HEAD~5 HEAD

# Option A: Soft reset (keep changes)
git reset --soft <good-commit>

# Option B: Hard reset (discard changes)
git reset --hard <good-commit>
git push --force-with-lease origin main
```

### 13.2 If You Made Bad Changes

```bash
# Soft reset to keep work
git reset --soft HEAD~1

# Review and re-commit properly
git add specific-files
git commit -m "correct message"
```

### 13.3 Last Resort: Full Reset

```bash
# WARNING: Destroys all local changes
git fetch origin
git reset --hard origin/main
git clean -fd
```

---

## 14. QUICK REFERENCE

### Design Token Quick Reference

```tsx
// Colors
var(--color-accent-rust)
var(--fg) / var(--bg)

// Spacing
var(--spacing-md)
var(--spacing-xl)

// Typography
var(--font-size-base)
var(--font-size-5xl)

// Effects
var(--shadow-glass)
var(--blur-md)
var(--radius-2xl)
```

### Common Patterns

```tsx
// Button
<button className="
  bg-primary text-white
  px-[var(--spacing-2xl)] py-[var(--spacing-md)]
  rounded-[var(--radius-full)]
  hover:brightness-110 hover:scale-105
  transition-all
">

// Card
<div className="
  glass-card
  p-[var(--spacing-xl)]
  rounded-[var(--radius-2xl)]
">

// Responsive Grid
<div className="
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  gap-[var(--spacing-xl)]
">
```

### Dynamic Color Pattern

```tsx
import { ACCENT_COLORS, AccentColorKey } from "@/context/ThemeContext";

const accentClasses: Record<AccentColorKey, string> = {
  rust: "bg-accent-rust",
  sage: "bg-accent-sage",
  teal: "bg-accent-teal",
  berry: "bg-accent-berry",
  honey: "bg-accent-honey",
};

<div className={`${accentClasses[colorKey]} p-[var(--spacing-md)]`}>
```

### Revert on Failure (CRITICAL)

```bash
# When a fix attempt fails:
git restore .
git status  # Confirm clean
# Then try next approach
```

---

## SUMMARY: THE GOLDEN RULES

1. **REVERT ON FAILURE** - If changes don't fix the issue, revert before trying next approach
2. **TRUST CODE, NOT AUDITS** - Audit reports may be outdated, only trust actual code behavior
3. **USE DESIGN TOKENS** - NO hardcoded colors, spacing, or sizes
4. **MOBILE-FIRST** - Base styles = mobile, enhance with breakpoints
5. **PROPER TYPING** - NO `any` types, define proper interfaces
6. **READ DOCUMENTATION** - From `/documentation`, ignore `/tasks`
7. **ALWAYS AUDIT** - Run `bun run audit:ci` before committing
8. **FEATURE BRANCHES** - NEVER commit directly to main

---

**This document is the authoritative source of truth for all agent behavior.**

Violations of these rules will result in failed audits and broken builds.
