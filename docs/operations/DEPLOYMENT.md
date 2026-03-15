# Deployment Guide

> **Complete guide for deploying XMAD Control Center**

---

## Deployment Overview

XMAD Control Center can be deployed:
1. **Local Development** - Run locally for development
2. **Production Server** - Deploy as a service
3. **Vercel** - Deploy dashboard to Vercel

---

## Prerequisites

### Required
- macOS (for Keychain integration)
- Bun runtime
- Node.js v22+ (via NVM)
- API keys (z.ai, etc.)

### Install Prerequisites
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Node.js via NVM
nvm install 22
nvm use 22

# Install OpenClaw
bun install -g openclaw@latest
```

---

## Local Development

### Quick Start
```bash
# Start all services
cd ~/xmad-control
bash bootstrap/start-platform.sh

# Check health
bash bootstrap/health-platform.sh
```

### Manual Start
```bash
# 1. Set environment
source bootstrap/env-loader.sh

# 2. Start OpenClaw gateway
bash openclaw/scripts/start-ssot.sh

# 3. Start Core API (optional)
cd modules/core && bun run server

# 4. Start Dashboard (optional)
bunx next dev --port 3333
```

### Development Ports
| Service | Port | Purpose |
|---------|------|---------|
| OpenClaw Gateway | 18789 | AI Gateway |
| XMAD Core | 9870 | Core API |
| Next.js Dashboard | 3333 | Web Interface |

---

## Production Deployment

### 1. LaunchAgent Setup

```bash
# Install LaunchAgents
cp ~/xmad-control/openclaw/launch_agents/ai.openclaw.gateway.plist ~/Library/LaunchAgents/
cp ~/xmad-control/openclaw/launch_agents/ai.openclaw.watchdog.plist ~/Library/LaunchAgents/

# Load LaunchAgents
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.watchdog.plist
```

### 2. Verify Services

```bash
# Check LaunchAgents
launchctl list | grep openclaw

# Check gateway health
curl http://127.0.0.1:18789/health

# Check process
ps aux | grep openclaw
```

### 3. Production Configuration

In `configs/openclaw.json`:
```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "secure-production-token"
    }
  },
  "logging": {
    "level": "warn",
    "consoleLevel": "error"
  },
  "update": {
    "checkOnStart": false,
    "auto": { "enabled": false }
  }
}
```

---

## Vercel Deployment

### Dashboard Deployment

The Next.js dashboard can be deployed to Vercel:

```bash
# Install Vercel CLI
bun install -g vercel

# Login
vercel login

# Deploy
cd ~/xmad-control
vercel --prod
```

### Vercel Configuration

`vercel.json`:
```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Environment Variables

Set in Vercel dashboard:
```
OPENCLAW_GATEWAY_URL=http://your-server:18789
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## Docker Deployment (Optional)

### Dockerfile

```dockerfile
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Expose port
EXPOSE 18789

# Start gateway
CMD ["bun", "run", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  openclaw:
    build: .
    ports:
      - "18789:18789"
    environment:
      - NODE_ENV=production
      - ZAI_API_KEY=${ZAI_API_KEY}
    volumes:
      - ./openclaw:/app/openclaw
    restart: unless-stopped
```

---

## SSL/TLS Configuration

### Local HTTPS (Optional)

Using Caddy or Nginx:

```bash
# Install Caddy
brew install caddy

# Caddyfile
cat > /etc/caddy/Caddyfile << EOF
xmad.local {
    reverse_proxy localhost:18789
}
EOF

# Start Caddy
caddy run --config /etc/caddy/Caddyfile
```

---

## Remote Access

### Tailscale VPN

```bash
# Start Tailscale
bash ~/xmad-control/modules/network/start-tailscale.sh

# Connect from another machine
# tailscale up
```

### SSH Tunnel

```bash
# Create tunnel
ssh -L 18789:localhost:18789 user@server

# Access locally
curl http://localhost:18789/health
```

---

## Monitoring Production

### Health Check Script

```bash
#!/bin/bash
# production-health.sh

GATEWAY_URL="http://127.0.0.1:18789/health"
CORE_URL="http://127.0.0.1:9870/health"

check_service() {
    local name=$1
    local url=$2

    if curl -s -f -m 5 "$url" > /dev/null 2>&1; then
        echo "✅ $name: OK"
    else
        echo "❌ $name: DOWN"
    fi
}

echo "=== XMAD Production Health ==="
check_service "Gateway" "$GATEWAY_URL"
check_service "Core API" "$CORE_URL"
```

### Log Monitoring

```bash
# Watch gateway logs
tail -f ~/xmad-control/openclaw/logs/gateway.log

# Watch errors only
tail -f ~/xmad-control/openclaw/logs/gateway.err.log | grep -i error
```

---

## Scaling

### Multiple Instances

For high availability, run multiple OpenClaw instances:

```bash
# Instance 1 (primary)
PORT=18789 bash openclaw/scripts/start-ssot.sh

# Instance 2 (backup)
PORT=18790 bash openclaw/scripts/start-ssot.sh
```

### Load Balancer

Use nginx or Caddy to load balance:

```nginx
upstream openclaw {
    server 127.0.0.1:18789;
    server 127.0.0.1:18790;
}

server {
    listen 80;
    location / {
        proxy_pass http://openclaw;
    }
}
```

---

## Backup Before Deployment

Always backup before making changes:

```bash
# Quick backup
cd ~/xmad-control
tar -czf ~/Desktop/pre-deploy-$(date +%Y%m%d).tar.gz \
  openclaw/configs/ \
  openclaw/workspace/ \
  openclaw/credentials/ \
  config/
```

---

## Rollback

If deployment fails:

```bash
# Stop services
bash bootstrap/stop-platform.sh

# Restore backup
tar -xzf ~/Desktop/pre-deploy-*.tar.gz

# Restart
bash bootstrap/start-platform.sh
```

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [Backup & Recovery](./BACKUP_RECOVERY.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
