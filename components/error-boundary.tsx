/* ═══════════════════════════════════════════════════════════════════════════════
   ERROR BOUNDARY — XMAD Dashboard
   React Error Boundary for graceful error handling
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, retry: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback(this.state.error, this.handleRetry)
          : this.props.fallback
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT ERROR FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

interface DefaultErrorFallbackProps {
  error: Error
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <div className="max-w-md w-full p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="Warning icon"
            >
              <title>Warning</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
            <p className="text-sm text-white/60">An error occurred while rendering this surface</p>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 font-mono break-words">{error.message}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={retry}
            className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 transition-colors text-sm font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SURFACE ERROR BOUNDARY (Specialized for surfaces)
// ═══════════════════════════════════════════════════════════════════════════════

interface SurfaceErrorBoundaryProps {
  surfaceId: string
  children: ReactNode
}

export function SurfaceErrorBoundary({ surfaceId, children }: SurfaceErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(_error, retry) => (
        <div className="flex items-center justify-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Surface "{surfaceId}" failed to load</p>
            <button
              type="button"
              onClick={retry}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
