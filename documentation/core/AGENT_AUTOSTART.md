# AGENT AUTOSTART & BOOTSTRAP DOCUMENTATION

**Purpose:** Mandatory bootstrap document for all agents.
**Read all lines fully and understand** before any task execution.

**Last Updated:** 2026-01-28

---

## 1. STARTUP RULES

### 1.1 Always Start on a New Branch

```bash
git status --short
```

- Report any uncommitted changes immediately
- Do not proceed if changes exist

### 1.2 Confirm Branch Isolation

```bash
git branch --show-current
```

### 1.3 Only After These Checks Proceed to Documentation Reading

---

## 2. DOCUMENTATION READING ORDER

### Step 1: Core SSOT (MUST READ ALL LINES)

**Location:** `documentation/core/`

1. **00_AGENT_RULES.md** — Forbidden actions, token discipline, UI invariants, TypeScript rules, mobile-first responsive
2. **01_ARCHITECTURE.md** — Folder responsibilities, forbidden changes, SSOT component rules, routing rules
3. **02_DESIGN_TOKENS.md** — OKLCH color system, spacing scale, typography scale, allowed vs forbidden patterns
4. **03_UI_COMPONENT_RULES.md** — Card system SSOT, carousel system, panel system, glass components
5. **04_GOVERNANCE.md** — Layered enforcement (Layers 0-6), audit system, Biome linting
6. **05_AUDIT_LAYERS.md** — Complete audit layer reference, two-tier audit system, layer-specific requirements
7. **06_COMMIT_PROTOCOL.md** — Branching strategy, commit message format, pre-commit hooks

### Step 2: Legacy Reference (Read Fully If Needed)

**Location:** `documentation/` (original) and `documentation/reference/`

1. **ui/UI_INVARIANTS.md** — UI invariants, state, tokens, animations
2. **ui/DESIGN_TOKENS.md** — Global tokens, spacing, icons
3. **architecture/BOUNDARIES.md** — Folder/module responsibilities
4. **architecture/FORBIDDEN_CHANGES.md** — Prohibited areas & rules
5. **ui/CARDS.md** — Card system SSOT, variants
6. **DESIGN_SYSTEM_CANONICAL.md** — Design system, colors, themes
7. **git/GIT_PROTOCOL.md** — Workflow, commit format, hooks
8. **MOBILE_FIRST.md** — Responsive design rules
9. **AGENT_INSTRUCTIONS.md** — Agent commands, workflow, audit system

### Step 3: Deep Reference (Read Fully If Needed)

**Location:** `documentation/reference/`

1. **ui/ANIMATION_RULES.md**
2. **ui/COMPONENT_EDIT_RULES.md**
3. **ui/UI_CONTROL_MAP.md**
4. **OWNER_CHEATSHEET.md**
5. **COMPONENT_INVENTORY.md**
6. **TROUBLESHOOTING.md**
7. **security/LOCK_SYSTEM.md**
8. **security/ENVIRONMENT_RULES.md**
9. **TESTING_PROTOCOL.md**
10. **scripts/SCRIPT_OVERVIEW.md**
11. **git/RECOVERY_PLAYBOOK.md**
12. **ROLLBACK_PROTOCOL.md**
13. **PROJECT-STRUCTURE.md**
14. **QUICK_START.md**

### Step 4: Optional / Historical Reference

**Location:** `documentation/tasks/` and root

- `tasks/*.md`, `FRONTEND-PLAN.md`, `BACKEND-PLAN.md`, `DESIGN-FINAL2026.md`
- `UI-IMPLEMENTATION-PLAN.md`, `ICON_MIGRATION_PLAN.md`, `MEMORY_OPTIMIZATION.md`

---

## 3. PRE-TASK VALIDATION

### 3.1 Audit Layers Check

```bash
# Run full audit
bun run audit:ci

# Run specific layer
bun run audit --layer=<layer-number>
```

**All layers must pass. No bypass allowed.**

### 3.2 Biome Configuration Check

```bash
bun run biome check .
grep -A 15 '"ignore"' biome.json
```

- Validate ignored files
- Confirm linter rules match documentation

### 3.3 CSS & Token Check

```bash
bun run biome check styles/components/ styles/globals.css
```

### 3.4 TypeScript Validation (Layer 03)

```bash
bun run audit --layer=03
```

---

## 4. AGENT ROLES & RESPONSIBILITIES

- Follow all audit layers strictly
- Never bypass failing layers
- Respect locked areas and forbidden changes
- Read all documentation fully before acting
- Provide pre-task report:

**Pre-Task Report Template:**
```
📋 Agent Name / ID
🕒 Start Timestamp
✅ Documentation read (all lines)
📝 Roles & responsibilities understood
🛡 Audit layers overview
🔍 Biome status
⚠️ Issues / risks
```

**Do not commit without approval.**

---

## 5. STRICT RULES

1. No audit layer bypass
2. No ignoring Biome violations
3. No hardcoded or inline TypeScript/CSS errors
4. All decisions must be reported before execution
5. Always validate session state (`.audit/audit-report.json`) before acting

---

## 6. WORKFLOW SUMMARY

1. Start new branch, validate working directory
2. Read `AGENT_AUTOSTART.md` fully
3. Read core SSOT documentation fully (`documentation/core/*.md`)
4. Read deep reference documentation (if needed)
5. Run audit layers & Biome checks
6. Generate full pre-task report
7. Await explicit approval before task execution

---

## 7. COMMANDS REFERENCE

### Branch & Clean State

```bash
git status
git checkout -b <new-branch>
```

### Audit Layers

```bash
bun run audit:ci              # Full 11-layer audit
bun run audit                 # Quick 3-layer check
bun run audit --layer=<layer-number>
```

### Biome Checks

```bash
bun run biome check .
grep -A 15 '"ignore"' biome.json
```

### CSS & TypeScript Validation

```bash
bun run biome check styles/components/ styles/globals.css
bun run audit --layer=03
```

---

## 8. GOAL

- Ensure agent cannot start without full knowledge
- Prevent violations or automatic revocation
- Establish consistent, safe start for all agents
- Serve as mandatory bootstrap reference

---

**This document is MANDATORY reading for all agents before any task execution.**

**For detailed rules, see:** `documentation/core/*.md` (7 SSOT files)
