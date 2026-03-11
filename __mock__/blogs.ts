/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA - Blog listings (UI ONLY - NO API)
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface BlogCardData {
  id: string
  slug: string
  title: string
  images: string[]
  excerpt?: string
  author?: string
  username?: string
  avatar?: string
  location?: string
  date?: string
  readTime?: string
  isFeatured?: boolean
  href?: string
  likes?: number
  comments?: number
}

// Calculate dates relative to current time
const getRelativeDate = (hoursAgo: number) => {
  const date = new Date()
  date.setHours(date.getHours() - hoursAgo)
  return date.toISOString()
}

const getRelativeDays = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

const getRelativeMonths = (monthsAgo: number) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo)
  return date.toISOString()
}

export const mockBlogs: BlogCardData[] = [
  {
    id: "blog-1",
    slug: "best-emirati-food-dubai",
    title: "10 Must-Try Emirati Dishes in Dubai",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
    excerpt: "Discover the authentic flavors of UAE cuisine...",
    author: "Sarah Ahmed",
    username: "@sarahfood",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    location: "Abu Dhabi, UAE",
    date: getRelativeDate(10), // 10 hours ago
    readTime: "5 min read",
    isFeatured: true,
    href: "/blog/best-emirati-food-dubai",
    likes: 1243,
    comments: 89,
  },
  {
    id: "blog-2",
    slug: "hidden-gems-old-dubai",
    title: "Hidden Gems in Old Dubai",
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"],
    excerpt: "Exploring the historic neighborhoods and local eateries...",
    author: "Mohammed Ali",
    username: "@moali.eats",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    location: "Dubai, UAE",
    date: getRelativeDays(11), // 11 days ago
    readTime: "7 min read",
    isFeatured: false,
    href: "/blog/hidden-gems-old-dubai",
    likes: 892,
    comments: 56,
  },
  {
    id: "blog-3",
    slug: "family-friendly-restaurants",
    title: "Best Family-Friendly Restaurants",
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
    excerpt: "Where to dine with kids in the UAE...",
    author: "Fatima Hassan",
    username: "@fatima.dining",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    location: "Abu Dhabi, UAE",
    date: getRelativeMonths(2), // 2 months ago
    readTime: "4 min read",
    isFeatured: true,
    href: "/blog/family-friendly-restaurants",
    likes: 2341,
    comments: 134,
  },
  {
    id: "blog-4",
    slug: "budget-eats-dubai",
    title: "Delicious Eats Under 50 AED",
    images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"],
    excerpt: "Affordable dining options that don't compromise on flavor...",
    author: "Omar Khalid",
    username: "@omarbites",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    location: "Sharjah, UAE",
    date: getRelativeDays(5), // 5 days ago
    readTime: "6 min read",
    isFeatured: false,
    href: "/blog/budget-eats-dubai",
    likes: 1567,
    comments: 78,
  },
  {
    id: "blog-5",
    slug: "dessert-paradise",
    title: "UAE's Best Dessert Spots 2025",
    images: ["https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800"],
    excerpt: "Sweet treats and decadent desserts across the Emirates...",
    author: "Aisha Rahman",
    username: "@aisha.sweets",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    location: "Dubai, UAE",
    date: getRelativeMonths(3), // 3 months ago
    readTime: "5 min read",
    isFeatured: false,
    href: "/blog/dessert-paradise",
    likes: 3421,
    comments: 201,
  },
  {
    id: "blog-6",
    slug: "rooftop-dining-guide",
    title: "Rooftop Dining with a View",
    images: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800"],
    excerpt: "Sky-high restaurants with stunning city views...",
    author: "Khalid Saeed",
    username: "@khalid.views",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    location: "Abu Dhabi, UAE",
    date: getRelativeDate(15), // 15 hours ago
    readTime: "6 min read",
    isFeatured: true,
    href: "/blog/rooftop-dining-guide",
    likes: 987,
    comments: 45,
  },
  {
    id: "blog-7",
    slug: "street-food-guide",
    title: "Street Food Culture in UAE",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
    excerpt: "Exploring the vibrant street food scene...",
    author: "Nour Al-Din",
    username: "@nour.eats",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    location: "Liwa, UAE",
    date: getRelativeDays(20), // 20 days ago
    readTime: "7 min read",
    isFeatured: false,
    href: "/blog/street-food-guide",
    likes: 2134,
    comments: 112,
  },
  {
    id: "blog-8",
    slug: "seafood-lovers",
    title: "Fresh Seafood Destinations",
    images: ["https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800"],
    excerpt: "Best places for fresh seafood in the Emirates...",
    author: "Layla Mahmoud",
    username: "@layla.seafood",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    location: "Al Ain, UAE",
    date: getRelativeMonths(4), // 4 months ago
    readTime: "5 min read",
    isFeatured: false,
    href: "/blog/seafood-lovers",
    likes: 1876,
    comments: 94,
  },
]
