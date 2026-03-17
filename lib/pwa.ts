/* ═══════════════════════════════════════════════════════════════════════════════
   PWA UTILITIES - Install prompts, updates, and service worker management
   Glass morphism theme consistent with dashboard
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useEffect, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export interface UsePWAInstallReturn {
  isInstallable: boolean
  isInstalled: boolean
  promptInstall: () => Promise<void>
}

export interface UsePWAUpdateReturn {
  isUpdateAvailable: boolean
  isUpdating: boolean
  updateApp: () => Promise<void>
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to handle PWA installation prompts
 * Detects when the app can be installed and provides a method to show the prompt
 */
export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined" && "navigator" in window) {
      const checkInstalled = () => {
        setIsInstalled(
          window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true
        )
      }

      checkInstalled()

      // Listen for app install banner
      const handleBeforeInstall = (e: Event) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later
        setDeferredPrompt(e as any)
        console.log("[PWA] Install prompt available")
      }

      // Listen for successful install
      const handleAppInstalled = () => {
        setIsInstalled(true)
        setDeferredPrompt(null)
        console.log("[PWA] App was installed")
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstall)
      window.addEventListener("appinstalled", handleAppInstalled)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
        window.removeEventListener("appinstalled", handleAppInstalled)
      }
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn("[PWA] Install prompt not available")
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[PWA] User accepted the install prompt")
    } else {
      console.log("[PWA] User dismissed the install prompt")
    }

    // Clear the deferred prompt
    setDeferredPrompt(null)
  }

  return {
    isInstallable: deferredPrompt !== null,
    isInstalled,
    promptInstall,
  }
}

/**
 * Hook to handle PWA updates
 * Detects when a new version is available and provides a method to update
 */
export function usePWAUpdate(): UsePWAUpdateReturn {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    // Listen for custom event dispatched by service worker
    const handleUpdateAvailable = () => {
      console.log("[PWA] Update available")
      setIsUpdateAvailable(true)

      // Get the waiting service worker
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setWaitingWorker(registration.waiting)
        }
      })
    }

    window.addEventListener("sw-update-available", handleUpdateAvailable)

    // Check for waiting service worker on load
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setIsUpdateAvailable(true)
        setWaitingWorker(registration.waiting)
      }

      // Listen for controller changes (new service worker activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Reload the page to use the new service worker
        window.location.reload()
      })
    })

    return () => {
      window.removeEventListener("sw-update-available", handleUpdateAvailable)
    }
  }, [])

  const updateApp = async () => {
    if (!waitingWorker) {
      console.warn("[PWA] No waiting service worker")
      return
    }

    setIsUpdating(true)

    // Tell the waiting service worker to skip waiting
    waitingWorker.postMessage({ action: "SKIP_WAITING" })

    // The controllerchange event will trigger a page reload
  }

  return {
    isUpdateAvailable,
    isUpdating,
    updateApp,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE WORKER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register the service worker
 * Call this in your app initialization
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("[PWA] Service Worker not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    console.log("[PWA] Service Worker registered:", registration.scope)

    // Request notification permission
    if ("Notification" in window) {
      await Notification.requestPermission()
    }

    return registration
  } catch (error) {
    console.error("[PWA] Service Worker registration failed:", error)
    return null
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()

    await Promise.all(registrations.map((registration) => registration.unregister()))

    console.log("[PWA] Service Workers unregistered")
  } catch (error) {
    console.error("[PWA] Service Worker unregistration failed:", error)
  }
}

/**
 * Get the current service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    return registration ?? null
  } catch (error) {
    console.error("[PWA] Failed to get Service Worker registration:", error)
    return null
  }
}

/**
 * Check if the app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  )
}

/**
 * Clear all caches
 */
export async function clearCaches(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return
  }

  try {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))
    console.log("[PWA] All caches cleared")
  } catch (error) {
    console.error("[PWA] Failed to clear caches:", error)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if notifications are supported and permission is granted
 */
export function canShowNotifications(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false
  }

  return Notification.permission === "granted"
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }

  if (Notification.permission === "default") {
    return await Notification.requestPermission()
  }

  return Notification.permission
}

/**
 * Show a notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!canShowNotifications()) {
    console.warn("[PWA] Notifications not available")
    return
  }

  const registration = await getServiceWorkerRegistration()
  if (registration) {
    await registration.showNotification(title, {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      ...options,
    })
  } else {
    // Fallback to browser notification
    new Notification(title, {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      ...options,
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cache specific URLs
 */
export async function cacheUrls(urls: string[]): Promise<void> {
  const registration = await getServiceWorkerRegistration()
  if (!registration || !registration.active) {
    console.warn("[PWA] No active service worker")
    return
  }

  registration.active.postMessage({
    action: "CACHE_URLS",
    payload: { urls },
  })
}

/**
 * Clear all caches via service worker
 */
export async function clearCacheViaWorker(): Promise<void> {
  const registration = await getServiceWorkerRegistration()
  if (!registration || !registration.active) {
    console.warn("[PWA] No active service worker")
    return
  }

  registration.active.postMessage({ action: "CLEAR_CACHE" })
}
