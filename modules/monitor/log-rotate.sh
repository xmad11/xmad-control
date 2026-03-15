#!/bin/bash
LOG_DIR="$HOME/xmad-control/openclaw/logs"
MAX_SIZE=10000000  # 10MB
MAX_FILES=3

for f in "$LOG_DIR"/*.log; do
  [ -f "$f" ] || continue
  SIZE=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  if [ "${SIZE:-0}" -gt "$MAX_SIZE" ]; then
    TIMESTAMP=$(date +%s)
    gzip -c "$f" > "${f}.${TIMESTAMP}.gz"
    > "$f"  # truncate, don't delete
    echo "$(date) Rotated: $f" >> "$LOG_DIR/rotate.log"
    # Keep only MAX_FILES rotations
    ls "${f}".*.gz 2>/dev/null | sort -t. -k3 -n | head -n -${MAX_FILES} | xargs rm -f 2>/dev/null
  fi
done
