import { PageLoadingFallback } from "@/components/layout"
import UserDashboard from "@/features/dashboard/UserDashboard"
import { Suspense } from "react"

export const metadata = {
  title: "My Dashboard - Shadi V2",
  description: "Your personal dashboard",
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <UserDashboard />
    </Suspense>
  )
}
