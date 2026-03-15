# AGENT 2: Frontend & Monorepo Architecture Cleanup

> **READ THIS ENTIRE DOCUMENT BEFORE STARTING**
>
> **Your Scope:** Frontend, Documentation, Scripts, Root Files
> **Agent 1 Scope:** OpenClaw runtime, bootstrap, modules/openclaw
> **NO OVERLAP - Safe Parallel Execution**

---

## ⚠️ FIRST STEP: Create Your Branch

**Before doing ANY work, create a new branch:**

```bash
# 1. Verify you're on feature/dashboard-spacing-fix
git branch

# 2. Pull latest changes
git pull origin feature/dashboard-spacing-fix 2>/dev/null || true

# 3. Create YOUR branch (Agent 2)
git checkout -b cleanup/agent-2-frontend-monorepo

# 4. Verify clean state
git status --short
```

**Branch naming:**
- Agent 1: `cleanup/agent-1-runtime-kernel`
- Agent 2: `cleanup/agent-2-frontend-monorepo`

---

## Mission

Create a clean, scalable UI monorepo with zero duplication and proper documentation governance.

---

## Your Scope (EXCLUSIVE)

You have FULL control over these directories:

```
app/                    ← Production UI (App Router)
features/               ← Legacy UI (to archive)
components/             ← Shared components
context/                ← React context providers
hooks/                  ← Custom React hooks
lib/                    ← Utility libraries
styles/                 ← Global styles
docs/                   ← Documentation
scripts/                ← Build/dev scripts (NOT openclaw/scripts)
public/                 ← Static assets
config/                 ← Configuration files
Root files (*.md, *.json in project root)
```

## DO NOT TOUCH (Agent 1 Territory)

```
openclaw/               ← Agent 1 handles
modules/openclaw/       ← Agent 1 handles
modules/guardian/       ← Agent 1 handles (runtime parts)
modules/monitor/        ← Agent 1 handles
modules/network/        ← Agent 1 handles
modules/core/server/    ← Agent 1 handles
runtime/                ← Agent 1 handles (will delete)
bootstrap/              ← Agent 1 handles
```

---

## Task 1: Dashboard Architecture Decision

### Current State
- `app/dashboard/` - **PRODUCTION** (Next.js App Router, active)
- `features/control-center/` - **LEGACY** (old feature-based architecture)

### Actions Required

**Step 1.1: Verify app/dashboard is production**
```bash
# Check it has complete implementation
ls -la app/dashboard/
cat app/dashboard/page.tsx
cat app/dashboard/layout.tsx
```

**Step 1.2: Archive features/control-center**
```bash
# Create archive location
mkdir -p docs/archive/ui-legacy/features-control-center

# Move the legacy UI
mv features/control-center/* docs/archive/ui-legacy/features-control-center/

# Remove empty features directory
rmdir features/control-center
rmdir features  # if empty
```

**Step 1.3: Document the decision**
Create `docs/architecture/UI_ARCHITECTURE_FINAL.md`:

```markdown
# UI Architecture Decision

## Production UI: app/dashboard/

**Architecture:** Next.js App Router (Next.js 16)
**Location:** `app/dashboard/`
**Status:** Active

### Structure
- `app/dashboard/page.tsx` - Main dashboard
- `app/dashboard/layout.tsx` - Dashboard layout
- `app/dashboard/automation/` - Automation tab
- `app/dashboard/backups/` - Backups tab
- `app/dashboard/memory/` - Memory tab
- `app/dashboard/screen/` - Screen tab
- `app/dashboard/settings/` - Settings tab

### Why App Router
- Server components ready
- Streaming compatible
- Edge deployment ready
- Better mobile SSR
- Aligns with Next.js long-term roadmap

## Archived: features/control-center/

**Moved to:** `docs/archive/ui-legacy/features-control-center/`
**Reason:** Replaced by App Router implementation
**Date:** 2026-03-15
```

---

## Task 2: Root Pollution Cleanup

### Files to Process

**MOVE to `docs/archive/`:**
```
DASHBOARD_FINAL_SUMMARY.md
DASHBOARD_REFACTOR_SUMMARY.md
REFACTOR_PROGRESS.md
```

**MOVE to `docs/plans/`:**
```
DASHBOARD_AUDIT_AND_REFACTOR_PLAN.md
```

**DELETE (temporary files):**
```
AGENT_TASK.md
memory-log.txt
migration-report.json
```

### Actions Required

**Step 2.1: Create archive structure**
```bash
mkdir -p docs/archive/progress-logs
mkdir -p docs/plans
```

**Step 2.2: Move progress logs**
```bash
mv DASHBOARD_FINAL_SUMMARY.md docs/archive/progress-logs/
mv DASHBOARD_REFACTOR_SUMMARY.md docs/archive/progress-logs/
mv REFACTOR_PROGRESS.md docs/archive/progress-logs/
```

**Step 2.3: Move plans**
```bash
mv DASHBOARD_AUDIT_AND_REFACTOR_PLAN.md docs/plans/
```

**Step 2.4: Delete temp files**
```bash
rm AGENT_TASK.md
rm memory-log.txt
rm migration-report.json
```

---

## Task 3: Scripts Normalization

### Current Scripts in /scripts/

**Category: BUILD/DEV (Keep)**
```
serve-dashboard.js      ← Dashboard dev server
update-dashboard.js     ← Dashboard update utility
```

**Category: AUDIT/VERIFICATION (Keep)**
```
audit-runner.ts         ← Main audit runner
analyze-heap-simple.ts  ← Memory analysis
analyze-heap-v2.ts      ← Memory analysis v2
analyze-heap.py         ← Python heap analyzer
analyze-heap.ts         ← TypeScript heap analyzer
compare-audits.ts       ← Audit comparison
validate-all.ts         ← Validation runner
validate-safe.sh        ← Safe validation
validate-coordinator.js ← Coordinator validation
```

**Category: TOOLS (Keep)**
```
create-admin-user.ts    ← Admin user creation
clone-coordinator.js    ← Coordinator cloning
migrate-images.ts       ← Image migration
generate-blurhash.ts    ← Blurhash generation
generate-dashboard.ts   ← Dashboard generator
track-history.ts        ← History tracking
ack-docs.ts             ← Documentation ack
env-guard.ts            ← Environment guard
token-guard.ts          ← Token guard
phase1-lock.ts          ← Phase lock
hard-kill.ts            ← Process killer
smoke-http-test.js      ← HTTP smoke test
security-monitor.ts     ← Security monitoring
rollback-guardian.ts    ← Guardian rollback
```

**Category: TO MOVE (to docs)**
```
memory-emergency.md           → docs/operations/
memory-optimization-complete.md → docs/archive/
task-issue.md                 → docs/archive/
```

**Category: TO DELETE (empty/placeholder)**
```
setup-placeholder.sh    ← Empty file
verify-placeholder.ts   ← Empty file
```

**Category: AUDIT SUBFOLDER (Keep as-is)**
```
scripts/audit/          ← Contains 17 audit files, keep organized
```

### Actions Required

**Step 3.1: Create scripts organization**
```bash
mkdir -p scripts/build
mkdir -p scripts/audit-tools
mkdir -p scripts/utilities
```

**Step 3.2: Delete empty placeholders**
```bash
rm scripts/setup-placeholder.sh
rm scripts/verify-placeholder.ts
```

**Step 3.3: Move documentation files**
```bash
mv scripts/memory-emergency.md docs/operations/
mv scripts/memory-optimization-complete.md docs/archive/
mv scripts/task-issue.md docs/archive/
```

**Step 3.4: Create scripts README**
Create `scripts/README.md`:

```markdown
# XMAD Control Scripts

## Structure

```
scripts/
├── build/           ← Build and development scripts
├── audit/           ← Audit runner and reports
├── audit-tools/     ← Heap analysis, validation tools
├── utilities/       ← Admin, migration, security tools
└── README.md
```

## Key Scripts

### Build/Dev
- `serve-dashboard.js` - Start dashboard dev server
- `update-dashboard.js` - Update dashboard components

### Audit
- `audit-runner.ts` - Main audit execution
- `validate-all.ts` - Run all validations
- `analyze-heap*.ts/py` - Memory analysis tools

### Utilities
- `create-admin-user.ts` - Create admin users
- `security-monitor.ts` - Security monitoring
- `rollback-guardian.ts` - Guardian rollback utility

## Note

Runtime scripts for OpenClaw are in `/openclaw/scripts/`
Platform lifecycle scripts are in `/bootstrap/`
```

---

## Task 4: Documentation Governance

### Target Structure

```
docs/
├── architecture/     ← System architecture docs
│   └── UI_ARCHITECTURE_FINAL.md
├── operations/       ← Operational procedures
│   └── memory-emergency.md
├── security/         ← Security documentation
├── plans/            ← Implementation plans
│   ├── CONSOLIDATED_PLAN.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── DASHBOARD_AUDIT_AND_REFACTOR_PLAN.md
├── archive/          ← Historical documents
│   ├── progress-logs/
│   │   ├── DASHBOARD_FINAL_SUMMARY.md
│   │   ├── DASHBOARD_REFACTOR_SUMMARY.md
│   │   └── REFACTOR_PROGRESS.md
│   ├── ui-legacy/
│   │   └── features-control-center/
│   └── other/
│       ├── memory-optimization-complete.md
│       └── task-issue.md
├── audit/            ← Audit reports (already exists)
│   └── PROJECT_STRUCTURE_AUDIT_2026-03-15.md
├── API_REFERENCE.md
├── AUDIT_REPORT.md
├── BACKUP_RECOVERY.md
├── DEPLOYMENT.md
├── MODULES.md
├── OPENCLAW.md
├── README.md
├── SAFE_DEV_WORKFLOW.md
├── SCRIPTS.md
├── SSOT_KEYS.md
└── TROUBLESHOOTING.md
```

### Actions Required

**Step 4.1: Create directory structure**
```bash
mkdir -p docs/architecture
mkdir -p docs/operations
mkdir -p docs/security
mkdir -p docs/archive/progress-logs
mkdir -p docs/archive/ui-legacy
mkdir -p docs/archive/other
```

**Step 4.2: Update docs/README.md**
Update `docs/README.md` to reflect new structure:

```markdown
# XMAD Control Documentation

## Quick Links

- [OpenClaw Guide](./OPENCLAW.md)
- [API Reference](./API_REFERENCE.md)
- [SSOT Keys](./SSOT_KEYS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## Structure

```
docs/
├── architecture/     System design documents
├── operations/       Operational procedures
├── security/         Security documentation
├── plans/            Implementation plans
├── archive/          Historical documents
├── audit/            Audit reports
└── *.md              Reference documentation
```

## For AI Agents

When working on this project:
1. Read CLAUDE.md first (project root)
2. Reference docs/architecture/ for system design
3. Check docs/plans/ for current work
4. Archive completed work to docs/archive/
```

---

## Task 5: Environment File Audit

### Files to Check

```bash
# Check these for secrets
cat .env.local
cat openclaw/workspace/.env.production
cat openclaw/workspace/.env.local
cat modules/guardian/.env
```

### Actions Required

**Step 5.1: Audit each file**
For each `.env` file:
1. Read contents
2. Identify any hardcoded secrets
3. If secrets found, document in report

**Step 5.2: Create security report**
Create `docs/security/ENV_AUDIT_2026-03-15.md`:

```markdown
# Environment File Security Audit

**Date:** 2026-03-15

## Files Audited

| File | Status | Notes |
|------|--------|-------|
| .env.local | ? | ? |
| .env.local.example | OK | Template only |
| openclaw/workspace/.env.* | ? | ? |
| modules/guardian/.env | ? | ? |
| config/ports.env | OK | Non-sensitive |
| config/paths.env | OK | Non-sensitive |

## Findings

[Document any hardcoded secrets found]

## Recommendations

1. All API keys should use macOS Keychain
2. Use `security find-generic-password -s "z.ai" -a "openclaw" -w`
3. Never commit .env files with real secrets
```

---

## Task 6: Components & UI Validation

### Actions Required

**Step 6.1: Check for duplicate components**
```bash
# Find potential duplicates
find components -name "*.tsx" | sort
```

**Step 6.2: Verify component structure**
Check that:
- No duplicate card systems
- Carousel abstraction is reusable
- Tabs state is centralized
- Theme context is single source

**Step 6.3: Document findings**
Add to `docs/architecture/UI_ARCHITECTURE_FINAL.md`:

```markdown
## Component Inventory

### Shared Components
[List key shared components]

### State Management
- Theme: [location]
- Tabs: [location]
- API: [location]

### No Duplicates Found
[Or document any issues]
```

---

## Task 7: Gitignore Updates

### Add to .gitignore

```gitignore
# Workspace media files
openclaw/workspace/*.mp3
openclaw/workspace/*.wav

# Temp files
*.tmp
*.temp
memory-log.txt

# Environment files with secrets
.env.local
.env.production
!.env.local.example

# OS files
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# Build outputs
.next/
out/
dist/
```

---

## Task 8: Final Report

After completing all tasks, create:

`docs/audit/AGENT_2_COMPLETION_REPORT.md`

```markdown
# Agent 2 Completion Report

**Date:** 2026-03-15
**Agent:** Frontend & Monorepo Cleanup

## Completed Tasks

### [x] Task 1: Dashboard Architecture
- Archived features/control-center/
- Documented decision

### [x] Task 2: Root Pollution Cleanup
- Moved progress logs
- Deleted temp files

### [x] Task 3: Scripts Normalization
- Deleted placeholders
- Organized documentation
- Created README

### [x] Task 4: Documentation Governance
- Created directory structure
- Updated README

### [x] Task 5: Environment Audit
- Checked all .env files
- Documented findings

### [x] Task 6: Components Validation
- Verified no duplicates
- Documented structure

### [x] Task 7: Gitignore Updates
- Added rules for media, temp, env files

## Files Changed

[List all files modified, moved, deleted]

## Issues Found

[Document any issues that couldn't be resolved]

## Recommendations

[Any additional recommendations]
```

---

## Execution Checklist

Before starting, verify:

- [ ] You understand your scope (Frontend, Docs, Scripts, Root)
- [ ] You will NOT touch openclaw/, modules/openclaw/, runtime/, bootstrap/
- [ ] You will create atomic commits after each task
- [ ] You will create audit reports for each phase

---

## Commit Strategy

After each major task, commit:

```bash
git add [relevant files]
git commit -m "chore(cleanup): [task description]

- Detail 1
- Detail 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Safety Rules

1. **Never delete without backup** - Move to archive first
2. **Small atomic commits** - One task per commit
3. **Test after changes** - Ensure app still builds
4. **Document everything** - Update relevant docs
5. **Report blockers** - If stuck, document why

---

## What Success Looks Like

After Agent 2 completes:

```
xmad-control/
├── app/
│   └── dashboard/        ← Single production UI
├── components/           ← Organized, no duplicates
├── docs/
│   ├── architecture/     ← System design
│   ├── operations/       ← Procedures
│   ├── security/         ← Security docs
│   ├── plans/            ← Active plans
│   ├── archive/          ← Historical
│   └── audit/            ← Reports
├── scripts/              ← Organized with README
├── features/             ← REMOVED (archived)
└── [root md files]       ← REMOVED (organized)
```

---

**END OF AGENT 2 PROMPT**

**Handoff ready. Agent 2 can begin work immediately.**
