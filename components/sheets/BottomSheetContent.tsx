/* ════════════════════════════════════════════════════════════════════════════════════
   BOTTOM SHEET CONTENT - AI Chat with glassy texture and voice support
   Voice is now controlled by SheetContext (global voice state)
   Continuous conversation mode - AI responses auto-added to chat
   ════════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton } from "@/components/glass/glass-button"
import { GlassInput } from "@/components/glass/glass-input"
import { useSheetContext } from "@/context/SheetContext"
import { cn } from "@/lib/utils"
import DOMPurify from "dompurify"
import { ArrowUpRight, Brain, MessageSquare, Mic, Volume2, VolumeX } from "lucide-react"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE WAVE INDICATOR (for mic button)
// ═══════════════════════════════════════════════════════════════════════════════

function InlineWaveIndicator({ active, size = "sm" }: { active: boolean; size?: "sm" | "md" }) {
  const barHeight = size === "sm" ? "h-3" : "h-5"
  const barWidth = size === "sm" ? "w-0.5" : "w-1"
  const bars = [
    { id: "bar-1", delay: "0ms" },
    { id: "bar-2", delay: "75ms" },
    { id: "bar-3", delay: "150ms" },
    { id: "bar-4", delay: "225ms" },
  ]

  return (
    <div className={cn("flex items-end justify-center gap-0.5", size === "sm" ? "h-4" : "h-6")}>
      {bars.map((bar) => (
        <span
          key={bar.id}
          className={cn(
            "rounded-full transition-all duration-150",
            barHeight,
            barWidth,
            active ? "bg-cyan-glow animate-pulse" : "bg-white/50"
          )}
          style={{
            animationDelay: bar.delay,
            transform: active ? `scaleY(${0.5 + Math.random() * 0.5})` : "scaleY(1)",
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY
// ═══════════════════════════════════════════════════════════════════════════════

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

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

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM SHEET CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export function BottomSheetContent() {
  // Voice state and actions from context (shared with HomeClient collapsed tab)
  const {
    voiceState,
    startVoice,
    stopVoice,
    toggleTts,
    speak,
    stopSpeaking,
    registerTranscriptHandler,
    registerAIResponseHandler,
    clearTranscript,
  } = useSheetContext()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your XMAD AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Register transcript handler - called when voice recording produces transcript
  useEffect(() => {
    registerTranscriptHandler((text: string) => {
      // User transcript - add as user message
      // Note: The AI call is already happening in useVoiceChat
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      clearTranscript()
    })
    // Cleanup: unregister handler on unmount
    return () => registerTranscriptHandler(() => {})
  }, [registerTranscriptHandler, clearTranscript])

  // Register AI response handler - called when AI responds in continuous mode
  useEffect(() => {
    registerAIResponseHandler((text: string) => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    })
    // Cleanup: unregister handler on unmount
    return () => registerAIResponseHandler(() => {})
  }, [registerAIResponseHandler])

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: only messages.length
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Send message (manual text input)
  const handleSendMessage = useCallback(
    async (content: string) => {
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
        const response = await fetch("/api/xmad/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content.trim() }),
        })

        const data = await response.json()

        const aiContent = data.success
          ? data.message
          : data.error || "AI service temporarily unavailable."

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])

        // Speak AI response if TTS is enabled
        if (voiceState.ttsEnabled && data.success) {
          speak(aiContent)
        }
      } catch {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "AI service temporarily unavailable. Please try again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }
    },
    [voiceState.ttsEnabled, speak]
  )

  // Key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
        e.preventDefault()
        handleSendMessage(inputValue)
      }
    },
    [inputValue, handleSendMessage]
  )

  // Toggle mic - start/stop continuous voice session
  const handleMicToggle = useCallback(() => {
    if (voiceState.isActive) {
      stopVoice()
    } else {
      startVoice()
    }
  }, [voiceState.isActive, startVoice, stopVoice])

  // Toggle TTS
  const handleTtsToggle = useCallback(() => {
    if (voiceState.isSpeaking) {
      stopSpeaking()
    }
    toggleTts()
  }, [voiceState.isSpeaking, stopSpeaking, toggleTts])

  // Get status text based on phase
  const getStatusText = () => {
    switch (voiceState.phase) {
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing speech..."
      case "thinking":
        return "AI thinking..."
      case "speaking":
        return "Speaking..."
      case "error":
        return "Error - retrying..."
      default:
        return "Voice active"
    }
  }

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-xl glass-inset-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-purple-gradient glass-inset-shadow">
            <MessageSquare className="h-5 w-5 text-cyan-glow" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-white/50 text-sm">Continuous voice chat</p>
          </div>
        </div>

        {/* Header voice controls */}
        <div className="flex items-center gap-2">
          {/* TTS Toggle */}
          <button
            type="button"
            onClick={handleTtsToggle}
            className={cn(
              "p-2 rounded-lg transition-all backdrop-blur-sm border",
              voiceState.ttsEnabled
                ? "bg-cyan-glow/20 border-cyan-glow/40 text-cyan-glow"
                : "bg-white/10 border-white/20 text-white/40 hover:bg-white/15"
            )}
            aria-label={
              voiceState.ttsEnabled ? "Disable voice responses" : "Enable voice responses"
            }
          >
            {voiceState.ttsEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Speaking indicator */}
          {voiceState.isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-2 rounded-lg bg-cyan-glow/30 border-cyan-glow/50 text-cyan-glow animate-pulse"
              aria-label="Stop speaking"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain chat-messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-2 backdrop-blur-sm border glass-inset-shadow",
                message.role === "user"
                  ? "bg-cyan-glow/20 border-cyan-glow/30 text-cyan-glow"
                  : "bg-white/10 border-white/10 text-white/80"
              )}
            >
              <SanitizedMessage content={message.content} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar - Mic next to input */}
      <div className="p-4 border-t border-white/10 backdrop-blur-xl glass-inset-shadow">
        <div className="flex items-center gap-2">
          {/* Mic Button - Continuous voice session toggle */}
          <button
            type="button"
            onClick={handleMicToggle}
            disabled={voiceState.isSpeaking}
            className={cn(
              "flex-shrink-0 p-3 rounded-xl transition-all backdrop-blur-sm border",
              voiceState.isActive
                ? "bg-cyan-glow/30 border-cyan-glow/50 text-cyan-glow cyan-glow-box"
                : "bg-white/10 border-white/20 text-white/60 hover:bg-white/15",
              voiceState.isSpeaking && "opacity-50 cursor-not-allowed"
            )}
            aria-label={voiceState.isActive ? "Stop voice session" : "Start voice session"}
          >
            {voiceState.isActive ? (
              <InlineWaveIndicator active size="md" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>

          {/* Text Input */}
          <GlassInput
            placeholder={voiceState.isActive ? getStatusText() : "Type a message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={voiceState.isActive && voiceState.phase === "listening"}
            className="flex-1"
          />

          {/* Send Button */}
          <GlassButton
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || voiceState.isActive}
            className="flex-shrink-0 px-3"
          >
            <ArrowUpRight className="h-4 w-4" />
          </GlassButton>
        </div>

        {/* Voice status */}
        {voiceState.isActive && (
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white/50">
            {voiceState.phase === "listening" && (
              <>
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>{getStatusText()}</span>
              </>
            )}
            {voiceState.phase === "processing" && (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span>{getStatusText()}</span>
              </>
            )}
            {voiceState.phase === "thinking" && (
              <>
                <Brain className="w-3 h-3 animate-pulse" />
                <span>{getStatusText()}</span>
              </>
            )}
            {voiceState.phase === "speaking" && (
              <>
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>{getStatusText()}</span>
              </>
            )}
            {voiceState.phase === "idle" && voiceState.isActive && (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-glow" />
                <span>Voice active - tap mic to stop</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BottomSheetContent
