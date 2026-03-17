"use client"

import { cn } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import React, { useEffect, useState } from "react"

export interface WidgetCarouselProps {
  children: React.ReactNode[]
  className?: string
  /** Gap between items - default is 12px (sm) */
  gap?: "none" | "xs" | "sm" | "md"
  /** Number of items to show at different breakpoints */
  itemsPerView?: {
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function WidgetCarousel({
  children,
  className = "",
  gap = "sm",
  itemsPerView = { base: 1, sm: 2, lg: 3, xl: 4 },
}: WidgetCarouselProps) {
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.base ?? 1)

  // Embla carousel with proper snap behavior
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  })

  // Gap sizes in pixels
  const gapSizes = {
    none: 0,
    xs: 8,
    sm: 12,
    md: 16,
  }

  // Handle responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width >= 1280) {
        setCurrentItemsPerView(
          itemsPerView.xl ??
            itemsPerView.lg ??
            itemsPerView.md ??
            itemsPerView.sm ??
            itemsPerView.base ??
            1
        )
      } else if (width >= 1024) {
        setCurrentItemsPerView(
          itemsPerView.lg ?? itemsPerView.md ?? itemsPerView.sm ?? itemsPerView.base ?? 1
        )
      } else if (width >= 768) {
        setCurrentItemsPerView(itemsPerView.md ?? itemsPerView.sm ?? itemsPerView.base ?? 1)
      } else if (width >= 640) {
        setCurrentItemsPerView(itemsPerView.sm ?? itemsPerView.base ?? 1)
      } else {
        setCurrentItemsPerView(itemsPerView.base ?? 1)
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [itemsPerView])

  // Re-initialize Embla when items per view changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [currentItemsPerView, emblaApi])

  const gapPx = gapSizes[gap]
  const gapClass = gap === "none" ? "" : `gap-${gap === "xs" ? "2" : gap === "sm" ? "3" : "4"}`

  // Calculate item width: (100% - gaps) / itemsPerView
  // Example: 4 items with 12px gap = (100% - 36px) / 4
  const totalGapPx = gapPx * (currentItemsPerView - 1)

  return (
    <div className={cn("w-full select-none overflow-hidden", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn("flex", gapClass)}>
          {React.Children.map(children, (child, index) => (
            <div
              key={`carousel-item-${index}`}
              className="flex-shrink-0 flex-grow-0 min-w-0"
              style={{
                width: `calc((100% - ${totalGapPx}px) / ${currentItemsPerView})`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
