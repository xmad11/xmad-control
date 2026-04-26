/* ═══════════════════════════════════════════════════════════════════════════════
   USE CHAT - AI Chat hook for text-based conversations
   Calls /api/xmad/chat which forwards to OpenClaw gateway
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  error?: boolean
}

interface UseChatOptions {
  sessionId?: string
  onMessage?: (msg: ChatMessage) => void
  onError?: (error: string) => void
}

interface UseChatReturn {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  sessionId: string
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionIdRef = useRef(options.sessionId || `chat_${Date.now()}`)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || loading) return

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/xmad/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            sessionId: sessionIdRef.current,
            context: {},
          }),
        })

        const data = await res.json()

        const assistantMsg: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: data.success
            ? data.message
            : data.error || "Something went wrong. Please try again.",
          timestamp: Date.now(),
          error: !data.success,
        }

        setMessages((prev) => [...prev, assistantMsg])
        options.onMessage?.(assistantMsg)
      } catch (err) {
        const errMsg: ChatMessage = {
          id: `error_${Date.now()}`,
          role: "assistant",
          content: "Failed to reach AI gateway. Make sure OpenClaw is running on port 18789.",
          timestamp: Date.now(),
          error: true,
        }
        setMessages((prev) => [...prev, errMsg])
        const errorMessage = (err as Error).message
        setError(errorMessage)
        options.onError?.(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [loading, options]
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    sessionId: sessionIdRef.current,
  }
}

export default useChat
