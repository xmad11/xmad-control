/* ═══════════════════════════════════════════════════════════════════════════════
   Top Processes Widget - Shows top memory/CPU consuming processes
   With Memory/CPU tabs, both showing manage-style with kill/restart
   Supports offset for showing processes 6-10 in second widget
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassWidgetBase } from "@/components/widgets/base-widget"
import { cn } from "@/lib/utils"
import { Cpu, MemoryStick, RefreshCw, Skull } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

export interface ProcessInfo {
  name: string
  pid: number
  usage: number // MB for memory, % for CPU
  cpu?: number // CPU percentage (for memory processes)
  memory?: number // Memory MB (for CPU processes)
  details?: string
}

interface TopProcessesWidgetProps {
  memoryProcesses: ProcessInfo[]
  cpuProcesses: ProcessInfo[]
  offset?: number // Start index (0 for 1-5, 5 for 6-10)
  className?: string
}

// Confirmation Popup Component - uses portal for proper positioning
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
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: "1rem",
        boxSizing: "border-box",
      }}
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel()
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl"
        style={{
          width: "100%",
          maxWidth: "28rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              action === "kill" ? "bg-red-500/20" : "bg-amber-500/20"
            )}
          >
            <Skull
              className={cn("w-6 h-6", action === "kill" ? "text-red-400" : "text-amber-400")}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-lg font-medium">
              Confirm {action === "kill" ? "Kill" : "Restart"}
            </h3>
            <p className="text-white/50 text-sm truncate">{processName}</p>
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
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white/70 hover:bg-white/15 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
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

  return createPortal(content, document.body)
}

// Process Item with action buttons
function ProcessItem({
  process,
  index,
  type,
  onKill,
  onRestart,
}: {
  process: ProcessInfo
  index: number
  type: "memory" | "cpu"
  onKill: () => void
  onRestart: () => void
}) {
  const maxUsage = type === "memory" ? 500 : 100 // 500MB max or 100% CPU
  const usagePercent = Math.min((process.usage / maxUsage) * 100, 100)

  // Progress bar color - green for both
  const progressColor = "bg-gradient-to-r from-emerald-400 to-green-400"

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-white/50 text-sm font-medium w-6 tabular-nums">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white/90 text-sm font-medium truncate">{process.name}</div>
          <div className="flex items-center gap-3 text-white/40 text-xs mt-0.5">
            <span>PID: {process.pid}</span>
            {type === "memory" && process.cpu !== undefined && (
              <span className="text-cyan-400/70">CPU: {process.cpu.toFixed(1)}%</span>
            )}
            {type === "cpu" && process.memory !== undefined && (
              <span className="text-green-400/70">RAM: {process.memory}MB</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-white tabular-nums text-sm font-medium">
            {type === "memory" ? `${Math.round(process.usage)} MB` : `${process.usage.toFixed(1)}%`}
          </span>
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progressColor)}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRestart}
            className="p-2 rounded-xl bg-amber-500/10 text-amber-400/70 hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
            title="Restart process"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onKill}
            className="p-2 rounded-xl bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            title="Kill process"
          >
            <Skull className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function TopProcessesWidget({
  memoryProcesses,
  cpuProcesses,
  offset = 0,
  className,
}: TopProcessesWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<"memory" | "cpu">("memory")
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
      const res = await fetch("/api/xmad/system/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: confirmPopup.action,
          pid: confirmPopup.process.pid,
        }),
      })

      if (res.ok) {
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

  // Get current processes based on active tab
  const currentProcesses = activeTab === "memory" ? memoryProcesses : cpuProcesses
  const displayProcesses = currentProcesses.slice(offset, offset + 5)

  // Calculate rank display (1-5 or 6-10)
  const rankStart = offset + 1
  const rankEnd = offset + 5

  return (
    <>
      <GlassWidgetBase className={className} size="md" width="md" glowColor="green">
        {/* Tabs - Memory | CPU */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("memory")}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === "memory"
                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
          >
            <MemoryStick className="w-4 h-4" />
            Memory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cpu")}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === "cpu"
                ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
          >
            <Cpu className="w-4 h-4" />
            CPU
          </button>
        </div>

        {/* Rank indicator */}
        <div className="text-center text-white/30 text-xs mb-3">
          Processes #{rankStart} - #{rankEnd}
        </div>

        {/* Process List */}
        <div className="space-y-2">
          {displayProcesses.length > 0 ? (
            displayProcesses.map((process, i) => (
              <ProcessItem
                key={`${process.pid}-${i}`}
                process={process}
                index={offset + i}
                type={activeTab}
                onKill={() => handleKill(process)}
                onRestart={() => handleRestart(process)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-white/40 text-sm">No processes available</div>
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
