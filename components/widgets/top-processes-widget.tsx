/* ═══════════════════════════════════════════════════════════════════════════════
   Top Processes Widget - Shows top memory/CPU consuming processes
   Styled like the 5-day forecast widget
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

  // Calculate max for progress bar
  const maxUsage = Math.max(...processes.map((p) => p.usage), 1)

  return (
    <GlassWidgetBase className={className} size="md" width="sm" glowColor={glowColor}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-white/60" />
        <h3 className="text-white/60 text-sm">{title || defaultTitle}</h3>
      </div>
      <div className="space-y-2.5">
        {processes.map((process, i) => (
          <div key={process.pid || i} className="flex items-center justify-between">
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
                  style={{ width: `${(process.usage / maxUsage) * 100}%` }}
                />
              </div>
              <span className="text-white tabular-nums w-14 text-right">
                {process.usage.toFixed(type === "memory" ? 0 : 1)}
                <span className="text-white/40 text-xs ml-0.5">{unit}</span>
              </span>
            </div>
          </div>
        ))}
        {processes.length === 0 && (
          <div className="text-center py-4 text-white/40 text-sm">No process data available</div>
        )}
      </div>
    </GlassWidgetBase>
  )
}

interface TopProcessesCarouselProps {
  memoryProcesses: ProcessInfo[]
  cpuProcesses: ProcessInfo[]
  className?: string
}

function TopProcessesCarousel({
  memoryProcesses,
  cpuProcesses,
  className,
}: TopProcessesCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const itemWidth = scrollRef.current.querySelector("div")?.offsetWidth || 288
    const index = Math.round(scrollLeft / itemWidth)
    setActiveIndex(index)
  }, [])

  return (
    <div className={className}>
      <div
        ref={scrollRef}
        className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={handleScroll}
      >
        <div className="flex gap-4" style={{ width: "max-content" }}>
          <div className="snap-center shrink-0" style={{ width: "288px" }}>
            <TopProcessesWidget type="memory" processes={memoryProcesses} />
          </div>
          <div className="snap-center shrink-0" style={{ width: "288px" }}>
            <TopProcessesWidget type="cpu" processes={cpuProcesses} />
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="flex justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
            }
          }}
          className={cn(
            "w-2 h-2 rounded-full transition-all cursor-pointer",
            activeIndex === 0 ? "bg-white/60" : "bg-white/20 hover:bg-white/40"
          )}
          aria-label="Show memory processes"
        />
        <button
          type="button"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ left: 292, behavior: "smooth" })
            }
          }}
          className={cn(
            "w-2 h-2 rounded-full transition-all cursor-pointer",
            activeIndex === 1 ? "bg-white/60" : "bg-white/20 hover:bg-white/40"
          )}
          aria-label="Show CPU processes"
        />
      </div>
    </div>
  )
}

export { TopProcessesWidget, TopProcessesCarousel }
