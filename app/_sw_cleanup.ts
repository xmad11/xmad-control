/* ═══════════════════════════════════════════════════════════════════════════════
   SERVICE WORKER CLEANUP - DEV ONLY
   Forcefully unregisters ALL Service Workers to prevent iOS refresh loop
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister()
      console.log("Service Worker unregistered:", registration.scope)
    })
  })
}
