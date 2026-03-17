# Phase 3: Non-UI Remaining Tasks

> **Priority:** MEDIUM - Technical Debt & Cleanup
> **Dependencies:** Phase 1 & 2 complete
> **Estimated Time:** 4-6 hours

---

## 📁 DOCUMENTATION GOVERNANCE

### 3.1 Create Documentation Directory Structure

**Create directories:**
```bash
mkdir -p ~/xmad-control/docs/architecture
mkdir -p ~/xmad-control/docs/operations
mkdir -p ~/xmad-control/docs/security
mkdir -p ~/xmad-control/docs/archive/progress-logs
mkdir -p ~/xmad-control/docs/archive/ui-legacy
mkdir -p ~/xmad-control/docs/archive/runtime-legacy
```

**Final structure:**
```
docs/
├── architecture/       ← NEW - System design docs
│   ├── UI_ARCHITECTURE.md
│   ├── API_DESIGN.md
│   └── SURFACE_SYSTEM.md
├── operations/         ← NEW - Runbooks, procedures
│   ├── DEPLOYMENT.md
│   ├── MONITORING.md
│   └── INCIDENT_RESPONSE.md
├── security/           ← NEW - Security docs
│   ├── ENV_AUDIT_2026-03-17.md
│   ├── KEYCHAIN_SETUP.md
│   └── TAILSCALE_SETUP.md
├── archive/            ← NEW - Archived content
│   ├── progress-logs/
│   ├── ui-legacy/
│   └── runtime-legacy/
├── audit/              ← EXISTS
├── plans/              ← EXISTS
├── API_REFERENCE.md    ← EXISTS
├── OPENCLAW.md         ← EXISTS
└── ...
```

---

### 3.2 Create Architecture Documentation

**File:** `docs/architecture/UI_ARCHITECTURE.md`

```markdown
# UI Architecture Decision Record

## Context
XMAD Control Center needed a dashboard architecture.

## Decision
We chose **Surface-based architecture** over traditional Next.js pages.

## Rationale
- Single-page app feel without full SPA complexity
- Lazy loading of surfaces for performance
- Centralized state via DashboardDataContext
- Glass morphism design system
- Tab navigation with auto-collapse

## Consequences
- ✅ Fast tab switching (no page loads)
- ✅ Shared state between surfaces
- ✅ Consistent glass UI throughout
- ❌ Requires SurfaceManager complexity
- ❌ Not standard Next.js routing
```

**File:** `docs/architecture/SURFACE_SYSTEM.md`

```markdown
# Surface System Architecture

## Overview
Surfaces are lazy-loaded UI panels rendered by SurfaceManager.

## Key Files
- `config/surfaces.ts` - Surface registry and configuration
- `runtime/SurfaceManager.tsx` - Surface renderer with caching
- `runtime/useSurfaceController.ts` - Tab controller hook

## Surface Types
| Type | Z-Index | Use Case |
|------|---------|----------|
| center | 10 | Default content |
| right | 100 | Side panels |
| fullscreen | 50 | VNC, Terminal |

## Adding a New Surface
1. Create `surfaces/my-surface.surface.tsx`
2. Register in `config/surfaces.ts`
3. Add tab in HomeClient if needed
```

---

### 3.3 Create Operations Documentation

**File:** `docs/operations/DEPLOYMENT.md`

```markdown
# Deployment Procedures

## Production Deployment
1. Run `bun run typecheck` - Must pass
2. Run `bun run lint` - Must pass
3. Run `dev-safe build` - Local build test
4. Push to main branch
5. Vercel auto-deploys

## Rollback
1. `vercel rollback [deployment-url]`
2. Verify health endpoint

## Emergency
1. SSH via Tailscale
2. Run `bash ~/xmad-control/bootstrap/stop-platform.sh`
3. Investigate logs
4. Run `bash ~/xmad-control/bootstrap/start-platform.sh`
```

---

### 3.4 Create Security Documentation

**File:** `docs/security/ENV_AUDIT_2026-03-17.md`

```markdown
# Environment & Secrets Audit

## Date: 2026-03-17

## Findings

### Hardcoded Secrets Found (FIXED)
| File | Issue | Status |
|------|-------|--------|
| `openclaw/configs/auth-profiles.json` | API key | Removed |
| `modules/claude/claude-direct` | Anthropic token | Removed |
| `modules/claude/claude-zai` | Anthropic token | Removed |

### Keychain Services
| Service | Account | Purpose |
|---------|---------|---------|
| `z.ai` | `openclaw` | OpenClaw GLM gateway |
| `anthropic` | `claude` | Claude API |
| `groq/xmad` | `xmad` | Groq STT |
| `elevenlabs/xmad` | `xmad` | ElevenLabs TTS |

### .gitignore Verification
- `.env.local` - Ignored ✅
- `.env.*.local` - Ignored ✅
- `*.mp3`, `*.wav` - Ignored ✅

## Recommendations
1. Rotate all exposed API keys
2. Add pre-commit hook to scan for secrets
3. Quarterly security audit
```

---

## 🗄️ ARCHIVE OPERATIONS

### 3.5 Archive Legacy Code

**Archive features/control-center/:**
```bash
# Create archive directory
mkdir -p ~/xmad-control/docs/archive/ui-legacy/features-control-center

# Move legacy code
mv ~/xmad-control/features/control-center/* \
   ~/xmad-control/docs/archive/ui-legacy/features-control-center/

# Keep features directory for home
rmdir ~/xmad-control/features/control-center 2>/dev/null || true
```

**Archive runtime/ (if contains legacy):**
```bash
mkdir -p ~/xmad-control/docs/archive/runtime-legacy
# Only archive actual legacy files, keep SurfaceManager and useSurfaceController
```

---

### 3.6 Archive Progress Logs

**Move completed progress files:**
```bash
# Already cleaned - these don't exist at root anymore
# If they reappear, move to archive:
mv DASHBOARD_*.md ~/xmad-control/docs/archive/progress-logs/ 2>/dev/null || true
mv REFACTOR_*.md ~/xmad-control/docs/archive/progress-logs/ 2>/dev/null || true
```

---

## 📜 SCRIPTS ORGANIZATION

### 3.7 Create Scripts README

**File:** `scripts/README.md`

```markdown
# Scripts Directory

## Build Scripts
| Script | Purpose |
|--------|---------|
| `serve-dashboard.js` | Serves coordinator dashboard on port 3579 |
| `update-dashboard.js` | Updates coordinator dashboard |

## Audit Scripts
| Script | Purpose |
|--------|---------|
| `audit-runner.ts` | Runs all audit checks |
| `validate-all.ts` | Validates project structure |

## Heap Analysis
| Script | Purpose |
|--------|---------|
| `analyze-heap.ts` | Class-based heap analyzer |
| `analyze-heap-v2.ts` | Feature-complete analyzer |
| `analyze-heap-simple.ts` | Simple comparison tool |
| `analyze-heap.py` | Python alternative |

## Utilities
| Script | Purpose |
|--------|---------|
| `backup.sh` | Create system backup |
| `load-secrets.sh` | Load secrets from Keychain |

## Subdirectories
- `audit/` - Audit-related scripts (17 files)
- `verification/` - Verification scripts
```

---

### 3.8 Organize Scripts by Function

**Create subdirectories (if needed):**
```bash
# Already have audit/ and verification/
# Optional: create build/ and utilities/

mkdir -p ~/xmad-control/scripts/build
mkdir -p ~/xmad-control/scripts/utilities

# Move files (optional, current structure works)
# mv scripts/serve-dashboard.js scripts/build/
# mv scripts/backup.sh scripts/utilities/
```

---

## 🧹 CLEANUP TASKS

### 3.9 Remove Deprecated Files

**Delete obsolete files:**
```bash
# These should already be gone, verify:
rm -f ~/xmad-control/AGENT_TASK.md
rm -f ~/xmad-control/memory-log.txt
rm -f ~/xmad-control/migration-report.json
```

---

### 3.10 Update docs/README.md

**File:** `docs/README.md`

```markdown
# XMAD Control Center Documentation

## Quick Start
- [CLAUDE.md](../CLAUDE.md) - Start here (AI agents read this)
- [README.md](../README.md) - Project overview

## Architecture
- [UI Architecture](architecture/UI_ARCHITECTURE.md)
- [Surface System](architecture/SURFACE_SYSTEM.md)
- [API Reference](API_REFERENCE.md)

## Operations
- [Deployment Guide](operations/DEPLOYMENT.md)
- [Monitoring](operations/MONITORING.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## Security
- [Environment Audit](security/ENV_AUDIT_2026-03-17.md)
- [Keychain Setup](security/KEYCHAIN_SETUP.md)

## Services
- [OpenClaw Guide](OPENCLAW.md)
- [Modules Overview](MODULES.md)

## Archive
- [Progress Logs](archive/progress-logs/)
- [Legacy UI](archive/ui-legacy/)
- [Legacy Runtime](archive/runtime-legacy/)

## For AI Agents
This documentation follows the SSOT principle.
All paths reference `~/xmad-control/` as the single source of truth.
```

---

## 🔧 SYSTEM SCRIPTS FIXES

### 3.11 Fix Swap Detection Bug

**File:** `modules/monitor/system-resource-bridge.sh`

**Line 115 - Fix swap detection:**
```bash
# ❌ BROKEN (uses $3 which doesn't exist)
pageouts=$(vm_stat | awk '/Pageouts/ {print $3}' | tr -d '.')

# ✅ FIX (use $2 with gsub)
pageouts=$(vm_stat | awk '/Pageouts/ {gsub(/\./, "", $2); print $2}')
```

---

### 3.12 Add Load Monitoring

**File:** `modules/monitor/system-resource-bridge.sh`

**Add load monitoring function:**
```bash
get_load_avg() {
  # Get 1-minute load average
  local load=$(sysctl -n vm.loadavg 2>/dev/null | awk '{print $2}')
  echo "${load:-0}"
}

is_load_high() {
  local load=$(get_load_avg)
  local threshold="${LOAD_THRESHOLD:-2.0}"
  if [[ $(echo "$load > $threshold" | bc -l 2>/dev/null) -eq 1 ]]; then
    return 0  # High load
  fi
  return 1  # Normal load
}
```

---

### 3.13 Fix OPENCLAW_CONFIG Path

**File:** `~/.zshrc`

**Line 190 - Fix config path:**
```bash
# ❌ WRONG
OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"

# ✅ FIX
OPENCLAW_CONFIG="$HOME/xmad-control/openclaw/configs/openclaw.json"
```

---

## 📋 PHASE 3 CHECKLIST

```
Documentation Governance:
  □ Create docs/architecture/ directory
  □ Create docs/operations/ directory
  □ Create docs/security/ directory
  □ Create docs/archive/ subdirectories
  □ Write UI_ARCHITECTURE.md
  □ Write SURFACE_SYSTEM.md
  □ Write DEPLOYMENT.md
  □ Write ENV_AUDIT_2026-03-17.md
  □ Update docs/README.md

Archive Operations:
  □ Archive features/control-center/ to docs/archive/ui-legacy/
  □ Move any progress logs to archive
  □ Verify features/home/ remains (it's active)

Scripts Organization:
  □ Create scripts/README.md
  □ Optionally create build/ and utilities/ subdirs

Cleanup:
  □ Remove any remaining obsolete files
  □ Add audio patterns to .gitignore

System Fixes:
  □ Fix swap detection in system-resource-bridge.sh
  □ Add load monitoring function
  □ Fix OPENCLAW_CONFIG in ~/.zshrc
```

---

## ✅ SUCCESS CRITERIA

| Check | Verification |
|-------|--------------|
| Docs organized | `ls docs/architecture docs/operations docs/security` |
| Legacy archived | `ls docs/archive/ui-legacy/` |
| Scripts documented | `cat scripts/README.md` |
| Swap detection fixed | Test `get_swap_pageouts()` function |
| Config path fixed | `echo $OPENCLAW_CONFIG` shows correct path |

---

## 📊 FINAL PROJECT STATUS

After all 3 phases complete:

| Category | Status |
|----------|--------|
| Security | ✅ No hardcoded secrets |
| Code Quality | ✅ TypeScript passes, lint < 10 errors |
| Dashboard UI | ✅ All 5 tabs functional |
| Documentation | ✅ Organized governance |
| Archive | ✅ Legacy code archived |
| Scripts | ✅ Documented and organized |
| System Scripts | ✅ Bugs fixed |

---

**END OF 3-PHASE PLAN**
