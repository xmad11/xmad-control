/* ═══════════════════════════════════════════════════════════════════════════════
   VOICE OVERLAY - 1-2 line live transcript for hold mode
   Shows above the voice button when voice mode is active
   Displays live AI tokens as they stream in
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface VoiceOverlayProps {
  /** Show the overlay */
  visible: boolean
  /** Current voice phase */
  phase: "idle" | "listening" | "processing" | "thinking" | "speaking" | "error"
  /** Live transcript tokens from AI */
  tokens?: string[]
  /** User's transcript (what they said) */
  userTranscript?: string
  /** Maximum lines to show (default: 2) */
  maxLines?: number
  /** Position offset from bottom */
  bottomOffset?: string
}

export function VoiceOverlay({
  visible,
  phase,
  tokens = [],
  userTranscript,
  maxLines = 2,
  bottomOffset = "100px",
}: VoiceOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayLines, setDisplayLines] = useState<string[]>([])

  // Keep only last N tokens for display
  useEffect(() => {
    if (tokens.length === 0) {
      setDisplayLines([])
      return
    }

    // Join tokens and split into words, then regroup into lines
    const allText = tokens.join(" ")
    const words = allText.split(" ").filter(Boolean)

    // Simple line grouping: ~30 chars per line
    const lines: string[] = []
    let currentLine = ""

    for (const word of words) {
      if (`${currentLine} ${word}`.trim().length > 30 && currentLine) {
        lines.push(currentLine.trim())
        currentLine = word
      } else {
        currentLine = currentLine ? `${currentLine} ${word}` : word
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim())
    }

    // Keep only last maxLines
    setDisplayLines(lines.slice(-maxLines))
  }, [tokens, maxLines])

  // Get status text based on phase
  const getStatusText = () => {
    switch (phase) {
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing..."
      case "thinking":
        return "Thinking..."
      case "speaking":
        return null // Don't show status when we have text
      case "error":
        return "Error - retrying"
      default:
        return null
    }
  }

  const statusText = getStatusText()
  const hasContent = displayLines.length > 0 || userTranscript

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{ bottom: bottomOffset }}
        >
          <div
            className={cn(
              "max-w-[280px] min-w-[120px] px-3 py-2 rounded-xl",
              "backdrop-blur-xl border shadow-lg",
              "bg-black/70 border-white/10"
            )}
          >
            {/* User transcript (what user said) */}
            {userTranscript && (
              <div className="text-xs text-cyan-glow/70 mb-1 truncate">You: {userTranscript}</div>
            )}

            {/* AI response tokens (live) */}
            {hasContent ? (
              <div className="flex flex-col gap-0.5">
                {displayLines.map((line, idx) => (
                  <div
                    key={`line-${idx}`}
                    className={cn(
                      "text-sm text-white/90 leading-tight",
                      idx === displayLines.length - 1 && "animate-pulse-subtle"
                    )}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : statusText ? (
              <div className="flex items-center gap-2">
                {phase === "listening" && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                )}
                {phase === "processing" && (
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
                {phase === "thinking" && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
                <span className="text-xs text-white/60">{statusText}</span>
              </div>
            ) : null}

            {/* Speaking indicator */}
            {phase === "speaking" && displayLines.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 h-2 bg-cyan-glow rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/40">Speaking</span>
              </div>
            )}
          </div>

          {/* Subtle CSS for pulse animation */}
          <style jsx global>{`
            @keyframes pulse-subtle {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
            }
            .animate-pulse-subtle {
              animation: pulse-subtle 1.5s ease-in-out infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceOverlay
