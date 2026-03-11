"use client"

import { BlogCard } from "@/components/card"
import type { BlogCardData } from "@/components/card"
import { getBlogs } from "@/data/blogs"
import { useEffect, useState } from "react"
import { BlogSearch } from "./BlogSearch"
import { SwipeCarousel } from "./SwipeCarousel"

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "latest", label: "Latest" },
  { id: "shadi-picks", label: "Shadi's Picks" },
  { id: "owner-stories", label: "Owner Stories" },
] as const

type CategoryId = (typeof CATEGORIES)[number]["id"]

export function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [blogs, setBlogs] = useState<BlogCardData[]>([])

  useEffect(() => {
    getBlogs().then(setBlogs)
  }, [])

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
      <main
        id="main-content"
        className="relative pt-[var(--page-top-offset)] pb-[var(--spacing-4xl)]"
      >
        {/* Hero Section */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] py-[var(--spacing-3xl)]">
          <h1 className="text-[var(--font-size-5xl)] md:text-[var(--font-size-6xl)] font-black tracking-tight mb-[var(--spacing-sm)]">
            Food <span className="text-[var(--color-primary)] italic">Stories</span>
          </h1>
          <p className="text-[var(--font-size-lg)] opacity-[var(--opacity-medium)] max-w-[var(--max-w-2xl)]">
            Discover the best restaurants, recipes, and culinary experiences across the UAE
          </p>
        </section>

        {/* Search & Filter */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] mb-[var(--spacing-2xl)]">
          <div className="space-y-[var(--spacing-md)]">
            <BlogSearch placeholder="Search blogs..." onSearch={setSearchQuery} />

            {/* Categories */}
            <div className="flex gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)]">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-[var(--color-primary)] text-[var(--bg)]"
                      : "bg-[var(--bg)] border border-[var(--fg)]/20 text-[var(--fg)]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Cards with SwipeCarousel */}
        {/* Vertical list of blog cards, each with image carousel */}
        <section className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)]">
          <div className="space-y-[var(--spacing-xl)]">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-[var(--bg)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden"
              >
                {/* Image Carousel */}
                {blog.image && (
                  <SwipeCarousel
                    images={[blog.image]}
                    height="20rem"
                    showIndicators={false}
                    autoPlay={false}
                    cardIndex={0}
                    restaurantName={blog.title}
                  />
                )}

                {/* Blog Info */}
                <div className="p-[var(--spacing-md)]">
                  <BlogCard key={blog.id} {...blog} />
                </div>
              </div>
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
