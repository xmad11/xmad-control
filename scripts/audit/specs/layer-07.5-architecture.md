# Layer 07.5 — UI Normalization & Design Integrity

> **Official Architecture Specification**
>
> Version: 1.0.0 | Status: Authoritative

---

## 📍 Layer Placement

**Position:** Layer 07.5 (between Layer 07 and Layer 08)

**Rationale:**
- ✅ After TypeScript (03) and Design Tokens (04)
- ✅ After UI Responsive (07)
- ✅ Before Build Verification (09)
- ✅ Before Ownership & Governance (08)

**Sequence:**
```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → [07.5] → 08 → 09
                                      ↑
                            UI Normalization & Design Integrity
```

---

## 🎯 Purpose & Scope

### What It Does

1. **Read-Only Inspection** (Default)
   - Scans components for design system compliance
   - Detects violations without modifying code
   - Generates reports and recommendations

2. **Isolation Mode** (`--mode=isolate`)
   - Creates clean copies of components
   - Places in isolated folder (`.extraction/`)
   - Zero risk to production code

3. **Assist-Fix Mode** (`--mode=assist-fix`)
   - Generates patch plans
   - Requires explicit human approval
   - Never auto-applies changes

### What It Does NOT Do

- ❌ Recreate existing 10-layer audit system
- ❌ Replace Biome (formatting/linting)
- ❌ Modify production components without approval
- ❌ Act as a general-purpose linter

---

## 📁 Canonical Location

```
scripts/audit/07.5-ui-normalization.ts
```

**Note:** The existing `07.5-ui-design-integrity.ts` should be merged into this unified layer.

---

## 🔄 Input/Flow/Output Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT LAYERS                             │
├─────────────────────────────────────────────────────────────┤
│  Layer 03 (TypeScript) ──────┐                            │
│  Layer 04 (Design Tokens) ────┤──┐                        │
│  Layer 07 (UI Responsive) ─────┤──┤                       │
│                                │  │                       │
│                                ▼  ▼                       │
│  ┌─────────────────────────────────────────┐               │
│  │  LAYER 07.5 - UI Normalization         │               │
│  │  ┌─────────────────────────────────┐   │               │
│  │  │  Inspection Engine               │   │               │
│  │  │  - Violation detection           │   │               │
│  │  │  - Exception validation         │   │               │
│  │  │  - Duplication analysis         │   │               │
│  │  └─────────────────────────────────┘   │               │
│  │  ┌─────────────────────────────────┐   │               │
│  │  │  Normalization Engine           │   │               │
│  │  │  - Token normalization          │   │               │
│  │  │  - Mobile-first verification    │   │               │
│  │  │  - Component isolation         │   │               │
│  │  └─────────────────────────────────┘   │               │
│  └─────────────────────────────────────────┘               │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────┐               │
│  │  OUTPUT REPORTS (.audit/)              │               │
│  ├─────────────────────────────────────────┤               │
│  │  • ui-normalization-report.json       │               │
│  │  • component-inventory.json           │               │
│  │  • design-exceptions.json             │               │
│  │  • component-duplications.json        │               │
│  │  • token-coverage-report.json         │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎛️ Operating Modes

### Mode 1: Inspect (Default)

```bash
bun run audit --layer=07.5          # Inspect mode
bun run audit --layer=07.5 --mode=inspect
```

**Behavior:**
- Read-only scan of all components
- Detects violations, warnings, exceptions
- Generates reports in `.audit/`
- **No code modifications**

---

### Mode 2: Isolate

```bash
bun run audit --layer=07.5 --mode=isolate
```

**Behavior:**
- Creates clean copies of components
- Applies token normalization
- Places in `.extraction/` folder
- **Originals untouched**

---

### Mode 3: Assist-Fix

```bash
bun run audit --layer=07.5 --mode=assist-fix
```

**Behavior:**
- Generates patch/diff files
- Creates step-by-step fix plans
- Requires explicit approval
- **No auto-application**

---

## 📊 Report Outputs

All reports written to `.audit/`:

| Report | File | Purpose |
|--------|------|---------|
| Normalization Report | `ui-normalization-report.json` | Overall summary |
| Component Inventory | `component-inventory.json` | Component metadata |
| Exception Registry | `design-exceptions.json` | Allowed exceptions |
| Duplication Matrix | `component-duplications.json` | Duplicate detection |
| Token Coverage | `token-coverage-report.json` | Token usage stats |

---

## 🔗 Integration Points

### Consumes From

| Layer | Data Used |
|-------|-----------|
| 03 - TypeScript | Type safety violations, `any` leakage |
| 04 - Design Tokens | Token usage, hardcoded values |
| 07 - UI Responsive | Mobile-first compliance, breakpoints |

### Feeds Into

| Layer | Data Provided |
|-------|---------------|
| 08 - Ownership | Component inventory for ownership assignment |
| 09 - Build Verify | Normalized components for build testing |
| CI/CD | Policy enforcement gates |

---

## 🚫 Scope Boundaries

### OUT OF SCOPE (Not This Layer's Job)

| Concern | Owner |
|----------|-------|
| Syntax formatting | **Biome** |
| Type checking | **tsc / Biome** |
| Unit testing | **Test framework** |
| Bundle analysis | **Layer 09** |
| Git operations | **Layer 06** |
| Documentation validation | **Layer 01** |

### IN SCOPE (This Layer Only)

| Concern | This Layer |
|----------|------------|
| Design token compliance | ✅ |
| Mobile-first enforcement | ✅ |
| Component duplication detection | ✅ |
| Exception validation | ✅ |
| UI isolation/extraction | ✅ |
| Normalization proposals | ✅ |

---

## 📚 Related Policies

- `documentation/policies/DESIGN_TOKEN_EXCEPTION_POLICY.md`
- `documentation/policies/READ_ONLY_AUDIT_AGENT_PROMPT.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-12-23
**Status:** Authoritative
