# Guardian Agents & Orchestrator Audit Report

**Date:** 2026-03-17
**Auditor:** Claude Code (GLM-5)
**Scope:** Full audit of Guardian Orchestrator, OpenClaw Agents, and SSOT Key Management

---

## Executive Summary

| Component | Status | Issues Found |
|-----------|--------|--------------|
| **OpenClaw Gateway** | ✅ RUNNING | Port 18789 healthy |
| **Watchdog** | ✅ RUNNING | Memory: 17MB, 0 failures |
| **Guardian Orchestrator** | ✅ WORKING | API calls successful |
| **Keychain SSOT** | ✅ WORKING | Keys retrieved correctly |
| **Agent Auth Files** | ❌ CRITICAL | Hardcoded API keys exposed |

---

## 1. OpenClaw Gateway

### Status: ✅ OPERATIONAL

```
Health: http://127.0.0.1:18789/health → {"ok":true,"status":"live"}
Process: bun --bun openclaw.mjs gateway --port 18789
PID: 2562
Bind: localhost only (secure)
```

### Configuration

| Setting | Value |
|---------|-------|
| Port | 18789 |
| Mode | local |
| Primary Model | zai/glm-4.7 |
| Fallback Model | zai/glm-5 |
| WhatsApp | Enabled |

---

## 2. Watchdog Monitor

### Status: ✅ OPERATIONAL

```json
{
  "timestamp": "2026-03-16T23:05:41Z",
  "status": "running",
  "pid": "2552",
  "memory_mb": "17",
  "message": "All checks passed",
  "restart_count": 0,
  "consecutive_failures": 0
}
```

### Monitors
- Memory usage (limit: 700MB)
- Health endpoint (3 consecutive failures trigger restart)
- Process existence

---

## 3. Guardian Orchestrator

### Status: ✅ WORKING

**Location:** `~/xmad-control/modules/guardian/`

### Test Results

```bash
# Test: Groq API call via Guardian
source .env && source scripts/api-call.sh
api_call "groq:meta-llama/llama-4-scout-17b-16e-instruct" "Say hello" "You are a test" "20"
# Result: "Hello, how are you today?" ✅
```

### Architecture

```
Guardian Orchestrator
├── 5 Agents: Guardian, Coder, Reasoning, Fast, Planner
├── 5-Stage Pipeline: Analyze → Plan → Audit → Execute → Review
├── Providers: GLM (z.ai), Groq, Gemini, DeepSeek, OpenRouter
└── SSOT: Keys from macOS Keychain
```

### Key Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `api-call.sh` | Universal API caller | ✅ Working |
| `analyze-task.sh` | Task complexity analysis | ✅ Present |
| `generate-plan.sh` | Execution planning | ✅ Present |
| `guardian-audit.sh` | Safety auditing | ✅ Present |
| `worker-agent.sh` | Task execution | ✅ Present |
| `review-changes.sh` | Code review | ✅ Present |

---

## 4. SSOT Key Management

### Status: ✅ COMPLIANT (in scripts)

**Architecture:**
```
macOS Keychain (Root of Trust)
       ↓
   Infisical (Runtime Secrets)
       ↓
   Projects (Zero Secrets Zone)
```

### Keychain Keys Verified

| Service | Account | Status |
|---------|---------|--------|
| `z.ai` | `openclaw` | ✅ Found |
| `z.ai` | `claude-code` | ✅ Found |
| `SSOT_AI_GROQ` | - | ✅ Found |
| `SSOT_AI_GEMINI` | - | (not tested) |
| `SSOT_AI_DEEPSEEK` | - | (not tested) |

### Key Retrieval Pattern (CORRECT)

```bash
# In api-call.sh - SSOT compliant
get_glm_key() {
    security find-generic-password -s "z.ai" -a "claude-code" -w
}
get_groq_key() {
    security find-generic-password -s "SSOT_AI_GROQ" -w
}
```

---

## 5. CRITICAL SECURITY ISSUES

### 🚨 Issue #1: Hardcoded API Keys in auth-profiles.json

**Severity:** CRITICAL
**Files Affected:**
- `openclaw/agents/main/agent/auth-profiles.json`
- `openclaw/agents/agents/main/agent/auth-profiles.json`
- `openclaw/agents/agents/main/agent/auth.json`

**Exposed Keys:**
```json
{
  "profiles": {
    "zai": {
      "apiKey": "REDACTED - Key exposed in original files",
      "key": "REDACTED - Key exposed in original files"
    },
    "qwen-portal:qwen-cli": {
      "access": "REDACTED - OAuth token exposed",
      "refresh": "REDACTED - OAuth token exposed"
    }
  }
}
```

**Policy Violation:**
> SSOT Policy: "No hardcoded secrets - Use Keychain"
> SSOT Policy: "No inline exports - Use aliases"

### Remediation Required

1. **Rotate exposed keys immediately**
   - Generate new z.ai API key
   - Generate new qwen-portal OAuth tokens

2. **Remove hardcoded keys from files**
   ```bash
   # Replace with environment variable references
   "apiKey": "ZAI_API_KEY"  # Instead of actual key
   ```

3. **Use Keychain for all auth**
   - OpenClaw should read from environment
   - Environment set by `start-ssot.sh`

---

## 6. Agent Configuration

### Main Agent (OpenClaw)

**Location:** `openclaw/agents/main/`
**Models Configured:**
- zai/glm-4.7 (primary)
- zai/glm-5 (fallback)
- openrouter (via OPENROUTER_API_KEY)
- qwen-portal (OAuth)

### Nova Agent

**Location:** `openclaw/agents/nova/`
**Persona:** Autonomous Life Orchestrator
**Capabilities:**
- Task division and delegation
- Multi-agent coordination
- Guardian escalation for code tasks

---

## 7. Documentation Review

### Available Documentation

| Document | Location | Status |
|----------|----------|--------|
| SSOT Keys Guide | `docs/SSOT_KEYS.md` | ✅ Complete |
| OpenClaw Guide | `docs/OPENCLAW.md` | ✅ Complete |
| Guardian README | `modules/guardian/README.md` | ✅ Complete |
| Guardian SSOT | `modules/guardian/SSOT_KEYS.md` | ✅ Complete |
| Orchestrator Docs | `openclaw/workspace/Guardian-Orchestrator-Docs.md` | ✅ Complete |
| Desktop SSOT Guide | `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md` | ✅ Complete |

---

## 8. Test Results Summary

| Test | Result |
|------|--------|
| OpenClaw Health Check | ✅ PASS |
| Watchdog Running | ✅ PASS |
| Keychain z.ai Key | ✅ PASS |
| Keychain Groq Key | ✅ PASS |
| Guardian API Call (Groq) | ✅ PASS |
| Hardcoded Keys Scan | ❌ FAIL |

---

## 9. Recommendations

### Immediate Actions (Critical)

1. **Rotate exposed API keys**
   - z.ai key is exposed in git
   - Generate new key and store in Keychain only

2. **Purge auth-profiles.json from git history**
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch openclaw/agents/*/auth-profiles.json' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Add to .gitignore**
   ```
   openclaw/agents/*/auth*.json
   openclaw/agents/*/auth-profiles.json
   ```

### Short-term Actions

4. **Configure OpenClaw to use environment variables**
   - Auth profiles should reference `ZAI_API_KEY` not actual key
   - Start script loads from Keychain

5. **Add pre-commit hook** to detect hardcoded keys
   ```bash
   #!/bin/bash
   if git diff --cached | grep -E "(sk-|gsk_|AIza|4ee8f8d1)"; then
     echo "ERROR: Potential API key detected"
     exit 1
   fi
   ```

### Long-term Actions

6. **Consider using Infisical** for runtime secrets injection
7. **Implement key rotation schedule** (every 90 days)
8. **Add security scanning** to CI/CD pipeline

---

## 10. Compliance Status

| Policy | Status | Notes |
|--------|--------|-------|
| No .env files with keys | ✅ PASS | .env only has URLs/model names |
| No hardcoded secrets | ❌ FAIL | auth-profiles.json has keys |
| Keys from Keychain | ✅ PASS | Scripts use Keychain correctly |
| No keys in git | ❌ FAIL | Keys committed to repo |

---

## Appendix A: File Locations

```
~/xmad-control/
├── openclaw/
│   ├── agents/
│   │   ├── main/agent/auth-profiles.json  ← CONTAINS EXPOSED KEYS
│   │   └── nova/persona.json
│   ├── configs/openclaw.json
│   ├── scripts/start-ssot.sh
│   └── watchdog/status.json
├── modules/guardian/
│   ├── .env                               ← SSOT COMPLIANT
│   ├── scripts/api-call.sh                ← SSOT COMPLIANT
│   └── README.md
└── docs/
    ├── SSOT_KEYS.md
    └── OPENCLAW.md
```

---

## Appendix B: Key Services Endpoints

| Service | URL | Format |
|---------|-----|--------|
| z.ai (Anthropic) | `https://api.z.ai/api/anthropic/v1/messages` | Anthropic |
| Groq | `https://api.groq.com/openai/v1/chat/completions` | OpenAI |
| DeepSeek | `https://api.deepseek.com/v1/chat/completions` | OpenAI |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/models/...` | Native |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | OpenAI |

---

**Audit Complete:** 2026-03-17
**Next Audit Recommended:** 2026-04-17
