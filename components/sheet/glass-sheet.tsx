/* ═══════════════════════════════════════════════════════════════════════════════
   GLASS SHEET COMPONENT - Multi-position sheet (up, down, left, right, center)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { SHEET, type SheetPosition } from "@/config/dashboard"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import * as React from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassSheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  position?: SheetPosition
  title?: string
  description?: string
  showClose?: boolean
  className?: string
  contentClassName?: string
}

interface GlassSheetContentProps {
  children: React.ReactNode
  className?: string
}

interface GlassSheetHeaderProps {
  children: React.ReactNode
  className?: string
}

interface GlassSheetTitleProps {
  children: React.ReactNode
  className?: string
}

interface GlassSheetDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface GlassSheetFooterProps {
  children: React.ReactNode
  className?: string
}

interface GlassSheetCloseProps {
  className?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTS FOR DIFFERENT POSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const sheetVariants = {
  up: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  down: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  center: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
} as const

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

const positionClasses: Record<SheetPosition, string> = {
  up: "bottom-0 left-0 right-0 top-auto h-[75vh] rounded-t-3xl",
  down: "top-0 left-0 right-0 bottom-auto h-[75vh] rounded-b-3xl",
  left: "left-0 top-0 bottom-0 right-auto w-full max-w-md rounded-r-3xl",
  right: "right-0 top-0 bottom-0 left-auto w-full max-w-md rounded-l-3xl",
  center:
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[75vh] rounded-3xl",
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  position: SheetPosition
}>({
  open: false,
  onOpenChange: () => {},
  position: "up",
})

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SHEET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function GlassSheet({
  children,
  open = false,
  onOpenChange,
  position = "up",
  title,
  description,
  showClose = true,
  className,
  contentClassName,
}: GlassSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(open)

  // Handle controlled/uncontrolled state
  const isControlled = onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange(value)
      } else {
        setInternalOpen(value)
      }
    },
    [isControlled, onOpenChange]
  )

  // Close on escape
  React.useEffect(() => {
    if (!SHEET.CLOSE_ON_ESCAPE) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, handleOpenChange])

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange, position }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: SHEET.ANIMATION_DURATION / 1000 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => SHEET.CLOSE_ON_OUTSIDE_CLICK && handleOpenChange(false)}
            />

            {/* Sheet */}
            <motion.div
              variants={sheetVariants[position]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: SHEET.ANIMATION_DURATION / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={cn(
                "fixed z-50",
                "bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95",
                "backdrop-blur-xl",
                "border border-white/20",
                "shadow-[0_8px_32px_rgba(0,0,0,0.37)]",
                "before:absolute before:inset-0 before:rounded-[inherit]",
                "before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
                positionClasses[position],
                className
              )}
            >
              {/* Close button */}
              {showClose && (
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className={cn(
                    "absolute top-4 right-4 z-10",
                    "p-2 rounded-xl",
                    "bg-white/10 hover:bg-white/15",
                    "border border-white/20",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95"
                  )}
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              )}

              {/* Content with optional header */}
              <div className={cn("h-full flex flex-col", contentClassName)}>
                {(title || description) && (
                  <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-white/10">
                    {title && <h2 className="text-xl font-bold text-white mb-1">{title}</h2>}
                    {description && <p className="text-sm text-white/60">{description}</p>}
                  </div>
                )}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <SheetContext.Provider
                    value={{ open: isOpen, onOpenChange: handleOpenChange, position }}
                  >
                    {children}
                  </SheetContext.Provider>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SheetContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHEET CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export function GlassSheetContent({ children, className }: GlassSheetContentProps) {
  return <div className={className}>{children}</div>
}

export function GlassSheetHeader({ children, className }: GlassSheetHeaderProps) {
  return (
    <div className={cn("flex-shrink-0 px-6 pt-6 pb-4 border-b border-white/10", className)}>
      {children}
    </div>
  )
}

export function GlassSheetTitle({ children, className }: GlassSheetTitleProps) {
  return <h2 className={cn("text-xl font-bold text-white", className)}>{children}</h2>
}

export function GlassSheetDescription({ children, className }: GlassSheetDescriptionProps) {
  return <p className={cn("text-sm text-white/60 mt-1", className)}>{children}</p>
}

export function GlassSheetFooter({ children, className }: GlassSheetFooterProps) {
  return (
    <div className={cn("flex-shrink-0 px-6 py-4 border-t border-white/10", className)}>
      {children}
    </div>
  )
}

export function GlassSheetClose({ className }: GlassSheetCloseProps) {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        "px-4 py-2 rounded-lg",
        "bg-white/10 hover:bg-white/15",
        "border border-white/20",
        "text-white text-sm font-medium",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      Close
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface GlassSheetTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export function GlassSheetTrigger({
  asChild = false,
  children,
  className,
}: GlassSheetTriggerProps) {
  const { onOpenChange } = React.useContext(SheetContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => onOpenChange(true),
    })
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)} className={className}>
      {children}
    </button>
  )
}
