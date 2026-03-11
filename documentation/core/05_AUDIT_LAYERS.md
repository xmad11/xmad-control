# AUDIT LAYERS — Verification System

**Complete audit layer reference and requirements**

**Last Updated:** 2026-01-28

---

## 1. AUDIT SYSTEM OVERVIEW

### Two-Tier Audit System

**Quick Audit (Development):**
```bash
bun run audit
```
- **Layers:** 03 (TypeScript), 04 (Design Tokens), 07.5 (UI Normalization)
- **Time:** ~2 seconds
- **Purpose:** Fast feedback during development
- **Use when:** Actively coding and making frequent changes

**Full Audit (CI/CD & Pre-Commit):**
```bash
bun run audit:ci
```
- **Layers:** All 11 layers (00-09)
- **Time:** ~15 seconds
- **Purpose:** Comprehensive verification before committing
- **Use when:** About to commit, deploy, or create PR

### Layer-Specific Commands

```bash
# Run specific layer
bun run audit --layer=03

# Run multiple layers
bun run audit --layer=03 --layer=04 --layer=09

# Auto-fix safe violations
bun run audit --layer=04 --fix

# List all available layers
bun run audit --list
```

---

## 2. COMPLETE LAYER REFERENCE

### Layer 00: Pre-Flight

**What it checks:**
- Environment setup
- Required files exist
- Node/Bun version compatibility

**Time:** 0.1s

**Critical:** ✅ Yes

**Fail conditions:**
- Missing `package.json`
- Missing `styles/tokens.css`
- Missing required dependencies
- Incompatible runtime version

**Documentation support:** `documentation/core/00_AGENT_RULES.md` (Section 7: Verification Commands)

---

### Layer 01: Documentation

**What it checks:**
- Core documentation exists in `documentation/core/`
- All 7 SSOT files present
- No missing mandatory docs

**Time:** 0.1s

**Critical:** ✅ Yes

**Fail conditions:**
- Missing `00_AGENT_RULES.md`
- Missing `01_ARCHITECTURE.md`
- Missing `02_DESIGN_TOKENS.md`
- Missing `03_UI_COMPONENT_RULES.md`
- Missing `04_GOVERNANCE.md`
- Missing `05_AUDIT_LAYERS.md` (this file)
- Missing `06_COMMIT_PROTOCOL.md`

**Documentation support:** This document structure defines required docs

---

### Layer 02: Architecture

**What it checks:**
- Files in correct folders
- No violations of folder responsibilities
- No circular dependencies

**Time:** 0.2s

**Critical:** ✅ Yes

**Fail conditions:**
- Business logic in `components/`
- UI components in `lib/`
- Scripts imported by app components
- Files in wrong locations

**Documentation support:** `documentation/core/01_ARCHITECTURE.md` (Section 1: Folder Responsibilities)

---

### Layer 03: TypeScript

**What it checks:**
- No `any` types
- No `@ts-ignore` comments
- Proper typing for all data structures
- No unsafe type assertions without validation

**Time:** 12s

**Critical:** ✅ Yes

**Fail conditions:**
```typescript
// ❌ Forbidden patterns
const data: any = fetchData();
// @ts-ignore
const risky = anyOperation;
const user = data as User;  // Without validation
```

**Documentation support:** `documentation/core/00_AGENT_RULES.md` (Section 5: TypeScript Rules)

---

### Layer 04: Design Tokens

**What it checks:**
- No hardcoded colors (hex/rgb in JSX)
- No inline styles (`style={{}}`)
- All spacing uses `--spacing-*` tokens
- All typography uses `--font-size-*` tokens
- No forbidden patterns

**Time:** 0.2s

**Critical:** ✅ Yes

**Fail conditions:**
```tsx
// ❌ Forbidden
<div className="bg-black bg-white bg-[#ff0000] bg-blue-500">
<div style={{ color: "#ff0000", padding: "20px" }}>
<div className="p-8 m-4 gap-12">
const color = getComputedStyle(el).getPropertyValue(...);
```

**Documentation support:** `documentation/core/02_DESIGN_TOKENS.md` (Section 15: Allowed vs Forbidden)

---

### Layer 05: Dependencies

**What it checks:**
- No unauthorized packages
- No duplicate packages
- Package security vulnerabilities

**Time:** 0.5s

**Critical:** ⚠️ Warning (non-blocking)

**Fail conditions:**
- Unauthorized packages added
- Security vulnerabilities in dependencies
- Duplicate package versions

**Documentation support:** `documentation/core/01_ARCHITECTURE.md` (Section 5: Import Rules)

---

### Layer 06: Git Health

**What it checks:**
- Clean git history
- No large files committed
- No sensitive data in commits
- Proper branch structure

**Time:** 0.3s

**Critical:** ⚠️ Warning (non-blocking)

**Fail conditions:**
- Large files (>5MB) in repository
- Sensitive data (API keys, secrets) in commits
- Commits on main branch
- Stale branches

**Documentation support:** `documentation/core/06_COMMIT_PROTOCOL.md` (Section 3: Pre-Commit Hooks)

---

### Layer 07: UI Responsive

**What it checks:**
- Mobile-first breakpoints
- Touch target minimums (44px)
- No desktop-first overrides
- No hardcoded breakpoint values

**Time:** 1s

**Critical:** ⚠️ Warning (non-blocking)

**Fail conditions:**
```tsx
// ❌ Desktop-first
<div className="p-8 md:p-6 md:p-4">

// ❌ Responsive logic in JSX
{isMobile ? <Mobile /> : <Desktop />}

// ❌ Hardcoded breakpoints
<div className="w-[375px] md:w-[768px]">

// ❌ Too small touch targets
<button className="px-2 py-1">
```

**Documentation support:** `documentation/core/00_AGENT_RULES.md` (Section 6: Mobile-First Responsive)

---

### Layer 07.5: UI Normalization

**What it checks:**
- Consistent UI patterns
- No inline styles
- Proper token usage
- Panel mutual exclusivity

**Time:** 0.1s

**Critical:** ✅ Yes

**Fail conditions:**
```tsx
// ❌ Wrong - Hidden with CSS
<div className={showPanel ? 'block' : 'hidden'}>

// ❌ Inline styles
<div style={{ padding: "20px" }}>

// ❌ Multiple panels mounted
<SideMenu />
<ThemeModal />
```

**Documentation support:** `documentation/core/03_UI_COMPONENT_RULES.md` (Section 3: Panel System)

---

### Layer 08: Ownership

**What it checks:**
- CODEOWNERS file respected
- No unauthorized changes to locked files
- Proper approval for sensitive changes

**Time:** 0.5s

**Critical:** ⚠️ Warning (non-blocking)

**Fail conditions:**
- Changes to `lib/supabase/` without approval
- Changes to `types/database.ts` without approval
- Modification of audit scripts

**Documentation support:** `documentation/core/01_ARCHITECTURE.md` (Section 2: Forbidden Changes)

---

### Layer 09: Build Verify

**What it checks:**
- Project builds successfully
- No TypeScript compilation errors
- No missing dependencies

**Time:** 25s

**Critical:** ✅ Yes

**Fail conditions:**
- Build fails: `bun run build`
- TypeScript errors
- Missing imports
- Module resolution failures

**Documentation support:** `documentation/core/00_AGENT_RULES.md` (Section 7: Workflow Requirements)

---

## 3. READING AUDIT REPORTS

### Report Structure

```json
{
  "summary": {
    "totalLayers": 11,
    "passed": 10,
    "warnings": 1,
    "failed": 0,
    "totalViolations": 5,
    "criticalViolations": 0
  },
  "violations": [
    {
      "layer": "04-design-tokens",
      "severity": "error",
      "file": "components/Header.tsx",
      "line": 42,
      "type": "hardcoded-color",
      "message": "Hardcoded color '#ff0000' found",
      "fix": "Replace with 'rgb(var(--color-primary))'"
    }
  ]
}
```

### Viewing Reports

```bash
# View latest report
cat .audit/audit-report.json

# Compare with baseline
diff .audit/baseline-report.json .audit/audit-report.json

# Count violations by severity
jq '.violations | group_by(.severity) | map({severity: .[0].severity, count: length})' .audit/audit-report.json
```

---

## 4. AUDIT WORKFLOW

### Before Starting Work

```bash
# Establish baseline
bun run audit:ci
cp .audit/audit-report.json .audit/baseline-report.json
```

### During Development

```bash
# Quick checks while developing
bun run audit                    # 3-layer check
bun run biome check --write      # Format
```

### Pre-Commit Validation

```bash
# Full validation
bun run audit:ci                 # All 11 layers
bun run build                    # Verify build

# If violations exist:
bun run audit --layer=03 --fix   # Auto-fix if available
# OR fix manually based on report

# Re-verify after fixes:
bun run audit:ci

# Only commit if all checks pass:
git add specific-files
git commit -m "type(scope): description"
```

---

## 5. AUDIT FAILURE RESPONSES

### If Critical Violations Exist

1. DO NOT proceed with task
2. Report to user with violation details
3. Wait for user approval before continuing

### If You Created Violations

1. Run audit to identify issues
2. Fix violations based on report suggestions
3. Re-run audit to verify fixes
4. If can't fix, report to user with details

### If Build Fails

1. Check TypeScript errors
2. Check build output
3. Fix errors and retry

---

## 6. LAYER MAPPING TO DOCUMENTATION

| Layer | Name | Supported By |
|-------|------|--------------|
| 00 | Pre-Flight | `00_AGENT_RULES.md` Section 7 |
| 01 | Documentation | This document (SSOT structure) |
| 02 | Architecture | `01_ARCHITECTURE.md` Section 1 |
| 03 | TypeScript | `00_AGENT_RULES.md` Section 5 |
| 04 | Design Tokens | `02_DESIGN_TOKENS.md` Section 15 |
| 05 | Dependencies | `01_ARCHITECTURE.md` Section 5 |
| 06 | Git Health | `06_COMMIT_PROTOCOL.md` Section 3 |
| 07 | UI Responsive | `00_AGENT_RULES.md` Section 6 |
| 07.5 | UI Normalization | `03_UI_COMPONENT_RULES.md` Section 3 |
| 08 | Ownership | `01_ARCHITECTURE.md` Section 2 |
| 09 | Build Verify | `00_AGENT_RULES.md` Section 7 |

---

## 7. COMPLIANCE REQUIREMENTS

### Before Committing

- [ ] Full audit passes (`bun run audit:ci`)
- [ ] No critical violations
- [ ] Warnings documented and justified
- [ ] Build succeeds (`bun run build`)

### Before Deploying

- [ ] All of the above, plus
- [ ] Git history is clean
- [ ] Commit message follows format
- [ ] Feature branch from latest main

---

**This document is the SSOT for audit system requirements.**

**For layer-specific rules, see the documentation mapping above.**
