# XMAD Control Center

> **Single Source of Truth (SSOT) Platform for AI Infrastructure Management**

A comprehensive platform for managing AI services, monitoring, and automation with OpenClaw integration.

---

## Overview

XMAD Control Center is a unified platform that provides:
- **OpenClaw Gateway** - AI agent runtime with WhatsApp integration
- **XMAD Core API** - Core API gateway (port 9870)
- **Dashboard** - Next.js 16 web interface (port 3333)
- **Monitoring** - System health and memory monitoring
- **Guardian** - Orchestration and automation

---

## Quick Start

```bash
# Start all services
cd ~/xmad-control
./bootstrap/start-platform.sh

# Check health
./bootstrap/health-platform.sh

# Stop all services
./bootstrap/stop-platform.sh
```

---

## Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| OpenClaw Gateway | 18789 | AI agent runtime |
| XMAD Core API | 9870 | Core API gateway |
| Next.js Dashboard | 3333 | Web interface |
| Tailscale | 41641 | VPN access |

---

## Project Structure

```
xmad-control/
├── bootstrap/              # Platform lifecycle scripts
│   ├── start-platform.sh
│   ├── stop-platform.sh
│   ├── health-platform.sh
│   └── env-loader.sh
│
├── config/                 # Configuration files
│   ├── ports.env
│   ├── paths.env
│   └── platform.json
│
├── modules/                # Feature modules
│   ├── ai-tools/           # AI CLI utilities
│   ├── claude/             # Claude Code utilities
│   ├── core/               # XMAD Core API
│   ├── guardian/           # Orchestration system
│   ├── monitor/            # Health monitoring
│   ├── network/            # Network tools
│   └── openclaw/           # OpenClaw SSOT installation
│
├── openclaw/               # OpenClaw runtime (SSOT)
│   ├── configs/            # OpenClaw configuration
│   ├── scripts/            # Startup scripts
│   ├── launch_agents/      # LaunchAgent plists
│   ├── logs/               # Log files
│   ├── workspace/          # Agent workspace
│   └── credentials/        # WhatsApp credentials
│
├── scripts/                # Utility scripts
├── storage/                # Persistent storage
│   ├── backups/
│   ├── logs/
│   ├── automation/
│   └── config/
│
└── docs/                   # Documentation
```

---

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [OpenClaw Documentation](docs/OPENCLAW.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Backup & Recovery](docs/BACKUP_RECOVERY.md)

---

## Requirements

- **Node.js** v22+ (via NVM)
- **Bun** runtime
- **macOS** (for Keychain integration)

---

## License

MIT License
