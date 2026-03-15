# XMAD Control Center Documentation

> **Complete documentation for the XMAD Control Center platform**

**Last Updated:** 2026-03-14

---

## Quick Start

```bash
# Start all services
cd ~/xmad-control
bash bootstrap/start-platform.sh

# Check health
curl http://127.0.0.1:18789/health

# View documentation
cat docs/OPENCLAW.md
```

---

## Documentation Index

### Core Documentation
| Document | Description | Status |
|----------|-------------|--------|
| [README](../README.md) | Project overview | Core |
| [CLAUDE.md](../CLAUDE.md) | AI agent instructions | Core |
| [Audit Report](./AUDIT_REPORT.md) | Complete project audit | **Important** |

### Essential Guides
| Document | Description | Status |
|----------|-------------|--------|
| [OpenClaw Guide](./OPENCLAW.md) | OpenClaw gateway setup and configuration | **Essential** |
| [SSOT Keys Guide](./SSOT_KEYS.md) | API key management with Keychain | **Essential** |

### Reference Documentation
| Document | Description | Status |
|----------|-------------|--------|
| [API Reference](./API_REFERENCE.md) | API endpoints and authentication | Reference |
| [Modules Overview](./MODULES.md) | All platform modules explained | Reference |
| [Scripts Reference](./SCRIPTS.md) | Utility scripts and their usage | Reference |

### Operations
| Document | Description | Status |
|----------|-------------|--------|
| [Deployment Guide](./DEPLOYMENT.md) | Production deployment | Operations |
| [Backup & Recovery](./BACKUP_RECOVERY.md) | Backup procedures and disaster recovery | Operations |
| [Troubleshooting](./TROUBLESHOOTING.md) | Common issues and solutions | Operations |

### Plans
| Document | Description | Status |
|----------|-------------|--------|
| [Consolidated Plan](./plans/CONSOLIDATED_PLAN.md) | Complete project plan | Planning |
| [Implementation Plan](./plans/IMPLEMENTATION_PLAN.md) | Dashboard implementation details | Planning |

---

## Key Services

| Service | Port | Purpose |
|---------|------|---------|
| OpenClaw Gateway | 18789 | AI agent runtime |
| XMAD Core API | 9870 | Core API gateway |
| Next.js Dashboard | 3333 | Web interface |

---

## Project Structure

```
xmad-control/
├── CLAUDE.md              # AI agent instructions (READ THIS FIRST)
├── README.md              # Project overview
│
├── bootstrap/             # Platform lifecycle
│   ├── start-platform.sh  # Start all services
│   ├── stop-platform.sh   # Stop all services
│   ├── health-platform.sh # Health check
│   └── env-loader.sh      # Environment loader
│
├── config/                # Configuration
│   ├── ports.env          # Port assignments
│   └── platform.json      # Platform metadata
│
├── modules/               # Feature modules
│   ├── openclaw/          # OpenClaw SSOT installation
│   ├── core/              # XMAD Core API
│   ├── guardian/          # Orchestration
│   ├── monitor/           # Health monitoring
│   ├── network/           # Network utilities
│   ├── claude/            # Claude utilities
│   └── ai-tools/          # AI CLI tools
│
├── openclaw/              # OpenClaw runtime (SSOT location)
│   ├── configs/           # OpenClaw configuration
│   │   └── openclaw.json  # Main config
│   ├── scripts/           # Startup scripts
│   │   ├── start-ssot.sh  # SSOT startup (loads keys)
│   │   ├── watchdog.sh    # Process monitoring
│   │   └── load-keys.sh   # Key loader
│   ├── launch_agents/     # LaunchAgent plists
│   ├── logs/              # Log files
│   ├── workspace/         # Agent workspace
│   └── credentials/       # WhatsApp credentials
│
├── scripts/               # Utility scripts
├── storage/               # Data storage
├── runtime/               # Runtime files
│
└── docs/                  # This documentation
    ├── README.md          # Documentation index (you are here)
    ├── OPENCLAW.md        # OpenClaw guide
    ├── SSOT_KEYS.md       # API key management
    ├── API_REFERENCE.md   # API documentation
    ├── MODULES.md         # Modules overview
    ├── SCRIPTS.md         # Scripts reference
    ├── DEPLOYMENT.md      # Deployment guide
    ├── BACKUP_RECOVERY.md # Backup procedures
    └── TROUBLESHOOTING.md # Troubleshooting
```

---

## Getting Started

### 1. Read the Essentials
1. [CLAUDE.md](../CLAUDE.md) - AI agent instructions
2. [OpenClaw Guide](./OPENCLAW.md) - Gateway configuration
3. [SSOT Keys Guide](./SSOT_KEYS.md) - API key setup

### 2. Start the Platform
```bash
bash ~/xmad-control/bootstrap/start-platform.sh
```

### 3. Verify Health
```bash
curl http://127.0.0.1:18789/health
# Expected: {"ok":true,"status":"live"}
```

---

## Support

For issues or questions:
1. Check [Troubleshooting](./TROUBLESHOOTING.md)
2. Review the relevant module documentation
3. Check logs in `~/xmad-control/openclaw/logs/`
4. See [Backup & Recovery](./BACKUP_RECOVERY.md) for restore procedures
