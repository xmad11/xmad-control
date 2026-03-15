# SSOT API Keys Guide

> **Secure API key management using macOS Keychain**

---

## Overview

All API keys for XMAD Control Center are stored securely in macOS Keychain. This is the **Single Source of Truth (SSOT)** for all secrets. Keys are **never** hardcoded in configuration files.

---

## Key Storage

### Keys in Keychain

| Service Name | Account | Environment Variable | Usage |
|--------------|---------|---------------------|-------|
| `z.ai` | `openclaw` | `ZAI_API_KEY` | GLM-4.7/GLM-5 AI models |
| `SSOT_AI_GROQ` | - | `GROQ_API_KEY` | Whisper STT (speech-to-text) |
| `SSOT_AI_DEEPSEEK` | - | `DEEPSEEK_API_KEY` | DeepSeek fallback model |
| `SSOT_AI_GLM_ZAI` | `SSOT` | - | Alternative ZAI storage |
| `SSOT_AI_GLM_PAID` | `SSOT` | - | Paid tier key |

### Security Benefits
- **Encrypted at rest** - Keychain uses AES-256 encryption
- **Access control** - Requires user approval for access
- **No plaintext** - Keys never appear in config files or git
- **System integration** - Uses native macOS security

---

## Managing Keys

### Adding Keys

```bash
# Add z.ai key (required for OpenClaw)
security add-generic-password -a "openclaw" -s "z.ai" -w "your-api-key-here"

# Add Groq key (optional, for STT)
security add-generic-password -s "SSOT_AI_GROQ" -w "your-groq-key"

# Add DeepSeek key (optional, for fallback)
security add-generic-password -s "SSOT_AI_DEEPSEEK" -w "your-deepseek-key"
```

### Retrieving Keys

```bash
# Get z.ai key (requires user approval)
security find-generic-password -s "z.ai" -a "openclaw" -w

# Get Groq key
security find-generic-password -s "SSOT_AI_GROQ" -w

# Get DeepSeek key
security find-generic-password -s "SSOT_AI_DEEPSEEK" -w
```

### Listing Keys

```bash
# List all SSOT keys
security dump-keychain | grep -A5 "SSOT\|z.ai"
```

### Deleting Keys

```bash
# Delete a key (be careful!)
security delete-generic-password -s "z.ai" -a "openclaw"
```

---

## How Keys Are Loaded

### In Scripts

The `start-ssot.sh` script loads keys before starting OpenClaw:

```bash
#!/bin/bash
# Load z.ai key
export ZAI_API_KEY=$(security find-generic-password -s "z.ai" -a "openclaw" -w 2>/dev/null)

# Verify key exists
if [[ -z "$ZAI_API_KEY" ]]; then
    echo "ERROR: z.ai key not found in Keychain"
    exit 1
fi

# Start OpenClaw with the key
~/.bun/bin/bun --bun ~/.bun/install/global/node_modules/openclaw/openclaw.mjs gateway
```

### Key Loading Order

1. Script calls `security find-generic-password`
2. macOS prompts user for Keychain access (first time only)
3. Key is exported to environment variable
4. OpenClaw reads from environment

---

## Troubleshooting

### Key Not Found

**Error:** `ERROR: z.ai key not found in Keychain`

**Solution:**
```bash
# Add the key
security add-generic-password -a "openclaw" -s "z.ai" -w "your-actual-key"
```

### Access Denied

**Error:** `security: SecKeychainItemCopyContent: The user name or passphrase you entered is not correct.`

**Solution:**
- When prompted, click "Allow" or "Always Allow" to grant terminal access to Keychain
- If Keychain is locked, unlock it in Keychain Access app

### Keychain Locked

**Solution:**
```bash
# Unlock Keychain
security unlock-keychain
```

---

## Security Best Practices

### DO:
- ✅ Store all keys in Keychain
- ✅ Use descriptive service names (e.g., `SSOT_AI_GROQ`)
- ✅ Rotate keys periodically
- ✅ Backup Keychain separately

### DON'T:
- ❌ Hardcode keys in config files
- ❌ Commit keys to git
- ❌ Store keys in plaintext files
- ❌ Share keys via chat/email

---

## Migration from Hardcoded Keys

If you have keys hardcoded in `auth-profiles.json`:

### Step 1: Extract keys
```bash
# View current keys
cat ~/.openclaw/auth-profiles.json
```

### Step 2: Add to Keychain
```bash
# For each key, add to Keychain
security add-generic-password -a "openclaw" -s "z.ai" -w "extracted-key"
```

### Step 3: Update config
```bash
# Remove hardcoded keys from auth-profiles.json
# Keys will now be loaded from Keychain via start-ssot.sh
```

### Step 4: Verify
```bash
# Start with SSOT method
bash ~/xmad-control/openclaw/scripts/start-ssot.sh

# Check it works
curl http://127.0.0.1:18789/health
```

---

## Related Documentation

- [OpenClaw Guide](./OPENCLAW.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Backup & Recovery](./BACKUP_RECOVERY.md)
