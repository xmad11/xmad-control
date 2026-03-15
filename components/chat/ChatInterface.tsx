/* ═══════════════════════════════════════════════════════════════════════════════
   Chat Interface Component
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  placeholder?: string;
  enableVoice?: boolean;
  enableTTS?: boolean;
  maxHeight?: string;
  onSend: (message: string) => Promise<string>;
  initialMessages?: ChatMessage[];
}

export function ChatInterface({
  placeholder = "Type a message...",
  enableVoice = false,
  enableTTS = false,
  maxHeight = "400px",
  onSend,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(enableTTS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await onSend(userMessage.content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // TTS for response if enabled
      if (ttsEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, onSend, ttsEnabled]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice recording toggle (placeholder - actual implementation would use Web Speech API)
  const toggleRecording = useCallback(() => {
    if (!enableVoice) return;
    setIsRecording((prev) => !prev);
    // TODO: Implement actual voice recognition
  }, [enableVoice]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-cyan-500/20 text-white"
                    : "bg-white/10 text-white/90"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 resize-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>

          {/* Voice Button */}
          {enableVoice && (
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors ${
                isRecording
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          )}

          {/* TTS Toggle */}
          {enableTTS && (
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-3 rounded-xl transition-colors ${
                ttsEnabled
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {ttsEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
