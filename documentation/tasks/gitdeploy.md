# Git & Vercel Deployment Guide

**Project:** Shadi V2 - Restaurant Discovery Platform
**Last Updated:** 2026-01-02

---

## 📌 Quick Reference

| Item | Value |
|------|-------|
| **GitHub Repository** | https://github.com/xmad11/template-v1 |
| **GitHub Owner** | xmad11 |
| **Main Branch** | `main` |
| **Production Branch** | `main` |
| **Vercel Project** | shadi-v2 |
| **Vercel Organization** | ahmad-s-projects-7e32bc62 |
| **Production URL** | https://shadi-v2.vercel.app |
| **Vercel Project ID** | `prj_icuQnDxJy09qCPHEUyfO3b4QCPjY` |

---

## 🚀 Quick Deploy Command

```bash
# 1. Stage all changes
git add -A

# 2. Commit (use this exact format)
git commit -m "feat: description of changes"

# 3. Push to GitHub
git push origin <branch-name>

# 4. Deploy to Vercel production
vercel --prod --yes
```

---

## 📦 Git Workflow

### Basic Commands

```bash
# Check current branch
git branch --show-current

# Check status
git status

# Stage all changes
git add -A

# Commit changes
git commit -m "type: description"

# Push to remote
git push origin <branch-name>

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/name
```

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/issue-name` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/update-name` - Documentation updates

### Commit Message Format

```
type: brief description

- Optional detail 1
- Optional detail 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

---

## 🌐 Vercel Deployment

### Project Configuration

**Project Name:** `shadi-v2`
**Framework:** Next.js 16.1.1 (Turbopack)
**Build Command:** `bun run build`
**Install Command:** `bun install`
**Output Directory:** `.next`

### Deployment Commands

```bash
# Deploy to production (updates shadi-v2.vercel.app)
vercel --prod --yes

# Deploy to preview (creates unique URL)
vercel --yes

# Check deployment status
vercel ls

# Inspect specific deployment
vercel inspect <deployment-url>

# Link to correct project (if needed)
rm -rf .vercel
vercel link shadi-v2 --yes
```

### Vercel CLI Installation

```bash
# Using Bun (recommended)
bun install -g vercel

# Or using npm
npm install -g vercel
```

---

## ⚙️ Auto-Deployment Setup

### GitHub → Vercel Integration

**Status:** ✅ Connected

The project is connected to Vercel via GitHub integration. This means:

- ✅ Every push to `main` branch triggers a **Production deployment**
- ✅ Every push to any other branch triggers a **Preview deployment**
- ✅ Every Pull Request creates a **Preview URL**

### How Auto-Deploy Works

1. **Push to `main`** → Production URL updated automatically
2. **Push to feature branch** → Preview URL created
3. **Create PR** → Preview URL + Vercel bot comments on PR

### Manual Deploy vs Auto-Deploy

| Scenario | Method | When to Use |
|----------|--------|-------------|
| Quick update to main | `git push` | Auto-deploys to production |
| Testing feature branch | `git push` | Auto-creates preview |
| Immediate production needed | `vercel --prod` | Skip waiting, deploy immediately |
| Check before deploying | `vercel --yes` | Create preview first |

---

## 🛠️ Common Issues & Solutions

### Issue 1: Git Push Fails with HTTP 400

**Error:**
```
error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
send-pack: unexpected disconnect while reading sideband packet
```

**Solution:**
```bash
# Increase git HTTP buffer
git config http.postBuffer 524288000

# Then push again
git push origin <branch-name>
```

### Issue 2: Git Author Mismatch

**Error:**
```
Error: Git author ahmad@example.com must have access to the team
```

**Solution:**
```bash
# Set git author to GitHub username
git config user.email "ahmad@users.noreply.github.com"
git config user.name "xmad11"

# Amend commit if needed
git commit --amend --reset-author --no-edit

# Push again
git push origin <branch-name>
```

### Issue 3: Wrong Vercel Project

**Symptoms:** Deploying to wrong project (e.g., template-v1 instead of shadi-v2)

**Solution:**
```bash
# Remove current link
rm -rf .vercel

# Link to correct project
vercel link shadi-v2 --yes

# Deploy
vercel --prod --yes
```

### Issue 4: Pre-commit Hooks Fail

**Symptoms:** Pre-commit audit fails but you want to skip it

**Solution:**
```bash
# Skip pre-commit hooks (use sparingly)
git commit --no-edit --no-verify

# Or fix the issues first
bun run fix
git add -A
git commit -m "fix: issues"
```

### Issue 5: Vercel Subdomain Returns 401

**Symptoms:** `shadi-v2-xxxxx-ahmad-s-projects-7e32bc62.vercel.app` returns 401

**Solution:** Use the main production alias instead:
- ✅ **Use:** `https://shadi-v2.vercel.app` (no auth required)
- ❌ **Avoid:** Subdomain URLs (have password protection)

---

## 📋 Step-by-Step Deployment Guide

### For Agents: Complete Deployment Process

#### Step 1: Verify Changes

```bash
# Check what files changed
git status

# Review changes
git diff
```

#### Step 2: Run Pre-commit Checks

```bash
# Run audit (layers 03, 04, 07.5)
bun run scripts/audit-runner.ts --layer=03 --layer=04 --layer=07.5

# Fix any issues
bun run fix
```

#### Step 3: Commit Changes

```bash
# Stage all changes
git add -A

# Commit with proper format
git commit -m "feat: description of changes"
```

#### Step 4: Push to GitHub

```bash
# Push to current branch
git push origin $(git branch --show-current)

# If push fails, try:
git config http.postBuffer 524288000
git push origin $(git branch --show-current)
```

#### Step 5: Deploy to Vercel

```bash
# Verify correct project is linked
cat .vercel/project.json | grep projectId
# Should show: prj_icuQnDxJy09qCPHEUyfO3b4QCPjY

# Deploy to production
vercel --prod --yes
```

#### Step 6: Verify Deployment

```bash
# Check deployment status
vercel ls | head -5

# Verify site is accessible
curl -s -o /dev/null -w "%{http_code}" https://shadi-v2.vercel.app
# Should return: 200
```

---

## 🔧 Vercel Project Configuration

### vercel.json

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables

Currently set in Vercel dashboard (no additional variables needed for basic deployment).

---

## 📊 Deployment Statistics

### Typical Build Times

| Stage | Duration |
|-------|----------|
| Install dependencies | ~200ms |
| Next.js build | ~6-8s |
| TypeScript check | ~4-5s |
| Static page generation | ~300ms |
| Serverless functions | ~250ms |
| **Total Build Time** | **~14-16s** |
| **Deploy Time** | **~6-8s** |

---

## 🔗 Important URLs

### Development
- **GitHub Repo:** https://github.com/xmad11/template-v1
- **GitHub Issues:** https://github.com/xmad11/template-v1/issues
- **Vercel Dashboard:** https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2

### Production
- **Live Site:** https://shadi-v2.vercel.app
- **Vercel Inspector:** https://vercel.com/ahmad-s-projects-7e32bc62/shadi-v2

### Documentation
- **Project Root:** /Users/ahmadabdullah/Projects/shadi-V2
- **Docs Folder:** /Users/ahmadabdullah/Projects/shadi-V2/documentation

---

## 📝 Notes for Agents

### Always Verify Before Deploying

1. ✅ Pre-commit audits pass (layers 03, 04, 07.5)
2. ✅ TypeScript compiles without errors
3. ✅ Correct Vercel project is linked (shadi-v2, not template-v1)
4. ✅ Git author is set correctly
5. ✅ All changes are committed and pushed

### After Deployment

1. ✅ Verify https://shadi-v2.vercel.app returns 200
2. ✅ Test key features in browser
3. ✅ Check Vercel dashboard for any errors

### If Something Goes Wrong

1. Check Vercel deployment logs
2. Verify git commit history
3. Check .vercel/project.json is correct
4. Try unlinking and relinking to shadi-v2 project

---

## 🎯 Summary

**To deploy changes to production:**

```bash
# 1. Make changes and run audits
bun run fix

# 2. Commit
git add -A
git commit -m "feat: your changes here"

# 3. Push
git push origin $(git branch --show-current)

# 4. Deploy
vercel --prod --yes

# 5. Verify
curl -s -o /dev/null -w "%{http_code}" https://shadi-v2.vercel.app
```

**The site is live when:** https://shadi-v2.vercel.app returns `200`

---

*This document is maintained in `/documentation/tasks/gitdeploy.md`*
