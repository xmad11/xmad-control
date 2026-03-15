# Safe Development Workflow

> Enterprise-grade validation pipeline for the XMAD Control repository.

## Overview

This repository enforces a **safe development workflow** that prohibits running local development servers. Instead, all validation happens through static analysis and production builds, with runtime testing performed on Vercel preview deployments.

## Why Dev Mode is Forbidden

### System Constraints

The Mac mini hosting this repository serves multiple critical functions:

- **Git Automation Node** - Automated commits, pushes, and repository management
- **SSH + Tailscale Gateway** - Secure remote access infrastructure
- **Build Validator** - CI/CD pipeline validation
- **Monitoring Daemon Host** - System health monitoring services
- **OpenClaw Runtime** - Core application runtime

### Memory Limitations

Running development servers with hot reload and file watchers:
- Consumes 500MB-2GB+ of RAM per instance
- Creates multiple Node.js processes
- Runs persistent file system watchers
- Can trigger memory pressure events

When memory is exhausted:
- System becomes unresponsive
- Critical services may crash
- SSH connections can be terminated
- Recovery requires manual intervention

## The Safe Workflow

### 1. Local Development

```bash
# Make your code changes
# Then validate locally:

bun run safe
```

This runs three validation steps:
1. **TypeCheck** (`tsc --noEmit`) - Catches TypeScript errors
2. **Lint** (`biome lint`) - Enforces code quality rules
3. **Build** (`next build`) - Validates production build succeeds

### 2. Commit and Push

```bash
git add .
git commit -m "feat: your feature description"
git push
```

The **pre-push hook** automatically runs validation. If validation fails:
- Push is blocked
- Errors are displayed
- Fix issues and retry

### 3. Runtime Testing on Vercel

After successful push:
1. Vercel automatically deploys a preview
2. Preview URL appears in PR or Vercel dashboard
3. Test your changes in the cloud environment
4. Verify UI, API routes, and integrations

### 4. Smoke Testing

For automated endpoint validation, use the smoke test script:

```bash
bun run smoke
```

This validates:
- Homepage loads (200 OK)
- API routes respond correctly
- Response headers are valid
- No crash loops detected

## Command Reference

| Command | Description |
|---------|-------------|
| `bun run safe` | Full validation pipeline |
| `bun run check:ts` | TypeScript validation only |
| `bun run lint` | Biome linting only |
| `bun run build` | Production build only |
| `bun run fix` | Auto-fix linting issues |
| `bun run smoke` | HTTP smoke tests |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL MACHINE                            │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  TypeCheck  │───▶│    Lint     │───▶│   Build     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                            │                                │
│                            ▼                                │
│                    ┌─────────────┐                         │
│                    │  git push   │                         │
│                    └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CLOUD                             │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Deploy    │───▶│   Preview   │───▶│    Test     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Emergency Memory Policy

If you accidentally run a dev server or memory pressure occurs:

### Immediate Actions

```bash
# 1. Kill the process
Ctrl+C

# 2. Kill any orphan processes
pkill -f "next dev"
pkill -f "bun dev"
pkill -f "node.*next"

# 3. Check memory status
top -l 1 | head -15

# 4. If memory critical, run stabilizer
~/xmad-control/modules/monitor/autostabilizer/stabilizer-ctl.sh status
```

### Recovery

If system becomes unresponsive:
1. Wait 30 seconds for stabilizer to act
2. If no recovery, force restart: `sudo reboot`
3. After reboot, verify services: `bun run safe`

## Best Practices

### Do's ✅

- Always run `bun run safe` before pushing
- Use TypeScript strictly - catch errors at compile time
- Write comprehensive tests that don't require a running server
- Use Vercel previews for all runtime testing
- Keep changes small and focused

### Don'ts ❌

- Never run `bun dev` or `next dev`
- Never start file watchers (`tailwind --watch`)
- Never run Playwright in headed mode
- Never leave background processes running
- Never skip validation before pushing

## Troubleshooting

### Validation Fails

1. Read the error message carefully
2. Fix TypeScript errors first (they often cause build failures)
3. Run `bun run fix` to auto-fix linting issues
4. Re-run `bun run safe`

### Pre-Push Hook Not Running

```bash
# Ensure hook is executable
chmod +x .git/hooks/pre-push

# Verify hook exists
cat .git/hooks/pre-push
```

### Build Memory Issues

If build itself causes memory issues:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install

# Try build again
bun run build
```

---

**Questions?** Contact the system administrator or check `.claude/DEV_POLICY.md` for the complete policy.
