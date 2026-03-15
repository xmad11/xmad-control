/* ═══════════════════════════════════════════════════════════════════════════════
   Widget Carousel Component
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ItemsPerView {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface WidgetCarouselProps {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  itemsPerView?: ItemsPerView;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function WidgetCarousel({
  children,
  gap = "sm",
  itemsPerView = { base: 1, sm: 2, lg: 3, xl: 4 },
  className = "",
}: WidgetCarouselProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  // Convert itemsPerView to grid classes
  const getGridCols = () => {
    const { base = 1, sm, md, lg, xl } = itemsPerView;
    const classes = [`grid-cols-${base}`];
    if (sm) classes.push(`sm:grid-cols-${sm}`);
    if (md) classes.push(`md:grid-cols-${md}`);
    if (lg) classes.push(`lg:grid-cols-${lg}`);
    if (xl) classes.push(`xl:grid-cols-${xl}`);
    return classes.join(" ");
  };

  return (
    <div className={`grid ${getGridCols()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

export default WidgetCarousel;
