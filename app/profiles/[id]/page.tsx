import { Button } from "@/components/ui"
import { DashboardCard } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

// Generate metadata based on params
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .single()

  return {
    title: profile?.full_name ?? "Profile",
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error || !profile) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardCard className="mx-auto max-w-2xl">
        <h2 className="text-[var(--font-size-2xl)] font-bold mb-[var(--spacing-md)]">
          {profile.full_name}
        </h2>
        <div className="space-y-[var(--spacing-md)]">
          <div>
            <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">Bio</p>
            <p className="mt-[var(--spacing-xs)]">{profile.bio ?? "No bio provided"}</p>
          </div>

          {/* Actions would go here */}
          <div className="flex gap-[var(--spacing-sm)]">
            <Button>Connect</Button>
            <Button variant="secondary">Message</Button>
          </div>
        </div>
      </DashboardCard>
    </main>
  )
}
