/* ════════════════════════════════════════════════════════════════════════════════════════
 * USE VOICE CHAT - Continuous conversation mode
 * Flow: tap to start → speak → auto-stop → STT → AI → TTS → listen again
 * Stop: tap again to end session
 * ═══════════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

export interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
  onAIResponse?: (text: string) => void
  ttsEnabled?: boolean
  continuous?: boolean
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
    maxRecordTime = 15000,
  } = options

  const [phase, setPhase] = useState<VoicePhase>("idle")
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isActive, setIsActive] = useState(false)

  // Refs - all refs for stable access in async callbacks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mimeTypeRef = useRef<string>("")
  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(false) // Ref for async callback checks
  const loopRunningRef = useRef(false) // Guard against parallel loop execution

  // Option refs
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
    console.error("[VoiceChat Error]", msg)
    setError(msg)
    setPhase("error")
    setTranscript(`Error: ${msg}`)
    onErrorRef.current?.(msg)
    // Auto-recover after 3s
    setTimeout(() => {
      if (isActiveRef.current) {
        setPhase("listening")
      } else {
        setPhase("idle")
      }
      setError(null)
    }, 3000)
  }, [])

  // ── TTS (ElevenLabs with browser SpeechSynthesis fallback) ──────────────────────
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return
    setPhase("speaking")

    // Try ElevenLabs first, fall back to browser SpeechSynthesis
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 4000) }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        await new Promise<void>((resolve) => {
          const audio = new Audio(url)
          currentAudioRef.current = audio
          audio.onended = () => {
            URL.revokeObjectURL(url)
            currentAudioRef.current = null
            setTimeout(resolve, 800)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            currentAudioRef.current = null
            resolve()
          }
          audio.play().catch(() => resolve())
        })
        return
      }
      // Fall through to browser TTS if ElevenLabs fails
      console.warn("[Voice] ElevenLabs unavailable, using browser TTS")
    } catch {
      console.warn("[Voice] ElevenLabs failed, using browser TTS")
    }

    // Unlock iOS audio output by playing a silent sound first
    try {
      const silentCtx = new AudioContext()
      const buf = silentCtx.createBuffer(1, 1, 22050)
      const src = silentCtx.createBufferSource()
      src.buffer = buf
      src.connect(silentCtx.destination)
      src.start(0)
      await new Promise((r) => setTimeout(r, 100))
      silentCtx.close()
    } catch {}

    // Browser SpeechSynthesis fallback
    await new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        console.warn("[Voice] speechSynthesis not available")
        resolve()
        return
      }
      window.speechSynthesis.cancel()

      // Wait for voices to load (required on some browsers)
      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 4000))
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.lang = "en-US"

        const voices = window.speechSynthesis.getVoices()
        const preferred =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Samantha") ||
                v.name.includes("Google US") ||
                v.name.includes("Aaron") ||
                v.name.includes("Natural"))
          ) || voices.find((v) => v.lang.startsWith("en"))
        if (preferred) utterance.voice = preferred

        console.log(
          "[Voice] Browser TTS voices available:",
          voices.length,
          "using:",
          preferred?.name ?? "default"
        )

        utterance.onend = () => setTimeout(resolve, 800)
        utterance.onerror = (e) => {
          console.warn("[Voice] SpeechSynthesis error:", e.error)
          resolve()
        }
        window.speechSynthesis.speak(utterance)
        console.log("[Voice] Browser TTS speaking:", text.slice(0, 30))

        // Failsafe
        setTimeout(resolve, 35000)
      }

      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        doSpeak()
      } else {
        window.speechSynthesis.onvoiceschanged = () => doSpeak()
        // If voices never load, speak anyway after 500ms
        setTimeout(doSpeak, 500)
      }
    })
  }, [])

  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
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

  // ── STT ────────────────────────────────────────────────────────────────────────────────
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
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
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

  // ── Continuous session loop (uses ref for isActive check) ────────────────────────────────
  const runContinuousLoop = useCallback(async () => {
    // Guard against parallel execution
    if (loopRunningRef.current) {
      console.log("[Voice] Loop: already running, skipping")
      return
    }
    loopRunningRef.current = true

    // Use ref, not state - avoids stale closure
    if (!isActiveRef.current) {
      console.log("[Voice] Loop: not active, returning")
      loopRunningRef.current = false
      return
    }

    console.log("[Voice] Loop: starting recording...")
    await startRecording()

    // Wait for recording to stop (either timeout or manual)
    await new Promise<void>((resolve) => {
      const checkStopped = () => {
        if (mediaRecorderRef.current?.state !== "recording") {
          console.log("[Voice] Loop: recording stopped detected")
          resolve()
        } else {
          setTimeout(checkStopped, 100)
        }
      }

      // Also resolve when recorder.onstop fires
      const recorder = mediaRecorderRef.current
      if (recorder) {
        const originalOnStop = recorder.onstop
        recorder.onstop = (e: Event) => {
          if (originalOnStop) originalOnStop.call(recorder, e)
          resolve()
        }
      }
      checkStopped()
    })

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }

    if (!isActiveRef.current) {
      loopRunningRef.current = false
      return
    }

    // Process the recording
    console.log("[Voice] Loop: processing recording...")
    await processRecording()

    if (!isActiveRef.current) {
      loopRunningRef.current = false
      return
    }

    // Continue loop after delay if continuous mode
    if (continuousRef.current && isActiveRef.current) {
      console.log("[Voice] Loop: scheduling next cycle in 500ms...")
      loopTimeoutRef.current = setTimeout(() => {
        loopRunningRef.current = false
        if (isActiveRef.current) {
          runContinuousLoop()
        }
      }, 500)
    } else {
      loopRunningRef.current = false
      setPhase("idle")
    }
  }, [startRecording, processRecording])

  // ── Session controls ──────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    if (!isSupported) {
      handleError("Voice not supported")
      return
    }
    if (isActiveRef.current) return // Already running

    // Set ref FIRST (for immediate use in loop)
    isActiveRef.current = true
    // Then set state (for UI)
    setIsActive(true)
    setError(null)
    setTranscript("")
    console.log("[Voice] Session started")

    // Start the loop
    runContinuousLoop()
  }, [isSupported, handleError, runContinuousLoop])

  const stopSession = useCallback(() => {
    console.log("[Voice] Session stopping...")
    // Set ref first
    isActiveRef.current = false
    loopRunningRef.current = false
    // Then state
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
