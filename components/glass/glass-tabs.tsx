/* ═══════════════════════════════════════════════════════════════════════════════
   Glass Tabs Component
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassTabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

interface GlassTabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface GlassTabsListProps {
  children: ReactNode;
  className?: string;
  expanded?: boolean;
}

interface GlassTabsTriggerProps {
  value: string;
  children?: ReactNode;
  icon?: LucideIcon;
  bgClass?: string;
  expanded?: boolean;
  className?: string;
}

interface GlassTabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const GlassTabsContext = createContext<GlassTabsContextValue | null>(null);

function useGlassTabs() {
  const context = useContext(GlassTabsContext);
  if (!context) {
    throw new Error("GlassTabs components must be used within a GlassTabs provider");
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function GlassTabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className = "",
}: GlassTabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");

  const value = controlledValue ?? uncontrolledValue;
  const handleValueChange = (newValue: string) => {
    setUncontrolledValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <GlassTabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </GlassTabsContext.Provider>
  );
}

export function GlassTabsList({ children, className = "", expanded = true }: GlassTabsListProps) {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassTabsTrigger({
  value,
  children,
  icon: Icon,
  bgClass = "",
  expanded = true,
  className = "",
}: GlassTabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useGlassTabs();
  const isSelected = selectedValue === value;

  const bgColors: Record<string, string> = {
    "tab-bg-ocean": "from-cyan-500/20 to-blue-500/20",
    "tab-bg-aurora": "from-purple-500/20 to-pink-500/20",
    "tab-bg-forest": "from-green-500/20 to-emerald-500/20",
    "tab-bg-sunset": "from-orange-500/20 to-red-500/20",
    "tab-bg-midnight": "from-indigo-500/20 to-purple-500/20",
  };

  const gradientClass = isSelected ? bgColors[bgClass] || "from-white/10 to-white/5" : "";

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
        transition-all duration-300
        ${isSelected ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg` : "text-white/60 hover:text-white hover:bg-white/5"}
        ${className}
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {expanded && <span className="text-sm font-medium">{children}</span>}
    </button>
  );
}

export function GlassTabsContent({ value, children, className = "" }: GlassTabsContentProps) {
  const { value: selectedValue } = useGlassTabs();

  if (selectedValue !== value) return null;

  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  );
}

export default GlassTabs;
