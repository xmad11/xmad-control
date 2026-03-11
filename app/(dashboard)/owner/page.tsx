import { PageLoadingFallback } from "@/components/layout"
import OwnerDashboard from "@/features/dashboard/OwnerDashboard"
import { Suspense } from "react"

export const metadata = {
  title: "Owner Dashboard - Shadi V2",
  description: "Restaurant owner management portal",
}

export default function OwnerDashboardPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <OwnerDashboard />
    </Suspense>
  )
}
