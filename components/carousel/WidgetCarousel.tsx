"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET CAROUSEL - Pixel-perfect from ein-ui
// ═══════════════════════════════════════════════════════════════════════════════

type Gap = "none" | "xs" | "sm" | "md";
type ItemsPerView = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
};

interface WidgetCarouselProps {
  children: React.ReactNode;
  className?: string;
  gap?: Gap;
  itemsPerView?: ItemsPerView;
  loop?: boolean;
  draggable?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const gapMap: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-3",
  md: "gap-4",
};

// Default responsive breakpoints
const defaultItemsPerView: ItemsPerView = {
  base: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
};

export function WidgetCarousel({
  children,
  className,
  gap = "sm",
  itemsPerView = defaultItemsPerView,
  loop = false,
  draggable = true,
  showDots = false,
  autoplay = false,
  autoplayInterval = 5000,
}: WidgetCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  // Calculate width percentage based on itemsPerView
  const getGridClass = () => {
    const base = itemsPerView.base ?? 1;
    const sm = itemsPerView.sm ?? base;
    const md = itemsPerView.md ?? sm;
    const lg = itemsPerView.lg ?? md;
    const xl = itemsPerView.xl ?? lg;
    const xxl = itemsPerView["2xl"] ?? xl;

    // Calculate percentages
    const basePct = 100 / base;
    const smPct = 100 / sm;
    const mdPct = 100 / md;
    const lgPct = 100 / lg;
    const xlPct = 100 / xl;
    const xxlPct = 100 / xxl;

    return `flex-[0_0_${basePct}%] min-w-0 sm:flex-[0_0_${smPct}%] md:flex-[0_0_${mdPct}%] lg:flex-[0_0_${lgPct}%] xl:flex-[0_0_${xlPct}%] 2xl:flex-[0_0_${xxlPct}%]`;
  };

  // Scroll snap navigation
  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Update selected index on scroll
  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Initialize
  React.useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  React.useEffect(() => {
    if (!autoplay || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className={cn("flex", gapMap[gap])}>
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className={cn(
                "carousel-item",
                getGridClass(),
                "pr-3 last:pr-0" // Ensure spacing
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "bg-white/80 scale-110"
                  : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLE HORIZONTAL SCROLL (fallback without embla)
// ═══════════════════════════════════════════════════════════════════════════════

export function HorizontalScroll({
  children,
  className,
  gap = "sm",
}: Omit<WidgetCarouselProps, "itemsPerView" | "loop" | "draggable" | "showDots" | "autoplay" | "autoplayInterval">) {
  return (
    <div
      className={cn(
        "flex overflow-x-auto scrollbar-hide",
        gapMap[gap],
        "pb-2 -mb-2", // Account for scrollbar space
        className
      )}
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {React.Children.map(children, (child) => (
        <div
          className="flex-shrink-0 scroll-snap-align-start"
          style={{ scrollSnapAlign: "start" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default WidgetCarousel;
