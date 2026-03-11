# 🤖 AGENT INSTRUCTIONS - Shadi V2 Platform

**For: AI agents working on this project**
**Last Updated:** 2026-01-10
**Platform:** Restaurant Reviews & Recommendations by Shadi Shawqi (@the.ss)

---

## 🎯 MANDATORY PRE-WORK

**BEFORE making ANY changes to this project:**

```bash
# Step 1: Read the core documentation (5 files, ~10 min)
cat documentation/DESIGN_SYSTEM_CANONICAL.md
cat documentation/GOVERNANCE.md
cat documentation/ui/UI_INVARIANTS.md
cat documentation/MOBILE_FIRST.md
cat documentation/git/GIT_PROTOCOL.md

# Step 2: Run full audit to establish baseline
bun run audit:ci

# Step 3: Save baseline report
cp .audit/audit-report.json .audit/baseline-report.json

# Step 4: Read current violations
cat .audit/audit-report.json
```

**If baseline audit fails with critical violations:**

1. DO NOT proceed with your task
2. Report to user: "Project has X critical violations that must be fixed first"
3. List the violations by layer and severity
4. Wait for user approval before continuing

---

## 📋 STANDARD WORKFLOW

### Phase 1: Analysis & Planning

```bash
# Understand current project state
bun run audit:ci                        # Run full 11-layer audit
cat .audit/audit-report.json           # Read results

# Create feature branch (NEVER work on main)
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

### Phase 2: Development with Continuous Verification

```bash
# Make your changes
# ... edit files ...

# Run quick checks while developing (fast):
bun run audit                          # Quick 3-layer check (03, 04, 07.5)
bun run biome check --write            # Format and lint

# Run specific layer checks:
bun run audit --layer=03               # TypeScript only
bun run audit --layer=04               # Design tokens only
bun run audit --layer=09               # Build verification only
```

### Phase 3: Pre-Commit Validation

```bash
# Before committing, MUST pass all checks:
bun run audit:ci                       # Full 11-layer audit
bun run biome check --write            # Final formatting
bun run build                          # Verify build works

# If violations exist:
bun run audit --layer=03 --fix         # Auto-fix specific layer
# OR fix manually based on audit report

# Re-verify after fixes:
bun run audit:ci

# Only commit if all checks pass:
git add specific-files                  # Add changed files specifically
git commit -m "type(scope): description"

# Commit format examples:
# feat(seo): update metadata for social sharing
# fix(auth): resolve redirect loop on login
# ui(header): remove hardcoded background color
```

### Phase 4: Deployment

```bash
# Push to GitHub
git push origin feature/your-task-name

# Deploy to Vercel (production)
vercel --prod

# Verify deployment at:
# https://shadi-v2.vercel.app
```

---

## 🚀 VERCEL DEPLOYMENT - SINGLE SOURCE OF TRUTH

### Production URL (NEVER CHANGES)

```
https://shadi-v2.vercel.app
```

**This URL:**
- ✅ Is permanent and never changes
- ✅ Always shows the latest production deployment
- ✅ Is the ONLY URL to share with clients
- ✅ Works for all social media previews

**DO NOT share preview URLs** like `shadi-v2-xyz123-ahmad-s-projects.vercel.app`
- These are temporary deployment tracking URLs
- They automatically redirect to the production URL
- They are confusing and unnecessary for clients

### Vercel Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview (for testing)
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

### Vercel Project Configuration

- **Project Name:** shadi-v2
- **Organization:** ahmad-s-projects-7e32bc62
- **Framework:** Next.js 16.1.1 (Turbopack)
- **Build Command:** `bun run build`
- **Install Command:** `bun install`
- **Output Directory:** `.next`

### Required Environment Variables

Set these in Vercel dashboard or via CLI:

```bash
# Supabase (required for auth/database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Analytics, monitoring, etc.
NEXT_PUBLIC_SITE_URL=https://shadi-v2.vercel.app
```

### Vercel Protection Settings

**IMPORTANT:** The following must be DISABLED for public access:

1. Go to: https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings
2. Under **Protection** tab:
   - ❌ Disable "Vercel Authentication"
   - ❌ Disable "Preview Authentication"
   - ❌ Disable "Password Protection"
3. Under **General** → **Visibility**:
   - ✅ Set to "Public"

**Clients should see the website directly, NOT a Vercel login prompt.**

---

## 📊 AUDIT SYSTEM - LAYER ARCHITECTURE

### Two-Tier Audit System

**Quick Audit (Development):**
```bash
bun run audit
```
- **Layers:** 03 (TypeScript), 04 (Design Tokens), 07.5 (UI Normalization)
- **Time:** ~2 seconds
- **Purpose:** Fast feedback during development
- **Use when:** Actively coding and making frequent changes

**Full Audit (CI/CD & Pre-Commit):**
```bash
bun run audit:ci
```
- **Layers:** All 11 layers
- **Time:** ~15 seconds
- **Purpose:** Comprehensive verification before committing
- **Use when:** About to commit, deploy, or create PR

### Complete Layer Reference

| Layer | Name | What It Checks | Time | Critical |
|-------|------|----------------|------|----------|
| 00 | Pre-Flight | Environment setup, required files | 0.1s | ✅ |
| 01 | Documentation | Docs exist and are current | 0.1s | ✅ |
| 02 | Architecture | Files in correct folders | 0.2s | ✅ |
| 03 | TypeScript | No `any`, proper typing | 12s | ✅ |
| 04 | Design Tokens | No hardcoded values | 0.2s | ✅ |
| 05 | Dependencies | No unauthorized packages | 0.5s | ⚠️ |
| 06 | Git Health | Clean history, no large files | 0.3s | ⚠️ |
| 07 | UI Responsive | Mobile-first breakpoints | 1s | ⚠️ |
| 07.5 | UI Normalization | Consistent patterns | 0.1s | ✅ |
| 08 | Ownership | CODEOWNERS respected | 0.5s | ⚠️ |
| 09 | Build Verify | Project builds successfully | 25s | ✅ |

### Layer-Specific Commands

```bash
# Run specific layer
bun run audit --layer=03

# Run multiple layers
bun run audit --layer=03 --layer=04 --layer=09

# Auto-fix safe violations
bun run audit --layer=04 --fix

# List all available layers
bun run audit --list
```

### Reading Audit Reports

```bash
# View latest report
cat .audit/audit-report.json

# Compare with baseline
diff .audit/baseline-report.json .audit/audit-report.json

# Count violations by severity
jq '.violations | group_by(.severity) | map({severity: .[0].severity, count: length})' .audit/audit-report.json
```

### Audit Report Structure

```json
{
  "summary": {
    "totalLayers": 11,
    "passed": 10,
    "warnings": 1,
    "failed": 0,
    "totalViolations": 5,
    "criticalViolations": 0
  },
  "violations": [
    {
      "layer": "04-design-tokens",
      "severity": "error",
      "file": "components/Header.tsx",
      "line": 42,
      "type": "hardcoded-color",
      "message": "Hardcoded color '#ff0000' found",
      "fix": "Replace with 'rgb(var(--color-primary))'"
    }
  ]
}
```

---

## 🔧 BIOME - LINTING & FORMATTING

### Biome Commands

```bash
# Check all files (read-only)
bun run biome check

# Check and auto-fix
bun run biome check --write

# Check specific file
bun run biome check components/Header.tsx

# Check specific pattern
bun run biome check "**/*.tsx"

# Format only (no linting)
bun run biome format --write

# Lint only (no formatting)
bun run biome lint
```

### Biome Configuration

**File:** `biome.json`

```json
{
  "linter": {
    "recommended": true,
    "rules": {
      "a11y": {
        "useKeyWithClickHandler": "warn",
        "useValidAnchor": "error"
      },
      "suspicious": {
        "noArrayIndexKey": "warn",
        "noExplicitAny": "error"
      },
      "correctness": {
        "useExhaustiveDependencies": "warn"
      }
    }
  },
  "formatter": {
    "indentStyle": "space",
    "lineWidth": 100,
    "indentWidth": 2
  }
}
```

### Common Biome Issues & Fixes

**Issue: Array index key**
```tsx
// ❌ Wrong
{items.map((item, i) => <Card key={i} />)}

// ✅ Correct
{items.map((item) => <Card key={item.id} />)}
```

**Issue: Button without type**
```tsx
// ❌ Wrong
<button onClick={handleClick}>Click</button>

// ✅ Correct
<button type="button" onClick={handleClick}>Click</button>
```

**Issue: Label without control**
```tsx
// ❌ Wrong
<label>Username</label>
<input />

// ✅ Correct
<label htmlFor="username">Username</label>
<input id="username" />
```

---

## 🌿 GIT PROTOCOL - SINGLE SOURCE OF TRUTH

### Branch Strategy

```bash
# ALWAYS create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/descriptive-name

# Examples:
# feature/add-language-switcher
# fix/auth-redirect-loop
# ui/update-hero-section
# refactor/database-connection

# NEVER commit directly to main
# NEVER work on stale feature branches
```

### Commit Message Format

```
type(scope): brief description

Optional detailed explanation

Fixes #123
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `ui:` - UI-only changes (no logic)
- `refactor:` - Code restructuring
- `docs:` - Documentation only
- `test:` - Adding tests
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks

**Examples:**
```
feat(i18n): add Urdu and Persian language support

- Updated LanguageContext with 5 languages
- Added translation files for Urdu (ur.json) and Persian (fa.json)
- Fixed language switching with useMemo dependency

Closes #45
```

### Pre-Commit Hooks (Automatic)

The project uses Husky for git hooks. These run automatically:

```bash
# On every commit:
- biome check --write (format and lint)
- bun run audit (quick 3-layer check on staged files only)

# If hooks fail, commit is blocked
# Fix the issues and try again
```

### Common Git Workflows

**Add specific files:**
```bash
git add components/Header.tsx app/layout.tsx
git commit -m "feat: update header navigation"
```

**Stage all changes in a file:**
```bash
git add -u
git commit -m "fix: resolve auth redirect"
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
# Make new commits
```

**View commit history:**
```bash
git log --oneline -10
git log --stat
```

### Git Safety Rules

❌ **NEVER:**
```bash
git commit --no-verify        # Bypasses pre-commit hooks
git push --force               # Can destroy history
git add . && git commit        # Too broad, add specific files
```

✅ **ALWAYS:**
```bash
git checkout -b feature/name   # Always use feature branches
git add specific-file.tsx      # Add files intentionally
git commit -m "type: message"  # Follow commit format
```

---

## 🚫 FORBIDDEN ACTIONS

### NEVER Do These:

**1. Skip the audit**
```bash
# ❌ WRONG:
git commit -m "Quick fix" --no-verify

# ✅ CORRECT:
bun run audit:ci
git commit -m "fix: resolve auth redirect"
```

**2. Ignore violations**
```bash
# ❌ WRONG:
# "The audit shows errors but I'll commit anyway"

# ✅ CORRECT:
# Fix all violations OR document why they can't be fixed and get approval
```

**3. Modify audit scripts to pass**
```bash
# ❌ WRONG:
# Editing scripts/audit/* to make checks pass

# ✅ CORRECT:
# Fix your code to pass the checks
```

**4. Share preview URLs with clients**
```bash
# ❌ WRONG:
# Share: https://shadi-v2-xyz123-ahmad-s-projects.vercel.app

# ✅ CORRECT:
# Share: https://shadi-v2.vercel.app
```

---

## 🎯 LAYER-SPECIFIC GUIDANCE

### Layer 03: TypeScript

**What it checks:** No `any`, proper typing, no `@ts-ignore`

```bash
# ❌ WRONG:
const data: any = fetchData();
// @ts-ignore
const risky = anyOperation;

# ✅ CORRECT:
interface RestaurantData {
  id: string;
  name: string;
  rating: number;
}
const data: RestaurantData = fetchData();

# Verify:
bun run audit --layer=03
```

### Layer 04: Design Tokens

**What it checks:** No hardcoded colors, sizes, spacing

```bash
# ❌ WRONG:
<div className="bg-blue-500 p-8" style={{ color: '#ff0000' }}>

# ✅ CORRECT:
<div className="bg-[rgb(var(--color-primary))] p-[var(--spacing-2xl)] text-[rgb(var(--color-error))]">

# Verify:
bun run audit --layer=04
```

### Layer 07.5: UI Normalization

**What it checks:** Consistent UI patterns, no inline styles

```bash
# Verify:
bun run audit --layer=07.5
```

### Layer 09: Build Verification

**What it checks:** Project builds successfully

```bash
# Always verify:
bun run build

# Verify via audit:
bun run audit --layer=09
```

---

## 📊 REPORTING TO USER

### Completion Report Template:

```markdown
## Task Completion Report

### Changes Made
- [File 1]: Description of change
- [File 2]: Description of change

### Audit Results
- **Baseline violations:** X
- **Current violations:** Y
- **Change:** +/- Z

### Layers Status
✅ **Passed:** [list of layers]
⚠️  **Warnings:** [list if any]
❌ **Failed:** [list if any]

### Build Verification
✅ Build successful: `bun run build`

### Deployment
✅ Deployed to: https://shadi-v2.vercel.app

### Verification Steps for User
```bash
# 1. Verify audit passes
bun run audit:ci

# 2. Check build
bun run build

# 3. View production site
open https://shadi-v2.vercel.app
```
```

---

## ✅ SUCCESS CRITERIA

### Your work is complete when:

- [ ] Full audit passes (`bun run audit:ci`)
- [ ] No critical violations
- [ ] Warnings documented and justified
- [ ] Build succeeds (`bun run build`)
- [ ] Biome formatting applied (`bun run biome check --write`)
- [ ] Git history is clean
- [ ] Deployed to production (`vercel --prod`)
- [ ] Verified at https://shadi-v2.vercel.app

### Your work is NOT complete if:

- [ ] Any critical violations remain
- [ ] Build fails
- [ ] Undocumented warnings
- [ ] Audit skipped or bypassed
- [ ] Not deployed to production

---

## 🚨 EMERGENCY PROCEDURES

### If Audit System Fails:

```bash
# 1. DO NOT modify audit scripts
# 2. Report to user with error details
# 3. Wait for guidance
```

### If You Created Violations:

```bash
# 1. Run audit
bun run audit

# 2. Fix violations based on report suggestions
# 3. Re-run audit
bun run audit:ci

# 4. If can't fix, report to user with details
```

### If Build Fails:

```bash
# 1. Check TypeScript errors
bun run tsc --noEmit

# 2. Check build output
bun run build

# 3. Fix errors and retry
```

---

## 🎓 KEY REMINDERS

1. **Always work on feature branches** - Never on main
2. **Run audit before committing** - Use `bun run audit:ci`
3. **Use biome for formatting** - `bun run biome check --write`
4. **Deploy to production** - `vercel --prod`
5. **Share the production URL** - `https://shadi-v2.vercel.app`
6. **Follow commit message format** - `type(scope): description`
7. **Read documentation first** - 5 core docs before starting
8. **Trust the audit system** - It catches problems early

---

**Remember:** The audit system, Biome, and Git protocol are your allies. They maintain code quality and prevent issues from reaching production.

**Documentation is the single source of truth.** When in doubt, check the docs in `/documentation`.

**Production URL is permanent.** Always share `https://shadi-v2.vercel.app` with clients.
