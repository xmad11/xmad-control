"use client"

import type { BlogCardData } from "@/components/card"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { useEffect } from "react"

interface BlogDetailClientProps {
  blog: BlogCardData
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const { showBackButtonInHeader, hideBackButton } = useNavigation()

  // Show back button in header on mount, hide on unmount
  useEffect(() => {
    showBackButtonInHeader()
    return () => {
      hideBackButton()
    }
  }, [showBackButtonInHeader, hideBackButton])

  return (
    <div className="min-h-[var(--layout-min-height)] selection:bg-primary/30">
      <main
        id="main-content"
        className="relative pt-[var(--header-total-height)] pb-[var(--spacing-4xl)]"
      >
        <article className="max-w-[var(--max-w-2xl)] mx-auto px-[var(--page-padding-x)]">
          {/* Header */}
          <header className="mb-[var(--spacing-2xl)]">
            {blog.category && (
              <span className="inline-block px-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[var(--font-size-sm)] font-medium mb-[var(--spacing-md)]">
                {blog.category}
              </span>
            )}
            <h1 className="text-[var(--font-size-4xl)] md:text-[var(--font-size-5xl)] font-black tracking-tight mb-[var(--spacing-md)]">
              {blog.title}
            </h1>
            <div className="flex items-center gap-[var(--spacing-md)] opacity-[var(--opacity-medium)]">
              <span>{blog.author.name}</span>
              <span>•</span>
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
              {blog.readTime && (
                <>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="mb-[var(--spacing-2xl)] rounded-[var(--radius-2xl)] overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[auto] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-[var(--font-size-lg)] leading-relaxed opacity-[var(--opacity-strong)]">
              {blog.excerpt}
            </p>
            {/* Full blog content would go here */}
          </div>
        </article>
      </main>
    </div>
  )
}
