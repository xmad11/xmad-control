/* ═══════════════════════════════════════════════════════════════════════════════
   USE VOICE CHAT - Continuous conversation mode
   Flow: tap to start → speak → auto-stop → STT → AI → TTS → listen again
   Stop: tap again to end session
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

export interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
  onAIResponse?: (text: string) => void
  ttsEnabled?: boolean
  continuous?: boolean
  /** Max recording time in ms before auto-stop */
  maxRecordTime?: number
}

export type VoicePhase = "idle" | "listening" | "processing" | "thinking" | "speaking" | "error"

export interface UseVoiceChatReturn {
  phase: VoicePhase
  isActive: boolean
  isRecording: boolean
  isSpeaking: boolean
  isSupported: boolean
  error: string | null
  transcript: string
  startSession: () => Promise<void>
  stopSession: () => void
  startRecording: () => Promise<void>
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
    maxRecordTime = 15000, // 15 seconds max recording
  } = options

  const [phase, setPhase] = useState<VoicePhase>("idle")
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isActive, setIsActive] = useState(false)

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mimeTypeRef = useRef<string>("")
  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Option refs for stable callbacks
  const ttsEnabledRef = useRef(ttsEnabled)
  const continuousRef = useRef(continuous)
  const onTranscriptRef = useRef(onTranscript)
  const onAIResponseRef = useRef(onAIResponse)
  const onErrorRef = useRef(onError)

  ttsEnabledRef.current = ttsEnabled
  continuousRef.current = continuous
  onTranscriptRef.current = onTranscript
  onAIResponseRef.current = onAIResponse
  onErrorRef.current = onError

  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!window.MediaRecorder

  const handleError = useCallback((msg: string) => {
    console.error("[VoiceChat]", msg)
    setError(msg)
    setPhase("error")
    setTranscript(`Error: ${msg}`)
    onErrorRef.current?.(msg)
    setTimeout(() => {
      setPhase("idle")
      setError(null)
    }, 3000)
  }, [])

  // ── TTS ────────────────────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return
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
      console.warn("[VoiceChat] TTS failed:", err)
    } finally {
      currentSourceRef.current = null
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    try {
      currentSourceRef.current?.stop()
    } catch {}
    currentSourceRef.current = null
  }, [])

  // ── AI Response ────────────────────────────────────────────────────────────────
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
    console.log("[Voice] AI response:", (data.message as string)?.slice(0, 50))
    return data.message as string
  }, [])

  // ── STT ────────────────────────────────────────────────────────────────────────
  const transcribeBlob = useCallback(
    async (blob: Blob): Promise<string> => {
      setPhase("processing")
      const form = new FormData()
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

      console.log("[Voice] Sending to STT:", { ext, fileType, blobSize: blob.size })

      const res = await fetch("/api/stt", { method: "POST", body: form })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || "STT failed")
      console.log("[Voice] Transcript:", data.text)
      return (data.text || "").trim()
    },
    [language]
  )

  // ── Process recorded audio ─────────────────────────────────────────────────────
  const processRecording = useCallback(async () => {
    const blob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current || "audio/webm" })
    console.log("[Voice] Processing blob:", blob.size, "bytes")

    if (blob.size < 1000) {
      console.log("[Voice] Blob too small, skipping")
      return
    }

    let text: string
    try {
      text = await transcribeBlob(blob)
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Transcription failed")
      return
    }

    if (!text) {
      console.log("[Voice] No transcript, skipping")
      return
    }

    setTranscript(text)
    onTranscriptRef.current?.(text)

    let aiText: string
    try {
      aiText = await getAIResponse(text)
    } catch (err) {
      handleError(err instanceof Error ? err.message : "AI failed")
      return
    }

    onAIResponseRef.current?.(aiText)

    if (ttsEnabledRef.current) {
      await speak(aiText)
    }
  }, [transcribeBlob, getAIResponse, speak, handleError])

  // ── Start recording ───────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      handleError("Voice not supported")
      return
    }

    // Cleanup any previous
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      })
      streamRef.current = stream
    } catch {
      handleError("Microphone access denied")
      return
    }

    // Find supported MIME type
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
      handleError("No supported audio format")
      stream.getTracks().forEach((t) => t.stop())
      return
    }

    mimeTypeRef.current = mimeType
    console.log("[Voice] Using MIME type:", mimeType)

    audioChunksRef.current = []
    const recorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }

    recorder.start(100)
    setPhase("listening")
    console.log("[Voice] Recording started")

    // Auto-stop after maxRecordTime
    recordTimeoutRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        console.log("[Voice] Auto-stop after timeout")
        mediaRecorderRef.current.stop()
      }
    }, maxRecordTime)
  }, [isSupported, handleError, maxRecordTime])

  // ── Stop recording ────────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current)
      recordTimeoutRef.current = null
    }

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
      console.log("[Voice] Recording stopped")
    }
  }, [])

  // ── Continuous session loop ───────────────────────────────────────────────────
  const runContinuousLoop = useCallback(async () => {
    if (!isActive) return

    await startRecording()

    // Wait for recording to stop
    await new Promise<void>((resolve) => {
      const checkStopped = () => {
        if (mediaRecorderRef.current?.state !== "recording") {
          resolve()
        } else {
          setTimeout(checkStopped, 100)
        }
      }
      // Also resolve when recorder.onstop fires
      const originalOnStop = mediaRecorderRef.current?.onstop
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = (e) => {
          originalOnStop?.(e)
          resolve()
        }
      }
      checkStopped()
    })

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }

    if (!isActive) return

    // Process the recording
    await processRecording()

    if (!isActive) return

    // Continue loop after delay
    if (continuousRef.current) {
      loopTimeoutRef.current = setTimeout(() => {
        if (isActive) runContinuousLoop()
      }, 500)
    } else {
      setPhase("idle")
    }
  }, [isActive, startRecording, processRecording])

  // ── Session controls ──────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    if (!isSupported) {
      handleError("Voice not supported")
      return
    }
    if (isActive) return

    setIsActive(true)
    setError(null)
    setTranscript("")
    console.log("[Voice] Session started")

    // Start the loop
    runContinuousLoop()
  }, [isSupported, isActive, handleError, runContinuousLoop])

  const stopSession = useCallback(() => {
    console.log("[Voice] Session stopping...")
    setIsActive(false)

    // Clear timeouts
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current)
      recordTimeoutRef.current = null
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
    }

    // Stop recorder
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    // Stop mic
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }

    // Stop TTS
    stopSpeaking()

    setPhase("idle")
    setTranscript("")
  }, [stopSpeaking])

  return {
    phase,
    isActive,
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
