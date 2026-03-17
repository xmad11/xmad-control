/* ═══════════════════════════════════════════════════════════════════════════════
   TERMINAL SURFACE - XMAD Control Dashboard
   Terminal interface placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Terminal } from "lucide-react"

export function TerminalSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <Terminal className="h-16 w-16 text-green-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Terminal</h2>
      <p className="text-white/60">Terminal interface will be implemented here</p>
    </div>
  )
}

export default TerminalSurface
