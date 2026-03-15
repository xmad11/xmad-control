# Runtime Final Report

**Date:** 2026-03-15

## SSOT Runtime
- **Location:** `xmad-control/openclaw/`
- **Config:** `openclaw/configs/openclaw.json`

## Removed
- `modules/openclaw/` — stale duplicate with old paths
- `runtime/` — shadow experiment system (archived design docs to `docs/archive/runtime-shadow-experiment/`)

## Scripts Created
| Script | Location | Purpose |
|--------|----------|---------|
| xmad-watchdog.sh | openclaw/scripts/ | Master watchdog with RAM/load/swap monitoring |
| start-gateway.sh | openclaw/scripts/ | Optimized gateway start with 480MB heap |
| log-rotate.sh | modules/monitor/ | Log rotation (10MB max, 3 rotations) |
| cleanup-runtime.sh | modules/guardian/ | Workspace cleaner (mp3/tmp removal) |

## Configuration
- **Node heap:** 480MB max (`--max-old-space-size=480`)
- **RAM thresholds:** Guard 60%, Crit 70%, Emerg 78%
- **Load thresholds:** Throttle 2.2, Cooldown 2.8, Emerg 4.0
- **Log rotation:** 10MB per file, max 3 rotations
- **Cleanup interval:** 12 hours for media files

## LaunchAgent
- Watchdog plist updated to reference `xmad-watchdog.sh`
- Gateway plist references `start-ssot.sh`

## Permissions
- `openclaw/credentials/` — 700
- `openclaw/memory/` — 700
- All shell scripts — executable
