/* ═══════════════════════════════════════════════════════════════════════════════
   AUTH LAYOUT - Layout for authentication pages with metadata
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Shadi Shawqi",
  description:
    "Sign in to access your saved restaurants, favorites, and personalized dining recommendations on Shadi Shawqi's UAE restaurant platform.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
