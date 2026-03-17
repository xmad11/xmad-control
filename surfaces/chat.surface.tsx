/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT SURFACE - XMAD Control Dashboard
   AI Chat interface placeholder
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { MessageSquare } from "lucide-react"

export function ChatSurface() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white">
      <MessageSquare className="h-16 w-16 text-cyan-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">AI Chat</h2>
      <p className="text-white/60">AI chat interface will be implemented here</p>
    </div>
  )
}

export default ChatSurface
