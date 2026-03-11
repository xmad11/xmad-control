/* ═══════════════════════════════════════════════════════════════════════════════
   MAPS MODULE - Barrel exports for lib/maps
   ═══════════════════════════════════════════════════════════════════════════════ */

export { MapboxMap } from "./components/MapboxMap"
export { useGeolocation } from "./hooks/useGeolocation"
export { calculateDistance, formatDistance } from "./utils/distance"
export type { Coordinate, RestaurantWithLocation } from "./utils/distance"
