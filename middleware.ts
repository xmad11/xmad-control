/* ═══════════════════════════════════════════════════════════════════════════════
   MIDDLEWARE - Route protection and session management
   ═══════════════════════════════════════════════════════════════════════════════ */

import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root path to restaurants page
  // This makes /restaurants the home page
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/restaurants"
    return NextResponse.redirect(url)
  }

  let response = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set(name, value)
        response = NextResponse.next({
          request,
        })
        response.cookies.set(name, value, options)
      },
      remove(name: string, _options: Record<string, unknown>) {
        request.cookies.delete(name)
        response = NextResponse.next({
          request,
        })
        response.cookies.delete(name)
      },
    },
  })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected and public routes
  // NOTE: Route groups like (dashboard) don't appear in URL pathname
  // Must list each route explicitly: /admin, /owner, /user, etc.
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/owner",
    "/user",
    "/settings",
    "/profile",
    "/favorites",
  ]
  const authRoutes = ["/login", "/register", "/forgot-password"]
  const _publicRoutes = ["/", "/restaurants", "/blog", "/about", "/contact"]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
