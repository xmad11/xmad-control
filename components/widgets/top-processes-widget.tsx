/* ═══════════════════════════════════════════════════════════════════════════════
   Top Processes Widget - Shows top memory/CPU consuming processes
   With tabs for Usage view and Process Management view
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassWidgetBase } from "@/components/widgets/base-widget"
import { cn } from "@/lib/utils"
import { Cpu, MemoryStick, RefreshCw, Skull } from "lucide-react"
import * as React from "react"

export interface ProcessInfo {
  name: string
  pid: number
  usage: number // MB for memory, % for CPU
  cpu?: number // CPU percentage (for memory tab)
  memory?: number // Memory MB (for CPU tab)
  details?: string
}

interface TopProcessesWidgetProps {
  processes: ProcessInfo[]
  type: "memory" | "cpu"
  className?: string
}

// Confirmation Popup Component
function ConfirmPopup({
  isOpen,
  processName,
  action,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean
  processName: string
  action: "kill" | "restart"
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900/95 border border-white/20 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              action === "kill" ? "bg-red-500/20" : "bg-amber-500/20"
            )}
          >
            <Skull
              className={cn("w-5 h-5", action === "kill" ? "text-red-400" : "text-amber-400")}
            />
          </div>
          <div>
            <h3 className="text-white font-medium">
              Confirm {action === "kill" ? "Kill" : "Restart"}
            </h3>
            <p className="text-white/50 text-sm">{processName}</p>
          </div>
        </div>

        <p className="text-white/60 text-sm mb-6">
          {action === "kill"
            ? "This will forcefully terminate the process. Unsaved data may be lost."
            : "This will restart the process. It may be temporarily unavailable."}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
              action === "kill"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
            )}
          >
            {action === "kill" ? "Kill Process" : "Restart"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Process Item with action buttons
function ProcessItem({
  process,
  index,
  type,
  showActions,
  onKill,
  onRestart,
}: {
  process: ProcessInfo
  index: number
  type: "memory" | "cpu"
  showActions: boolean
  onKill: () => void
  onRestart: () => void
}) {
  const maxUsage = type === "memory" ? 500 : 100 // 500MB max or 100% CPU
  const usagePercent = Math.min((process.usage / maxUsage) * 100, 100)

  // RAM progress bar color matches gauge (green gradient)
  const progressColor = "bg-gradient-to-r from-emerald-400 to-green-400"

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-white/40 text-xs w-4 tabular-nums">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white/80 text-sm truncate">{process.name}</div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>PID: {process.pid}</span>
            {type === "memory" && process.cpu !== undefined && (
              <span className="text-cyan-400/60">CPU: {process.cpu.toFixed(1)}%</span>
            )}
            {type === "cpu" && process.memory !== undefined && (
              <span className="text-green-400/60">RAM: {process.memory}MB</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col items-end gap-1">
          <span className="text-white tabular-nums text-sm">
            {type === "memory" ? `${Math.round(process.usage)} MB` : `${process.usage.toFixed(1)}%`}
          </span>
          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progressColor)}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              onClick={onRestart}
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
              title="Restart process"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onKill}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Kill process"
            >
              <Skull className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function TopProcessesWidget({ processes, type, className }: TopProcessesWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<"usage" | "manage">("usage")
  const [confirmPopup, setConfirmPopup] = React.useState<{
    isOpen: boolean
    process: ProcessInfo | null
    action: "kill" | "restart"
  }>({ isOpen: false, process: null, action: "kill" })

  const handleKill = (process: ProcessInfo) => {
    setConfirmPopup({ isOpen: true, process, action: "kill" })
  }

  const handleRestart = (process: ProcessInfo) => {
    setConfirmPopup({ isOpen: true, process, action: "restart" })
  }

  const handleConfirm = async () => {
    if (!confirmPopup.process) return

    try {
      // Call API to kill/restart process
      const res = await fetch("/api/xmad/system/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: confirmPopup.action,
          pid: confirmPopup.process.pid,
        }),
      })

      if (res.ok) {
        // Process action completed
        console.log(`Process ${confirmPopup.process.pid} ${confirmPopup.action}ed`)
      }
    } catch (err) {
      console.error("Failed to process action:", err)
    }

    setConfirmPopup({ isOpen: false, process: null, action: "kill" })
  }

  const handleCancel = () => {
    setConfirmPopup({ isOpen: false, process: null, action: "kill" })
  }

  const Icon = type === "memory" ? MemoryStick : Cpu
  const glowColor = "green" // Match RAM gauge color

  return (
    <>
      <GlassWidgetBase className={className} size="md" width="md" glowColor={glowColor}>
        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("usage")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-all",
              activeTab === "usage"
                ? "bg-green-500/20 text-green-400"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
          >
            <Icon className="w-3.5 h-3.5 inline mr-1.5" />
            Usage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manage")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-all",
              activeTab === "manage"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />
            Manage
          </button>
        </div>

        {/* Process List */}
        <div className="space-y-2">
          {processes.length > 0 ? (
            processes
              .slice(0, 5)
              .map((process, i) => (
                <ProcessItem
                  key={`${process.pid}-${i}`}
                  process={process}
                  index={i}
                  type={type}
                  showActions={activeTab === "manage"}
                  onKill={() => handleKill(process)}
                  onRestart={() => handleRestart(process)}
                />
              ))
          ) : (
            <div className="text-center py-6 text-white/40 text-sm">
              {activeTab === "usage" ? "Loading processes..." : "No processes to manage"}
            </div>
          )}
        </div>
      </GlassWidgetBase>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        processName={confirmPopup.process?.name || ""}
        action={confirmPopup.action}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}

export { TopProcessesWidget }
