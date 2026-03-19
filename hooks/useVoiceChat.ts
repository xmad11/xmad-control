/* ═══════════════════════════════════════════════════════════════════════════════
   USE VOICE CHAT - Speech-to-Text and Text-to-Speech integration
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

export interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
}

export interface UseVoiceChatReturn {
  // STT state
  isListening: boolean
  isRecording: boolean
  startRecording: () => Promise<void>
  stopRecording: () => void

  // TTS state
  isSpeaking: boolean
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void

  // General
  isSupported: boolean
  error: string | null
}

export function useVoiceChat(options: UseVoiceChatOptions = {}): UseVoiceChatReturn {
  const { onTranscript, onError, language = "en" } = options

  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)

  // Check browser support
  const isSupported =
    typeof window !== "undefined" && !!navigator.mediaDevices && !!window.AudioContext

  // Start recording audio
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const msg = "Voice not supported in this browser"
      setError(msg)
      onError?.(msg)
      return
    }

    try {
      setError(null)
      setIsRecording(true)
      setIsListening(true)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Send to STT API
        try {
          const formData = new FormData()
          formData.append("audio", audioBlob, "recording.webm")
          formData.append("language", language)

          const response = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()

          if (data.ok && data.text) {
            onTranscript?.(data.text)
          } else {
            const msg = data.error || "Speech recognition failed"
            setError(msg)
            onError?.(msg)
          }
        } catch (_err) {
          const msg = "Failed to transcribe audio"
          setError(msg)
          onError?.(msg)
        }

        setIsListening(false)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
    } catch (_err) {
      const msg = "Failed to access microphone"
      setError(msg)
      onError?.(msg)
      setIsRecording(false)
      setIsListening(false)
    }
  }, [isSupported, language, onTranscript, onError])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }, [])

  // Speak text using TTS API
  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      try {
        setIsSpeaking(true)
        setError(null)

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          throw new Error("TTS request failed")
        }

        const audioBuffer = await response.arrayBuffer()

        // Play audio
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }

        const ctx = audioContextRef.current
        const decodedAudio = await ctx.decodeAudioData(audioBuffer)

        const source = ctx.createBufferSource()
        source.buffer = decodedAudio
        source.connect(ctx.destination)
        currentSourceRef.current = source

        source.onended = () => {
          setIsSpeaking(false)
          currentSourceRef.current = null
        }

        source.start(0)
      } catch (_err) {
        const msg = "Failed to synthesize speech"
        setError(msg)
        onError?.(msg)
        setIsSpeaking(false)
      }
    },
    [onError]
  )

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop()
      } catch {
        // Already stopped
      }
      currentSourceRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    isRecording,
    startRecording,
    stopRecording,
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported,
    error,
  }
}
