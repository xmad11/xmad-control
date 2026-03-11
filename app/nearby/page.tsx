/* ═══════════════════════════════════════════════════════════════════════════════
   NEARBY PAGE - Redirect to canonical /restaurants?filter=near-me
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NearbyPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/restaurants?filter=near-me")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[var(--fg-60)]">Redirecting to restaurants...</p>
    </div>
  )
}
