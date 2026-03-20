/* ═══════════════════════════════════════════════════════════════════════════════
   Top Processes Widget - Shows top memory/CPU consuming processes
   Uses WidgetCarousel for consistency with other widgets
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassWidgetBase } from "@/components/widgets/base-widget"
import { cn } from "@/lib/utils"
import { Cpu, MemoryStick } from "lucide-react"
import * as React from "react"

export interface ProcessInfo {
  name: string
  pid: number
  usage: number // MB for memory, % for CPU
  details?: string
}

interface TopProcessesWidgetProps {
  title?: string
  processes: ProcessInfo[]
  type: "memory" | "cpu"
  className?: string
}

function TopProcessesWidget({ title, processes, type, className }: TopProcessesWidgetProps) {
  const Icon = type === "memory" ? MemoryStick : Cpu
  const unit = type === "memory" ? "MB" : "%"
  const defaultTitle = type === "memory" ? "Top 5 Memory" : "Top 5 CPU"
  const glowColor = type === "memory" ? "purple" : "cyan"

  // Calculate max for progress bar (avoid division by zero)
  const maxUsage = React.useMemo(() => {
    const max = Math.max(...processes.map((p) => p.usage), 1)
    return max > 0 ? max : 1
  }, [processes])

  return (
    <GlassWidgetBase className={className} size="md" width="md" glowColor={glowColor}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-white/60" />
        <h3 className="text-white/60 text-sm">{title || defaultTitle}</h3>
      </div>
      <div className="space-y-2.5">
        {processes.length > 0 ? (
          processes.slice(0, 5).map((process, i) => (
            <div key={`${process.pid}-${i}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-white/50 text-xs w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white/70 text-sm truncate">{process.name}</div>
                  {process.details && (
                    <div className="text-white/40 text-xs truncate">{process.details}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm shrink-0">
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      type === "memory"
                        ? "bg-gradient-to-r from-purple-400 to-pink-400"
                        : "bg-gradient-to-r from-cyan-400 to-blue-400"
                    )}
                    style={{ width: `${Math.min((process.usage / maxUsage) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-white tabular-nums w-14 text-right">
                  {process.usage.toFixed(type === "memory" ? 0 : 1)}
                  <span className="text-white/40 text-xs ml-0.5">{unit}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-white/40 text-sm">No process data available</div>
        )}
      </div>
    </GlassWidgetBase>
  )
}

export { TopProcessesWidget }
