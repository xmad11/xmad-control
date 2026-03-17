/* ═══════════════════════════════════════════════════════════════════════════════
   NOTIFICATION SYSTEM - Global toast notification management
   Provides context-based notification system with glass morphism styling
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { TIMING } from "@/config/dashboard"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Database,
  Info,
  Shield,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react"
import * as React from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NotificationType = "success" | "error" | "warning" | "info"
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center"

export interface NotificationAction {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary" | "ghost"
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
  action?: NotificationAction
  icon?: React.ReactNode
  timestamp?: number
}

export interface NotificationOptions {
  type?: NotificationType
  title: string
  description?: string
  duration?: number
  action?: NotificationAction
  icon?: React.ReactNode
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (options: NotificationOptions) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  // Convenience methods
  success: (title: string, description?: string, options?: Partial<NotificationOptions>) => string
  error: (title: string, description?: string, options?: Partial<NotificationOptions>) => string
  warning: (title: string, description?: string, options?: Partial<NotificationOptions>) => string
  info: (title: string, description?: string, options?: Partial<NotificationOptions>) => string
  // Preset notifications
  showApiError: (error: string, endpoint?: string) => string
  showServiceStatus: (service: string, online: boolean) => string
  showBackupComplete: (name: string, size: string) => string
}

const NotificationContext = React.createContext<NotificationContextType | null>(null)

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useNotifications(): NotificationContextType {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_NOTIFICATIONS = 5
const DEFAULT_DURATION = 5000

export function NotificationProvider({
  children,
  position = "top-right",
  maxNotifications = MAX_NOTIFICATIONS,
}: {
  children: React.ReactNode
  position?: NotificationPosition
  maxNotifications?: number
}) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const timeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))

    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const addNotification = React.useCallback(
    (options: NotificationOptions): string => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const duration = options.duration ?? DEFAULT_DURATION

      const newNotification: Notification = {
        id,
        type: options.type || "info",
        title: options.title,
        description: options.description,
        duration,
        action: options.action,
        icon: options.icon,
        timestamp: Date.now(),
      }

      setNotifications((prev) => {
        const updated = [newNotification, ...prev]
        // Keep only maxNotifications
        return updated.slice(0, maxNotifications)
      })

      // Auto-dismiss after duration
      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeNotification(id)
        }, duration)

        timeoutsRef.current.set(id, timeout)
      }

      return id
    },
    [maxNotifications, removeNotification]
  )

  const clearAll = React.useCallback(() => {
    setNotifications([])
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()
  }, [])

  // Convenience methods
  const success = React.useCallback(
    (title: string, description?: string, options?: Partial<NotificationOptions>) =>
      addNotification({ type: "success", title, description, ...options }),
    [addNotification]
  )

  const error = React.useCallback(
    (title: string, description?: string, options?: Partial<NotificationOptions>) =>
      addNotification({ type: "error", title, description, ...options }),
    [addNotification]
  )

  const warning = React.useCallback(
    (title: string, description?: string, options?: Partial<NotificationOptions>) =>
      addNotification({ type: "warning", title, description, ...options }),
    [addNotification]
  )

  const info = React.useCallback(
    (title: string, description?: string, options?: Partial<NotificationOptions>) =>
      addNotification({ type: "info", title, description, ...options }),
    [addNotification]
  )

  // Preset notifications
  const showApiError = React.useCallback(
    (error: string, endpoint?: string): string => {
      return addNotification({
        type: "error",
        title: "API Error",
        description: endpoint ? `${endpoint}: ${error}` : error,
        icon: <AlertCircle className="w-5 h-5" />,
        action: {
          label: "Retry",
          onClick: () => {
            // Trigger retry logic
            console.log("Retrying...", endpoint)
          },
        },
      })
    },
    [addNotification]
  )

  const showServiceStatus = React.useCallback(
    (service: string, online: boolean): string => {
      return addNotification({
        type: online ? "success" : "error",
        title: `${service} ${online ? "Online" : "Offline"}`,
        description: online ? "Service is running normally" : "Service is not responding",
        icon: online ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />,
      })
    },
    [addNotification]
  )

  const showBackupComplete = React.useCallback(
    (name: string, size: string): string => {
      return addNotification({
        type: "success",
        title: "Backup Complete",
        description: `${name} (${size})`,
        icon: <Database className="w-5 h-5" />,
        action: {
          label: "View",
          onClick: () => {
            // Navigate to backups
            console.log("Navigating to backups")
          },
        },
      })
    },
    [addNotification]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    showApiError,
    showServiceStatus,
    showBackupComplete,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const typeConfig = {
  success: {
    icon: CheckCircle,
    gradient: "from-emerald-500/30 to-green-500/30",
    border: "border-emerald-400/30",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    progress: "bg-emerald-400",
  },
  error: {
    icon: AlertCircle,
    gradient: "from-red-500/30 to-rose-500/30",
    border: "border-red-400/30",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    progress: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500/30 to-yellow-500/30",
    border: "border-amber-400/30",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    progress: "bg-amber-400",
  },
  info: {
    icon: Info,
    gradient: "from-cyan-500/30 to-blue-500/30",
    border: "border-cyan-400/30",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    progress: "bg-cyan-400",
  },
}

const positionStyles: Record<NotificationPosition, { container: string; animation: string }> = {
  "top-right": {
    container: "top-4 right-4",
    animation: "animate-in slide-in-from-right-full",
  },
  "top-left": {
    container: "top-4 left-4",
    animation: "animate-in slide-in-from-left-full",
  },
  "bottom-right": {
    container: "bottom-4 right-4",
    animation: "animate-in slide-in-from-right-full",
  },
  "bottom-left": {
    container: "bottom-4 left-4",
    animation: "animate-in slide-in-from-left-full",
  },
  "top-center": {
    container: "top-4 left-1/2 -translate-x-1/2",
    animation: "animate-in slide-in-from-top-full",
  },
  "bottom-center": {
    container: "bottom-4 left-1/2 -translate-x-1/2",
    animation: "animate-in slide-in-from-bottom-full",
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

function NotificationContainer({ position = "top-right" }: { position?: NotificationPosition }) {
  const { notifications, removeNotification } = useNotifications()
  const positionConfig = positionStyles[position]

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none",
        positionConfig.container
      )}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          animationClass={positionConfig.animation}
          index={index}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
  animationClass?: string
  index: number
}

function NotificationToast({
  notification,
  onClose,
  animationClass = "animate-in slide-in-from-right-full",
  index,
}: NotificationToastProps) {
  const config = typeConfig[notification.type]
  const DefaultIcon = config.icon
  const [progress, setProgress] = React.useState(100)
  const [isPaused, setIsPaused] = React.useState(false)
  const duration = notification.duration ?? DEFAULT_DURATION

  // Progress bar animation
  React.useEffect(() => {
    if (duration === 0 || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = 100 / (duration / 50)
        const newProgress = prev - decrement
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration, isPaused])

  // Pause progress on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  // Calculate scale and opacity based on index
  const scale = 1 - index * 0.02
  const opacity = 1 - index * 0.1

  return (
    <div
      className={cn(
        "pointer-events-auto transition-all duration-300",
        animationClass,
        "fade-in duration-300"
      )}
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
      role="alert"
      aria-atomic="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute -inset-1.5 rounded-xl bg-gradient-to-r blur-xl opacity-60 group-hover:opacity-80 transition-opacity",
            config.gradient
          )}
        />

        {/* Main glass container */}
        <div
          className={cn(
            "relative rounded-xl border",
            "bg-white/10 backdrop-blur-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]",
            "overflow-hidden",
            "transition-all duration-300",
            "group-hover:bg-white/15",
            config.border
          )}
        >
          {/* Glass highlight layers */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent to-white/10 pointer-events-none" />

          {/* Content */}
          <div className="relative p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                  "border border-white/10",
                  config.iconBg
                )}
              >
                {notification.icon || <DefaultIcon className={cn("w-5 h-5", config.iconColor)} />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                {notification.description && (
                  <p className="mt-0.5 text-sm text-white/60 leading-snug">
                    {notification.description}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss notification"
                className={cn(
                  "shrink-0 p-1.5 rounded-lg",
                  "text-white/40 hover:text-white hover:bg-white/10",
                  "transition-all duration-200",
                  "hover:scale-110"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action button */}
            {notification.action && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    notification.action!.onClick()
                    onClose()
                  }}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    notification.action.variant === "primary"
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : notification.action.variant === "secondary"
                        ? "bg-white/10 text-white/80 hover:bg-white/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {duration !== 0 && (
            <div className="h-0.5 bg-white/5">
              <div
                className={cn("h-full transition-all duration-75 ease-linear", config.progress)}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Auto-dismiss progress"
                tabIndex={0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDALONE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { NotificationToast as NotificationToastStandalone }
