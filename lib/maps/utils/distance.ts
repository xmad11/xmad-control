/* ═══════════════════════════════════════════════════════════════════════════════
   DISTANCE UTILITY - Haversine formula for distance calculation
   Calculates distance between two coordinates in km/meters
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 - First coordinate [longitude, latitude]
 * @param coord2 - Second coordinate [longitude, latitude]
 * @returns Distance in kilometers
 *
 * Source: https://en.wikipedia.org/wiki/Haversine_formula
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lng1, lat1] = coord1
  const [lng2, lat2] = coord2

  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Format distance for display
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string (e.g., "450 m", "2.3 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000)
    return `${meters} m`
  }

  return `${distanceKm.toFixed(1)} km`
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Coordinate type for locations
 */
export type Coordinate = [number, number] // [longitude, latitude]

/**
 * Restaurant with location
 */
export interface RestaurantWithLocation {
  id: string
  name: string
  coordinates: Coordinate
}
