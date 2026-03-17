/* ═══════════════════════════════════════════════════════════════════════════════
   CONVERSATION - ElevenLabs UI Component
   A scrolling conversation container with auto-scroll and sticky-to-bottom
   behavior for chat interfaces
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { ArrowDown } from "lucide-react"
import React, { useRef, useEffect, useState, useCallback, type ReactNode } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION - Main Container
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConversationProps {
  children: ReactNode
  className?: string
  /** Initial scroll behavior */
  initial?: "smooth" | "auto"
  /** Resize scroll behavior */
  resize?: "smooth" | "auto"
}

export function Conversation({
  children,
  className,
  initial = "smooth",
  resize = "smooth",
}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Check if scrolled to bottom
  const checkIsAtBottom = useCallback(() => {
    if (!containerRef.current) return true

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const threshold = 50 // pixels from bottom

    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      })
    }
  }, [])

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const atBottom = checkIsAtBottom()
      setIsAtBottom(atBottom)
      setShowScrollButton(!atBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [checkIsAtBottom])

  // Auto-scroll when content changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: children is intentionally tracked to detect content changes
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom(resize === "smooth" ? "smooth" : "auto")
    }
  }, [children, isAtBottom, resize, scrollToBottom])

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(initial === "smooth" ? "smooth" : "auto")
  }, [initial, scrollToBottom])

  // ResizeObserver to handle content resize
  useEffect(() => {
    const content = contentRef.current
    const container = containerRef.current
    if (!content || !container) return

    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottom) {
        scrollToBottom(resize === "smooth" ? "smooth" : "auto")
      }
    })

    resizeObserver.observe(content)
    return () => resizeObserver.disconnect()
  }, [isAtBottom, resize, scrollToBottom])

  return (
    <div className={cn("relative flex h-full flex-col", className)}>
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div ref={contentRef} className="flex flex-col">
          {children}
        </div>
      </div>

      {/* Scroll Button */}
      {showScrollButton && <ConversationScrollButton onClick={() => scrollToBottom("smooth")} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConversationContentProps {
  children: ReactNode
  className?: string
}

export function ConversationContent({ children, className }: ConversationContentProps) {
  return <div className={cn("flex flex-col gap-4 p-4", className)}>{children}</div>
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConversationEmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  className?: string
  children?: ReactNode
}

export function ConversationEmptyState({
  title = "No messages yet",
  description,
  icon,
  className,
  children,
}: ConversationEmptyStateProps) {
  if (children) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-4 p-8", className)}>
      {icon && <div className="text-white/40">{icon}</div>}
      <div className="text-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION SCROLL BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConversationScrollButtonProps {
  className?: string
  onClick?: () => void
}

export function ConversationScrollButton({ className, onClick }: ConversationScrollButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2",
        "flex h-10 w-10 items-center justify-center rounded-full",
        "bg-white/10 text-white backdrop-blur-xl",
        "border border-white/10 shadow-lg",
        "transition-all hover:bg-white/20",
        className
      )}
    >
      <ArrowDown className="h-5 w-5" />
    </button>
  )
}

export default Conversation
