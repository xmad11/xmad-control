/* ═══════════════════════════════════════════════════════════════════════════════
   SHEET CONTEXT - Global sheet state + voice state for AppHeader + HomeClient
   Now includes useVoiceChat hook for global voice control
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { useVoiceChat } from "@/hooks/useVoiceChat"

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
}

interface SheetContextValue {
  /** Currently open sheet direction (null = all closed) */
  activeSheet: SheetDirection | null
  /** Open a specific sheet direction */
  openSheet: (direction: SheetDirection) => void
  /** Close the currently active sheet */
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
  /** Last transcript text (for components to react to) */
  lastTranscript: string | null
  /** Clear the last transcript */
  clearTranscript: () => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

const initialVoiceState: VoiceState = {
  isActive: false,
  isRecording: false,
  isListening: false,
  isSpeaking: false,
  ttsEnabled: true,
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetDirection | null>(null)
  const [voiceState, setVoiceState] = useState<VoiceState>(initialVoiceState)
  const [lastTranscript, setLastTranscript] = useState<string | null>(null)
  const transcriptHandlerRef = useRef<((text: string) => void) | null>(null)

  // Voice chat hook - integrated at context level for global access
  const { isRecording, isSpeaking, startRecording, stopRecording, speak, stopSpeaking } =
    useVoiceChat({
      onTranscript: (text) => {
        // Store the transcript
        setLastTranscript(text)
        // Call registered handler if exists
        if (transcriptHandlerRef.current) {
          transcriptHandlerRef.current(text)
        }
      },
      onError: (error) => {
        console.error("[VoiceChat Error]", error)
        setVoiceState((prev) => ({
          ...prev,
          isRecording: false,
          isListening: false,
        }))
      },
    })

  const openSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet(direction)
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const toggleSheet = useCallback(
    (direction: SheetDirection) => {
      setActiveSheet((current) => (current === direction ? null : direction))
      return activeSheet !== direction
    },
    [activeSheet]
  )

  const isSheetOpen = useCallback(
    (direction: SheetDirection) => {
      return activeSheet === direction
    },
    [activeSheet]
  )

  // Voice actions
  const startVoice = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, isActive: true }))
    startRecording()
  }, [startRecording])

  const stopVoice = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, isActive: false, isRecording: false, isListening: false }))
    stopRecording()
    stopSpeaking()
  }, [stopRecording, stopSpeaking])

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

  const clearTranscript = useCallback(() => {
    setLastTranscript(null)
  }, [])

  // Sync hook states to context state
  useEffect(() => {
    setVoiceState((prev) => ({ ...prev, isRecording, isSpeaking }))
  }, [isRecording, isSpeaking])

  // Set listening state based on recording (transcription in progress)
  useEffect(() => {
    if (!isRecording && voiceState.isRecording) {
      // Recording just stopped - transcription in progress
      setVoiceState((prev) => ({ ...prev, isListening: true }))
      // Clear listening after a delay (fallback - real clear happens on transcript)
      const timer = setTimeout(() => {
        setVoiceState((prev) => ({ ...prev, isListening: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isRecording, voiceState.isRecording])

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
        lastTranscript,
        clearTranscript,
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
