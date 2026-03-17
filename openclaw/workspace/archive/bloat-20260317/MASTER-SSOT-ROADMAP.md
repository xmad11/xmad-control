# MASTER SSOT ROADMAP - Factory Monorepo

## Directory Structure

```
factory-monorepo/
├── apps/
│   └── generated-projects/          # Agent-created projects
├── packages/
│   ├── general-ssot/                 # Infisical client, secrets management
│   ├── frontend-hub/                 # Shared UI components
│   ├── backend-hub/                  # Auth, API utilities
│   └── ai-hub/                       # Nova AI, agent frameworks
├── tools/
│   ├── create-factory-project/       # CLI scaffolding tool
│   ├── safety-net/                   # Checkpoint/rollback scripts
│   ├── gemma-guardian/               # File watcher
│   └── sandbox/                      # Agent isolation
├── templates/
│   ├── basic-app/                    # Minimal app template
│   ├── fullstack-app/                # Frontend + backend template
│   └── ai-agent/                     # AI agent template
├── package.json                      # Root with workspace config
├── pnpm-workspace.yaml               # PNPM workspace definition
└── README.md                         # Monorepo documentation
```

## Package Purposes

### packages/general-ssot/
- **Purpose:** Single Source of Truth for general utilities
- **Contents:** Infisical client, configuration management
- **Dependencies:** @infisical/sdk

### packages/frontend-hub/
- **Purpose:** Shared React/Vue components
- **Contents:** UI library, design system components
- **Dependencies:** React, TypeScript, Tailwind

### packages/backend-hub/
- **Purpose:** Shared backend utilities
- **Contents:** Auth middleware, API helpers, database clients
- **Dependencies:** Express, Prisma, JWT libraries

### packages/ai-hub/
- **Purpose:** AI and agent infrastructure
- **Contents:** Nova AI integration, agent frameworks
- **Dependencies:** OpenAI SDK, Anthropic SDK

### tools/create-factory-project/
- **Purpose:** CLI tool to scaffold new projects
- **Contents:** Commands, templates, generators

### tools/safety-net/
- **Purpose:** Checkpoint and rollback system
- **Contents:** Git-based checkpoint scripts

### tools/gemma-guardian/
- **Purpose:** File watching and safety validation
- **Contents:** File watcher, validation rules

### tools/sandbox/
- **Purpose:** Agent isolation environment
- **Contents:** Sandboxed execution context

## Workspace Configuration

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
  - 'tools/*'
  - 'apps/generated-projects/*'
  - 'templates/*'
```

## Scripts (root package.json)

```json
{
  "scripts": {
    "dev": "pnpm --filter './packages/**' dev",
    "build": "pnpm --filter './packages/**' build",
    "test": "pnpm --filter './packages/**' test",
    "create:project": "node tools/create-factory-project/index.js",
    "checkpoint:create": "node tools/safety-net/create-checkpoint.js",
    "checkpoint:rollback": "node tools/safety-net/rollback.js",
    "guardian:start": "node tools/gemma-guardian/index.js"
  }
}
```
