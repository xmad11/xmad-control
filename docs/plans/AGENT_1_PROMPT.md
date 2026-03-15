# AGENT 1: Runtime Kernel & OpenClaw Stabilization

> **READ THIS ENTIRE DOCUMENT BEFORE STARTING**
>
> **Your Scope:** OpenClaw runtime, bootstrap, modules/openclaw, runtime, modules/guardian
> **Agent 2 Scope:** Frontend, Documentation, Scripts, Root Files
> **NO OVERLAP - Safe Parallel Execution**

---

## ⚠️ FIRST STEP: Create Your Branch

**Before doing ANY work, create a new branch:**

```bash
# 1. Verify you're on feature/dashboard-spacing-fix
git branch

# 2. Pull latest changes
git pull origin feature/dashboard-spacing-fix 2>/dev/null || true

# 3. Create YOUR branch (Agent 1)
git checkout -b cleanup/agent-1-runtime-kernel

# 4. Verify clean state
git status --short
```

**Branch naming:**
- Agent 1: `cleanup/agent-1-runtime-kernel`
- Agent 2: `cleanup/agent-2-frontend-monorepo`

---

## Mission

Create a single deterministic AI runtime core and eliminate all shadow/duplicate systems.

---

## Your Scope (EXCLUSIVE)

You have FULL control over these directories:

```
openclaw/               ← Main SSOT runtime (KEEP)
modules/openclaw/       ← Stale duplicate (ARCHIVE after merge)
runtime/                ← Shadow system (DELETE)
bootstrap/              ← Platform lifecycle scripts
modules/guardian/       ← Orchestration (runtime parts)
modules/monitor/        ← Health monitoring
modules/network/        ← Network utilities
modules/core/server/    ← API gateway
```

## DO NOT TOUCH (Agent 2 Territory)

```
app/                    ← Agent 2 handles
features/               ← Agent 2 handles
components/             ← Agent 2 handles
docs/                   ← Agent 2 handles
scripts/                ← Agent 2 handles
Root *.md files         ← Agent 2 handles
public/                 ← Agent 2 handles
config/                 ← Agent 2 handles
```

---

## Task 1: Detect and Consolidate OpenClaw Runtimes

### Current State

| Location | Size | Status | Action |
|----------|------|--------|--------|
| `openclaw/` | 27MB | ACTIVE (SSOT) | KEEP |
| `modules/openclaw/` | 29MB | STALE | ARCHIVE after merge |
| `runtime/openclaw-home*` | 44KB | EXPERIMENTAL | DELETE |

### Evidence from Audit

**Active config (`openclaw/configs/openclaw.json`):**
```json
"workspace": "/Users/ahmadabdullah/xmad-control/openclaw/workspace"
```

**Stale config (`modules/openclaw/openclaw.json`):**
```json
"workspace": "/Users/ahmadabdullah/.openclaw/workspace"
```

### Actions Required

**Step 1.1: Compare memory databases**
```bash
# Check if stale DB has unique data
sqlite3 openclaw/memory/main.sqlite ".dump" > /tmp/active_memory.sql
sqlite3 modules/openclaw/memory/main.sqlite ".dump" > /tmp/stale_memory.sql
diff /tmp/active_memory.sql /tmp/stale_memory.sql
```

**Step 1.2: Compare credentials**
```bash
# Check if stale has unique credentials
ls -la openclaw/credentials/
ls -la modules/openclaw/credentials/
diff -r openclaw/credentials/ modules/openclaw/credentials/ 2>/dev/null || echo "Different"
```

**Step 1.3: Archive stale OpenClaw**
```bash
# Create archive location
mkdir -p docs/archive/runtime-legacy/modules-openclaw-backup

# Move stale runtime
mv modules/openclaw/* docs/archive/runtime-legacy/modules-openclaw-backup/

# Remove empty directory
rmdir modules/openclaw
```

---

## Task 2: Remove Shadow Runtime System

### Current State

```
runtime/
├── env-loader.sh
├── logs/ (empty)
├── openclaw-home/ (empty shadow)
├── openclaw-home-shadow/ (experimental)
├── openclaw-home-shadow-test/ (test shadow)
├── openclaw-mirror-launch.sh
├── pids/ (empty)
├── shadow-dual-test.sh
└── tmp/ (empty)
```

### Actions Required

**Step 2.1: Archive design docs if any**
```bash
# Check for any valuable documentation
find runtime/ -name "*.md" -o -name "*.txt" 2>/dev/null

# If found, move to archive
mkdir -p docs/archive/runtime-legacy/shadow-system
mv runtime/*.md docs/archive/runtime-legacy/shadow-system/ 2>/dev/null || true
```

**Step 2.2: Delete shadow system**
```bash
# Remove entire runtime folder
rm -rf runtime/
```

---

## Task 3: Stabilize Watchdog Authority

### Current State

Launch agent correctly points to SSOT:
- Script: `/Users/ahmadabdullah/xmad-control/openclaw/scripts/start-ssot.sh`
- Config: `/Users/ahmadabdullah/xmad-control/openclaw/configs/openclaw.json`

### Actions Required

**Step 3.1: Verify single watchdog**
```bash
# Check for duplicate watchdog scripts
find . -name "watchdog*" -type f 2>/dev/null | grep -v node_modules

# Should only find: openclaw/scripts/watchdog.sh
```

**Step 3.2: Verify launch agent paths**
```bash
cat openclaw/launch_agents/ai.openclaw.gateway.plist
cat openclaw/launch_agents/ai.openclaw.watchdog.plist
```

**Step 3.3: Ensure memory limit is enforced**
```bash
# Check config has memory limit
grep -A5 "memory" openclaw/configs/openclaw.json
```

---

## Task 4: Script Governance Enforcement

### Actions Required

**Step 4.1: Identify misplaced scripts**
```bash
# Find any runtime scripts outside openclaw/scripts
find . -name "*.sh" -path "*/scripts/*" 2>/dev/null | grep -v node_modules | grep -v openclaw/scripts
```

**Step 4.2: Move if needed**
```bash
# Any runtime scripts found should move to openclaw/scripts/
# System monitoring scripts stay in modules/monitor/
# Env boot scripts stay in bootstrap/
```

---

## Task 5: Security Pass

### Actions Required

**Step 5.1: Verify single memory DB**
```bash
find . -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null | grep -v node_modules

# Should only find: openclaw/memory/main.sqlite
# (modules/openclaw already archived)
```

**Step 5.2: Verify single credentials folder**
```bash
find . -type d -name "credentials" 2>/dev/null | grep -v node_modules

# Should only find: openclaw/credentials/
```

**Step 5.3: Check for plaintext secrets**
```bash
# Check env files for secrets
grep -r "api_key\|apikey\|secret\|password" openclaw/ --include="*.env*" 2>/dev/null || echo "None found"
```

**Step 5.4: Verify file permissions**
```bash
ls -la openclaw/credentials/
ls -la openclaw/identity/
ls -la openclaw/memory/
```

---

## Task 6: Workspace Media Cleanup

### Current State

12 MP3 files in `openclaw/workspace/`:
- `nova-auto-reply-*.mp3`
- `nova-reply-*.mp3`
- `direct-voice-*.mp3`
- `test-voice-*.mp3`

### Actions Required

**Step 6.1: Move voice files**
```bash
# Create media location
mkdir -p openclaw/media/voice-replies

# Move MP3 files
mv openclaw/workspace/*.mp3 openclaw/media/voice-replies/ 2>/dev/null || echo "No mp3 files"
```

---

## Task 7: Generate Final Report

After completing all tasks, create:

`docs/runtime/RUNTIME_FINAL_REPORT.md`

```markdown
# Runtime Kernel Final Report

**Date:** 2026-03-15
**Agent:** Runtime Kernel Cleanup (Agent 1)

## Completed Tasks

### [x] Task 1: OpenClaw Consolidation
- Merged data from stale DB: [yes/no]
- Archived modules/openclaw to: docs/archive/runtime-legacy/
- SSOT confirmed: openclaw/

### [x] Task 2: Shadow System Removal
- Deleted: runtime/
- Archived docs: [yes/no]

### [x] Task 3: Watchdog Authority
- Single watchdog: [confirmed]
- Launch agents: [verified]

### [x] Task 4: Script Governance
- Scripts moved: [list]

### [x] Task 5: Security Pass
- Single memory DB: [confirmed]
- Single credentials: [confirmed]
- Plaintext secrets: [none found / issues]

### [x] Task 6: Workspace Media
- Moved: [count] MP3 files to openclaw/media/

## Final Structure

```
openclaw/
├── agents/
├── completions/
├── configs/
│   └── openclaw.json
├── credentials/
├── cron/
├── delivery-queue/
├── devices/
├── docs/
├── hooks/
├── identity/
├── launch_agents/
├── logs/
├── media/
│   └── voice-replies/
├── memory/
│   └── main.sqlite
├── scripts/
│   ├── load-keys.sh
│   ├── recovery-enhanced.sh
│   ├── start-optimized.sh
│   ├── start-production.sh
│   ├── start-ssot.sh
│   └── watchdog.sh
├── watchdog/
└── workspace/
```

## Issues Found

[Document any issues that couldn't be resolved]

## Recommendations

[Any additional recommendations]
```

---

## Execution Checklist

Before starting, verify:

- [ ] You created your branch: `cleanup/agent-1-runtime-kernel`
- [ ] You understand your scope (OpenClaw, runtime, bootstrap)
- [ ] You will NOT touch app/, features/, components/, docs/, scripts/
- [ ] You will create atomic commits after each task
- [ ] You will create audit reports for each phase

---

## Commit Strategy

After each major task, commit:

```bash
git add [relevant files]
git commit -m "chore(runtime): [task description]

- Detail 1
- Detail 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Safety Rules

1. **Never delete without archive** - Move to archive first
2. **Small atomic commits** - One task per commit
3. **Verify runtime works** - Test gateway after changes
4. **Document everything** - Update relevant docs
5. **Report blockers** - If stuck, document why

---

## What Success Looks Like

After Agent 1 completes:

```
xmad-control/
├── openclaw/           ← Single runtime (SSOT)
│   ├── configs/
│   ├── credentials/
│   ├── memory/
│   ├── scripts/
│   ├── media/
│   └── workspace/
├── modules/
│   ├── guardian/
│   ├── monitor/
│   └── core/
│       └── server/
├── bootstrap/
│   ├── start-platform.sh
│   ├── stop-platform.sh
│   └── health-platform.sh
└── docs/
    └── archive/
        └── runtime-legacy/
            └── modules-openclaw-backup/
```

Removed:
- `modules/openclaw/` (archived)
- `runtime/` (deleted)

---

## Quick Reference

### Start OpenClaw
```bash
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Check Health
```bash
curl http://127.0.0.1:18789/health
```

### View Logs
```bash
tail -f ~/xmad-control/openclaw/logs/gateway.log
```

---

**END OF AGENT 1 PROMPT**

**Handoff ready. Agent 1 can begin work immediately.**
