#!/bin/bash
# XMAD WATCHDOG — SSOT v1.0
# Machine: Mac mini 2014, 8GB RAM, HDD
# DO NOT MODIFY THRESHOLDS WITHOUT CHECKING MACHINE PROFILE

OPENCLAW_DIR="$HOME/xmad-control/openclaw"
LOG_FILE="$OPENCLAW_DIR/logs/watchdog.log"
GATEWAY_SCRIPT="$OPENCLAW_DIR/scripts/start-gateway.sh"

# Machine profile thresholds
RAM_GUARD=60
RAM_CRIT=70
RAM_EMERG=78
LOAD_COOLDOWN=2.8
LOAD_EMERG=4.0
CHECK_INTERVAL=10

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') [WATCHDOG] $1" | tee -a "$LOG_FILE"; }

get_ram_used_pct() {
  vm_stat | awk '
    /page size of/ { pagesize = $8 }
    /Pages free/   { free = $3 }
    /Pages active/ { active = $3 }
    /Pages inactive/ { inactive = $3 }
    /Pages wired/  { wired = $4 }
    END {
      total = free + active + inactive + wired
      used_pct = int(((active + wired) / total) * 100)
      print used_pct
    }
  '
}

get_load() {
  uptime | awk -F'load averages:' '{print $2}' | awk '{print $1}' | tr -d ','
}

get_swap_pages_out() {
  vm_stat | awk '/Pageouts/ { gsub(/\./,""); print $2 }'
}

LAST_SWAP_OUT=0
COOLDOWN_ACTIVE=0

while true; do
  RAM=$(get_ram_used_pct)
  LOAD=$(get_load)
  SWAP_OUT=$(get_swap_pages_out)
  SWAP_DELTA=$((SWAP_OUT - LAST_SWAP_OUT))
  LAST_SWAP_OUT=$SWAP_OUT

  log "STATE: RAM=${RAM}% LOAD=${LOAD} SWAP_DELTA=${SWAP_DELTA}"

  # Swap spike detection — most critical for HDD machine
  if [ "$SWAP_DELTA" -gt 1000 ] 2>/dev/null; then
    log "SWAP SPIKE DETECTED — freezing AI streaming"
    pkill -STOP -f "openclaw" 2>/dev/null
    sleep 30
    pkill -CONT -f "openclaw" 2>/dev/null
  fi

  if [ "$RAM" -gt "$RAM_EMERG" ] 2>/dev/null; then
    log "EMERGENCY: RAM ${RAM}% — killing AI child processes"
    pkill -f "openclaw" 2>/dev/null
    sleep 5
    bash "$GATEWAY_SCRIPT" &
  elif [ "$RAM" -gt "$RAM_CRIT" ] 2>/dev/null; then
    log "CRITICAL: RAM ${RAM}% — restarting gateway"
    bash "$GATEWAY_SCRIPT" restart
  fi

  LOAD_INT=$(echo "$LOAD * 10" | bc 2>/dev/null | cut -d. -f1)
  LOAD_EMERG_INT=$(echo "$LOAD_EMERG * 10" | bc | cut -d. -f1)
  LOAD_COOL_INT=$(echo "$LOAD_COOLDOWN * 10" | bc | cut -d. -f1)

  if [ "${LOAD_INT:-0}" -gt "${LOAD_EMERG_INT:-40}" ] 2>/dev/null; then
    log "CPU EMERGENCY: load ${LOAD} — stopping AI agents"
    pkill -STOP -f "openclaw" 2>/dev/null
    COOLDOWN_ACTIVE=1
  elif [ "${LOAD_INT:-0}" -gt "${LOAD_COOL_INT:-28}" ] 2>/dev/null; then
    log "COOLDOWN: load ${LOAD} — throttling"
    COOLDOWN_ACTIVE=1
  elif [ "$COOLDOWN_ACTIVE" -eq 1 ]; then
    log "RESUMING: load normalized to ${LOAD}"
    pkill -CONT -f "openclaw" 2>/dev/null
    COOLDOWN_ACTIVE=0
  fi

  sleep "$CHECK_INTERVAL"
done
