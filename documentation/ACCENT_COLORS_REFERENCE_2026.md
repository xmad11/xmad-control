# Accent Colors Reference - 2026 Palette

> **Date Archived:** 2026-01-07
> **Status:** FOR REFERENCE ONLY - NOT IMPLEMENTED
> **Purpose:** Save experimental accent colors for potential future use

---

## 🎨 2025-2026 Trendy Color Palette (OKLCH Format)

These colors were designed as a modern, vibrant alternative to the original restaurant-themed palette. They are **NOT currently implemented** in the application but are preserved here for reference.

---

## Color Definitions

| Name | OKLCH Value | Description |
|------|-------------|-------------|
| **Coral** | `oklch(0.65 0.20 25.0)` | Warm, vibrant pink-orange - energetic and inviting |
| **Azure** | `oklch(0.60 0.15 250.0)` | Clear sky blue - calm and professional |
| **Emerald** | `oklch(0.62 0.16 155.0)` | Rich green - fresh and organic |
| **Violet** | `oklch(0.55 0.20 300.0)` | Deep purple - creative and sophisticated |
| **Amber** | `oklch(0.70 0.15 75.0)` | Golden yellow - warm and energetic |
| **Sapphire** | `oklch(0.50 0.18 265.0)` | Deep blue - premium and trustworthy |
| **Mint** | `oklch(0.72 0.12 170.0)` | Soft green - clean and refreshing |
| **Rose** | `oklch(0.60 0.18 350.0)` | Soft pink - romantic and sweet |
| **Tangerine** | `oklch(0.68 0.18 45.0)` | Bright orange - playful and vibrant |
| **Fuchsia** | `oklch(0.58 0.22 340.0)` | Deep magenta - bold and dramatic |

---

## TypeScript Interface

```typescript
export type AccentColorName =
  | "coral"
  | "azure"
  | "emerald"
  | "violet"
  | "amber"
  | "sapphire"
  | "mint"
  | "rose"
  | "tangerine"
  | "fuchsia";

export const ACCENT_COLORS_2026: Record<AccentColorName, { oklch: string; label: string }> = {
  coral: { oklch: "oklch(0.65 0.20 25.0)", label: "Coral" },
  azure: { oklch: "oklch(0.60 0.15 250.0)", label: "Azure" },
  emerald: { oklch: "oklch(0.62 0.16 155.0)", label: "Emerald" },
  violet: { oklch: "oklch(0.55 0.20 300.0)", label: "Violet" },
  amber: { oklch: "oklch(0.70 0.15 75.0)", label: "Amber" },
  sapphire: { oklch: "oklch(0.50 0.18 265.0)", label: "Sapphire" },
  mint: { oklch: "oklch(0.72 0.12 170.0)", label: "Mint" },
  rose: { oklch: "oklch(0.60 0.18 350.0)", label: "Rose" },
  tangerine: { oklch: "oklch(0.68 0.18 45.0)", label: "Tangerine" },
  fuchsia: { oklch: "oklch(0.58 0.22 340.0)", label: "Fuchsia" },
};
```

---

## CSS Tokens (for future use)

```css
/* 2026 Accent Colors - NOT CURRENTLY IN USE */
:root {
  --color-accent-coral: oklch(0.65 0.20 25.0);
  --color-accent-azure: oklch(0.60 0.15 250.0);
  --color-accent-emerald: oklch(0.62 0.16 155.0);
  --color-accent-violet: oklch(0.55 0.20 300.0);
  --color-accent-amber: oklch(0.70 0.15 75.0);
  --color-accent-sapphire: oklch(0.50 0.18 265.0);
  --color-accent-mint: oklch(0.72 0.12 170.0);
  --color-accent-rose: oklch(0.60 0.18 350.0);
  --color-accent-tangerine: oklch(0.68 0.18 45.0);
  --color-accent-fuchsia: oklch(0.58 0.22 340.0);
}
```

---

## Notes

- These colors were designed to be more vibrant and modern than the original palette
- All colors use OKLCH format for perceptual uniformity
- Colors work across all three theme modes (light, warm, dark)
- Default would have been `coral` instead of `rust`

---

## Current Active Palette

The application currently uses the **original restaurant-themed palette**:
- Rust, Sage, Teal, Berry, Honey
- Lavender, Indigo, Mint, Turquoise, Lime

---

**Document Version:** 1.0
**Archived by:** Claude Code
**Reason:** Theme changes were experimental; saved for future reference only
