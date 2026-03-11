// ═══════════════════════════════════════════════════════════════════════════════
// PWA UTILITY FUNCTIONS
// Progressive Web App utilities for offline support, service workers, and more
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extended Navigator interface for iOS Safari standalone mode
 */
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Extended Navigator interface for Network Information API
 */
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }
}

/**
 * Before Install Prompt Event Interface
 * Custom event type for PWA installation prompt
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

/**
 * Check if the app is running in standalone mode (PWA)
 * @returns {boolean} True if app is installed as PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false

  return (
    // iOS Safari
    ("standalone" in window.navigator &&
      (window.navigator as NavigatorWithStandalone).standalone) ||
    // Chrome on Android
    window.matchMedia("(display-mode: standalone)").matches ||
    // Edge
    window.matchMedia("(display-mode: minimal-ui)").matches
  )
}

/**
 * Check if the browser supports PWA features
 * @returns {boolean} True if PWA features are supported
 */
export function supportsPWA(): boolean {
  if (typeof window === "undefined") return false

  return "serviceWorker" in navigator && "PushManager" in window
}

/**
 * Check if the browser supports install prompt
 * @returns {boolean} True if install prompt is supported
 */
export function supportsInstallPrompt(): boolean {
  if (typeof window === "undefined") return false

  return "BeforeInstallPromptEvent" in window
}

/**
 * Register service worker
 * @returns {Promise<ServiceWorkerRegistration | null>} Service worker registration or null
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    console.log("Service Worker registered successfully:", registration)

    // Check for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New content is available
            if (confirm("New content is available. Would you like to refresh?")) {
              // window.location.reload() // DISABLED: Prevents auto-refresh loop
            }
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

/**
 * Unregister service worker
 * @returns {Promise<boolean>} True if unregistration was successful
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const result = await registration.unregister()
    console.log("Service Worker unregistered:", result)
    return result
  } catch (error) {
    console.error("Service Worker unregistration failed:", error)
    return false
  }
}

/**
 * Subscribe to push notifications
 * @param {ServiceWorkerRegistration} registration - Service worker registration
 * @param {string} serverPublicKey - VAPID public key
 * @returns {Promise<PushSubscription | null>} Push subscription or null
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration,
  serverPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // Note: applicationServerKey expects Uint8Array, but type casting is acceptable here
      // as urlBase64ToUint8Array returns the correct type
      applicationServerKey: urlBase64ToUint8Array(serverPublicKey) as unknown as BufferSource,
    })

    console.log("Push notification subscription successful:", subscription)
    return subscription
  } catch (error) {
    console.error("Push notification subscription failed:", error)
    return null
  }
}

/**
 * Unsubscribe from push notifications
 * @param {PushSubscription} subscription - Push subscription to cancel
 * @returns {Promise<boolean>} True if unsubscription was successful
 */
export async function unsubscribeFromPushNotifications(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    const result = await subscription.unsubscribe()
    console.log("Push notification unsubscription successful:", result)
    return result
  } catch (error) {
    console.error("Push notification unsubscription failed:", error)
    return false
  }
}

/**
 * Get notification permission status
 * @returns {Promise<NotificationPermission>} Current permission status
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }

  return Notification.permission
}

/**
 * Request notification permission
 * @returns {Promise<NotificationPermission>} Granted permission status
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }

  try {
    const permission = await Notification.requestPermission()
    console.log("Notification permission:", permission)
    return permission
  } catch (error) {
    console.error("Notification permission request failed:", error)
    return "denied"
  }
}

/**
 * Show local notification
 * @param {string} title - Notification title
 * @param {NotificationOptions} options - Notification options
 * @returns {Notification | null} Notification object or null
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted")
    return null
  }

  try {
    return new Notification(title, {
      icon: "/icons/icon-192x192.svg",
      badge: "/icons/icon-72x72.svg",
      ...options,
    })
  } catch (error) {
    console.error("Failed to show notification:", error)
    return null
  }
}

/**
 * Cache Manager for service worker cache operations
 */
export class CacheManager {
  /**
   * Clear all entries in a specific cache
   * @param {string} cacheName - Name of the cache to clear
   * @returns {Promise<boolean>} True if cache was cleared successfully
   */
  static async clearCache(cacheName: string): Promise<boolean> {
    try {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      await Promise.all(keys.map((key) => cache.delete(key)))
      return true
    } catch (error) {
      console.error(`Failed to clear cache ${cacheName}:`, error)
      return false
    }
  }

  /**
   * Get the number of entries in a cache
   * @param {string} cacheName - Name of the cache
   * @returns {Promise<number>} Number of cached entries
   */
  static async getCacheSize(cacheName: string): Promise<number> {
    try {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      return keys.length
    } catch (error) {
      console.error(`Failed to get cache size for ${cacheName}:`, error)
      return 0
    }
  }

  /**
   * List all available caches
   * @returns {Promise<string[]>} Array of cache names
   */
  static async listCaches(): Promise<string[]> {
    try {
      return await caches.keys()
    } catch (error) {
      console.error("Failed to list caches:", error)
      return []
    }
  }

  /**
   * Delete a specific cache
   * @param {string} cacheName - Name of the cache to delete
   * @returns {Promise<boolean>} True if cache was deleted successfully
   */
  static async deleteCache(cacheName: string): Promise<boolean> {
    try {
      return await caches.delete(cacheName)
    } catch (error) {
      console.error(`Failed to delete cache ${cacheName}:`, error)
      return false
    }
  }
}

/**
 * IndexedDB Manager for offline data storage
 * Provides a simple API for storing and retrieving data offline
 */
export class IndexedDBManager {
  private dbName: string
  private version: number
  private db: IDBDatabase | null = null

  /**
   * Create a new IndexedDB manager
   * @param {string} dbName - Name of the database
   * @param {number} version - Database schema version
   */
  constructor(dbName: string, version = 1) {
    this.dbName = dbName
    this.version = version
  }

  /**
   * Initialize the database
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores for offline functionality
        if (!db.objectStoreNames.contains("favorites")) {
          db.createObjectStore("favorites", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("pendingActions")) {
          const store = db.createObjectStore("pendingActions", {
            keyPath: "id",
          })
          store.createIndex("type", "type", { unique: false })
          store.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("cachedRestaurants")) {
          db.createObjectStore("cachedRestaurants", { keyPath: "id" })
        }
      }
    })
  }

  /**
   * Add data to an object store
   * @param {string} storeName - Name of the object store
   * @param {T} data - Data to add
   * @returns {Promise<void>}
   */
  async add<T = unknown>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Update data in an object store
   * @param {string} storeName - Name of the object store
   * @param {T} data - Data to update
   * @returns {Promise<void>}
   */
  async update<T = unknown>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Get data from an object store
   * @param {string} storeName - Name of the object store
   * @param {string | number} id - ID of the data to retrieve
   * @returns {Promise<T>} Retrieved data
   */
  async get<T = unknown>(storeName: string, id: string | number): Promise<T> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  /**
   * Get all data from an object store
   * @param {string} storeName - Name of the object store
   * @returns {Promise<T[]>} Array of all data
   */
  async getAll<T = unknown>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  /**
   * Delete data from an object store
   * @param {string} storeName - Name of the object store
   * @param {string | number} id - ID of the data to delete
   * @returns {Promise<void>}
   */
  async delete(storeName: string, id: string | number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Clear all data from an object store
   * @param {string} storeName - Name of the object store
   * @returns {Promise<void>}
   */
  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

/**
 * Utility function to convert VAPID public key to Uint8Array
 * @param {string} base64String - Base64 encoded string
 * @returns {Uint8Array} Converted bytes
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * Get network information
 * @returns {{ online: boolean; effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean }}
 */
export function getNetworkInfo(): {
  online: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
} {
  if (typeof window === "undefined" || !("navigator" in window)) {
    return { online: false }
  }

  const connection =
    (navigator as NavigatorWithConnection).connection ||
    (
      navigator as NavigatorWithConnection & {
        mozConnection?: NavigatorWithConnection["connection"]
      }
    ).mozConnection ||
    (
      navigator as NavigatorWithConnection & {
        webkitConnection?: NavigatorWithConnection["connection"]
      }
    ).webkitConnection

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  }
}

/**
 * Get device information
 * @returns {{ isMobile: boolean; isTablet: boolean; isDesktop: boolean; platform: string }}
 */
export function getDeviceInfo(): {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  platform: string
} {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      platform: "unknown",
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  return {
    isMobile,
    isTablet,
    isDesktop,
    platform: navigator.platform,
  }
}

/**
 * Get app version from meta tag
 * @returns {string} App version
 */
export function getAppVersion(): string {
  if (typeof window === "undefined") return "unknown"

  const versionElement = document.querySelector('meta[name="version"]')
  return versionElement?.getAttribute("content") || "unknown"
}

/**
 * Check for app updates
 * @returns {Promise<boolean>} True if update is available
 */
export async function checkForUpdates(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.update()

    // Check if there's a waiting service worker
    return !!registration.waiting
  } catch (error) {
    console.error("Failed to check for updates:", error)
    return false
  }
}

/**
 * Apply pending service worker updates
 * Forces the waiting service worker to become active
 */
export function applyPendingUpdates(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  navigator.serviceWorker.ready.then((registration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      // window.location.reload() // DISABLED: Prevents auto-refresh loop
    }
  })
}
