/* ═══════════════════════════════════════════════════════════════════════════════
   USE GEOLOCATION - Browser geolocation hook for "Near Me" feature
   SSOT-compliant: All geolocation logic lives here
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useEffect, useState } from "react"

export interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null
  error: GeolocationError | null
  loading: boolean
  requestLocation: () => void
}

/**
 * Hook for accessing browser geolocation
 * Follows Geolocation API best practices
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLoading(false)
      },
      (err) => {
        setError({
          code: err.code,
          message: err.message,
        })
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    )
  }

  return {
    position,
    error,
    loading,
    requestLocation,
  }
}
