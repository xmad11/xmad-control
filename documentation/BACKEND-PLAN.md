# SHADI-V2 — BACKEND IMPLEMENTATION PLAN

> **Database Agent Scope** • **Supabase** • **Server Actions** • **API Routes**

This document is the authoritative backend implementation plan for shadi-v2.

---

## Agent Responsibilities

**Database Agent** handles:
- `server/` - Database, services, cache
- `lib/db/` - Database queries and types
- `app/api/` - API route implementation
- Types for database tables
- Server Actions for mutations

**NOT in scope:**
- `app/` page components (UI Designer Agent)
- `components/` UI components (UI Designer Agent)
- `design-system/` tokens and primitives (UI Designer Agent)

---

## Phase 1 — Database Schema & Types

### Goal
Type-safe database layer with Supabase

### Deliverables

#### 1.1 Database Schema

Verify Supabase schema includes:

**Tables:**
```sql
-- Restaurants
restaurants (
  id uuid PRIMARY KEY,
  owner_id uuid REFERENCES users(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cuisine text[],
  rating numeric,
  status text DEFAULT 'pending', -- pending, active, suspended
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Users (Supabase auth.users + profile)
users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user', -- user, owner, admin
  created_at timestamptz DEFAULT now()
)

-- Reviews
reviews (
  id uuid PRIMARY KEY,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
)

-- Blog Posts
blog_posts (
  id uuid PRIMARY KEY,
  author_id uuid REFERENCES users(id),
  author_type text, -- shadi, owner, user
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Favorites
favorites (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, restaurant_id)
)
```

#### 1.2 Type Definitions

Create/verify in `types/database.ts`:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | Json[] }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant
        Insert: RestaurantInsert
        Update: RestaurantUpdate
      }
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      reviews: {
        Row: Review
        Insert: ReviewInsert
        Update: ReviewUpdate
      }
      blog_posts: {
        Row: BlogPost
        Insert: BlogPostInsert
        Update: BlogPostUpdate
      }
      favorites: {
        Row: Favorite
        Insert: FavoriteInsert
      }
    }
  }
}

// Restaurant types
export type Restaurant = {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  cuisine: string[] | null
  rating: number | null
  status: 'pending' | 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export type RestaurantInsert = Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>
export type RestaurantUpdate = Partial<RestaurantInsert>

// User types
export type User = {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'owner' | 'admin'
  created_at: string
}

export type UserInsert = Omit<User, 'id' | 'created_at'>
export type UserUpdate = Partial<UserInsert>

// Review types
export type Review = {
  id: string
  restaurant_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type ReviewInsert = Omit<Review, 'id' | 'created_at'>
export type ReviewUpdate = Partial<ReviewInsert>

// Blog types
export type BlogPost = {
  id: string
  author_id: string
  author_type: 'shadi' | 'owner' | 'user'
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
export type BlogPostUpdate = Partial<BlogPostInsert>

// Favorite types
export type Favorite = {
  user_id: string
  restaurant_id: string
  created_at: string
}
```

---

## Phase 2 — Server Layer Setup

### Goal
Organized server code with proper separation

### Directory Structure

```
server/
├── db/
│   ├── client.ts            # Supabase client singleton
│   ├── pool.ts              # Connection management
│   └── queries/             # Database queries
│       ├── restaurants.ts
│       ├── blogs.ts
│       ├── users.ts
│       ├── reviews.ts
│       └── favorites.ts
│
├── cache/
│   ├── revalidate.ts        # Cache revalidation utils
│   └── keys.ts              # Cache key constants
│
└── services/
    ├── restaurants.ts       # Business logic
    ├── blogs.ts
    ├── users.ts
    ├── reviews.ts
    └── auth.ts
```

### Files to Create

#### 2.1 Database Client (`server/db/client.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Admin client (service role) - server-only
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
```

#### 2.2 Cache Keys (`server/cache/keys.ts`)

```typescript
export const CACHE_KEYS = {
  RESTAURANTS: 'restaurants',
  RESTAURANT: (id: string) => `restaurant:${id}`,
  BLOGS: 'blogs',
  BLOG: (slug: string) => `blog:${slug}`,
  USER_REVIEWS: (userId: string) => `user:${userId}:reviews`,
  RESTAURANT_REVIEWS: (restaurantId: string) => `restaurant:${restaurantId}:reviews`,
} as const
```

---

## Phase 3 — Database Queries

### Goal
Type-safe, reusable query functions

### Restaurant Queries (`server/db/queries/restaurants.ts`)

```typescript
import { supabase } from '../client'
import type { Restaurant, RestaurantInsert, RestaurantUpdate } from '@/types/database'

export async function getRestaurants(options?: {
  limit?: number
  offset?: number
  status?: Restaurant['status'][]
  cuisine?: string[]
}) {
  let query = supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.in('status', options.status)
  }

  if (options?.cuisine) {
    query = query.contains('cuisine', options.cuisine)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + options.limit - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getRestaurantBySlug(slug: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createRestaurant(restaurant: RestaurantInsert) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert(restaurant)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRestaurant(id: string, updates: RestaurantUpdate) {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRestaurant(id: string) {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getRestaurantsByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Blog Queries (`server/db/queries/blogs.ts`)

```typescript
import { supabase } from '../client'
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/database'

export async function getBlogs(options?: {
  limit?: number
  offset?: number
  published?: boolean
  authorType?: BlogPost['author_type']
}) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.published !== undefined) {
    query = query.eq('published', options.published)
  }

  if (options?.authorType) {
    query = query.eq('author_type', options.authorType)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + options.limit - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, users(full_name, email)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function createBlog(blog: BlogPostInsert) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blog)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBlog(id: string, updates: BlogPostUpdate) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBlog(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

### User Queries (`server/db/queries/users.ts`)

```typescript
import { supabase } from '../client'
import type { User, UserInsert, UserUpdate } from '@/types/database'

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: UserUpdate) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUsersByRole(role: User['role']) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Review Queries (`server/db/queries/reviews.ts`)

```typescript
import { supabase } from '../client'
import type { Review, ReviewInsert } from '@/types/database'

export async function getReviewsByRestaurant(restaurantId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(full_name)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getReviewsByUser(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, restaurants(name, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createReview(review: ReviewInsert) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRestaurantRating(restaurantId: string) {
  // Recalculate average rating
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('restaurant_id', restaurantId)

  if (!reviews || reviews.length === 0) return

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const { error } = await supabase
    .from('restaurants')
    .update({ rating: avgRating })
    .eq('id', restaurantId)

  if (error) throw error
}
```

### Favorite Queries (`server/db/queries/favorites.ts`)

```typescript
import { supabase } from '../client'
import type { Favorite } from '@/types/database'

export async function getFavoritesByUser(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, restaurants(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addFavorite(userId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, restaurant_id: restaurantId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFavorite(userId: string, restaurantId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)

  if (error) throw error
}

export async function isFavorite(userId: string, restaurantId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .single()

  return !!data
}
```

---

## Phase 4 — API Routes

### Goal
RESTful API with proper error handling

### Already Exists

```
app/api/
├── restaurants/
│   ├── route.ts            # GET/POST restaurants
│   └── paginated/
│       └── route.ts        # GET paginated restaurants
└── favorites/
    ├── route.ts            # GET user favorites
    └── [restaurantId]/      # POST/DELETE favorite
        └── route.ts
```

### Additional Routes to Create

#### 4.1 Blog Routes

```
app/api/blogs/
├── route.ts                # GET blogs, POST blog
└── [slug]/
    └── route.ts            # GET/PUT/DELETE blog by slug
```

#### 4.2 Reviews Routes

```
app/api/reviews/
├── route.ts                # GET reviews, POST review
└── [id]/
    └── route.ts            # PUT/DELETE review
```

#### 4.3 Users Routes

```
app/api/users/
├── route.ts                # GET users (admin)
└── [id]/
    └── route.ts            # GET/PUT user
```

### Route Template

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/server/db/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit') || '10')
    const offset = Number(searchParams.get('offset') || '0')

    const data = await getRestaurants({ limit, offset })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await createResource(body)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
```

---

## Phase 5 — Server Actions

### Goal
Type-safe mutations for forms

### Create Server Actions

```typescript
// server/actions/restaurants.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/server/db/client'
import { getRestaurantBySlug } from '@/server/db/queries/restaurants'

export async function updateRestaurantAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('restaurants')
    .update({ name, description })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/restaurants')
  revalidatePath(`/restaurants/${formData.get('slug')}`)

  return { success: true }
}

export async function deleteRestaurantAction(formData: FormData) {
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/restaurants')

  return { success: true }
}
```

---

## Phase 6 — Caching Strategy

### Goal
Bounded caching with proper invalidation

### Cache Configuration

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  revalidate: 3600, // 1 hour default
}

export default nextConfig
```

### Revalidation Tags

```typescript
// In server components
export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  return [{ slug: 'restaurant-1' }]
}
```

---

## Type Safety Rules

### Always Use Types from `/types`

```typescript
import type { Restaurant, Review, BlogPost } from '@/types/database'

// ✅ CORRECT
const restaurant: Restaurant = await getRestaurant(id)

// ❌ WRONG
const restaurant: any = await getRestaurant(id)
```

### No Implicit Types

```typescript
// ✅ CORRECT
async function getRestaurant(id: string): Promise<Restaurant> {
  // ...
}

// ❌ WRONG
async function getRestaurant(id) {
  // ...
}
```

---

## Error Handling

### Standard Error Response

```typescript
try {
  const data = await operation()
  return NextResponse.json(data)
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Operation failed', details: error.message },
    { status: 500 }
  )
}
```

### Validation

```typescript
import { z } from 'zod'

const RestaurantSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  cuisine: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = RestaurantSchema.parse(body)
  // ...
}
```

---

## Pre-Commit Checklist

Before committing any backend work:

- [ ] All queries have proper types
- [ ] Error handling in all routes
- [ ] Cache invalidation added
- [ ] Server actions use revalidatePath
- [ ] No `any` types
- [ ] No hardcoded IDs or strings
- [ ] Tests pass

---

## Files Already Created (Verify These Work)

### Database Queries (Verify in `lib/`)
- `lib/db/` - Database utilities
- `lib/queries/` - Existing queries

### API Routes (Verify in `app/api/`)
- `app/api/restaurants/route.ts`
- `app/api/restaurants/paginated/route.ts`
- `app/api/favorites/*/route.ts`

---

## Next Steps

After reviewing this plan:

1. **Verify database schema** matches types
2. **Create missing query functions**
3. **Create missing API routes**
4. **Add server actions** for forms
5. **Add proper caching** with revalidation

---

**Last Updated:** 2025-12-30
**Owner:** Database Agent
**Dependencies:** Supabase, Next.js 16 API Routes
