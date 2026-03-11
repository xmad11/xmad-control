# COMMIT PROTOCOL — Git Workflow

**Single Source of Truth for Git operations**

**Last Updated:** 2026-01-28

---

## 1. BRANCHING STRATEGY (MANDATORY)

### Main Branch (Protected)

```bash
main
```

- **Status:** Production-ready, protected
- **Direct commits:** ❌ FORBIDDEN
- **Requirement:** All changes via feature branches
- **Deployment:** Automatically deployed to https://shadi-v2.vercel.app

### Feature Branches

```bash
# Naming convention:
feature/descriptive-name
fix/descriptive-name
ui/descriptive-name
refactor/descriptive-name

# Examples:
feature/add-language-switcher
fix/auth-redirect-loop
ui/update-hero-section
refactor/database-connection
```

**Rules:**
1. ALWAYS create from latest `main`
2. NEVER create from stale feature branches
3. Use descriptive, kebab-case names
4. One feature per branch

### Creating a Feature Branch

```bash
# Step 1: Ensure main is up to date
git checkout main
git pull origin main

# Step 2: Create feature branch
git checkout -b feature/your-feature-name

# Step 3: Verify you're on the new branch
git status
# Should show: "On branch feature/your-feature-name"

# Step 4: Start working
```

---

## 2. COMMIT MESSAGE FORMAT (MANDATORY)

### Standard Format

```
type(scope): brief description

Optional detailed explanation

Closes #123
```

### Commit Types

| Type | Usage | Examples |
|------|-------|----------|
| `feat:` | New feature | `feat(auth): add Google OAuth` |
| `fix:` | Bug fix | `fix(nav): resolve mobile menu overlap` |
| `ui:` | UI-only changes | `ui(header): remove hardcoded color` |
| `refactor:` | Code restructuring | `refactor(components): extract shared logic` |
| `docs:` | Documentation only | `docs(readme): update setup instructions` |
| `test:` | Adding tests | `test(auth): add login flow tests` |
| `build:` | Build system | `build(vercel): update production URL` |
| `ci:` | CI/CD changes | `ci(hooks): add audit check` |
| `chore:` | Maintenance | `chore(deps): upgrade Next.js to 16.1` |

### Scopes

Common scopes for this project:

- `auth` — Authentication, Supabase integration
- `seo` — Metadata, OpenGraph, social sharing
- `i18n` — Internationalization, translations
- `ui` — UI components, styling
- `nav` — Navigation, routing
- `api` — API routes, server actions
- `db` — Database schema (LOCKED - requires approval)

### Examples of Good Commits

```bash
# Feature with description
feat(i18n): add Urdu and Persian language support

- Updated LanguageContext with 5 languages total
- Added translation files for Urdu (ur.json) and Persian (fa.json)
- Fixed language switching with useMemo dependency
- Updated language page to show all available languages

Closes #45

# Simple fix
fix(auth): resolve infinite redirect loop on login

# UI change
ui(header): remove hardcoded warm background color
- Replaced with theme-aware CSS custom property
- Now respects dark/warm/light modes

# Documentation
docs(core): refactor documentation into SSOT structure
```

### Bad Commit Examples

```bash
# ❌ Too vague
git commit -m "update stuff"

# ❌ Wrong format
git commit -m "Updated the header component"

# ❌ Missing scope
git commit -m "feat: add language"

# ❌ Too broad
git commit -m "fix everything"

# ❌ Missing type
git commit -m "Added auth support"
```

---

## 3. PRE-COMMIT HOOKS (AUTOMATIC)

### What Runs Automatically

This project uses **Husky** for git hooks. On every commit:

```bash
# 1. Biome formatting and linting
bun run biome check --write

# 2. Quick audit on staged files only
bun run audit --layer=03 --layer=04 --layer=07.5
```

### If Hooks Fail

Your commit will be **blocked**. To fix:

```bash
# 1. Read the error output
# 2. Fix the issues
bun run biome check --write
bun run audit:ci

# 3. Try committing again
git add .
git commit -m "type(scope): description"
```

### WARNING: Never Bypass Hooks

```bash
# ❌ WRONG - This bypasses quality checks
git commit -m "quick fix" --no-verify

# ✅ CORRECT - Fix the issues first
bun run audit:ci
git commit -m "fix: resolve issue"
```

---

## 4. PUSHING & DEPLOYMENT

### Push to GitHub

```bash
# Push feature branch
git push origin feature/your-feature-name

# First time push (sets upstream)
git push -u origin feature/your-feature-name
```

### Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# This deploys to: https://shadi-v2.vercel.app
```

### Production URL (PERMANENT)

```
https://shadi-v2.vercel.app
```

**Do NOT share preview URLs** like:
- `https://shadi-v2-xyz123-ahmad-s-projects.vercel.app` ❌

**ONLY share the production URL:**
- `https://shadi-v2.vercel.app` ✅

---

## 5. WORKFLOW EXAMPLE

### Complete Feature Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/add-user-favorites

# 3. Make changes
# ... edit files ...

# 4. Continuous verification while developing
bun run audit                    # Quick 3-layer check
bun run biome check --write      # Format

# 5. Pre-commit validation
bun run audit:ci                 # Full 11-layer audit
bun run build                    # Verify build works

# 6. Commit changes
git add components/Favorites.tsx app/favorites/page.tsx
git commit -m "feat(favorites): add user favorite restaurants

- Implemented favorites UI with heart icon toggle
- Added Supabase integration for storing favorites
- Updated navigation to show favorites link
- Added authentication requirement

Closes #12"

# 7. Push to GitHub
git push origin feature/add-user-favorites

# 8. Deploy to Vercel
vercel --prod

# 9. Verify deployment
open https://shadi-v2.vercel.app
```

---

## 6. COMMON SCENARIOS

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
# Make new commits
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
# WARNING: This deletes your changes permanently
```

### Change Commit Message

```bash
git commit --amend -m "new commit message"
# Only use if not pushed yet
```

### View Commit History

```bash
# Simple view
git log --oneline -10

# Detailed view
git log --stat

# View specific file history
git log -- components/Header.tsx
```

### Stash Changes

```bash
# Save current work temporarily
git stash

# List stashes
git stash list

# Apply stash
git stash pop

# Apply and remove stash
git stash drop
```

### Resolve Merge Conflicts

```bash
# 1. Pull latest main
git checkout main
git pull origin main

# 2. Merge into your feature branch
git checkout feature/your-feature
git merge main

# 3. Fix conflicts in editor
# Look for: <<<<<<< HEAD
# Resolve conflicts
# Remove conflict markers

# 4. Mark as resolved
git add conflicted-file.tsx

# 5. Complete merge
git commit -m "merge: resolve conflicts with main"
```

---

## 7. FORBIDDEN GIT OPERATIONS

### NEVER Do These

```bash
# 1. Commit directly to main
git checkout main
git add .
git commit -m "quick fix"  # ❌ WRONG

# 2. Force push to shared branches
git push --force origin main  # ❌ WRONG

# 3. Create branches from stale features
git checkout feature/old-feature
git checkout -b feature/new-feature  # ❌ WRONG

# 4. Bypass pre-commit hooks
git commit -m "message" --no-verify  # ❌ WRONG

# 5. Add all files blindly
git add .  # ❌ WRONG (too broad)
```

### ALWAYS Do These

```bash
# 1. Create feature branches
git checkout -b feature/your-name  # ✅ CORRECT

# 2. Add specific files
git add specific-file.tsx  # ✅ CORRECT

# 3. Follow commit format
git commit -m "type(scope): description"  # ✅ CORRECT

# 4. Run verification before committing
bun run audit:ci  # ✅ CORRECT
```

---

## 8. GIT BEST PRACTICES

### Commit Size

```bash
# ✅ GOOD - Logical, reviewable commits
git commit -m "feat(auth): add Google OAuth"
git commit -m "fix(auth): resolve redirect loop"
git commit -m "ui(auth): update login button styles"

# ❌ BAD - Massive, unreviewable commits
git commit -m "did a bunch of stuff"
```

### Commit Frequency

```bash
# ✅ GOOD - Frequent, focused commits
# Work for 30-60 minutes → commit
# Fix a bug → commit
# Complete a feature → commit

# ❌ BAD - Infrequent, massive commits
# Work for 4 hours → one massive commit
```

### Branch Maintenance

```bash
# After merging to main, delete feature branch
git branch -d feature/completed-feature
git push origin --delete feature/completed-feature

# Keep main clean
git checkout main
git pull origin main
git branch -d feature/merged-feature
```

---

## 9. CHECKLIST BEFORE PUSHING

Before pushing your feature branch:

- [ ] All commits follow format: `type(scope): description`
- [ ] Full audit passes: `bun run audit:ci`
- [ ] Build succeeds: `bun run build`
- [ ] Biome formatting applied: `bun run biome check --write`
- [ ] No sensitive data committed (API keys, secrets)
- [ ] Changes tested locally: `bun run dev`
- [ ] Commit messages are descriptive
- [ ] Feature is complete and working

---

## 10. TROUBLESHOOTING

### "Failed to push some refs"

```bash
# Solution: Pull latest changes first
git pull origin main --rebase
git push origin feature/your-feature
```

### "Detached HEAD"

```bash
# Solution: Get back to a branch
git checkout main
# OR
git checkout feature/your-feature
```

### "Merge conflict"

```bash
# Solution:
# 1. Open conflicted files in editor
# 2. Look for: <<<<<<< HEAD
# 3. Resolve conflicts
# 4. Mark as resolved:
git add conflicted-file.tsx
# 5. Complete merge
git commit
```

### "Pre-commit hook failed"

```bash
# Solution: Fix the issues
bun run biome check --write
bun run audit:ci
git add .
git commit -m "type(scope): description"
```

---

## 11. QUICK REFERENCE

```bash
# Start feature
git checkout main && git pull && git checkout -b feature/name

# Commit changes
bun run audit:ci && git add files && git commit -m "type(scope): desc"

# Push & deploy
git push origin feature/name && vercel --prod

# Verify
open https://shadi-v2.vercel.app
```

---

## 12. GOLDEN RULES

1. **Always use feature branches** — Never on main
2. **Follow commit message format** — `type(scope): description`
3. **Let hooks run** — Don't bypass them
4. **Push often** — Don't let branches get stale
5. **Deploy with `vercel --prod`** — Production URL is permanent
6. **Share the production URL** — `https://shadi-v2.vercel.app`

---

**This document is the SSOT for Git workflow and commit protocol.**

**For audit requirements, see:** `documentation/core/05_AUDIT_LAYERS.md`
**For agent rules, see:** `documentation/core/00_AGENT_RULES.md`
