/* ═══════════════════════════════════════════════════════════════════════════════
   SETTINGS SURFACE - XMAD Control Dashboard
   Settings placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Settings } from "lucide-react"

export function SettingsSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <Settings className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Settings</h2>
      <p className="text-white/60">Settings will be implemented here</p>
    </div>
  )
}

export default SettingsSurface
