# OpenClaw SSOT Migration - Complete

**Date**: 2026-03-14
**Status**: Production Ready

## Summary

OpenClaw has been fully migrated to the SSOT (Single Source of Truth) structure at `~/xmad-control/openclaw/`.

## What Was Done

### 1. Created SSOT Startup Script
- **File**: `~/xmad-control/openclaw/scripts/start-ssot.sh`
- **Purpose**: Loads API keys from macOS Keychain before starting OpenClaw
- **Keys Loaded**:
  - `ZAI_API_KEY` (service: z.ai, account: openclaw)
  - `GROQ_API_KEY` (service: SSOT_AI_GROQ)
  - `DEEPSEEK_API_KEY` (service: SSOT_AI_DEEPSEEK)

### 2. Updated LaunchAgent
- **File**: `~/Library/LaunchAgents/ai.openclaw.gateway.plist`
- **Change**: Now uses `start-ssot.sh` instead of running bun directly
- **Benefit**: API keys loaded from Keychain, not hardcoded

### 3. Updated Configuration Paths
- **Config**: `~/xmad-control/openclaw/configs/openclaw.json`
- **Logs**: `~/xmad-control/openclaw/logs/`
- **Workspace**: `~/xmad-control/openclaw/workspace/`
- **Credentials**: `~/xmad-control/openclaw/credentials/`
- **Memory**: `~/xmad-control/openclaw/memory/`

## Keychain SSOT Keys

| Service | Account | Purpose |
|---------|---------|---------|
| z.ai | openclaw | GLM-4.7/GLM-5 agent (primary) |
| SSOT_AI_GROQ | - | Groq Whisper STT |
| SSOT_AI_DEEPSEEK | - | DeepSeek fallback |
| SSOT_AI_GLM_ZAI | SSOT | Alternative ZAI key |
| SSOT_AI_GLM_PAID | SSOT | Paid GLM tier |

## Directory Structure

```
~/xmad-control/openclaw/
├── configs/
│   └── openclaw.json          # Main configuration
├── scripts/
│   ├── start-ssot.sh          # SSOT startup (loads keys from Keychain)
│   ├── start-optimized.sh     # Alternative startup
│   ├── watchdog.sh            # Process monitor
│   └── load-keys.sh           # Key loader only
├── launch_agents/
│   ├── ai.openclaw.gateway.plist
│   └── ai.openclaw.watchdog.plist
├── logs/
│   ├── gateway.log
│   ├── watchdog.log
│   └── startup.log
├── workspace/
│   ├── SOUL.md
│   ├── IDENTITY.md
│   ├── MEMORY.md
│   └── memory/              # Session logs
├── credentials/
│   └── whatsapp/             # WhatsApp credentials
├── memory/
│   └── main.sqlite           # Vector memory database
├── agents/
└── watchdog/
    └── status.json            # Watchdog reports
```

## Commands

### Start Gateway
```bash
# Via LaunchAgent (recommended)
launchctl kickstart gui/$(id -u)/ai.openclaw.gateway

# Or manually with SSOT keys
~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Check Status
```bash
curl http://127.0.0.1:18789/health
# Expected: {"ok":true,"status":"live"}
```

### View Logs
```bash
tail -f ~/xmad-control/openclaw/logs/gateway.log
```

## Old Location (Deprecated)

The old `~/.openclaw/` directory is NO LONGER USED. All files have been migrated to:
- `~/xmad-control/openclaw/`

To remove the old directory after verification:
```bash
# WARNING: Only after confirming everything works
rm -rf ~/.openclaw/
```

## Configuration Highlights

From `configs/openclaw.json`:
- **Port**: 18789
- **Primary Model**: zai/glm-4.7
- **Fallback Model**: zai/glm-5
- **Memory Limit**: 700MB (`--max-old-space-size=700`)
- **WhatsApp**: Enabled with allowlist
- **TTS**: Off (text-only responses to prevent memory issues)

## Verification

```bash
# Check gateway is running
curl http://127.0.0.1:18789/health

# Check LaunchAgent
launchctl list | grep openclaw

# Check process
ps aux | grep openclaw

# Check port
lsof -i :18789
```

## Migration Checklist

- [x] API keys in Keychain (SSOT)
- [x] SSOT startup script created
- [x] LaunchAgent updated
- [x] Config path updated
- [x] Workspace files migrated
- [x] Credentials migrated
- [x] Memory database migrated
- [x] Gateway running from new location
- [x] Health check passing
- [x] Keys loading from Keychain

## Notes

1. **Never hardcode API keys** - Always use Keychain SSOT
2. **All paths in config** point to `~/xmad-control/openclaw/`
3. **LaunchAgent** starts automatically on login
4. **Watchdog** monitors and restarts if needed
