/* ═══════════════════════════════════════════════════════════════════════════════
   FORGOT PASSWORD PAGE - Unified Header, password reset form
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { AuthShell } from "@/components/auth"
import { Button } from "@/components/ui"
import { useLanguage } from "@/context/LanguageContext"
import { Suspense } from "react"

function ForgotPasswordForm() {
  const { t } = useLanguage()
  return (
    <AuthShell>
      {/* Card */}
      <div className="bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-2xl)] p-[var(--spacing-xl)] shadow-[var(--shadow-xl)]">
        {/* Header */}
        <div className="text-center mb-[var(--spacing-lg)]">
          <h1 className="text-[var(--font-size-2xl)] font-black tracking-tight text-[var(--fg)] mb-[var(--spacing-xs)]">
            {t("auth.forgotPasswordTitle")}
          </h1>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">{t("auth.noWorries")}</p>
        </div>

        {/* Form */}
        <form className="space-y-[var(--spacing-md)]">
          {/* Email */}
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("auth.email")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-30)]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full bg-[var(--color-brand-secondary)] !text-white hover:opacity-90"
          >
            {t("common.sendResetLink")}
          </Button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-[var(--font-size-xs)] text-[var(--fg-60)] mt-[var(--spacing-md)]">
          <a href="/login" className="link-blue text-[var(--font-size-xs)] hover:underline">
            {t("common.backToLogin")}
          </a>
        </p>
      </div>
    </AuthShell>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
