# Phase 2: Dashboard UI & Screens

> **Priority:** HIGH - User-Facing Features
> **Owner:** Ahmad (Manual Implementation)
> **Dependencies:** Phase 1 complete

---

## 📊 CURRENT STATE

### Architecture
- **Main Entry:** `features/home/HomeClient.tsx`
- **Surface System:** `runtime/SurfaceManager.tsx` + `runtime/useSurfaceController.ts`
- **Tab Navigation:** GlassTabs with 5 tabs
- **AI Chat:** AiChatSheet (bottom sheet)

### Current Tabs
| Tab | Surface File | Status |
|-----|--------------|--------|
| Overview | `surfaces/overview.surface.tsx` | ✅ COMPLETE |
| Memory | `surfaces/memory.surface.tsx` | ⚠️ PLACEHOLDER |
| Automation | `surfaces/automation.surface.tsx` | ⚠️ PLACEHOLDER |
| Screen | `surfaces/screen.surface.tsx` | ⚠️ PLACEHOLDER |
| Backups | `surfaces/backups.surface.tsx` | ⚠️ PLACEHOLDER |

### Hidden Surfaces (Not in Tab Bar)
| Surface | File | Status | Access |
|---------|------|--------|--------|
| Settings | `surfaces/settings.surface.tsx` | ⚠️ PLACEHOLDER | Side Menu |
| Chat | `surfaces/chat.surface.tsx` | ⚠️ PLACEHOLDER | Sheet |
| Terminal | `surfaces/terminal.surface.tsx` | ⚠️ PLACEHOLDER | ? |
| Showcase | `surfaces/showcase.surface.tsx` | ✅ COMPLETE | Dev only |

---

## 🎯 PHASE 2 TASKS

### 2.1 Memory Surface (Brain Editor)

**File:** `surfaces/memory.surface.tsx`

**Required Features:**
- [ ] File selector dropdown (SOUL.md, MEMORY.md, IDENTITY.md)
- [ ] Text editor with syntax highlighting
- [ ] Save/Cancel buttons
- [ ] Word/character count
- [ ] Keyboard shortcuts (Cmd+S)
- [ ] Loading states

**Existing Components to Use:**
- `components/memory/MemoryEditor.tsx` (already implemented)
- `components/glass/glass-card.tsx`
- `components/glass/glass-button.tsx`

**API Endpoints:**
- GET `/api/xmad/memory?file=SOUL.md` - Load file
- PUT `/api/xmad/memory?file=SOUL.md` - Save file

**Security:** Use allowlist from `types/xmad.ts`:
```typescript
export const ALLOWED_MEMORY_PATHS = [
  "/Users/ahmadabdullah/xmad-control/openclaw/workspace/SOUL.md",
  "/Users/ahmadabdullah/xmad-control/openclaw/workspace/MEMORY.md",
  "/Users/ahmadabdullah/xmad-control/openclaw/workspace/IDENTITY.md",
] as const;
```

---

### 2.2 Automation Surface (Task Queue)

**File:** `surfaces/automation.surface.tsx`

**Required Features:**
- [ ] Job queue list with status
- [ ] Priority indicators (low/normal/high/critical)
- [ ] Run/Cancel/Retry buttons
- [ ] Progress bars for running jobs
- [ ] Filter by status (queued/running/done/failed)

**Data Structure:**
```typescript
interface AutomationJob {
  id: string;
  task: string;
  status: "queued" | "running" | "done" | "failed" | "paused";
  priority: "low" | "normal" | "high" | "critical";
  created: string;
  started?: string;
  finished?: string;
  result?: string;
  error?: string;
}
```

**API Endpoints:**
- GET `/api/xmad/automations` - List jobs
- POST `/api/xmad/automations` - Create job
- POST `/api/xmad/automations/[id]/run` - Execute job
- DELETE `/api/xmad/automations/[id]` - Cancel job

**Existing Components to Use:**
- `components/glass/glass-card.tsx`
- `components/glass/glass-badge.tsx`
- `components/glass/glass-progress.tsx`

---

### 2.3 Screen Surface (VNC Viewer)

**File:** `surfaces/screen.surface.tsx`

**Required Features:**
- [ ] noVNC iframe embed
- [ ] Connection status indicator
- [ ] Fullscreen toggle
- [ ] Resolution selector
- [ ] Clipboard sync button

**VNC Connection:**
- Host: localhost or Tailscale IP
- Port: 5900 (VNC) or 6080 (noVNC websocket)

**Layout:** `fullscreen` (z-index 50)

**Implementation:**
```typescript
export function ScreenSurface() {
  return (
    <div className="h-full w-full relative">
      <iframe
        src="http://localhost:6080/vnc.html"
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
```

---

### 2.4 Backups Surface (Backup Manager)

**File:** `surfaces/backups.surface.tsx`

**Required Features:**
- [ ] Backup list with size/date
- [ ] Create backup button
- [ ] Restore button (with confirmation)
- [ ] Delete backup button
- [ ] Auto-backup schedule toggle
- [ ] Storage location display

**Data Structure:**
```typescript
interface Backup {
  id: string;
  name: string;
  sizeMB: number;
  created: string;
  includes: string[];
  note?: string;
}
```

**API Endpoints:**
- GET `/api/xmad/backups` - List backups
- POST `/api/xmad/backups` - Create backup
- POST `/api/xmad/backups/[id]/restore` - Restore
- DELETE `/api/xmad/backups/[id]` - Delete

**Shell Script:** `scripts/backup.sh` (exists)

---

### 2.5 Settings Surface (Side Menu)

**File:** `surfaces/settings.surface.tsx`

**Required Features:**
- [ ] System configuration
- [ ] API key management (show/hide)
- [ ] Service toggles
- [ ] Theme selector
- [ ] Notification preferences
- [ ] Export/Import config

**Sections:**
1. **General** - App preferences
2. **Security** - API keys, Tailscale status
3. **Services** - OpenClaw, Guardian, API
4. **Storage** - Backup location, cleanup
5. **About** - Version, credits

**Access:** Side menu (not tab bar)

---

### 2.6 Side Menu Implementation

**New Component:** `components/layout/SideMenu.tsx`

**Features:**
- [ ] Slide-in from left
- [ ] Menu items: Settings, About, Help
- [ ] Version display at bottom
- [ ] Close on outside click
- [ ] Keyboard shortcut (Cmd+,)

**Integration:**
```typescript
// In HomeClient.tsx
const [sideMenuOpen, setSideMenuOpen] = useState(false);

// Trigger button in header or gesture
<IconButton onClick={() => setSideMenuOpen(true)}>
  <MenuIcon />
</IconButton>

// Side menu component
<SideMenu open={sideMenuOpen} onClose={() => setSideMenuOpen(false)}>
  <MenuItem href="/settings">Settings</MenuItem>
  <MenuItem href="/about">About</MenuItem>
</SideMenu>
```

---

### 2.7 Terminal Surface (Optional)

**File:** `surfaces/terminal.surface.tsx`

**Required Features:**
- [ ] xterm.js terminal emulator
- [ ] WebSocket connection to backend
- [ ] Command history
- [ ] Copy/paste support
- [ ] Color themes

**Dependencies:**
```bash
bun add xterm @xterm/addon-fit
```

**Layout:** `fullscreen` (z-index 50)

---

## 🎨 COMPONENTS TO BUILD

### StatsCard Widget (for other surfaces)

**File:** `components/widgets/StatsCard.tsx`

```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}
```

### StatusBadge Component (for services)

**File:** `components/ui/StatusBadge.tsx`

```typescript
type ServiceHealth = "online" | "offline" | "degraded" | "unknown";

interface StatusBadgeProps {
  status: ServiceHealth;
  label?: string;
}
```

### ServiceCard Component

**File:** `components/dashboard/ServiceCard.tsx`

```typescript
interface ServiceCardProps {
  name: string;
  status: ServiceHealth;
  port?: number;
  memoryMB?: number;
  onAction?: (action: "start" | "stop" | "restart") => void;
}
```

---

## 📋 PHASE 2 CHECKLIST

```
Memory Surface:
  □ Implement file selector
  □ Add text editor with save
  □ Connect to API endpoints
  □ Add keyboard shortcuts

Automation Surface:
  □ Create job queue UI
  □ Add priority badges
  □ Implement run/cancel buttons
  □ Add status filters

Screen Surface:
  □ Embed noVNC iframe
  □ Add connection status
  □ Implement fullscreen toggle

Backups Surface:
  □ List existing backups
  □ Add create backup button
  □ Add restore with confirmation
  □ Add delete with confirmation

Settings Surface:
  □ Create settings sections
  □ Add theme selector
  □ Add API key management
  □ Add service toggles

Side Menu:
  □ Create SideMenu component
  □ Add slide-in animation
  □ Add menu items
  □ Add keyboard shortcut

Optional:
  □ Terminal surface with xterm.js
```

---

## 🔗 API ENDPOINTS NEEDED

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/xmad/memory` | GET/PUT | Memory file operations |
| `/api/xmad/automations` | GET/POST/DELETE | Job queue management |
| `/api/xmad/backups` | GET/POST/DELETE | Backup management |
| `/api/xmad/backups/[id]/restore` | POST | Restore backup |

---

## ✅ SUCCESS CRITERIA

| Check | Verification |
|-------|--------------|
| All 5 tabs functional | Click each tab, see real content |
| Memory editor saves | Edit SOUL.md, verify saved |
| Automation runs | Queue job, see status update |
| Screen shows VNC | See desktop in iframe |
| Backups create | Click create, see new backup |
| Settings accessible | Open side menu, see settings |

---

**After Phase 2 complete → Proceed to Phase 3 (Non-UI Remaining)**
