# ⚡ QUICK START GUIDE - Shadi V2 Platform

**Get up and running in 10 minutes**
**Last Updated:** 2026-01-10

---

## 🎯 FIRST TIME SETUP (5 Minutes)

### Step 1: Install Bun

```bash
# Install Bun (runtime and package manager)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version  # Should be 1.0+
```

### Step 2: Install Dependencies

```bash
# Navigate to project
cd /path/to/shadi-V2

# Install all dependencies
bun install

# Verify installation
bun --version
```

### Step 3: Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Step 4: Run Development Server

```bash
# Start development server
bun run dev

# Open in browser
open http://localhost:3000
```

-----

## 📖 DAILY WORKFLOW (2 Minutes)

### Before Making Changes

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-task-name

# 3. Run baseline audit
bun run audit:ci
```

### While Developing

```bash
# Make changes...

# Quick verification (fast):
bun run audit                  # 3-layer check, ~2 seconds
bun run biome check --write    # Format code

# Specific layer checks:
bun run audit --layer=03       # TypeScript only
bun run audit --layer=04       # Design tokens only
```

### Before Committing

```bash
# Full verification:
bun run audit:ci               # All 11 layers, ~15 seconds
bun run biome check --write    # Final formatting
bun run build                  # Verify build works

# Commit changes:
git add specific-files
git commit -m "type(scope): description"

# Example:
git commit -m "feat(seo): update metadata for social sharing"
```

### Deploy to Production

```bash
# Push to GitHub
git push origin feature/your-task-name

# Deploy to Vercel
vercel --prod

# Verify at:
open https://shadi-v2.vercel.app
```

-----

## 📊 AUDIT SYSTEM

### Quick Audit (While Developing)

```bash
bun run audit
```

**What it checks:**
- TypeScript (no `any` types)
- Design tokens (no hardcoded values)
- UI normalization (consistent patterns)

**Time:** ~2 seconds

### Full Audit (Before Committing)

```bash
bun run audit:ci
```

**What it checks:**
- All 11 audit layers
- TypeScript, design tokens, architecture, build, etc.

**Time:** ~15 seconds

### Audit Commands

```bash
# Run specific layer
bun run audit --layer=03

# Run multiple layers
bun run audit --layer=03 --layer=04

# Auto-fix safe issues
bun run audit --layer=04 --fix

# List all layers
bun run audit --list
```

-----

## 🔧 BIOME - Linting & Formatting

```bash
# Check code
bun run biome check

# Fix issues
bun run biome check --write

# Format only
bun run biome format --write

# Check specific file
bun run biome check components/Header.tsx
```

**Pre-commit:** Biome runs automatically before commit.

-----

## 🚀 VERCEL DEPLOYMENT

### Production URL (Always the Same)

```
https://shadi-v2.vercel.app
```

**This URL:**
- ✅ Never changes
- ✅ Always shows latest production
- ✅ Share this with clients
- ✅ Works for social media previews

### Deploy Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview (testing)
vercel

# List deployments
vercel ls

# Open project settings
vercel open
```

### Vercel Settings (IMPORTANT)

To allow public access (no Vercel login prompt):

1. Go to: https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings
2. Under **Protection**:
   - ❌ Disable "Vercel Authentication"
   - ❌ Disable "Preview Authentication"
   - ❌ Disable "Password Protection"
3. Under **General** → **Visibility**:
   - ✅ Set to "Public"

-----

## 🌿 GIT WORKFLOW

### Branch Strategy

```bash
# Always work on feature branches
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

### Commit Format

```
type(scope): brief description

Optional details.

Closes #123
```

**Types:** `feat`, `fix`, `ui`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`

**Examples:**
- `feat(auth): add Google OAuth login`
- `fix(nav): resolve mobile menu overlap`
- `ui(header): remove hardcoded color`

### Pre-Commit Hooks (Automatic)

Runs before every commit:
```bash
1. bun run biome check --write      # Format and lint
2. bun run audit --layer=03 --layer=04 --layer=07.5  # Quick audit
```

**If hooks fail:** Fix the issues, then commit again.

-----

## 🚨 COMMON ISSUES

### "bun: command not found"

**Solution:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### "Audit fails"

**Solution:**
```bash
# Read the report
cat .audit/audit-report.json

# Fix violations based on suggestions
# Re-run audit
bun run audit:ci
```

### "Build fails"

**Solution:**
```bash
# Check TypeScript errors
bun run tsc --noEmit

# Fix errors
# Re-build
bun run build
```

### "Pre-commit hook failed"

**Solution:**
```bash
# Fix issues
bun run biome check --write
bun run audit:ci

# Try committing again
git add .
git commit -m "type(scope): description"
```

### "Vercel login prompt appears"

**Solution:** Disable Vercel Authentication
1. Go to: https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2/settings
2. Under **Protection**: Disable all authentication
3. Set visibility to "Public"

-----

## 📚 DOCUMENTATION

### Required Reading

Before making changes, read these:

1. `/documentation/AGENT_INSTRUCTIONS.md` - Main agent guide
2. `/documentation/GOVERNANCE.md` - Enforcement layers
3. `/documentation/git/GIT_PROTOCOL.md` - Git workflow
4. `/documentation/ui/UI_INVARIANTS.md` - UI rules
5. `/documentation/DESIGN_SYSTEM_CANONICAL.md` - Design tokens

### Quick Reference

| Task | Command |
|------|---------|
| Start dev | `bun run dev` |
| Quick audit | `bun run audit` |
| Full audit | `bun run audit:ci` |
| Format code | `bun run biome check --write` |
| Build | `bun run build` |
| Deploy | `vercel --prod` |

-----

## ✅ SUCCESS CHECKLIST

You're ready when:

- [ ] Bun installed (`bun --version`)
- [ ] Dependencies installed (`bun install`)
- [ ] Dev server runs (`bun run dev`)
- [ ] Audit passes (`bun run audit:ci`)
- [ ] Can commit to feature branch
- [ ] Can deploy to Vercel

-----

## 🎯 KEY REMINDERS

1. **Always use feature branches** - Never work on `main` directly
2. **Run audit before committing** - `bun run audit:ci`
3. **Use biome for formatting** - `bun run biome check --write`
4. **Production URL is permanent** - `https://shadi-v2.vercel.app`
5. **Read documentation first** - Check `/documentation` folder
6. **Follow commit format** - `type(scope): description`

-----

**You're ready!** The platform is set up and the audit system is protecting your code.

**Next:** Read `/documentation/AGENT_INSTRUCTIONS.md` for detailed workflow guidance.
