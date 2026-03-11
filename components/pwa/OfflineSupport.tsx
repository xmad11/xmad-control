/**
 * OfflineSupport Component
 *
 * Comprehensive offline functionality and sync management.
 * Features:
 * - Network status detection
 * - Offline action queue (favorites, reviews, reservations)
 * - Automatic sync on reconnect
 * - Offline storage management
 * - User notifications
 * - Uses design tokens exclusively
 *
 * @module components/pwa/OfflineSupport
 */

"use client"

import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon, WifiIcon } from "@/components/icons"
import { useLanguage } from "@/context/LanguageContext"
import { useCallback, useEffect, useState } from "react"

// ============================================================================
// TYPES
// ============================================================================

export interface OfflineAction {
  id: string
  type: "favorite" | "review" | "reservation"
  data: Record<string, unknown>
  timestamp: number
  status: "pending" | "synced" | "failed"
}

export interface OfflineSupportProps {
  /** Additional CSS classes */
  className?: string
  /** Callback when sync completes */
  onSyncComplete?: (actions: OfflineAction[]) => void
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Offline Support Component
 *
 * Manages offline actions and syncs them when connectivity is restored.
 * Displays a dashboard of offline actions and sync status.
 *
 * @example
 * <OfflineSupport onSyncComplete={(synced) => console.log('Synced:', synced)} />
 */
export function OfflineSupport({ className = "", onSyncComplete }: OfflineSupportProps) {
  const { t } = useLanguage()
  const [isOnline, setIsOnline] = useState(true)
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([])
  const [syncing, setSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)

  // Check initial network status
  useEffect(() => {
    setIsOnline(navigator.onLine)

    // Load offline actions from storage
    loadOfflineActions()

    // Check last sync time
    const lastSync = localStorage.getItem("shadi_last_sync")
    if (lastSync) {
      setLastSyncTime(new Date(lastSync))
    }
  }, [])

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineBanner(false)

      // Auto-sync when coming back online
      if (offlineActions.length > 0) {
        syncOfflineActions()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [offlineActions.length])

  // Load offline actions from localStorage
  const loadOfflineActions = useCallback(() => {
    try {
      const stored = localStorage.getItem("shadi_offline_actions")
      if (stored) {
        const actions = JSON.parse(stored) as OfflineAction[]
        setOfflineActions(actions)
      }
    } catch (error) {
      console.error("Failed to load offline actions:", error)
    }
  }, [])

  // Save offline actions to localStorage
  const saveOfflineActions = useCallback((actions: OfflineAction[]) => {
    try {
      localStorage.setItem("shadi_offline_actions", JSON.stringify(actions))
    } catch (error) {
      console.error("Failed to save offline actions:", error)
    }
  }, [])

  // Add offline action
  const _addOfflineAction = useCallback(
    (type: OfflineAction["type"], data: Record<string, unknown>) => {
      const action: OfflineAction = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        type,
        data,
        timestamp: Date.now(),
        status: "pending",
      }

      const updatedActions = [...offlineActions, action]
      setOfflineActions(updatedActions)
      saveOfflineActions(updatedActions)

      // Show notification if offline
      if (!isOnline) {
        console.log("Action saved for when you're back online")
      }
    },
    [offlineActions, isOnline, saveOfflineActions]
  )

  // Sync offline actions
  const syncOfflineActions = useCallback(async () => {
    if (syncing || offlineActions.length === 0) return

    setSyncing(true)

    try {
      const syncedActions: OfflineAction[] = []
      const failedActions: OfflineAction[] = []

      for (const action of offlineActions) {
        try {
          await processOfflineAction(action)
          syncedActions.push({ ...action, status: "synced" })
        } catch (error) {
          console.error("Failed to sync action:", error)
          failedActions.push({ ...action, status: "failed" })
        }
      }

      // Update state
      setOfflineActions(failedActions)
      saveOfflineActions(failedActions)

      // Update last sync time
      const now = new Date()
      setLastSyncTime(now)
      localStorage.setItem("shadi_last_sync", now.toISOString())

      // Notify parent
      onSyncComplete?.(syncedActions)

      // Show notification
      if (syncedActions.length > 0) {
        console.log(`Synced ${syncedActions.length} action${syncedActions.length > 1 ? "s" : ""}`)
      }

      if (failedActions.length > 0) {
        console.log(
          `${failedActions.length} action${failedActions.length > 1 ? "s" : ""} failed to sync`
        )
      }
    } catch (error) {
      console.error("Sync failed:", error)
      console.log("Sync failed. Please try again.")
    } finally {
      setSyncing(false)
    }
  }, [offlineActions, syncing, saveOfflineActions, onSyncComplete])

  // Process individual offline action
  const processOfflineAction = async (action: OfflineAction): Promise<void> => {
    switch (action.type) {
      case "favorite":
        return await syncFavoriteAction(action.data)
      case "review":
        return await syncReviewAction(action.data)
      case "reservation":
        return await syncReservationAction(action.data)
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  // Sync favorite action
  const syncFavoriteAction = async (data: Record<string, unknown>): Promise<void> => {
    const response = await fetch("/api/favorites/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to sync favorite")
    }
  }

  // Sync review action
  const syncReviewAction = async (data: Record<string, unknown>): Promise<void> => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to sync review")
    }
  }

  // Sync reservation action
  const syncReservationAction = async (data: Record<string, unknown>): Promise<void> => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to sync reservation")
    }
  }

  // Clear all offline actions
  const clearOfflineActions = useCallback(() => {
    setOfflineActions([])
    saveOfflineActions([])
    localStorage.removeItem("shadi_offline_actions")
    console.log("Offline actions cleared")
  }, [saveOfflineActions])

  // Retry failed actions
  const retryFailedActions = useCallback(() => {
    const failedActions = offlineActions.filter((a) => a.status === "failed")
    const resetActions = failedActions.map((a) => ({
      ...a,
      status: "pending" as const,
    }))

    const updatedActions = [...offlineActions.filter((a) => a.status !== "failed"), ...resetActions]

    setOfflineActions(updatedActions)
    saveOfflineActions(updatedActions)

    if (isOnline) {
      syncOfflineActions()
    }
  }, [offlineActions, isOnline, saveOfflineActions, syncOfflineActions])

  return (
    <div className={`flex flex-col gap-[var(--spacing-md)] ${className}`}>
      {/* Network Status Banner */}
      {showOfflineBanner && (
        <div className="bg-[oklch(from_var(--color-warning)_l_c_h_/0.1)] border border-[oklch(from_var(--color-warning)_l_c_h_/0.3)] rounded-[var(--radius-lg)] p-[var(--spacing-md)]">
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <ExclamationCircleIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-warning)] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--fg)]">{t("common.youreOffline")}</h3>
              <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] mt-[var(--spacing-xs)]">
                Some features may be limited. Your actions will be saved and synced when you're back
                online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Online Status Indicator */}
      <div className="flex items-center justify-between bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)] p-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          {isOnline ? (
            <>
              <WifiIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-success)]" />
              <div>
                <p className="font-medium text-[var(--fg)]">{t("common.online")}</p>
                {lastSyncTime && (
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                    Last synced: {lastSyncTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <ExclamationCircleIcon className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] text-[var(--color-error)]" />
              <div>
                <p className="font-medium text-[var(--fg)]">{t("common.offline")}</p>
                <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                  {offlineActions.length} action{offlineActions.length !== 1 ? "s" : ""} queued
                </p>
              </div>
            </>
          )}
        </div>

        {isOnline && offlineActions.length > 0 && (
          <button
            type="button"
            onClick={syncOfflineActions}
            disabled={syncing}
            className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:opacity-90 transition-all duration-[var(--duration-fast)] disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        )}
      </div>

      {/* Offline Actions List */}
      {offlineActions.length > 0 && (
        <div className="bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)]">
          <div className="p-[var(--spacing-md)] border-b border-[var(--fg-10)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--fg)]">
                Offline Actions ({offlineActions.length})
              </h3>
              <div className="flex gap-[var(--spacing-sm)]">
                {offlineActions.some((a) => a.status === "failed") && (
                  <button
                    type="button"
                    onClick={retryFailedActions}
                    className="text-[var(--font-size-sm)] text-[var(--color-primary)] hover:underline"
                  >
                    Retry Failed
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearOfflineActions}
                  className="text-[var(--font-size-sm)] text-[var(--fg-70)] hover:text-[var(--fg)]"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[var(--fg-5)]">
            {offlineActions.map((action) => (
              <div key={action.id} className="p-[var(--spacing-md)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[var(--spacing-sm)]">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        action.status === "synced"
                          ? "bg-[var(--color-success)]"
                          : action.status === "failed"
                            ? "bg-[var(--color-error)]"
                            : "bg-[var(--color-warning)]"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-[var(--fg)] capitalize">{action.type}</p>
                      <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-[var(--spacing-xs)]">
                    {action.status === "synced" && (
                      <CheckCircleIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-[var(--color-success)]" />
                    )}
                    {action.status === "failed" && (
                      <ExclamationCircleIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-[var(--color-error)]" />
                    )}
                    {action.status === "pending" && (
                      <ArrowPathIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] text-[var(--color-warning)] animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

// Named export is already at the top of the file - no default export needed
