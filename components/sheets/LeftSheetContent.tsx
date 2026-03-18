/* ══════════════════════════════════════════════════════════════════════════════════
   LEFT SHEET CONTENT - Navigation menu with glassy texture
   ══════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton } from "@/components/glass/glass-button"
import { GlassProgress } from "@/components/glass/glass-progress"
import { cn } from "@/lib/utils"
import {
  Bell,
  Brain,
  Cloud,
  Database,
  HardDrive,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Zap,
} from "lucide-react"
import type React from "react"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

const navigationItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, active: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "memory", label: "Memory", icon: Database },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "brain", label: "AI Models", icon: Brain },
  { id: "cloud", label: "Cloud Sync", icon: Cloud },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
]

interface LeftSheetContentProps {
  onNavigate?: (id: string) => void
}

export function LeftSheetContent({ onNavigate }: LeftSheetContentProps) {
  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Header */}
      <div className="border-b border-white/10 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* XMAD Logo - Glassy gradient */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg bg-gradient-cyan-purple">
            <span className="text-white">X</span>
          </div>
          <div>
            <p className="font-semibold text-white">XMAD Control</p>
            <p className="text-xs text-white/50">Dashboard v4.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                  item.active
                    ? "bg-white/10 text-white backdrop-blur-sm border border-white/10 glass-inset-shadow"
                    : "text-white/60 hover:bg-white/5 hover:text-white hover:backdrop-blur-sm"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.active && (
                  <div className="h-2 w-2 rounded-full bg-cyan-glow glass-status-dot" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
export default LeftSheetContent
