import { Spinner } from "./Spinner"

/**
 * Standard loading fallback for Suspense boundaries in routes.
 * Token-based styling, accessible, reusable.
 */
export function PageLoadingFallback() {
  return (
    <div
      className="flex min-h-[var(--layout-min-height)] items-center justify-center bg-[rgb(var(--bg))]"
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner size="lg" />
    </div>
  )
}
