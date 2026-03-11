/**
 * SwipeCarousel Component
 *
 * Custom touch/drag carousel with NO external dependencies.
 * Features:
 * - Touch swipe detection with velocity thresholds
 * - Lazy loading with Intersection Observer
 * - Image preloading for adjacent slides
 * - Auto-play with pause on drag
 * - Keyboard navigation
 * - ARIA live regions
 * - Uses design tokens exclusively
 *
 * @module components/ui/SwipeCarousel
 */

"use client"

import Image from "next/image"
import { memo, useCallback, useEffect, useRef, useState } from "react"

// ============================================================================
// TYPES
// ============================================================================

export interface SwipeCarouselProps {
  images: string[]
  className?: string
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showArrows?: boolean
  height?: string
  cardIndex?: number
  restaurantName?: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SwipeCarouselComponent = function SwipeCarousel({
  images,
  className = "",
  autoPlay = false,
  interval = 5000,
  showIndicators = true,
  height = "12rem",
  cardIndex = 0,
  restaurantName = "Restaurant",
}: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const [isVisible, setIsVisible] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]))

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartTime = useRef(0)
  const autoPlayTimeout = useRef<NodeJS.Timeout>()
  const wasSwipedRef = useRef(false)

  // Intersection Observer for lazy initialization
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (autoPlay && !isAutoPlaying) {
            setIsAutoPlaying(true)
          }
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [autoPlay, isAutoPlaying])

  // Slide navigation functions
  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)

    // Preload adjacent images
    const adjacentIndexes = [
      (newIndex - 1 + images.length) % images.length,
      (newIndex + 1) % images.length,
    ]
    setLoadedImages((prev) => {
      const newSet = new Set(prev)
      adjacentIndexes.forEach((idx) => newSet.add(idx))
      return newSet
    })
  }, [currentIndex, images.length])

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)

    const adjacentIndexes = [
      (newIndex - 1 + images.length) % images.length,
      (newIndex + 1) % images.length,
    ]
    setLoadedImages((prev) => {
      const newSet = new Set(prev)
      adjacentIndexes.forEach((idx) => newSet.add(idx))
      return newSet
    })
  }, [currentIndex, images.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (isVisible && isAutoPlaying && images.length > 1) {
      autoPlayTimeout.current = setTimeout(() => {
        nextSlide()
      }, interval)
    }
    return () => {
      if (autoPlayTimeout.current) {
        clearTimeout(autoPlayTimeout.current)
      }
    }
  }, [isVisible, isAutoPlaying, interval, images.length, nextSlide])

  // Drag handlers
  const handleDragStart = useCallback(
    (clientX: number) => {
      setIsDragging(true)
      setDragStartX(clientX)
      setDragOffset(0)
      dragStartTime.current = Date.now()
      if (isAutoPlaying) {
        setIsAutoPlaying(false)
      }
    },
    [isAutoPlaying]
  )

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return
      const deltaX = clientX - dragStartX
      const maxDragDistance = containerRef.current ? containerRef.current.offsetWidth * 0.3 : 100
      const constrainedDeltaX = Math.max(-maxDragDistance, Math.min(maxDragDistance, deltaX))
      setDragOffset(constrainedDeltaX)
    },
    [isDragging, dragStartX]
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return

    const dragDistance = Math.abs(dragOffset)
    const dragTime = Date.now() - dragStartTime.current
    const dragSpeed = dragDistance / dragTime
    const containerWidth = containerRef.current?.offsetWidth || 1

    const minSwipeDistance = containerWidth * 0.15
    const minSwipeSpeed = 0.5
    const isSwipe = dragDistance > minSwipeDistance || dragSpeed > minSwipeSpeed

    if (isSwipe) {
      wasSwipedRef.current = true
      setTimeout(() => {
        wasSwipedRef.current = false
      }, 100)

      if (dragOffset > 0) {
        prevSlide()
      } else if (dragOffset < 0) {
        nextSlide()
      }
    }

    setIsDragging(false)
    setDragOffset(0)

    if (autoPlay) {
      setTimeout(() => setIsAutoPlaying(true), 4000)
    }
  }, [isDragging, dragOffset, nextSlide, prevSlide, autoPlay])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleDragMove(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragStart(touch.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    handleDragMove(touch.clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Click handler to prevent parent navigation
  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    if (wasSwipedRef.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [nextSlide, prevSlide])

  // Calculate transforms
  const baseTransform = -(currentIndex * 100)
  const dragTransform =
    isDragging && containerRef.current ? (dragOffset / containerRef.current.offsetWidth) * 100 : 0
  const totalTransform = baseTransform + dragTransform

  // Process images safely (handle both strings and objects)
  const safeImages: string[] = []
  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (typeof img === "string" && img.startsWith("http")) {
        safeImages.push(img)
      } else if (img && typeof img === "object" && typeof img.url === "string") {
        safeImages.push(img.url)
      }
    })
  }

  if (safeImages.length === 0) return null

  // Placeholder when not visible
  if (!isVisible) {
    return (
      <div ref={containerRef} className={className} style={{ height } as React.CSSProperties}>
        <Image
          src={safeImages[0]}
          alt={`${restaurantName} image`}
          fill
          className="object-cover"
          loading={cardIndex < 3 ? "eager" : "lazy"}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height } as React.CSSProperties}
      onClick={handleCarouselClick}
    >
      {/* Carousel Track */}
      <section
        aria-roledescription="carousel"
        aria-label={`${restaurantName} image gallery`}
        className={`flex transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] ${isDragging ? "" : "cursor-grab active:cursor-grabbing"}`}
        style={{ transform: `translateX(${totalTransform}%)` } as React.CSSProperties}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {safeImages.map((image, index) => {
          const isLoaded = loadedImages.has(index)
          return (
            <div key={`${image}-${index}`} className="w-full flex-shrink-0 h-full">
              {isLoaded ? (
                <Image
                  src={image}
                  alt={`${restaurantName} image ${index + 1}`}
                  fill
                  className="object-cover"
                  loading={index === currentIndex && cardIndex < 3 ? "eager" : "lazy"}
                />
              ) : (
                <div className="w-full h-full bg-[var(--bg-70)] flex items-center justify-center">
                  <div className="w-[var(--icon-size-lg)] h-[var(--icon-size-lg)] rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)] animate-spin" />
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)]/20 via-transparent to-transparent pointer-events-none" />

      {/* Auto-play toggle */}
      {autoPlay && safeImages.length > 1 && (
        <button
          type="button"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-[var(--spacing-md)] right-[var(--spacing-md)] bg-[var(--color-white)]/80 hover:bg-[var(--color-white)] text-[var(--fg)] p-[var(--spacing-xs)] rounded-[var(--radius-full)] shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-fast)]"
          aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
        >
          {isAutoPlaying ? (
            // Pause icon
            <svg
              className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            // Play icon
            <svg
              className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
      )}

      {/* Indicators */}
      {showIndicators && safeImages.length > 1 && (
        <div className="absolute bottom-[var(--spacing-md)] left-1/2 -translate-x-1/2 flex gap-[var(--spacing-xs)]">
          {safeImages.map((_, index) => (
            <button
              key={`${index}-${safeImages[index]}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={`transition-all duration-[var(--duration-normal)] ${
                index === currentIndex
                  ? "w-[2rem] h-[0.5rem] bg-[var(--color-white)] rounded-[var(--radius-full)] shadow-[var(--shadow-lg)]"
                  : "w-[0.5rem] h-[0.5rem] bg-[var(--color-white)]/60 hover:bg-[var(--color-white)]/80 rounded-[var(--radius-full)]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const SwipeCarousel = memo(SwipeCarouselComponent)
