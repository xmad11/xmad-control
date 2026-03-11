/* ═══════════════════════════════════════════════════════════════════════════════
   CARD MEDIA - Image carousel component
   CSS scroll-snap, infinite loop, GPU-only animations
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { OptimizedImage } from "@/components/images"
import { memo, useCallback, useRef, useState } from "react"

export interface CardMediaProps {
  images: string[]
  alt: string
  blurHash?: string | string[]
  aspectRatio?: "square" | "video" | "portrait"
  overlay?: React.ReactNode
  showDots?: boolean
}

/**
 * CardMedia - Image carousel with scroll-snap
 * - No arrows (touch/swipe only)
 * - No numbers
 * - Infinite loop forward only
 * - CSS scroll-snap for GPU performance
 */
export const CardMedia = memo(function CardMedia({
  images,
  alt,
  blurHash,
  aspectRatio = "square",
  overlay,
  showDots = true,
}: CardMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Aspect ratio using tokens
  const aspectClass: Record<typeof aspectRatio, string> = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }

  // Handle scroll events - update current index based on scroll position
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const index = Math.round(container.scrollLeft / container.offsetWidth)
    setCurrentIndex(index)
  }, [])

  // Auto-advance carousel
  const __advanceCarousel = useCallback(() => {
    const container = containerRef.current
    if (!container || images.length <= 1) return

    const cardWidth = container.offsetWidth
    const nextIndex = currentIndex + 1

    if (nextIndex >= images.length) {
      // Reset to start without animation
      container.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior })
      setCurrentIndex(0)
    } else {
      container.scrollTo({ left: cardWidth * nextIndex, behavior: "smooth" })
      setCurrentIndex(nextIndex)
    }
  }, [currentIndex, images.length])

  if (images.length === 0) return null

  return (
    <div className="relative w-full">
      {/* Carousel container */}
      <div
        ref={containerRef}
        className={`
          ${aspectClass[aspectRatio]}
          relative overflow-x-auto overflow-y-hidden
          flex snap-x snap-mandatory
          scroll-smooth
          rounded-[var(--radius-xl)]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        `}
        onScroll={handleScroll}
      >
        {images.map((src, index) => {
          // Get blurHash for this image (either from array or single value)
          const imageBlurHash = Array.isArray(blurHash) ? blurHash[index] : blurHash

          return (
            <div key={`${src}`} className="flex-shrink-0 w-full h-full snap-center">
              <OptimizedImage
                src={src}
                alt={`${alt} ${index + 1}`}
                blurHash={imageBlurHash}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75}
              />
            </div>
          )
        })}
      </div>

      {/* Overlay elements (rating, favorite, etc.) */}
      {overlay && <div className="absolute inset-0 pointer-events-none">{overlay}</div>}

      {/* Carousel dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-[var(--spacing-sm)] left-1/2 -translate-x-1/2 flex gap-[var(--spacing-xs)] pointer-events-none">
          {images.map((src, index) => (
            <span
              key={`dot-${src}`}
              className={`
                w-[var(--spacing-xs)] h-[var(--spacing-xs)]
                rounded-[var(--radius-full)]
                transition-all duration-[var(--duration-fast)]
                ${
                  index === currentIndex
                    ? "bg-[var(--color-white)] opacity-100"
                    : "bg-[var(--color-white)] opacity-40"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  )
})
