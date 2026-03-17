/* ═══════════════════════════════════════════════════════════════════════════════
   CHAT FAB — XMAD Dashboard
   Floating action button for quick AI chat access
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { TIMING } from "@/config/dashboard"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatFabProps {
  onClick?: () => void
  isActive?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ChatFab({ onClick, isActive = false }: ChatFabProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: TIMING.CHAT_ANIMATION / 1000,
        ease: "easeOut",
      }}
      className={`
        fixed bottom-24 right-6 z-30
        p-4 rounded-full
        bg-white/10 backdrop-blur-xl border border-white/20
        hover:bg-white/15 transition-colors
        shadow-[0_4px_16px_rgba(0,0,0,0.2)]
        animate-pulse
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none
        ${isActive ? "ring-2 ring-cyan-500/50" : ""}
      `}
      aria-label="Open chat"
    >
      <div className="relative z-10">
        <MessageSquare className="h-5 w-5 text-white" />
      </div>
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-lg opacity-60" />
    </motion.button>
  )
}

export default ChatFab
