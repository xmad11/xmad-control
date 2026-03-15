"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// GLASS WIDGET BASE - Pixel-perfect from ein-ui
// ═══════════════════════════════════════════════════════════════════════════════

type WidgetSize = "sm" | "md" | "lg" | "xl";
type WidgetWidth = "sm" | "md" | "lg" | "xl" | "full";
type GlowColor = "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red";

interface GlassWidgetBaseProps {
  children: React.ReactNode;
  size?: WidgetSize;
  width?: WidgetWidth;
  glowColor?: GlowColor;
  glowEffect?: boolean;
  hoverScale?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<WidgetSize, string> = {
  sm: "min-h-[100px]",
  md: "min-h-[140px]",
  lg: "min-h-[180px]",
  xl: "min-h-[220px]",
};

const widthMap: Record<WidgetWidth, string> = {
  sm: "min-w-[140px] max-w-[200px]",
  md: "min-w-[200px] max-w-[280px]",
  lg: "min-w-[280px] max-w-[360px]",
  xl: "min-w-[360px] max-w-[440px]",
  full: "w-full",
};

const glowColorMap: Record<GlowColor, string> = {
  cyan: "widget-glow-cyan",
  purple: "widget-glow-purple",
  blue: "widget-glow-blue",
  pink: "widget-glow-pink",
  green: "widget-glow-green",
  amber: "widget-glow-amber",
  red: "widget-glow-red",
};

export function GlassWidgetBase({
  children,
  size = "md",
  width = "md",
  glowColor = "cyan",
  glowEffect = true,
  hoverScale = true,
  interactive = false,
  className,
  onClick,
}: GlassWidgetBaseProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base glass styles
        "relative rounded-2xl p-4",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",

        // Size and width
        sizeMap[size],
        widthMap[width],

        // Glow effect
        glowEffect && glowColorMap[glowColor],

        // Transitions
        "transition-all duration-300 ease-out",

        // Hover effects
        hoverScale && "hover:scale-[1.02] hover:-translate-y-0.5",
        interactive && "cursor-pointer",

        // Enable hardware acceleration
        "transform-gpu",

        className
      )}
    >
      {/* Inner highlight gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINI STAT WIDGET
// ═══════════════════════════════════════════════════════════════════════════════

interface MiniStatWidgetProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  glowColor?: GlowColor;
}

export function MiniStatWidget({ icon: Icon, label, value, glowColor = "cyan" }: MiniStatWidgetProps) {
  return (
    <GlassWidgetBase size="sm" width="sm" glowColor={glowColor}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-white/60" />
        <span className="text-white/50 text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-light text-white">{value}</div>
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════════════════════════════════════

type StatusType = "online" | "offline" | "warning";

const statusConfig: Record<StatusType, { bg: string; text: string; border: string; label: string }> = {
  online: {
    bg: "rgba(16, 185, 129, 0.2)",
    text: "#10b981",
    border: "rgba(16, 185, 129, 0.3)",
    label: "Online",
  },
  offline: {
    bg: "rgba(239, 68, 68, 0.2)",
    text: "#ef4444",
    border: "rgba(239, 68, 68, 0.3)",
    label: "Offline",
  },
  warning: {
    bg: "rgba(245, 158, 11, 0.2)",
    text: "#f59e0b",
    border: "rgba(245, 158, 11, 0.3)",
    label: "Warning",
  },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER STATUS CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface ServerStatusCardProps {
  icon: React.ElementType;
  label: string;
  status: StatusType;
  detail: string;
  glowColor?: GlowColor;
}

export function ServerStatusCard({
  icon: Icon,
  label,
  status,
  detail,
  glowColor = "cyan",
}: ServerStatusCardProps) {
  return (
    <GlassWidgetBase size="md" width="sm" glowColor={glowColor}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-5 w-5 text-white/70" />
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white text-lg font-medium">{detail}</span>
        <StatusBadge status={status} />
      </div>
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK CARD
// ═══════════════════════════════════════════════════════════════════════════════

type TaskStatus = "running" | "pending" | "completed" | "paused";

interface TaskCardProps {
  name: string;
  status: TaskStatus;
  progress?: number;
}

const taskStatusConfig: Record<
  TaskStatus,
  { icon: React.ElementType; color: string; glow: GlowColor }
> = {
  running: { icon: (() => { const Play = (p: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="5,3 19,12 5,21"/></svg>; return Play; })(), color: "text-emerald-400", glow: "green" },
  pending: { icon: (() => { const Clock = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>; return Clock; })(), color: "text-amber-400", glow: "amber" },
  completed: { icon: (() => { const Check = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="20,6 9,17 4,12"/></svg>; return Check; })(), color: "text-cyan-400", glow: "cyan" },
  paused: { icon: (() => { const Pause = (p: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>; return Pause; })(), color: "text-purple-400", glow: "purple" },
};

export function TaskCard({ name, status, progress = 0 }: TaskCardProps) {
  const config = taskStatusConfig[status];
  const Icon = config.icon;

  return (
    <GlassWidgetBase size="sm" width="sm" glowColor={config.glow}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium truncate">{name}</span>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      {status === "running" && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY FILE CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryFileCardProps {
  name: string;
  size: string;
  modified: string;
}

export function MemoryFileCard({ name, size, modified }: MemoryFileCardProps) {
  return (
    <GlassWidgetBase size="sm" width="sm" glowColor="blue">
      <div className="flex items-center gap-2 mb-2">
        <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span className="text-white text-sm font-medium truncate">{name}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{size}</span>
        <span>{modified}</span>
      </div>
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTION CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface QuickActionCardProps {
  icon: React.ElementType;
  label: string;
  description: string;
  glowColor?: GlowColor;
  onClick?: () => void;
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  glowColor = "cyan",
  onClick,
}: QuickActionCardProps) {
  return (
    <GlassWidgetBase
      size="md"
      width="sm"
      glowColor={glowColor}
      interactive
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-white font-medium">{label}</div>
          <div className="text-white/50 text-xs">{description}</div>
        </div>
      </div>
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD (for admin stats)
// ═══════════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
}

export function StatCard({ title, value, change, trend = "up", icon: Icon }: StatCardProps) {
  return (
    <div className="glass-dashboard-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/60 mb-1">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" ? (
                <svg className="h-3 w-3 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5H7z" />
                </svg>
              ) : (
                <svg className="h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              )}
              <span className={`text-xs ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-xl bg-white/10">
          <Icon className="h-4 w-4 text-white/60" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCULAR GAUGE WIDGET
// ═══════════════════════════════════════════════════════════════════════════════

interface GaugeWidgetProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  color?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red";
  size?: "sm" | "md" | "lg";
}

const gaugeColors: Record<string, string> = {
  cyan: "#06b6d4",
  purple: "#a855f7",
  blue: "#3b82f6",
  pink: "#ec4899",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
};

const gaugeSizeMap: Record<string, { dim: number; stroke: number; fontSize: string }> = {
  sm: { dim: 80, stroke: 6, fontSize: "text-lg" },
  md: { dim: 100, stroke: 8, fontSize: "text-xl" },
  lg: { dim: 120, stroke: 10, fontSize: "text-2xl" },
};

export function GaugeWidget({
  label,
  value,
  max = 100,
  unit = "%",
  color = "cyan",
  size = "md",
}: GaugeWidgetProps) {
  const { dim, stroke, fontSize } = gaugeSizeMap[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor = gaugeColors[color];

  return (
    <div className="flex flex-col items-center">
      <svg width={dim} height={dim} className="gauge-ring">
        {/* Track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          strokeWidth={stroke}
          className="gauge-track"
          style={{ stroke: "rgba(255,255,255,0.1)" }}
        />
        {/* Progress */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-progress"
          style={{ stroke: strokeColor }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: dim, height: dim }}>
        <span className={`font-bold text-white ${fontSize}`}>{Math.round(value)}{unit}</span>
      </div>
      <span className="text-xs text-white/50 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MULTI GAUGE WIDGET
// ═══════════════════════════════════════════════════════════════════════════════

interface MultiGaugeWidgetProps {
  title?: string;
  gauges: Array<{
    label: string;
    value: number;
    unit?: string;
    color?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red";
  }>;
  glowColor?: GlowColor;
}

export function MultiGaugeWidget({ title, gauges, glowColor = "green" }: MultiGaugeWidgetProps) {
  return (
    <GlassWidgetBase size="lg" width="md" glowColor={glowColor}>
      {title && (
        <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">{title}</div>
      )}
      <div className="flex justify-around items-end">
        {gauges.map((gauge, i) => (
          <GaugeWidget key={i} {...gauge} size="sm" />
        ))}
      </div>
    </GlassWidgetBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS BAR WIDGET
// ═══════════════════════════════════════════════════════════════════════════════

interface ProgressItemProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  color?: "cyan" | "purple" | "blue" | "pink" | "green" | "amber" | "red";
}

function ProgressItem({ label, value, max = 100, unit = "", color = "cyan" }: ProgressItemProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const barColor = gaugeColors[color];

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">
          {value}{unit} {max !== 100 && `/ ${max}${unit}`}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

interface MultiProgressWidgetProps {
  title?: string;
  items: ProgressItemProps[];
  glowColor?: GlowColor;
}

export function MultiProgressWidget({ title, items, glowColor = "purple" }: MultiProgressWidgetProps) {
  return (
    <GlassWidgetBase size="lg" width="md" glowColor={glowColor}>
      {title && (
        <div className="text-sm text-white/60 mb-4 uppercase tracking-wider">{title}</div>
      )}
      <div className="space-y-0">
        {items.map((item, i) => (
          <ProgressItem key={i} {...item} />
        ))}
      </div>
    </GlassWidgetBase>
  );
}
