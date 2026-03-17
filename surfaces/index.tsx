/* ═══════════════════════════════════════════════════════════════════════════════
   SURFACES INDEX - XMAD Control Dashboard
   Central export for all surface components with error boundaries
   ═══════════════════════════════════════════════════════════════════════════════ */

import { SurfaceErrorBoundary } from "@/components/error-boundary"
import { lazy, Suspense } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED SURFACES
// ═══════════════════════════════════════════════════════════════════════════════

const OverviewSurfaceLazy = lazy(() => import("./overview.surface"))
const MemorySurfaceLazy = lazy(() => import("./memory.surface"))
const AutomationSurfaceLazy = lazy(() => import("./automation.surface"))
const ScreenSurfaceLazy = lazy(() => import("./screen.surface"))
const BackupsSurfaceLazy = lazy(() => import("./backups.surface"))
const SettingsSurfaceLazy = lazy(() => import("./settings.surface"))
const TerminalSurfaceLazy = lazy(() => import("./terminal.surface"))
const ChatSurfaceLazy = lazy(() => import("./chat.surface"))
const ShowcaseSurfaceLazy = lazy(() => import("./showcase.surface"))

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

function SurfaceLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPED SURFACE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function OverviewSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="overview">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <OverviewSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function MemorySurface() {
  return (
    <SurfaceErrorBoundary surfaceId="memory">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <MemorySurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function AutomationSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="automation">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <AutomationSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function ScreenSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="screen">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <ScreenSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function BackupsSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="backups">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <BackupsSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function SettingsSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="settings">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <SettingsSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function TerminalSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="terminal">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <TerminalSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function ChatSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="chat">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <ChatSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

export function ShowcaseSurface() {
  return (
    <SurfaceErrorBoundary surfaceId="showcase">
      <Suspense fallback={<SurfaceLoadingFallback />}>
        <ShowcaseSurfaceLazy />
      </Suspense>
    </SurfaceErrorBoundary>
  )
}

// Re-export types
export type { default as OverviewSurfaceType } from "./overview.surface"
export type { default as MemorySurfaceType } from "./memory.surface"
export type { default as AutomationSurfaceType } from "./automation.surface"
export type { default as ScreenSurfaceType } from "./screen.surface"
export type { default as BackupsSurfaceType } from "./backups.surface"
export type { default as SettingsSurfaceType } from "./settings.surface"
