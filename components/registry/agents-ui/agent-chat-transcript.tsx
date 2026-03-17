"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowDown, Bot, User } from "lucide-react"
import React, { useRef, useEffect, useState } from "react"
import type { AgentState } from "./hooks/use-audio-visualizer"

export interface ChatMessage {
  id: string
  content: string
  timestamp: Date
  sender: "user" | "agent"
}

export interface AgentChatTranscriptProps {
  messages?: ChatMessage[]
  agentState?: AgentState
  agentName?: string
  className?: string
}

export function AgentChatTranscript({
  messages = [],
  agentState,
  agentName = "AI Assistant",
  className,
}: AgentChatTranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [messages, isAtBottom])

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsAtBottom(isBottom)
      setShowScrollButton(!isBottom)
    }
  }

  return (
    <div className={cn("relative flex flex-col h-full", className)}>
      {/* Messages Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        role="log"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <Bot className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Start a conversation</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} agentName={agentName} />
        ))}

        {/* Thinking Indicator */}
        <AnimatePresence>
          {agentState === "thinking" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl rounded-tl-sm px-4 py-3">
                <ThinkingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 hover:bg-white/20 transition-all"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ChatBubbleProps {
  message: ChatMessage
  agentName: string
}

function ChatBubble({ message, agentName }: ChatBubbleProps) {
  const isUser = message.sender === "user"
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
          isUser
            ? "bg-gradient-to-br from-purple-500 to-pink-500"
            : "bg-gradient-to-br from-cyan-500 to-blue-500"
        )}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1 max-w-[75%]", isUser && "items-end")}>
        <div className="flex items-center gap-2">
          {!isUser && <span className="text-xs font-medium text-cyan-400">{agentName}</span>}
          <span className="text-xs text-white/40">{formattedTime}</span>
        </div>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl backdrop-blur-xl border",
            isUser
              ? "bg-purple-500/20 border-purple-500/30 text-white rounded-tr-sm"
              : "bg-white/10 border-white/20 text-white rounded-tl-sm"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Standalone thinking indicator component
export interface AgentChatIndicatorProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AgentChatIndicator({ size = "md", className }: AgentChatIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("rounded-full bg-cyan-400", sizeClasses[size])}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
