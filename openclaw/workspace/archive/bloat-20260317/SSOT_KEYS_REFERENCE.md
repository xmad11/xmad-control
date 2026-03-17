# SSOT API Keys - Quick Reference for Nova

**Last Updated**: 2026-03-11
**Purpose**: Nova's reference for API keys (NO hardcoded keys)

---

## 🔑 Key Locations (SSOT - Single Source of Truth)

### Primary Storage
- **Infisical** (Runtime): Project ID `3f265951-5e47-4460-88c1-ad9bee65b1ac`
- **macOS Keychain** (Master): All secrets with `SSOT_*` prefix
- **Projects**: ZERO secrets (all injected via Infisical)

---

## 📋 Available Keys (Infisical + Keychain)

### AI/LLM Providers

| Key Name | Provider | Usage | Status |
|----------|----------|-------|--------|
| `SSOT_ZAI_API_KEY` | z.ai | GLM-5, GLM-4.7 models | ✅ Active |
| `SSOT_GROQ_API_KEY` | Groq | Llama 3.3, Kimi K2, GPT-OSS | ✅ Active |
| `SSOT_DEEPSEEK_API_KEY` | DeepSeek | DeepSeek-V3, DeepSeek-R1 | ✅ Active |
| `SSOT_GEMINI_API_KEY` | Google | Gemini 2.5 Flash, 2.0 Flash | ✅ Active |
| `SSOT_OPENROUTER_API_KEY` | OpenRouter | Multi-provider router | ✅ Active |

### Voice Services

| Key Name | Provider | Usage | Status |
|----------|----------|-------|--------|
| `SSOT_DEEPGRAM_API_KEY` | Deepgram | STT (Speech-to-Text) | ✅ Active |
| `SSOT_ELEVENLABS_API_KEY` | ElevenLabs | TTS (Text-to-Speech) | ✅ Active |

### Database/Auth

| Key Name | Provider | Usage | Status |
|----------|----------|-------|--------|
| `SSOT_SUPABASE_ANON_KEY` | Supabase | Database access | ✅ Active |
| `SSOT_SUPABASE_SERVICE_KEY` | Supabase | Admin operations | ✅ Active |
| `SSOT_CLERK_SECRET_KEY` | Clerk | Authentication | ✅ Active |
| `SSOT_NEXTAUTH_SECRET` | NextAuth | Auth sessions | ✅ Active |

### Other Services

| Key Name | Provider | Usage | Status |
|----------|----------|-------|--------|
| `SSOT_E2B_API_KEY` | E2B | Code execution sandbox | ✅ Active |
| `SSOT_GITHUB_TOKEN` | GitHub | GitHub API access | ✅ Active |

---

## 🔧 How to Use Keys (CLI)

### Method 1: Infisical CLI (Recommended)

```bash
# Inject all secrets into environment
eval $(infisical run --env=dev -- your-command)

# Example with Node
eval $(infisical run --env=dev -- node server.js)

# Example with Python
eval $(infisical run --env=dev -- python app.py)
```

### Method 2: Get Specific Key

```bash
# Get single key
export GROQ_API_KEY=$(infisical get --env=dev SSOT_GROQ_API_KEY)

# Use in command
infisical run --env=dev -- npm start
```

### Method 3: From macOS Keychain

```bash
# Get SSOT_GROQ_API_KEY
security find-generic-password -w -s "SSOT_GROQ_API_KEY"

# Get SSOT_ZAI_API_KEY
security find-generic-password -w -s "SSOT_ZAI_API_KEY"
```

---

## 🚫 Rules for Nova

### ✅ DO
- Use Infisical CLI for runtime injection
- Reference this file for key names
- Check Guardian's .env for examples
- Use security commands to access Keychain

### ❌ NEVER
- Hardcode API keys in files
- Create .env files with secrets
- Commit keys to git
- Share keys in chat/output
- Create unencrypted backups

---

## 🎯 Common Use Cases

### Use Case 1: Start Guardian
```bash
cd ~/.guardian-orchestrator-2026
# Guardian already has keys in .env (from Keychain)
./claude-safe "task" ./project
```

### Use Case 2: Use Coding Agent
```bash
# Coding agent will use Infisical automatically
# Keys injected at runtime
```

### Use Case 3: Make API Call
```bash
# Get key first
export GROQ_API_KEY=$(infisical get --env=dev SSOT_GROQ_API_KEY)

# Use it
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

---

## 🔍 Verify Keys Work

```bash
# Test Groq
export GROQ_API_KEY=$(infisical get --env=dev SSOT_GROQ_API_KEY)
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}],"max_tokens":10}'

# Test z.ai
export ZAI_API_KEY=$(infisical get --env=dev SSOT_ZAI_API_KEY)
curl -X POST "https://api.z.ai/api/anthropic/v1/messages" \
  -H "x-api-key: $ZAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"GLM-5","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
```

---

## 📊 Guardian Agent Keys

Guardian uses these keys (from ~/.guardian-orchestrator-2026/.env):

| Agent | Key | Model |
|-------|-----|-------|
| Guardian (orchestrator) | `SSOT_ZAI_API_KEY` | GLM-5 |
| Coder | `SSOT_GROQ_API_KEY` | Kimi K2 |
| Reasoning | `SSOT_GROQ_API_KEY` | GPT-OSS-120B |
| Fast | `SSOT_GROQ_API_KEY` | Llama 4 Scout |
| Planner | `SSOT_GEMINI_API_KEY` | Gemini 2.5 Flash |
| Workhorse | `SSOT_GROQ_API_KEY` | Qwen3 32B |

All keys already configured in Guardian!
Just run: `./claude-safe "task" ./project`

---

## 📝 Quick Reference Commands

```bash
# Check Infisical status
infisical status

# List all secrets
infisical list --env=dev

# Get specific secret
infisical get --env=dev SSOT_GROQ_API_KEY

# Inject into command
infisical run --env=dev -- npm start

# Check Keychain for SSOT keys
security find-generic-password -w -s "SSOT_*" 2>/dev/null

# Verify Guardian has keys
cd ~/.guardian-orchestrator-2026 && ./claude-safe --status
```

---

## ⚠️ Important Notes

1. **Never hardcode keys** - Always use Infisical or Keychain
2. **Guardian is configured** - Keys already in .env
3. **Nova's agents use Infisical** - Automatic injection
4. **Projects have zero secrets** - All injected at runtime
5. **Master backup in Keychain** - Can restore if needed

---

**End of Reference**

Generated: 2026-03-11
For: Nova (AI Assistant)
Purpose: SSOT API key reference
