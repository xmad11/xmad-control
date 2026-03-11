/* ═══════════════════════════════════════════════════════════════════════════════
   BLOG DATA - Supabase + mock fallback
   Cards and marquees never know where data came from
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { BlogCardData } from "@/components/card"
import { mockBlogs } from "./mocks"

/**
 * getBlogs - Fetch from Supabase with mock fallback
 * TODO: Add actual Supabase integration
 */
export async function getBlogs(): Promise<BlogCardData[]> {
  try {
    // TODO: Add Supabase query here
    // const { data } = await supabase.from('blogs').select('*')
    // return data

    // For now, return mock data
    return mockBlogs
  } catch {
    // Fallback to mock on error
    return mockBlogs
  }
}

/**
 * getBlogById - Fetch single blog by ID
 */
export async function getBlogById(id: string): Promise<BlogCardData | null> {
  try {
    // TODO: Add Supabase query here
    const blog = mockBlogs.find((b) => b.id === id)
    return blog || null
  } catch {
    return null
  }
}

/**
 * getBlogBySlug - Fetch single blog by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogCardData | null> {
  try {
    // TODO: Add Supabase query here
    const blog = mockBlogs.find((b) => b.slug === slug)
    return blog || null
  } catch {
    return null
  }
}
