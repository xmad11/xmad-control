/* ═══════════════════════════════════════════════════════════════════════════════
   AUTOMATION SURFACE - XMAD Control Dashboard
   Automation tasks placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Zap } from "lucide-react"

export function AutomationSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <Zap className="h-16 w-16 text-orange-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Automation</h2>
      <p className="text-white/60">Automation tasks will be implemented here</p>
    </div>
  )
}

export default AutomationSurface
