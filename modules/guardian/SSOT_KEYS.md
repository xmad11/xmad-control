# SSOT_KEYS.md - Secrets Contract

> **Single Source of Truth for All API Keys**
> Last Updated: 2026-02-26 | Version: 1.0

---

## Quick Start

```bash
# Activate aliases
source ~/.zshrc

# Run with Infisical
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- npm run dev

# Health check
guardian-health
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  macOS KEYCHAIN                         │
│              (Root of Trust - Master Backup)            │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   INFISICAL                             │
│           (Runtime Secrets Provider)                    │
│  Project ID: 3f265951-5e47-4460-88c1-ad9bee65b1ac      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PROJECTS                              │
│            (Zero Secrets Zone)                          │
│  No .env files | No hardcoded secrets                   │
└─────────────────────────────────────────────────────────┘
```

---

## Infisical Configuration

| Setting | Value |
|---------|-------|
| Project Name | SSOT-keys |
| Project ID | `3f265951-5e47-4460-88c1-ad9bee65b1ac` |
| Environments | dev, staging, prod |
| Token Location | Keychain: `SSOT_INFISICAL_TOKEN` |

---

## All Keychain Keys

### AI Providers

| Service | Keychain Entry | Purpose |
|---------|----------------|---------|
| OpenRouter | `SSOT_AI_OPENROUTER_PRIMARY` | Main OpenRouter |
| OpenRouter (OpenHands) | `SSOT_AI_OPENROUTER_OPENHANDS` | OpenHands |
| Gemini | `SSOT_AI_GEMINI_PRIMARY` | Google Gemini |
| Gemini (OpenHands) | `SSOT_AI_GEMINI_OPENHANDS` | Gemini for OpenHands |
| z.ai (Claude) | `z.ai` / `claude-code` | GLM-5 for CLI |
| z.ai (OpenClaw) | `z.ai` / `openclaw` | Orchestrator |
| Groq | `SSOT_AI_GROQ` | Local agents |
| DeepSeek | `SSOT_AI_DEEPSEEK` | Local agents |

### Voice & TTS

| Service | Keychain Entry |
|---------|----------------|
| ElevenLabs | `SSOT_TTS_ELEVENLABS` |
| Deepgram | `SSOT_VOICE_DEEPGRAM` |

### Database & Auth

| Service | Keychain Entry |
|---------|----------------|
| Supabase (Service) | `SSOT_DB_SUPABASE_SERVICE_ROLE` |
| Supabase (Anon) | `SSOT_DB_SUPABASE_ANON` |
| Clerk | `SSOT_AUTH_CLERK_SECRET` |
| NextAuth | `SSOT_AUTH_NEXTAUTH_SECRET` |

### Other

| Service | Keychain Entry |
|---------|----------------|
| E2B Sandbox | `SSOT_SANDBOX_E2B` |
| GitHub OAuth | `SSOT_GIT_GITHUB_CLIENT_SECRET` |
| Infisical Token | `SSOT_INFISICAL_TOKEN` |

---

## CLI Aliases

| Alias | Provider | Model | Use Case |
|-------|----------|-------|----------|
| `orcode` | OpenRouter | auto | Best model selection |
| `gcode` | OpenRouter | free tier | Free coding |
| `zcode` | z.ai | GLM-5 | Claude CLI |
| `gemcode` | Gemini | 2.0 Flash | Gemini |
| `ssot-view` | - | - | View this file |
| `guardian-health` | - | - | Health check |
| `reload` | - | - | Reload .zshrc |

---

## Rules (Non-Negotiable)

1. **No .env files** - Use Infisical injection
2. **No hardcoded secrets** - Use Keychain
3. **No inline exports** - Use aliases
4. **All agents read from Infisical** - At runtime only
5. **New keys follow SSOT pattern** - Keychain → Infisical → Runtime

---

## Execution Commands

### Retrieve Keys

```bash
# From Keychain
security find-generic-password -s "KEY_NAME" -w

# z.ai with account
security find-generic-password -s "z.ai" -a "claude-code" -w

# From Infisical
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev
```

### Run Projects

```bash
# With Infisical (recommended)
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
npm run dev

# Without Infisical (fallback)
npm run dev:local
```

### Add New Key

```bash
# 1. Add to Keychain
security add-generic-password -a "$USER" -s "SSOT_CATEGORY_SERVICE" -w "key-value"

# 2. Add to Infisical
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
infisical secrets set SSOT_CATEGORY_SERVICE="key-value" \
  --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev

# 3. Update this file
```

---

## Audit Commands

```bash
# Check for .env files
find . -name ".env*" -type f | grep -v node_modules | grep -v ".example"

# List Infisical secrets
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev

# Test z.ai API
curl -s -X POST "https://api.z.ai/api/anthropic/v1/messages" \
  -H "x-api-key: $(security find-generic-password -s "z.ai" -a "claude-code" -w)" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-4.7","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'

# Health check
guardian-health
```

---

## API Endpoints

| Provider | Base URL |
|----------|----------|
| z.ai (Anthropic) | `https://api.z.ai/api/anthropic` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta` |

---

## Documentation Locations

| Document | Path |
|----------|------|
| Full SSOT Guide | `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md` |
| Guardian Guide | `~/Desktop/important-docs/GUARDIAN_ORCHESTRATOR_GUIDE.md` |
| Key Registry | `~/KEY_REGISTRY.md` |
| Agent Policy | `~/AGENT_SECRET_POLICY.md` |
| Backup Location | `~/env-backup-ssot/` |

---

## Troubleshooting

### 429 Rate Limit (z.ai)
```
Error: 429 {"code":"1305","message":"service overloaded"}
```
**Solution:** Temporary - wait and retry. Keys are valid.

### Key Not Found
```bash
# Verify in Keychain
security find-generic-password -s "KEY_NAME" -w

# If missing, add it
security add-generic-password -a "$USER" -s "KEY_NAME" -w "value"
```

---

## Notes

- Only `platform-monorepo` and `~/.guardian-orchestrator-2026` are active
- Legacy projects (`vercel-multi-project`, `xmad-hub`) are ignored
- Any new project must follow this contract
- 429 errors = temporary z.ai overload (retry automatically)

---

**Violation Policy:** Any script that adds secrets locally is invalid and must be deleted.

**Support:**
- Infisical: https://app.infisical.com
- z.ai: https://z.ai/dashboard
- OpenRouter: https://openrouter.ai/keys

---
**Generated:** 2026-02-26
**Policy:** SSOT Enforcement v1.0
