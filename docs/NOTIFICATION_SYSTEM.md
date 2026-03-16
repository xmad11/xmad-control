# NotificationSystem Integration Guide

## Overview

The NotificationSystem provides a global toast notification system with glass morphism styling for the XMAD Control Dashboard.

## Features

- **4 Notification Types**: Success, Error, Warning, Info
- **Auto-dismiss**: Configurable duration (default: 5 seconds)
- **Stack Multiple Notifications**: Max 5 visible at once
- **Progress Bar**: Visual countdown for auto-dismiss
- **Action Buttons**: Support for "Retry", "View", etc.
- **Glass Morphism**: Beautiful frosted glass styling
- **Pause on Hover**: Hovering pauses the auto-dismiss timer
- **Preset Notifications**: Quick methods for common scenarios

## Installation

### 1. Wrap your app with the provider

In `app/layout.tsx`:

```tsx
import { NotificationProvider } from "@/components/NotificationSystem"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider position="top-right">
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
```

### 2. Use in any component

```tsx
import { useNotifications } from "@/components/NotificationSystem"

export function MyComponent() {
  const { success, error, warning, info } = useNotifications()

  const handleAction = () => {
    success("Done!", "Operation completed successfully")
  }

  return <button onClick={handleAction}>Click me</button>
}
```

## API Reference

### useNotifications Hook

```tsx
const {
  notifications,           // Current notifications array
  addNotification,         // Add custom notification
  removeNotification,      // Remove by ID
  clearAll,               // Clear all notifications
  success,                // Success notification
  error,                  // Error notification
  warning,                // Warning notification
  info,                   // Info notification
  showApiError,           // API error preset
  showServiceStatus,      // Service status preset
  showBackupComplete,     // Backup complete preset
} = useNotifications()
```

### Basic Usage

```tsx
// Success
success("Saved!", "Changes have been saved")

// Error
error("Failed", "Could not save changes")

// Warning
warning("Storage low", "Only 10% remaining")

// Info
info("New message", "You have 3 unread notifications")
```

### Advanced Options

```tsx
const { addNotification } = useNotifications()

addNotification({
  type: "success",
  title: "Custom notification",
  description: "With custom options",
  duration: 10000,        // 10 seconds
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
    variant: "primary"
  },
  icon: <Icon />          // Custom icon
})
```

### Preset Notifications

```tsx
// API Error
showApiError("Internal server error", "/api/v1/status")

// Service Status
showServiceStatus("OpenClaw Gateway", true)

// Backup Complete
showBackupComplete("daily-2026-03-16", "2.4 GB")
```

## Configuration

Default configuration is in `config/dashboard.ts`:

```tsx
export const NOTIFICATION = {
  DEFAULT_DURATION: 5000,      // 5 seconds
  MAX_NOTIFICATIONS: 5,
  DEFAULT_POSITION: "top-right",
  ANIMATION_DURATION: 300,
  PROGRESS_UPDATE_INTERVAL: 50,
}
```

## Positions

Available positions:
- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

Change in provider:

```tsx
<NotificationProvider position="bottom-left">
  {children}
</NotificationProvider>
```

## Action Button Variants

```tsx
action: {
  label: "Retry",
  onClick: () => { /* ... */ },
  variant: "primary"   // or "secondary" or "ghost"
}
```

## Real-World Examples

### API Response Handler

```tsx
export function useApiHandler() {
  const { showApiError, success } = useNotifications()

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      showApiError(await response.text(), response.url)
      return null
    }

    const data = await response.json()
    success("Success", "Data loaded successfully")
    return data
  }

  return { handleResponse }
}
```

### Service Monitor

```tsx
export function ServiceMonitor({ serviceName, url }: { serviceName: string, url: string }) {
  const { showServiceStatus } = useNotifications()

  useEffect(() => {
    const checkService = async () => {
      try {
        const res = await fetch(url)
        showServiceStatus(serviceName, res.ok)
      } catch {
        showServiceStatus(serviceName, false)
      }
    }

    const interval = setInterval(checkService, 30000)
    checkService()

    return () => clearInterval(interval)
  }, [serviceName, url])

  return null
}
```

### Form Submission

```tsx
export function SaveButton() {
  const { success, error } = useNotifications()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await saveData()
      success("Saved!", "Your changes have been saved", {
        duration: 3000
      })
    } catch (err) {
      error("Save failed", err.message, {
        action: {
          label: "Retry",
          onClick: handleSave
        }
      })
    } finally {
      setIsSaving(false)
    }
  }

  return <button onClick={handleSave} disabled={isSaving}>
    {isSaving ? "Saving..." : "Save"}
  </button>
}
```

## Styling

The notification uses glass morphism with:
- Backdrop blur
- Gradient borders
- Glow effects
- Smooth animations
- Responsive design

Colors by type:
- Success: Emerald/Green
- Error: Red/Rose
- Warning: Amber/Yellow
- Info: Cyan/Blue

## Accessibility

- ARIA live region for screen readers
- Role="alert" for notifications
- Keyboard navigation support
- Focus management
- Semantic HTML

## Files

- `/components/NotificationSystem.tsx` - Main component
- `/components/NotificationSystem.example.tsx` - Usage examples
- `/config/dashboard.ts` - Configuration
