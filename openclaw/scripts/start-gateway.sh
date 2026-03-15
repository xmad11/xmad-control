#!/bin/bash
OPENCLAW_DIR="$HOME/xmad-control/openclaw"
LOG="$OPENCLAW_DIR/logs/gateway.log"

export NODE_OPTIONS="--max-old-space-size=480 --expose-gc"
export NEXT_TELEMETRY_DISABLED=1

case "$1" in
  restart)
    pkill -f "openclaw" 2>/dev/null
    sleep 3
    ;;
  stop)
    pkill -f "openclaw" 2>/dev/null
    exit 0
    ;;
esac

cd "$OPENCLAW_DIR"
bash scripts/load-keys.sh
echo "$(date) Starting OpenClaw gateway" >> "$LOG"
bun --smol run start >> "$LOG" 2>&1 &
echo $! > "$OPENCLAW_DIR/openclaw.pid"
echo "Gateway started PID $(cat $OPENCLAW_DIR/openclaw.pid)"
