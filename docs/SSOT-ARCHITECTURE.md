# XMAD Platform SSOT Architecture

> **Last Updated:** 2026-03-30
> **Status:** Production Ready

## Project Locations

| Project | Path | Purpose |
|---------|------|---------|
| **Super Admin** | `~/xmad-control/` | Standalone SSOT dashboard |
| **Main Monorepo** | `~/platform-monorepo/` | Multi-app monorepo (shadi-v2, etc.) |
| **OpenClaw** | `~/xmad-control/openclaw/` | AI Gateway (SSOT location) |

### Archived (Do Not Use)
- `~/platform-monorepo/_archive/openclaw-archived-20260330/` - Duplicate
- `~/platform-monorepo/_archive/xmad-control-app-archived-20260330/` - Duplicate
- `~/platform-monorepo/_archive/auth-nextauth-archived-20260330/` - Legacy NextAuth
- `~/platform-monorepo/_archive/auth-proxy-archived-20260330/` - Deprecated
- `~/.openclaw/` - Old location (deprecated)

---

## Secrets Management

### SSOT Pattern
**macOS Keychain 5020** → **Infisical** → **Application**

### Keychain Entries

| Service | Account | Purpose |
|---------|---------|---------|
| `z.ai` | `openclaw` | GLM-4.7/GLM-5 models |
| `SSOT_AI_GROQ` | `SSOT` | Groq Whisper STT |
| `SSOT_AI_DEEPSEEK` | `SSOT` | DeepSeek fallback |
| `SSOT_AI_GEMINI` | `SSOT` | Gemini models |
| `SSOT_TTS_ELEVENLABS` | `SSOT` | Text-to-speech |
| `SSOT_VOICE_DEEPGRAM` | `SSOT` | Voice recognition |
| `SSOT_DB_SUPABASE_SERVICE_ROLE` | `SSOT` | Supabase admin |
| `SSOT_DB_SUPABASE_ANON` | `SSOT` | Supabase client |
| `SSOT_AUTH_CLERK_SECRET` | `SSOT` | Clerk auth |
| `SSOT_INFISICAL_TOKEN` | `SSOT` | Infisical auth |

### Infisical Configuration
- **Project ID:** `3f265951-5e47-4460-88c1-ad9bee65b1ac`
- **Environments:** dev, staging, prod

### Usage
```bash
# Load token from Keychain
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)

# Run with secrets injected
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- bun run dev
```

### Policy
- **NO .env files with secrets committed to git**
- `.env.local` is in `.gitignore`
- Template files (`.env.example`, `.env.local.example`) are tracked

---

## Authentication

### Primary Provider: Clerk
- **Package:** `@clerk/nextjs`
- **Integration:** `@platform/security-auth`
- **Dashboard:** https://dashboard.clerk.com

### Secondary: Supabase Auth (shadi-v2 only)
- **Package:** `@supabase/ssr`, `@supabase/supabase-js`
- **Used in:** `~/platform-monorepo/apps/shadi-v2/`

### Security Model (xmad-control)
- **Tailscale Network Guard** - IP-based access control
- **CGNAT Range:** `100.64.0.0/10`
- **Middleware:** `~/xmad-control/middleware.ts`

---

## Database

### Provider: Supabase
- **Package:** `@platform/back-db` (platform) / `@saasfly/db` (legacy)
- **Query Builder:** Kysely
- **Schema:** Prisma

### Projects
| Project | URL |
|---------|-----|
| platform-monorepo | `https://avcusvwrgeyuetjnykmu.supabase.co` |
| shadi-v2 | `https://zpapkemwdcxomqypkoig.supabase.co` |

---

## Modules (xmad-control)

| Module | Port | Purpose |
|--------|------|---------|
| `core` | 9870 | XMAD Core API |
| `openclaw` | 18789 | AI Gateway |
| `guardian` | - | Orchestration |
| `monitor` | - | Health checks |
| `network` | - | Tailscale |
| `ai-tools` | - | CLI utilities |
| `claude` | - | Claude wrappers |

### Module Structure
```
~/xmad-control/modules/
├── ai-tools/      # AI CLI optimization scripts
├── claude/        # Claude Code utilities (10 scripts)
├── core/          # XMAD Core API gateway (port 9870)
├── guardian/      # Guardian orchestrator (657 files)
├── monitor/       # Health checks, system guardian
├── network/       # Tailscale networking
└── openclaw/      # Symlink → ~/xmad-control/openclaw/
```

---

## Services

| Service | Port | URL | Status |
|---------|------|-----|--------|
| XMAD Core API | 9870 | `http://localhost:9870` | Optional |
| OpenClaw Gateway | 18789 | `http://localhost:18789` | Running |
| Next.js Dashboard | 3333 | `http://localhost:3333` | Development |

### Health Checks
```bash
# XMAD Core
curl http://localhost:9870/health

# OpenClaw Gateway
curl http://localhost:18789/health

# Dashboard
curl http://localhost:3333/api/health
```

---

## Bootstrap Scripts

```bash
# Start all services
cd ~/xmad-control && ./bootstrap/start-platform.sh

# Stop all services
cd ~/xmad-control && ./bootstrap/stop-platform.sh

# Health check
cd ~/xmad-control && ./bootstrap/health-platform.sh
```

---

## OpenClaw Gateway

### SSOT Location
```
~/xmad-control/openclaw/
```

### Configuration
- **Config File:** `~/xmad-control/openclaw/configs/openclaw.json`
- **Port:** 18789
- **Auth Mode:** Token
- **Memory Limit:** 700MB

### Startup
```bash
# SSOT startup (loads keys from Keychain)
bash ~/xmad-control/openclaw/scripts/start-ssot.sh

# Check status
curl http://127.0.0.1:18789/health

# View logs
tail -f ~/xmad-control/openclaw/logs/gateway.log
```

### AI Models
| Model | Provider | Use Case |
|-------|----------|----------|
| `zai/glm-4.7` | GLM | Primary |
| `zai/glm-5` | GLM | Fallback |
| `groq/whisper` | Groq | STT |
| `deepseek/chat` | DeepSeek | Fallback |

---

## Platform-Monorepo Structure

### Apps
| App | Status | Auth |
|-----|--------|------|
| `shadi-v2` | Active | Supabase |
| `app-template` | Template | - |

### Packages (Hubs)
| Hub | Packages | Purpose |
|-----|----------|---------|
| `security-hub` | 11 | Auth, RBAC, middleware |
| `ai-hub` | 6 | AI providers, orchestration |
| `front-hub` | 2 | UI components, utilities |
| `back-hub` | 4 | API, DB, observability |
| `infra-hub` | 2 | Stripe, WhatsApp |

---

## Deployment

### Vercel (Production)
- **xmad-control:** Auto-deploy on push to main
- **platform-monorepo:** Auto-deploy on push to main

### Build Commands
```bash
# xmad-control
cd ~/xmad-control && bun run build

# platform-monorepo
cd ~/platform-monorepo && bun run build
```

---

## Quick Reference

### Start Development
```bash
# Start OpenClaw (if not running)
bash ~/xmad-control/openclaw/scripts/start-ssot.sh

# Start Dashboard
cd ~/xmad-control && bunx next dev --port 3333
```

### Load Secrets
```bash
# From Keychain
source ~/xmad-control/scripts/load-secrets.sh

# Or via Infisical
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- <command>
```

### Common Paths
```bash
# OpenClaw Config
OPENCLAW_CONFIG="$HOME/xmad-control/openclaw/configs/openclaw.json"

# Guardian Config
GUARDIAN_CONFIG="$HOME/xmad-control/modules/guardian/.env"

# Platform Config
PLATFORM_CONFIG="$HOME/xmad-control/config/platform.json"
```

---

## Archived Items

The following were archived on 2026-03-30 to `~/platform-monorepo/_archive/`:

1. **openclaw-archived-20260330** - Duplicate of `~/xmad-control/openclaw/`
2. **xmad-control-app-archived-20260330** - Duplicate of standalone `~/xmad-control/`
3. **auth-nextauth-archived-20260330** - Legacy NextAuth (replaced by Clerk)
4. **auth-proxy-archived-20260330** - Deprecated auth proxy app

---

## Security Notes

1. **Tailscale Required** for production access to xmad-control
2. **Keychain SSOT** - All API keys stored in macOS Keychain
3. **No hardcoded secrets** in code or git
4. **Token auth** for OpenClaw gateway
5. **RLS (Row-Level Security)** in Supabase for multi-tenant isolation
