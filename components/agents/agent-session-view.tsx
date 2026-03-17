"use client"

import { cn } from "@/lib/utils"
import React, { useState, useCallback } from "react"
import { AgentChatTranscript, type ChatMessage } from "./agent-chat-transcript"
import { AgentControlBar } from "./agent-control-bar"
import { AudioVisualizerBar } from "./audio-visualizer-bar"
import { AudioVisualizerGrid } from "./audio-visualizer-grid"
import { AudioVisualizerRadial } from "./audio-visualizer-radial"
import type { AgentState } from "./hooks/use-audio-visualizer"

export type VisualizerType = "bar" | "radial" | "grid"

export interface AgentSessionViewProps {
  agentState?: AgentState
  agentName?: string
  visualizerType?: VisualizerType
  messages?: ChatMessage[]
  isMicEnabled?: boolean
  isCameraEnabled?: boolean
  isScreenShareEnabled?: boolean
  isConnected?: boolean
  showChat?: boolean
  isChatOpen?: boolean
  onMicToggle?: () => void
  onCameraToggle?: () => void
  onScreenShareToggle?: () => void
  onChatToggle?: () => void
  onDisconnect?: () => void
  onSendMessage?: (message: string) => void
  className?: string
}

export function AgentSessionView({
  agentState = "connecting",
  agentName = "AI Assistant",
  visualizerType = "radial",
  messages = [],
  isMicEnabled = false,
  isCameraEnabled = false,
  isScreenShareEnabled = false,
  isConnected = true,
  showChat = true,
  isChatOpen = false,
  onMicToggle,
  onCameraToggle,
  onScreenShareToggle,
  onChatToggle,
  onDisconnect,
  onSendMessage,
  className,
}: AgentSessionViewProps) {
  const [internalChatOpen, setInternalChatOpen] = useState(isChatOpen)

  const handleChatToggle = useCallback(() => {
    setInternalChatOpen((prev) => !prev)
    onChatToggle?.()
  }, [onChatToggle])

  const stateLabels: Record<AgentState, string> = {
    connecting: "Connecting...",
    initializing: "Initializing...",
    listening: "Listening",
    thinking: "Thinking...",
    speaking: "Speaking",
    idle: "Ready",
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-full w-full overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        "rounded-3xl border border-white/10",
        className
      )}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">{agentName.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{agentName}</h3>
              <p className="text-white/50 text-sm">{stateLabels[agentState]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              )}
            />
            <span className="text-white/50 text-xs">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Content Area - Split between Visualizer and Chat */}
        <div className="flex-1 flex overflow-hidden">
          {/* Visualizer Section */}
          <div
            className={cn(
              "flex-1 flex flex-col items-center justify-center p-6 transition-all duration-300",
              internalChatOpen && showChat ? "w-1/2" : "w-full"
            )}
          >
            {/* Status Text */}
            <p className="text-white/60 text-sm mb-6 text-center">
              {agentState === "listening" && "Agent is listening, ask it a question"}
              {agentState === "thinking" && "Agent is thinking..."}
              {agentState === "speaking" && "Agent is speaking"}
              {agentState === "connecting" && "Connecting to agent..."}
              {agentState === "initializing" && "Initializing session..."}
              {agentState === "idle" && "Ready to start"}
            </p>

            {/* Visualizer */}
            <div className="flex items-center justify-center">
              {visualizerType === "bar" && <AudioVisualizerBar state={agentState} size="lg" />}
              {visualizerType === "radial" && (
                <AudioVisualizerRadial state={agentState} size="lg" />
              )}
              {visualizerType === "grid" && <AudioVisualizerGrid state={agentState} size="lg" />}
            </div>
          </div>

          {/* Chat Section */}
          {showChat && internalChatOpen && (
            <div className="w-1/2 border-l border-white/10 flex flex-col">
              <AgentChatTranscript
                messages={messages}
                agentState={agentState}
                agentName={agentName}
                className="flex-1"
              />
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="p-4 flex justify-center">
          <AgentControlBar
            isMicEnabled={isMicEnabled}
            isCameraEnabled={isCameraEnabled}
            isScreenShareEnabled={isScreenShareEnabled}
            isChatOpen={internalChatOpen}
            isConnected={isConnected}
            showChat={showChat}
            onMicToggle={onMicToggle}
            onCameraToggle={onCameraToggle}
            onScreenShareToggle={onScreenShareToggle}
            onChatToggle={handleChatToggle}
            onDisconnect={onDisconnect}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
