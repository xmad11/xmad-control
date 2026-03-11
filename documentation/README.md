# AUTHORITATIVE DOCUMENTATION

Welcome to the Shadi V2 documentation system. This is a Zero-Trust, Layered Enforcement environment.

## 🛑 MANDATORY ENTRY POINT

Before touching any code, every agent (human or AI) MUST:
1. Read `GOVERNANCE.md` to understand the Layered Enforcement (Layer 0–6).
2. Complete `onboarding/AGENT_ONBOARDING.md`.
3. Acknowledge the protocols defined in `onboarding/DOC_ACK_PROTOCOL.md`.

## System Overview

This documentation is the **SINGLE SOURCE OF TRUTH**. 
Documentation is version-controlled and hash-verified (Layer 0).

### Directory Structure

- `GOVERNANCE.md` — The core rules of the project.
- `onboarding/` — How to get started safely.
- `architecture/` — System boundaries and forbidden changes.
- `ui/` — Strict UI rules and design tokens.
- `git/` — Version control protocols.
- `security/` — Lock system and environment handling.
- `scripts/` — Enforcement and utility scripts.
- `database/` — Current state of database integration (Deactivated).
- `hashes/` — Machine-readable validation hashes.

## Failure to Comply
Changes that violate the rules defined here will be **REJECTED** and **REVERTED** automatically by the enforcement layers.
