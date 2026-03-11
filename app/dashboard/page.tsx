import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard - Shadi V2",
  description: "Platform dashboard",
}

export default function DashboardPage() {
  // Redirect to admin dashboard as the main dashboard
  redirect("/admin")
}
