/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT SURFACE - XMAD Control Dashboard
   Full-surface AI chat interface (separate from AiChatSheet overlay)
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { Suspense } from "react"

// Mock send handler - TODO: wire to real AI backend
async function handleSendMessage(message: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return `I received your message: "${message}". This is a demo response. In production, this would connect to your AI backend.`
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
