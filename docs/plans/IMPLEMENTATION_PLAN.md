# XMAD Control Center - Complete Implementation Plan

**Date**: 2026-03-15
**Status**: Ready for Phased Implementation
**Branch**: `cleanup/agent-3-xmad-web-impl`
**Working Directory**: `~/xmad-control/`

---

## Overview

This plan provides a complete XMAD Control Center UI with:
- Real-time SSE updates (12s polling)
- Tailscale IP guard middleware
- SSOT secrets management (Keychain → env)
- Glass/liquid UI components
- 10 fully functional pages
- Automatic API fallback (9870 → 8765)
- RAM alert system with deduplication

---

## Critical Constraints

| Constraint | Value | Notes |
|------------|-------|-------|
| Project Dir | `~/xmad-control/` | NOT `~/xmad/xmad-web/` |
| Next.js Version | **16.1.6** | Use existing - DO NOT CHANGE |
| Tailwind Version | **4.2.1** | Already configured - DO NOT TOUCH |
| PostCSS Config | Existing | DO NOT TOUCH |
| Tailwind Config | Existing | DO NOT TOUCH |

### NEVER TOUCH
- `openclaw/` - Agent 1 territory
- `modules/` - Agent 1 territory
- `runtime/` - Agent 1 territory
- `bootstrap/` - Agent 1 territory
- `scripts/` (except adding new) - Agent 1 territory
- `docs/` - Agent 1 territory
- `storage/` - Agent 1 territory
- `config/` - Agent 1 territory

---

## Prerequisites

**Agent 2 must be merged before starting:**
```bash
cd ~/xmad-control
git checkout feature/dashboard-spacing-fix
git pull origin feature/dashboard-spacing-fix 2>/dev/null || true
git status --short  # must be clean

# Confirm Agent 2's cleanup is done
ls features/control-center 2>/dev/null && echo "WAIT — Agent 2 not merged yet" || echo "OK to proceed"
```

---

## Phase 1: Branch Setup & Configuration Check

### Step 0 — Branch Setup
```bash
cd ~/xmad-control
git checkout -b cleanup/agent-3-xmad-web-impl
```

### Step 1 — Verify Existing Config (DO NOT CHANGE)
```bash
# Check exact Next.js version
cat package.json | grep '"next"'
# Expected: "next": "16.1.6"

# Check Tailwind version
cat package.json | grep '"tailwindcss"'
# Expected: "tailwindcss": "^4.2.1"

# Check existing path alias
cat tsconfig.json | grep '"@/*"'

# Determine src layout
ls src/app 2>/dev/null && echo "src layout" || echo "root layout"
ls app/ components/ lib/ hooks/ 2>/dev/null
```

---

## Phase 2: Dependencies

### Step 2 — Install Missing Dependencies Only
```bash
cd ~/xmad-control

# Check what's already installed
cat package.json | grep -E "clsx|tailwind-merge|lucide-react"

# Add only what's missing
~/.bun/bin/bun add clsx tailwind-merge 2>/dev/null || bun add clsx tailwind-merge

# Verify
~/.bun/bin/bun run tsc --noEmit 2>&1 | head -5
```

---

## Phase 3: Core Types & Libraries

### Step 3 — Create Types

**File: `types/xmad.ts`**
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

// Exact allowlist — no dynamic paths ever
export const ALLOWED_MEMORY_PATHS = [
  "/Users/ahmadabdullah/.openclaw/workspace/SOUL.md",
  "/Users/ahmadabdullah/.openclaw/workspace/MEMORY.md",
  "/Users/ahmadabdullah/.openclaw/workspace/IDENTITY.md",
  "/Users/ahmadabdullah/.openclaw/memory/nova-identity.md",
] as const;

export type AllowedMemoryPath = (typeof ALLOWED_MEMORY_PATHS)[number];
```

### Step 4 — Create Libraries

**File: `lib/security.ts`**
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

**File: `lib/secrets.ts`**
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

**File: `lib/sse.ts`**
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

---

## Phase 4: Hooks

### Step 5 — Create Hooks

**File: `hooks/use-sse.ts`**
```typescript
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SSEEvent } from "@/types/xmad";
import { parseSSEData } from "@/lib/sse";

export function useSSE({ url, onEvent, reconnectMs = 5000, maxRetries = 10 }: {
  url: string;
  onEvent?: (event: SSEEvent) => void;
  reconnectMs?: number;
  maxRetries?: number;
}) {
  const [state, setState] = useState({ connected: false, error: null as string | null, retryCount: 0 });
  const esRef = useRef<EventSource | null>(null);
  const retries = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    esRef.current?.close();
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => { retries.current = 0; setState({ connected: true, error: null, retryCount: 0 }); };
    es.onmessage = (ev) => { const p = parseSSEData(ev.data); if (p) onEventRef.current?.(p); };
    es.onerror = () => {
      es.close();
      esRef.current = null;
      setState((s) => ({ ...s, connected: false }));
      if (retries.current >= maxRetries) { setState((s) => ({ ...s, error: "Connection lost" })); return; }
      retries.current++;
      setState((s) => ({ ...s, retryCount: retries.current }));
      timerRef.current = setTimeout(connect, reconnectMs);
    };
  }, [url, reconnectMs, maxRetries]);

  useEffect(() => {
    connect();
    return () => { timerRef.current && clearTimeout(timerRef.current); esRef.current?.close(); };
  }, [connect]);

  return state;
}
```

**File: `hooks/use-alerts.ts`**
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

---

## Phase 5: UI Components

### Step 6 — Create UI Components

**File: `components/ui/glass-card.tsx`**
```typescript
"use client";

import { type ReactNode, type CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: "accent" | "ok" | "warn" | "danger" | "none";
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const glowMap: Record<string, CSSProperties> = {
  accent: { boxShadow: "0 0 0 1px #6c63ff33, 0 8px 32px #6c63ff11" },
  ok:     { boxShadow: "0 0 0 1px #00cc6633, 0 8px 32px #00cc6611" },
  warn:   { boxShadow: "0 0 0 1px #ffaa0033, 0 8px 32px #ffaa0011" },
  danger: { boxShadow: "0 0 0 1px #ff444433, 0 8px 32px #ff444411" },
  none:   {},
};

const padMap = { sm: "12px", md: "16px", lg: "24px" };

export function GlassCard({ children, className, style, glow = "none", padding = "md", onClick }: GlassCardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "rgba(26,26,36,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: padMap[padding],
        transition: "box-shadow 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...glowMap[glow],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**File: `components/ui/xmad-button.tsx`** (Named to avoid collision with existing Button.tsx)
```typescript
"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger" | "success";

interface XMADButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

const styles: Record<Variant, { bg: string; color: string; border: string }> = {
  primary: { bg: "#6c63ff",              color: "#fff",     border: "#6c63ff" },
  ghost:   { bg: "rgba(255,255,255,0.04)", color: "#8888aa", border: "rgba(255,255,255,0.08)" },
  danger:  { bg: "#ff444415",             color: "#ff4444",  border: "#ff444433" },
  success: { bg: "#00cc6615",             color: "#00cc66",  border: "#00cc6633" },
};

export function XMADButton({ variant = "ghost", size = "md", loading = false, icon, children, disabled, style, ...props }: XMADButtonProps) {
  const s = styles[variant];
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      type={props.type ?? "button"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: size === "sm" ? "5px 10px" : "8px 14px",
        borderRadius: 7, fontSize: size === "sm" ? 11 : 13, fontWeight: 600,
        fontFamily: "inherit", cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.5 : 1, background: s.bg, color: s.color,
        border: `1px solid ${s.border}`, transition: "all 0.15s", whiteSpace: "nowrap",
        ...style,
      }}
    >
      {loading ? <span style={{ width:12, height:12, borderRadius:"50%", border:"2px solid currentColor", borderTopColor:"transparent", animation:"xspin 0.6s linear infinite", display:"inline-block" }} /> : icon}
      {children}
      <style>{`@keyframes xspin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
```

**File: `components/ui/status-dot.tsx`** (Named to avoid collision with existing StatusBadge.tsx)
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

---

## Phase 6: Widget Components

### Step 7 — Create Widgets

**File: `components/widgets/system-stats-widget.tsx`**
```typescript
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import type { SystemStats } from "@/types/xmad";

function Bar({ pct, warn = 80 }: { pct: number; warn?: number }) {
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:6, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background: pct>warn?"#ffaa00":"#00d4aa", borderRadius:2, transition:"width 0.6s ease" }} />
    </div>
  );
}

function formatUptime(s: number) {
  if (!s) return "—";
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  return h>24 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}h ${m}m`;
}

export function SystemStatsWidget({ stats, loading }: { stats: SystemStats|null; loading?: boolean }) {
  const memPct  = stats ? Math.round((stats.memUsedMB / stats.memTotalMB) * 100) : 0;
  const diskPct = stats?.diskTotalGB ? Math.round((stats.diskUsedGB / stats.diskTotalGB) * 100) : 0;

  return (
    <GlassCard>
      <div style={{ color:"#8888aa", fontSize:10, letterSpacing:1.2, marginBottom:14, textTransform:"uppercase" }}>System Resources</div>
      {loading && !stats ? (
        <div style={{ color:"#8888aa", fontSize:12, textAlign:"center", padding:"20px 0" }}>Loading...</div>
      ) : stats ? (
        <>
          {[
            { label:"CPU",      value:`${stats.cpuPercent.toFixed(1)}%`, pct:stats.cpuPercent, warn:80 },
            { label:"RAM",      value:`${stats.memUsedMB}MB / ${stats.memTotalMB}MB`, pct:memPct, warn:85 },
            { label:"Free RAM", value:`${stats.memFreeMB}MB` },
            ...(stats.diskTotalGB > 0 ? [{ label:"Disk", value:`${stats.diskUsedGB.toFixed(1)}GB / ${stats.diskTotalGB.toFixed(1)}GB`, pct:diskPct, warn:90 }] : []),
            { label:"Uptime",   value:formatUptime(stats.uptimeSeconds) },
            ...(stats.loadAvg[0]>0 ? [{ label:"Load", value:stats.loadAvg.map(n=>n.toFixed(2)).join("  ") }] : []),
          ].map(({ label, value, pct, warn }) => (
            <div key={label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:"#8888aa", fontSize:10, letterSpacing:0.8, textTransform:"uppercase" }}>{label}</span>
                <span style={{ color:"#e8e8f0", fontSize:13, fontWeight:700, fontFamily:"monospace" }}>{value}</span>
              </div>
              {pct !== undefined && <Bar pct={pct} warn={warn} />}
            </div>
          ))}
          <div style={{ color:"#8888aa", fontSize:10, textAlign:"right", marginTop:4 }}>
            {new Date(stats.timestamp).toLocaleTimeString()}
          </div>
        </>
      ) : (
        <div style={{ color:"#ff4444", fontSize:12, textAlign:"center", padding:"20px 0" }}>Stats unavailable</div>
      )}
    </GlassCard>
  );
}
```

**File: `components/widgets/services-widget.tsx`**
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

---

## Phase 7: API Routes

### Step 8 — Create API Routes

**File: `app/api/xmad/[...path]/route.ts`**
```typescript
import { type NextRequest, NextResponse } from "next/server";
import { getGatewayUrl, getLegacyApiUrl } from "@/lib/secrets";

export const dynamic = "force-dynamic";

async function proxy(req: NextRequest, base: string, pathStr: string): Promise<Response|null> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 10_000);
  try {
    const body = !["GET","HEAD"].includes(req.method) ? await req.text() : undefined;
    const res = await fetch(`${base}/api/${pathStr}`, {
      method: req.method,
      headers: { "Content-Type":"application/json" },
      body,
      signal: controller.signal,
    });
    return res;
  } catch { return null; } finally { clearTimeout(tid); }
}

async function handle(req: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const pathStr = path.join("/");

  const gw = await proxy(req, getGatewayUrl(), pathStr);
  if (gw?.ok) return NextResponse.json(await gw.json());

  const legacy = await proxy(req, getLegacyApiUrl(), pathStr);
  if (legacy?.ok) return NextResponse.json({ ...await legacy.json(), _source:"legacy" });

  return NextResponse.json({ error:"Service unavailable" }, { status:503 });
}

export const GET    = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => handle(req, ctx.params);
export const POST   = GET;
export const DELETE = GET;
```

**File: `app/api/xmad/events/route.ts`**
```typescript
import { type NextRequest, NextResponse } from "next/server";
import { createSSEStream } from "@/lib/sse";
import { getGatewayUrl, getLegacyApiUrl } from "@/lib/secrets";
import type { SSEEvent, SystemStats } from "@/types/xmad";

export const dynamic = "force-dynamic";

async function fetchStats(): Promise<SystemStats|null> {
  for (const base of [getGatewayUrl(), getLegacyApiUrl()]) {
    try {
      const res = await fetch(`${base}/api/system/stats`, { cache:"no-store", signal: AbortSignal.timeout(5000) });
      if (res.ok) return res.json();
    } catch { /* try next */ }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const stream = createSSEStream((emit, close) => {
    let active = true;

    async function poll() {
      if (!active) return;
      const stats = await fetchStats();

      if (stats) {
        emit({ type:"stats", payload:stats, ts:new Date().toISOString() } satisfies SSEEvent);

        if (stats.memFreeMB < 300) {
          emit({ type:"alert", payload:{ level:"critical", message:`Free RAM critically low: ${stats.memFreeMB}MB` }, ts:new Date().toISOString() } satisfies SSEEvent);
        } else if (stats.memFreeMB < 500) {
          emit({ type:"alert", payload:{ level:"warn", message:`Free RAM low: ${stats.memFreeMB}MB` }, ts:new Date().toISOString() } satisfies SSEEvent);
        }
      }
    }

    poll();
    const timer = setInterval(poll, 12_000);
    req.signal.addEventListener("abort", () => { active=false; clearInterval(timer); close(); });
    return () => { active=false; clearInterval(timer); };
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
```

---

## Phase 8: Middleware & Layout

### Step 9 — Create Middleware

**File: `middleware.ts`** (root level, same as package.json)
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

### Step 10 — Update Layout

**File: `app/layout.tsx`** (REPLACE - keep existing metadata/viewport if present)
```typescript
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XMAD Workspace",
  description: "AI Command Center",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "XMAD" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}

// Inline to avoid circular import
import { AppShell } from "@/components/layout/app-shell";
function AppShellWrapper({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

### Step 11 — Create App Shell

**File: `components/layout/app-shell.tsx`**
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
        <button
          type="button"
          onClick={() => setOpen(o=>!o)}
          style={{ width:32, height:32, background:"#6c63ff", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, marginBottom:12, flexShrink:0 }}
        >
          X
        </button>
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

---

## Phase 9: Pages (10 total)

### Step 12 — Create Pages

Create each page at the path shown. In every page, use these import substitutions:
- `import { Button }` → `import { XMADButton as Button } from @/components/ui/xmad-button`
- `import { StatusBadge }` → `import { StatusDot as StatusBadge } from @/components/ui/status-dot`

**Pages to create:**
1. `app/page.tsx` — Dashboard (main page)
2. `app/chat/page.tsx` — Nova Chat
3. `app/memory/page.tsx` — Brain editor
4. `app/screen/page.tsx` — VNC viewer
5. `app/automation/page.tsx` — Job queue
6. `app/backups/page.tsx` — Backup manager
7. `app/settings/page.tsx` — Configuration
8. `app/notes/page.tsx` — Apple Notes
9. `app/tasks/page.tsx` — Task tracker
10. `app/terminal/page.tsx` — Log viewer

---

## Phase 10: Supporting Files

### Step 13 — Create Supporting Files

**File: `scripts/load-secrets.sh`**
```bash
#!/bin/bash
# Load Keychain secrets into env before Node starts
load_key() {
  local value
  value=$(security find-generic-password -s "$1" -a "$2" -w 2>/dev/null || true)
  [ -n "$value" ] && export "$3=$value"
}
load_key "z.ai" "openclaw"    "ZAI_API_KEY"
load_key "z.ai" "claude-code" "ZAI_CLAUDE_KEY"
load_key "xmad" "gateway"     "XMAD_GATEWAY_TOKEN"

export XMAD_GATEWAY_URL="${XMAD_GATEWAY_URL:-http://localhost:9870}"
export XMAD_LEGACY_URL="${XMAD_LEGACY_URL:-http://localhost:8765}"
export OPENCLAW_URL="${OPENCLAW_URL:-http://localhost:18789}"
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"

exec "$@"
```

```bash
chmod +x scripts/load-secrets.sh
```

**File: `public/manifest.json`**
```json
{
  "name": "XMAD Workspace",
  "short_name": "XMAD",
  "description": "AI Command Center — Mac mini",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "orientation": "any",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Phase 11: Verification & Build

### Step 14 — Verify & Build
```bash
cd ~/xmad-control

# Type check
~/.bun/bin/bun run tsc --noEmit 2>&1 | head -30
# Target: zero errors

# Build
~/.bun/bin/bun run build 2>&1 | tail -20
# Target: "Compiled successfully"

# If SSE route errors: confirm force-dynamic is present
grep "force-dynamic" app/api/xmad/events/route.ts

# If middleware errors: confirm no lib/ imports in middleware.ts
head -5 middleware.ts
```

---

## Phase 12: Commit & Report

### Step 15 — Commit
```bash
git add -A
git commit -m "feat(xmad-web): new control center UI — SSE dashboard, glass components, proxy layer, Tailscale guard"
```

### Step 16 — Generate Audit Report
Create `docs/audit/AGENT3_REPORT.md`:
```bash
cat > docs/audit/AGENT3_REPORT.md << 'EOF'
# Agent 3 Implementation Report
Date: $(date)

## Files Created
$(find . -newer package.json -name "*.ts" -o -name "*.tsx" -o -name "*.json" | grep -v node_modules | grep -v .next | sort)

## Build Result
$(bun run build 2>&1 | tail -10)

## TypeScript Errors
$(bun run tsc --noEmit 2>&1 | wc -l) error lines

## New Routes Available
- /api/xmad/[...path] — proxy to gateway/legacy
- /api/xmad/events   — SSE stream
- /chat              — Nova chat
- /memory            — Brain editor
- /screen            — VNC viewer
- /terminal          — Log viewer
- /automation        — Job queue
- /backups           — Backup manager
- /tasks             — Task tracker
- /notes             — Apple Notes
- /settings          — Config

## STATUS: READY / PARTIAL / BLOCKED
EOF

git add docs/audit/AGENT3_REPORT.md
git commit -m "docs: Agent 3 implementation audit report"
```

---

## Verification Checklist

After implementation:

- [ ] `curl http://localhost:3000` returns HTML
- [ ] `curl http://localhost:3000/api/xmad/services` returns JSON
- [ ] `curl -N http://localhost:3000/api/xmad/events` returns SSE stream
- [ ] Mobile access via Tailscale works
- [ ] TypeScript check passes (0 errors)
- [ ] Build succeeds

---

## Access Points

| Type | URL |
|------|-----|
| Local | http://localhost:3000 |
| Mobile (Tailscale) | http://100.121.254.21:3000 |

---

## What Agent 3 Does NOT Do

- Does not touch `openclaw/`, `modules/`, `runtime/`, `bootstrap/`
- Does not change `next.config.mjs`, `postcss.config.mjs`, `tailwind` config
- Does not change the Next.js version in `package.json`
- Does not add a new `server.js` or API gateway
- Does not implement the port 9870 gateway — proxy already falls back to 8765
- Does not run `bun run dev` or start the platform — build verification only

---

## File Summary

| Category | Count |
|----------|-------|
| Types | 1 |
| Lib | 3 |
| Hooks | 2 |
| UI Components | 3 |
| Widget Components | 2 |
| Layout Components | 1 |
| API Routes | 2 |
| Pages | 10 |
| Middleware | 1 |
| Supporting | 2 |
| **Total** | **27** |

---

**Status**: ✅ READY FOR PHASED IMPLEMENTATION
**Branch**: `cleanup/agent-3-xmad-web-impl`
**Working Dir**: `~/xmad-control/`
