"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  ScreenShare,
  ScreenShareOff,
  Send,
  Video,
  VideoOff,
} from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"

export interface AgentControlBarProps {
  isMicEnabled?: boolean
  isCameraEnabled?: boolean
  isScreenShareEnabled?: boolean
  isChatOpen?: boolean
  isConnected?: boolean
  onMicToggle?: () => void
  onCameraToggle?: () => void
  onScreenShareToggle?: () => void
  onChatToggle?: () => void
  onDisconnect?: () => void
  onSendMessage?: (message: string) => void
  showChat?: boolean
  className?: string
}

export function AgentControlBar({
  isMicEnabled = false,
  isCameraEnabled = false,
  isScreenShareEnabled = false,
  isChatOpen = false,
  isConnected = true,
  onMicToggle,
  onCameraToggle,
  onScreenShareToggle,
  onChatToggle,
  onDisconnect,
  onSendMessage,
  showChat = true,
  className,
}: AgentControlBarProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatOpen])

  const handleSend = async () => {
    if (!chatMessage.trim() || isSending) return
    setIsSending(true)
    try {
      await onSendMessage?.(chatMessage.trim())
      setChatMessage("")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Chat Input */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
              <input
                ref={inputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none px-2"
                disabled={!isConnected}
              />
              <button
                onClick={handleSend}
                disabled={!chatMessage.trim() || isSending || !isConnected}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-xl -z-10" />

        {/* Mic Toggle */}
        <ControlButton
          onClick={onMicToggle}
          isEnabled={isMicEnabled}
          enabledIcon={Mic}
          disabledIcon={MicOff}
          label="Microphone"
          disabled={!isConnected}
        />

        {/* Camera Toggle */}
        <ControlButton
          onClick={onCameraToggle}
          isEnabled={isCameraEnabled}
          enabledIcon={Video}
          disabledIcon={VideoOff}
          label="Camera"
          disabled={!isConnected}
        />

        {/* Screen Share Toggle */}
        <ControlButton
          onClick={onScreenShareToggle}
          isEnabled={isScreenShareEnabled}
          enabledIcon={ScreenShare}
          disabledIcon={ScreenShareOff}
          label="Screen Share"
          disabled={!isConnected}
        />

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-1" />

        {/* Chat Toggle */}
        {showChat && (
          <ControlButton
            onClick={onChatToggle}
            isEnabled={isChatOpen}
            enabledIcon={MessageSquare}
            disabledIcon={MessageSquare}
            label="Chat"
            disabled={!isConnected}
            activeColor="blue"
          />
        )}

        {/* Disconnect Button */}
        <button
          onClick={onDisconnect}
          disabled={!isConnected}
          className={cn(
            "relative p-3 rounded-xl transition-all duration-200",
            "bg-red-500/20 hover:bg-red-500/30 text-red-400",
            "border border-red-500/30",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Disconnect"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  )
}

interface ControlButtonProps {
  onClick?: () => void
  isEnabled: boolean
  enabledIcon: React.ComponentType<{ className?: string }>
  disabledIcon: React.ComponentType<{ className?: string }>
  label: string
  disabled?: boolean
  activeColor?: "cyan" | "blue" | "purple"
}

function ControlButton({
  onClick,
  isEnabled,
  enabledIcon: EnabledIcon,
  disabledIcon: DisabledIcon,
  label,
  disabled,
  activeColor = "cyan",
}: ControlButtonProps) {
  const colorClasses = {
    cyan: {
      enabled: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30",
      glow: "shadow-[0_0_12px_rgba(34,211,238,0.4)]",
    },
    blue: {
      enabled: "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.4)]",
    },
    purple: {
      enabled: "bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30",
      glow: "shadow-[0_0_12px_rgba(168,85,247,0.4)]",
    },
  }

  const Icon = isEnabled ? EnabledIcon : DisabledIcon

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative p-3 rounded-xl transition-all duration-200",
        "border",
        isEnabled
          ? cn(colorClasses[activeColor].enabled, colorClasses[activeColor].glow)
          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
