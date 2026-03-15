#!/bin/bash
# OpenClaw Mirrored Runtime Launcher
# Launches OpenClaw using the custom runtime home directory

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/env-loader.sh"

echo "🦞 OpenClaw Mirrored Runtime Launcher"
echo "═══════════════════════════════════════════════════════════════"
echo "📁 Runtime Home: $OPENCLAW_RUNTIME_HOME"
echo ""

# Check if runtime home exists
if [ ! -d "$OPENCLAW_RUNTIME_HOME" ]; then
    echo "❌ Runtime home not found: $OPENCLAW_RUNTIME_HOME"
    exit 1
fi

# Check if config exists, if not, copy from default location
if [ ! -f "$OPENCLAW_RUNTIME_HOME/openclaw.json" ]; then
    echo "📋 No config found. Copying from default location..."
    if [ -f ~/.openclaw/openclaw.json ]; then
        cp ~/.openclaw/openclaw.json "$OPENCLAW_RUNTIME_HOME/openclaw.json"
        echo "   ✅ Config copied"
    else
        echo "   ⚠️ No default config found. Will create new config."
    fi
fi

# Set environment variable for OpenClaw home
export OPENCLAW_STATE_DIR="$OPENCLAW_RUNTIME_HOME"
export OPENCLAW_CONFIG_PATH="$OPENCLAW_RUNTIME_HOME/openclaw.json"

# Start OpenClaw gateway with custom home
echo "🚀 Starting OpenClaw gateway..."
echo ""

# Use openclaw command with custom state directory
OPENCLAW_STATE_DIR="$OPENCLAW_RUNTIME_HOME" \
OPENCLAW_CONFIG_PATH="$OPENCLAW_RUNTIME_HOME/openclaw.json" \
    openclaw gateway start --port "$OPENCLAW_GATEWAY_PORT"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ OpenClaw runtime started with custom home"
echo "🌐 Gateway: http://localhost:$OPENCLAW_GATEWAY_PORT"
echo "📁 Logs: $OPENCLAW_LOG_DIR"
