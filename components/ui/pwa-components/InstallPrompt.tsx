/* ═══════════════════════════════════════════════════════════════════════════════
   INSTALL PROMPT COMPONENT - PWA installation prompt banner
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ArrowDownTrayIcon, DevicePhoneMobileIcon, XMarkIcon } from "@/components/icons"
import { useEffect, useState } from "react"

/**
 * Extended Navigator interface for iOS Safari standalone mode
 */
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Before Install Prompt Event Interface
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

/**
 * Install Prompt Props
 */
export interface InstallPromptProps {
  /** Additional CSS classes */
  className?: string
  /** Delay in milliseconds before showing the prompt (default: 3000ms) */
  delay?: number
}

/**
 * Install Prompt Component
 *
 * Displays a PWA installation prompt banner with:
 * - Delayed appearance after first visit
 * - Install/Later/Dismiss options
 * - LocalStorage dismissal tracking
 * - Mobile-responsive design
 *
 * @example
 * ```tsx
 * function Layout() {
 *   return (
 *     <>
 *       <InstallPrompt delay={5000} />
 *       {/* Other content *\/}
 *     </>
 *   )
 * }
 * ```
 */
export function InstallPrompt({ className = "", delay = 3000 }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const checkInstalled = () => {
      const isInStandaloneMode =
        ("standalone" in window.navigator &&
          (window.navigator as NavigatorWithStandalone).standalone) ||
        window.matchMedia("(display-mode: standalone)").matches

      setIsInstalled(isInStandaloneMode)
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()

      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, delay)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      console.log("PWA was installed")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [delay, isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    setIsInstalling(true)

    try {
      await deferredPrompt.prompt()

      const { outcome } = await deferredPrompt.userChoice

      console.log(`User response to the install prompt: ${outcome}`)

      if (outcome === "accepted") {
        setIsInstalled(true)
        setShowPrompt(false)
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error during PWA installation:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
  }

  const handleLater = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-later", Date.now().toString())
  }

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    const later = localStorage.getItem("pwa-install-later")

    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000

    if (dismissed && now - Number.parseInt(dismissed) < oneDay * 7) {
      setShowPrompt(false)
    } else if (later && now - Number.parseInt(later) < oneDay) {
      setShowPrompt(false)
    }
  }, [])

  if (isInstalled || !deferredPrompt || !showPrompt) {
    return null
  }

  return (
    <div
      className={`
				fixed bottom-[var(--spacing-md)] left-[var(--spacing-md)] right-[var(--spacing-md)]
				md:left-auto md:right-[var(--spacing-md)] md:w-[24rem]
				bg-[var(--color-white)] dark:bg-[var(--bg)]
				rounded-[var(--radius-lg)]
				shadow-[var(--shadow-lg)]
				border border-[var(--fg-10)]
				p-[var(--spacing-md)]
				z-[100]
				transform transition-all duration-[var(--duration-normal)]
				${className}
			`}
    >
      <div className="flex items-start gap-[var(--spacing-md)]">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className={`
							w-[3rem] h-[3rem]
							bg-[var(--color-accent-rust)]/10 dark:bg-[var(--color-accent-rust)]/20
							rounded-[var(--radius-md)]
							flex items-center justify-center
						`}
          >
            <DevicePhoneMobileIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-accent-rust)]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
							text-[var(--font-size-lg)] font-semibold
							text-[var(--fg)] dark:text-[var(--color-white)]
						`}
          >
            Install Shadi
          </h3>
          <p
            className={`
							text-[var(--font-size-sm)]
							text-[var(--fg-60)] dark:text-[var(--fg-30)]
							mt-[var(--spacing-xs)]
						`}
          >
            Install our app for faster access, offline browsing, and a better experience.
          </p>

          <div className="flex items-center gap-[var(--spacing-xs)] mt-[var(--spacing-sm)]">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className={`
								flex items-center gap-[var(--spacing-xs)]
								px-[var(--spacing-md)] py-[var(--spacing-xs)]
								bg-[var(--color-primary)]
								hover:bg-[var(--color-primary)]/90
								disabled:bg-[var(--color-primary)]/70
								text-[var(--color-white)]
								rounded-[var(--radius-md)]
								transition-opacity
								text-[var(--font-size-sm)] font-medium
								disabled:cursor-not-allowed
							`}
            >
              <ArrowDownTrayIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              <span>{isInstalling ? "Installing..." : "Install"}</span>
            </button>

            <button
              onClick={handleLater}
              className={`
								px-[var(--spacing-sm)] py-[var(--spacing-xs)]
								text-[var(--font-size-sm)]
								text-[var(--fg-60)] dark:text-[var(--fg-30)]
								hover:text-[var(--fg)] dark:hover:text-[var(--color-white)]
								transition-colors
							`}
            >
              Later
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className={`
						flex-shrink-0 p-1
						text-[var(--fg-30)]
						hover:text-[var(--fg-60)]
						dark:hover:text-[var(--fg-70)]
						transition-colors
					`}
          aria-label="Dismiss install prompt"
        >
          <XMarkIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
        </button>
      </div>
    </div>
  )
}

/**
 * PWA Install Hook
 *
 * Hook to check PWA installation status and handle installation
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canInstall, isInstalled, install } = usePWAInstall()
 *
 *   return (
 *     <button
 *       onClick={install}
 *       disabled={!canInstall || isInstalled}
 *     >
 *       {isInstalled ? 'Installed' : 'Install App'}
 *     </button>
 *   )
 * }
 * ```
 */
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const checkInstalled = () => {
      const isInStandaloneMode =
        ("standalone" in window.navigator &&
          (window.navigator as NavigatorWithStandalone).standalone) ||
        window.matchMedia("(display-mode: standalone)").matches

      setIsInstalled(isInStandaloneMode)
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) {
      return false
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      setDeferredPrompt(null)
      setCanInstall(false)

      return outcome === "accepted"
    } catch (error) {
      console.error("Error during PWA installation:", error)
      return false
    }
  }

  return {
    canInstall,
    isInstalled,
    install,
  }
}
