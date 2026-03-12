/* ═══════════════════════════════════════════════════════════════════════════════
   MARQUEE IMAGE CARD - Home page marquees only
   Image only, no text, no radius conflicts
   ═══════════════════════════════════════════════════════════════════════════════ */

import Image from "next/image"
import { memo } from "react"

export interface MarqueeImageCardProps {
  id: string
  image: string
  alt?: string
}

/**
 * MarqueeImageCard - Image-only card for marquees
 *
 * Hard rules:
 * - Image only
 * - No text
 * - No radius conflicts (uses container radius)
 * - Fixed aspect ratio
 * - No hover effects
 */
const MarqueeImageCard = memo(function MarqueeImageCard({
  image,
  alt = "",
}: MarqueeImageCardProps) {
  return (
    <div className="relative aspect-square overflow-hidden bg-[var(--fg-10)]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 20vw, 180px"
      />
    </div>
  )
})

export { MarqueeImageCard }
