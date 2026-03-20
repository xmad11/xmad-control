/* ═══════════════════════════════════════════════════════════════════════════════
   MEMORY SURFACE - XMAD Control Dashboard
   Memory monitoring with RAM stats and top processes
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { WidgetCarousel } from "@/components/carousel/WidgetCarousel"
import {
  GlassWidgetBase,
  MultiGaugeWidget,
  MultiProgressWidget,
} from "@/components/widgets/base-widget"
import { type ProcessInfo, TopProcessesWidget } from "@/components/widgets/top-processes-widget"
import { useDashboardData } from "@/runtime/useSurfaceController"
import { HardDrive, MemoryStick } from "lucide-react"
import * as React from "react"

export function MemorySurface() {
  const { stats } = useDashboardData()
  const [processesData, setProcessesData] = React.useState<{
    memory: ProcessInfo[]
    cpu: ProcessInfo[]
  }>({ memory: [], cpu: [] })

  // Fetch processes
  React.useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const res = await fetch("/api/xmad/system/processes")
        if (res.ok) {
          const data = await res.json()
          setProcessesData({
            memory: data.memory || [],
            cpu: data.cpu || [],
          })
        }
      } catch {
        // Silently fail
      }
    }

    fetchProcesses()
    const interval = setInterval(fetchProcesses, 5000)
    return () => clearInterval(interval)
  }, [])

  // Calculate memory values with fallbacks
  const ramUsed = (stats?.memory.used ?? 4200) / 1024
  const ramTotal = (stats?.memory.total ?? 8192) / 1024
  const ramFree = ramTotal - ramUsed
  const ramPercentage = stats?.memory.percentage ?? 52
  const swapUsed = 0.5 // Mock - no API endpoint yet

  return (
    <>
      {/* Row 1 - Memory Gauges */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2 }}>
          <MultiGaugeWidget
            gauges={[
              { label: "Used", value: ramPercentage, unit: "%", color: "green" },
              { label: "Free", value: 100 - ramPercentage, unit: "%", color: "cyan" },
              { label: "Swap", value: Math.round((swapUsed / 2) * 100), unit: "%", color: "amber" },
            ]}
            glowColor="green"
          />
          <MultiProgressWidget
            items={[
              {
                label: "RAM Used",
                value: ramUsed,
                max: ramTotal,
                unit: "GB",
                color: "green",
              },
              {
                label: "RAM Free",
                value: ramFree,
                max: ramTotal,
                unit: "GB",
                color: "cyan",
              },
              {
                label: "Swap Used",
                value: swapUsed,
                max: 2,
                unit: "GB",
                color: "amber",
              },
            ]}
            glowColor="green"
          />
        </WidgetCarousel>
      </div>

      {/* Row 2 - Memory Stats Cards */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 2, lg: 4 }}>
          <GlassWidgetBase size="md" width="sm" glowColor="green">
            <div className="flex items-center gap-3 mb-3">
              <MemoryStick className="h-5 w-5 text-green-400" />
              <span className="text-white/60 text-sm">RAM Used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramUsed.toFixed(1)} GB</span>
              <span className="text-green-400 text-xs">{ramPercentage}%</span>
            </div>
          </GlassWidgetBase>

          <GlassWidgetBase size="md" width="sm" glowColor="cyan">
            <div className="flex items-center gap-3 mb-3">
              <MemoryStick className="h-5 w-5 text-cyan-400" />
              <span className="text-white/60 text-sm">RAM Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramFree.toFixed(1)} GB</span>
              <span className="text-cyan-400 text-xs">{100 - ramPercentage}%</span>
            </div>
          </GlassWidgetBase>

          <GlassWidgetBase size="md" width="sm" glowColor="green">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="h-5 w-5 text-green-400" />
              <span className="text-white/60 text-sm">RAM %</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramPercentage}%</span>
              <span className="text-white/40 text-xs">of {ramTotal.toFixed(0)} GB</span>
            </div>
          </GlassWidgetBase>

          <GlassWidgetBase size="md" width="sm" glowColor="amber">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="h-5 w-5 text-amber-400" />
              <span className="text-white/60 text-sm">Swap Used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{swapUsed.toFixed(1)} GB</span>
              <span className="text-amber-400 text-xs">of 2 GB</span>
            </div>
          </GlassWidgetBase>
        </WidgetCarousel>
      </div>

      {/* Row 3 - Top Processes */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2 }}>
          <TopProcessesWidget type="memory" processes={processesData.memory} />
          <TopProcessesWidget type="cpu" processes={processesData.cpu} />
        </WidgetCarousel>
      </div>
    </>
  )
}

export default MemorySurface
