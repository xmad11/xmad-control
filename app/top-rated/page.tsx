/* ═══════════════════════════════════════════════════════════════════════════════
   TOP RATED PAGE - Redirect to canonical /restaurants?filter=top-rated
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TopRatedPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/restaurants?filter=top-rated")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[var(--fg-60)]">Redirecting to restaurants...</p>
    </div>
  )
}
