# GOVERNANCE SYSTEM - Shadi V2 Platform

**Zero-Trust Core Enforcement System**
**Last Updated:** 2026-01-10

---

## 🛡️ LAYERED ENFORCEMENT (Layers 0–6)

### Layer 0: Documentation Gate

**Documentation is the authoritative source of truth.**

- **Rules:** If a change contradicts documentation, it is invalid
- **Mechanism:** Documentation in `/documentation` folder defines all rules
- **Verification:** Agents must read core docs before making changes
- **Location:** `/documentation/AGENT_INSTRUCTIONS.md`, `/documentation/git/GIT_PROTOCOL.md`, `/documentation/ui/UI_INVARIANTS.md`

**Required Reading Before Any Task:**
1. `/documentation/DESIGN_SYSTEM_CANONICAL.md` - Design tokens and colors
2. `/documentation/GOVERNANCE.md` - This file, enforcement rules
3. `/documentation/ui/UI_INVARIANTS.md` - Absolute UI rules
4. `/documentation/MOBILE_FIRST.md` - Responsive design principles
5. `/documentation/git/GIT_PROTOCOL.md` - Git workflow and commit format

---

### Layer 1: Phase Locking

**Enforces chronological progression and directory ownership.**

- **Current Phase:** Phase 2 (UI & Hardening)
- **Enforcement:** Audit system verifies phase compliance
- **Locked Areas:**
  - `lib/supabase/` - Database contract is UNTOUCHABLE
  - Phase 1 completed features cannot be modified without approval

**Phase 2 Status:** ✅ Active
- Theme Infrastructure (localStorage, SSR-safe hydration)
- Core UI (Header, SideMenu, ThemeModal)
- Tailwind 4 Foundation
- i18n Support (5 languages: en, ar, hi, ur, fa)

---

### Layer 2: Design Token Discipline

**UI changes MUST use design tokens. No hardcoding allowed.**

- **Mechanism:** Audit Layer 04 (`--layer=04`) verifies no hardcoded values
- **Standard:** Tailwind 4 `@theme` in `styles/tokens.css` + `styles/globals.css`
- **Enforcement:** Pre-commit hooks run design token check

**Token System:**
```css
/* Colors */
--color-primary: oklch(0.65 0.16 45.0);
--color-accent-rust: oklch(0.58 0.15 50.0);
--color-accent-sage: oklch(0.62 0.08 150.0);

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Typography */
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
```

**Verification:**
```bash
bun run audit --layer=04
```

---

### Layer 3: Architectural Boundaries

**Files must stay within their designated responsibilities.**

| Location | Purpose | Rules |
|----------|---------|-------|
| `components/` | UI components only | No business logic |
| `lib/` | Business logic only | No UI components |
| `app/` | Next.js App Router | Follow file structure |
| `context/` | React Context providers | State management only |
| `lib/supabase/` | Database layer | **LOCKED** - No changes |

**Verification:**
```bash
bun run audit --layer=02
```

---

### Layer 4: State Invariants

**UI components must adhere to state rules.**

**Panel Rule:** Only ONE panel may be mounted at a time
- SideMenu, ThemeModal, SearchModal, etc.
- Use conditional rendering: `{showPanel && <Panel />}`
- NOT CSS hiding: `className={show ? 'block' : 'hidden'}`

**Theme Persistence:**
- Theme state persists via localStorage
- Must hydrate safely for SSR (no hydration mismatch)
- Use `suppressHydrationWarning` where needed

**Verification:**
```bash
bun run audit --layer=07.5
```

---

### Layer 5: Security & Environment

**Protection of secrets and process integrity.**

**Environment Variables:**
```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Platform
NEXT_PUBLIC_SITE_URL=https://shadi-v2.vercel.app
```

**Vercel Protection Settings:**
- ❌ DISABLE "Vercel Authentication"
- ❌ DISABLE "Preview Authentication"
- ❌ DISABLE "Password Protection"
- ✅ Set visibility to "Public"

**Location:** https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings

---

### Layer 6: Git & CI Protocol

**Branching, commits, and deployment rules.**

**Branch Strategy:**
- `main` - Production, protected, no direct commits
- `feature/*` - Feature branches from main
- `fix/*` - Bug fix branches
- `ui/*` - UI-only changes

**Commit Format:**
```
type(scope): brief description

Details.

Closes #123
```

**Types:** `feat`, `fix`, `ui`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`

**Pre-Commit Hooks (Automatic):**
```bash
# Runs on every commit:
1. bun run biome check --write      # Format and lint
2. bun run audit --layer=03 --layer=04 --layer=07.5  # Quick audit
```

**Deployment:**
```bash
# Production (permanent URL)
vercel --prod

# Result: https://shadi-v2.vercel.app
```

**Full Documentation:** `/documentation/git/GIT_PROTOCOL.md`

---

## 📊 AUDIT SYSTEM

### Two-Tier Audit

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

### Complete Layer Reference

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

**Full Documentation:** `/documentation/AGENT_INSTRUCTIONS.md`

---

## 🔧 BIOME - Linting & Formatting

**Biome replaces ESLint/Prettier.**

**Commands:**
```bash
bun run biome check              # Check only
bun run biome check --write      # Fix issues
bun run biome format --write     # Format only
```

**Configuration:** `biome.json`

**Pre-Commit Integration:**
- Runs automatically before commit
- Blocks commit if critical issues found
- Auto-fixes safe issues

---

## 🚀 DEPLOYMENT - VERCEL

**Production URL (Permanent):**
```
https://shadi-v2.vercel.app
```

**Project Configuration:**
- **Name:** shadi-v2
- **Organization:** ahmad-s-projects-7e32bc62
- **Framework:** Next.js 16.1.1 (Turbopack)
- **Build:** `bun run build`
- **Install:** `bun install`

**Vercel Commands:**
```bash
vercel --prod                    # Deploy to production
vercel ls                        # List deployments
vercel env ls                    # List environment variables
```

**IMPORTANT:** Do NOT share preview URLs. Always share `https://shadi-v2.vercel.app`.

---

## 🚦 PROJECT STATUS

### Phase 2: UI & Hardening ✅ Active

**Delivered:**
- ✅ Theme infrastructure (5 accent colors, localStorage persistence)
- ✅ Core UI components (Header, SideMenu, ThemeModal)
- ✅ Tailwind 4 with design tokens
- ✅ i18n support (5 languages: English, Arabic, Hindi, Urdu, Persian)
- ✅ Biome linting and formatting
- ✅ 11-layer audit system
- ✅ Pre-commit hooks (Husky)
- ✅ Vercel deployment pipeline

**Locked:**
- ❌ Database contract (`lib/supabase/`) - UNTOUCHABLE
- ❌ Phase 1 completed features - Need approval to modify

---

## 🛑 WHAT THIS SYSTEM DOES NOT ENFORCE

**Out of Scope:**
- Business logic complexity - We enforce structure, not cleverness
- Third-party security - We trust fixed versions
- Legacy browser support - Modern browsers only (Evergreen)
- External API availability - Assume Vercel/Supabase are operational

---

## 📚 DOCUMENTATION STRUCTURE

### Core Documentation (Single Source of Truth)

```
/documentation/
├── AGENT_INSTRUCTIONS.md     # Main agent guide with audit/biome/git
├── DESIGN_SYSTEM_CANONICAL.md # Complete design system reference
├── GOVERNANCE.md              # This file - enforcement layers
├── MOBILE_FIRST.md            # Responsive design principles
├── ui/
│   └── UI_INVARIANTS.md       # Absolute UI rules
└── git/
    └── GIT_PROTOCOL.md        # Git workflow and deployment
```

### Ignore (Not Authoritative)

```
/documentation/tasks/   # Historical task documents
/docs/                  # Temporary files
```

---

## ✅ COMPLIANCE CHECKLIST

Before committing or deploying:

- [ ] Read core documentation (5 files)
- [ ] Created feature branch from `main`
- [ ] Full audit passes: `bun run audit:ci`
- [ ] Build succeeds: `bun run build`
- [ ] Biome formatting applied: `bun run biome check --write`
- [ ] Commit message follows format: `type(scope): description`
- [ ] No sensitive data committed
- [ ] Deployed to production: `vercel --prod`
- [ ] Verified at: `https://shadi-v2.vercel.app`

---

## 🎯 KEY REMINDERS

1. **Documentation is truth** - Check `/documentation` first
2. **Use feature branches** - Never commit to `main` directly
3. **Run audit before committing** - `bun run audit:ci`
4. **Design tokens only** - No hardcoded values
5. **Production URL is permanent** - `https://shadi-v2.vercel.app`
6. **Trust the system** - Audit, Biome, hooks are your allies

---

**This governance system maintains code quality and prevents issues from reaching production.**
