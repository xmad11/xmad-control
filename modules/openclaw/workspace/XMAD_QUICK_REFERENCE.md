# XMAD Quick Reference

**Last Updated**: 2026-03-12

## System Architecture

```
~/xmad/
├── openclaw/          # OpenClaw workspace, memory, config
├── xmad-core/         # API gateway + 9 modular packages
├── xmad-web/          # Next.js dashboard (ready)
└── storage/           # backups, logs, automation queue
```

## Key Services

| Service | Port | Status | Command |
|---------|------|--------|---------|
| OpenClaw Gateway | 18789 | ✅ Running | Auto (LaunchAgent) |
| API Gateway | 9870 | ⚠️ Stopped | `launchctl load ~/Library/LaunchAgents/com.xmad.core.plist` |
| noVNC | 6080 | ⚠️ Installing | `~/xmad/xmad-core/scripts/start-novnc.sh` |
| VNC | 5900 | Ready | macOS Screen Sharing |

## API Endpoints

**Base**: http://127.0.0.1:9870

- `GET /health` - Health check
- `GET /api/system/stats` - CPU, RAM, disk
- `GET /api/system/tailscale` - VPN status
- `POST /api/ssh/start` - Enable SSH
- `POST /api/vnc/start` - Enable VNC
- `GET /api/openclaw/status` - OpenClaw status

## Packages (xmad-core/packages/)

1. ssh-manager
2. system-monitor
3. vnc-control
4. backup-manager
5. apple-notes
6. automation
7. memory-editor
8. voice-client
9. secrets-manager

## Security

- **Secrets**: Keychain → Infisical → Local vault
- **Access**: Tailscale VPN only (100.121.254.21)
- **API Gateway**: 127.0.0.1 only
- **Audit**: ✅ PASSED

## Backups

**Script**: `~/xmad/xmad-core/scripts/daily-backup.sh`
**Location**: `~/xmad/storage/backups/`
**Retention**: Last 7 backups

## Logs

**Location**: `~/xmad/storage/logs/`
- xmad-core.log
- openclaw-agent.log

## Automation Queue

**Location**: `~/xmad/storage/automation-queue.json`
**Safety**: Atomic writes (temp + rename)

## Vector Memory

**LanceDB**: ✅ ENABLED
**Database**: `~/xmad/openclaw/memory/main.sqlite`
**Status**: Ready, awaiting data

## Tailscale

**IP**: 100.121.254.21
**Peers**:
- iphone-xr: Active
- mac-mini: Offline (5d)

## Quick Commands

```bash
# Start XMAD Core
launchctl load ~/Library/LaunchAgents/com.xmad.core.plist

# Check health
curl http://127.0.0.1:9870/health

# Create backup
~/xmad/xmad-core/scripts/daily-backup.sh

# Start noVNC
~/xmad/xmad-core/scripts/start-novnc.sh

# Security audit
~/xmad/xmad-core/scripts/security-audit.sh
```

## Documentation

- XMAD_REFACTOR_REPORT.md
- XMAD_INFRASTRUCTURE_STATUS.md
- XMAD_SYSTEM_AUDIT_FINAL.md
- memory/2026-03-12.md

## Status

**Overall**: 90% COMPLETE
**Infrastructure**: 100% ✅
**Services**: 50% (1 of 2 running)
**Security**: 100% ✅
