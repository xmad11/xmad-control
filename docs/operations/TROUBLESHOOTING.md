# Troubleshooting Guide

> **Common issues and solutions for XMAD Control Center**

---

## Quick Diagnostics

### Run Health Check
```bash
bash ~/xmad-control/bootstrap/health-platform.sh
```

### Check All Services
```bash
# Gateway health
curl http://127.0.0.1:18789/health

# Process status
ps aux | grep -E "openclaw|xmad"

# Port usage
lsof -i :18789
lsof -i :9870

# Memory usage
ps aux | grep openclaw | awk '{print $6/1024 "MB"}'
```

---

## Common Issues

### Issue: Gateway Not Responding

**Symptoms:**
- `curl http://127.0.0.1:18789/health` returns nothing
- Connection refused

**Causes & Solutions:**

1. **Gateway not running**
```bash
# Check process
ps aux | grep openclaw

# Start if not running
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

2. **Port blocked**
```bash
# Check what's using port
lsof -i :18789

# Kill blocking process
kill -9 <PID>

# Restart
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

3. **LaunchAgent not loaded**
```bash
# Load LaunchAgent
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# Or kickstart
launchctl kickstart gui/$(id -u)/ai.openclaw.gateway
```

---

### Issue: API Key Not Found

**Symptoms:**
- "No API key found" error in logs
- Gateway starts but AI queries fail

**Solutions:**

1. **Check key exists**
```bash
security find-generic-password -s "z.ai" -a "openclaw" -w
```

2. **Add key if missing**
```bash
security add-generic-password -a "openclaw" -s "z.ai" -w "your-api-key"
```

3. **Restart with SSOT script**
```bash
pkill -f openclaw
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

---

### Issue: High Memory Usage

**Symptoms:**
- Memory > 700MB
- System slowdown
- Process becomes unresponsive

**Solutions:**

1. **Check memory**
```bash
ps aux | grep openclaw
```

2. **Manual restart**
```bash
pkill -f openclaw
sleep 3
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

3. **Check watchdog is running**
```bash
ps aux | grep watchdog
# If not running:
bash ~/xmad-control/openclaw/scripts/watchdog.sh &
```

4. **Reduce memory further**
```bash
# Edit launch agent to reduce limit
# Change --max-old-space-size=700 to 500
```

---

### Issue: WhatsApp Not Working

**Symptoms:**
- No messages received
- "WhatsApp disconnected" in logs

**Solutions:**

1. **Check credentials**
```bash
ls ~/xmad-control/openclaw/credentials/whatsapp/
```

2. **Re-pair WhatsApp**
```bash
cd ~/xmad-control/openclaw
openclaw channels login --channel whatsapp
# Scan QR with Business WhatsApp app
```

3. **Check config**
```bash
# Verify WhatsApp is enabled
cat ~/xmad-control/openclaw/configs/openclaw.json | grep -A10 whatsapp
```

---

### Issue: LaunchAgent Won't Start

**Symptoms:**
- `launchctl list` shows nothing for openclaw
- Service doesn't auto-start on boot

**Solutions:**

1. **Check plist syntax**
```bash
plutil -lint ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

2. **Fix permissions**
```bash
chmod 644 ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

3. **Reload LaunchAgent**
```bash
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

4. **Check logs**
```bash
tail -50 ~/xmad-control/openclaw/logs/gateway.log
```

---

### Issue: Gateway Crashes Repeatedly

**Symptoms:**
- Process dies shortly after starting
- Restart loop

**Solutions:**

1. **Check crash logs**
```bash
tail -100 ~/xmad-control/openclaw/logs/gateway.err.log
```

2. **Check config validity**
```bash
cat ~/xmad-control/openclaw/configs/openclaw.json | python3 -m json.tool
```

3. **Reset to default config**
```bash
# Backup current
cp ~/xmad-control/openclaw/configs/openclaw.json ~/Desktop/openclaw.json.bak

# Restore from backup
tar -xzf ~/Desktop/xmad-backup-*.tar.gz openclaw/configs/openclaw.json
```

4. **Check OpenClaw version**
```bash
openclaw --version
# Update if needed
bun install -g openclaw@latest
```

---

### Issue: UN State (I/O Hang)

**Symptoms:**
- Process shows "U" state in ps
- Completely unresponsive
- Can't kill normally

**Solutions:**

1. **Force kill**
```bash
pkill -9 -f openclaw
```

2. **If that doesn't work, find and kill**
```bash
ps aux | grep openclaw
kill -9 <PID>
```

3. **Clear temp files**
```bash
rm -rf ~/xmad-control/openclaw/cache/*
rm -rf ~/xmad-control/openclaw/temp/*
```

4. **Restart**
```bash
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

---

### Issue: Keychain Access Denied

**Symptoms:**
- "User interaction is not allowed" error
- Can't retrieve keys from script

**Solutions:**

1. **Allow terminal access**
- When prompted, click "Always Allow"
- Or run interactively first to grant permission

2. **Unlock keychain**
```bash
security unlock-keychain
```

3. **Check keychain status**
```bash
security show-keychain-info
```

---

### Issue: Config Changes Not Taking Effect

**Symptoms:**
- Modified config but behavior unchanged

**Solutions:**

1. **Verify config path**
```bash
# Check OPENCLAW_CONFIG_PATH
echo $OPENCLAW_CONFIG_PATH

# Should be:
# /Users/YOU/xmad-control/openclaw/configs/openclaw.json
```

2. **Restart after config change**
```bash
pkill -f openclaw
sleep 2
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

3. **Check for old config locations**
```bash
# Make sure no old config is being used
ls ~/.openclaw/openclaw.json 2>/dev/null
# If exists, remove or rename
```

---

## Diagnostic Commands

### Full System Check
```bash
echo "=== XMAD Control Center Diagnostics ==="
echo ""
echo "1. Gateway Health:"
curl -s http://127.0.0.1:18789/health || echo "   NOT RESPONDING"
echo ""
echo "2. Process Status:"
ps aux | grep openclaw | grep -v grep | head -3
echo ""
echo "3. Memory Usage:"
ps aux | grep openclaw | grep -v grep | awk '{print "   " $6/1024 " MB"}'
echo ""
echo "4. Port Status:"
lsof -i :18789 | head -5
echo ""
echo "5. API Key:"
security find-generic-password -s "z.ai" -a "openclaw" -w 2>/dev/null | head -c 10 && echo "... (exists)" || echo "   NOT FOUND"
echo ""
echo "6. LaunchAgent:"
launchctl list | grep openclaw
echo ""
echo "7. Config:"
ls -la ~/xmad-control/openclaw/configs/openclaw.json
echo ""
echo "8. Credentials:"
ls -la ~/xmad-control/openclaw/credentials/ 2>/dev/null || echo "   NOT FOUND"
```

---

## Getting Help

If issues persist:

1. **Collect diagnostic info**
```bash
# Save diagnostics to file
bash -c 'echo "=== XMAD Diagnostics $(date) ===" > ~/Desktop/xmad-diagnostics.txt
curl -s http://127.0.0.1:18789/health >> ~/Desktop/xmad-diagnostics.txt 2>&1
echo "" >> ~/Desktop/xmad-diagnostics.txt
ps aux | grep openclaw >> ~/Desktop/xmad-diagnostics.txt
echo "" >> ~/Desktop/xmad-diagnostics.txt
tail -50 ~/xmad-control/openclaw/logs/gateway.log >> ~/Desktop/xmad-diagnostics.txt'
```

2. **Check logs**
```bash
tail -100 ~/xmad-control/openclaw/logs/gateway.log
tail -50 ~/xmad-control/openclaw/logs/watchdog.log
```

3. **Review documentation**
- [OpenClaw Guide](./OPENCLAW.md)
- [SSOT Keys Guide](./SSOT_KEYS.md)
- [Backup & Recovery](./BACKUP_RECOVERY.md)
