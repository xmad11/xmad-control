/* ═══════════════════════════════════════════════════════════════════════════════
   SCREEN SURFACE - XMAD Control Dashboard
   VNC screen placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Monitor } from "lucide-react"

export function ScreenSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <Monitor className="h-16 w-16 text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Screen</h2>
      <p className="text-white/60">VNC screen will be implemented here</p>
    </div>
  )
}

export default ScreenSurface
