/* ═══════════════════════════════════════════════════════════════════════════════
   CONVERSATION BAR - ElevenLabs UI Component
   Complete voice conversation interface with microphone controls, text input,
   and real-time waveform visualization for ElevenLabs agents
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { cn } from "@/lib/utils"
import { Loader2, Mic, MicOff, Radio, Send, X } from "lucide-react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import { LiveWaveform } from "./live-waveform"

export type ConnectionState = "disconnected" | "connecting" | "connected" | "disconnecting"

export interface ConversationBarProps {
  /** ElevenLabs Agent ID to connect to */
  agentId: string
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the waveform */
  waveformClassName?: string
  /** Callback when conversation connects */
  onConnect?: () => void
  /** Callback when conversation disconnects */
  onDisconnect?: () => void
  /** Callback when an error occurs */
  onError?: (error: Error) => void
  /** Callback when a message is received */
  onMessage?: (message: { source: "user" | "ai"; message: string }) => void
}

export function ConversationBar({
  agentId,
  className,
  waveformClassName,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
}: ConversationBarProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [isMuted, setIsMuted] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [isTextInputExpanded, setIsTextInputExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isConnected = connectionState === "connected"
  const isConnecting = connectionState === "connecting"

  // Connect to agent
  const handleConnect = useCallback(async () => {
    if (!agentId) {
      onError?.(new Error("Agent ID is required"))
      return
    }

    try {
      setConnectionState("connecting")

      // TODO: Implement actual WebRTC connection to ElevenLabs agent
      // This would use @elevenlabs/react package
      // For now, simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setConnectionState("connected")
      onConnect?.()
    } catch (error) {
      setConnectionState("disconnected")
      onError?.(error instanceof Error ? error : new Error("Connection failed"))
    }
  }, [agentId, onConnect, onError])

  // Disconnect from agent
  const handleDisconnect = useCallback(async () => {
    try {
      setConnectionState("disconnecting")

      // TODO: Implement actual WebRTC disconnection
      await new Promise((resolve) => setTimeout(resolve, 500))

      setConnectionState("disconnected")
      setIsMuted(false)
      setTextInput("")
      setIsTextInputExpanded(false)
      onDisconnect?.()
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Disconnection failed"))
    }
  }, [onDisconnect, onError])

  // Toggle mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  // Toggle text input
  const handleToggleTextInput = useCallback(() => {
    setIsTextInputExpanded((prev) => !prev)
    setTimeout(() => {
      if (!isTextInputExpanded) {
        inputRef.current?.focus()
      }
    }, 100)
  }, [isTextInputExpanded])

  // Send text message
  const handleSendText = useCallback(() => {
    if (!textInput.trim()) return

    // TODO: Send message to agent via WebSocket
    onMessage?.({ source: "user", message: textInput })
    setTextInput("")

    // Simulate AI response
    setTimeout(() => {
      onMessage?.({ source: "ai", message: "I received your message." })
    }, 1000)
  }, [textInput, onMessage])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && isTextInputExpanded) {
        e.preventDefault()
        handleSendText()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTextInputExpanded, handleSendText])

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl",
        className
      )}
    >
      {/* Waveform */}
      <div className={cn("mb-4", waveformClassName)}>
        <LiveWaveform
          active={isConnected && !isMuted}
          processing={isConnecting}
          height={80}
          barWidth={3}
          barGap={2}
          mode="static"
          fadeEdges
          barColor="gray"
        />
      </div>

      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            isConnected
              ? "bg-green-400"
              : isConnecting
                ? "animate-pulse bg-yellow-400"
                : "bg-gray-500"
          )}
        />
        <span className="text-sm text-white/60">
          {connectionState === "connected"
            ? "Connected"
            : connectionState === "connecting"
              ? "Connecting..."
              : connectionState === "disconnecting"
                ? "Disconnecting..."
                : "Disconnected"}
        </span>
      </div>

      {/* Text Input (Expandable) */}
      {isTextInputExpanded && (
        <div className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-white/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSendText}
            disabled={!textInput.trim()}
            className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-400 transition-colors hover:bg-cyan-500/30 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-3">
        {/* Connect/Disconnect Button */}
        {!isConnected ? (
          <button
            type="button"
            onClick={handleConnect}
            disabled={isConnecting}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-all",
              isConnecting
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
            )}
          >
            {isConnecting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Radio className="h-6 w-6" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDisconnect}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition-all hover:bg-red-500/30"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* Mute Button (only when connected) */}
        {isConnected && (
          <button
            type="button"
            onClick={handleToggleMute}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-all",
              isMuted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        )}

        {/* Text Input Toggle (only when connected) */}
        {isConnected && (
          <button
            type="button"
            onClick={handleToggleTextInput}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-all",
              isTextInputExpanded
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ConversationBar
