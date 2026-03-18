/* ═══════════════════════════════════════════════════════════════════════════════
   CONDITIONAL HEADER - Skips home page (has its own header in HomeClient)
   Other pages: shows AppHeader with back button
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { usePathname } from "next/navigation"
import { AppHeader } from "./Header"

export function ConditionalHeader() {
  const pathname = usePathname()

  // Home page has its own header in HomeClient.tsx
  if (pathname === "/") {
    return null
  }

  return <AppHeader />
}
