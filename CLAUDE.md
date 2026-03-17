# 🛡️ CLAUDE.md — xmad-control System Constitution

> **READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.**
> This is not optional. This file is law for every agent, session, and automation.

---

## 🖥️ MACHINE PROFILE — KNOW YOUR CONSTRAINTS

| Property     | Value                                                               |
|-------------|---------------------------------------------------------------------|
| Machine      | Apple Mac Mini (Late model, HDD)                                    |
| RAM          | 8GB — **hard ceiling, no swap buffer**                              |
| Storage      | HDD — **slow I/O, no SSD speed**                                    |
| OS           | macOS                                                               |
| Owner        | Ahmad Abdulla (`ahmadabdullah`)                                     |
| Remote Access| SSH via Tailscale (PRIMARY) · AnyDesk (BACKUP ONLY)                 |
| Recovery Path| **SSH + Tailscale is the ONLY way in. If it dies, machine is lost.**|

### Memory Danger Zones

| Usage | Status     | Action                                    |
|-------|-----------|------------------------------------------|
| < 60% | ✅ Safe     | Normal operations                         |
| 60–75%| ⚠️ Caution  | No builds. Lightweight ops only           |
| 75–85%| 🔴 High Risk| Stop all work. Run `memory-check`. Report.|
| > 85% | ⛔ Critical | Machine will freeze. DO NOT run anything. |

**Always run `memory-check` before any build, install, or server operation.**

---

## ⛔ ABSOLUTE BANS — NEVER UNDER ANY CIRCUMSTANCES

These will freeze the machine and make it permanently unreachable.

### Never Kill These Processes

```
sshd              ← ONLY remote access. Kill this = machine lost forever.
tailscaled        ← VPN tunnel. Kill this = no recovery path.
tailscale         ← Same as above.
AnyDesk           ← Visual backup if SSH fails. Do not touch.
ai.openclaw.gateway    ← Managed by LaunchAgent. Not your concern.
ai.openclaw.watchdog   ← Keeps openclaw alive. Leave it.
```

### Never Run These Commands

```bash
# ❌ ALL BANNED — no exceptions, no "just this once"
bun dev
next dev
npm run dev
npx next dev
bun start           ← banned WITHOUT the sudo code
next start          ← banned WITHOUT the sudo code
npm start           ← banned WITHOUT the sudo code

# ❌ BANNED port operations
lsof -ti tcp:3000 | xargs kill    ← only allowed on port 3333 via dev-safe
# Any server on port 3000, 3001, 3002... BANNED. Port 3333 only.

# ❌ BANNED system operations
ulimit -v           ← breaks Bun on macOS. Never use.
ulimit -u           ← affects entire login session on macOS. Never use.
pm2 start           ← PM2 is disabled. LaunchAgents are SSOT.
pm2 restart         ← Same.

# ❌ BANNED package operations without permission
npm install -g      ← ask first
bun add --global    ← ask first
brew install        ← ask first
```

### Never Do These Actions

- Spawn multiple dev servers — one port, one instance, one session
- Leave background processes running after your task is done
- Run `rm -rf .next` on every build — destroys Turbopack cache, costs 60s on HDD
- Modify LaunchAgent plists in `~/Library/LaunchAgents/` without explicit instruction
- Disable or `bootout` openclaw LaunchAgents
- Store API keys in `.env` files committed to git
- Hardcode any API key, token, or secret anywhere in code

---

## ✅ CORRECT TESTING WORKFLOW — FOLLOW THIS ALWAYS

Agents must follow this exact sequence. No skipping steps.

### Step 1 — Type Check (zero memory, instant)

```bash
cd ~/xmad-control
bun run typecheck
# OR directly:
bunx tsc --noEmit
```

Catches: type errors, missing imports, interface mismatches.
Cost: < 50MB RAM. Safe always.

### Step 2 — Lint Check (zero memory, fast)

```bash
bun run lint
# Biome runs in < 100MB. Always safe.
```

Catches: code style issues, unused vars, import order, formatting.

### Step 3 — Build Check (compile only, NO server)

```bash
dev-safe build
```

Catches: build-time errors, missing modules, broken imports, env var issues.
Cost: capped at 700MB heap. Safe if memory check passes.
**This does NOT start a server. Never use this to serve the app.**

### Step 4 — Deploy & Test Online (preferred for visual testing)

```bash
git add .
git commit -m "feat: your change description"
git push origin main    # or your branch
```

Vercel auto-deploys on push. Test at your Vercel URL.
**Zero local memory cost. This is always the preferred path for visual testing.**

### Step 5 — Local Preview (emergency only, requires code)

```bash
sudo dev-safe preview
# Prompts for access code: 5020
```

Rules enforced automatically:

- Port **3333 ONLY** — no other port allowed
- **10 minute hard limit** — auto-kills
- **700MB heap cap** — auto-kills if exceeded
- **1.01GB RSS cap** — auto-kills with warning message
- **One instance only** — flock enforced

---

## 🔐 SECRETS & CREDENTIALS ARCHITECTURE

This project uses a layered secrets system. Understand it before touching anything.

### Layer 1 — macOS Keychain (runtime secrets, local machine)

All API keys for local runtime live in macOS Keychain. Never in `.env` files.

**Reading from Keychain:**

```bash
# Pattern: security find-generic-password -s "SERVICE_NAME" -a "ACCOUNT" -w
security find-generic-password -s "z.ai" -a "openclaw" -w
security find-generic-password -s "SSOT_AI_GLM_PAID" -a "SSOT" -w
security find-generic-password -s "groq/xmad" -a "xmad" -w
security find-generic-password -s "elevenlabs/xmad" -a "xmad" -w
```

**Adding to Keychain:**

```bash
security add-generic-password -a "ACCOUNT" -s "SERVICE_NAME" -w "YOUR_KEY"
```

**Known Keychain Service Names:**

| Service            | Account   | Used For              |
|-------------------|----------|----------------------|
| `z.ai`            | `openclaw`| OpenClaw GLM gateway  |
| `SSOT_AI_GLM_PAID`| `SSOT`    | GLM-4-Plus paid model |
| `SSOT_AI_GLM_ZAI` | `SSOT`    | GLM-5 / z.ai access   |
| `groq/xmad`       | `xmad`    | Groq STT (Whisper)    |
| `elevenlabs/xmad` | `xmad`    | ElevenLabs TTS        |

**Scripts load Keychain via:** `~/xmad-control/scripts/load-secrets.sh`
Always source this before starting any service that needs API keys.

### Layer 2 — Infisical (team secrets, CI/CD, Vercel injection)

Infisical is the source of truth for all non-local secrets.

```bash
# Pull secrets for local dev (never commit these)
infisical run --env=dev -- bun run typecheck

# Check connected project
infisical whoami
infisical projects
```

- **Never bypass Infisical** by hardcoding values in `next.config.ts` or `.env.local`
- **Never commit `.env.local`** — it's in `.gitignore` and must stay there
- Production secrets live in Infisical → synced to Vercel automatically

### Layer 3 — Vercel Environment Variables (production/preview)

Set via Vercel dashboard or CLI. Synced from Infisical.

```bash
# Inspect current Vercel env (read only)
vercel env ls

# Never set directly — use Infisical sync instead
# vercel env add   ← only if Infisical sync is broken and human approves
```

### Layer 4 — GitHub Secrets (CI/CD only)

Used only in GitHub Actions workflows. Never read directly in app code.

```
VERCEL_TOKEN         ← Vercel deploy token
INFISICAL_TOKEN      ← Infisical machine identity token
SUPABASE_SERVICE_KEY ← DB migrations in CI only
```

---

## 📦 TECH STACK REFERENCE

### Core Runtime

| Tool          | Version                   | Purpose                              | Notes                                    |
|--------------|--------------------------|-------------------------------------|-----------------------------------------|
| **Bun**       | Latest stable             | Runtime, package manager, test runner| SSOT runtime. Never mix with npm/yarn.   |
| **Node.js**   | Via nvm (project `.nvmrc`)| Fallback only                        | Check `.nvmrc` before using node directly|
| **TypeScript**| 5.9                       | Type safety                          | Strict mode. No `any` without comment.   |

### Frontend Framework

| Tool            | Version| Purpose      | Notes                                     |
|----------------|-------|-------------|------------------------------------------|
| **Next.js**     | 16.1.6 | App framework| App Router only. No Pages Router.         |
| **React**       | 19     | UI library   | Server Components by default              |
| **Tailwind CSS**| v4     | Styling      | CSS-first config. No `tailwind.config.js`.|

### Tailwind v4 Rules (CRITICAL — different from v3)

```css
/* ✅ CORRECT — Tailwind v4 CSS-first config */
@import "tailwindcss";
@theme {
  --color-brand: #your-color;
  --font-sans: "Inter", sans-serif;
}

/* ❌ WRONG — v3 syntax, will not work */
/* tailwind.config.js with theme.extend */
/* @tailwind base; @tailwind components; @tailwind utilities; */
```

- No `tailwind.config.js` — config lives in CSS
- No `@tailwind` directives — use `@import "tailwindcss"`
- Custom tokens go in `@theme {}` block
- Arbitrary values still work: `w-[200px]`

### Code Quality

| Tool     | Purpose                                   | Config              |
|---------|------------------------------------------|--------------------|
| **Biome**| Lint + format (replaces ESLint + Prettier)| `biome.json` at root|

```bash
# Format
bun run format          # or: bunx biome format --write .

# Lint
bun run lint            # or: bunx biome lint .

# Both together
bunx biome check --write .
```

Never install ESLint or Prettier. Biome handles both.

### Monorepo Structure

```
platform-monorepo/
├── apps/
│   ├── security-hub/     ← Auth, permissions (Next.js 16)
│   ├── front-hub/        ← Public-facing frontend
│   ├── back-hub/         ← Admin/dashboard
│   └── ai-hub/           ← AI features, model routing
├── packages/
│   ├── ui/               ← Shared components
│   ├── config/           ← Shared Tailwind/TS config
│   └── types/            ← Shared TypeScript types
├── turbo.json            ← Turborepo pipeline
├── package.json          ← Workspace root
└── biome.json            ← Lint/format config
```

```bash
# Run commands across all workspaces
bun run build             # Turborepo builds all apps
bun run typecheck         # Type check all packages
bun run lint              # Lint all packages

# Run for specific app
cd apps/front-hub && bun run build
```

---

## 🗄️ DATABASE — SUPABASE

### Connection Rules

```bash
# ✅ CORRECT — use service role only in server-side code
# Never expose service role key to client

# Check connection
bunx supabase status

# Run migrations
bunx supabase db push

# Generate types from schema
bunx supabase gen types typescript --local > packages/types/src/database.ts
```

### Supabase Keys

| Key                         | Where It Lives        | Usage                         |
|----------------------------|----------------------|------------------------------|
| `SUPABASE_URL`             | Infisical → Vercel env| Client + server               |
| `SUPABASE_ANON_KEY`        | Infisical → Vercel env| Client-side only              |
| `SUPABASE_SERVICE_ROLE_KEY`| Infisical (restricted)| Server-side only, never client|

**Row Level Security is always ON.** Never disable RLS to fix a bug — fix the policy.

### Migration Rules

```bash
# ✅ Create migration
bunx supabase migration new "your_migration_name"
# Edit the generated file in supabase/migrations/

# ✅ Apply locally
bunx supabase db reset   # local only

# ✅ Apply to production
bunx supabase db push    # uses SUPABASE_SERVICE_ROLE_KEY from env

# ❌ Never run raw SQL directly against production without a migration file
```

---

## 🔑 AUTH — CLERK

### Key Rules

- Clerk keys expire. If you see auth errors in CI/Vercel, **the key is likely expired or invalid**.
- Never use placeholder keys like `pk_test_placeholder` — Clerk will reject them silently or loudly.
- Keys live in Infisical. Pull fresh before testing.

```bash
# Check current keys
infisical run --env=dev -- env | grep CLERK

# Clerk env var names
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   ← client-safe, prefixed NEXT_PUBLIC_
CLERK_SECRET_KEY                    ← server only, never expose
```

### Middleware Setup

```typescript
// middleware.ts — always at project root
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})
```

**Stripe is disabled.** Do not add Stripe-related code or dependencies.

---

## 🚀 VERCEL DEPLOYMENT

### Auto-Deploy Rules

| Branch       | Deploys To| URL                              |
|-------------|----------|---------------------------------|
| `main`       | Production| `your-app.vercel.app`            |
| `staging`    | Preview   | `your-app-git-staging.vercel.app`|
| Any PR branch| Preview   | Auto-generated URL               |

Every `git push` triggers a Vercel deploy. **This is your primary testing method.**

```bash
# Check deploy status
vercel ls

# View logs for latest deploy
vercel logs --follow

# Promote staging to production manually
vercel promote [deployment-url]

# ❌ Never use `vercel dev` — it runs a local server
```

### Common Vercel Failure Causes

1. **Invalid/expired Clerk keys** — most common. Refresh from Clerk dashboard → Infisical.
2. **Placeholder env vars** — check Infisical for `PLACEHOLDER`, `YOUR_KEY`, `TODO` values.
3. **Missing Infisical sync** — run `infisical push` if new secrets were added locally.
4. **Bun version mismatch** — check `package.json` `engines.bun` field matches Vercel setting.
5. **TypeScript errors** — fix locally with `bun run typecheck` before pushing.

---

## 🐙 GITHUB WORKFLOW

### Branch Strategy

```
main          ← production. Protected. No direct pushes.
staging       ← pre-production. Merges tested here first.
feat/*        ← feature branches. PR into staging.
fix/*         ← bug fixes. PR into staging.
hotfix/*      ← emergency production fixes. PR into main.
```

### Commit Message Format

```
type(scope): description

feat(auth): add Clerk webhook handler
fix(ui): correct Tailwind v4 border token
chore(deps): update Bun to 1.x.x
refactor(api): extract rate limiter to middleware
```

### PR Rules

- All PRs must pass: typecheck + lint + build
- No `any` types without `// TODO: fix type` comment
- No hardcoded secrets — CI scans for these
- No `console.log` in production code — use structured logging

---

## 🤖 AI TOOLS — OPENCLAW / NOVA

OpenClaw is the WhatsApp AI agent. It is **not your concern** unless explicitly told.

### Do Not Touch

```bash
# These LaunchAgents manage OpenClaw. Never modify.
ai.openclaw.gateway
ai.openclaw.watchdog

# If OpenClaw is using too much RAM, REPORT IT. Do not kill it.
# Killing it triggers the watchdog → respawn loop → CPU spike → freeze.
```

### OpenClaw Architecture (read only)

| Component    | Detail                                        |
|-------------|----------------------------------------------|
| Runtime      | Bun                                           |
| Primary Model| GLM-5 via z.ai                                |
| STT          | Native OpenClaw (near-zero cost)              |
| TTS          | ElevenLabs `edge` provider, `auto: inbound`   |
| Memory Limit | 1.5GB (defined in start script, do not change)|
| Config SSOT  | LaunchAgents (not PM2)                        |

**PM2 is permanently disabled.** Never start it. LaunchAgents are the only process manager.

---

## 🔧 SYSTEM COMMANDS — APPROVED TOOLS

### Memory Check (always run before builds)

```bash
memory-check
```

### Safe Dev Operations

```bash
dev-safe build      ← type + build check, no server
dev-safe preview    ← requires code 5020, port 3333, 10 min limit
```

### Process Investigation (read only — never kill blindly)

```bash
# Check what's using memory
ps aux -m | head -15

# Check specific process
ps aux | grep "process-name"

# Check port usage
lsof -i tcp:3333

# Check LaunchAgents
launchctl list | grep -i openclaw
```

### Safe to Kill (only these, only if confirmed stuck)

```bash
# Only with explicit human approval:
pkill -9 -f "bun.*dev"        # stuck dev server
pkill -9 -f "next.*dev"       # stuck Next.js dev

# NEVER without approval:
# sshd, tailscaled, openclaw, AnyDesk
```

### Spotlight — Disable on HDD (already done, verify)

```bash
# Check if disabled
mdutil -s /
# Should show: "Indexing disabled."

# If somehow re-enabled (re-disable immediately):
sudo mdutil -a -i off
```

---

## 📋 AGENT SESSION CHECKLIST

Before starting any task, verify:

```
□ Read this CLAUDE.md fully
□ Run memory-check — confirm < 70% used
□ Confirm task does NOT require running a local server
□ If build needed: use dev-safe build only
□ If secrets needed: pull from Infisical or Keychain, never hardcode
□ If pushing to git: run typecheck + lint locally first
□ After task: confirm no background processes left running
□ After task: run memory-check again to confirm no leak
```

---

## 🚨 EMERGENCY PROTOCOLS

### Machine Feels Slow / Unresponsive

```bash
memory-check           # Step 1: assess
# If > 85%:
ps aux -m | head -10   # Step 2: identify culprit
# Step 3: REPORT to human, do not kill blindly
```

### SSH Connection Dropped

Do not panic. Try:

1. Reconnect via Tailscale SSH: `ssh ahmadabdullah@mac-mini.your-tailnet.ts.net`
2. If Tailscale is unreachable: try AnyDesk
3. If both fail: physical access required — report immediately

### Dev Server Stuck on Wrong Port

```bash
# Only approved cleanup — port 3333 only
lsof -ti tcp:3333 | xargs kill -9
rm -f /tmp/xmad-dev.lock
# Then: dev-safe preview (with code 5020)
```

### Build Failing on Vercel But Not Locally

Checklist in order:

1. `bun run typecheck` — any errors?
2. `bun run lint` — any errors?
3. Check Infisical for expired/placeholder secrets
4. Check Vercel build logs for the exact error line
5. Check Clerk dashboard — are keys still valid?
6. Check `package.json` Bun version matches Vercel config

---

## 📌 QUICK REFERENCE CARD

```
TESTING HIERARCHY (cheapest → most expensive):
  1. bun run typecheck        → 0 memory, instant
  2. bun run lint             → < 50MB, fast
  3. dev-safe build           → < 700MB, no server
  4. git push → Vercel        → 0 local memory, preferred
  5. sudo dev-safe preview    → code 5020, port 3333, 10min

SECRETS:
  Local API keys  → macOS Keychain
  App secrets     → Infisical → Vercel env
  CI secrets      → GitHub Secrets

NEVER:
  bun dev / next dev / any local server without dev-safe
  Kill sshd / tailscaled / openclaw LaunchAgents
  Hardcode any key or token
  Run ulimit -v or ulimit -u (breaks Bun on macOS)
  Use PM2 (disabled, LaunchAgents are SSOT)
```

---

*Last updated: March 2026 · Machine: Mac Mini 8GB HDD · Owner: Ahmad Abdulla*
*Stack: Next.js 16.1.6 · React 19 · Tailwind v4 · TypeScript 5.9 · Bun · Biome · Turborepo*
*Services: Supabase · Clerk · Vercel · GitHub · Infisical · Keychain*
