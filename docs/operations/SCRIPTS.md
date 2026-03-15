# Scripts Reference

> **Complete guide to all scripts in XMAD Control Center**

---

## Bootstrap Scripts

### start-platform.sh
**Location:** `bootstrap/start-platform.sh`

**Purpose:** Start all platform services

**Usage:**
```bash
bash ~/xmad-control/bootstrap/start-platform.sh
```

**What it does:**
1. Sets environment variables
2. Starts OpenClaw gateway
3. Starts watchdog
4. Starts Core API (if configured)
5. Runs health check

---

### stop-platform.sh
**Location:** `bootstrap/stop-platform.sh`

**Purpose:** Stop all platform services

**Usage:**
```bash
bash ~/xmad-control/bootstrap/stop-platform.sh
```

**What it does:**
1. Stops OpenClaw gateway
2. Stops watchdog
3. Stops Core API
4. Cleans up temp files

---

### health-platform.sh
**Location:** `bootstrap/health-platform.sh`

**Purpose:** Check health of all services

**Usage:**
```bash
bash ~/xmad-control/bootstrap/health-platform.sh
```

**Output:**
```
=== XMAD Control Center Health ===
✅ Gateway: OK
✅ Core API: OK
✅ Memory: 450MB
```

---

### env-loader.sh
**Location:** `bootstrap/env-loader.sh`

**Purpose:** Load environment variables

**Usage:**
```bash
source ~/xmad-control/bootstrap/env-loader.sh
```

**Variables Set:**
- `XMAD_ROOT`
- `OPENCLAW_STATE_DIR`
- `OPENCLAW_CONFIG_PATH`
- `PATH` (updated)

---

## OpenClaw Scripts

### start-ssot.sh
**Location:** `openclaw/scripts/start-ssot.sh`

**Purpose:** Start OpenClaw with SSOT key loading

**Usage:**
```bash
bash ~/xmad-control/openclaw/scripts/start-ssot.sh
```

**What it does:**
1. Loads ZAI_API_KEY from Keychain
2. Loads GROQ_API_KEY from Keychain
3. Sets environment variables
4. Starts OpenClaw gateway

**Output:**
```
============================================
  OpenClaw SSOT Startup
  Location: /Users/YOU/xmad-control/openclaw
============================================

Fetching API keys from Keychain...
ZAI_API_KEY: 0558a0df0c724684b6... (GLM-4.7/GLM-5 agent)
GROQ_API_KEY: gsk_Q6yCW5djPIyyXtnC... (STT)

Environment:
  NODE_ENV: production
  OPENCLAW_STATE_DIR: /Users/YOU/xmad-control/openclaw
  OPENCLAW_CONFIG_PATH: /Users/YOU/xmad-control/openclaw/configs/openclaw.json

Starting OpenClaw Gateway on port 18789...
{"ok":true,"status":"live"}
```

---

### start-optimized.sh
**Location:** `openclaw/scripts/start-optimized.sh`

**Purpose:** Alternative startup with cleanup

**Usage:**
```bash
bash ~/xmad-control/openclaw/scripts/start-optimized.sh
```

**What it does:**
1. Loads SSOT keys from Keychain
2. Cleans up old processes
3. Clears temp files
4. Starts OpenClaw
5. Waits for startup

---

### watchdog.sh
**Location:** `openclaw/scripts/watchdog.sh`

**Purpose:** Monitor and auto-restart OpenClaw

**Usage:**
```bash
# Foreground
bash ~/xmad-control/openclaw/scripts/watchdog.sh

# Background
bash ~/xmad-control/openclaw/scripts/watchdog.sh &
```

**What it monitors:**
- Memory usage (restarts at 700MB)
- Health endpoint (3 consecutive failures)
- Process existence
- UN state (I/O hang)

**Status Report:** `~/xmad-control/openclaw/watchdog/status.json`

---

### load-keys.sh
**Location:** `openclaw/scripts/load-keys.sh`

**Purpose:** Load API keys only (don't start)

**Usage:**
```bash
source ~/xmad-control/openclaw/scripts/load-keys.sh
```

**Variables Set:**
- `ZAI_API_KEY`
- `GROQ_API_KEY`
- `DEEPSEEK_API_KEY`

---

## Monitor Scripts

### health-check.sh
**Location:** `modules/monitor/health-check.sh`

**Purpose:** Quick health check with --fix option

**Usage:**
```bash
# Check only
bash ~/xmad-control/modules/monitor/health-check.sh

# Check and fix
bash ~/xmad-control/modules/monitor/health-check.sh --fix
```

**Output:**
```
=== XMAD Health Check ===
Gateway: ✅ OK
Memory: 450MB
Port 18789: ✅ Listening
```

---

### system-guardian.sh
**Location:** `modules/monitor/system-guardian.sh`

**Purpose:** System protection daemon

**Usage:**
```bash
bash ~/xmad-control/modules/monitor/system-guardian.sh &
```

**What it does:**
- Kills zombie processes
- Cleans up temp files
- Monitors memory
- Restarts failed services

---

### memory_port_watch.sh
**Location:** `modules/monitor/memory_port_watch.sh`

**Purpose:** Monitor memory and ports

**Usage:**
```bash
bash ~/xmad-control/modules/monitor/memory_port_watch.sh
```

**Output:**
```
[2024-01-01 12:00:00] Gateway: 450MB | Port 18789: Active
```

---

## Network Scripts

### start-tailscale.sh
**Location:** `modules/network/start-tailscale.sh`

**Purpose:** Start Tailscale VPN

**Usage:**
```bash
bash ~/xmad-control/modules/network/start-tailscale.sh
```

---

### tailscale-autoconnect.sh
**Location:** `modules/network/tailscale-autoconnect.sh`

**Purpose:** Auto-connect to Tailscale network

**Usage:**
```bash
bash ~/xmad-control/modules/network/tailscale-autoconnect.sh
```

---

## Utility Scripts

### create-admin-user.ts
**Location:** `scripts/create-admin-user.ts`

**Purpose:** Create admin user for dashboard

**Usage:**
```bash
bun run scripts/create-admin-user.ts
```

---

### env-guard.ts
**Location:** `scripts/env-guard.ts`

**Purpose:** Check environment variables

**Usage:**
```bash
bun run scripts/env-guard.ts
```

---

### audit-runner.ts
**Location:** `scripts/audit/audit-runner.ts`

**Purpose:** Run audit layers

**Usage:**
```bash
# Quick audit
bun run audit

# Full audit
bun run audit:ci

# Specific layer
bun run audit --layer=03
```

---

## Script Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Config error |
| 3 | Keychain error |
| 4 | Port conflict |
| 5 | Memory limit |

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Modules Overview](./MODULES.md)
