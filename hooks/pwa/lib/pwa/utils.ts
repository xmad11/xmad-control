/**
 * PWA Utility Functions
 *
 * Complete PWA support for Shadi V2 including:
 * - Service Worker management
 * - Push notifications
 * - IndexedDB storage
 * - Cache management
 * - Network/device detection
 */

// ============================================================================
// TYPES
// ============================================================================

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export interface PendingAction {
  id: string
  timestamp: number
  type: string
  data: unknown
}

export interface NetworkInfo {
  online: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  platform: string
}

// ============================================================================
// PWA INSTALLATION DETECTION
// ============================================================================

/**
 * Check if the app is running in standalone mode (PWA installed)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false

  return (
    // iOS Safari
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone) ||
    // Chrome on Android
    window.matchMedia("(display-mode: standalone)").matches ||
    // Edge
    window.matchMedia("(display-mode: minimal-ui)").matches
  )
}

/**
 * Check if the browser supports PWA features
 */
export function supportsPWA(): boolean {
  if (typeof window === "undefined") return false

  return "serviceWorker" in navigator && "PushManager" in window
}

/**
 * Check if the browser supports install prompt
 */
export function supportsInstallPrompt(): boolean {
  if (typeof window === "undefined") return false

  return "BeforeInstallPromptEvent" in window
}

// ============================================================================
// SERVICE WORKER MANAGEMENT
// ============================================================================

/**
 * Register service worker
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
            // Note: Removed confirm() for better UX - should use UI component
            console.log("New content available")
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

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration,
  serverPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(serverPublicKey),
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
 * Check notification permission
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }

  return Notification.permission
}

/**
 * Request notification permission
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
 */
export function showLocalNotification(
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

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Cache Manager for service worker caches
 */
export class CacheManager {
  /**
   * Clear all items in a specific cache
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
   * Get the number of items in a cache
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
   * List all cache names
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

// ============================================================================
// INDEXEDDB STORAGE
// ============================================================================

/**
 * IndexedDB Manager for offline data storage
 * Handles favorites, pending actions, and cached restaurants
 */
export class IndexedDBManager {
  private dbName: string
  private version: number
  private db: IDBDatabase | null = null

  constructor(dbName: string, version = 1) {
    this.dbName = dbName
    this.version = version
  }

  /**
   * Initialize database connection
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
   * Add item to a store
   */
  async add(storeName: string, data: unknown): Promise<void> {
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
   * Update item in a store
   */
  async update(storeName: string, data: Record<string, unknown>): Promise<void> {
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
   * Get item from a store
   */
  async get(storeName: string, id: string | number): Promise<unknown> {
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
   * Get all items from a store
   */
  async getAll(storeName: string): Promise<unknown[]> {
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
   * Delete item from a store
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
   * Clear all items from a store
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert VAPID public key from URL-safe base64 to Uint8Array
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
 * Get current network information
 */
export function getNetworkInfo(): NetworkInfo {
  if (typeof window === "undefined" || !("navigator" in window)) {
    return { online: false }
  }

  const connection =
    (
      navigator as {
        connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean }
      }
    ).connection ||
    (
      navigator as {
        mozConnection?: {
          effectiveType?: string
          downlink?: number
          rtt?: number
          saveData?: boolean
        }
      }
    ).mozConnection ||
    (
      navigator as {
        webkitConnection?: {
          effectiveType?: string
          downlink?: number
          rtt?: number
          saveData?: boolean
        }
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
 */
export function getDeviceInfo(): DeviceInfo {
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
 */
export function getAppVersion(): string {
  if (typeof window === "undefined") return "unknown"

  const versionElement = document.querySelector('meta[name="version"]')
  return versionElement?.getAttribute("content") || "unknown"
}

/**
 * Check for service worker updates
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
 */
export function applyPendingUpdates(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  navigator.serviceWorker.ready.then((registration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  })
}

/**
 * Show notification (alias for showLocalNotification)
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  return showLocalNotification(title, options)
}
