/* ═══════════════════════════════════════════════════════════════════════════════
   REGISTER PAGE - Unified Header, auth form with Supabase
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { AuthShell, SocialGoogleButton } from "@/components/auth"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui"
import { useLanguage } from "@/context/LanguageContext"
import { signInWithGoogle, signUp } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"

function RegisterForm() {
  const router = useRouter()
  const { t } = useLanguage()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const result = await signUp(formData)

    if (result.success) {
      setSuccess(result.message || "Account created successfully")
      // Redirect to dashboard after 2 seconds if no email confirmation needed
      if (!result.message?.includes("email")) {
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 2000)
      }
    } else {
      setError(result.error || "Failed to create account")
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
      {/* Register Card */}
      <div className="bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-2xl)] p-[var(--spacing-xl)] shadow-[var(--shadow-xl)]">
        {/* Header */}
        <div className="text-center mb-[var(--spacing-lg)]">
          <h1 className="text-[var(--font-size-2xl)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-xs)]">
            {t("auth.createAccount")}
          </h1>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{t("auth.joinUsToday")}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div
            className="mb-[var(--spacing-md)] p-[var(--spacing-md)] rounded-[var(--radius-md)]
              bg-[oklch(from_var(--color-success)_/_0.10)] border border-[oklch(from_var(--color-success)_/_0.20)] text-[var(--color-success)] text-[var(--font-size-sm)]"
          >
            {success}
          </div>
        )}

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
          {/* Name */}
          <div>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t("common.fullName")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)]"
              required
              disabled={isLoading}
            />
          </div>

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
              minLength={6}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)]"
              required
              disabled={isLoading}
            />
            <p className="text-[var(--font-size-xs)] text-[var(--fg-40)] mt-[var(--spacing-xs)]">
              {t("common.minCharacters")}
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-[var(--spacing-xs)]">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-[var(--spacing-xs)]"
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-[var(--font-size-xs)] text-[var(--fg-60)] leading-tight"
            >
              {t("auth.iAgreeTo")}{" "}
              <a href="/terms" className="link-blue text-[var(--font-size-xs)] hover:underline">
                {t("auth.terms")}
              </a>{" "}
              {t("auth.and")}{" "}
              <a href="/privacy" className="link-blue text-[var(--font-size-xs)] hover:underline">
                {t("auth.privacy")}
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full bg-[var(--color-brand-secondary)] !text-white hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? t("auth.creatingAccount") : t("common.signUp")}
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

        {/* Sign In Link */}
        <p className="text-center text-[var(--font-size-xs)] text-[var(--fg-60)] mt-[var(--spacing-md)]">
          {t("auth.haveAccount")}{" "}
          <a href="/login" className="link-blue text-[var(--font-size-xs)] hover:underline">
            {t("common.signIn")}
          </a>
        </p>
      </div>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
