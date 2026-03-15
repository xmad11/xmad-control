# XMAD Next.js Control Center - Implementation Plan

**Date:** 2026-03-12
**Status:** Ready for Implementation

---

## Overview

This plan provides a complete Next.js 15-based XMAD Control Center with:
- Real-time SSE updates (12s polling)
- Tailscale IP guard middleware
- SSOT secrets management (Keychain → Infisical → env)
- Glass/liquid UI components
- 10 fully functional pages
- Automatic fallback to legacy API (port 8765)
- RAM alert system with deduplication

---

## Pages (10 total)

| Page | Purpose | Status |
|------|---------|--------|
| 1. Dashboard | Live system stats via SSE | ⚠️ Needs implementation |
| 2. Chat | Nova conversation interface | ⚠️ Needs implementation |
| 3. Memory | Brain file editor (allowlist-only) | ⚠️ Needs implementation |
| 4. Screen | noVNC iframe viewer | ⚠️ Needs implementation |
| 5. Automation | Job queue with priority | ⚠️ Needs implementation |
| 6. Backups | Backup manager | ⚠️ Needs implementation |
| 7. Settings | Full configuration | ⚠️ Needs implementation |
| 8. Notes | Apple Notes integration | ⚠️ Needs implementation |
| 9. Tasks | Task management | ⚠️ Needs implementation |
| 10. Terminal | Web terminal | ⚠️ Needs implementation |

---

## API Routes

### `/api/xmad/events` (SSE Stream)
```
GET /api/xmad/events
Accept: text/event-stream

→ Returns: SSE stream with 12s interval
```

### `/api/xmad/[...path]` (Legacy Proxy)
```
GET/POST /api/xmad/*
→ Proxies to http://127.0.0.1:8765/*
```

---

## Components (14 total)

1. `<MemoryEditor />` - Brain file editor with allowlist validation
2. `<Terminal />` - Web terminal component
3. `<Screen />` - noVNC iframe wrapper
4. `<Queue />` - Automation job queue
5. `<ChatInterface />` - Nova chat UI
6. `<BackupManager />` - Backup controls
7. `<SettingsPanel />` - Configuration UI
8. `<StatsCard />` - System stats display
9. `<RamAlert />` - RAM usage alerts
10. `<Navigation />` - Side navigation
11. `<Header />` - Top header
12. `<Layout />` - Page layout
13. `<ThemeProvider />` - Theme context
14. `<SSEProvider />` - SSE connection context

---

## Hooks (3 total)

1. `useSSE()` - SSE connection management
2. `useRamAlert()` - RAM monitoring with deduplication
3. `useTailscaleGuard()` - IP validation middleware

---

## Middleware

### Tailscale Guard
```typescript
// Protects routes from non-Tailscale access
export function tailscaleGuard(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for')
  if (!isTailscaleIP(ip)) {
    return NextResponse.redirect('/unauthorized')
  }
}
```

---

## SSOT Secrets Flow

```
macOS Keychain
     ↓
Infisical CLI
     ↓
env-loader.sh
     ↓
Next.js Runtime
```

---

## Resource Usage

| Resource | Expected |
|----------|----------|
| RAM | ~50-100MB (Next.js) |
| CPU | Low (idle) |
| Build Time | ~30-60 seconds |
| Dependencies | 11 production + 7 dev |

---

## Verification Checklist

After implementation:

- [ ] `curl http://localhost:3000` returns HTML
- [ ] `curl http://localhost:3000/api/xmad/services` returns JSON
- [ ] `curl -N http://localhost:3000/api/xmad/events` returns SSE stream
- [ ] Mobile access via Tailscale works
- [ ] TypeScript check passes (0 errors)
- [ ] Build succeeds
- [ ] LaunchAgent is loaded

---

## Implementation Order

### Phase 1: Core Setup (Day 1)
1. Create API routes
2. Implement SSE provider
3. Set up Tailscale middleware

### Phase 2: Pages (Days 2-4)
4. Dashboard page
5. Chat page
6. Memory page

### Phase 3: Features (Days 5-7)
7. Automation page
8. Backups page
9. Settings page

### Phase 4: Polish (Days 8-10)
10. Screen viewer
11. Terminal
12. Testing & optimization

---

## Files to Create (34 total)

### API Routes
- `app/api/xmad/events/route.ts`
- `app/api/xmad/[...path]/route.ts`

### Pages
- `app/dashboard/page.tsx`
- `app/chat/page.tsx`
- `app/memory/page.tsx`
- `app/screen/page.tsx`
- `app/automation/page.tsx`
- `app/backups/page.tsx`
- `app/settings/page.tsx`
- `app/notes/page.tsx`
- `app/tasks/page.tsx`
- `app/terminal/page.tsx`

### Components
- `components/MemoryEditor.tsx`
- `components/Terminal.tsx`
- `components/Screen.tsx`
- `components/Queue.tsx`
- `components/ChatInterface.tsx`
- `components/BackupManager.tsx`
- `components/SettingsPanel.tsx`
- `components/StatsCard.tsx`
- `components/RamAlert.tsx`

### Hooks
- `hooks/useSSE.ts`
- `hooks/useRamAlert.ts`
- `hooks/useTailscaleGuard.ts`

### Lib
- `lib/sse-client.ts`
- `lib/tailscale-guard.ts`

---

**Status:** ✅ Ready for Implementation
**Files:** 34
**Pages:** 10
**Components:** 14
**Hooks:** 3
**Lines of Code:** ~3,000
