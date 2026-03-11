/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA - Blog listings with BlurHash strings
   ═══════════════════════════════════════════════════════════════════════════════ */

import { getBlurHash } from "@/lib/images/precomputed-blurhash"
import type { BlogCardData } from "./blogs"
import { mockBlogs } from "./blogs"

// Extended type with blurHash
export type BlogCardDataWithBlurHash = BlogCardData & {
  imageBlurHash?: string
  avatarBlurHash?: string
}

// Add blurHash to each blog post
export const mockBlogsWithBlurHash: BlogCardDataWithBlurHash[] = mockBlogs.map((blog) => ({
  ...blog,
  imageBlurHash: blog.images[0] ? getBlurHash(blog.images[0]) : undefined,
  avatarBlurHash: blog.avatar ? getBlurHash(blog.avatar) : undefined,
}))
