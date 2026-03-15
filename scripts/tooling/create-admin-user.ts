/* ═══════════════════════════════════════════════════════════════════════════════
   CREATE ADMIN USER - Script to create admin user in Supabase
   ═══════════════════════════════════════════════════════════════════════════════ */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables")
  console.error("\nRequired:")
  console.error("  - NEXT_PUBLIC_SUPABASE_URL")
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface CreateAdminResult {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    password: string
  }
}

/**
 * Create admin user with specified credentials
 */
async function createAdminUser(
  email: string,
  password: string,
  name = "Admin"
): Promise<CreateAdminResult> {
  try {
    console.log("\n🔐 Creating admin user...")
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", email)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: `User with email ${email} already exists with role: ${existingUser.role}`,
      }
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        role: "admin",
      },
    })

    if (authError) {
      // Fallback: Try regular signup if admin API fails
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "admin",
          },
        },
      })

      if (signUpError) {
        return {
          success: false,
          message: `Failed to create user: ${signUpError.message}`,
        }
      }

      if (!signUpData.user) {
        return {
          success: false,
          message: "User creation failed - no user returned",
        }
      }

      // Create profile entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: signUpData.user.id,
        email,
        name,
        role: "admin",
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.warn(`⚠️  Profile creation failed: ${profileError.message}`)
      }

      return {
        success: true,
        message: "Admin user created successfully (via signup)",
        user: {
          id: signUpData.user.id,
          email,
          password,
        },
      }
    }

    // Create profile entry for admin-created user
    if (authData.user?.id) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        name,
        role: "admin",
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.warn(`⚠️  Profile creation failed: ${profileError.message}`)
      }
    }

    return {
      success: true,
      message: "Admin user created successfully",
      user: {
        id: authData.user?.id || "",
        email,
        password,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║         SHADI V2 - Admin User Creation Script               ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝")

  // Get command line arguments or use defaults
  const args = process.argv.slice(2)
  const email = args[0] || "admin@shadi.ae"
  const password = args[1] || "Shadi@2025"
  const name = args[2] || "Shadi Admin"

  const result = await createAdminUser(email, password, name)

  console.log(`\n${"─".repeat(60)}`)
  console.log("📋 RESULT")
  console.log("─".repeat(60))

  if (result.success) {
    console.log(`✅ ${result.message}`)
    console.log("\n📧 Admin Credentials:")
    console.log(`   Email:    ${result.user?.email}`)
    console.log(`   Password: ${result.user?.password}`)
    console.log("\n🔗 Login URL: http://localhost:3000/login")
    console.log("\n⚠️  IMPORTANT:")
    console.log("   1. Save these credentials securely")
    console.log("   2. Change password after first login")
    console.log("   3. Check Supabase dashboard to verify user creation")
  } else {
    console.log(`❌ ${result.message}`)
    console.log("\n🔧 Troubleshooting:")
    console.log("   1. Check if Supabase project is paused (Free tier)")
    console.log("   2. Verify NEXT_PUBLIC_SUPABASE_URL in .env.local")
    console.log("   3. Check if profiles table exists in database")
    console.log("   4. Try accessing Supabase dashboard:")
    console.log("      {supabaseUrl}/project/_/auth/users")
  }

  console.log(`${"─".repeat(60)}\n`)
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
