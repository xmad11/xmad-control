# XMAD Control Center - Consolidated Project Plan

**Last Updated:** 2026-03-14
**Status:** In Progress (81% Complete)

---

## Project Overview

XMAD Control Center is a Single Source of Truth (SSOT) platform for AI infrastructure management, featuring:
- **OpenClaw Gateway** - AI agent runtime with WhatsApp integration
- **XMAD Core API** - Core API gateway
- **Next.js Dashboard** - Web interface
- **Monitoring** - System health and memory monitoring

---

## Current Status

| Component | Status | Completion |
|-----------|--------|------------|
| SSOT Migration | ✅ Complete | 90% |
| Documentation | ✅ Complete | 100% |
| OpenClaw Gateway | ✅ Running | 95% |
| Bootstrap Scripts | ✅ Working | 100% |
| Security | ⚠️ Issues | 60% |
| Dashboard Pages | ⚠️ Needs Work | 20% |

---

## Critical Issues to Fix

### 1. 🔴 SECURITY: Remove Hardcoded API Key

**Location:** `openclaw/configs/auth-profiles.json`

**Current (BAD):**
```json
{
  "profiles": {
    "zai": {
      "apiKey": "4ee8f8d1f6214b5690ae0bab05ef0333.I15u7DOEDtcBTkmn"
    }
  }
}
```

**Fix:**
```json
{
  "profiles": {
    "zai": {
      "type": "api_key",
      "provider": "zai",
      "apiKey": "${ZAI_API_KEY}"
    }
  }
}
```

**Then:** Keys loaded from Keychain via `start-ssot.sh`

---

### 2. ⚠️ Start Watchdog Service

```bash
launchctl load ~/Library/LaunchAgents/ai.openclaw.watchdog.plist
```

---

### 3. ⚠️ Create Missing Directory

```bash
mkdir -p ~/xmad-control/openclaw/skills
```

---

### 4. ⚠️ Delete Old Location (After Verification)

```bash
# First verify everything works
bash ~/xmad-control/bootstrap/health-platform.sh

# Then backup and remove
mv ~/.openclaw ~/.openclaw.backup.$(date +%Y%m%d)
```

---

## Pending Implementation Tasks

### Phase 1: Security & Cleanup (Today)
- [ ] Remove hardcoded API key
- [ ] Start watchdog LaunchAgent
- [ ] Create skills directory
- [ ] Update old path references

### Phase 2: Dashboard Features (This Week)
- [ ] Connect Dashboard to OpenClaw API
- [ ] Implement SSE events endpoint
- [ ] Create chat interface
- [ ] Build memory editor

### Phase 3: Advanced Features (Next Week)
- [ ] Implement automation queue
- [ ] Add backup manager
- [ ] Create settings UI
- [ ] Set up automated backups

---

## Directory Structure

```
~/xmad-control/
├── CLAUDE.md              # AI agent instructions
├── README.md              # Project overview
│
├── bootstrap/             # Platform lifecycle
│   ├── start-platform.sh
│   ├── stop-platform.sh
│   ├── health-platform.sh
│   └── env-loader.sh
│
├── config/                # Configuration
│   ├── ports.env
│   ├── paths.env
│   └── platform.json
│
├── modules/               # Feature modules
│   ├── ai-tools/
│   ├── claude/
│   ├── core/
│   ├── guardian/
│   ├── monitor/
│   ├── network/
│   └── openclaw/
│
├── openclaw/              # OpenClaw SSOT runtime
│   ├── configs/
│   ├── scripts/
│   ├── launch_agents/
│   ├── logs/
│   ├── workspace/
│   └── credentials/
│
├── docs/                  # Documentation
│   ├── README.md
│   ├── OPENCLAW.md
│   ├── SSOT_KEYS.md
│   ├── MODULES.md
│   ├── SCRIPTS.md
│   ├── DEPLOYMENT.md
│   ├── BACKUP_RECOVERY.md
│   ├── TROUBLESHOOTING.md
│   ├── API_REFERENCE.md
│   ├── AUDIT_REPORT.md
│   ├── plans/
│   │   └── IMPLEMENTATION_PLAN.md
│   └── audit/
│       └── (audit reports)
│
├── scripts/               # Utility scripts
├── storage/               # Data storage
└── runtime/               # Runtime files
```

---

## Services & Ports

| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| OpenClaw Gateway | 18789 | ✅ Running | AI agent runtime |
| XMAD Core API | 9870 | ⚠️ Optional | Core API gateway |
| Next.js Dashboard | 3333 | ⚠️ Dev Mode | Web interface |
| Tailscale | 41641 | ✅ Active | VPN access |

---

## API Keys (Keychain SSOT)

| Key | Service | Account | Usage |
|-----|---------|---------|-------|
| `ZAI_API_KEY` | `z.ai` | `openclaw` | GLM-4.7/GLM-5 models |
| `GROQ_API_KEY` | `SSOT_AI_GROQ` | - | Whisper STT |
| `DEEPSEEK_API_KEY` | `SSOT_AI_DEEPSEEK` | - | DeepSeek fallback |

---

## Quick Commands

```bash
# Start platform
bash ~/xmad-control/bootstrap/start-platform.sh

# Stop platform
bash ~/xmad-control/bootstrap/stop-platform.sh

# Health check
bash ~/xmad-control/bootstrap/health-platform.sh

# Check OpenClaw
curl http://127.0.0.1:18789/health

# View logs
tail -f ~/xmad-control/openclaw/logs/gateway.log

# Create backup
cd ~/xmad-control
tar -czf ~/Desktop/backup-$(date +%Y%m%d).tar.gz \
  openclaw/configs openclaw/workspace openclaw/credentials
```

---

## Backup Location

**Current Backup:** `~/Desktop/xmad-backup-20260314-170827.tar.gz`

**Contents:**
- OpenClaw configs, workspace, credentials
- Bootstrap scripts
- All documentation

---

## Next Session Checklist

1. [ ] Fix hardcoded API key
2. [ ] Start watchdog service
3. [ ] Verify all services healthy
4. [ ] Implement dashboard chat interface
5. [ ] Connect to OpenClaw API
6. [ ] Set up automated backups

---

**Last Updated:** 2026-03-14
**Backup:** ~/Desktop/xmad-backup-20260314-170827.tar.gz
