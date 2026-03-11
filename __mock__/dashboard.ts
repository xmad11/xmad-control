/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA - Dashboard statistics and data (UI ONLY - NO API)
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface DashboardStat {
  label: string
  value: string
  change?: string
}

export interface UserDashboardData {
  stats: DashboardStat[]
  savedRestaurants: number
  savedBlogs: number
  recentViews: number
}

export interface OwnerDashboardData {
  stats: DashboardStat[]
  myRestaurants: number
  activeOffers: number
  totalViews: number
}

export interface AdminDashboardData {
  stats: DashboardStat[]
  totalUsers: number
  activeRestaurants: number
  pendingApprovals: number
  totalBlogs: number
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER DASHBOARD DATA
   ───────────────────────────────────────────────────────────────────────────── */

export const userDashboardStats: DashboardStat[] = [
  { label: "Saved Restaurants", value: "24", change: "+3 this week" },
  { label: "Saved Blogs", value: "12", change: "+1 this week" },
  { label: "Recently Viewed", value: "48", change: "+8 this week" },
  { label: "Offers Claimed", value: "5", change: "+2 this week" },
]

export const getUserDashboardData = async (): Promise<UserDashboardData> => {
  // Simulate async data fetch (UI only)
  return {
    stats: userDashboardStats,
    savedRestaurants: 24,
    savedBlogs: 12,
    recentViews: 48,
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   OWNER DASHBOARD DATA
   ───────────────────────────────────────────────────────────────────────────── */

export const ownerDashboardStats: DashboardStat[] = [
  { label: "My Restaurants", value: "3", change: "+1 this month" },
  { label: "Active Offers", value: "5", change: "+2 this week" },
  { label: "Profile Views", value: "1,234", change: "+18% vs last month" },
  { label: "Blog Posts", value: "8", change: "+3 this month" },
]

export const getOwnerDashboardData = async (): Promise<OwnerDashboardData> => {
  return {
    stats: ownerDashboardStats,
    myRestaurants: 3,
    activeOffers: 5,
    totalViews: 1234,
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN DASHBOARD DATA
   ───────────────────────────────────────────────────────────────────────────── */

export const adminDashboardStats: DashboardStat[] = [
  { label: "Total Users", value: "2,847", change: "+12% vs last month" },
  { label: "Active Restaurants", value: "156", change: "+8 this month" },
  { label: "Pending Approvals", value: "12", change: "-3 this week" },
  { label: "Total Blogs", value: "89", change: "+5 this week" },
]

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  return {
    stats: adminDashboardStats,
    totalUsers: 2847,
    activeRestaurants: 156,
    pendingApprovals: 12,
    totalBlogs: 89,
  }
}
