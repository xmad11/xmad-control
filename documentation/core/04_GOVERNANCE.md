# GOVERNANCE — Enforcement System

**Layered enforcement for code quality and project integrity**

**Last Updated:** 2026-01-28

---

## 1. LAYERED ENFORCEMENT (Layers 0–6)

### Layer 0: Documentation Gate

**Documentation is the authoritative source of truth.**

**Rules:**
- If a change contradicts documentation, it is invalid
- Agents must read core docs before making changes

**Required Reading (Before ANY Task):**
1. `documentation/core/00_AGENT_RULES.md`
2. `documentation/core/01_ARCHITECTURE.md`
3. `documentation/core/02_DESIGN_TOKENS.md`
4. `documentation/core/03_UI_COMPONENT_RULES.md`
5. `documentation/core/04_GOVERNANCE.md` (this file)
6. `documentation/core/05_AUDIT_LAYERS.md`
7. `documentation/core/06_COMMIT_PROTOCOL.md`

---

### Layer 1: Phase Locking

**Current Phase:** Phase 2 (UI & Hardening)

**Locked Areas (NO changes without approval):**
- `lib/supabase/` — Database contract is UNTOUCHABLE
- `types/database.ts` — Database types are UNTOUCHABLE
- Phase 1 completed features

**Active Development:**
- Theme infrastructure (localStorage, SSR-safe hydration)
- Core UI (Header, SideMenu, ThemeModal)
- Tailwind 4 Foundation
- i18n Support (5 languages: en, ar, hi, ur, fa)

---

### Layer 2: Design Token Discipline

**UI changes MUST use design tokens. No hardcoding allowed.**

**Mechanism:** Audit Layer 04 (`--layer=04`) verifies no hardcoded values

**Standard:**
- Tailwind 4 `@theme` in `styles/tokens.css`
- `styles/globals.css` for theme wiring
- `context/ThemeContext.tsx` for ACCENT_COLORS

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
| `types/database.ts` | Database types | **LOCKED** - No changes |

**Verification:**
```bash
bun run audit --layer=02
```

---

### Layer 4: State Invariants

**UI components must adhere to state rules.**

### Panel Rule (MANDATORY)

**Only ONE panel may be mounted at a time**

- Components: SideMenu, ThemeModal, SearchModal, etc.
- Use conditional rendering: `{showPanel && <Panel />}`
- NOT CSS hiding: `className={show ? 'block' : 'hidden'}`

**Verification:**
```bash
bun run audit --layer=07.5
```

### Theme Persistence

- Theme state persists via localStorage
- Must hydrate safely for SSR (no hydration mismatch)
- Use `suppressHydrationWarning` where needed

---

### Layer 5: Security & Environment

### Environment Variables (Required)

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Platform
NEXT_PUBLIC_SITE_URL=https://shadi-v2.vercel.app
```

### Vercel Protection Settings (IMPORTANT)

**CRITICAL:** The following must be DISABLED for public access:

1. Go to: https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings
2. Under **Protection** tab:
   - ❌ Disable "Vercel Authentication"
   - ❌ Disable "Preview Authentication"
   - ❌ Disable "Password Protection"
3. Under **General** → **Visibility**:
   - ✅ Set to "Public"

**Clients should see the website directly, NOT a Vercel login prompt.**

---

### Layer 6: Git & CI Protocol

**Branching, commits, and deployment rules.**

### Branch Strategy

- `main` — Production, protected, no direct commits
- `feature/*` — Feature branches from main
- `fix/*` — Bug fix branches
- `ui/*` — UI-only changes

### Commit Format

```
type(scope): brief description

Details.

Closes #123
```

**Types:** `feat`, `fix`, `ui`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`

**See:** `documentation/core/06_COMMIT_PROTOCOL.md`

---

## 2. AUDIT SYSTEM

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

**See:** `documentation/core/05_AUDIT_LAYERS.md` for detailed audit requirements

---

## 3. BIOME - Linting & Formatting

**Biome replaces ESLint/Prettier.**

### Commands

```bash
bun run biome check              # Check only
bun run biome check --write      # Fix issues
bun run biome format --write     # Format only
bun run biome lint               # Lint only
```

### Configuration

**File:** `biome.json`

### Pre-Commit Integration

Biome runs automatically before every commit via Husky hooks.

- Runs automatically before commit
- Blocks commit if critical issues found
- Auto-fixes safe issues

---

## 4. DEPLOYMENT - VERCEL

### Production URL (PERMANENT)

```
https://shadi-v2.vercel.app
```

**This URL:**
- ✅ Never changes
- ✅ Always shows latest production deployment
- ✅ Is the ONLY URL to share with clients
- ✅ Works for social media previews

**DO NOT share preview URLs** like `shadi-v2-xyz123-ahmad-s-projects.vercel.app`

### Vercel Commands

```bash
vercel --prod                    # Deploy to production
vercel ls                        # List deployments
vercel env ls                    # List environment variables
```

### Project Configuration

- **Name:** shadi-v2
- **Organization:** ahmad-s-projects-7e32bc62
- **Framework:** Next.js 16.1.1 (Turbopack)
- **Build:** `bun run build`
- **Install:** `bun install`

---

## 5. PROJECT STATUS

### Phase 2: UI & Hardening ✅ Active

**Delivered:**
- ✅ Theme infrastructure (5 accent colors, localStorage persistence)
- ✅ Core UI components (Header, SideMenu, ThemeModal)
- ✅ Tailwind 4 with design tokens
- ✅ i18n support (5 languages)
- ✅ Biome linting and formatting
- ✅ 11-layer audit system
- ✅ Pre-commit hooks (Husky)
- ✅ Vercel deployment pipeline

**Locked:**
- ❌ Database contract (`lib/supabase/`) — UNTOUCHABLE
- ❌ Phase 1 completed features — Need approval to modify

---

## 6. WHAT THIS SYSTEM DOES NOT ENFORCE

**Out of Scope:**
- Business logic complexity — We enforce structure, not cleverness
- Third-party security — We trust fixed versions
- Legacy browser support — Modern browsers only (Evergreen)
- External API availability — Assume Vercel/Supabase are operational

---

## 7. COMPLIANCE CHECKLIST

Before committing or deploying:

- [ ] Read core documentation (7 files in `documentation/core/`)
- [ ] Created feature branch from `main`
- [ ] Full audit passes: `bun run audit:ci`
- [ ] Build succeeds: `bun run build`
- [ ] Biome formatting applied: `bun run biome check --write`
- [ ] Commit message follows format: `type(scope): description`
- [ ] No sensitive data committed
- [ ] Deployed to production: `vercel --prod`
- [ ] Verified at: `https://shadi-v2.vercel.app`

---

## 8. KEY REMINDERS

1. **Documentation is truth** — Check `documentation/core/` first
2. **Use feature branches** — Never commit to `main` directly
3. **Run audit before committing** — `bun run audit:ci`
4. **Design tokens only** — No hardcoded values
5. **Production URL is permanent** — `https://shadi-v2.vercel.app`
6. **Trust the system** — Audit, Biome, hooks are your allies

---

**This governance system maintains code quality and prevents issues from reaching production.**

**For audit details, see:** `documentation/core/05_AUDIT_LAYERS.md`
**For Git protocol, see:** `documentation/core/06_COMMIT_PROTOCOL.md`
