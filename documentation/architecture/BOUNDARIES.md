# ARCHITECTURAL BOUNDARIES

Strict folder responsibility rules to prevent architectural drift.

## 📁 Directory Responsibilities

### `app/` (Next.js App Router)
- **Role**: Routing, Layouts, Metadata.
- **Rules**: Components here should be high-level orchestrators. 
- **Current State**: Phase 2 active. Root layout and globals are frozen.

### `components/` (UI Elements)
- **Role**: Reusable React components.
- **Rules**: Must Use Design Tokens. Must be Atomic/Molecular.
- **Constraint**: No direct DB access. No business logic that belongs in `lib/`.

### `lib/` (Core Logic)
- **Role**: Utilities, Hooks, Data fetching logic.
- **Rules**: Framework agnostic where possible. Pure functions preferred.

### `types/` (Type Definitions)
- **Role**: Centralized TypeScript interfaces and types.
- **Rules**: No logic. Only declarations.

### `styles/` (Design Tokens)
- **Role**: Tailwind 4 configuration and CSS variables.
- **Rules**: This is the source of truth for all visual properties.

### `scripts/` (Enforcement & Tooling)
- **Role**: CI/CD, Phase Gate verification, maintenance scripts.
- **Rules**: Must not be imported by app components.

### `documentation/` (The Brain)
- **Role**: Authoritative Governance.
- **Rules**: Nothing happens without documentation.
