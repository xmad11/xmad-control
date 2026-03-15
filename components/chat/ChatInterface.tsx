"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Copy,
  Check,
  Trash2,
  Sparkles,
  User,
  Bot,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// SPEECH RECOGNITION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  readonly isFinal: boolean
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: Event) => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  isStreaming?: boolean
}

export interface ChatInterfaceProps {
  /** Initial messages */
  initialMessages?: ChatMessage[]
  /** Placeholder text for input */
  placeholder?: string
  /** Enable voice input */
  enableVoice?: boolean
  /** Enable text-to-speech */
  enableTTS?: boolean
  /** Custom send handler */
  onSend?: (message: string) => Promise<string | void>
  /** Custom clear handler */
  onClear?: () => void
  /** Loading state */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Max height for chat container */
  maxHeight?: string
  /** Additional className */
  className?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAT INTERFACE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ChatInterface - AI chat component with voice controls
 *
 * @example
 * <ChatInterface
 *   enableVoice
 *   enableTTS
 *   onSend={async (msg) => { /* handle send *\/ }}
 * />
 */
export function ChatInterface({
  initialMessages = [],
  placeholder = "Ask Nova...",
  enableVoice = true,
  enableTTS = true,
  onSend,
  onClear,
  isLoading: externalLoading,
  disabled = false,
  maxHeight = "500px",
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null)
  const synthRef = React.useRef<SpeechSynthesis | null>(null)

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Setup speech recognition
  React.useEffect(() => {
    if (typeof window !== "undefined" && enableVoice) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("")
          setInput(transcript)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }

    // Setup speech synthesis
    if (typeof window !== "undefined" && enableTTS) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [enableVoice, enableTTS])

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || disabled || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (onSend) {
        const response = await onSend(input.trim())

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response || "Message sent successfully.",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Speak response if TTS enabled
        if (enableTTS && response && synthRef.current) {
          const utterance = new SpeechSynthesisUtterance(response)
          utterance.onend = () => setIsSpeaking(false)
          synthRef.current.speak(utterance)
          setIsSpeaking(true)
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "system",
        content: "Failed to send message. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Toggle voice recording
  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  // Copy message to clipboard
  const copyToClipboard = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Clear messages
  const handleClear = () => {
    setMessages([])
    onClear?.()
  }

  const loading = isLoading || externalLoading

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <Sparkles className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">Start a conversation with Nova</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.role === "user"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-cyan-500/20 text-cyan-400"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "flex-1 max-w-[80%]",
                  message.role === "user" ? "text-right" : "text-left"
                )}
              >
                <div
                  className={cn(
                    "inline-block rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-purple-500/20 text-white rounded-tr-md"
                      : "bg-white/10 text-white/90 rounded-tl-md",
                    message.role === "system" && "bg-amber-500/20 text-amber-200"
                  )}
                >
                  {message.content}
                </div>

                {/* Actions */}
                <div
                  className={cn(
                    "flex items-center gap-2 mt-1",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <span className="text-xs text-white/40">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => copyToClipboard(message.id, message.content)}
                    className="p-1 text-white/40 hover:text-white/60 transition-colors"
                    aria-label="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-2">
          {/* Voice Controls */}
          {enableVoice && (
            <div className="flex gap-1">
              <button
                onClick={toggleRecording}
                disabled={disabled}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  isRecording
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              {enableTTS && (
                <button
                  onClick={isSpeaking ? stopSpeaking : undefined}
                  disabled={disabled || !isSpeaking}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isSpeaking
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-white/5 text-white/60"
                  )}
                  aria-label={isSpeaking ? "Stop speaking" : "Text-to-speech active"}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none rounded-xl px-4 py-2.5 pr-12",
                "bg-white/5 border border-white/10",
                "text-white placeholder:text-white/40",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={disabled || loading || !input.trim()}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              input.trim() && !loading
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                : "bg-white/5 text-white/40 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={messages.length === 0}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              messages.length > 0
                ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
            aria-label="Clear chat"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

