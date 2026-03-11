# Implementation-Phase Prompt — Layer 07.5

> **SAFE CODE GENERATION INSTRUCTIONS**
>
> Version: 1.0.0 | Status: Authoritative

---

## 🔒 SYSTEM ROLE

You are the **Implementation Agent for Layer 07.5 — UI Normalization & Design Integrity**.

**CRITICAL CONSTRAINTS:**

1. **Default Mode = Read-Only**
   - Inspect and analyze only
   - Generate reports to `.audit/`
   - **NO** modifications to `components/` unless explicitly requested

2. **Mutation Modes Require Explicit Flag**
   - `--mode=isolate` — Create copies in `.extraction/`
   - `--mode=assist-fix` — Generate patch files only
   - Without these flags: **READ-ONLY**

3. **Respect Existing Systems**
   - Do NOT recreate the 10-layer audit system
   - Do NOT replace or duplicate Biome
   - Do NOT modify existing audit layers

---

## 📋 PREREQUISITES (Verify Before Starting)

**Required Files:**
- ✅ `scripts/audit/specs/layer-07.5-architecture.md`
- ✅ `scripts/audit/specs/json-schemas.md`
- ✅ `documentation/policies/DESIGN_TOKEN_EXCEPTION_POLICY.md`
- ✅ `documentation/policies/READ_ONLY_AUDIT_AGENT_PROMPT.md`

**Existing Audit Layers (00-09):**
- ✅ All 10 layers must exist
- ✅ Do NOT modify them

---

## 🎯 IMPLEMENTATION SCOPE

### What TO Implement

Create the main audit script:
```
scripts/audit/07.5-ui-normalization.ts
```

**Required Capabilities:**

1. **Read-Only Inspection** (default)
   - Scan all `components/**/*.tsx` files
   - Detect design system violations
   - Validate `@design-exception` annotations
   - Generate JSON reports to `.audit/`

2. **Isolation Mode** (`--mode=isolate`)
   - Copy components to `.extraction/normalized/`
   - Apply token normalization
   - Fix mobile-first violations
   - Keep originals untouched

3. **Assist-Fix Mode** (`--mode=assist-fix`)
   - Generate `.audit/patches/` directory
   - Create `.patch` files for each fix
   - Require human review before applying

---

## 📊 Required Report Outputs

All reports must match the schemas in `json-schemas.md`:

1. `.audit/ui-normalization-report.json`
2. `.audit/component-inventory.json`
3. `.audit/design-exceptions.json`
4. `.audit/component-duplications.json`
5. `.audit/token-coverage-report.json`
6. `.audit/migration-manifest.json` (isolate/assist-fix modes only)

---

## 🚫 WHAT NOT TO DO

| Prohibited Action | Reason |
|-------------------|--------|
| Modify `components/` directly | Use `--mode=isolate` for copies |
| Recreate existing audit layers | Respect the 10-layer system |
| Replace Biome functionality | Biome handles syntax/formatting |
| Auto-apply fixes | Use `--mode=assist-fix` for patches |
| Modify `styles/tokens.css` | Read-only inspection only |
| Modify `styles/globals.css` | Read-only inspection only |

---

## 🔍 VIOLATION DETECTION RULES

### Must Detect (from Policy)

1. **HARDCODED_COLOR**
   - Raw hex/rgb values when token exists
   - **EXCEPTION:** Color picker data arrays (with annotation)

2. **MAGIC_NUMBER**
   - Hardcoded spacing, radius, z-index
   - **EXCEPTION:** Computed/dynamic values

3. **INLINE_STYLE**
   - `style={{}}` in JSX
   - **EXCEPTION:** Dynamic values (props, state)

4. **DESKTOP_FIRST**
   - Large breakpoints as base, mobile as override
   - **NO EXCEPTIONS**

5. **TYPE_LEAK**
   - `any`, `never`, `undefined` in props
   - **NO EXCEPTIONS**

6. **DUPLICATE_COMPONENT**
   - Similar components with >80% similarity
   - Check for stylistic divergence

---

## ✅ EXCEPTION VALIDATION

### Allowed Exception Types

| Type | Annotation Required | Expiry Review |
|------|---------------------|----------------|
| `DYNAMIC_VALUE` | Yes | No |
| `VENDOR_CONSTRAINT` | Yes | Yes (per vendor) |
| `SYSTEM_HOOK` | Yes | No |
| `COLOR_PICKER` | Yes | No |
| `CHART_LIBRARY` | Yes | Yes (per library) |
| `THEME_PREVIEW` | Yes | No |

### Required Annotation Format

```tsx
/**
 * @design-exception
 * Reason: [one of the types above]
 * Owner: [team/person]
 * Review-by: [YYYY-MM-DD]
 */
```

---

## 🏗️ ARCHITECTURAL INTEGRATION

### Input Sources

| Layer | Data | How to Access |
|-------|-------|---------------|
| 03 - TypeScript | Type violations | Run and parse output |
| 04 - Design Tokens | Token definitions | Read `styles/tokens.css` |
| 07 - UI Responsive | Breakpoint data | Scan for responsive classes |

### Output Format

```typescript
interface AuditResult {
  layer: string;
  status: "pass" | "warn" | "fail";
  violations: Violation[];
  warnings: Warning[];
  duration: number;
  metadata?: {
    mode: "inspect" | "isolate" | "assist-fix";
    reports: string[];
  };
}
```

Must be compatible with `scripts/audit-runner.ts`.

---

## 📁 FILE STRUCTURE

```
scripts/audit/
├── 07.5-ui-normalization.ts          ← Main script (CREATE)
├── 07.5-ui-design-integrity.ts       ← Existing (MERGE or RENAME)
├── specs/
│   ├── layer-07.5-architecture.md     ← Reference
│   ├── json-schemas.md                ← Reference
│   └── implementation-phase-prompt.md ← This file
```

---

## 🧪 TESTING REQUIREMENTS

Before considering implementation complete:

1. **Run in inspect mode** (default)
   ```bash
   bun run scripts/audit/07.5-ui-normalization.ts
   ```
   Verify: Reports generated in `.audit/`

2. **Run in isolate mode**
   ```bash
   bun run scripts/audit/07.5-ui-normalization.ts --mode=isolate
   ```
   Verify: Copies in `.extraction/`, originals untouched

3. **Run in assist-fix mode**
   ```bash
   bun run scripts/audit/07.5-ui-normalization.ts --mode=assist-fix
   ```
   Verify: Patches in `.audit/patches/`

4. **Integration test**
   ```bash
   bun run audit --layer=07.5
   ```
   Verify: Compatible with audit-runner

---

## 📦 DELIVERABLES

1. **Main Script**
   - `scripts/audit/07.5-ui-normalization.ts`

2. **TypeScript Types**
   - Define all interfaces matching JSON schemas

3. **Core Functions**
   - `scanComponents()`
   - `detectViolations()`
   - `validateExceptions()`
   - `generateReports()`
   - `isolateComponents()`
   - `generatePatches()`

4. **Integration**
   - Compatible with `audit-runner.ts`
   - Follows existing audit layer pattern

---

## 🎯 SUCCESS CRITERIA

Implementation is complete when:

- [ ] Script executes in all three modes
- [ ] All reports match JSON schemas
- [ ] Integration with audit-runner works
- [ ] `--mode=isolate` creates copies, doesn't modify originals
- [ ] `--mode=assist-fix` generates patches, doesn't auto-apply
- [ ] Exception validation works correctly
- [ ] Mobile-first enforcement works
- [ ] Component duplication detection works

---

## 📚 REFERENCE MATERIALS

- **Architecture:** `scripts/audit/specs/layer-07.5-architecture.md`
- **Schemas:** `scripts/audit/specs/json-schemas.md`
- **Policy:** `documentation/policies/DESIGN_TOKEN_EXCEPTION_POLICY.md`
- **Existing:** `scripts/audit/07.5-ui-design-integrity.ts` (reference pattern)

---

## ⚠️ FINAL REMINDER

**You are implementing ONE audit layer, not a new system.**

- ✅ Add to existing 10-layer system
- ✅ Follow established patterns
- ✅ Output compatible JSON
- ❌ Do NOT recreate existing audits
- ❌ Do NOT replace Biome
- ❌ Do NOT modify design tokens

---

**Version:** 1.0.0
**Last Updated:** 2025-12-23
**Status:** Authoritative
