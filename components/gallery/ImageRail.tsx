/* ═══════════════════════════════════════════════════════════════════════════════
   IMAGE RAIL - Horizontal scrolling image gallery
   Uses design tokens, smooth snap scrolling, hover zoom effects
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useLanguage } from "@/context/LanguageContext"
import { memo, useState } from "react"

export interface ImageRailProps {
  images: string[]
  alt?: string
  size?: "sm" | "md" | "lg"
  gap?: "sm" | "md" | "lg"
  className?: string
  onImageClick?: (index: number) => void
}

const sizeClasses = {
  sm: "h-[var(--marquee-card-size-mobile)]",
  md: "h-[var(--marquee-card-size-tablet)]",
  lg: "h-[var(--marquee-card-size-large)]",
}

const gapClasses = {
  sm: "gap-[var(--spacing-sm)]",
  md: "gap-[var(--spacing-md)]",
  lg: "gap-[var(--spacing-lg)]",
}

const widthClasses = {
  sm: "w-[var(--marquee-card-size-mobile)]",
  md: "w-[var(--marquee-card-size-tablet)]",
  lg: "w-[var(--marquee-card-size-large)]",
}

/**
 * ImageRail - Horizontal scrolling image gallery
 *
 * Features:
 * - CSS scroll snap for smooth scrolling
 * - Hover zoom effect on images
 * - Optional click handler for image selection
 * - Responsive sizing with design tokens
 *
 * @example
 * <ImageRail
 *   images={["url1", "url2", "url3"]}
 *   alt="Restaurant photos"
 *   size="md"
 *   onImageClick={(index) => console.log(index)}
 * />
 */
export const ImageRail = memo(function ImageRail({
  images,
  alt = "Gallery image",
  size = "md",
  gap = "md",
  className = "",
  onImageClick,
}: ImageRailProps) {
  const { t } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleImageClick = (index: number) => {
    onImageClick?.(index)
  }

  if (images.length === 0) {
    return (
      <div
        className={`${sizeClasses[size]} ${gapClasses[gap]} flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--fg-5)] ${className}`}
      >
        <p className="text-[var(--font-size-sm)] text-[var(--fg-40)]">
          {t("common.noImagesAvailable")}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`
        flex overflow-x-auto
        snap-x snap-mandatory
        scrollbar-hide
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {images.map((src, index) => (
        <button
          key={src}
          type="button"
          onClick={() => handleImageClick(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`
            relative flex-shrink-0 rounded-[var(--radius-lg)] overflow-hidden
            ${widthClasses[size]} ${sizeClasses[size]}
            snap-center
            transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]
            ${hoveredIndex === index ? "scale-105" : "scale-100"}
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          `}
          aria-label={`${alt} ${index + 1} of ${images.length}`}
        >
          <img
            src={src}
            alt={`${alt} ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Image number overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-[var(--duration-normal)]">
            <span className="absolute bottom-[var(--spacing-sm)] right-[var(--spacing-sm)] text-[var(--font-size-xs)] text-white font-medium">
              {index + 1}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
})
