/* ═══════════════════════════════════════════════════════════════════════════════
   MEMORY SURFACE - XMAD Control Dashboard
   Memory editor placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Brain } from "lucide-react"

export function MemorySurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <Brain className="h-16 w-16 text-green-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Memory</h2>
      <p className="text-white/60">Memory editor will be implemented here</p>
    </div>
  )
}

export default MemorySurface
