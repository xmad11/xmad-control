# Modules Overview

> **Complete guide to all XMAD Control Center modules**

---

## Module Architecture

XMAD Control Center is organized into modular components, each serving a specific purpose.

```
~/xmad-control/modules/
├── ai-tools/       # AI CLI tools
├── claude/         # Claude utilities
├── core/           # XMAD Core API
├── guardian/       # Orchestration system
├── monitor/        # Health monitoring
├── network/        # Network utilities
└── openclaw/       # OpenClaw SSOT installation
```

---

## Module Details

### 1. ai-tools

**Purpose:** AI command-line utilities

**Location:** `modules/ai-tools/`

**Components:**
- `ai-cli-doctor.sh` - Diagnose AI CLI issues
- `ai-loop-monitor.sh` - Monitor AI processes
- `optimize-ai-clis.sh` - Optimize memory usage
- `claude-clean` - Clean Claude caches
- `deepseek/` - DeepSeek utilities

**Usage:**
```bash
# Diagnose issues
bash ~/xmad-control/modules/ai-tools/ai-cli-doctor.sh

# Optimize memory
bash ~/xmad-control/modules/ai-tools/optimize-ai-clis.sh
```

---

### 2. claude

**Purpose:** Claude Code utilities and helpers

**Location:** `modules/claude/`

**Components:**
- Claude-specific scripts and configurations
- Memory management tools
- Context utilities

**Usage:**
```bash
# Access Claude utilities
ls ~/xmad-control/modules/claude/
```

---

### 3. core

**Purpose:** XMAD Core API Gateway

**Location:** `modules/core/`

**Port:** 9870

**Components:**
- API server
- Authentication middleware
- Request routing
- Rate limiting

**API Endpoints:**
```
GET  /health          # Health check
GET  /api/status      # System status
GET  /api/modules     # Module list
POST /api/execute     # Execute command
```

**Usage:**
```bash
# Check health
curl http://127.0.0.1:9870/health

# Get status
curl http://127.0.0.1:9870/api/status
```

**Configuration:**
- Config: `config/ports.env`
- Environment: `config/platform.json`

---

### 4. guardian

**Purpose:** Orchestration and automation system

**Location:** `modules/guardian/`

**Components:**
- `orchestrator/` - Main orchestration logic
- `agents/` - Agent definitions
- `workflows/` - Workflow scripts
- `schedules/` - Scheduled tasks

**Features:**
- Multi-agent coordination
- Task scheduling
- Event-driven workflows
- Automated recovery

**Usage:**
```bash
# Check guardian status
ls ~/xmad-control/modules/guardian/

# Run workflow
bash ~/xmad-control/modules/guardian/workflows/example.sh
```

---

### 5. monitor

**Purpose:** System health monitoring

**Location:** `modules/monitor/`

**Components:**
- `health-check.sh` - Quick health check
- `memory_port_watch.sh` - Memory and port monitoring
- `system-guardian.sh` - System protection daemon

**Features:**
- Health endpoint monitoring
- Memory usage tracking
- Automatic restart on failure
- Alert system

**Usage:**
```bash
# Run health check
bash ~/xmad-control/modules/monitor/health-check.sh

# Start system guardian
bash ~/xmad-control/modules/monitor/system-guardian.sh &
```

**Monitoring Dashboard:**
- Real-time status at `/monitor` endpoint
- Logs at `~/xmad-control/openclaw/logs/`

---

### 6. network

**Purpose:** Network utilities

**Location:** `modules/network/`

**Components:**
- `start-tailscale.sh` - Start Tailscale VPN
- `tailscale-autoconnect.sh` - Auto-connect to network

**Features:**
- Tailscale VPN management
- Network discovery
- Remote access setup

**Usage:**
```bash
# Start Tailscale
bash ~/xmad-control/modules/network/start-tailscale.sh

# Auto-connect
bash ~/xmad-control/modules/network/tailscale-autoconnect.sh
```

---

### 7. openclaw

**Purpose:** OpenClaw SSOT installation (symlink to `/openclaw/`)

**Location:** `modules/openclaw/` → `~/xmad-control/openclaw/`

**Port:** 18789

**Components:**
- Gateway runtime
- WhatsApp integration
- AI agent system
- Configuration management

**See:** [OpenClaw Documentation](./OPENCLAW.md)

---

## Module Interactions

```
┌─────────────────────────────────────────────────────────────────┐
│                     XMAD CONTROL CENTER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐                   │
│  │ Monitor │────►│ Guardian │────►│  Core   │                   │
│  │ :9870   │     │         │     │  :9870  │                   │
│  └────┬────┘     └────┬────┘     └────┬────┘                   │
│       │               │                │                         │
│       ▼               ▼                ▼                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    OpenClaw Gateway                       │   │
│  │                      :18789                              │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │   │
│  │  │WhatsApp │  │  AI/LLM  │  │ Agent   │                 │   │
│  │  └─────────┘  └─────────┘  └─────────┘                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Network Layer                          │   │
│  │  ┌──────────┐  ┌──────────┐                            │   │
│  │  │Tailscale │  │  Local   │                            │   │
│  │  └──────────┘  └──────────┘                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Status Check

```bash
# Check all modules
for module in ai-tools claude core guardian monitor network openclaw; do
  echo "=== $module ==="
  ls ~/xmad-control/modules/$module/ 2>/dev/null | head -5
done
```

---

## Adding New Modules

1. Create module directory:
```bash
mkdir -p ~/xmad-control/modules/my-module
```

2. Add module files:
```bash
touch ~/xmad-control/modules/my-module/{README.md,config.json,main.sh}
```

3. Register in platform config:
```bash
# Add to config/platform.json
```

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)
