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
  onToken?: (token: string) => void // Live transcript callback
  ttsEnabled?: boolean
  continuous?: boolean
  maxRecordTime?: number
  voice?: string // TTS voice selection
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
    onToken,
    language = "en",
    ttsEnabled = true,
    continuous = true,
    maxRecordTime = 15000,
    voice = "aura-asteria-en", // Default Deepgram voice
  } = options

  const [phase, setPhase] = useState<VoicePhase>("idle")
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isActive, setIsActive] = useState(false)

  // Refs - all refs for stable access in async callbacks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const mimeTypeRef = useRef<string>("")
  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(false) // Ref for async callback checks
  const loopRunningRef = useRef(false) // Guard against parallel loop execution
  const audioContextRef = useRef<AudioContext | null>(null) // Pre-unlocked for iOS

  // Streaming TTS queue refs
  const ttsQueueRef = useRef<string[]>([]) // Sentences queued for TTS
  const isProcessingQueueRef = useRef(false) // Guard against parallel queue processing
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null) // Current audio source for cancellation

  // Option refs
  const ttsEnabledRef = useRef(ttsEnabled)
  const continuousRef = useRef(continuous)
  const onTranscriptRef = useRef(onTranscript)
  const onAIResponseRef = useRef(onAIResponse)
  const onErrorRef = useRef(onError)
  const onTokenRef = useRef(onToken)
  const voiceRef = useRef(voice)

  ttsEnabledRef.current = ttsEnabled
  continuousRef.current = continuous
  onTranscriptRef.current = onTranscript
  onAIResponseRef.current = onAIResponse
  onErrorRef.current = onError
  onTokenRef.current = onToken
  voiceRef.current = voice

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

  // ── Streaming TTS Queue (ultra-low latency) ─────────────────────────────────────
  // Split text into sentences for streaming TTS
  const splitIntoSentences = useCallback((text: string): string[] => {
    // Split on sentence boundaries, keeping the delimiter
    const sentences = text
      .replace(/\*\*/g, "") // Remove markdown bold
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    return sentences
  }, [])

  // Play a single sentence via TTS
  const speakSentence = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return

    const ctx = audioContextRef.current
    if (!ctx || ctx.state === "closed") {
      console.warn("[TTS-Queue] No AudioContext for sentence")
      return
    }

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 500), voice: voiceRef.current }), // Include voice
      })

      if (!res.ok) {
        console.warn("[TTS-Queue] TTS API error:", res.status)
        return
      }

      const arrayBuffer = await res.arrayBuffer()
      if (arrayBuffer.byteLength < 100) {
        console.warn("[TTS-Queue] Audio buffer too small")
        return
      }

      // Ensure context is running
      if (ctx.state === "suspended") {
        await ctx.resume()
      }

      // Decode and play
      const buffer = await ctx.decodeAudioData(arrayBuffer)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      currentSourceRef.current = source

      await new Promise<void>((resolve) => {
        source.onended = () => {
          currentSourceRef.current = null
          resolve()
        }
        source.start(0)
        console.log("[TTS-Queue] Playing:", text.slice(0, 30))
      })
    } catch (err) {
      console.error("[TTS-Queue] Playback error:", err)
    }
  }, [])

  // Process the TTS queue one sentence at a time
  const processTTSQueue = useCallback(async () => {
    if (isProcessingQueueRef.current) return
    isProcessingQueueRef.current = true

    while (ttsQueueRef.current.length > 0 && isActiveRef.current) {
      const sentence = ttsQueueRef.current.shift()
      if (sentence) {
        await speakSentence(sentence)
      }
    }

    isProcessingQueueRef.current = false
    console.log("[TTS-Queue] Queue empty, done")
  }, [speakSentence])

  // Enqueue text for streaming TTS (splits into sentences)
  const enqueueTTS = useCallback(
    (text: string) => {
      if (!ttsEnabledRef.current || !text.trim()) return

      const sentences = splitIntoSentences(text)
      ttsQueueRef.current.push(...sentences)
      console.log("[TTS-Queue] Enqueued", sentences.length, "sentences")

      // Start processing if not already
      if (!isProcessingQueueRef.current) {
        processTTSQueue()
      }
    },
    [splitIntoSentences, processTTSQueue]
  )

  // Stream AI response and enqueue TTS chunks
  const getStreamingAIResponse = useCallback(
    async (userText: string): Promise<string> => {
      setPhase("thinking")
      console.log("[Stream] Starting streaming request for:", userText.slice(0, 30))

      const res = await fetch("/api/xmad/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, stream: true }),
      })

      if (!res.ok) throw new Error(`AI error: ${res.status}`)
      console.log("[Stream] Response OK, reading body...")

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let fullText = ""
      let sentenceBuffer = ""
      let chunkCount = 0

      setPhase("speaking") // Start speaking phase as soon as we get first chunk

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log("[Stream] Done, received", chunkCount, "chunks")
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        chunkCount++
        console.log("[Stream] Chunk", chunkCount, "raw:", chunk.slice(0, 150))

        // Parse SSE format: "data: {...}\n\n" or "event: ...\ndata: {...}\n\n"
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.startsWith("data: ") ? line.slice(6).trim() : line.slice(5).trim()
            if (data === "[DONE]" || !data) continue

            try {
              const parsed = JSON.parse(data)
              console.log(
                "[Stream] Parsed type:",
                parsed?.type,
                "delta:",
                JSON.stringify(parsed?.delta || {}).slice(0, 50)
              )

              // Handle Anthropic-style streaming
              const token =
                (parsed?.delta?.type === "text_delta"
                  ? (parsed.delta as { text?: string }).text
                  : "") ||
                parsed?.delta?.text ||
                parsed?.content?.[0]?.text ||
                parsed?.text ||
                ""

              if (token) {
                const cleanToken = token.replace(/\*\*/g, "") // Remove markdown bold
                fullText += cleanToken
                sentenceBuffer += cleanToken

                // Live transcript callback
                onTokenRef.current?.(cleanToken)

                console.log(
                  "[Stream] Token:",
                  token.slice(0, 20),
                  "| Buffer:",
                  sentenceBuffer.length,
                  "chars"
                )

                // Check if we have a complete sentence
                if (/[.!?]\s*$/.test(sentenceBuffer) && sentenceBuffer.trim().length > 10) {
                  console.log("[Stream] Sentence complete:", sentenceBuffer.trim().slice(0, 40))
                  enqueueTTS(sentenceBuffer.trim())
                  sentenceBuffer = ""
                }
              }
            } catch (e) {
              console.log("[Stream] Parse error:", e, "for:", data.slice(0, 50))
              // Not JSON, might be raw text
              if (data && data !== "[DONE]") {
                fullText += data
              }
            }
          }
        }
      }

      // Enqueue any remaining text
      if (sentenceBuffer.trim()) {
        console.log("[Stream] Final buffer:", sentenceBuffer.trim().slice(0, 40))
        enqueueTTS(sentenceBuffer.trim())
      }

      // Wait for TTS queue to finish
      console.log("[Stream] Waiting for TTS queue to drain...")
      while (isProcessingQueueRef.current || ttsQueueRef.current.length > 0) {
        await new Promise((r) => setTimeout(r, 100))
      }

      console.log("[Stream] Complete:", fullText.slice(0, 60))
      return fullText
    },
    [enqueueTTS]
  )

  // ── TTS (ElevenLabs via AudioContext, with browser SpeechSynthesis fallback) ─────
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return
    setPhase("speaking")
    console.log("[TTS] Starting for text:", text.slice(0, 50))

    // Use pre-unlocked AudioContext from user gesture (iOS-compatible)
    const ctx = audioContextRef.current
    if (!ctx) {
      console.warn(
        "[TTS] No AudioContext available - session may not have been started with user gesture"
      )
    }

    // Try ElevenLabs/Deepgram first via AudioContext
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 4000) }),
      })

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer()
        console.log("[TTS] Received audio buffer:", arrayBuffer.byteLength, "bytes")

        if (ctx && ctx.state !== "closed") {
          await new Promise<void>((resolve) => {
            const playAudio = async () => {
              try {
                // Ensure context is running (should already be unlocked from user gesture)
                if (ctx.state === "suspended") {
                  await ctx.resume()
                  console.log("[TTS] AudioContext resumed (was suspended)")
                }

                console.log("[TTS] AudioContext state:", ctx.state)

                // Decode and play
                const buffer = await ctx.decodeAudioData(arrayBuffer)
                const source = ctx.createBufferSource()
                source.buffer = buffer
                source.connect(ctx.destination)

                source.onended = () => {
                  console.log("[TTS] Audio finished playing")
                  setTimeout(resolve, 500)
                }

                source.start(0)
                console.log("[TTS] Audio started playing")
              } catch (err) {
                console.error("[TTS] AudioContext playback error:", err)
                resolve() // Don't reject - fall through to browser TTS
              }
            }

            playAudio()
          })
          return
        }
        console.warn("[TTS] AudioContext closed or unavailable, trying browser TTS")
      } else {
        console.warn("[TTS] TTS API returned status:", res.status)
      }
    } catch (err) {
      console.warn("[TTS] TTS fetch failed:", err)
    }

    // Fall back to browser SpeechSynthesis
    console.log("[TTS] Using browser SpeechSynthesis fallback")
    await new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        console.warn("[TTS] speechSynthesis not available")
        resolve()
        return
      }
      window.speechSynthesis.cancel()

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

        console.log("[TTS] Browser TTS using voice:", preferred?.name ?? "default")

        utterance.onend = () => {
          console.log("[TTS] Browser TTS finished")
          setTimeout(resolve, 500)
        }
        utterance.onerror = (e) => {
          console.warn("[TTS] SpeechSynthesis error:", e.error)
          resolve()
        }

        // Unlock media audio channel on iOS before speaking
        const unlock = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
        )
        unlock.volume = 0.01
        unlock.play().catch(() => {})

        window.speechSynthesis.speak(utterance)
        console.log("[TTS] Browser TTS speaking:", text.slice(0, 30))

        // Failsafe timeout
        setTimeout(resolve, 35000)
      }

      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        doSpeak()
      } else {
        window.speechSynthesis.onvoiceschanged = () => doSpeak()
        setTimeout(doSpeak, 500)
      }
    })
  }, [])

  const stopSpeaking = useCallback(() => {
    // Clear TTS queue
    ttsQueueRef.current = []
    isProcessingQueueRef.current = false

    // Stop current audio source
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop()
      } catch {}
      currentSourceRef.current = null
    }

    // Cancel browser SpeechSynthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    console.log("[TTS] Stopped speaking and cleared queue")
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

    // Stop mic before TTS to prevent echo
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    console.log("[Voice] Mic stopped for TTS")

    let aiText: string
    try {
      // Use streaming AI response for ultra-low latency TTS
      if (ttsEnabledRef.current) {
        aiText = await getStreamingAIResponse(text)
      } else {
        aiText = await getAIResponse(text)
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "AI failed")
      return
    }

    onAIResponseRef.current?.(aiText)

    // Small delay to ensure audio finishes cleanly
    await new Promise((r) => setTimeout(r, 200))
  }, [transcribeBlob, getAIResponse, getStreamingAIResponse, handleError])

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

    // CRITICAL: Create and unlock AudioContext in user gesture call stack (iOS requirement)
    // This MUST happen synchronously during the tap/click handler
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      // Resume immediately in user gesture context
      if (ctx.state === "suspended") {
        await ctx.resume()
        console.log("[Voice] AudioContext unlocked for iOS")
      }

      // Play a silent buffer to fully unlock audio on iOS
      const silentBuffer = ctx.createBuffer(1, 1, 22050)
      const silentSource = ctx.createBufferSource()
      silentSource.buffer = silentBuffer
      silentSource.connect(ctx.destination)
      silentSource.start(0)
      console.log("[Voice] AudioContext ready, state:", ctx.state)
    } catch (err) {
      console.warn("[Voice] AudioContext setup failed:", err)
      // Continue anyway - browser TTS fallback will work
    }

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

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
      audioContextRef.current = null
      console.log("[Voice] AudioContext closed")
    }

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
