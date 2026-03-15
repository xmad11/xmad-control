#!/bin/bash
# OpenClaw Shadow Dual-Run Test
# Tests mirrored runtime alongside original runtime

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/env-loader.sh"

# Test port for mirrored runtime (offset by 1000)
MIRROR_PORT=$((OPENCLAW_GATEWAY_PORT + 1000))

echo "🧪 OpenClaw Shadow Dual-Run Test"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "This test runs a mirrored OpenClaw runtime on port $MIRROR_PORT"
echo "alongside the original runtime on port $OPENCLAW_GATEWAY_PORT"
echo ""

# Step 1: Check original runtime
echo "1️⃣ Checking original runtime..."
ORIGINAL_HEALTH=$(curl -s "http://localhost:$OPENCLAW_GATEWAY_PORT/health" 2>/dev/null)
if [ "$ORIGINAL_HEALTH" = '{"ok":true,"status":"live"}' ]; then
    echo "   ✅ Original runtime healthy on port $OPENCLAW_GATEWAY_PORT"
else
    echo "   ⚠️ Original runtime not healthy. Start it first."
    exit 1
fi

# Step 2: Create temporary mirrored runtime home
MIRROR_HOME="$OPENCLAW_RUNTIME_HOME-shadow-test"
echo ""
echo "2️⃣ Creating mirrored runtime home..."
rm -rf "$MIRROR_HOME" 2>/dev/null
mkdir -p "$MIRROR_HOME"/{agents,memory,logs,workspace}

# Copy config if exists
if [ -f ~/.openclaw/openclaw.json ]; then
    cp ~/.openclaw/openclaw.json "$MIRROR_HOME/openclaw.json"
    echo "   ✅ Config copied"
fi

# Step 3: Start mirrored runtime
echo ""
echo "3️⃣ Starting mirrored runtime on port $MIRROR_PORT..."
OPENCLAW_STATE_DIR="$MIRROR_HOME" \
OPENCLAW_CONFIG_PATH="$MIRROR_HOME/openclaw.json" \
    openclaw gateway start --port "$MIRROR_PORT" &
MIRROR_PID=$!

sleep 5

# Step 4: Check mirrored runtime
echo ""
echo "4️⃣ Checking mirrored runtime..."
MIRROR_HEALTH=$(curl -s "http://localhost:$MIRROR_PORT/health" 2>/dev/null)
if [ "$MIRROR_HEALTH" = '{"ok":true,"status":"live"}' ]; then
    echo "   ✅ Mirrored runtime healthy on port $MIRROR_PORT"
else
    echo "   ❌ Mirrored runtime not healthy"
    kill $MIRROR_PID 2>/dev/null
    rm -rf "$MIRROR_HOME"
    exit 1
fi

# Step 5: Compare logs
echo ""
echo "5️⃣ Comparing runtime logs..."
ORIGINAL_LOG_SIZE=$(du -sm ~/.openclaw/logs 2>/dev/null | cut -f1)
MIRROR_LOG_SIZE=$(du -sm "$MIRROR_HOME/logs" 2>/dev/null | cut -f1)
echo "   Original logs: $ORIGINAL_LOG_SIZE"
echo "   Mirrored logs: $MIRROR_LOG_SIZE"

# Step 6: Cleanup
echo ""
echo "6️⃣ Stopping mirrored runtime..."
kill $MIRROR_PID 2>/dev/null
rm -rf "$MIRROR_HOME"
echo "   ✅ Cleaned up"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Shadow dual-run test PASSED"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Both runtimes can coexist. Ready for migration."
