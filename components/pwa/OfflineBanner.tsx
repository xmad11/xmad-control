"use client"

import { ArrowPathIcon, WifiIcon } from "@/components/icons"
import { XMarkIcon } from "@/components/icons"
import { useLanguage } from "@/context/LanguageContext"
import { useEffect, useState } from "react"

export interface OfflineBannerProps {
  className?: string
  healthCheckUrl?: string
}

export function OfflineBanner({
  className = "",
  healthCheckUrl = "/api/health",
}: OfflineBannerProps) {
  const { t } = useLanguage()
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)

    try {
      const response = await fetch(healthCheckUrl, {
        method: "HEAD",
        cache: "no-cache",
      })

      if (response.ok) {
        setIsOnline(true)
        setShowBanner(true)
        setTimeout(() => setShowBanner(false), 3000)
      }
    } catch (error) {
      console.error("Network check failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div
      className={`
				fixed top-0 left-0 right-0 z-[100]
				p-[var(--spacing-md)]
				transition-all duration-[var(--duration-normal)]
				${isOnline ? "bg-[var(--color-success)]" : "bg-[var(--color-primary)]"}
				text-[var(--color-white)]
				${className}
			`}
    >
      <div className="max-w-[84rem] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <WifiIcon className="w-[1.25rem] h-[1.25rem]" />
          <div>
            <p className="font-medium text-[var(--font-size-sm)]">
              {isOnline ? "You're back online!" : "You're currently offline"}
            </p>
            {!isOnline && (
              <p className="text-[var(--font-size-xs)] opacity-90">
                Some features may be limited. Cached content is available.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[var(--spacing-xs)]">
          {!isOnline && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className={`
								flex items-center gap-[var(--spacing-xs)]
								px-[var(--spacing-sm)] py-[var(--spacing-xs)]
								bg-[var(--color-white)]/20
								hover:bg-[var(--color-white)]/30
								rounded-[var(--radius-md)]
								transition-opacity
								disabled:opacity-50
							`}
            >
              <ArrowPathIcon
                className={isRetrying ? "animate-spin w-[1rem] h-[1rem]" : "w-[1rem] h-[1rem]"}
              />
              <span className="text-[var(--font-size-sm)]">{t("common.retry")}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className={`
							p-1
							hover:bg-[var(--color-white)]/20
							rounded-[var(--radius-md)]
							transition-colors
						`}
            aria-label="Dismiss notification"
          >
            <XMarkIcon className="w-[1rem] h-[1rem]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}
