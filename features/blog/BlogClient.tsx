"use client"

import { BlogCard } from "@/components/card"
import type { BlogCardData } from "@/components/card"
import { ClockIcon, HeartIcon, SparklesIcon, UserIcon } from "@/components/icons"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { getBlogs } from "@/data/blogs"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { BlogSearch } from "./BlogSearch"

const CATEGORIES = [
  { id: "all", label: "All", icon: SparklesIcon },
  { id: "latest", label: "Latest", icon: ClockIcon },
  { id: "shadi-picks", label: "Shadi's Picks", icon: HeartIcon },
  { id: "owner-stories", label: "Owner Stories", icon: UserIcon },
] as const

type CategoryId = (typeof CATEGORIES)[number]["id"]

export default function BlogClient() {
  const { showBackButtonInHeader, hideBackButton } = useNavigation()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read from URL params
  const initialQuery = searchParams.get("query") || ""
  const initialCategory = searchParams.get("filter") || ""

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    (initialCategory as CategoryId) || "all"
  )
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [blogs, setBlogs] = useState<BlogCardData[]>([])

  // Show back button in header on mount, hide on unmount
  useEffect(() => {
    showBackButtonInHeader()
    return () => {
      hideBackButton()
    }
  }, [showBackButtonInHeader, hideBackButton])

  useEffect(() => {
    getBlogs().then(setBlogs)
  }, [])

  // Load filters from localStorage on mount (if URL params are empty)
  useEffect(() => {
    const hasUrlParams = initialQuery || initialCategory
    if (hasUrlParams) return

    try {
      const stored = localStorage.getItem("blogFilters")
      if (stored) {
        const filters = JSON.parse(stored)
        if (filters.searchQuery) setSearchQuery(filters.searchQuery)
        if (filters.selectedCategory && filters.selectedCategory !== "all")
          setSelectedCategory(filters.selectedCategory)
      }
    } catch (error) {
      console.error("Failed to load filters from localStorage:", error)
    }
  }, [initialQuery, initialCategory])

  // Save filters to localStorage whenever state changes
  useEffect(() => {
    try {
      const filters = { searchQuery, selectedCategory }
      localStorage.setItem("blogFilters", JSON.stringify(filters))
    } catch (error) {
      console.error("Failed to save filters to localStorage:", error)
    }
  }, [searchQuery, selectedCategory])

  // Debounced URL update (smooth, no scroll jump)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      // Only add non-default params to URL (canonical URLs)
      if (searchQuery) params.set("query", searchQuery)
      if (selectedCategory && selectedCategory !== "all") params.set("filter", selectedCategory)

      const queryString = params.toString()
      router.replace(`/blog${queryString ? `?${queryString}` : ""}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, router])

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "all" ||
      blog.category?.toLowerCase().includes(selectedCategory.replace("-", ""))
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-[var(--color-primary)]/30">
      <main id="main-content" className="relative pt-0 pb-[var(--spacing-4xl)]">
        {/* Page Title - Right under header */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] pt-[var(--spacing-md)] pb-0">
          <h1 className="text-[var(--font-size-4xl)] md:text-[var(--font-size-5xl)] font-black tracking-tight mb-[var(--spacing-xs)]">
            Food <span className="text-[var(--color-primary)] italic">Stories</span>
          </h1>
          <p className="text-[var(--font-size-base)] opacity-[var(--opacity-medium)] max-w-[var(--max-w-2xl)]">
            Discover the best restaurants, recipes, and culinary experiences across the UAE
          </p>
        </section>

        {/* Search & Filter */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mt-[var(--spacing-md)] mb-[var(--spacing-md)]">
          <div className="space-y-[var(--spacing-md)]">
            <BlogSearch placeholder="Search blogs..." onSearch={setSearchQuery} />

            {/* Categories - Match restaurant filter button style */}
            <div className="flex items-center gap-[var(--spacing-sm)] overflow-x-auto overflow-y-hidden scrollbar-hide">
              {CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-xs)]
                    rounded-[var(--radius-full)]
                    transition-all duration-[var(--duration-fast)]
                    whitespace-nowrap
                    ${
                      selectedCategory === category.id
                        ? "bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 text-[var(--fg)]"
                        : "bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 text-[var(--fg)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/10"
                    }
                  `}
                  >
                    <Icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg)]" />
                    <span className="text-[var(--font-size-sm)] font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-[var(--spacing-3xl)]">
              <p className="text-[var(--font-size-lg)] opacity-[var(--opacity-medium)]">
                No blogs found matching your criteria
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
