# SSOT API Keys - Complete Guide

> **Single Source of Truth for All API Keys**
> Generated: 2026-02-26
> Version: 1.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [What We Did](#what-we-did)
3. [Key Locations](#key-locations)
4. [All Keys Inventory](#all-keys-inventory)
5. [How to Use Keys](#how-to-use-keys)
6. [How to Add Keys to Projects](#how-to-add-keys-to-projects)
7. [How to Add New Keys](#how-to-add-new-keys)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Quick Reference](#quick-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  macOS KEYCHAIN                         │
│              (Root of Trust - Master Backup)            │
│                                                         │
│  All secrets stored with SSOT_* prefix                 │
│  Hardware-backed by Apple Secure Enclave               │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   INFISICAL                             │
│           (Runtime Secrets Provider)                    │
│                                                         │
│  Project ID: 3f265951-5e47-4460-88c1-ad9bee65b1ac      │
│  Environment: dev, staging, prod                        │
│  13+ secrets available for injection                    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PROJECTS                              │
│            (Zero Secrets Zone)                          │
│                                                         │
│  No .env files allowed                                  │
│  No hardcoded secrets                                   │
│  All secrets via Infisical injection                    │
└─────────────────────────────────────────────────────────┘
```

---

## What We Did

### Step 1: Key Inventory & Classification
- Audited all 19 API keys across the system
- Classified into: OPERATIONAL (13), CLI (4), DEPRECATED (2)
- Identified keys from: z.ai, OpenRouter, Gemini, ElevenLabs, Deepgram, E2B, Supabase, Clerk, NextAuth, GitHub

### Step 2: Infisical Setup
- Created new Infisical project "SSOT-keys"
- Project ID: `3f265951-5e47-4460-88c1-ad9bee65b1ac`
- Imported all 13 OPERATIONAL keys
- Created service token stored in Keychain

### Step 3: Cleanup
- Backed up all .env files to `~/env-backup-ssot/`
- Deleted .env files from all projects
- Updated package.json scripts with Infisical injection

### Step 4: Guardian Orchestrator
- Created deployment scripts
- Added CLI aliases for different AI providers
- Set up health check system

---

## Key Locations

### macOS Keychain (Master Storage)

| Key Name | Service | Account | Purpose |
|----------|---------|---------|---------|
| SSOT_INFISICAL_TOKEN | SSOT_INFISICAL_TOKEN | - | Infisical runtime token |
| SSOT_AI_OPENROUTER_PRIMARY | SSOT_AI_OPENROUTER_PRIMARY | - | OpenRouter API |
| SSOT_AI_OPENROUTER_OPENHANDS | SSOT_AI_OPENROUTER_OPENHANDS | - | OpenRouter for OpenHands |
| SSOT_AI_GEMINI_PRIMARY | SSOT_AI_GEMINI_PRIMARY | - | Google Gemini |
| SSOT_AI_GEMINI_OPENHANDS | SSOT_AI_GEMINI_OPENHANDS | - | Gemini for OpenHands |
| z.ai | z.ai | claude-code | Claude CLI via z.ai |
| z.ai | z.ai | openclaw | OpenClaw/Orchestrator |
| SSOT_TTS_ELEVENLABS | SSOT_TTS_ELEVENLABS | - | ElevenLabs TTS |
| SSOT_VOICE_DEEPGRAM | SSOT_VOICE_DEEPGRAM | - | Deepgram Voice |
| SSOT_SANDBOX_E2B | SSOT_SANDBOX_E2B | - | E2B Code Sandbox |
| SSOT_DB_SUPABASE_SERVICE_ROLE | SSOT_DB_SUPABASE_SERVICE_ROLE | - | Supabase Admin |
| SSOT_DB_SUPABASE_ANON | SSOT_DB_SUPABASE_ANON | - | Supabase Anon |
| SSOT_AUTH_CLERK_SECRET | SSOT_AUTH_CLERK_SECRET | - | Clerk Auth |
| SSOT_AUTH_NEXTAUTH_SECRET | SSOT_AUTH_NEXTAUTH_SECRET | - | NextAuth |
| SSOT_GIT_GITHUB_CLIENT_SECRET | SSOT_GIT_GITHUB_CLIENT_SECRET | - | GitHub OAuth |

### Infisical Project

```
Project Name: SSOT-keys
Project ID: 3f265951-5e47-4460-88c1-ad9bee65b1ac
Environments: dev, staging, prod
```

### Backup Location

```
~/env-backup-ssot/backup-20260226-095621/
```

---

## All Keys Inventory

### OPERATIONAL Keys (13) - In Infisical

| Key | Category | Use Case |
|-----|----------|----------|
| SSOT_AI_GEMINI_PRIMARY | AI | Primary Gemini API |
| SSOT_AI_GEMINI_OPENHANDS | AI | Gemini for OpenHands |
| SSOT_AI_OPENROUTER_PRIMARY | AI | OpenRouter main |
| SSOT_AI_OPENROUTER_OPENHANDS | AI | OpenRouter for OpenHands |
| SSOT_AI_ZAI_OPENCLAW | AI | z.ai for OpenClaw |
| SSOT_TTS_ELEVENLABS | TTS | Text-to-Speech |
| SSOT_VOICE_DEEPGRAM | Voice | Speech recognition |
| SSOT_SANDBOX_E2B | Sandbox | Code execution |
| SSOT_DB_SUPABASE_SERVICE_ROLE | Database | Supabase admin |
| SSOT_DB_SUPABASE_ANON | Database | Supabase public |
| SSOT_AUTH_CLERK_SECRET | Auth | Clerk authentication |
| SSOT_AUTH_NEXTAUTH_SECRET | Auth | NextAuth.js |
| SSOT_GIT_GITHUB_CLIENT_SECRET | Git | GitHub OAuth |

### CLI Keys (4) - Keychain Only

| Key | Use Case |
|-----|----------|
| z.ai (claude-code) | Claude CLI via z.ai/GLM-5 |
| z.ai (openclaw) | OpenClaw orchestrator |
| SSOT_AI_GROQ | Local agents |
| SSOT_AI_DEEPSEEK | Local agents |

### DEPRECATED Keys (2) - Do Not Use

| Key | Reason |
|-----|--------|
| SSOT_AI_GLM_PAID | 401 Error - needs rotation |
| SSOT_AI_GLM_ZAI | Old key - replaced |

---

## How to Use Keys

### Method 1: Retrieve from Keychain

```bash
# Get a specific key
security find-generic-password -s "SSOT_AI_OPENROUTER_PRIMARY" -w

# Get z.ai key for Claude CLI
security find-generic-password -s "z.ai" -a "claude-code" -w

# Get Infisical token
security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w
```

### Method 2: Use Infisical Injection

```bash
# Set token
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)

# Run command with secrets injected
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- npm run dev

# List all secrets
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev
```

### Method 3: Use Guardian Aliases

```bash
# Activate aliases
source ~/.zshrc

# Available aliases:
orcode      # OpenRouter with auto model
gcode       # OpenRouter free tier
zcode       # z.ai/GLM-5
gemcode     # Gemini
ssot-view   # View SSOT keys doc
guardian-health  # Health check
```

### Method 4: In Code (Node.js)

```javascript
// Never hardcode keys!
// Bad:
const apiKey = "sk-or-v1-xxxxx"; // NEVER DO THIS

// Good: Use environment variables
const apiKey = process.env.SSOT_AI_OPENROUTER_PRIMARY;

// Best: Run with Infisical
// infisical run --projectId xxx -- npm run dev
```

---

## How to Add Keys to Projects

### Step 1: Add Key to Keychain

```bash
security add-generic-password -a "$USER" -s "SSOT_NEW_SERVICE_NAME" -w "your-api-key-here"
```

### Step 2: Add to Infisical

```bash
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
infisical secrets set SSOT_NEW_SERVICE_NAME="your-api-key-here" \
  --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac \
  --env dev \
  --domain https://app.infisical.com
```

### Step 3: Update package.json

```json
{
  "scripts": {
    "dev": "infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- next dev",
    "dev:local": "next dev"
  }
}
```

### Step 4: Use in Code

```javascript
// The key will be available as environment variable
const apiKey = process.env.SSOT_NEW_SERVICE_NAME;
```

### Step 5: Update Documentation

Add to KEY_REGISTRY.md:
```markdown
| SSOT_NEW_SERVICE_NAME | OPERATIONAL | Service Name | Active |
```

---

## How to Add New Keys

### Complete Workflow for Adding a New API Key

#### 1. Generate/Obtain the Key
- Go to the service's dashboard
- Generate a new API key
- Copy the key immediately (most services show it only once)

#### 2. Store in Keychain

```bash
# Replace SERVICE_NAME with actual service name
security add-generic-password -a "$USER" -s "SSOT_CATEGORY_SERVICENAME" -w "your-api-key"
```

Naming convention:
- Prefix: `SSOT_`
- Category: `AI`, `DB`, `AUTH`, `VOICE`, `TTS`, `GIT`, `SANDBOX`
- Service: `OPENAI`, `ANTHROPIC`, `SUPABASE`, etc.
- Example: `SSOT_AI_OPENAI`, `SSOT_DB_POSTGRES`

#### 3. Add to Infisical

```bash
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)
infisical secrets set SSOT_CATEGORY_SERVICENAME="your-key" \
  --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac \
  --env dev
```

#### 4. Update KEY_REGISTRY.md

```markdown
| SSOT_CATEGORY_SERVICENAME | OPERATIONAL | Service | Active |
```

#### 5. Update SSOT_KEYS.md in Projects

Add the new key to:
- `~/Desktop/platform-monorepo/SSOT_KEYS.md`
- `~/.guardian-orchestrator-2026/SSOT_KEYS.md`

#### 6. Test the Key

```bash
# Verify in Keychain
security find-generic-password -s "SSOT_CATEGORY_SERVICENAME" -w | head -c 20

# Verify in Infisical
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev | grep SERVICENAME
```

---

## Best Practices

### DO

- Store all keys in Keychain first
- Use Infisical for runtime injection
- Use `SSOT_` prefix for all key names
- Include category in key name
- Backup .env files before deletion
- Test keys after adding
- Rotate deprecated keys

### DON'T

- Never create .env files
- Never hardcode keys in code
- Never commit keys to git
- Never share keys in chat/email
- Never use deprecated keys
- Never skip the Keychain step

### Security Rules

1. **Keychain is Root of Trust** - All keys must be in Keychain first
2. **No .env Files** - Projects must be zero-secrets zones
3. **Infisical for Runtime** - All apps get secrets via Infisical injection
4. **Audit Regularly** - Run `guardian-health` periodically
5. **Rotate Deprecated Keys** - Delete or replace old keys

---

## Troubleshooting

### Key Not Found in Keychain

```bash
# Check if key exists
security find-generic-password -s "KEY_NAME" -w

# If missing, add it
security add-generic-password -a "$USER" -s "KEY_NAME" -w "value"
```

### Infisical Auth Failed

```bash
# Verify token
export INFISICAL_TOKEN=$(security find-generic-password -s "SSOT_INFISICAL_TOKEN" -w)

# Test connection
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev
```

### 429 Rate Limit Errors

- z.ai 429 errors are temporary (service overload)
- Wait and retry
- Keys are valid - just rate limited

### Project Won't Start

```bash
# Check if Infisical is working
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- echo "test"

# Check for missing .env
find . -name ".env*" -type f | grep -v node_modules | grep -v ".example"
```

---

## Quick Reference

### Essential Commands

```bash
# Get key from Keychain
security find-generic-password -s "KEY_NAME" -w

# Add key to Keychain
security add-generic-password -a "$USER" -s "KEY_NAME" -w "value"

# List Infisical secrets
infisical secrets --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev

# Run with Infisical
infisical run --projectId 3f265951-5e47-4460-88c1-ad9bee65b1ac --env dev -- <command>

# Health check
bash ~/.guardian-orchestrator-2026/check_guardian.sh

# Reload aliases
source ~/.zshrc
```

### Project IDs

| Project | ID |
|---------|-----|
| SSOT-keys | `3f265951-5e47-4460-88c1-ad9bee65b1ac` |
| Gold Standard | `784c9b4e-da70-42c2-9698-fac9cb0af34e` |

### File Locations

| File | Path |
|------|------|
| Key Registry | `~/KEY_REGISTRY.md` |
| SSOT Keys (main) | `~/Desktop/platform-monorepo/SSOT_KEYS.md` |
| SSOT Keys (guardian) | `~/.guardian-orchestrator-2026/SSOT_KEYS.md` |
| This Guide | `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md` |
| Backup | `~/env-backup-ssot/` |

---

## Contact & Support

- Infisical Dashboard: https://app.infisical.com
- z.ai Dashboard: https://z.ai/dashboard
- OpenRouter Dashboard: https://openrouter.ai/keys

---

**Last Updated:** 2026-02-26
**Maintained By:** SSOT Enforcement System
**Version:** 1.0
