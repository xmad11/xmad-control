# Backup & Recovery Guide

> **Complete guide for backing up and restoring XMAD Control Center**

---

## Overview

This guide covers backup procedures and disaster recovery for XMAD Control Center. All critical data is stored in `~/xmad-control/` making backup straightforward.

---

## What to Backup

### Critical Files (Must Backup)

| Path | Purpose | Size |
|------|---------|------|
| `openclaw/configs/openclaw.json` | Main OpenClaw configuration | ~4KB |
| `openclaw/workspace/` | Agent memory and identity | ~1MB |
| `openclaw/credentials/` | WhatsApp credentials | ~15MB |
| `openclaw/scripts/` | Startup scripts | ~50KB |
| `openclaw/launch_agents/` | LaunchAgent plists | ~10KB |
| `config/` | Platform configuration | ~5KB |

### Optional Files

| Path | Purpose | Size |
|------|---------|------|
| `openclaw/logs/` | Historical logs | ~50MB |
| `storage/` | Data storage | Varies |

---

## Quick Backup

### Full Backup
```bash
cd ~/xmad-control
tar -czf ~/Desktop/xmad-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  openclaw/configs/ \
  openclaw/workspace/ \
  openclaw/credentials/ \
  openclaw/scripts/ \
  openclaw/launch_agents/ \
  config/ \
  bootstrap/

echo "Backup created: ~/Desktop/xmad-backup-*.tar.gz"
```

### Minimal Backup (Critical Only)
```bash
cd ~/xmad-control
tar -czf ~/Desktop/openclaw-critical-$(date +%Y%m%d).tar.gz \
  openclaw/configs/openclaw.json \
  openclaw/workspace/ \
  openclaw/credentials/
```

### Automated Daily Backup

Create a cron job:
```bash
# Edit crontab
crontab -e

# Add this line for daily backup at 3 AM
0 3 * * * cd ~/xmad-control && tar -czf ~/backups/xmad-auto-$(date +\%Y\%m\%d).tar.gz openclaw/configs openclaw/workspace openclaw/credentials openclaw/scripts config/ 2>/dev/null
```

---

## Recovery Procedures

### Scenario 1: Gateway Not Starting

**Symptoms:**
- `curl http://127.0.0.1:18789/health` returns nothing
- Process exits immediately after starting

**Recovery Steps:**
```bash
# 1. Check API key
security find-generic-password -s "z.ai" -a "openclaw" -w

# 2. If key is missing, add it
security add-generic-password -a "openclaw" -s "z.ai" -w "your-key"

# 3. Check config for errors
cat ~/xmad-control/openclaw/configs/openclaw.json | python3 -m json.tool

# 4. Restart
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Scenario 2: WhatsApp Disconnected

**Symptoms:**
- No messages received
- Credentials missing

**Recovery Steps:**
```bash
# 1. Check credentials exist
ls ~/xmad-control/openclaw/credentials/whatsapp/

# 2. If missing, restore from backup
tar -xzf ~/Desktop/xmad-backup-*.tar.gz openclaw/credentials/

# 3. Restart gateway
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh

# 4. If still not working, re-pair
openclaw channels login --channel whatsapp
```

### Scenario 3: Corrupted Configuration

**Symptoms:**
- Gateway crashes on startup
- JSON parse errors in logs

**Recovery Steps:**
```bash
# 1. Backup corrupted config
cp ~/xmad-control/openclaw/configs/openclaw.json ~/Desktop/openclaw.json.corrupted

# 2. Restore from backup
tar -xzf ~/Desktop/xmad-backup-*.tar.gz openclaw/configs/openclaw.json
mv openclaw/configs/openclaw.json ~/xmad-control/openclaw/configs/

# 3. Restart
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Scenario 4: Lost API Keys

**Symptoms:**
- "No API key found" errors
- Keychain queries fail

**Recovery Steps:**
```bash
# 1. Check if keys exist
security dump-keychain | grep -A5 "z.ai"

# 2. If missing, add back
security add-generic-password -a "openclaw" -s "z.ai" -w "your-key"

# 3. Restart gateway
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

### Scenario 5: Complete System Loss

**Symptoms:**
- Fresh machine
- All data lost

**Recovery Steps:**
```bash
# 1. Install prerequisites
brew install bun
bun install -g openclaw@latest

# 2. Clone repository (if applicable)
git clone <repo-url> ~/xmad-control

# 3. Restore from backup
cd ~/
tar -xzf ~/Desktop/xmad-backup-*.tar.gz

# 4. Add API keys to Keychain
security add-generic-password -a "openclaw" -s "z.ai" -w "your-key"

# 5. Install LaunchAgents
cp ~/xmad-control/openclaw/launch_agents/*.plist ~/Library/LaunchAgents/

# 6. Start services
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
bash ~/xmad-control/openclaw/scripts/watchdog.sh &

# 7. Verify
curl http://127.0.0.1:18789/health
```

---

## Full System Restore

### From Backup Archive

```bash
# 1. Stop all services
bash ~/xmad-control/bootstrap/stop-platform.sh

# 2. Extract backup
cd ~/xmad-control
tar -xzf ~/Desktop/xmad-backup-YYYYMMDD-HHMMSS.tar.gz

# 3. Verify files
ls -la openclaw/configs/
ls -la openclaw/credentials/

# 4. Start services
bash ~/xmad-control/bootstrap/start-platform.sh

# 5. Verify health
bash ~/xmad-control/bootstrap/health-platform.sh
```

---

## Backup Verification

### Verify Backup Integrity

```bash
# List backup contents
tar -tzf ~/Desktop/xmad-backup-*.tar.gz | head -20

# Test extract (dry run)
tar -tzf ~/Desktop/xmad-backup-*.tar.gz
```

### Verify Critical Files

```bash
# Check config is valid JSON
cat ~/xmad-control/openclaw/configs/openclaw.json | python3 -m json.tool > /dev/null && echo "Config OK"

# Check credentials exist
ls ~/xmad-control/openclaw/credentials/whatsapp/ && echo "Credentials OK"

# Check workspace files
ls ~/xmad-control/openclaw/workspace/SOUL.md && echo "Workspace OK"
```

---

## Scheduled Backups

### Using launchd

Create `~/Library/LaunchAgents/com.xmad.backup.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.xmad.backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/YOU/xmad-control/scripts/backup.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>3</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
</dict>
</plist>
```

---

## Backup Script

Create `~/xmad-control/scripts/backup.sh`:

```bash
#!/bin/bash
# XMAD Control Center Backup Script

BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/xmad-backup-$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

cd ~/xmad-control
tar -czf "$BACKUP_FILE" \
  openclaw/configs/ \
  openclaw/workspace/ \
  openclaw/credentials/ \
  openclaw/scripts/ \
  openclaw/launch_agents/ \
  config/ \
  bootstrap/

# Keep only last 7 backups
ls -t "$BACKUP_DIR"/xmad-backup-*.tar.gz | tail -n +8 | xargs rm -f 2>/dev/null

echo "Backup created: $BACKUP_FILE"
```

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [SSOT Keys Guide](./SSOT_KEYS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
