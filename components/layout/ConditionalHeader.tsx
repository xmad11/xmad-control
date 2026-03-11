/* ═══════════════════════════════════════════════════════════════════════════════
   CONDITIONAL HEADER - Now shows unified header everywhere
   Homepage: with theme toggle
   Other pages: with back button
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { usePathname } from "next/navigation"
import { AppHeader } from "./Header"

export function ConditionalHeader() {
  return <AppHeader />
}
