/* ═══════════════════════════════════════════════════════════════════════════════
   SERVICE WORKER - PWA Caching & Offline Support
   Glass morphism theme consistent with dashboard
   ═══════════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = "v1"
const CACHE_NAME = `xmad-control-${CACHE_VERSION}`

// Assets to cache immediately on install
const PRECACHE_ASSETS = ["/", "/dashboard", "/manifest.json", "/icon-192.png", "/icon-512.png"]

// Cache strategy for different asset types
const CACHE_STRATEGIES = {
  // Static assets - cache first, network fallback
  static: [
    /\.js$/,
    /\.css$/,
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.svg$/,
    /\.ico$/,
    /\.woff2?$/,
    /\.ttf$/,
    /\.eot$/,
  ],

  // API routes - network first, cache fallback
  api: [/^\/api\//],

  // Pages - network first, cache fallback
  pages: [/^\/dashboard/],
}

// Install event - precache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...", CACHE_VERSION)

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      console.log("[SW] Precaching assets:", PRECACHE_ASSETS)
      await cache.addAll(PRECACHE_ASSETS)

      // Skip waiting to activate immediately
      self.skipWaiting()
    })()
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...", CACHE_VERSION)

  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys()
      const oldCaches = cacheNames.filter(
        (name) => name.startsWith("xmad-control-") && name !== CACHE_NAME
      )

      if (oldCaches.length > 0) {
        console.log("[SW] Deleting old caches:", oldCaches)
        await Promise.all(oldCaches.map((name) => caches.delete(name)))
      }

      // Take control of all pages immediately
      await self.clients.claim()
    })()
  )
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests (different origin)
  if (url.origin !== self.location.origin) return

  // Determine cache strategy
  let strategy = "networkFirst"

  // Static assets - cache first
  if (CACHE_STRATEGIES.static.some((pattern) => pattern.test(url.pathname))) {
    strategy = "cacheFirst"
  }

  // API routes - network first with short timeout
  if (CACHE_STRATEGIES.api.some((pattern) => pattern.test(url.pathname))) {
    strategy = "networkFirst"
  }

  // Pages - network first, cache fallback
  if (CACHE_STRATEGIES.pages.some((pattern) => pattern.test(url.pathname))) {
    strategy = "networkFirst"
  }

  // Apply strategy
  if (strategy === "cacheFirst") {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)

  if (cached) {
    console.log("[SW] Cache hit:", request.url)
    return cached
  }

  console.log("[SW] Cache miss, fetching:", request.url)
  const response = await fetch(request)

  // Cache successful responses
  if (response.ok) {
    cache.put(request, response.clone())
  }

  return response
}

// Network First Strategy - for API and dynamic content
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    console.log("[SW] Network first:", request.url)

    // Try network with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), 3000)),
    ])

    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (_error) {
    console.log("[SW] Network failed, trying cache:", request.url)

    // Fallback to cache
    const cached = await cache.match(request)

    if (cached) {
      return cached
    }

    // Return offline fallback for pages
    if (request.destination === "document") {
      return caches.match("/offline")
    }

    // Return error for other requests
    return new Response("Network error", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    })
  }
}

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  const { action, payload } = event.data

  switch (action) {
    case "SKIP_WAITING":
      self.skipWaiting()
      break

    case "CACHE_URLS":
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME)
          await cache.addAll(payload.urls)
        })()
      )
      break

    case "CLEAR_CACHE":
      event.waitUntil(
        (async () => {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map((name) => caches.delete(name)))
        })()
      )
      break

    default:
      console.warn("[SW] Unknown message action:", action)
  }
})

// Push notification support (optional - for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/dashboard",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title || "XMAD Control", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(self.clients.openWindow(event.notification.data.url || "/dashboard"))
})

console.log("[SW] Service worker loaded:", CACHE_VERSION)
