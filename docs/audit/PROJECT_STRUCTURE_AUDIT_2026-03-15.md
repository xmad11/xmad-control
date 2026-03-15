# XMAD Control Project Structure Audit
**Date:** 2026-03-15
**Auditor:** Claude Agent 1
**Status:** CRITICAL ISSUES FOUND

---

## Executive Summary

This audit reveals **7 critical structural issues** that threaten system stability, maintainability, and security. The project has accumulated technical debt from experimental features, duplicate systems, and scattered documentation.

---

## Issue 1: Duplicate OpenClaw Installations (CRITICAL)

### Findings

| Location | Size | Config Path | Status |
|----------|------|-------------|--------|
| `openclaw/` | 27MB | `~/xmad-control/openclaw/` | ✅ ACTIVE (SSOT) |
| `modules/openclaw/` | 29MB | `~/.openclaw/` (DEPRECATED) | ❌ STALE |
| `runtime/openclaw-home*` | 44KB | Various shadows | ❌ EXPERIMENTAL |

### Evidence

**Active config (`openclaw/configs/openclaw.json`):**
```json
"workspace": "/Users/ahmadabdullah/xmad-control/openclaw/workspace"
```

**Stale config (`modules/openclaw/openclaw.json`):**
```json
"workspace": "/Users/ahmadabdullah/.openclaw/workspace"
```

### Risk Assessment
- **Memory DB divergence**: Two separate `main.sqlite` files exist
- **Credential duplication**: Both have credentials folders
- **Log fragmentation**: 5.4MB in active logs, 5.7MB in stale logs
- **Agent routing confusion**: Wrong gateway could be started

### Resolution
- **KEEP:** `openclaw/` (SSOT - confirmed by launch agent)
- **ARCHIVE:** `modules/openclaw/` (stale, points to old location)
- **DELETE:** `runtime/openclaw-home*` (experimental shadows)

---

## Issue 2: Runtime Shadow System (HIGH RISK)

### Findings

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

### Risk Assessment
- **Process conflict risk**: Multiple start scripts
- **Launchd confusion**: Could interfere with main agent
- **Memory overhead**: Unnecessary duplication
- **Undocumented**: No clear purpose defined

### Resolution
- **FREEZE:** Archive design docs if any exist
- **DELETE:** All execution scripts and shadow directories
- **LATER:** Rebuild as "XMAD HA Layer" when needed

---

## Issue 3: Root File Pollution (MEDIUM RISK)

### Files in Root

| File | Type | Action |
|------|------|--------|
| `DASHBOARD_FINAL_SUMMARY.md` | Progress log | → `docs/archive/` |
| `DASHBOARD_REFACTOR_SUMMARY.md` | Progress log | → `docs/archive/` |
| `DASHBOARD_AUDIT_AND_REFACTOR_PLAN.md` | Plan | → `docs/plans/` |
| `REFACTOR_PROGRESS.md` | Progress log | → `docs/archive/` |
| `AGENT_TASK.md` | AI temp | DELETE |
| `memory-log.txt` | AI temp | DELETE |
| `migration-report.json` | One-time report | DELETE after validation |
| `.eslintrc.architecture.json` | Config | Evaluate |
| `security.txt` | Security | Keep |

### Resolution
Create clear taxonomy:
```
docs/
├── architecture/
├── operations/
├── security/
├── plans/
└── archive/
```

---

## Issue 4: Workspace Media Pollution (LOW RISK)

### Findings

12 MP3 files found in `openclaw/workspace/`:
- `nova-auto-reply-*.mp3`
- `nova-reply-*.mp3`
- `direct-voice-*.mp3`
- `test-voice-*.mp3`

### Risk Assessment
- **Disk usage:** ~1.2MB of voice artifacts
- **Git bloat:** Binary files in repo
- **Runtime confusion:** Workspace for code, not media

### Resolution
- **MOVE:** Voice files to `openclaw/media/` or delete
- **ADD:** `.gitignore` rule for `*.mp3` in workspace

---

## Issue 5: Scripts Explosion (MEDIUM RISK)

### Current State

| Location | Count | Purpose |
|----------|-------|---------|
| `/scripts/` | 32 files | Mixed: build, audit, tools |
| `/openclaw/scripts/` | 6 files | Runtime scripts (CORRECT) |
| `/bootstrap/` | 4 files | Platform lifecycle (CORRECT) |
| `/runtime/` | 3 scripts | Shadow scripts (DELETE) |

### Scripts in /scripts/ needing categorization:

**Build/Dev:**
- `serve-dashboard.js`
- `update-dashboard.js`

**Audit/Verification:**
- `audit-runner.ts`
- `analyze-heap*.ts/py`
- `validate-*.ts/js/sh`

**Tools:**
- `create-admin-user.ts`
- `clone-coordinator.js`
- `migrate-images.ts`

**Legacy/Questionable:**
- `memory-emergency.md` → docs
- `memory-optimization-complete.md` → docs/archive
- `task-issue.md` → docs/archive
- `setup-placeholder.sh` (empty) → DELETE
- `verify-placeholder.ts` (empty) → DELETE

---

## Issue 6: Features vs App Duplication (ARCHITECTURE)

### Current State

| Location | Status | Architecture |
|----------|--------|--------------|
| `app/dashboard/` | ✅ ACTIVE | App Router (Next.js 16) |
| `features/control-center/` | ❌ LEGACY | Feature-based |

### Evidence

**`app/dashboard/page.tsx`:**
- Uses `"use client"`
- Active development
- Server-side data fetching

**`features/control-center/dashboard/page.tsx`:**
- Minimal implementation
- No active usage

### Resolution
- **KEEP:** `app/dashboard/` as production UI
- **ARCHIVE:** `features/control-center/` to `docs/archive/ui-legacy/`

---

## Issue 7: Environment File Scattering (SECURITY)

### Files Found

```
./.env.local.example (OK - template)
./.env.local (CHECK - may have secrets)
./openclaw/workspace/.env.production (CHECK)
./openclaw/workspace/.env.local (CHECK)
./config/ports.env (OK - non-sensitive)
./config/paths.env (OK - non-sensitive)
./runtime/openclaw-home/.env (DELETE with runtime)
./modules/openclaw/workspace/.env.* (DELETE with module)
./modules/guardian/.env (CHECK)
```

### Resolution
- **AUDIT:** All `.env` files for secrets
- **CONSOLIDATE:** Single `.env` pattern
- **KEYCHAIN:** All API keys must use macOS Keychain

---

## Files to Delete (Immediate)

```
# Empty/placeholder files
scripts/setup-placeholder.sh
scripts/verify-placeholder.ts

# Temp files
AGENT_TASK.md
memory-log.txt
migration-report.json

# Runtime shadow system
runtime/ (entire folder)
```

---

## Files to Archive

```
# Progress logs → docs/archive/
DASHBOARD_FINAL_SUMMARY.md
DASHBOARD_REFACTOR_SUMMARY.md
REFACTOR_PROGRESS.md

# Plans → docs/plans/
DASHBOARD_AUDIT_AND_REFACTOR_PLAN.md

# Legacy UI → docs/archive/ui-legacy/
features/control-center/

# Stale OpenClaw → archive/modules-openclaw-backup/
modules/openclaw/
```

---

## Memory Database Status

| Location | Size | Last Modified |
|----------|------|---------------|
| `openclaw/memory/main.sqlite` | 51 lines | ACTIVE |
| `modules/openclaw/memory/main.sqlite` | 51 lines | STALE |

**Action:** Merge any unique data from stale DB, then delete.

---

## Launch Agent Status

**Current (CORRECT):**
```
Label: ai.openclaw.gateway
Script: /Users/ahmadabdullah/xmad-control/openclaw/scripts/start-ssot.sh
Config: /Users/ahmadabdullah/xmad-control/openclaw/configs/openclaw.json
```

**No conflicts found.** Launch agent points to correct SSOT location.

---

## Recommended Execution Order

### Phase 1: Safe Cleanup (No Runtime Impact)
1. Delete empty placeholder scripts
2. Delete temp files (AGENT_TASK.md, memory-log.txt)
3. Move progress logs to docs/archive/

### Phase 2: Archive Legacy Systems
1. Archive features/control-center/
2. Archive modules/openclaw/ (after DB merge)
3. Delete runtime/ shadow system

### Phase 3: Structure Normalization
1. Reorganize docs/ folder
2. Add .gitignore rules
3. Consolidate scripts/

---

## Agent Scope Separation

### Agent 1 (This Agent) - Runtime Kernel
- **Scope:** `openclaw/`, `modules/openclaw/`, `runtime/`, `bootstrap/`
- **Mission:** Consolidate to single OpenClaw runtime

### Agent 2 - Frontend & Monorepo
- **Scope:** `app/`, `features/`, `components/`, `scripts/`, root files
- **Mission:** Clean UI architecture and documentation

**No overlap.** Safe parallel execution.

---

**Audit Complete. Ready for Agent 2 handoff.**
