/* ═══════════════════════════════════════════════════════════════════════════════
   MAPBOX MAP - Minimal map component for restaurant markers
   UI only - No business logic, SSOT-compliant
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { Coordinate, RestaurantWithLocation } from "../utils/distance"

// @design-exception EXTERNAL_LIBRARY: mapbox-gl CSS imported from package
import "mapbox-gl/dist/mapbox-gl.css"

export interface MapboxMapProps {
  restaurants: RestaurantWithLocation[]
  center?: Coordinate
  zoom?: number
  className?: string
  userLocation?: Coordinate
  onRestaurantClick?: (restaurant: RestaurantWithLocation) => void
}

// Client-side only map component to avoid SSR issues
function MapboxMapClient({
  restaurants,
  center = [54.4926, 24.5216], // Default to Abu Dhabi coordinates
  zoom = 12,
  className = "",
  userLocation,
  onRestaurantClick,
}: MapboxMapProps) {
  const [map, setMap] = useState<any>(null)
  const [mapboxgl, setMapboxgl] = useState<any>(null)
  const [mapReady, setMapReady] = useState(false)

  // Get Mapbox token from environment
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // Dynamically import mapbox-gl on client side
  useEffect(() => {
    if (typeof window === "undefined") return

    import("mapbox-gl").then((mod) => {
      setMapboxgl(mod.default || mod)
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapboxgl || typeof window === "undefined" || !mapboxToken) return

    try {
      // @design-exception EXTERNAL_LIBRARY: mapboxgl.Map constructor requires new keyword
      const mapInstance = new mapboxgl.Map({
        container: "map-container",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center[0], center[1]],
        zoom,
        accessToken: mapboxToken,
      })

      mapInstance.on("load", () => {
        setMapReady(true)
      })

      setMap(mapInstance)

      return () => {
        mapInstance.remove()
      }
    } catch (err) {
      console.error("Failed to initialize map:", err)
    }
  }, [mapboxgl, mapboxToken, center, zoom])

  // Add markers when map is ready
  useEffect(() => {
    if (!map || !mapboxgl || !mapReady || !restaurants.length) return

    // Clear existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker")
    markers.forEach((marker) => marker.remove())

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      const [lng, lat] = restaurant.coordinates

      // Create marker element
      const el = document.createElement("div")
      el.className = "map-marker"
      el.style.cssText = `
        background-color: var(--color-primary);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid var(--bg);
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      `

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)"
      })
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)"
      })
      el.addEventListener("click", () => {
        onRestaurantClick?.(restaurant)
      })

      // @design-exception EXTERNAL_LIBRARY: mapboxgl.Marker constructor
      new mapboxgl.Marker({
        element: el,
      })
        .setLngLat([lng, lat])
        .addTo(map)
    })

    // Add user location marker if provided
    if (userLocation) {
      const userEl = document.createElement("div")
      userEl.className = "user-location-marker"
      userEl.style.cssText = `
        background-color: var(--color-brand-primary);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid var(--bg);
        box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
      `

      new mapboxgl.Marker({
        element: userEl,
      })
        .setLngLat([userLocation[0], userLocation[1]])
        .addTo(map)
    }
  }, [map, mapboxgl, mapReady, restaurants, userLocation, onRestaurantClick])

  if (!mapboxToken) {
    return (
      <div
        className={`bg-[var(--fg-10)] rounded-[var(--radius-xl)] flex items-center justify-center ${className}`}
        style={{
          // @design-exception DYNAMIC_VALUE: Component height must be set via inline style or prop
          minHeight: "400px",
        }}
      >
        <p className="text-[var(--fg-60)] text-[var(--font-size-sm)]">
          Map configuration error: Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        </p>
      </div>
    )
  }

  return (
    <div
      id="map-container"
      className={`rounded-[var(--radius-xl)] overflow-hidden ${className}`}
      style={{
        // @design-exception DYNAMIC_VALUE: Component height must be set via inline style or prop
        minHeight: "400px",
      }}
      role="application"
      aria-label="Map showing restaurant locations"
    />
  )
}

/**
 * Minimal map component for displaying restaurant markers
 * All map logic is UI-only, business logic lives in hooks
 */
export function MapboxMap(props: MapboxMapProps) {
  // Use dynamic import with ssr: false for client-side only rendering
  const ClientMap = dynamic(() => Promise.resolve(MapboxMapClient), { ssr: false })

  return <ClientMap {...props} />
}

// Re-export mapbox-gl types for convenience
export type { Coordinate, RestaurantWithLocation } from "../utils/distance"
