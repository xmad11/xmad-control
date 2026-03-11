/* ═══════════════════════════════════════════════════════════════════════════════
   PROFILE PAGE - User profile with edit modal and avatar upload
   Dynamic user data, editable profile, avatar management
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageContainer } from "@/components/layout/PageContainer"
import { DashboardCard } from "@/components/ui"
import { memo, useCallback, useState } from "react"
import { AvatarUpload } from "./components/AvatarUpload"
import { EditProfileModal } from "./components/EditProfileModal"

/**
 * User profile data interface
 */
interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  joinedDate: string
  stats: {
    savedRestaurants: number
    savedBlogs: number
    recentlyViewed: number
    offersClaimed: number
  }
}

/**
 * Default user profile (TODO: Replace with actual user data from auth/API)
 */
const defaultProfile: UserProfile = {
  id: "1",
  name: "User",
  email: "user@example.com",
  phone: "+971 50 123 4567",
  role: "user",
  joinedDate: "January 2025",
  stats: {
    savedRestaurants: 0,
    savedBlogs: 0,
    recentlyViewed: 0,
    offersClaimed: 0,
  },
}

/**
 * Profile Page - Manage user profile and settings
 *
 * Features:
 * - Avatar with edit button
 * - User information display
 * - Activity stats cards
 * - Quick actions (Edit Profile, Change Password, Notifications, Privacy)
 * - Edit profile modal
 * - Avatar upload functionality
 */
export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false)

  /**
   * Handle profile update from modal
   */
  const handleProfileUpdate = useCallback((updatedData: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updatedData }))
    setIsEditModalOpen(false)
    // TODO: Save to API
  }, [])

  /**
   * Handle avatar update
   */
  const handleAvatarUpdate = useCallback((avatarUrl: string) => {
    setProfile((prev) => ({ ...prev, avatar: avatarUrl }))
    setIsAvatarUploadOpen(false)
    // TODO: Upload to API
  }, [])

  /**
   * Handle avatar click - open upload modal
   */
  const handleAvatarClick = useCallback(() => {
    setIsAvatarUploadOpen(true)
  }, [])

  return (
    <DashboardLayout userRole="user">
      <PageContainer>
        {/* Header */}
        <section className="py-[var(--spacing-3xl)]">
          <h1 className="text-[var(--font-size-4xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            My <span className="text-[var(--color-primary)] italic">Profile</span>
          </h1>
          <p className="text-[var(--font-size-lg)] text-[var(--fg-60)]">
            Manage your account settings
          </p>
        </section>

        {/* Profile Card */}
        <section className="mb-[var(--section-gap-lg)]">
          <div className="bg-[var(--card-bg)] border border-[var(--fg-10)] rounded-[var(--radius-2xl)] p-[var(--spacing-2xl)]">
            <div className="flex flex-col sm:flex-row items-center gap-[var(--spacing-xl)]">
              {/* Avatar */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="group relative"
                  aria-label="Change avatar"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-[120px] w-[120px] rounded-[var(--radius-full)] object-cover group-hover:opacity-[var(--hover-opacity)] transition-opacity"
                    />
                  ) : (
                    <div className="h-[120px] w-[120px] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                      <svg
                        className="h-[60px] w-[60px] text-[var(--color-primary)]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  {/* Edit overlay */}
                  <div className="absolute inset-0 rounded-[var(--radius-full)] bg-[var(--fg-70)]/0 group-hover:bg-[var(--fg-70)]/30 transition-all flex items-center justify-center">
                    <svg
                      className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-[var(--color-white)] opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)] mb-[var(--spacing-xs)]">
                  {profile.name}
                </h2>
                <p className="text-[var(--font-size-base)] text-[var(--fg-70)] mb-[var(--spacing-sm)]">
                  {profile.email}
                </p>
                {profile.phone && (
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-60)] mb-[var(--spacing-sm)]">
                    {profile.phone}
                  </p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-[var(--spacing-sm)]">
                  <span className="inline-flex items-center px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[var(--font-size-xs)] font-semibold uppercase">
                    {profile.role}
                  </span>
                  <span className="text-[var(--font-size-sm)] text-[var(--fg-50)]">
                    Joined {profile.joinedDate}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-white)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Stats - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
            Activity Stats
          </h2>
          <div className="grid grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="primary"
              size="md"
              title={profile.stats.savedRestaurants.toString()}
              subtitle="Saved Restaurants"
            />
            <DashboardCard
              variant="primary"
              size="md"
              title={profile.stats.savedBlogs.toString()}
              subtitle="Saved Blogs"
            />
            <DashboardCard
              variant="primary"
              size="md"
              title={profile.stats.recentlyViewed.toString()}
              subtitle="Recently Viewed"
            />
            <DashboardCard
              variant="primary"
              size="md"
              title={profile.stats.offersClaimed.toString()}
              subtitle="Offers Claimed"
            />
          </div>
        </section>

        {/* Quick Actions - 2-Grid Mobile */}
        <section className="mb-[var(--section-gap-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
            Account Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
            <DashboardCard
              variant="default"
              size="md"
              title="Edit Profile"
              subtitle="Update your information"
              onClick={() => setIsEditModalOpen(true)}
            />
            <a href="/settings#notifications" className="block">
              <DashboardCard
                variant="default"
                size="md"
                title="Notifications"
                subtitle="Email & push preferences"
              />
            </a>
            <a href="/settings#privacy" className="block">
              <DashboardCard
                variant="default"
                size="md"
                title="Privacy"
                subtitle="Password & security"
              />
            </a>
            <a href="/settings" className="block">
              <DashboardCard
                variant="default"
                size="md"
                title="Settings"
                subtitle="App preferences"
              />
            </a>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mb-[var(--section-gap-lg)]">
          <h2 className="text-[var(--font-size-xl)] font-bold text-[var(--fg)] mb-[var(--spacing-md)]">
            Danger Zone
          </h2>
          <div className="p-[var(--spacing-md)] bg-[var(--color-error)]/5 border border-[var(--color-error)]/20 rounded-[var(--radius-xl)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--spacing-md)]">
              <div>
                <h3 className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] mb-[var(--spacing-xs)]">
                  Delete Account
                </h3>
                <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                type="button"
                className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-[var(--color-error)] text-[var(--color-error)] font-medium hover:bg-[var(--color-error)] hover:text-[var(--color-white)] transition-colors whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </PageContainer>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onSave={handleProfileUpdate}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Avatar Upload Modal */}
      {isAvatarUploadOpen && (
        <AvatarUpload
          currentAvatar={profile.avatar}
          onSave={handleAvatarUpdate}
          onClose={() => setIsAvatarUploadOpen(false)}
        />
      )}
    </DashboardLayout>
  )
}

export const ProfilePage = memo(ProfilePage)
