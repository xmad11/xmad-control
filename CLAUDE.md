# CLAUDE.md — Project Instructions for AI Agents

> **XMAD Control Center - AI Infrastructure Platform**

---

## Project Overview

XMAD Control Center is a unified platform for managing AI services, It includes:
- **OpenClaw Gateway** - AI agent runtime with WhatsApp integration (port 18789)
- **XMAD Core API** - Core API gateway (port 9870)
- **Next.js Dashboard** - Web interface (port 3333)
- **Monitoring** - Health checks and memory monitoring

---

## Critical Rules

### 1. SSOT Location
**Everything lives in `~/xmad-control/`**

Never use:
- `~/.openclaw/` (deprecated, old location)
- `~/Desktop/xmad-control-center/` (does not exist)

### 2. API Keys
**Always use macOS Keychain (SSOT)**

```bash
# Correct way to get keys
security find-generic-password -s "z.ai" -a "openclaw" -w

# Wrong way (never do this)
# Hardcoding keys in config files
```

### 3. OpenClaw Configuration
**Config location:** `~/xmad-control/openclaw/configs/openclaw.json`

**Never modify without reading first:**
```bash
cat ~/xmad-control/openclaw/configs/openclaw.json
```

### 4. Memory Limit
**OpenClaw memory limit: 700MB**

If memory exceeds 700MB, restart the gateway:
```bash
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

---

## Quick Reference

### Start Platform
```bash
cd ~/xmad-control
bash bootstrap/start-platform.sh
```

### Stop Platform
```bash
cd ~/xmad-control
bash bootstrap/stop-platform.sh
```

### Check Health
```bash
# Quick check
curl http://127.0.0.1:18789/health

# Full health check
bash bootstrap/health-platform.sh
```

### View Logs
```bash
# Gateway logs
tail -f ~/xmad-control/openclaw/logs/gateway.log

# Watchdog logs
tail -f ~/xmad-control/openclaw/logs/watchdog.log
```

---

## File Structure

```
~/xmad-control/
├── CLAUDE.md                 # This file (read this first!)
├── README.md                 # Project README
├── bootstrap/                # Platform lifecycle scripts
│   ├── start-platform.sh     # Start all services
│   ├── stop-platform.sh      # Stop all services
│   ├── health-platform.sh    # Health check
│   └── env-loader.sh         # Environment setup
│
├── config/                   # Configuration files
│   ├── ports.env             # Port assignments
│   └── platform.json         # Platform metadata
│
├── modules/                  # Feature modules
│   ├── ai-tools/             # AI CLI utilities
│   ├── claude/               # Claude utilities
│   ├── core/                 # XMAD Core API
│   ├── guardian/             # Orchestration
│   ├── monitor/              # Health monitoring
│   ├── network/              # Network utilities
│   └── openclaw/             # OpenClaw symlink
│
├── openclaw/                 # OpenClaw SSOT runtime
│   ├── configs/              # Configuration
│   │   └── openclaw.json     # Main config
│   ├── scripts/              # Startup scripts
│   │   ├── start-ssot.sh     # SSOT startup
│   │   ├── watchdog.sh       # Process monitor
│   │   └── load-keys.sh      # Key loader
│   ├── launch_agents/         # LaunchAgent plists
│   ├── logs/                  # Log files
│   ├── workspace/             # Agent workspace
│   └── credentials/           # WhatsApp credentials
│
├── scripts/                  # Utility scripts
├── storage/                  # Data storage
├── runtime/                  # Runtime files
└── docs/                     # Documentation
    ├── README.md             # Documentation index
    ├── OPENCLAW.md           # OpenClaw guide
    ├── SSOT_KEYS.md          # API key management
    ├── DEPLOYMENT.md         # Deployment guide
    ├── BACKUP_RECOVERY.md    # Backup procedures
    ├── TROUBLESHOOTING.md    # Troubleshooting
    ├── MODULES.md            # Modules overview
    └── API_REFERENCE.md      # API documentation
```

---

## Key Services

### OpenClaw Gateway (Port 18789)
- AI agent runtime
- WhatsApp integration
- GLM-4.7/GLM-5 models

### XMAD Core API (Port 9870)
- Core API gateway
- Authentication middleware
- Rate limiting

### Dashboard (Port 3333)
- Next.js 16 web interface
- Real-time monitoring
- Configuration UI

---

## Common Tasks

### Restart OpenClaw
```bash
# Graceful restart
pkill -f openclaw
sleep 2
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Check API Keys
```bash
# List keys
security dump-keychain | grep -A5 "z.ai"

# Get specific key
security find-generic-password -s "z.ai" -a "openclaw" -w
```

### Update Configuration
```bash
# 1. Read current config
cat ~/xmad-control/openclaw/configs/openclaw.json

# 2. Edit carefully
nano ~/xmad-control/openclaw/configs/openclaw.json

# 3. Restart to apply
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Backup Critical Files
```bash
cd ~/xmad-control
tar -czf ~/Desktop/backup-$(date +%Y%m%d).tar.gz \
  openclaw/configs/ \
  openclaw/workspace/ \
  openclaw/credentials/
```

---

## Troubleshooting

### Gateway Not Responding
```bash
# 1. Check process
ps aux | grep openclaw

# 2. Check port
lsof -i :18789

# 3. Check logs
tail -50 ~/xmad-control/openclaw/logs/gateway.log

# 4. Restart
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### High Memory Usage
```bash
# Check memory
ps aux | grep openclaw | awk '{print $6/1024 "MB"}'

# If > 700MB, restart
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### API Key Issues
```bash
# Verify key exists
security find-generic-password -s "z.ai" -a "openclaw" -w

# If missing, add it
security add-generic-password -a "openclaw" -s "z.ai" -w "your-key"
```

---

## Documentation

For detailed information, see:
- [OpenClaw Guide](docs/OPENCLAW.md)
- [SSOT Keys](docs/SSOT_KEYS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Backup & Recovery](docs/BACKUP_RECOVERY.md)

---

## Memory for AI Sessions

This project uses auto-memory. Key memories:
- **SSOT Location:** `~/xmad-control/`
- **OpenClaw Config:** `~/xmad-control/openclaw/configs/openclaw.json`
- **Keys in Keychain:** `security find-generic-password -s "z.ai" -a "openclaw" -w`
- **Memory Limit:** 700MB
- **Primary Model:** `zai/glm-4.7`
- **Fallback Model:** `zai/glm-5`

---

**Last Updated:** 2026-03-14
