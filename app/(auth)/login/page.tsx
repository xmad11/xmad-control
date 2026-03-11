/* ═══════════════════════════════════════════════════════════════════════════════
   LOGIN PAGE - Unified Header, auth form with Supabase
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { AuthShell, SocialGoogleButton } from "@/components/auth"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui"
import { useLanguage } from "@/context/LanguageContext"
import { signIn, signInWithGoogle } from "@/lib/supabase/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await signIn(formData)

    if (result.success) {
      router.push(redirectTo)
      router.refresh()
    } else {
      setError(result.error || "Failed to sign in")
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (_err) {
      setError("Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  return (
    <AuthShell>
      {/* Login Card */}
      <div className="bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-2xl)] p-[var(--spacing-xl)] shadow-[var(--shadow-xl)]">
        {/* Header */}
        <div className="text-center mb-[var(--spacing-lg)]">
          <h1 className="text-[var(--font-size-2xl)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-xs)]">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
            {t("auth.signInToContinue")}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-md)]
              bg-[oklch(from_var(--color-error)_/_0.10)] border border-[oklch(from_var(--color-error)_/_0.20)] text-[var(--color-error)] text-[var(--font-size-sm)]"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-[var(--spacing-md)]" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("auth.email")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)]"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("auth.password")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)]"
              required
              disabled={isLoading}
            />
            <div className="text-right mt-[var(--spacing-xs)]">
              <a
                href="/forgot-password"
                className="link-blue text-[var(--font-size-xs)] hover:underline"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full bg-[var(--color-brand-secondary)] !text-white hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? t("auth.signingIn") : t("common.signIn")}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-[var(--spacing-lg)]">
          <div className="flex-1 border-t border-[var(--fg-10)]" />
          <span className="px-[var(--spacing-sm)] text-[var(--font-size-sm)] text-[var(--fg-50)]">
            {t("common.orContinueWith")}
          </span>
          <div className="flex-1 border-t border-[var(--fg-10)]" />
        </div>

        {/* Social Login */}
        <SocialGoogleButton onClick={handleGoogleSignIn} disabled={isLoading} />

        {/* Sign Up Link */}
        <p className="text-center text-[var(--font-size-xs)] text-[var(--fg-60)] mt-[var(--spacing-md)]">
          {t("auth.noAccount")}{" "}
          <a href="/register" className="link-blue text-[var(--font-size-xs)] hover:underline">
            {t("common.signUp")}
          </a>
        </p>
      </div>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
