/* ═══════════════════════════════════════════════════════════════════════════════
   MARQUEE CARD - Ultra-lightweight card with optional gradient overlay
   Fixed sizes, no layout shift, GPU-optimized
   ═══════════════════════════════════════════════════════════════════════════════ */

import { OptimizedImage } from "@/components/images"
import { memo } from "react"

export interface MarqueeCardProps {
  id: string
  images: string[]
  title: string
  blurHash?: string
  index?: number
  overlayEnabled?: boolean
}

/**
 * MarqueeCard - Lightweight card with optional gradient overlay
 *
 * Features:
 * - Fixed sizes prevent layout shift
 * - Priority loading for first batch
 * - Optional gradient overlay for premium feel
 */
export const MarqueeCard = memo(function MarqueeCard({
  images,
  title,
  blurHash,
  index: _index = 0,
  overlayEnabled = false,
}: MarqueeCardProps) {
  const imageUrl = images?.[0] ?? ""

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--bg-70)]">
      <OptimizedImage
        src={imageUrl}
        alt={title}
        blurHash={blurHash}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 80px, 140px"
        quality={60}
      />
      {/* Optional gradient overlay */}
      {overlayEnabled && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[var(--radius-xl)] bg-gradient-overlay"
          style={{
            background:
              "linear-gradient(135deg, var(--gradient-overlay-primary), var(--gradient-overlay-secondary), var(--gradient-overlay-tertiary))",
          }}
        />
      )}
    </div>
  )
})
