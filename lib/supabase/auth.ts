/* ═══════════════════════════════════════════════════════════════════════════════
   SUPABASE AUTH - Server actions for authentication
   ═══════════════════════════════════════════════════════════════════════════════ */

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "./server"

export interface AuthResult {
  success: boolean
  error?: string
  message?: string
}

export interface User {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string | undefined

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters",
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || "",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return {
      success: true,
      message: "Please check your email to confirm your account",
    }
  }

  return {
    success: true,
    message: "Account created successfully",
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "Signed in successfully",
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "Signed out successfully",
  }
}

/**
 * Get the current user
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || "",
    user_metadata: user.user_metadata,
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect("/login?error=oauth_error")
  }

  if (data.url) {
    redirect(data.url)
  }
}

/**
 * Handle OAuth callback
 */
export async function handleOAuthCallback(): Promise<void> {
  const _supabase = await createClient()

  // The callback is handled by Supabase automatically
  // This function can be used for additional processing if needed
  redirect("/dashboard")
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      error: "Email is required",
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Please check your email for password reset instructions",
  }
}

/**
 * Update user password
 */
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return {
      success: false,
      error: "Password and confirmation are required",
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters",
    }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Password updated successfully",
  }
}
