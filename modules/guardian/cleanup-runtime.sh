#!/bin/bash
WORKSPACE="$HOME/xmad-control/openclaw/workspace"
STORAGE_LOGS="$HOME/xmad-control/storage/logs"

# Remove old voice/media files (older than 12 hours)
find "$WORKSPACE" -name "*.mp3" -mmin +720 -delete 2>/dev/null
find "$WORKSPACE" -name "*.tmp" -delete 2>/dev/null
find "$WORKSPACE/temp" -type f -mmin +60 -delete 2>/dev/null

# Truncate large storage logs
for f in "$STORAGE_LOGS"/*.log; do
  [ -f "$f" ] || continue
  SIZE=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  if [ "${SIZE:-0}" -gt 5000000 ]; then
    tail -c 1000000 "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
  fi
done

echo "$(date) Cleanup complete" >> "$HOME/xmad-control/storage/logs/cleanup.log"
