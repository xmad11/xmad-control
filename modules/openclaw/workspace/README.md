# Factory Monorepo

Factory-style monorepo for AI agent development with shared packages, tools, and templates.

## 📁 Structure

```
factory-monorepo/
├── apps/
│   └── generated-projects/          # Agent-created projects
├── packages/
│   ├── general-ssot/                 # Configuration & secrets (Infisical)
│   ├── frontend-hub/                 # Shared UI components
│   ├── backend-hub/                  # Auth, API utilities
│   └── ai-hub/                       # Nova AI, agent frameworks
├── tools/
│   ├── create-factory-project/       # CLI scaffolding tool
│   ├── safety-net/                   # Checkpoint/rollback scripts
│   ├── gemma-guardian/               # File watcher & validator
│   └── sandbox/                      # Agent isolation
├── templates/
│   ├── basic-app/                    # Minimal app template
│   ├── fullstack-app/                # Frontend + backend template
│   └── ai-agent/                     # AI agent template
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.16.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run dev mode
pnpm dev
```

## 📦 Packages

### general-ssot
Central configuration and secrets management with Infisical integration.

### frontend-hub
Shared React/Vue components and UI utilities.

### backend-hub
Shared backend utilities, auth middleware, and API helpers.

### ai-hub
AI integrations, agent frameworks, and Nova AI orchestration.

## 🛠️ Tools

### create-factory-project
CLI tool to scaffold new projects from templates.

```bash
pnpm create:project
```

### safety-net
Checkpoint and rollback system for safe experimentation.

```bash
pnpm checkpoint:create "Description"
pnpm checkpoint:list
pnpm checkpoint:rollback <name>
```

### gemma-guardian
File watcher and validation system.

```bash
pnpm guardian:start
pnpm guardian:validate
```

### sandbox
Isolated execution environment for agents.

```bash
pnpm sandbox:run <script>
```

## 📋 Templates

- **basic-app** - Minimal starter project
- **fullstack-app** - Complete frontend + backend setup
- **ai-agent** - AI agent with Nova integration

## 🗺️ Roadmap

See [MASTER-SSOT-ROADMAP.md](./MASTER-SSOT-ROADMAP.md) for detailed architecture.

## 📝 Development Status

✅ **Structure Complete** - Monorepo structure created
🚧 **Implementation Pending** - Package code not yet implemented

## 🤝 Contributing

This is an internal factory monorepo for AI agent development.

## 📄 License

MIT
