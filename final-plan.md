# Plans 1-3 Audit Findings

**Date:** 2026-03-17
**Status:** Audit Complete - All 3 Plans Reviewed
**Last Updated:** After Plan 2/3 (XMAD Web UI) Deep Audit

---

## PLAN 2/3 FINDINGS - Deep Audit Results

### 🔴 PLAN MADE INCORRECT ASSUMPTIONS

**Plan Claim: "Archive features/control-center/"**
- **REALITY:** `features/control-center/dashboard/page.tsx` is ACTIVE CODE
- Uses real API calls (`xmadApi`), provides system stats, OpenClaw status, Tailscale widgets
- **DO NOT ARCHIVE** - Plan was wrong

**Plan Claim: "Organize scripts/ into subdirectories"**
- **REALITY:** Already done - `scripts/audit/` and `scripts/verification/` exist
- **NO ACTION NEEDED**

**Plan Claim: "Organize docs/ into subdirectories"**
- **REALITY:** Already done - `docs/audit/` and `docs/plans/` exist
- **NO ACTION NEEDED**

### Heap Analyzer Analysis - NOT DUPLICATES

| File | Lines | Purpose | Verdict |
|------|-------|---------|---------|
| `analyze-heap-simple.ts` | 310 | Simple comparison, hardcoded paths | KEEP (different use case) |
| `analyze-heap-v2.ts` | 294 | Feature-complete, better formatting | KEEP (most complete) |
| `analyze-heap.py` | 198 | Python alternative | KEEP (non-Bun environments) |
| `analyze-heap.ts` | 363 | Class-based, most sophisticated | KEEP (primary version) |

**Verdict:** These are NOT duplicates - they serve different purposes. Plan was wrong.

### Files to Actually Clean Up

| File | Status | Action | Reason |
|------|--------|--------|--------|
| `scripts/memory-emergency.md` | Exists | ARCHIVE | Historical record |
| `scripts/memory-optimization-complete.md` | Exists | ARCHIVE | Historical record |
| `scripts/task-issue.md` | Exists | DELETE | Completed task tracking (obsolete) |
| `clone-coordinator.js` | Exists | KEEP | Still useful for coordinator system |
| `serve-dashboard.js` | Exists | KEEP | Serves coordinator on port 3579 |

### ✅ Actually Useful from Plan 2

**Only ONE item:** `config/machine-profile.json`

```json
{
  "machine": "Mac mini Late 2014",
  "cpu_cores": 2,
  "ram_gb": 8,
  "storage_type": "HDD",
  "thresholds": {
    "node_heap_mb": 480,
    "max_parallel_ai": 1,
    "ram_warn_pct": 52,
    "ram_guard_pct": 60,
    "ram_crit_pct": 70,
    "ram_emerg_pct": 78
  }
}
```

**But:** Use MB-based thresholds instead of percentages (as established in Plan 1 audit).

---

### Types (types/xmad.ts) - NEEDS ADDING

**Status:** ❌ Does not exist

**Plan specifies:**
```typescript
export type ServiceHealth = "online" | "offline" | "degraded" | "unknown";
export type JobStatus    = "queued" | "running" | "done" | "failed" | "paused";
export type JobPriority  = "low" | "normal" | "high" | "critical";

export interface SystemStats {
  cpuPercent:    number;
  memUsedMB:     number;
  memTotalMB:    number;
  memFreeMB:     number;
  diskUsedGB:    number;
  diskTotalGB:   number;
  uptimeSeconds: number;
  loadAvg:       [number, number, number];
  timestamp:     string;
}

export interface ServiceStatus {
  name:      string;
  health:    ServiceHealth;
  pid?:      number;
  memoryMB?: number;
  port?:     number;
  uptime?:   string;
  detail?:   string;
}

export interface TailscaleStatus {
  self:   { hostname: string; ip: string; online: boolean };
  peers:  { hostname: string; ip: string; online: boolean; lastSeen?: string }[];
  online: boolean;
}

export interface AutomationJob {
  id:        string;
  task:      string;
  status:    JobStatus;
  priority:  JobPriority;
  created:   string;
  started?:  string;
  finished?: string;
  result?:   string;
  error?:    string;
}

export interface Backup {
  id:       string;
  name:     string;
  sizeMB:   number;
  created:  string;
  includes: string[];
  note?:    string;
}

export interface NovaMessage {
  id:        string;
  role:      "user" | "nova" | "system";
  text:      string;
  timestamp: string;
}

export interface SSEEvent {
  type:    "stats" | "service" | "job" | "alert" | "heartbeat";
  payload: unknown;
  ts:      string;
}

export const ALLOWED_MEMORY_PATHS = [
  "/Users/ahmadabdullah/.openclaw/workspace/SOUL.md",
  "/Users/ahmadabdullah/.openclaw/workspace/MEMORY.md",
  "/Users/ahmadabdullah/.openclaw/workspace/IDENTITY.md",
  "/Users/ahmadabdullah/.openclaw/memory/nova-identity.md",
] as const;

export type AllowedMemoryPath = (typeof ALLOWED_MEMORY_PATHS)[number];
```

**Our implementation:**
- `types/surface.types.ts` - Has SurfaceId, SurfaceDefinition (different purpose)
- `lib/xmad-api.ts` - Has partial types inline (SystemStats, OpenClawStatus, etc.)

**Recommendation:** CREATE `types/xmad.ts`

---

### Lib Files

#### lib/security.ts - NEEDS ADDING
**Status:** ❌ Does not exist

**Plan code:**
```typescript
import path from "node:path";
import { ALLOWED_MEMORY_PATHS, type AllowedMemoryPath } from "@/types/xmad";

export function validateMemoryPath(requested: string): AllowedMemoryPath | null {
  const normalized = path.normalize(requested);
  return ALLOWED_MEMORY_PATHS.find((p) => p === normalized) ?? null;
}

export function sanitizeForDisplay(input: string): string {
  return input.replace(/[<>'"&]/g, "").slice(0, 2000);
}

export function isTailscaleIP(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1") return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return false;
  return parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127;
}

export function validateTaskText(task: string): { ok: boolean; reason?: string } {
  if (!task || task.trim().length === 0) return { ok: false, reason: "Task cannot be empty" };
  if (task.length > 2000) return { ok: false, reason: "Task too long (max 2000 chars)" };
  const forbidden = [";", "&&", "||", "`", "$(", "<(", "|("];
  for (const f of forbidden) {
    if (task.includes(f)) return { ok: false, reason: `Invalid character sequence: ${f}` };
  }
  return { ok: true };
}
```

**Recommendation:** CREATE - Security utilities needed

#### lib/secrets.ts - NEEDS ADDING
**Status:** ❌ Does not exist

**Plan code:**
```typescript
export function getSecret(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (fallback !== undefined) return fallback;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[secrets] Missing: ${name}`);
  }
  return "";
}

export function getGatewayUrl()   { return getSecret("XMAD_GATEWAY_URL", "http://localhost:9870"); }
export function getLegacyApiUrl() { return getSecret("XMAD_LEGACY_URL",  "http://localhost:8765"); }
export function getOpenClawUrl()  { return getSecret("OPENCLAW_URL",      "http://localhost:18789"); }
```

**Recommendation:** CREATE - SSOT secrets management

#### lib/sse.ts - NEEDS ADDING (utility functions)
**Status:** ⚠️ PARTIAL - We have `lib/sse-client.ts` (hooks, not utilities)

**Plan code:**
```typescript
import type { SSEEvent } from "@/types/xmad";

export function createSSEStream(
  handler: (emit: (event: SSEEvent) => void, close: () => void) => () => void
): ReadableStream {
  let cleanup: (() => void) | null = null;

  return new ReadableStream({
    start(controller) {
      const emit = (event: SSEEvent) => {
        try {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch { /* closed */ }
      };
      const close = () => { try { controller.close(); } catch { /* already closed */ } };

      cleanup = handler(emit, close);

      const heartbeat = setInterval(() => {
        emit({ type: "heartbeat", payload: { time: new Date().toISOString() }, ts: new Date().toISOString() });
      }, 25_000);

      const orig = cleanup;
      cleanup = () => { clearInterval(heartbeat); orig?.(); };
    },
    cancel() { cleanup?.(); },
  });
}

export function parseSSEData(raw: string): SSEEvent | null {
  try {
    const parsed = JSON.parse(raw) as SSEEvent;
    return parsed.type === "heartbeat" ? null : parsed;
  } catch { return null; }
}
```

**Our implementation:** `lib/sse-client.ts` has `useSSE()` hook with full reconnection logic

**Recommendation:** KEEP_OURS for hooks, ADD utility functions from plan

---

### Hooks

#### hooks/use-sse.ts - ALREADY EXISTS (Better)
**Status:** ✅ EXISTS - `lib/sse-client.ts` (196 lines)

**Our implementation:**
- Full `useSSE<T>()` hook with TypeScript generics
- Auto-reconnection with configurable delay (default: 3000ms)
- Max reconnection attempts
- onOpen, onClose, onError callbacks
- Includes `useSystemStats()` convenience hook

**Recommendation:** KEEP_OURS - More feature-rich than plan

#### hooks/use-alerts.ts - NEEDS ADDING
**Status:** ❌ Does not exist

**Plan code:**
```typescript
"use client";

import { useState, useCallback } from "react";

export interface Alert {
  id: string; level: "warn" | "critical"; message: string; ts: string;
}

export function useAlerts(maxAlerts = 5) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const push = useCallback((message: string, level: "warn" | "critical" = "warn") => {
    setAlerts((prev) => {
      const now = Date.now();
      if (prev.find((a) => a.message === message && now - new Date(a.ts).getTime() < 60_000)) return prev;
      return [{ id: `${now}-${Math.random().toString(36).slice(2,6)}`, level, message, ts: new Date().toISOString() }, ...prev].slice(0, maxAlerts);
    });
  }, [maxAlerts]);

  const dismiss = useCallback((id: string) => setAlerts((p) => p.filter((a) => a.id !== id)), []);

  return { alerts, push, dismiss };
}
```

**Recommendation:** CREATE

---

### UI Components

#### components/ui/glass-card.tsx - ALREADY EXISTS (Better)
**Status:** ✅ EXISTS - `components/glass/glass-card.tsx` (74 lines)

**Our implementation:**
- Full GlassCard component with glowEffect prop
- Sub-components: GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter
- Glass morphism effects with blur and borders

**Recommendation:** KEEP_OURS - More complete than plan

#### components/ui/xmad-button.tsx - NEEDS UPDATING
**Status:** ⚠️ DIFFERENT - We have `components/glass/glass-button.tsx`

**Plan variants:** primary, ghost, danger, success
**Our variants:** default, primary, outline, ghost, destructive

**Recommendation:** MERGE - Add `success` variant, keep our implementation

#### components/ui/status-dot.tsx - NEEDS ADDING
**Status:** ❌ Does not exist

**Plan code:**
```typescript
import type { ServiceHealth } from "@/types/xmad";

const cfg: Record<ServiceHealth, { label: string; color: string; bg: string; border: string }> = {
  online:   { label: "● ONLINE",   color: "#00cc66", bg: "#00cc6615", border: "#00cc6633" },
  offline:  { label: "○ OFFLINE",  color: "#ff4444", bg: "#ff444415", border: "#ff444433" },
  degraded: { label: "◐ DEGRADED", color: "#ffaa00", bg: "#ffaa0015", border: "#ffaa0033" },
  unknown:  { label: "◌ UNKNOWN",  color: "#888899", bg: "#88889915", border: "#88889933" },
};

export function StatusDot({ status }: { status: ServiceHealth }) {
  const c = cfg[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
      letterSpacing: 0.8, color: c.color, background: c.bg,
      border: `1px solid ${c.border}`, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}
```

**We have:** `components/glass/glass-badge.tsx` with success/warning/destructive variants

**Recommendation:** CREATE - StatusDot is more specific for health indicators

---

### Widgets

#### components/widgets/system-stats-widget.tsx - ALREADY EXISTS (Better)
**Status:** ✅ EXISTS - `components/registry/widgets/stats-widget.tsx` (583 lines)

**Our implementation:**
- StatCard, MetricStat, ComparisonStat
- CircularProgressStat (animated SVG)
- MultiGaugeWidget (3 circular gauges)
- MultiProgressWidget (3 linear progress bars)
- Full animation support

**Recommendation:** KEEP_OURS - Much more feature-rich

#### components/widgets/services-widget.tsx - NEEDS ADDING
**Status:** ❌ Does not exist

**Plan code:**
```typescript
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { StatusDot } from "@/components/ui/status-dot";
import { XMADButton } from "@/components/ui/xmad-button";
import type { ServiceStatus } from "@/types/xmad";

export function ServicesWidget({ services, onAction }: {
  services: ServiceStatus[];
  onAction?: (name: string, action: "start"|"restart"|"stop") => void;
}) {
  return (
    <GlassCard>
      <div style={{ color:"#8888aa", fontSize:10, letterSpacing:1.2, marginBottom:14, textTransform:"uppercase" }}>Services</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {services.length === 0 && <div style={{ color:"#8888aa", fontSize:12 }}>Loading services...</div>}
        {services.map((svc) => (
          <div key={svc.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#e8e8f0" }}>{svc.name}</div>
              <div style={{ color:"#8888aa", fontSize:11, marginTop:2 }}>
                {[svc.port && `port ${svc.port}`, svc.memoryMB && `${svc.memoryMB}MB`, svc.detail].filter(Boolean).join(" · ")}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <StatusDot status={svc.health} />
              {svc.health === "offline" && onAction && (
                <XMADButton variant="success" size="sm" onClick={() => onAction(svc.name,"start")}>Start</XMADButton>
              )}
              {svc.health === "online" && svc.name.includes("Nova") && onAction && (
                <XMADButton variant="ghost" size="sm" onClick={() => onAction(svc.name,"restart")}>Restart</XMADButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
```

**Recommendation:** CREATE

---

### API Routes

#### app/api/xmad/[...path]/route.ts - ALREADY EXISTS
**Status:** ✅ EXISTS - `app/api/xmad/[...path]/route.ts` (87 lines)

**Our implementation:**
- Full proxy to XMAD_API_URL (default: http://localhost:9870)
- GET, POST, PUT, DELETE support
- Authorization header forwarding
- Error handling

**Recommendation:** KEEP_OURS - Matches plan spec

#### app/api/xmad/events/route.ts - ALREADY EXISTS (Needs Update)
**Status:** ✅ EXISTS - `app/api/xmad/events/route.ts` (58 lines)

**Our implementation:**
- SSE endpoint with text/event-stream
- **5-second polling interval** (plan: 12s)
- Connection acknowledgment
- Client disconnect handling

**Recommendation:** UPDATE - Change interval to 12s per plan

---

### Middleware

#### middleware.ts - NEEDS ADDING (CRITICAL)
**Status:** ❌ Does not exist

**Plan code:**
```typescript
import { type NextRequest, NextResponse } from "next/server";

function isTailscaleOrLocal(ip: string): boolean {
  if (!ip) return false;
  if (["127.0.0.1","::1","localhost"].includes(ip)) return true;
  if (ip.startsWith("::ffff:127.")) return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;
  return parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127;
}

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim();
  if (!isTailscaleOrLocal(ip)) {
    return new NextResponse(JSON.stringify({ error:"Access restricted to Tailscale network", hint:"Connect via Tailscale VPN" }), {
      status: 403, headers: { "Content-Type":"application/json" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

**Recommendation:** CREATE - Security critical

---

### Pages (Mapping to Surfaces)

| Plan Page | Our Surface | Status | Action |
|-----------|-------------|--------|--------|
| app/dashboard/page.tsx | surfaces/overview.surface.tsx | ✅ BETTER | KEEP_OURS |
| app/chat/page.tsx | surfaces/chat.surface.tsx | ✅ EXISTS | KEEP_OURS |
| app/memory/page.tsx | surfaces/memory.surface.tsx | ⚠️ PLACEHOLDER | UPDATE |
| app/screen/page.tsx | surfaces/screen.surface.tsx | ✅ EXISTS | KEEP_OURS |
| app/automation/page.tsx | surfaces/automation.surface.tsx | ⚠️ PLACEHOLDER | UPDATE |
| app/backups/page.tsx | surfaces/backups.surface.tsx | ✅ EXISTS | KEEP_OURS |
| app/settings/page.tsx | surfaces/settings.surface.tsx | ✅ EXISTS | KEEP_OURS |
| app/notes/page.tsx | ❌ MISSING | NEEDS ADDING | CREATE |
| app/tasks/page.tsx | ❌ MISSING | NEEDS ADDING | CREATE |
| app/terminal/page.tsx | surfaces/terminal.surface.tsx | ✅ EXISTS | KEEP_OURS |

---

### Layout

#### components/layout/app-shell.tsx - NEEDS ADDING
**Status:** ❌ Does not exist

**We have:** `features/home/HomeClient.tsx` (main dashboard with GlassTabs)

**Plan code:**
```typescript
"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, Brain, Terminal, Monitor, ListTodo, StickyNote, HardDrive, Zap, Settings } from "lucide-react";

const NAV = [
  { href:"/",           icon:LayoutDashboard, label:"Dashboard"  },
  { href:"/chat",       icon:Bot,             label:"Nova Chat"  },
  { href:"/memory",     icon:Brain,           label:"Memory"     },
  { href:"/terminal",   icon:Terminal,        label:"Logs"       },
  { href:"/screen",     icon:Monitor,         label:"Screen"     },
  { href:"/tasks",      icon:ListTodo,        label:"Tasks"      },
  { href:"/notes",      icon:StickyNote,      label:"Notes"      },
  { href:"/backups",    icon:HardDrive,       label:"Backups"    },
  { href:"/automation", icon:Zap,             label:"Automation" },
  { href:"/settings",   icon:Settings,        label:"Settings"   },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display:"flex", height:"100dvh", overflow:"hidden", background:"var(--bg,#0a0a0f)" }}>
      <nav style={{
        width: open ? 180 : 56, flexShrink:0,
        background:"rgba(17,17,24,0.9)", backdropFilter:"blur(20px)",
        borderRight:"1px solid rgba(255,255,255,0.07)",
        display:"flex", flexDirection:"column", padding:"12px 8px", gap:4,
        transition:"width 0.2s ease", overflow:"hidden", zIndex:10,
      }}>
        <button type="button" onClick={() => setOpen(o=>!o)} style={{ width:32, height:32, background:"#6c63ff", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, marginBottom:12, flexShrink:0 }}>X</button>
        {NAV.map(({ href, icon:Icon, label }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link key={href} href={href} title={label} style={{
              display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8,
              textDecoration:"none", color: active?"#6c63ff":"#8888aa",
              background: active?"rgba(108,99,255,0.12)":"transparent",
              border:`1px solid ${active?"rgba(108,99,255,0.2)":"transparent"}`,
              transition:"all 0.15s", whiteSpace:"nowrap", overflow:"hidden",
            }}>
              <Icon size={16} style={{ flexShrink:0 }} />
              {open && <span style={{ fontSize:12, fontWeight: active?700:400 }}>{label}</span>}
            </Link>
          );
        })}
      </nav>
      <main style={{ flex:1, overflow:"auto", minWidth:0 }}>{children}</main>
    </div>
  );
}
```

**Recommendation:** SKIP - Our HomeClient.tsx is better integrated with surfaces

---

### Plan 2/3 Summary

| Category | Status |
|----------|--------|
| **Types** | NEEDS ADDING (types/xmad.ts) |
| **Lib Files** | NEEDS ADDING (security.ts, secrets.ts) + MERGE (sse.ts) |
| **Hooks** | KEEP_OURS (use-sse) + ADD (use-alerts) |
| **UI Components** | KEEP_OURS (glass-card, glass-button) + ADD (status-dot) |
| **Widgets** | KEEP_OURS (stats-widget) + ADD (services-widget) |
| **API Routes** | KEEP_OURS + UPDATE (events interval) |
| **Middleware** | NEEDS ADDING (middleware.ts - CRITICAL) |
| **Pages** | KEEP_OURS surfaces + ADD (notes, tasks) + UPDATE (memory, automation) |
| **Layout** | SKIP (our HomeClient is better) |

---

## PLAN 1/3 FINDINGS - Deep Audit Results

### 🔴 CRITICAL BUGS IN PLAN (NOT IMPLEMENTATION ERRORS)

**Plan's RAM Calculation is BROKEN:**
```bash
# Plan uses $8 for page size - WRONG!
/page size of/ { pagesize = $8 }  # $8 = "bytes", not 4096
# Correct: $5 or hardcode 4096
```

**Plan's Thresholds Too Lenient for 8GB:**
| Plan Threshold | Actual Value | Problem |
|----------------|--------------|---------|
| RAM_GUARD=60% | 3.2GB free | Too late - swap already active |
| RAM_CRIT=70% | 2.4GB free | Way too much free before action |
| RAM_EMERG=78% | 1.76GB free | Should trigger at ~600MB free, not 1.7GB |

### ✅ Current Implementation is CORRECT

| Aspect | Current | Plan | Winner |
|--------|---------|------|--------|
| **Threshold model** | MB-based (350/600/1200MB) | Percentage (60/70/78%) | **CURRENT** (better for 8GB) |
| **Memory limit** | 700MB | 480MB | **CURRENT** (480 too aggressive) |
| **Process start** | `exec` pattern | Background + PID file | **CURRENT** (cleaner) |
| **API keys** | Multiple (ZAI, GROQ, DEEPSEEK, ELEVENLABS) | None | **CURRENT** |
| **AI whitelist** | YES (stabilizer.sh) | NO | **CURRENT** |
| **Swap detection** | NO | YES (delta-based) | **PLAN** |
| **Load monitoring** | NO | YES | **PLAN** |

### 🔴 Current Implementation Bugs Found

| Bug | Location | Severity | Fix |
|-----|----------|----------|-----|
| Port scanning extremely slow | stabilizer.sh lines 73-95 | HIGH | 4000 iterations, replace with single lsof |
| No swap detection | kernel/stabilizer | MEDIUM | Add delta-based detection from plan |
| No load monitoring | kernel/stabilizer | MEDIUM | Add simplified load check |

### What to ADOPT from Plan 1

1. **Swap spike detection** (delta-based, freeze with STOP/CONT)
2. **Load average monitoring** (but simplify - use sysctl instead of uptime)
3. **Graceful restart command** pattern

### What to KEEP from Current

1. MB-based thresholds (350/600/1200MB free)
2. AI process whitelist
3. `exec` pattern for gateway start
4. 700MB memory limit
5. Multiple API key loading from Keychain

---

## PLAN 3/3 FINDINGS - Deep Code Audit

### 🔴 CRITICAL: Neither Implementation is Production-Ready

After line-by-line code audit by multiple agents, **BOTH implementations have critical bugs**.

---

### Current Implementation Bugs (modules/monitor/system-resource-bridge.sh)

| Severity | Bug | Location | Impact |
|----------|-----|----------|--------|
| 🔴 CRITICAL | **Swap detection BROKEN** - Uses `$3` but vm_stat has pageouts in `$2` | Line 115 | Returns empty string, swap spike detection NEVER works |
| 🔴 CRITICAL | **First swap delta = ALL pageouts** | Line 34, 377 | First check shows huge false positive |
| 🔴 CRITICAL | **PID file race condition** (TOCTOU) | Lines 353-361 | Two instances can start simultaneously |
| 🔴 CRITICAL | **Blocking sleep during resume** | Line 330 | No status updates for 20s, file goes stale |
| 🟠 HIGH | **bc defaults to "1" (OK) on failure** | Line 317 | Pressure detection fails silently |
| 🟠 HIGH | **3 vm_stat calls** - values inconsistent | Lines 103-105 | Memory values from different time slices |

**Proof of Swap Bug:**
```bash
# vm_stat output:
# Pageouts:                                33437.
# Field 1: "Pageouts:"
# Field 2: "33437."
# Field 3: (DOES NOT EXIST!)

# Current code (BROKEN):
pageouts=$(vm_stat | awk '/Pageouts/ {print $3}' | tr -d '.')  # Returns EMPTY
```

---

### Plan Implementation Bugs

| Severity | Bug | Location | Impact |
|----------|-----|----------|--------|
| 🔴 CRITICAL | **No PID file** | Missing | Multiple instances can run |
| 🔴 CRITICAL | **No cleanup trap** | Missing | Leaves AI agents paused forever on exit |
| 🟠 HIGH | **Missing speculative pages** | get_free_kb() | Underreports memory by 5-15% |
| 🟠 HIGH | **gsub wrong syntax** | get_swap_pageouts() | `gsub(/\./, "")` modifies $0, not $2 |
| 🟠 HIGH | **No default values** | Throughout | Breaks if config missing |
| 🟠 HIGH | **No AI_STATE tracking** | Throughout | Multiple STOP/CONT signals |

---

### Algorithm Comparison (CORRECTED)

| Algorithm | Current | Plan | Winner |
|-----------|---------|------|--------|
| **Memory calculation** | ✅ Includes speculative (accurate) | ❌ Missing speculative (5-15% error) | **CURRENT** |
| **Memory efficiency** | ❌ 3 vm_stat calls | ✅ 1 vm_stat call | **PLAN** |
| **Swap detection** | ❌ BROKEN ($3 wrong field) | ✅ CORRECT ($2 + gsub) | **PLAN** |
| **Load comparison** | ✅ Clear bc comparison | ⚠️ Multiply by 10 (confusing) | **CURRENT** |
| **State machine** | ✅ AI_STATE tracking | ❌ Only COOLDOWN | **CURRENT** |
| **Singleton enforcement** | ⚠️ Race condition exists | ❌ NONE | **CURRENT** (needs fix) |
| **Cleanup** | ✅ trap cleanup EXIT | ❌ NONE | **CURRENT** |
| **Resume logic** | ❌ Blocking sleep | ✅ Non-blocking | **PLAN** |

---

### Required Fixes for Current Implementation

```bash
# FIX 1: Swap algorithm (CRITICAL) - Line 115
get_swap_pageouts() {
-    pageouts=$(vm_stat | awk '/Pageouts/ {print $3}' | tr -d '.')
+    pageouts=$(vm_stat | awk '/Pageouts/ {gsub(/\./, "", $2); print $2}')
    echo "${pageouts:-0}"
}

# FIX 2: Single vm_stat call (adopt PLAN pattern) - Lines 99-111
get_free_ram_kb() {
-    pages_free=$(vm_stat | awk '/Pages free:/ {print $3}' | tr -d '.')
-    pages_inactive=$(vm_stat | awk '/Pages inactive:/ {print $3}' | tr -d '.')
-    pages_speculative=$(vm_stat | awk '/Pages speculative:/ {print $3}' | tr -d '.')
-    total_free=$((pages_free + pages_inactive + pages_speculative))
-    echo $((total_free * 4))
+    vm_stat | awk '
+        /page size of/ { ps = $8 }
+        /Pages free/ { free = $3 }
+        /Pages inactive/ { inactive = $3 }
+        /Pages speculative/ { speculative = $3 }
+        END { printf "%d", (free + inactive + speculative) * ps / 1024 }
+    '
}

# FIX 3: First swap check skip - Add after PREV_SWAP_PAGEOUTS initialization
+FIRST_SWAP_CHECK=true
# In get_swap_delta():
+if [[ "$FIRST_SWAP_CHECK" == "true" ]]; then
+    FIRST_SWAP_CHECK=false
+    echo "0"
+    return
+fi

# FIX 4: Non-blocking resume (replace blocking sleep)
-    sleep "$RESUME_DELAY"  # BLOCKING
-    resume_ai_agents
+    # Use cooldown counter decremented each iteration

# FIX 5: bc error handling - Line 317
-load_ok=$(echo "$load_avg < $LOAD_THRESHOLD" | bc 2>/dev/null || echo "1")
+if [[ -z "$load_avg" ]]; then
+    load_ok=0  # Assume pressure if can't read
+else
+    load_ok=$(echo "$load_avg < $LOAD_THRESHOLD" | bc 2>/dev/null || echo "0")
+fi
```

---

### What to ADOPT from Plan

1. **Correct swap algorithm** (single awk with gsub)
2. **Single vm_stat call pattern** (more efficient)
3. **Non-blocking resume logic** (cooldown counter)
4. **Browser management** (HUP signal)
5. **Language server check** (tsserver restart)

---

### Verdict

**DO NOT REPLACE** current with plan. Current has better architecture but critical bugs.

**FIX CURRENT**, adopt plan's:
- Swap algorithm
- Single vm_stat pattern
- Non-blocking resume
- Browser + LS management

---

## CONFIGURATION FIX REQUIRED

**File:** `~/.zshrc`

| Line | Current (Wrong) | Should Be |
|------|-----------------|-----------|
| 190 | `OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"` | `OPENCLAW_CONFIG="$HOME/xmad-control/openclaw/configs/openclaw.json"` |

**Why:** Points to non-existent home directory location. OpenClaw should ONLY live in `~/xmad-control/openclaw/`.

---

## CONSOLIDATED ACTION ITEMS

### High Priority (Security/Stability)

| Action | Why |
|--------|-----|
| Fix `OPENCLAW_CONFIG` in `~/.zshrc` | Points to wrong location (home dir instead of xmad-control) |
| Add `openclaw/workspace/.env*` to .gitignore | Prevent future token exposure |
| Consider lowering NODE_OPTIONS to 480MB | 8GB machine, 700MB is risky |

### Medium Priority (Organization)

| Action | Why |
|--------|-----|
| Archive `ai-loop-monitor.sh` to `docs/archive/old-monitors/` | Clean up, prevent confusion |
| Archive `claude-monitor.sh` to `docs/archive/old-monitors/` | Clean up, prevent confusion |
| Create `config/resource-profile.conf` | Project-level threshold overrides |

### Low Priority (Nice to Have)

| Action | Why |
|--------|-----|
| Create `config/machine-profile.json` | SSOT for machine specs |
| Create log rotation script | Prevent log bloat |
| Create workspace cleaner | Prevent temp file bloat |

### Cleanup (CORRECTED after Deep Audit)

| File | Action | Reason |
|------|--------|--------|
| `scripts/analyze-heap-simple.ts` | **KEEP** | Different use case (simple comparison) |
| `scripts/analyze-heap-v2.ts` | **KEEP** | Most feature-complete version |
| `scripts/analyze-heap.py` | **KEEP** | Python alternative for non-Bun |
| `scripts/memory-emergency.md` | **ARCHIVE** | Historical record → `docs/archive/` |
| `scripts/memory-optimization-complete.md` | **ARCHIVE** | Historical record → `docs/archive/` |
| `scripts/task-issue.md` | **DELETE** | Completed task tracking (obsolete) |
| `scripts/clone-coordinator.js` | **KEEP** | Still useful for coordinator system |
| `scripts/serve-dashboard.js` | **KEEP** | Serves coordinator on port 3579 |
| `features/control-center/` | **KEEP** | ACTIVE CODE, not legacy |

---

## WHAT TO IGNORE FROM PLANS

| Plan Item | Reason to Ignore |
|-----------|------------------|
| Agent 3's 10-page control center | We have a better focused dashboard already |
| Archiving `features/control-center/` | **ACTIVE CODE** - plan was wrong |
| Removing heap analyzer "duplicates" | **NOT DUPLICATES** - different purposes |
| Organizing scripts/ into subdirs | **ALREADY DONE** - audit/, verification/ exist |
| Organizing docs/ into subdirs | **ALREADY DONE** - audit/, plans/ exist |
| Creating new `system-resource-bridge.sh` | Already exists (needs fixes, not replacement) |
| SSOT violation fix (.env files) | Files don't exist, not tracked |
| Agent branch structure | Not needed for cleanup |
| Percentage-based RAM thresholds | **WRONG for 8GB** - keep MB-based |

---

## SUMMARY - CORRECTED AFTER DEEP AUDIT

### Critical Bugs Found (NOT in Plans)

| Bug | Location | Severity |
|-----|----------|----------|
| Swap detection BROKEN (wrong field $3) | `system-resource-bridge.sh` line 115 | 🔴 CRITICAL |
| RAM calculation wrong (pagesize $8) | Plan 1 proposed code | 🔴 CRITICAL |
| Port scanning extremely slow (4000 iter) | `stabilizer.sh` lines 73-95 | 🟠 HIGH |
| No swap detection in kernel | `resource-kernel.sh` | 🟠 HIGH |
| No load monitoring | All current scripts | 🟠 HIGH |

### What Plans Got WRONG

| Plan Claim | Reality |
|------------|---------|
| "features/control-center is legacy" | **ACTIVE CODE** with real API calls |
| "Heap analyzers are duplicates" | **DIFFERENT PURPOSES** - not duplicates |
| "scripts/ needs organizing" | **ALREADY ORGANIZED** - audit/, verification/ exist |
| "Percentage thresholds better" | **WRONG for 8GB** - MB-based is correct |
| "Swap detection missing" | **EXISTS** but BROKEN (wrong awk field) |

### Real Action Items

| Priority | Action | Effort |
|----------|--------|--------|
| 🔴 HIGH | Fix swap detection ($3→$2) | 5 min |
| 🔴 HIGH | Add swap detection to kernel | 15 min |
| 🟠 MEDIUM | Add load monitoring | 15 min |
| 🟠 MEDIUM | Optimize port scanning | 10 min |
| 🟢 LOW | Create machine-profile.json | 10 min |
| 🟢 LOW | Archive memory docs | 5 min |

### Files Status

| Category | Count |
|----------|-------|
| **Critical bugs to fix** | 5 |
| **Plan items to ignore** | 9 (wrong assumptions) |
| **Real cleanup needed** | 3 (archive memory docs, delete task-issue.md) |
| **Already correctly implemented** | 15+ items |

---

**Final Verdict:** Plans contained valuable concepts but made incorrect assumptions about current state. Deep audit revealed:
1. Current implementation is mostly correct but has critical bugs
2. Plan proposed solutions that would BREAK working code
3. Real gaps are in kernel scripts (swap, load) not architecture
