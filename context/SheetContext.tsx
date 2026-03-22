/* ═══════════════════════════════════════════════════════════════════════════════
   SHEET CONTEXT - Global sheet state + voice state for AppHeader + HomeClient
   Now includes useVoiceChat hook for global voice control
   Continuous conversation mode - auto-listen after each AI response
   Live transcript support for hold mode overlay
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { type VoicePhase, useVoiceChat } from "@/hooks/useVoiceChat"

export type SheetDirection = "top" | "bottom" | "left" | "right"

interface VoiceState {
  /** Voice mode is active (recording or listening) */
  isActive: boolean
  /** Currently recording audio */
  isRecording: boolean
  /** Processing transcription */
  isListening: boolean
  /** TTS is speaking */
  isSpeaking: boolean
  /** TTS is enabled for responses */
  ttsEnabled: boolean
  /** Current phase of voice interaction */
  phase: VoicePhase
  /** Live AI tokens (for overlay display) */
  liveTokens: string[]
  /** User's last transcript */
  userTranscript: string | null
}

interface SheetContextValue {
  /** Currently open sheet direction (null = all closed) */
  activeSheet: SheetDirection | null
  /** Open a specific sheet direction */
  openSheet: (direction: SheetDirection) => void
  /** Close the currently open sheet */
  closeSheet: () => void
  /** Toggle a specific sheet direction */
  toggleSheet: (direction: SheetDirection) => boolean
  /** Check if a specific sheet is open */
  isSheetOpen: (direction: SheetDirection) => boolean

  /** Voice state - shared between collapsed tab and chat sheet */
  voiceState: VoiceState
  /** Start voice recording */
  startVoice: () => void
  /** Stop voice recording */
  stopVoice: () => void
  /** Set recording state */
  setVoiceRecording: (recording: boolean) => void
  /** Set listening state */
  setVoiceListening: (listening: boolean) => void
  /** Set speaking state */
  setVoiceSpeaking: (speaking: boolean) => void
  /** Toggle TTS enabled */
  toggleTts: () => void

  /** Speak text using TTS */
  speak: (text: string) => Promise<void>
  /** Stop speaking */
  stopSpeaking: () => void
  /** Register a callback to be called when transcript is ready */
  registerTranscriptHandler: (handler: (text: string) => void) => void
  /** Register a callback for AI responses */
  registerAIResponseHandler: (handler: (text: string) => void) => void
  /** Last transcript text (for components to react to) */
  lastTranscript: string | null
  /** Clear the last transcript */
  clearTranscript: () => void
  /** Clear live tokens */
  clearLiveTokens: () => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

const initialVoiceState: VoiceState = {
  isActive: false,
  isRecording: false,
  isListening: false,
  isSpeaking: false,
  ttsEnabled: true,
  phase: "idle",
  liveTokens: [],
  userTranscript: null,
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetDirection | null>(null)
  const [voiceState, setVoiceState] = useState<VoiceState>(initialVoiceState)
  const [lastTranscript, setLastTranscript] = useState<string | null>(null)
  const [liveTokens, setLiveTokens] = useState<string[]>([])
  const [userTranscript, setUserTranscript] = useState<string | null>(null)
  const transcriptHandlerRef = useRef<((text: string) => void) | null>(null)
  const aiResponseHandlerRef = useRef<((text: string) => void) | null>(null)

  // Track activeSheet with ref to avoid stale closure in toggleSheet
  const activeSheetRef = useRef(activeSheet)
  activeSheetRef.current = activeSheet

  // Voice chat hook - integrated at context level for global access
  const {
    phase: voicePhase,
    isRecording,
    isSpeaking,
    startSession,
    stopSession,
    speak,
    stopSpeaking,
  } = useVoiceChat({
    onTranscript: (text) => {
      // Store the transcript
      setLastTranscript(text)
      setUserTranscript(text)
      // Call registered handler if exists
      if (transcriptHandlerRef.current) {
        transcriptHandlerRef.current(text)
      }
    },
    onAIResponse: (text) => {
      // Call registered AI response handler
      if (aiResponseHandlerRef.current) {
        aiResponseHandlerRef.current(text)
      }
    },
    onToken: (token) => {
      // Live token callback - for overlay display
      setLiveTokens((prev) => [...prev, token])
    },
    onError: (error) => {
      console.error("[VoiceChat Error]", error)
      setVoiceState((prev) => ({
        ...prev,
        isRecording: false,
        isListening: false,
        phase: "error",
      }))
    },
    ttsEnabled: voiceState.ttsEnabled,
    continuous: true, // Enable continuous conversation mode
  })

  const openSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet(direction)
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const toggleSheet = useCallback((direction: SheetDirection) => {
    const wasOpen = activeSheetRef.current === direction
    setActiveSheet((current) => (current === direction ? null : direction))
    return !wasOpen
  }, [])

  const isSheetOpen = useCallback(
    (direction: SheetDirection) => {
      return activeSheet === direction
    },
    [activeSheet]
  )

  // Voice actions - use continuous session
  const startVoice = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, isActive: true }))
    startSession()
  }, [startSession])

  const stopVoice = useCallback(() => {
    setVoiceState((prev) => ({
      ...prev,
      isActive: false,
      isRecording: false,
      isListening: false,
      phase: "idle",
    }))
    stopSession()
    stopSpeaking()
  }, [stopSession, stopSpeaking])

  const setVoiceRecording = useCallback((recording: boolean) => {
    setVoiceState((prev) => ({
      ...prev,
      isRecording: recording,
      isActive: recording || prev.isListening,
    }))
  }, [])

  const setVoiceListening = useCallback((listening: boolean) => {
    setVoiceState((prev) => ({
      ...prev,
      isListening: listening,
      isActive: prev.isRecording || listening,
    }))
  }, [])

  const setVoiceSpeaking = useCallback((speaking: boolean) => {
    setVoiceState((prev) => ({ ...prev, isSpeaking: speaking }))
  }, [])

  const toggleTts = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, ttsEnabled: !prev.ttsEnabled }))
  }, [])

  const registerTranscriptHandler = useCallback((handler: (text: string) => void) => {
    transcriptHandlerRef.current = handler
  }, [])

  const registerAIResponseHandler = useCallback((handler: (text: string) => void) => {
    aiResponseHandlerRef.current = handler
  }, [])

  const clearTranscript = useCallback(() => {
    setLastTranscript(null)
  }, [])

  const clearLiveTokens = useCallback(() => {
    setLiveTokens([])
    setUserTranscript(null)
  }, [])

  // Clear live tokens when voice stops
  useEffect(() => {
    if (!isRecording && !isSpeaking && voicePhase === "idle") {
      // Small delay before clearing to let user see final text
      const timer = setTimeout(() => {
        setLiveTokens([])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isRecording, isSpeaking, voicePhase])

  // Sync hook states to context state via useEffect (not in render body!)
  useEffect(() => {
    setVoiceState((prev) => ({
      ...prev,
      isRecording,
      isSpeaking,
      phase: voicePhase,
      isListening: voicePhase === "processing" || voicePhase === "thinking",
      liveTokens,
      userTranscript,
    }))
  }, [isRecording, isSpeaking, voicePhase, liveTokens, userTranscript])

  // Cleanup voice session on unmount
  useEffect(() => {
    return () => {
      stopSession()
    }
  }, [stopSession])

  return (
    <SheetContext.Provider
      value={{
        activeSheet,
        openSheet,
        closeSheet,
        toggleSheet,
        isSheetOpen,
        voiceState,
        startVoice,
        stopVoice,
        setVoiceRecording,
        setVoiceListening,
        setVoiceSpeaking,
        toggleTts,
        speak,
        stopSpeaking,
        registerTranscriptHandler,
        registerAIResponseHandler,
        lastTranscript,
        clearTranscript,
        clearLiveTokens,
      }}
    >
      {children}
    </SheetContext.Provider>
  )
}

export function useSheetContext(): SheetContextValue {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error("useSheetContext must be used within a SheetProvider")
  }
  return context
}

export default SheetContext
