/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT SURFACE - XMAD Control Dashboard
   Full-surface AI chat interface (separate from AiChatSheet overlay)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { Suspense } from "react"

// Send handler - wired to /api/xmad/chat (forwards to OpenClaw gateway)
async function handleSendMessage(message: string): Promise<string> {
  try {
    const response = await fetch("/api/xmad/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    if (data.success && data.message) {
      return data.message
    }

    return data.error || "AI service temporarily unavailable."
  } catch {
    return "AI service temporarily unavailable. Please try again."
  }
}

export function ChatSurface() {
  return (
    <div className="h-full flex flex-col">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full text-white/40">
            Loading chat...
          </div>
        }
      >
        <ChatInterface
          placeholder="Ask about your system, services, or anything..."
          enableVoice={true}
          enableTTS={true}
          maxHeight="calc(100vh - 200px)"
          onSend={handleSendMessage}
        />
      </Suspense>
    </div>
  )
}

export default ChatSurface
