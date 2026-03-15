/* ═══════════════════════════════════════════════════════════════════════════════
   LIST VARIANT - List-style card variant
   ═══════════════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import type { CardVariant } from "../BaseCard"

export interface ListVariantProps {
  title?: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}

/**
 * ListVariant - List-style card display
 * TODO: Implement full list variant
 */
export const ListVariant = memo(function ListVariant({
  title,
  subtitle,
  className,
  children,
}: ListVariantProps) {
  return (
    <div className={`flex items-center gap-3 p-3 ${className || ""}`}>
      <div className="flex-1 min-w-0">
        {title && <h3 className="text-white font-medium truncate">{title}</h3>}
        {subtitle && <p className="text-white/60 text-sm truncate">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
})

export default ListVariant
