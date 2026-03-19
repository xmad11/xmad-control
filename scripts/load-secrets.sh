#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# LOAD SECRETS - Load API keys from macOS Keychain to environment
# SSOT: All secrets come from Keychain, never from .env files
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[load-secrets]${NC} $1"; }
warn() { echo -e "${YELLOW}[load-secrets]${NC} ⚠️  $1"; }
success() { echo -e "${GREEN}[load-secrets]${NC} ✅ $1"; }

# ═══════════════════════════════════════════════════════════════════════════════
# LOAD KEY FROM KEYCHAIN
# ═══════════════════════════════════════════════════════════════════════════════

load_key() {
    local service="$1"
    local account="$2"
    local env_var="$3"
    local key_value=""

    # Try to get from Keychain
    if [[ -n "$account" ]]; then
        key_value=$(security find-generic-password -s "$service" -a "$account" -w 2>/dev/null || echo "")
    else
        key_value=$(security find-generic-password -s "$service" -w 2>/dev/null || echo "")
    fi

    if [[ -n "$key_value" ]]; then
        export "$env_var"="$key_value"
        success "Loaded $env_var from Keychain ($service)"
        echo "export $env_var='$key_value'"
        return 0
    else
        # Check if already in environment
        local current_val="${!env_var:-}"
        if [[ -n "$current_val" ]]; then
            log "$env_var already set in environment"
            return 0
        else
            warn "$env_var not found in Keychain ($service)"
            return 1
        fi
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# LOAD ALL KEYS
# ═══════════════════════════════════════════════════════════════════════════════

load_all_keys() {
    log "Loading API keys from macOS Keychain..."

    local failed=0
    local loaded=0

    # AI Provider Keys
    load_key "z.ai" "openclaw" "ZAI_API_KEY" && ((loaded++)) || ((failed++))
    load_key "SSOT_AI_GROQ" "" "GROQ_API_KEY" && ((loaded++)) || ((failed++))
    load_key "SSOT_AI_DEEPSEEK" "" "DEEPSEEK_API_KEY" && ((loaded++)) || ((failed++))
    load_key "SSOT_AI_GLM_PAID" "" "GLM_PAID_API_KEY" && ((loaded++)) || ((failed++))

    # Voice API Keys
    load_key "elevenlabs/xmad" "" "ELEVENLABS_API_KEY" && ((loaded++)) || ((failed++))

    # Infrastructure Keys
    load_key "SSOT_SUPABASE_URL" "" "NEXT_PUBLIC_SUPABASE_URL" && ((loaded++)) || ((failed++))
    load_key "SSOT_SUPABASE_ANON_KEY" "" "NEXT_PUBLIC_SUPABASE_ANON_KEY" && ((loaded++)) || ((failed++))

    echo ""
    log "Keys loaded: $loaded | Missing: $failed"

    if [[ $failed -gt 0 ]]; then
        warn "Some keys are missing. Add them with:"
        echo "  security add-generic-password -s \"SERVICE_NAME\" -w \"your-key\""
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

# If called with arguments, exec them after loading secrets
if [[ $# -gt 0 ]]; then
    eval "$(load_all_keys)"
    exec "$@"
else
    # Just load and print exports
    load_all_keys
fi
