/* ═══════════════════════════════════════════════════════════════════════════════
   BACKUPS SURFACE - XMAD Control Dashboard
   Backup management placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { HardDrive } from "lucide-react"

export function BackupsSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <HardDrive className="h-16 w-16 text-blue-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Backups</h2>
      <p className="text-white/60">Backup management will be implemented here</p>
    </div>
  )
}

export default BackupsSurface
