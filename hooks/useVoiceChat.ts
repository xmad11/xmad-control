/* ═══════════════════════════════════════════════════════════════════════════════════
   USE VOICE CHAT - Continuous conversation mode
   Flow: start → listen → STT → AI → TTS → listen again (loop)
   Stop: explicit stop or error
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

export interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
  /** Called when AI response is received - use to add message to chat */
  onAIResponse?: (text: string) => void
  /** Whether to auto-speak AI responses via TTS */
  ttsEnabled?: boolean
  /** Whether to auto-restart listening after each AI response (continuous mode) */
  continuous?: boolean
}

export type VoicePhase =
  | "idle" // Not active
  | "listening" // Recording audio
  | "processing" // STT in progress
  | "thinking" // AI request in progress
  | "speaking" // TTS playing
  | "error" // Error state

export interface UseVoiceChatReturn {
  phase: VoicePhase
  isActive: boolean // Is voice session running at all
  isRecording: boolean // Currently capturing audio
  isSpeaking: boolean // Currently playing TTS
  isSupported: boolean
  error: string | null
  transcript: string // Last user transcript
  startSession: () => Promise<void> // Start continuous voice session
  stopSession: () => void // Stop everything
  startRecording: () => Promise<void> // Single record (for manual control)
  stopRecording: () => void
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
}

export function useVoiceChat(options: UseVoiceChatOptions = {}): UseVoiceChatReturn {
  const {
    onTranscript,
    onError,
    onAIResponse,
    language = "en",
    ttsEnabled = false,
    continuous = true,
  } = options

  const [phase, setPhase] = useState<VoicePhase>("idle")
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")

  // Refs — never stale in callbacks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const isActiveRef = useRef(false) // Is session running
  const isSpeakingRef = useRef(false)
  const isRecordingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  const ttsEnabledRef = useRef(ttsEnabled)
  const continuousRef = useRef(continuous)
  const mimeTypeRef = useRef<string>("") // Store current MIME type for iOS Safari
  ttsEnabledRef.current = ttsEnabled
  continuousRef.current = continuous

  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!window.MediaRecorder

  const handleError = useCallback(
    (msg: string) => {
      console.error("[VoiceChat]", msg)
      setError(msg)
      setPhase("error")
      // Debug: show error in transcript so we can see it on mobile
      setTranscript(`Error: ${msg}`)
      onError?.(msg)
      // Auto-recover to idle after 2s
      setTimeout(() => {
        if (isActiveRef.current) setPhase("listening")
        else setPhase("idle")
        setError(null)
      }, 2000)
    },
    [onError]
  )

  // ── TTS: speak text ────────────────────────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return
    isSpeakingRef.current = true
    setPhase("speaking")

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 4000) }),
      })

      if (!res.ok) throw new Error(`TTS error: ${res.status}`)

      const arrayBuffer = await res.arrayBuffer()
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      if (ctx.state === "suspended") await ctx.resume()

      const decoded = await ctx.decodeAudioData(arrayBuffer)
      const source = ctx.createBufferSource()
      source.buffer = decoded
      source.connect(ctx.destination)
      currentSourceRef.current = source

      await new Promise<void>((resolve) => {
        source.onended = () => resolve()
        source.start(0)
      })
    } catch (err) {
      console.warn("[VoiceChat] TTS failed (non-fatal):", err)
      // TTS failure is non-fatal — conversation continues
    } finally {
      isSpeakingRef.current = false
      currentSourceRef.current = null
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    try {
      currentSourceRef.current?.stop()
    } catch {}
    currentSourceRef.current = null
    isSpeakingRef.current = false
  }, [])

  // ── AI: get response ───────────────────────────────────────────────────────────────────────
  const getAIResponse = useCallback(async (userText: string): Promise<string> => {
    setPhase("thinking")
    const res = await fetch("/api/xmad/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, stream: false }),
    })
    if (!res.ok) throw new Error(`AI error: ${res.status}`)
    const data = await res.json()
    if (!data.success) throw new Error(data.error || "AI failed")
    console.log("[Voice] AI response:", JSON.stringify((data.message as string)?.slice(0, 50)))
    return data.message as string
  }, [])

  // ── STT: transcribe blob ─────────────────────────────────────────────────────────────────
  const transcribeBlob = useCallback(
    async (blob: Blob): Promise<string> => {
      setPhase("processing")
      const form = new FormData()
      // Use correct extension and MIME type for iOS Safari
      const ext = mimeTypeRef.current.includes("mp4")
        ? "mp4"
        : mimeTypeRef.current.includes("ogg")
          ? "ogg"
          : "webm"
      const fileType = mimeTypeRef.current || "audio/webm"
      form.append(
        "audio",
        new File([blob], `recording.${ext}`, { type: fileType }),
        `recording.${ext}`
      )
      form.append("language", language)
      const res = await fetch("/api/stt", { method: "POST", body: form })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || "STT failed")
      console.log("[Voice] Transcript:", JSON.stringify(data.text))
      return (data.text || "").trim()
    },
    [language]
  )

  // ── Core: single record + process cycle ─────────────────────────────────────────────
  const doOneRecordCycle = useCallback(async () => {
    if (!isActiveRef.current) return

    // Start recording
    setPhase("listening")
    isRecordingRef.current = true
    audioChunksRef.current = []

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      })
      streamRef.current = stream
    } catch {
      handleError("Microphone access denied")
      isActiveRef.current = false
      return
    }

    // iOS Safari MIME type support - try multiple formats
    const mimeType = (() => {
      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ]
      return types.find((t) => MediaRecorder.isTypeSupported(t)) || ""
    })()

    if (!mimeType) {
      handleError("No supported audio format on this device")
      isActiveRef.current = false
      return
    }

    // Store MIME type for later use in transcribeBlob
    mimeTypeRef.current = mimeType
    console.log("[Voice] Using MIME type:", mimeType)

    const recorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }
    recorder.start(100)

    // Wait for stop signal (stopRecording or stopSession sets state)
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
    })

    isRecordingRef.current = false
    stream.getTracks().forEach((t) => t.stop())

    if (!isActiveRef.current) return

    const blob = new Blob(audioChunksRef.current, { type: mimeType })
    console.log("[Voice] Blob size:", blob.size, "bytes")

    if (blob.size < 1000) {
      // Too short — no speech detected, restart loop
      if (continuousRef.current && isActiveRef.current) {
        setTimeout(() => doOneRecordCycle(), 300)
      }
      return
    }

    // Transcribe
    let text: string
    try {
      text = await transcribeBlob(blob)
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Transcription failed")
      if (continuousRef.current && isActiveRef.current) setTimeout(() => doOneRecordCycle(), 1000)
      return
    }

    if (!text || !isActiveRef.current) {
      if (continuousRef.current && isActiveRef.current) setTimeout(() => doOneRecordCycle(), 300)
      return
    }

    setTranscript(text)
    onTranscript?.(text)

    // Get AI response
    let aiText: string
    try {
      aiText = await getAIResponse(text)
    } catch (err) {
      handleError(err instanceof Error ? err.message : "AI failed")
      if (continuousRef.current && isActiveRef.current) setTimeout(() => doOneRecordCycle(), 1000)
      return
    }

    if (!isActiveRef.current) return
    onAIResponse?.(aiText)

    // Speak response if TTS enabled
    if (ttsEnabledRef.current) {
      await speak(aiText)
    }

    // Loop — start listening again
    if (continuousRef.current && isActiveRef.current) {
      setTimeout(() => doOneRecordCycle(), 300)
    } else {
      setPhase("idle")
    }
  }, [transcribeBlob, getAIResponse, speak, handleError, onTranscript, onAIResponse])

  // ── Public API ─────────────────────────────────────────────────────────────────────────

  /** Start a continuous voice session - loops automatically */
  const startSession = useCallback(async () => {
    if (!isSupported) {
      handleError("Voice not supported in this browser")
      return
    }
    if (isActiveRef.current) return // Already running

    isActiveRef.current = true
    setError(null)
    await doOneRecordCycle()
  }, [isSupported, doOneRecordCycle, handleError])

  /** Stop everything */
  const stopSession = useCallback(() => {
    isActiveRef.current = false
    isRecordingRef.current = false
    isSpeakingRef.current = false

    // Stop recorder
    try {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    } catch {}

    // Stop audio
    stopSpeaking()

    // Stop mic stream
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    setPhase("idle")
    setTranscript("")
  }, [stopSpeaking])

  /** Start a single recording (manual control — used by mic button for single-shot) */
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      handleError("Voice not supported")
      return
    }
    isActiveRef.current = true
    setError(null)
    await doOneRecordCycle()
  }, [isSupported, doOneRecordCycle, handleError])

  /** Stop the current recording cycle only */
  const stopRecording = useCallback(() => {
    try {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    } catch {}
  }, [])

  return {
    phase,
    isActive: isActiveRef.current,
    isRecording: phase === "listening",
    isSpeaking: phase === "speaking",
    isSupported,
    error,
    transcript,
    startSession,
    stopSession,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
  }
}
