/* ═══════════════════════════════════════════════════════════════════════════════
   SURFACE MANAGER - XMAD Dashboard
   Renders the active surface with lazy loading and suspense
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { SURFACE_REGISTRY } from "@/config/surfaces"
import type { SurfaceId } from "@/types/surface.types"
import { Suspense, lazy, useEffect, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

function GlassSkeleton() {
  return (
    <div className="space-y-4">
      {/* Row 1 skeleton */}
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 w-full rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
      {/* Row 2 skeleton */}
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 w-full rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
      {/* Row 3 skeleton */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CACHED SURFACE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Cache loaded components to avoid re-fetching
const componentCache = new Map<SurfaceId, React.ComponentType>()

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

interface SurfaceManagerProps {
  activeSurface: SurfaceId
}

export function SurfaceManager({ activeSurface }: SurfaceManagerProps) {
  const [SurfaceComponent, setSurfaceComponent] = useState<React.ComponentType | null>(
    componentCache.get(activeSurface) || null
  )

  useEffect(() => {
    // DEBUG: Log active surface
    console.log("[SurfaceManager] ACTIVE SURFACE:", activeSurface)

    // Check cache first
    if (componentCache.has(activeSurface)) {
      console.log("[SurfaceManager] Using cached component for:", activeSurface)
      setSurfaceComponent(() => componentCache.get(activeSurface)!)
      return
    }

    // Get surface definition and lazy load
    const surfaceDef = SURFACE_REGISTRY[activeSurface]
    console.log(
      "[SurfaceManager] Surface definition:",
      surfaceDef ? "found" : "NOT FOUND",
      "for",
      activeSurface
    )

    if (surfaceDef?.lazy) {
      surfaceDef
        .lazy()
        .then((mod) => {
          console.log(
            "[SurfaceManager] Loaded module for:",
            activeSurface,
            "default:",
            !!mod.default
          )
          const Component = mod.default
          componentCache.set(activeSurface, Component)
          setSurfaceComponent(() => Component)
        })
        .catch((err) => {
          console.error("[SurfaceManager] FAILED to load surface:", activeSurface, err)
        })
    }
  }, [activeSurface])

  if (!SurfaceComponent) {
    return <GlassSkeleton />
  }

  return (
    <Suspense fallback={<GlassSkeleton />}>
      <SurfaceComponent />
    </Suspense>
  )
}

export default SurfaceManager
