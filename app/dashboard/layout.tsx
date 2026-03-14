/**
 * Dashboard Layout
 * Only renders child page (navigation moved inside page)
 */

import { ReactNode } from "react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
