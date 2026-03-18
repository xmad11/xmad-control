/* ════════════════════════════════════════════════════════════════════════════════
   RIGHT SHEET CONTENT - Quick settings with glassy texture
   ════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton } from "@/components/glass/glass-button"
import { GlassProgress } from "@/components/glass/glass-progress"
import { cn } from "@/lib/utils"
import { Bell, Bluetooth, Cloud, Database, HardDrive, Moon, Sun, Wifi } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface ToggleItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
}

interface RightSheetContentProps {
  onToggle?: (id: string, enabled: boolean) => void
}

export function RightSheetContent({ onToggle }: RightSheetContentProps) {
  const [toggles, setToggles] = useState<ToggleItem[]>([
    { id: "notifications", label: "Notifications", icon: Bell, enabled: true },
    { id: "cloud-sync", label: "Cloud Sync", icon: Cloud, enabled: true },
    { id: "dark-mode", label: "Dark Mode", icon: Moon, enabled: true },
    { id: "bluetooth", label: "Bluetooth", icon: Bluetooth, enabled: false },
  ])

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    )
    const item = toggles.find((t) => t.id === id)
    if (item) {
      onToggle?.(id, !item.enabled)
    }
  }

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Header */}
      <div className="border-b border-white/10 p-4 backdrop-blur-xl glass-inset-shadow">
        <h2 className="text-lg font-semibold text-white">Quick Settings</h2>
        <p className="text-sm text-white/50">Manage your preferences</p>
      </div>

      {/* Toggles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {toggles.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(item.id)}
              className="flex w-full items-center justify-between rounded-xl p-3 backdrop-blur-xl border transition-all hover:bg-white/10 glass-settings-item"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-white/60" />
                <span className="text-white/80">{item.label}</span>
              </div>
              {/* Toggle switch - glassy */}
              <div
                className={cn(
                  "relative h-6 w-10 rounded-full transition-all backdrop-blur-sm border",
                  item.enabled
                    ? "glass-toggle-enabled border-[color:var(--widget-cyan)]/40"
                    : "glass-toggle-disabled border-white/20"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full transition-all",
                    item.enabled
                      ? "right-0.5 glass-toggle-knob-enabled"
                      : "left-0.5 glass-toggle-knob-disabled"
                  )}
                />
              </div>
            </button>
          )
        })}

        {/* System Status */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
            System Status
          </h3>

          {/* Storage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <HardDrive className="h-4 w-4" />
                <span>Storage</span>
              </div>
              <span className="text-white/40">68%</span>
            </div>
            <GlassProgress value={68} className="h-2" />
          </div>

          {/* Database */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </div>
              <span className="text-white/40">42%</span>
            </div>
            <GlassProgress value={42} className="h-2" />
          </div>

          {/* Network */}
          <div className="flex items-center justify-between rounded-xl p-3 backdrop-blur-xl border glass-settings-item">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-green-glow-box">
                <Wifi className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-white">Connected</p>
                <p className="text-xs text-white/40">WiFi - 5GHz</p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full success-status-dot" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSheetContent
