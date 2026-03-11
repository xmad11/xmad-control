/**
 * CENTRALIZED ROUTE CONFIG
 *
 * Add/remove routes here to auto-update the /pages directory
 * This is for development purposes only
 */

export interface RouteConfig {
  path: string
  label: string
  description: string
  category: "marketing" | "restaurant" | "blog" | "user" | "dashboard" | "auth" | "legal"
}

export const DEV_ROUTES: RouteConfig[] = [
  // Marketing
  {
    path: "/",
    label: "Home",
    description: "Landing page with hero, marquees, search",
    category: "marketing",
  },
  {
    path: "/restaurants",
    label: "Restaurants",
    description: "Restaurant listing page",
    category: "restaurant",
  },
  {
    path: "/restaurants/example",
    label: "Restaurant Detail",
    description: "Individual restaurant page (example)",
    category: "restaurant",
  },
  {
    path: "/nearby",
    label: "Nearby",
    description: "Nearby restaurants",
    category: "restaurant",
  },
  {
    path: "/top-rated",
    label: "Top Rated",
    description: "Top rated restaurants",
    category: "restaurant",
  },

  // Blog
  {
    path: "/blog",
    label: "Blog",
    description: "Blog listing page",
    category: "blog",
  },
  {
    path: "/blog/example-post",
    label: "Blog Post",
    description: "Individual blog post (example)",
    category: "blog",
  },

  // User
  {
    path: "/profile",
    label: "Profile",
    description: "User profile page",
    category: "user",
  },
  {
    path: "/profiles/123",
    label: "Public Profile",
    description: "Public profile page (example)",
    category: "user",
  },
  {
    path: "/favorites",
    label: "Favorites",
    description: "User favorites",
    category: "user",
  },
  {
    path: "/settings",
    label: "Settings",
    description: "Settings page",
    category: "user",
  },
  {
    path: "/language",
    label: "Language",
    description: "Language selection",
    category: "user",
  },

  // Dashboard
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "General dashboard",
    category: "dashboard",
  },
  {
    path: "/dashboard/user",
    label: "User Dashboard",
    description: "Regular user dashboard",
    category: "dashboard",
  },
  {
    path: "/dashboard/owner",
    label: "Owner Dashboard",
    description: "Restaurant owner dashboard",
    category: "dashboard",
  },
  {
    path: "/dashboard/admin",
    label: "Admin Dashboard",
    description: "Platform admin dashboard",
    category: "dashboard",
  },

  // Auth
  {
    path: "/login",
    label: "Login",
    description: "User login page",
    category: "auth",
  },
  {
    path: "/register",
    label: "Register",
    description: "User registration page",
    category: "auth",
  },
  {
    path: "/forgot-password",
    label: "Forgot Password",
    description: "Password reset page",
    category: "auth",
  },

  // Legal
  {
    path: "/terms",
    label: "Terms of Service",
    description: "Terms and conditions",
    category: "legal",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    description: "Privacy policy",
    category: "legal",
  },
]

export const CATEGORY_LABELS: Record<RouteConfig["category"], string> = {
  marketing: "Marketing Pages",
  restaurant: "Restaurant Pages",
  blog: "Blog Pages",
  user: "User Pages",
  dashboard: "Dashboard & Admin",
  auth: "Authentication",
  legal: "Legal Pages",
}

export const CATEGORY_COLORS: Record<RouteConfig["category"], string> = {
  marketing: "bg-accent-honey",
  restaurant: "bg-accent-rust",
  blog: "bg-accent-sage",
  user: "bg-accent-teal",
  dashboard: "bg-accent-berry",
  auth: "bg-primary",
  legal: "bg-secondary",
}
