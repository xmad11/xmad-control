/* ════════════════════════════════════════════════════════════════════════════════════════
 * USE VOICE CHAT - SSOT Ultra-Low Latency Voice System
 * Flow: tap to start → speak → auto-detect silence → STT → streaming AI → streaming TTS
 * Features: Live transcript, interruptible TTS, continuous mode, hold mode support
 * ═══════════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════════════

/** Default silence threshold in milliseconds for auto-stop */
const DEFAULT_SILENCE_THRESHOLD_MS = 1500

export interface UseVoiceChatOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
  onAIResponse?: (text: string) => void
  onToken?: (token: string) => void // Live transcript callback
  ttsEnabled?: boolean
  continuous?: boolean
  maxRecordTime?: number // MAX time, not forced wait
  voice?: string // TTS voice selection
  silenceDetection?: boolean // Auto-stop on silence
  silenceThreshold?: number // ms of silence before auto-stop
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

// ═══════════════════════════════════════════════════════════════════════════════════════
// VOICE ACTIVITY DETECTION (Silence Detection)
// ═══════════════════════════════════════════════════════════════════════════════════════

function createSilenceDetector(
  stream: MediaStream,
  onSilence: () => void,
  threshold = DEFAULT_SILENCE_THRESHOLD_MS
): { stop: () => void } {
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()
  const source = audioContext.createMediaStreamSource(stream)
  source.connect(analyser)
  analyser.fftSize = 512

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  let silenceStart: number | null = null
  let running = true
  let rafId: number | null = null // Track RAF ID for cleanup

  const check = () => {
    if (!running) return
    analyser.getByteFrequencyData(dataArray)
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length

    // Threshold: below 10 is considered silence
    if (avg < 10) {
      if (!silenceStart) {
        silenceStart = Date.now()
      } else if (Date.now() - silenceStart > threshold) {
        onSilence()
        running = false
        // Check state before closing to avoid double-close error
        if (audioContext.state !== "closed") {
          audioContext.close()
        }
        return
      }
    } else {
      silenceStart = null
    }
    rafId = requestAnimationFrame(check)
  }
  rafId = requestAnimationFrame(check)

  return {
    stop: () => {
      running = false
      // Cancel pending RAF
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      // Check state before closing to avoid double-close error
      if (audioContext.state !== "closed") {
        audioContext.close()
      }
    },
  }
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
    maxRecordTime = 30000, // MAX 30s, but auto-stop on silence
    voice = "aura-asteria-en",
    silenceDetection = true, // Enable by default for ultra-low latency
    silenceThreshold = DEFAULT_SILENCE_THRESHOLD_MS,
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
  const recordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActiveRef = useRef(false)
  const loopRunningRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const silenceDetectorRef = useRef<{ stop: () => void } | null>(null)
  const isRecordingRef = useRef(false)
  const streamAbortRef = useRef<AbortController | null>(null)

  // Streaming TTS queue refs
  const ttsQueueRef = useRef<string[]>([])
  const isProcessingQueueRef = useRef(false)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)

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
  // Split text into sentences for streaming TTS (avoids splitting on abbreviations)
  const splitIntoSentences = useCallback((text: string): string[] => {
    // Split on sentence boundaries, avoiding common abbreviations
    const sentences = text
      .replace(/\*\*/g, "") // Remove markdown bold
      .split(/(?<=[.!?])(?<!Mr\.|Mrs\.|Ms\.|Dr\.|Jr\.|Sr\.|vs\.|etc\.|i\.e\.|e\.g\.)\s+/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    return sentences
  }, [])

  // Play a single sentence via TTS
  const speakSentence = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return

    // Don't play if session is no longer active (interruptible TTS)
    if (!isActiveRef.current && !loopRunningRef.current) {
      console.log("[TTS-Queue] Session inactive, skipping sentence")
      return
    }

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
  }, [speakSentence])

  // Enqueue text for streaming TTS (splits into sentences)
  const enqueueTTS = useCallback(
    (text: string) => {
      if (!ttsEnabledRef.current || !text.trim()) return

      const sentences = splitIntoSentences(text)
      ttsQueueRef.current.push(...sentences)

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
      const reqId = Math.random().toString(36).slice(2, 8)
      console.log("[Stream] Request", reqId, "for:", userText.slice(0, 30))

      // Create AbortController for this stream
      const abortController = new AbortController()
      streamAbortRef.current = abortController

      // 25s safety timeout (Vercel has 30s limit)
      const timeoutId = setTimeout(() => {
        console.warn("[Stream] Request", reqId, "timed out after 25s")
        abortController.abort()
      }, 25000)

      const res = await fetch("/api/xmad/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, stream: true }),
        signal: abortController.signal,
      })

      if (!res.ok) throw new Error(`AI error: ${res.status}`)
      console.log("[Stream] Request", reqId, "response OK")

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let fullText = ""
      let sentenceBuffer = ""
      let lineBuffer = "" // Buffer for incomplete SSE lines
      let chunkCount = 0

      setPhase("speaking") // Start speaking phase as soon as we get first chunk

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log("[Stream] Request", reqId, "done, received", chunkCount, "chunks")
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          chunkCount++

          // Handle SSE lines that may split mid-chunk
          lineBuffer += chunk
          const lines = lineBuffer.split("\n")
          // Keep the last incomplete line in the buffer
          lineBuffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.startsWith("data: ") ? line.slice(6).trim() : line.slice(5).trim()
              if (data === "[DONE]" || !data) continue

              try {
                const parsed = JSON.parse(data)

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

                  // Check if we have a complete sentence (avoid abbreviations)
                  if (
                    /(?<!Mr|Mrs|Ms|Dr|Jr|Sr|vs|etc)[.!?]\s*$/i.test(sentenceBuffer) &&
                    sentenceBuffer.trim().length > 10
                  ) {
                    enqueueTTS(sentenceBuffer.trim())
                    sentenceBuffer = ""
                  }
                }
              } catch {
                // Not JSON, might be raw text
                if (data && data !== "[DONE]") {
                  fullText += data
                }
              }
            }
          }
        }
      } finally {
        clearTimeout(timeoutId)
        reader.releaseLock()
        streamAbortRef.current = null
      }

      // Enqueue any remaining text
      if (sentenceBuffer.trim()) {
        enqueueTTS(sentenceBuffer.trim())
      }

      // Wait for TTS queue to finish
      while (isProcessingQueueRef.current || ttsQueueRef.current.length > 0) {
        await new Promise((r) => setTimeout(r, 100))
      }

      console.log("[Stream] Request", reqId, "complete:", fullText.slice(0, 60))
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

      // Flag to prevent double-call from both onvoiceschanged and setTimeout
      let spoken = false

      const doSpeak = () => {
        if (spoken) return
        spoken = true

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
    if (silenceDetectorRef.current) {
      silenceDetectorRef.current.stop()
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

    // Find supported MIME type (iOS Safari compatibility)
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

    // Set onstop handler BEFORE recorder.start() to avoid race condition
    recorder.onstop = () => {
      console.log("[Voice] Recorder onstop fired")
      isRecordingRef.current = false
    }

    recorder.start(100) // Collect chunks every 100ms
    isRecordingRef.current = true
    setPhase("listening")
    console.log("[Voice] Recording started")

    // Start silence detection for ultra-low latency (auto-stop when user stops talking)
    if (silenceDetection) {
      silenceDetectorRef.current = createSilenceDetector(
        stream,
        () => {
          if (mediaRecorderRef.current?.state === "recording") {
            console.log("[Voice] Silence detected, auto-stopping")
            mediaRecorderRef.current.stop()
          }
        },
        silenceThreshold
      )
    }

    // Fallback: Auto-stop after maxRecordTime (safety net, not forced wait)
    recordTimeoutRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        console.log("[Voice] Max time reached, auto-stopping")
        mediaRecorderRef.current.stop()
      }
    }, maxRecordTime)
  }, [isSupported, handleError, maxRecordTime, silenceDetection, silenceThreshold])

  // ── Stop recording ────────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current)
      recordTimeoutRef.current = null
    }

    isRecordingRef.current = false

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
      // Close existing AudioContext if present (prevent leak on rapid session start)
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }

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

    // Stop silence detector
    if (silenceDetectorRef.current) {
      silenceDetectorRef.current.stop()
      silenceDetectorRef.current = null
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

    // Abort any pending stream request
    if (streamAbortRef.current) {
      streamAbortRef.current.abort()
      streamAbortRef.current = null
    }

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
    isRecording: phase === "listening" || isRecordingRef.current,
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
