"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// GLASS TABS - Pixel-perfect from ein-ui with CSS animations
// ═══════════════════════════════════════════════════════════════════════════════

const GlassTabs = TabsPrimitive.Root;

const GlassTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    expanded?: boolean;
  }
>(({ className, expanded = true, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-14 items-center justify-center gap-1 rounded-2xl",
      "bg-white/5 backdrop-blur-xl border border-white/10",
      "p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
      "transition-all duration-500 ease-out",
      expanded ? "w-auto" : "w-auto",
      className
    )}
    {...props}
  />
));
GlassTabsList.displayName = TabsPrimitive.List.displayName;

const GlassTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ElementType;
    bgClass?: string;
    expanded?: boolean;
  }
>(({ className, icon: Icon, bgClass = "tab-bg-ocean", expanded = true, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative inline-flex items-center justify-center gap-2",
      "rounded-xl px-3 py-2.5 text-sm font-medium",
      "text-white/60 transition-all duration-300 ease-out",
      "hover:text-white/80 hover:bg-white/5",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
      "disabled:pointer-events-none disabled:opacity-50",
      "overflow-hidden",
      "data-[state=active]:text-white",
      expanded ? "min-w-[80px]" : "min-w-0 px-3",
      className
    )}
    {...props}
  >
    {/* Background gradient - only visible when active */}
    <span
      className={cn(
        "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
        bgClass,
        "group-data-[state=active]:opacity-100"
      )}
      aria-hidden="true"
    />
    {/* Icon */}
    {Icon && (
      <Icon
        className={cn(
          "relative z-10 h-4 w-4 flex-shrink-0 transition-all duration-300",
          expanded ? "mr-0" : "mr-0"
        )}
      />
    )}
    {/* Label */}
    <span
      className={cn(
        "relative z-10 whitespace-nowrap transition-all duration-300 overflow-hidden",
        expanded ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"
      )}
    >
      {children}
    </span>
  </TabsPrimitive.Trigger>
));
GlassTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const GlassTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-0",
      "data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2",
      "data-[state=active]:opacity-100 data-[state=active]:translate-y-0",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
GlassTabsContent.displayName = TabsPrimitive.Content.displayName;

export { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent };
