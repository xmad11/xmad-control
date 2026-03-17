# Master Plan: xmad-control Implementation Roadmap

> **Generated:** 2026-03-17
> **Based on:** Deep codebase audit of actual implementation state

---

## 📊 AUDIT SUMMARY

### Implementation Status by Plan

| Source Plan | Planned Items | Implemented | Gap |
|-------------|---------------|-------------|-----|
| Agent 1 (Runtime) | 5 tasks | 4 | 20% |
| Agent 2 (Frontend) | 6 tasks | 2.5 | 58% |
| Implementation Plan | 27 files | 5 | 81% |
| **OVERALL** | **38 items** | **11.5** | **70%** |

### Critical Findings

| Severity | Count | Examples |
|----------|-------|----------|
| 🔴 Critical | 4 | Hardcoded API keys, CORS *, exec() no timeout |
| 🟠 High | 5 | Lint errors (199), missing middleware, swap detection broken |
| 🟡 Medium | 8 | Missing docs structure, archive needed, gitignore gaps |

---

## 🗺️ 3-PHASE ROADMAP

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: CRITICAL FIXES (ASAP)                                 │
│  ═════════════════════════════                                  │
│  • Remove hardcoded API keys (3 locations)                      │
│  • Fix CORS in chat route                                       │
│  • Add exec() timeouts (3 routes)                               │
│  • Create middleware.ts (Tailscale guard)                       │
│  • Fix lint errors (auto-fix + manual)                          │
│  • Add .gitignore entries                                       │
│                                                                 │
│  Time: 2-3 hours | Owner: AI Agent                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: DASHBOARD UI                                          │
│  ═══════════════════════                                        │
│  • Memory Surface (editor for SOUL.md, etc.)                    │
│  • Automation Surface (job queue)                               │
│  • Screen Surface (VNC viewer)                                  │
│  • Backups Surface (backup manager)                             │
│  • Settings Surface (side menu)                                 │
│  • Side Menu component                                          │
│                                                                 │
│  Time: 1-2 days | Owner: Ahmad (Manual)                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: NON-UI REMAINING                                      │
│  ═════════════════════════                                      │
│  • Documentation governance (architecture/, operations/, etc.)  │
│  • Archive legacy code (features/control-center/)               │
│  • Scripts organization (README.md)                             │
│  • System script fixes (swap detection, load monitoring)        │
│  • Config path fix (~/.zshrc)                                   │
│                                                                 │
│  Time: 4-6 hours | Owner: AI Agent                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 DETAILED PLAN FILES

| Phase | File | Priority |
|-------|------|----------|
| Phase 1 | [PHASE_1_CRITICAL_FIXES.md](./PHASE_1_CRITICAL_FIXES.md) | 🔴 ASAP |
| Phase 2 | [PHASE_2_DASHBOARD_UI.md](./PHASE_2_DASHBOARD_UI.md) | 🟠 HIGH |
| Phase 3 | [PHASE_3_NON_UI_REMAINING.md](./PHASE_3_NON_UI_REMAINING.md) | 🟡 MEDIUM |

---

## 🔴 PHASE 1: CRITICAL FIXES (Start Now)

### Security Fixes
- [ ] Remove API key from `openclaw/configs/auth-profiles.json`
- [ ] Remove API keys from `modules/claude/claude-direct`
- [ ] Remove API keys from `modules/claude/claude-zai`
- [ ] Fix CORS in `app/api/xmad/chat/route.ts`
- [ ] Add exec() timeouts in 3 API routes

### Infrastructure
- [ ] Create `middleware.ts` with Tailscale guard
- [ ] Add `*.mp3`, `*.wav` to `.gitignore`
- [ ] Run `bun run fix` for lint auto-fix
- [ ] Verify OpenClaw LaunchAgents loaded

### Verification
```bash
bun run typecheck  # Must pass
bun run lint       # Target: <10 errors
curl http://127.0.0.1:18789/health  # Must return {"ok":true}
```

---

## 🟠 PHASE 2: DASHBOARD UI (After Phase 1)

### Current State
```
HomeClient.tsx (main entry)
├── GlassTabs (5 tabs)
│   ├── Overview ✅ COMPLETE
│   ├── Memory   ⚠️ PLACEHOLDER
│   ├── Automation ⚠️ PLACEHOLDER
│   ├── Screen   ⚠️ PLACEHOLDER
│   └── Backups  ⚠️ PLACEHOLDER
├── AiChatSheet ✅ COMPLETE
└── Side Menu (needs implementation)
```

### Tasks
- [ ] Memory Surface - Brain file editor
- [ ] Automation Surface - Job queue UI
- [ ] Screen Surface - VNC viewer
- [ ] Backups Surface - Backup manager
- [ ] Settings Surface - Configuration
- [ ] Side Menu component

### Existing Components to Use
- `components/memory/MemoryEditor.tsx` ✅
- `components/chat/ChatInterface.tsx` ✅
- `components/glass/*` (25 components) ✅
- `lib/sse-client.ts` ✅

---

## 🟡 PHASE 3: NON-UI REMAINING (After Phase 2)

### Documentation Governance
```
docs/
├── architecture/  ← CREATE
├── operations/    ← CREATE
├── security/      ← CREATE
└── archive/       ← CREATE
    ├── progress-logs/
    ├── ui-legacy/
    └── runtime-legacy/
```

### Archive Operations
- [ ] Archive `features/control-center/` → `docs/archive/ui-legacy/`
- [ ] Create `scripts/README.md`

### System Fixes
- [ ] Fix swap detection in `system-resource-bridge.sh`
- [ ] Add load monitoring function
- [ ] Fix `OPENCLAW_CONFIG` in `~/.zshrc`

---

## 🎯 SUCCESS METRICS

### After Phase 1
| Metric | Target |
|--------|--------|
| Hardcoded secrets | 0 |
| TypeScript errors | 0 |
| Lint errors | <10 |
| OpenClaw health | `{"ok":true}` |

### After Phase 2
| Metric | Target |
|--------|--------|
| Working tabs | 5/5 |
| Surfaces complete | 7/7 |
| Side menu | Functional |

### After Phase 3
| Metric | Target |
|--------|--------|
| Docs organized | 3 new dirs |
| Legacy archived | 100% |
| System scripts | Bugs fixed |

---

## 📁 RELATED FILES

### Audit Sources
- `final-plan.md` - Original 3-plan audit findings
- `docs/audit/` - Individual audit reports

### Configuration
- `config/surfaces.ts` - Surface registry
- `CLAUDE.md` - Agent instructions

### Plans
- `docs/plans/AGENT_1_PROMPT.md` - Runtime plan
- `docs/plans/AGENT_2_PROMPT.md` - Frontend plan
- `docs/plans/CONSOLIDATED_PLAN.md` - Status tracking
- `docs/plans/IMPLEMENTATION_PLAN.md` - Dashboard spec

---

## 🚀 NEXT STEP

**Start Phase 1 now:**
```bash
# Read the detailed plan
cat ~/xmad-control/docs/plans/PHASE_1_CRITICAL_FIXES.md

# Begin with security fixes (most critical)
# Remove hardcoded API keys first
```

---

*Last Updated: 2026-03-17*
