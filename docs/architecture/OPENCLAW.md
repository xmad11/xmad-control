# OpenClaw Gateway Documentation

> **Complete guide for OpenClaw setup, configuration, and usage**

---

## Overview

OpenClaw is an AI agent runtime that powers the XMAD Control Center's conversational AI capabilities. It runs as a gateway service on port 18789 and integrates with WhatsApp for messaging.

### Key Features
- **AI Agent Runtime** - Powered by z.ai GLM models
- **WhatsApp Integration** - Business WhatsApp messaging
- **SSOT Configuration** - Single source of truth at `~/xmad-control/openclaw/`
- **Keychain Security** - API keys stored securely in macOS Keychain
- **Auto-restart** - LaunchAgent with watchdog monitoring

---

## Installation

### Prerequisites
- macOS (for Keychain integration)
- Bun runtime
- Node.js v22+ (via NVM)

### Install OpenClaw
```bash
# Install OpenClaw globally
bun install -g openclaw@latest

# Verify installation
openclaw --version
```

---

## Directory Structure

```
~/xmad-control/openclaw/
├── configs/
│   └── openclaw.json        # Main configuration
│
├── scripts/
│   ├── start-ssot.sh        # SSOT startup (loads keys from Keychain)
│   ├── start-optimized.sh   # Alternative startup
│   ├── watchdog.sh          # Process monitoring
│   └── load-keys.sh         # Key loader only
│
├── launch_agents/
│   ├── ai.openclaw.gateway.plist   # Gateway LaunchAgent
│   └── ai.openclaw.watchdog.plist  # Watchdog LaunchAgent
│
├── logs/
│   ├── gateway.log          # Gateway logs
│   ├── watchdog.log         # Watchdog logs
│   └── startup.log          # Startup logs
│
├── workspace/
│   ├── SOUL.md              # Agent personality
│   ├── IDENTITY.md          # Agent identity
│   ├── MEMORY.md            # Long-term memory
│   └── memory/              # Session logs
│
├── credentials/
│   └── whatsapp/            # WhatsApp credentials
│
├── agents/                  # Agent sessions
└── watchdog/                # Watchdog status
```

---

## Configuration

### Main Config: `configs/openclaw.json`

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-gateway-token"
    }
  },
  "agents": {
    "defaults": {
    "model": {
      "primary": "zai/glm-4.7",
      "fallbacks": ["zai/glm-5"]
    },
    "workspace": "/Users/YOU/xmad-control/openclaw/workspace"
  }
  },
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "pairing",
      "allowFrom": ["+971504042000"]
    }
  }
}
```

### Key Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `gateway.port` | Gateway port | 18789 |
| `gateway.mode` | local/cloud | local |
| `gateway.bind` | loopback/all | loopback |
| `agents.defaults.model.primary` | Primary AI model | zai/glm-4.7 |
| `channels.whatsapp.enabled` | Enable WhatsApp | false |
| `messages.tts.auto` | TTS mode | off |

---

## API Keys (SSOT)

### Keychain Storage

All API keys are stored securely in macOS Keychain:

| Key | Service | Account | Usage |
|-----|---------|---------|-------|
| `ZAI_API_KEY` | `z.ai` | `openclaw` | GLM-4.7/GLM-5 models |
| `GROQ_API_KEY` | `SSOT_AI_GROQ` | - | Whisper STT |
| `DEEPSEEK_API_KEY` | `SSOT_AI_DEEPSEEK` | - | DeepSeek fallback |

### Managing Keys

```bash
# Add z.ai key
security add-generic-password -a "openclaw" -s "z.ai" -w "your-api-key"

# Add Groq key (optional)
security add-generic-password -a "SSOT" -s "SSOT_AI_GROQ" -w "your-groq-key"

# View keys (requires approval)
security find-generic-password -s "z.ai" -a "openclaw" -w
```

### How Keys Are Loaded

The `start-ssot.sh` script loads keys from Keychain before starting OpenClaw:

```bash
# This happens automatically
export ZAI_API_KEY=$(security find-generic-password -s "z.ai" -a "openclaw" -w)
```

---

## Starting OpenClaw

### Method 1: SSOT Script (Recommended)
```bash
# Start with Keychain key loading
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Method 2: LaunchAgent (Auto-start on boot)
```bash
# Install LaunchAgent
cp ~/xmad-control/openclaw/launch_agents/ai.openclaw.gateway.plist ~/Library/LaunchAgents/

# Load and start
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# Or kickstart directly
launchctl kickstart gui/$(id -u)/ai.openclaw.gateway
```

### Method 3: Direct Command
```bash
# Start gateway directly (keys must be in environment)
~/.bun/bin/bun --bun ~/.bun/install/global/node_modules/openclaw/openclaw.mjs gateway --port 18789
```

---

## Health Checks

### Check Gateway Status
```bash
# Simple health check
curl http://127.0.0.1:18789/health
# Expected: {"ok":true,"status":"live"}

# Check process
ps aux | grep openclaw

# Check port
lsof -i :18789

# Check memory
ps -o rss= -p $(pgrep -f openclaw) | awk '{print int($1/1024) "MB"}'
```

### Using health-platform.sh
```bash
bash ~/xmad-control/bootstrap/health-platform.sh
```

---

## WhatsApp Integration

### Pairing WhatsApp

```bash
# Start pairing process
cd ~/xmad-control/openclaw
openclaw channels login --channel whatsapp

# Scan QR code with Business WhatsApp app
```

### WhatsApp Configuration

In `configs/openclaw.json`:
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "pairing",
      "allowFrom": ["+971504042000", "+971502059116"],
      "groupPolicy": "allowlist",
      "textChunkLimit": 4000,
      "blockStreaming": true,
      "mediaMaxMb": 5
    }
  }
}
```

---

## Watchdog

The watchdog monitors OpenClaw and restarts it if needed.

### What Watchdog Monitors
- **Memory usage** - Restarts if > 700MB
- **Health endpoint** - Restarts after 3 consecutive failures
- **Process existence** - Restarts if process dies
- **UN state** - Restarts on I/O hang

### Starting Watchdog
```bash
# Manual start
bash ~/xmad-control/openclaw/scripts/watchdog.sh &

# Via LaunchAgent
cp ~/xmad-control/openclaw/launch_agents/ai.openclaw.watchdog.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/ai.openclaw.watchdog.plist
```

### Watchdog Status

Check status at:
```
~/xmad-control/openclaw/watchdog/status.json
```

---

## Logs

### Log Locations
```
~/xmad-control/openclaw/logs/
├── gateway.log      # Main gateway logs
├── gateway.err.log  # Gateway errors
├── watchdog.log     # Watchdog activity
└── startup.log      # Startup logs
```

### Viewing Logs
```bash
# Gateway logs
tail -f ~/xmad-control/openclaw/logs/gateway.log

# Watchdog logs
tail -f ~/xmad-control/openclaw/logs/watchdog.log

# Errors only
tail -f ~/xmad-control/openclaw/logs/gateway.err.log
```

---

## Troubleshooting

### Gateway Won't Start

1. **Check API key**
```bash
security find-generic-password -s "z.ai" -a "openclaw" -w
```

2. **Check logs**
```bash
tail -50 ~/xmad-control/openclaw/logs/gateway.log
```

3. **Check port conflict**
```bash
lsof -i :18789
```

### High Memory Usage

```bash
# Check memory
ps aux | grep openclaw

# If > 700MB, watchdog will restart automatically
# Or manually restart:
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### WhatsApp Not Connecting

1. **Check credentials exist**
```bash
ls ~/xmad-control/openclaw/credentials/whatsapp/
```

2. **Re-pair**
```bash
openclaw channels login --channel whatsapp
```

---

## Memory Optimization

OpenClaw is configured for low memory usage:
- **Memory limit**: 700MB (`--max-old-space-size=700`)
- **Garbage collection**: Enabled (`--expose-gc`)
- **TTS**: Disabled (prevents audio memory spikes)

### Memory Configuration

In LaunchAgent:
```xml
<key>NODE_OPTIONS</key>
<string>--max-old-space-size=700 --expose-gc</string>
```

---

## Backup & Recovery

### What to Backup
```bash
# Critical files
~/xmad-control/openclaw/configs/openclaw.json
~/xmad-control/openclaw/workspace/
~/xmad-control/openclaw/credentials/
~/xmad-control/openclaw/scripts/
```

### Quick Backup
```bash
cd ~/xmad-control/openclaw
tar -czf ~/Desktop/openclaw-backup-$(date +%Y%m%d).tar.gz \
  configs/ workspace/ credentials/ scripts/ launch_agents/
```

### Full Recovery
See [Backup & Recovery Guide](./BACKUP_RECOVERY.md)

---

## Related Documentation

- [API Reference](./API_REFERENCE.md)
- [SSOT Keys Guide](./SSOT_KEYS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Backup & Recovery](./BACKUP_RECOVERY.md)
