# Reference Document

> **Reference only — not required for agent execution**
>
> This document is preserved for detailed reference and troubleshooting.
> For core rules, see `documentation/core/`.

---

# SCRIPT OVERVIEW — LAYERED ENFORCEMENT

The central control panel for project maintenance and verification.

## 🛠️ Core Scripts

### Development
- `bun run dev`: Standard development with Turbopack.
- `bun run dev:clean`: Cleans cache and starts dev.

### Verification (The Gates)
- `bun run check:all`: Runs Lint, Types, and Build checks.
- `bun run verify:phase1`: Specific verification for Phase 1 completion.

### Maintenance
- `bun run fix:all`: Biome format + safe lint fixes.
- `bun run clean`: Wipe `.next` and `node_modules`.

### Security
- `bun run scripts/hard-kill.ts`: Kill all rogue processes.
- `bun run scripts/refresh-hashes.ts`: (Phase 2+) Documentation hash update.

## 🤖 Enforcement Integration
These scripts are called by Layer 0–6 agents to verify state before and after contributions.
- **Fail First**: If any check fails, the entire task is considered FAILED.
