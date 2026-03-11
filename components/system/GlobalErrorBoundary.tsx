"use client"

import { useEffect, useState } from "react"

/**
 * Global error boundary for production resilience.
 * Token-based styling, accessible, recoverable with auto-retry countdown.
 */
export function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) {
      reset()
      return
    }

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, reset])

  return (
    <div
      className="flex min-h-[var(--layout-min-height)] items-center justify-center px-[var(--spacing-lg)]"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-[var(--max-w-xl)] text-center space-y-[var(--spacing-md)]">
        <h1 className="text-[var(--font-size-xl)] font-semibold text-[rgb(var(--fg))]">
          Something went wrong
        </h1>

        <p className="text-[var(--font-size-sm)] text-[rgb(var(--fg))] opacity-80">
          {error.digest ?? "Unexpected error"}
        </p>

        <button
          type="button"
          onClick={reset}
          className="w-full rounded-[var(--radius-md)] bg-[rgb(var(--color-primary))] px-[var(--spacing-md)] py-[var(--spacing-sm)] min-h-11 text-[var(--font-size-md)] text-[rgb(var(--color-white))] hover:opacity-90 transition-opacity duration-[var(--duration-fast)]"
        >
          Try again now
        </button>

        <p className="text-[var(--font-size-xs)] text-[rgb(var(--fg))] opacity-60">
          Auto retry in {countdown}s…
        </p>
      </div>
    </div>
  )
}
