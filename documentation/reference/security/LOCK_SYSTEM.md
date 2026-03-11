# Reference Document

> **Reference only — not required for agent execution**
>
> This document is preserved for detailed reference and troubleshooting.
> For core rules, see `documentation/core/`.

---

# LOCK SYSTEM

The project employs technical locks to prevent unauthorized writes and ensure phase integrity.

## 🔒 Project Locks
- **`PHASE_LOCK.json`**: Defines which directories are writable in the current phase.
- **`SESSION.lock`**: (Internal) Prevents concurrent agent executions in the same workspace.

## 🛡️ Operational Scripts
- `bun run scripts/phase1-lock.ts`: Enforces phase 1 boundaries.
- `bun run scripts/hard-kill.ts`: Emergency project stop (Owner only).

## 🛑 Layered Hardening
- **Environment Check**: Every `bun run dev` verifies the presence of required environment variables.
- **Port Discipline**: Development server is locked to a specific port to prevent collision and ensure predictable environments.
- **SSR Hydration Check**: Prevents common UI "flicker" security/design bugs.
