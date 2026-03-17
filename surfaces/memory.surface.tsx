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
import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { useDashboardData } from "@/runtime/useSurfaceController"
import { HardDrive, MemoryStick } from "lucide-react"

// TODO: wire to real API route when available — currently mocked
const mockTopProcesses = [
  { name: "bun", memory: 454, pid: 1234 },
  { name: "claude", memory: 391, pid: 2345 },
  { name: "node", memory: 55, pid: 3456 },
]

export function MemorySurface() {
  const { stats } = useDashboardData()

  // Calculate memory values with fallbacks
  const ramUsed = stats?.memory.used ?? 4.2
  const ramTotal = stats?.memory.total ?? 8
  const ramFree = ramTotal - ramUsed
  const ramPercentage = stats?.memory.percentage ?? 52
  // Swap is typically small on macOS with 8GB RAM
  const swapUsed = 0.5 // Mock - no API endpoint yet

  return (
    <>
      {/* Row 1 - Memory Gauges */}
      <div className="mb-4">
        <WidgetCarousel gap="sm" itemsPerView={{ base: 1, sm: 1, lg: 2 }}>
          <MultiGaugeWidget
            title="Memory Overview"
            gauges={[
              { label: "Used", value: ramPercentage, unit: "%", color: "purple" },
              { label: "Free", value: 100 - ramPercentage, unit: "%", color: "green" },
              { label: "Swap", value: Math.round((swapUsed / 2) * 100), unit: "%", color: "amber" },
            ]}
            glowColor="purple"
          />
          <MultiProgressWidget
            title="Memory Usage"
            items={[
              {
                label: "RAM Used",
                value: ramUsed,
                max: ramTotal,
                unit: "GB",
                color: "purple",
              },
              {
                label: "RAM Free",
                value: ramFree,
                max: ramTotal,
                unit: "GB",
                color: "green",
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
          <GlassWidgetBase size="md" width="sm" glowColor="purple">
            <div className="flex items-center gap-3 mb-3">
              <MemoryStick className="h-5 w-5 text-purple-400" />
              <span className="text-white/60 text-sm">RAM Used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramUsed.toFixed(1)} GB</span>
              <span className="text-purple-400 text-xs">{ramPercentage}%</span>
            </div>
          </GlassWidgetBase>

          <GlassWidgetBase size="md" width="sm" glowColor="green">
            <div className="flex items-center gap-3 mb-3">
              <MemoryStick className="h-5 w-5 text-green-400" />
              <span className="text-white/60 text-sm">RAM Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramFree.toFixed(1)} GB</span>
              <span className="text-green-400 text-xs">{100 - ramPercentage}%</span>
            </div>
          </GlassWidgetBase>

          <GlassWidgetBase size="md" width="sm" glowColor="purple">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="h-5 w-5 text-purple-400" />
              <span className="text-white/60 text-sm">RAM %</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-2xl font-light">{ramPercentage}%</span>
              <span className="text-white/40 text-xs">of {ramTotal} GB</span>
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

      {/* Row 3 - Top Processes by Memory */}
      <div className="mb-4">
        <GlassWidgetBase size="lg" width="md" glowColor="cyan">
            <div
              className="text-sm text-white/60 mb-4 uppercase tracking-wider"
              style={{ transition: `opacity ${aiDockTokens.motion.widgetAppear}ms ease` }}
            >
              Top Processes by Memory
            </div>
            <div className="space-y-3">
              {mockTopProcesses.map((process, index) => (
                <div
                  key={process.pid}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  style={{
                    transition: `all ${aiDockTokens.motion.widgetAppear}ms ease`,
                    transitionDelay: `${index * aiDockTokens.motion.widgetStagger}ms`,
                    willChange: "transform",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{process.name}</div>
                      <div className="text-white/40 text-xs">PID: {process.pid}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{process.memory} MB</div>
                    <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                        style={{
                          width: `${(process.memory / 500) * 100}%`,
                          transition: `width ${aiDockTokens.motion.gaugeAnimation}ms ease`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassWidgetBase>
      </div>
    </>
  )
}

export default MemorySurface
