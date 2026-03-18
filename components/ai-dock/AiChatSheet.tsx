/* ═══════════════════════════════════════════════════════════════════════════════
   AI CHAT SHEET - Bottom sheet with voice-enabled AI chat
   Lightweight - uses CSS-only wave animation
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton } from "@/components/glass/glass-button"
import { GlassInput } from "@/components/glass/glass-input"
import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, MessageSquare, Mic, MicOff, X } from "lucide-react"
import DOMPurify from "dompurify"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// SPRING CONFIG (from SSOT aiDockTokens.motion)
// ═══════════════════════════════════════════════════════════════════════════════

const sheetSpring = {
  type: "spring" as const,
  damping: aiDockTokens.motion.springDamping,
  stiffness: aiDockTokens.motion.springStiffness,
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLE CSS-ONLY WAVE INDICATOR (No canvas, no memory issues)
// ═══════════════════════════════════════════════════════════════════════════════

function SimpleWaveIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full transition-colors duration-150",
            active ? "bg-cyan-400 wave-bar" : "bg-white/30"
          )}
          style={{
            height: "8px",
            animationDelay: `${i * 75}ms`,
            animationDuration: `${aiDockTokens.motion.waveDurationSec}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationName: active ? "wave-anim" : "none",
            willChange: "transform",
          }}
        />
      ))}
      <style jsx>{`
        .wave-bar {
          transform-origin: bottom;
        }
        @keyframes wave-anim {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY - Sanitize content to prevent XSS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sanitize text content to prevent XSS attacks
 * Strips HTML tags and dangerous content from AI responses
 */
function sanitizeContent(content: string): string {
  // Configure DOMPurify to strip all HTML, only allow text
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  })
}

/**
 * Sanitized message component - prevents XSS from AI responses
 */
function SanitizedMessage({ content }: { content: string }) {
  const sanitizedContent = useMemo(() => sanitizeContent(content), [content])
  return <p className="text-sm whitespace-pre-wrap">{sanitizedContent}</p>
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AiChatSheetProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI CHAT SHEET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AiChatSheet({ isOpen, onClose, className }: AiChatSheetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your XMAD AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  // biome-ignore lint/correctness/useExhaustiveDependencies: only need to scroll when messages change, content not needed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Send message handler - wired to /api/xmad/chat
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    try {
      // Call the chat API
      const response = await fetch("/api/xmad/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      })

      const data = await response.json()

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.message
          : data.error || "AI service temporarily unavailable.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch {
      // Handle network errors gracefully
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "AI service temporarily unavailable. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }
  }, [])

  // Handle key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
        e.preventDefault()
        handleSendMessage(inputValue)
      }
    },
    [inputValue, handleSendMessage]
  )

  // Toggle mic
  const handleMicToggle = useCallback(() => {
    setIsMicEnabled((prev) => !prev)
    setIsListening((prev) => !prev)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: aiDockTokens.opacity.backdrop }}
            exit={{ opacity: 0 }}
            transition={{ duration: aiDockTokens.motion.sheetBackdrop / 1000, ease: [0.2, 0.8, 0.2, 1] as const }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
            style={{ zIndex: aiDockTokens.layer.backdrop, willChange: "opacity" }}
          />
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetSpring}
            className={cn(
              "fixed inset-x-0 bottom-0 overflow-hidden",
              "bg-slate-900/90 backdrop-blur-xl",
              "border-t border-white/10",
              "flex flex-col",
              className
            )}
            style={{
              height: aiDockTokens.size.sheetMaxHeight,
              borderTopLeftRadius: aiDockTokens.size.sheetRadius,
              borderTopRightRadius: aiDockTokens.size.sheetRadius,
              zIndex: aiDockTokens.layer.sheet,
              willChange: "transform",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "rgba(34, 211, 238, 0.2)" }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: aiDockTokens.color.accent }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-white/50 text-sm">Voice-enabled chat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Audio Visualizer - Simple CSS-only */}
            <div className="flex justify-center py-4 border-b border-white/10">
              <SimpleWaveIndicator active={isListening} />
            </div>

            {/* Messages - with overscroll containment to prevent scroll chaining */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
              style={{ height: "calc(60vh - 280px)" }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-2",
                      message.role === "user"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "bg-white/10 text-white/80"
                    )}
                  >
                    <SanitizedMessage content={message.content} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Control Bar */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-4 mb-3">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={cn(
                    "p-3 rounded-full transition-all",
                    isMicEnabled
                      ? "bg-cyan-500/30 text-cyan-400"
                      : "bg-white/10 text-white/60 hover:bg-white/15"
                  )}
                >
                  {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <GlassInput
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <GlassButton
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="px-3"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </GlassButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AiChatSheet
