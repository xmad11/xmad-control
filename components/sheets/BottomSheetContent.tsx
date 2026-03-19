/* ══════════════════════════════════════════════════════════════════════════════════
   BOTTOM SHEET CONTENT - AI Chat with glassy texture and voice support
   ══════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { GlassButton } from "@/components/glass/glass-button"
import { GlassInput } from "@/components/glass/glass-input"
import { aiDockTokens } from "@/design/tokens/ai-dock.tokens"
import { useVoiceChat } from "@/hooks/useVoiceChat"
import { cn } from "@/lib/utils"
import DOMPurify from "dompurify"
import { ArrowUpRight, MessageSquare, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// CSS-ONLY WAVE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function SimpleWaveIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full transition-colors duration-150",
            active ? "bg-cyan-glow wave-bar" : "bg-white/30"
          )}
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your XMAD AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Voice chat hook - connects to STT/TTS APIs
  const {
    isListening,
    isRecording,
    isSpeaking,
    isSupported: voiceSupported,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
  } = useVoiceChat({
    onTranscript: (text) => {
      setInputValue(text)
      // Auto-send after transcription
      if (text.trim()) {
        handleSendMessage(text)
      }
    },
    onError: (error) => {
      console.error("[VoiceChat]", error)
    },
  })

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: only messages.length
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Send message
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
        if (ttsEnabled && data.success) {
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
    [ttsEnabled, speak]
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

  // Toggle mic - start/stop recording
  const handleMicToggle = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Toggle TTS
  const handleTtsToggle = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking()
    }
    setTtsEnabled((prev) => !prev)
  }, [isSpeaking, stopSpeaking])

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
            <p className="text-white/50 text-sm">Voice-enabled chat</p>
          </div>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="flex justify-center py-4 border-b border-white/10">
        <SimpleWaveIndicator active={isListening} />
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

      {/* Control Bar */}
      <div className="p-4 border-t border-white/10 backdrop-blur-xl glass-inset-shadow">
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4 mb-3">
          {/* Mic Button - STT */}
          {voiceSupported && (
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isSpeaking}
              className={cn(
                "p-3 rounded-full transition-all backdrop-blur-sm border",
                isRecording
                  ? "bg-red-500/30 border-red-500/50 text-red-400 animate-pulse"
                  : isListening
                    ? "bg-cyan-glow/30 border-cyan-glow/50 text-cyan-glow cyan-glow-box"
                    : "bg-white/10 border-white/20 text-white/60 hover:bg-white/15",
                isSpeaking && "opacity-50 cursor-not-allowed"
              )}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <div className="h-5 w-5 rounded-full bg-red-400" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          )}

          {/* TTS Toggle */}
          <button
            type="button"
            onClick={handleTtsToggle}
            className={cn(
              "p-3 rounded-full transition-all backdrop-blur-sm border",
              ttsEnabled
                ? "bg-cyan-glow/20 border-cyan-glow/40 text-cyan-glow"
                : "bg-white/10 border-white/20 text-white/40 hover:bg-white/15"
            )}
            aria-label={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}
          >
            {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          {/* Speaking indicator */}
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-3 rounded-full bg-cyan-glow/30 border-cyan-glow/50 text-cyan-glow animate-pulse"
              aria-label="Stop speaking"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <GlassInput
            placeholder={isRecording ? "Listening..." : "Type a message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRecording}
            className="flex-1"
          />
          <GlassButton
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isRecording}
            className="px-3"
          >
            <ArrowUpRight className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

export default BottomSheetContent
