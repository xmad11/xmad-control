import { PageLoadingFallback } from "@/components/layout"
import AdminDashboard from "@/features/dashboard/AdminDashboard"
import { Suspense } from "react"

export const metadata = {
  title: "Admin Dashboard - Shadi V2",
  description: "Platform administration and management",
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  )
}
