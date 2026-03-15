# XMAD DEV RUNTIME POLICY (MANDATORY)

> ⚠️ **CRITICAL**: This policy is enforced to protect the Mac mini control node from memory exhaustion.

## ❌ NEVER RUN THESE COMMANDS

```bash
bun dev
next dev
npm run dev
yarn dev
pnpm dev
vite dev
tailwind --watch
tailwindcss --watch
playwright headed
npx playwright test --headed
```

Any command that starts a **file watcher**, **hot reload server**, or **browser instance** is **FORBIDDEN** on this machine.

## ✅ MANDATORY WORKFLOW

Follow this pipeline **every time** before pushing code:

### Step 1: Edit Code
Make your changes to the codebase.

### Step 2: Run Safe Validation
```bash
bun run safe
```

This runs:
1. `typecheck` - TypeScript validation
2. `lint` - Biome linting
3. `build` - Production build

### Step 3: Commit and Push
```bash
git add .
git commit -m "your message"
git push
```

The pre-push hook will automatically run validation. If it fails, fix errors and try again.

### Step 4: Validate on Vercel
After push, validate your changes on the Vercel preview URL:
- Check the deployment URL in Vercel dashboard
- Test UI/UX in the cloud preview environment
- Verify API routes return expected responses

## 🚨 WHY THIS POLICY EXISTS

This Mac mini serves as:
- Git automation node
- SSH + Tailscale gateway
- Light build validator
- Monitoring daemon host
- OpenClaw runtime

It has **limited RAM** and runs **infrastructure services**.

Running dev servers, file watchers, or browser instances will:
- Consume excessive memory
- Risk system instability
- Potentially crash critical services

## 📋 QUICK REFERENCE

| Task | Command |
|------|---------|
| Safe validation | `bun run safe` |
| Typecheck only | `bun run check:ts` |
| Lint only | `bun run lint` |
| Build only | `bun run build` |
| Fix lint issues | `bun run fix` |

## 🔧 EMERGENCY PROCEDURES

If you accidentally run a dev server:

1. **Kill it immediately**: `Ctrl+C`
2. **Check memory**: `top -l 1 | head -15`
3. **Kill orphan processes**: `pkill -f "next dev"` or `pkill -f "bun dev"`
4. **Report incident** to system administrator

---

**This policy is non-negotiable. Violations risk system stability.**
