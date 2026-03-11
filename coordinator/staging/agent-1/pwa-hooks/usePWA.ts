/* ═══════════════════════════════════════════════════════════════════════════════
   PWA HOOKS - Progressive Web App functionality for offline support
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useEffect, useState } from "react"
import {
  type BeforeInstallPromptEvent,
  CacheManager,
  IndexedDBManager,
  applyPendingUpdates,
  checkForUpdates,
  getDeviceInfo,
  getNetworkInfo,
  getNotificationPermission,
  isPWAInstalled,
  // DEV ONLY: Service Worker disabled
  registerServiceWorker,
  requestNotificationPermission,
  showNotification,
  supportsInstallPrompt,
  supportsPWA,
  // DEV ONLY: Service Worker disabled
  unregisterServiceWorker,
} from "./utils"

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Pending action for offline-to-online sync
 */
interface PendingAction {
  id: string
  type: string
  timestamp: number
  [key: string]: unknown
}

/**
 * Restaurant data structure
 */
interface Restaurant {
  id: string | number
  name: string
  [key: string]: unknown
}

/**
 * Cached restaurant with timestamp
 */
interface CachedRestaurant extends Restaurant {
  lastUpdated: number
}

/**
 * Return type for usePWA hook
 */
interface UsePWAReturn {
  // PWA Status
  isInstalled: boolean
  isSupported: boolean
  canInstall: boolean
  isOnline: boolean

  // Installation
  deferredPrompt: BeforeInstallPromptEvent | null
  install: () => Promise<boolean>

  // Service Worker
  swRegistration: ServiceWorkerRegistration | null
  registerSW: () => Promise<ServiceWorkerRegistration | null>
  unregisterSW: () => Promise<boolean>
  updateAvailable: boolean
  checkUpdates: () => Promise<boolean>
  applyUpdates: () => void

  // Notifications
  notificationPermission: NotificationPermission
  requestNotificationPermission: () => Promise<NotificationPermission>
  showNotification: (title: string, options?: NotificationOptions) => Notification | null

  // Network & Device Info
  networkInfo: ReturnType<typeof getNetworkInfo>
  deviceInfo: ReturnType<typeof getDeviceInfo>

  // Offline Storage
  dbManager: IndexedDBManager
  clearCache: (cacheName: string) => Promise<boolean>

  // Actions
  refresh: () => void
}

/**
 * PWA Hook - Complete PWA functionality
 */
export function usePWA(): UsePWAReturn {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default")

  const [networkInfo, setNetworkInfo] = useState<ReturnType<typeof getNetworkInfo>>({
    online: true,
  })
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo>>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    platform: "unknown",
  })

  const [dbManager] = useState(() => new IndexedDBManager("ShadiRestaurantDB", 1))

  useEffect(() => {
    if (typeof window === "undefined") return

    setIsInstalled(isPWAInstalled())
    setIsSupported(supportsPWA())
    setCanInstall(supportsInstallPrompt())
    setIsOnline(navigator.onLine)
    setNetworkInfo(getNetworkInfo())
    setDeviceInfo(getDeviceInfo())

    getNotificationPermission().then(setNotificationPermission)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => {
      setIsOnline(true)
      setNetworkInfo(getNetworkInfo())
    }

    const handleOffline = () => {
      setIsOnline(false)
      setNetworkInfo(getNetworkInfo())
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setCanInstall(false)
      console.log("PWA was installed")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !isSupported) return

    // DEV ONLY: Service Worker disabled
    registerServiceWorker().then((registration) => {
      if (registration) {
        setSwRegistration(registration)

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
      }
    })
  }, [isSupported])

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      setDeferredPrompt(null)
      setCanInstall(false)

      if (outcome === "accepted") {
        setIsInstalled(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Error during PWA installation:", error)
      return false
    }
  }, [deferredPrompt])

  const registerSW = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    // DEV ONLY: Service Worker disabled
    const registration = await registerServiceWorker()
    setSwRegistration(registration)
    return registration
  }, [])

  const unregisterSW = useCallback(async (): Promise<boolean> => {
    // DEV ONLY: Service Worker disabled
    const result = await unregisterServiceWorker()
    setSwRegistration(null)
    return result
  }, [])

  const checkUpdates = useCallback(async (): Promise<boolean> => {
    const hasUpdate = await checkForUpdates()
    setUpdateAvailable(hasUpdate)
    return hasUpdate
  }, [])

  const applyUpdates = useCallback(() => {
    applyPendingUpdates()
    setUpdateAvailable(false)
  }, [])

  const requestNotificationPerm = useCallback(async (): Promise<NotificationPermission> => {
    const permission = await requestNotificationPermission()
    setNotificationPermission(permission)
    return permission
  }, [])

  const showNotificationLocal = useCallback(
    (title: string, options?: NotificationOptions): Notification | null => {
      return showNotification(title, options)
    },
    []
  )

  const clearCache = useCallback(async (cacheName: string): Promise<boolean> => {
    return CacheManager.clearCache(cacheName)
  }, [])

  const refresh = useCallback(() => {
    setIsInstalled(isPWAInstalled())
    setIsSupported(supportsPWA())
    setCanInstall(supportsInstallPrompt())
    setIsOnline(navigator.onLine)
    setNetworkInfo(getNetworkInfo())
    setDeviceInfo(getDeviceInfo())
  }, [])

  return {
    isInstalled,
    isSupported,
    canInstall,
    isOnline,
    deferredPrompt,
    install,
    swRegistration,
    registerSW,
    unregisterSW,
    updateAvailable,
    checkUpdates,
    applyUpdates,
    notificationPermission,
    requestNotificationPermission: requestNotificationPerm,
    showNotification: showNotificationLocal,
    networkInfo,
    deviceInfo,
    dbManager,
    clearCache,
    refresh,
  }
}

/**
 * Offline Actions Hook
 */
export function useOfflineActions() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const dbManager = new IndexedDBManager("ShadiRestaurantDB", 1)

  useEffect(() => {
    dbManager.getAll<PendingAction>("pendingActions").then(setPendingActions)
  }, [dbManager])

  const addPendingAction = useCallback(
    async (action: Omit<PendingAction, "id" | "timestamp">) => {
      const actionWithTimestamp: PendingAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }

      await dbManager.add("pendingActions", actionWithTimestamp)
      setPendingActions((prev) => [...prev, actionWithTimestamp])
    },
    [dbManager]
  )

  const removePendingAction = useCallback(
    async (id: string) => {
      await dbManager.delete("pendingActions", id)
      setPendingActions((prev) => prev.filter((action) => action.id !== id))
    },
    [dbManager]
  )

  const clearPendingActions = useCallback(async () => {
    await dbManager.clear("pendingActions")
    setPendingActions([])
  }, [dbManager])

  return {
    pendingActions,
    addPendingAction,
    removePendingAction,
    clearPendingActions,
  }
}

/**
 * Offline Favorites Hook
 */
export function useOfflineFavorites() {
  const [favorites, setFavorites] = useState<Restaurant[]>([])
  const dbManager = new IndexedDBManager("ShadiRestaurantDB", 1)

  useEffect(() => {
    dbManager.getAll<Restaurant>("favorites").then(setFavorites)
  }, [dbManager])

  const addFavorite = useCallback(
    async (restaurant: Restaurant) => {
      await dbManager.add("favorites", restaurant)
      setFavorites((prev) => [...prev, restaurant])
    },
    [dbManager]
  )

  const removeFavorite = useCallback(
    async (id: string | number) => {
      await dbManager.delete("favorites", id)
      setFavorites((prev) => prev.filter((fav) => fav.id !== id))
    },
    [dbManager]
  )

  const isFavorite = useCallback(
    (id: string | number) => {
      return favorites.some((fav) => fav.id === id)
    },
    [favorites]
  )

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}

/**
 * Cached Restaurants Hook
 */
export function useCachedRestaurants() {
  const [restaurants, setRestaurants] = useState<CachedRestaurant[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const dbManager = new IndexedDBManager("ShadiRestaurantDB", 1)

  useEffect(() => {
    dbManager.getAll<CachedRestaurant>("cachedRestaurants").then((data) => {
      setRestaurants(data)
      if (data.length > 0) {
        setLastUpdated(new Date(data[0].lastUpdated || Date.now()))
      }
    })
  }, [dbManager])

  const cacheRestaurants = useCallback(
    async (newRestaurants: Restaurant[]) => {
      await dbManager.clear("cachedRestaurants")

      const restaurantsWithTimestamp: CachedRestaurant[] = newRestaurants.map((restaurant) => ({
        ...restaurant,
        lastUpdated: Date.now(),
      }))

      for (const restaurant of restaurantsWithTimestamp) {
        await dbManager.add("cachedRestaurants", restaurant)
      }

      setRestaurants(restaurantsWithTimestamp)
      setLastUpdated(new Date())
    },
    [dbManager]
  )

  const clearCache = useCallback(async () => {
    await dbManager.clear("cachedRestaurants")
    setRestaurants([])
    setLastUpdated(null)
  }, [dbManager])

  return {
    restaurants,
    lastUpdated,
    cacheRestaurants,
    clearCache,
  }
}
