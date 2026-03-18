/* ═══════════════════════════════════════════════════════════════════════════════
   AUTOMATION SURFACE - XMAD Control Dashboard
   Automation tasks and monitoring - Uses tokens and config only
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassAvatar, GlassAvatarFallback } from "@/components/registry/liquid-glass/glass-avatar"
import { GlassBadge } from "@/components/registry/liquid-glass/glass-badge"
import { GlassButton } from "@/components/registry/liquid-glass/glass-button"
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/registry/liquid-glass/glass-card"
import { GlassProgress } from "@/components/registry/liquid-glass/glass-progress"
import { AUTOMATION_WIDGETS, WIDGET_LAYOUT } from "@/config/dashboard"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  XCircle,
  Zap,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAP - Maps config icon names to components
// ═══════════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle2,
  Zap,
  Cpu,
  MemoryStick,
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR TOKENS - Maps config color names to Tailwind classes
// ═══════════════════════════════════════════════════════════════════════════════

const colorTokens = {
  green: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    gradient: "from-emerald-400 to-green-500",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    gradient: "from-cyan-400 to-blue-500",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    gradient: "from-amber-400 to-orange-500",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    gradient: "from-purple-400 to-pink-500",
  },
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AutomationSurface() {
  const { STATS, ACTIVITY, TASKS, CHART_DATA } = AUTOMATION_WIDGETS
  const gridCols = WIDGET_LAYOUT.CAROUSEL_ITEMS

  return (
    <div className="w-full space-y-6 pb-4">
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols.lg} gap-4`}>
        {STATS.map((stat) => {
          const Icon = iconMap[stat.icon] || CheckCircle2
          const colors = colorTokens[stat.color] || colorTokens.cyan
          return (
            <GlassCard
              key={stat.label}
              className="group hover:scale-[1.02] transition-transform duration-300"
            >
              <GlassCardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-success" />
                      )}
                      <span
                        className={`text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-success"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-white/40">vs last hour</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <GlassCardTitle>Task Performance</GlassCardTitle>
                  <GlassCardDescription>Weekly automation metrics</GlassCardDescription>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm">
                    Week
                  </GlassButton>
                  <GlassButton variant="outline" size="sm">
                    Month
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm">
                    Year
                  </GlassButton>
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="h-64 flex items-end justify-between gap-3 px-2">
                {CHART_DATA.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-500 transition-all duration-300 cursor-pointer"
                        style={{ height: `${item.value * 2}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                        {item.value} tasks
                      </div>
                    </div>
                    <span className="text-xs text-white/50">{item.day}</span>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Quick Actions</GlassCardTitle>
            <GlassCardDescription>Common automation tasks</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3">
            <GlassButton variant="primary" className="w-full justify-center">
              <Zap className="h-4 w-4 mr-2" />
              Run All Tasks
            </GlassButton>
            <GlassButton variant="outline" className="w-full justify-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Backup Now
            </GlassButton>
            <GlassButton variant="outline" className="w-full justify-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Logs
            </GlassButton>
            <GlassButton variant="ghost" className="w-full justify-center">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Task
            </GlassButton>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <GlassCardTitle>Recent Activity</GlassCardTitle>
                <GlassCardDescription>Latest automation events</GlassCardDescription>
              </div>
              <GlassButton variant="ghost" size="sm">
                View All
              </GlassButton>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-4">
              {ACTIVITY.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <GlassAvatar className="h-8 w-8">
                    <GlassAvatarFallback className="text-xs bg-gradient-to-br from-cyan-400 to-blue-500">
                      {item.user.slice(0, 2).toUpperCase()}
                    </GlassAvatarFallback>
                  </GlassAvatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">
                      <span className="font-medium text-white">{item.user}</span> {item.action}{" "}
                      <span className="text-cyan-400">{item.target}</span>
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{item.time}</p>
                  </div>
                  {item.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  )}
                  {item.status === "warning" && (
                    <XCircle className="h-4 w-4 text-warning shrink-0" />
                  )}
                  {item.status === "error" && <XCircle className="h-4 w-4 text-error shrink-0" />}
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Active Tasks */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <GlassCardTitle>Active Tasks</GlassCardTitle>
                <GlassCardDescription>Running and scheduled tasks</GlassCardDescription>
              </div>
              <GlassButton variant="ghost" size="sm">
                View All
              </GlassButton>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="space-y-5">
            {TASKS.map((task) => (
              <div key={task.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-white">{task.name}</p>
                    <GlassBadge
                      variant={
                        task.status === "Completed"
                          ? "success"
                          : task.status === "Running"
                            ? "default"
                            : "warning"
                      }
                      className="text-xs"
                    >
                      {task.status}
                    </GlassBadge>
                  </div>
                  <span className="text-xs text-white/40">{task.type}</span>
                </div>
                <div className="space-y-1">
                  <GlassProgress value={task.progress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">{task.progress}% complete</span>
                    <span className="text-white/40">Next: {task.nextRun}</span>
                  </div>
                </div>
              </div>
            ))}
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}

export default AutomationSurface
