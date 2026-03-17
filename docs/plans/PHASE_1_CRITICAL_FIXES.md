# Phase 1: Critical Fixes (ASAP)

> **Priority:** IMMEDIATE - Security & Stability
> **Estimated Time:** 2-3 hours
> **Dependencies:** None

---

## 🔴 SECURITY FIXES (Do First)

### 1.1 Remove Hardcoded API Keys

**Files to fix:**

| File | Line | Issue |
|------|------|-------|
| `openclaw/configs/auth-profiles.json` | 42 | `apiKey: "4ee8f8d1f6214b5690ae0bab05ef0333.I15u7DOEDtcBTkmn"` |
| `modules/claude/claude-direct` | 5 | `ANTHROPIC_AUTH_TOKEN="c6645e09e4bc4fb99120a0461bd7647e.isY3GgE277vVy9YA"` |
| `modules/claude/claude-zai` | 5 | Same key as above |

**Fix Pattern:**
```bash
# For openclaw/configs/auth-profiles.json
# Remove the apiKey field entirely, load from Keychain in start script

# For claude scripts
# Replace hardcoded key with:
ANTHROPIC_AUTH_TOKEN=$(security find-generic-password -s "anthropic" -a "claude" -w 2>/dev/null)
```

---

### 1.2 Fix CORS in Chat Route

**File:** `app/api/xmad/chat/route.ts`
**Line:** 126

```typescript
// ❌ CURRENT (too permissive)
"Access-Control-Allow-Origin": "*"

// ✅ FIX
const allowedOrigins = [
  "http://localhost:3333",
  "http://127.0.0.1:3333",
  "https://your-app.vercel.app"
];
const origin = request.headers.get("origin") || "";
"Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
```

---

### 1.3 Fix Command Injection Risk in API Routes

**Files to fix:**

| File | Lines | Issue |
|------|-------|-------|
| `app/api/xmad/automations/[automationId]/run/route.ts` | 44-45 | `exec()` without timeout |
| `app/api/xmad/services/[serviceId]/stop/route.ts` | 31-32 | `exec()` without timeout |
| `app/api/xmad/services/[serviceId]/restart/route.ts` | 31-32 | `exec()` without timeout |

**Fix Pattern:**
```typescript
// ❌ CURRENT
const { exec } = require("child_process");
exec(command, (error: any, stdout: string, stderr: string) => { ... })

// ✅ FIX
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Add timeout and proper error handling
try {
  const { stdout } = await execAsync(command, {
    timeout: 30000,  // 30 second timeout
    cwd: process.env.HOME + "/xmad-control"
  });
  return NextResponse.json({ success: true, output: stdout });
} catch (error) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
```

---

## 🟠 CODE QUALITY FIXES

### 1.4 Fix Lint Errors (199 errors, 39 warnings)

**Run auto-fix first:**
```bash
cd ~/xmad-control
bun run fix
```

**Manual fixes needed:**

| File | Line | Issue | Fix |
|------|------|-------|-----|
| `surfaces/showcase.surface.tsx` | 193 | Array index as key | Use stable ID |
| `components/elevenlabs/live-waveform.tsx` | 107 | `catch (error: any)` | Use `error: unknown` |
| `types/react-katex.d.ts` | 2 | Missing `import type` | Add `type` keyword |

---

### 1.5 Fix Unused Variables in API Routes

**Files:**
- `app/api/xmad/automations/[automationId]/run/route.ts` - Lines 1, 4, 44, 45
- `app/api/xmad/services/[serviceId]/stop/route.ts` - Lines 1, 4, 32
- `app/api/xmad/services/[serviceId]/restart/route.ts` - Lines 1, 4, 32

**Fix Pattern:**
```typescript
// ❌ CURRENT
exec(command, (error: any, stdout: string, stderr: string) => { ... })

// ✅ FIX - Remove unused params or use underscore prefix
exec(command, (error) => { ... })
// Or if truly unused:
exec(command, (_error, _stdout, _stderr) => { ... })
```

---

## 🔧 INFRASTRUCTURE FIXES

### 1.6 Add Missing Middleware (Tailscale Guard)

**File to create:** `middleware.ts` (root)

```typescript
import { type NextRequest, NextResponse } from "next/server";

function isTailscaleOrLocal(ip: string): boolean {
  if (!ip) return false;
  if (["127.0.0.1", "::1", "localhost"].includes(ip)) return true;
  if (ip.startsWith("::ffff:127.")) return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;
  // Tailscale CGNAT range: 100.64.0.0/10
  return parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127;
}

export function middleware(req: NextRequest) {
  // Skip in development
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const ip = (
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    ""
  ).trim();

  if (!isTailscaleOrLocal(ip)) {
    return new NextResponse(
      JSON.stringify({
        error: "Access restricted to Tailscale network",
        hint: "Connect via Tailscale VPN"
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
};
```

---

### 1.7 Add .gitignore Entries

**File:** `.gitignore`

```gitignore
# Add these missing entries:

# Audio files (workspace media)
*.mp3
*.wav
*.ogg
*.m4a

# IDE files
.idea/
*.swp
*.swo

# Temp files
*.tmp
*.temp
memory-log.txt

# Build outputs
out/
dist/
```

---

### 1.8 Verify OpenClaw LaunchAgents

**Check status:**
```bash
launchctl list | grep openclaw
```

**If not loaded:**
```bash
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.watchdog.plist
```

**Verify health:**
```bash
curl http://127.0.0.1:18789/health
# Expected: {"ok":true,"status":"live"}
```

---

## 📋 PHASE 1 CHECKLIST

```
□ Remove hardcoded API key from openclaw/configs/auth-profiles.json
□ Remove hardcoded API keys from modules/claude/claude-direct
□ Remove hardcoded API keys from modules/claude/claude-zai
□ Fix CORS in app/api/xmad/chat/route.ts
□ Fix exec() timeout in app/api/xmad/automations/[automationId]/run/route.ts
□ Fix exec() timeout in app/api/xmad/services/[serviceId]/stop/route.ts
□ Fix exec() timeout in app/api/xmad/services/[serviceId]/restart/route.ts
□ Run bun run fix to auto-fix lint issues
□ Fix array index key in surfaces/showcase.surface.tsx
□ Fix any type in components/elevenlabs/live-waveform.tsx
□ Create middleware.ts with Tailscale guard
□ Add audio files to .gitignore
□ Verify OpenClaw LaunchAgents are loaded
□ Run bun run typecheck (must pass)
□ Run bun run lint (target: <10 errors)
```

---

## ✅ SUCCESS CRITERIA

| Check | Command |
|-------|---------|
| No TypeScript errors | `bun run typecheck` passes |
| Lint errors < 10 | `bun run lint` |
| No hardcoded secrets | `grep -r "apiKey\|ANTHROPIC_AUTH_TOKEN" --include="*.ts" --include="*.tsx" --include="*.json"` |
| OpenClaw healthy | `curl http://127.0.0.1:18789/health` |
| Middleware active | Access from non-Tailscale IP blocked in prod |

---

**After Phase 1 complete → Proceed to Phase 2 (UI/Dashboard)**
