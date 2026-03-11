/* ═══════════════════════════════════════════════════════════════════════════════
   USER CONTEXT - Authentication state management
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import type { UserRole } from "@/components/layout/Header"
import type { User } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"

interface UserContextType {
  user: User | null
  loading: boolean
  role: UserRole
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const getUserRole = useCallback((userData: User | null): UserRole => {
    // Default to guest if no user
    if (!userData) return "guest"

    // Check user_metadata for role
    const metadata = userData.user_metadata || {}
    const role = metadata.role as UserRole

    // Validate role is one of the allowed values
    if (role === "admin" || role === "owner" || role === "user") {
      return role
    }

    return "user" // Default to user for authenticated users without explicit role
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          user_metadata: authUser.user_metadata,
        })
      } else {
        setUser(null)
      }
    } catch (error: unknown) {
      // Silently ignore AbortError - happens during navigation/transition
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  useEffect(() => {
    refreshUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          user_metadata: session.user.user_metadata,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [refreshUser, supabase.auth])

  const role = getUserRole(user)

  return (
    <UserContext.Provider value={{ user, loading, role, signOut, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
