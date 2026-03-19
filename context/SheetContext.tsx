/* ═══════════════════════════════════════════════════════════════════════════════
   SHEET CONTEXT - Global sheet state + voice state for AppHeader + HomeClient
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { createContext, useCallback, useContext, useState } from "react"
import type { ReactNode } from "react"

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
  toggleSheet: (direction: SheetDirection) => void
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

  const openSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet(direction)
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const toggleSheet = useCallback((direction: SheetDirection) => {
    setActiveSheet((current) => (current === direction ? null : direction))
  }, [])

  const isSheetOpen = useCallback(
    (direction: SheetDirection) => {
      return activeSheet === direction
    },
    [activeSheet]
  )

  // Voice actions
  const startVoice = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, isActive: true, isRecording: true }))
  }, [])

  const stopVoice = useCallback(() => {
    setVoiceState((prev) => ({ ...prev, isActive: false, isRecording: false }))
  }, [])

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
