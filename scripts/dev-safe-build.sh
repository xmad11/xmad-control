#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# DEV-SAFE BUILD - Memory-safe build for 8GB machines
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Conservative for 8GB machines
MAX_MEMORY_MB=1536  # 1.5GB heap - leaves room for system
BUILD_TIMEOUT=300   # 5 minutes

log() { echo -e "${BLUE}[dev-safe-build]${NC} $1"; }
warn() { echo -e "${YELLOW}[dev-safe-build]${NC} ⚠️  $1"; }
error() { echo -e "${RED}[dev-safe-build]${NC} ❌ $1"; }
success() { echo -e "${GREEN}[dev-safe-build]${NC} ✅ $1"; }

# Check memory before build
check_memory() {
    if command -v vm_stat &> /dev/null; then
        # macOS
        FREE_PAGES=$(vm_stat | grep "free" | awk '{print $3}' | sed 's/\.//')
        FREE_MB=$((FREE_PAGES * 4096 / 1024 / 1024))
    elif [ -f /proc/meminfo ]; then
        # Linux
        FREE_MB=$(grep MemAvailable /proc/meminfo | awk '{print int($2/1024)}')
    else
        warn "Cannot determine free memory, proceeding anyway"
        return 0
    fi

    if [ "$FREE_MB" -lt 1500 ]; then
        error "Insufficient memory: ${FREE_MB}MB free (need 1500MB minimum)"
        error "Close some applications and try again"
        exit 1
    fi

    log "Memory check passed: ${FREE_MB}MB available"
}

# Main build function
main() {
    log "Starting memory-safe build..."
    log "Memory limit: ${MAX_MEMORY_MB}MB"
    log "Timeout: ${BUILD_TIMEOUT}s"

    # Check memory
    check_memory

    # Generate service worker version
    log "Generating service worker version..."
    bun run scripts/generate-sw-version.ts

    # Run build with memory limits
    log "Running Next.js build with memory constraints..."

    # Set NODE_OPTIONS for memory limit
    export NODE_OPTIONS="--max-old-space-size=${MAX_MEMORY_MB}"

    # Run build with timeout
    if timeout $BUILD_TIMEOUT bun --bun next build 2>&1; then
        success "Build completed successfully!"
        exit 0
    else
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 124 ]; then
            error "Build timed out after ${BUILD_TIMEOUT}s"
        else
            error "Build failed with exit code ${EXIT_CODE}"
        fi

        # Suggest Vercel deployment as alternative
        echo ""
        warn "Local build failed due to memory constraints"
        warn "Alternative: Deploy to Vercel (no local memory cost)"
        warn "Run: git push origin main"
        exit $EXIT_CODE
    fi
}

# Run main
main "$@"
