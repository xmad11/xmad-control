# XMAD Control — UI Architecture (SSOT)

> **Last Updated:** 2026-03-15

---

## Production Source

| Component | Location | Status |
|-----------|----------|--------|
| **Dashboard** | `app/dashboard/` | ✅ PRODUCTION |
| **Home** | `app/page.tsx` → `features/home/` | ✅ PRODUCTION |
| **Legacy** | `docs/archive/ui-legacy/features/control-center/` | 📦 Archived |

---

## Component Hierarchy

```
components/
├── ui/           # Atomic primitives (Button, Card, Badge, Skeleton)
├── layout/       # Page structure (Header, Footer, Navigation)
├── dashboard/    # Dashboard-specific components
├── card/         # Card system (use BaseCard as base)
├── tabs/         # StickyTabs (single source)
├── ui/charts/    # Chart components (LineChart, BarChart, PieChart)
└── marquee/      # Marquee/card carousel components
```

### Design Rules

1. **BaseCard is the base** — All card variants extend `components/card/BaseCard.tsx`
2. **StickyTabs is the tab system** — Single source in `components/tabs/StickyTabs.tsx`
3. **No inline styles** — Use Tailwind utilities with design tokens
4. **No hardcoded spacing** — Use CSS variables from `styles/tokens.css`

---

## State Management

| Context | Location |
|---------|----------|
| Theme | `context/ThemeContext.tsx` |
| Language | `context/LanguageContext.tsx` |

**Rules:**
- No duplicate context providers
- Keep contexts minimal and focused
- Use React hooks for state access

---

## Performance Rules

| Rule | Value | Reason |
|------|-------|--------|
| SSE polling interval | 6000ms min | Reduce server load |
| Dashboard deployment | Vercel (cloud) | ~400MB RAM saved locally |
| Heavy charts on mobile | ❌ Disabled | Performance |
| Animations when load > 2.2 | ❌ Disabled | Machine protection |

---

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  iPhone/Browser │────▶│ Vercel Dashboard│────▶│   Tailscale     │
└─────────────────┘     └─────────────────┘     │     Tunnel      │
                                                └────────┬────────┘
                                                         │
                        ┌────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │       Mac mini Local        │
         │  ┌─────────────────────┐    │
         │  │ API Gateway :9870   │    │
         │  └─────────────────────┘    │
         │  ┌─────────────────────┐    │
         │  │ OpenClaw :18789     │    │
         │  └─────────────────────┘    │
         │  ┌─────────────────────┐    │
         │  │ Guardian Watchdog   │    │
         │  └─────────────────────┘    │
         └─────────────────────────────┘
```

---

## Machine Profile (Mac mini 2014)

See `config/machine-profile.json` for full thresholds.

| Threshold | Value | Action |
|-----------|-------|--------|
| RAM Guard | 60% | Reduce polling |
| RAM Critical | 70% | Restart gateway |
| RAM Emergency | 78% | Kill AI children |
| Load Throttle | 2.2 | Throttle AI |
| Load Cooldown | 2.8 | Pause automation |

---

## File Structure

```
app/
├── dashboard/           # Main dashboard (Next.js App Router)
│   ├── page.tsx         # Overview tab
│   ├── layout.tsx       # Dashboard layout
│   ├── automation/      # Automation tab
│   ├── backups/         # Backups tab
│   ├── memory/          # Memory tab
│   ├── screen/          # Screen tab
│   └── settings/        # Settings tab
├── page.tsx             # Home page
└── layout.tsx           # Root layout

features/
└── home/                # Home page components
    ├── HomeClient.tsx
    ├── HomeSkeleton.tsx
    ├── hero/
    └── sections/
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/dashboard/layout.tsx` | Dashboard shell with bottom nav |
| `components/dashboard/TabContentWrapper.tsx` | Tab content wrapper with consistent spacing |
| `components/tabs/StickyTabs.tsx` | Tab navigation component |
| `styles/globals.css` | Global styles + Tailwind |
| `styles/tokens.css` | Design tokens (colors, spacing) |

---

## Migration Notes

- `features/control-center/` → Archived to `docs/archive/ui-legacy/`
- All dashboard code now in `app/dashboard/`
- Next.js runs on Vercel, not locally
- Local machine only runs: API (9870), OpenClaw (18789), Guardian

---

**End of Document**
