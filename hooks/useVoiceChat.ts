/* ════════════════════════════════════════════════════════════════════════════════════════
 * USE VOICE CHAT - SSOT Ultra-Low Latency Voice System
 * Flow: tap to start → speak → auto-detect silence → STT → streaming AI → streaming TTS
 * Features: Live transcript, interruptible TTS, continuous mode, hold mode support
 * ═══════════════════════════════════════════════════════════════════════════════════════ */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════════════

/** Default silence threshold in milliseconds for auto-stop */
const DEFAULT_SILENCE_THRESHOLD_MS = 2000

/** Minimum recording duration before silence detection can trigger (ms) */
const MIN_RECORDING_DURATION_MS = 2000

/** Audio level threshold for silence detection (0-255 scale, higher = less sensitive) */
const SILENCE_AUDIO_THRESHOLD = 20

/** DEBUG: Set to true to disable silence auto-stop (for debugging empty transcripts) */
const DEBUG_DISABLE_SILENCE_STOP = true

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
  analyser.fftSize = 2048 // Increased for better frequency resolution (was 512)

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  let silenceStart: number | null = null
  let running = true
  let rafId: number | null = null // Track RAF ID for cleanup
  let logCounter = 0 // Log every 10 frames to avoid spam

  const check = () => {
    if (!running) return
    analyser.getByteFrequencyData(dataArray)
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length

    // Log audio level periodically (every 10 frames ~ every 160ms)
    logCounter++
    if (logCounter % 10 === 0) {
      console.log(
        "[SilenceDetector] Audio RMS:",
        avg.toFixed(2),
        "| Threshold:",
        SILENCE_AUDIO_THRESHOLD,
        "| Silent:",
        avg < SILENCE_AUDIO_THRESHOLD
      )
    }

    // Threshold: below SILENCE_AUDIO_THRESHOLD is considered silence
    if (avg < SILENCE_AUDIO_THRESHOLD) {
      if (!silenceStart) {
        silenceStart = Date.now()
        console.log("[SilenceDetector] Silence STARTED at RMS:", avg.toFixed(2))
      } else if (Date.now() - silenceStart > threshold) {
        console.log(
          "[SilenceDetector] TRIGGERING silence callback after",
          Date.now() - silenceStart,
          "ms of silence"
        )
        onSilence()
        running = false
        // Check state before closing to avoid double-close error
        if (audioContext.state !== "closed") {
          audioContext.close()
        }
        return
      }
    } else {
      if (silenceStart) {
        console.log(
          "[SilenceDetector] Silence ENDED (was silent for",
          Date.now() - silenceStart,
          "ms)"
        )
      }
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
  const recordingStartTimeRef = useRef<number>(0)

  // Streaming TTS queue refs
  const ttsQueueRef = useRef<string[]>([])
  const isProcessingQueueRef = useRef(false)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const ttsAbortRef = useRef<AbortController | null>(null)

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

  // ── Comprehensive Markdown Stripping for TTS ─────────────────────────────────────
  const stripMarkdown = useCallback((text: string): string => {
    return (
      text
        // Remove code blocks first (to avoid partial matches)
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`{3}[\s\S]*?`{3}/g, "")
        // Remove inline code
        .replace(/`([^`]+)`/g, "$1")
        // Remove headers (# ## ### etc.)
        .replace(/^#{1,6}\s+/gm, "")
        // Remove bold/italic (**bold** *italic* ***both***)
        .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        // Remove strikethrough
        .replace(/~~(.+?)~~/g, "$1")
        // Remove links [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove images ![alt](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
        // Remove blockquotes
        .replace(/^>\s+/gm, "")
        // Remove horizontal rules
        .replace(/^[-*_]{3,}\s*$/gm, "")
        // Remove list markers (- * + 1.)
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "")
        // Remove HTML tags
        .replace(/<[^>]+>/g, "")
        // Collapse multiple spaces/newlines
        .replace(/\s+/g, " ")
        .trim()
    )
  }, [])

  // ── Streaming TTS Queue (ultra-low latency) ─────────────────────────────────────
  // Split text into sentences for streaming TTS (Safari-compatible, no lookbehind)
  const splitIntoSentences = useCallback(
    (text: string): string[] => {
      // First strip all markdown
      const cleanText = stripMarkdown(text)

      // Split on sentence boundaries (Safari-compatible without lookbehind)
      // We check for abbreviations after splitting and rejoin if needed
      const rawSentences = cleanText.split(/[.!?]+\s+/)

      const sentences: string[] = []
      let currentSentence = ""

      for (const part of rawSentences) {
        currentSentence += (currentSentence ? " " : "") + part

        // Check if this looks like an abbreviation (not end of sentence)
        const abbreviations = ["Mr", "Mrs", "Ms", "Dr", "Jr", "Sr", "vs", "etc", "i.e", "e.g"]
        const endsWithAbbrev = abbreviations.some(
          (abbr) =>
            currentSentence.trim().endsWith(abbr) || currentSentence.trim().endsWith(`${abbr}.`)
        )

        // If not an abbreviation and has enough content, consider it complete
        if (!endsWithAbbrev && currentSentence.trim().length > 5) {
          sentences.push(currentSentence.trim())
          currentSentence = ""
        }
      }

      // Add any remaining text
      if (currentSentence.trim()) {
        sentences.push(currentSentence.trim())
      }

      return sentences.filter((s) => s.length > 0)
    },
    [stripMarkdown]
  )

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

    // Create AbortController for this TTS request
    ttsAbortRef.current = new AbortController()

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 500), voice: voiceRef.current }),
        signal: ttsAbortRef.current.signal, // Enable abort
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
                  const cleanToken = stripMarkdown(token) // Use comprehensive markdown stripping
                  fullText += cleanToken
                  sentenceBuffer += cleanToken

                  // Live transcript callback
                  onTokenRef.current?.(cleanToken)

                  // Safari-compatible sentence detection (no lookbehind)
                  const trimmedBuffer = sentenceBuffer.trim()
                  if (/[.!?]\s*$/.test(trimmedBuffer) && trimmedBuffer.length > 5) {
                    // Check it doesn't end with abbreviation
                    const abbreviations = [
                      "Mr",
                      "Mrs",
                      "Ms",
                      "Dr",
                      "Jr",
                      "Sr",
                      "vs",
                      "etc",
                      "i.e",
                      "e.g",
                    ]
                    const endsWithAbbrev = abbreviations.some(
                      (abbr) => trimmedBuffer.endsWith(abbr) || trimmedBuffer.endsWith(`${abbr}.`)
                    )
                    if (!endsWithAbbrev) {
                      enqueueTTS(trimmedBuffer)
                      sentenceBuffer = ""
                    }
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
    [enqueueTTS, stripMarkdown]
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
    // Abort any in-flight TTS fetch
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort()
      ttsAbortRef.current = null
    }

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
      console.log("[Voice] ========== STT REQUEST START ==========")
      const sttStartTime = Date.now()

      setPhase("processing")
      const ext = mimeTypeRef.current.includes("mp4")
        ? "mp4"
        : mimeTypeRef.current.includes("ogg")
          ? "ogg"
          : "webm"
      const fileType = mimeTypeRef.current || "audio/webm"

      console.log("[Voice] STT blob info:", {
        size: blob.size,
        sizeKB: (blob.size / 1024).toFixed(2),
        type: blob.type,
        ext,
        fileType,
        language,
      })

      // Guard: Don't send tiny blobs
      if (blob.size < 10000) {
        console.warn("[Voice] ⚠️ Blob too small for reliable STT:", blob.size, "bytes (< 10KB)")
        console.warn("[Voice] This may result in empty transcript!")
      }

      const form = new FormData()
      form.append(
        "audio",
        new File([blob], `recording.${ext}`, { type: fileType }),
        `recording.${ext}`
      )
      form.append("language", language)

      console.log("[Voice] Sending to STT API...")
      const res = await fetch("/api/stt", { method: "POST", body: form })

      const responseTime = Date.now()
      console.log("[Voice] STT response received in", responseTime - sttStartTime, "ms")
      console.log("[Voice] STT HTTP status:", res.status)

      const data = await res.json()
      const parseTime = Date.now()
      console.log("[Voice] STT JSON parsed in", parseTime - responseTime, "ms")
      console.log("[Voice] STT response data:", JSON.stringify(data, null, 2))

      if (!data.ok) {
        console.error("[Voice] STT FAILED:", data.error)
        throw new Error(data.error || "STT failed")
      }

      const transcriptText = (data.text || "").trim()
      console.log("[Voice] ========== STT RESULT ==========")
      console.log("[Voice] Transcript length:", transcriptText.length, "chars")
      console.log("[Voice] Transcript text:", transcriptText.slice(0, 200) || "(empty)")
      console.log("[Voice] Total STT time:", Date.now() - sttStartTime, "ms")

      if (!transcriptText) {
        console.warn("[Voice] ⚠️ EMPTY TRANSCRIPT returned from STT!")
        console.warn("[Voice] Blob size was:", blob.size, "bytes")
        console.warn("[Voice] Check server logs for Deepgram response details")
      }

      return transcriptText
    },
    [language]
  )

  // ── Process recorded audio ─────────────────────────────────────────────────────
  const processRecording = useCallback(async () => {
    console.log("[Voice] ========== PROCESSING RECORDING ==========")
    const processStartTime = Date.now()

    const blob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current || "audio/webm" })
    console.log("[Voice] Created blob from", audioChunksRef.current.length, "chunks")
    console.log("[Voice] Blob size:", blob.size, "bytes (", (blob.size / 1024).toFixed(2), "KB)")
    console.log("[Voice] Blob type:", blob.type)

    if (blob.size < 1000) {
      console.warn("[Voice] ⚠️ Blob too small (< 1KB), skipping transcription")
      console.warn("[Voice] This usually means no audio was captured or mic issue")
      return
    }

    let text: string
    try {
      text = await transcribeBlob(blob)
      console.log("[Voice] Transcription complete in", Date.now() - processStartTime, "ms")
    } catch (err) {
      console.error("[Voice] Transcription FAILED:", err)
      handleError(err instanceof Error ? err.message : "Transcription failed")
      return
    }

    if (!text) {
      console.warn("[Voice] ⚠️ Empty transcript - skipping AI response")
      console.warn("[Voice] This is the EMPTY TRANSCRIPT bug we're investigating!")
      return
    }

    console.log("[Voice] ✓ Got transcript:", text.slice(0, 100))
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

    const aiStartTime = Date.now()
    let aiText: string
    try {
      // Use streaming AI response for ultra-low latency TTS
      if (ttsEnabledRef.current) {
        console.log("[Voice] Getting streaming AI response...")
        aiText = await getStreamingAIResponse(text)
      } else {
        console.log("[Voice] Getting non-streaming AI response...")
        aiText = await getAIResponse(text)
      }
      console.log("[Voice] AI response complete in", Date.now() - aiStartTime, "ms")
    } catch (err) {
      console.error("[Voice] AI response FAILED:", err)
      handleError(err instanceof Error ? err.message : "AI failed")
      return
    }

    console.log("[Voice] ✓ AI response:", aiText?.slice(0, 100))
    onAIResponseRef.current?.(aiText)

    console.log("[Voice] ========== PROCESSING COMPLETE ==========")
    console.log("[Voice] Total processing time:", Date.now() - processStartTime, "ms")

    // Small delay to ensure audio finishes cleanly
    await new Promise((r) => setTimeout(r, 200))
  }, [transcribeBlob, getAIResponse, getStreamingAIResponse, handleError])

  // ── Start recording ───────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    console.log("[Voice] ========== RECORDING START INITIATED ==========")
    console.log("[Voice] isSupported:", isSupported)

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
      console.log("[Voice] Requesting microphone access...")
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      })
      streamRef.current = stream
      console.log("[Voice] Microphone access granted")
      console.log("[Voice] Audio tracks:", stream.getAudioTracks().length)
      const track = stream.getAudioTracks()[0]
      if (track) {
        console.log("[Voice] Track settings:", JSON.stringify(track.getSettings(), null, 2))
        console.log(
          "[Voice] Track capabilities:",
          JSON.stringify(track.getCapabilities?.() || {}, null, 2)
        )
      }
    } catch (micErr) {
      console.error("[Voice] Microphone access DENIED:", micErr)
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
      const supported = types.find((t) => MediaRecorder.isTypeSupported(t)) || ""
      console.log(
        "[Voice] MIME type support check:",
        types.map((t) => ({ type: t, supported: MediaRecorder.isTypeSupported(t) }))
      )
      return supported
    })()

    if (!mimeType) {
      console.error("[Voice] No supported audio MIME type found")
      handleError("No supported audio format")
      stream.getTracks().forEach((t) => t.stop())
      return
    }

    mimeTypeRef.current = mimeType
    console.log("[Voice] Selected MIME type:", mimeType)

    audioChunksRef.current = []
    const recorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = recorder
    console.log("[Voice] MediaRecorder created with mimeType:", mimeType)

    // Track chunk sizes for debugging
    let chunkCount = 0
    let totalChunkSize = 0

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data)
        chunkCount++
        totalChunkSize += e.data.size
        // Log every 5 chunks or large chunks
        if (chunkCount % 5 === 0 || e.data.size > 5000) {
          console.log(
            "[Voice] Chunk #",
            chunkCount,
            ":",
            e.data.size,
            "bytes | Total so far:",
            totalChunkSize,
            "bytes"
          )
        }
      }
    }

    // Set onstop handler BEFORE recorder.start() to avoid race condition
    recorder.onstop = () => {
      const duration = Date.now() - recordingStartTimeRef.current
      const finalBlob = new Blob(audioChunksRef.current, {
        type: mimeTypeRef.current || "audio/webm",
      })
      console.log("[Voice] ========== RECORDER STOPPED ==========")
      console.log("[Voice] Stop reason: onstop event fired")
      console.log("[Voice] Recording duration:", duration, "ms")
      console.log("[Voice] Total chunks:", audioChunksRef.current.length)
      console.log(
        "[Voice] Final blob size:",
        finalBlob.size,
        "bytes (",
        (finalBlob.size / 1024).toFixed(2),
        "KB)"
      )
      console.log("[Voice] Blob type:", finalBlob.type)
      isRecordingRef.current = false
    }

    recorder.start(100) // Collect chunks every 100ms
    isRecordingRef.current = true
    recordingStartTimeRef.current = Date.now() // Track when recording started
    setPhase("listening")
    console.log("[Voice] ========== RECORDING STARTED ==========")
    console.log("[Voice] Timeslice: 100ms")
    console.log("[Voice] Silence detection enabled:", silenceDetection)
    console.log("[Voice] DEBUG: Silence auto-stop DISABLED:", DEBUG_DISABLE_SILENCE_STOP)

    // Start silence detection for ultra-low latency (auto-stop when user stops talking)
    if (silenceDetection && !DEBUG_DISABLE_SILENCE_STOP) {
      silenceDetectorRef.current = createSilenceDetector(
        stream,
        () => {
          // MINIMUM DURATION GUARD: Don't stop if recording hasn't met minimum duration
          const elapsed = Date.now() - recordingStartTimeRef.current
          if (elapsed < MIN_RECORDING_DURATION_MS) {
            console.log("[Voice] Silence ignored - minimum duration not met:", elapsed, "ms")
            return
          }
          if (mediaRecorderRef.current?.state === "recording") {
            console.log("[Voice] ========== AUTO-STOP: SILENCE DETECTED ==========")
            console.log("[Voice] Duration:", elapsed, "ms")
            mediaRecorderRef.current.stop()
          }
        },
        silenceThreshold
      )
    } else if (DEBUG_DISABLE_SILENCE_STOP) {
      console.log(
        "[Voice] ⚠️ DEBUG MODE: Silence auto-stop is DISABLED - recording will continue until max time or manual stop"
      )
    }

    // Fallback: Auto-stop after maxRecordTime (safety net, not forced wait)
    recordTimeoutRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        console.log("[Voice] ========== AUTO-STOP: MAX TIME REACHED ==========")
        console.log("[Voice] Max time:", maxRecordTime, "ms")
        mediaRecorderRef.current.stop()
      }
    }, maxRecordTime)
  }, [isSupported, handleError, maxRecordTime, silenceDetection, silenceThreshold])

  // ── Stop recording ────────────────────────────────────────────────────────────
  const stopRecording = useCallback((reason = "manual") => {
    console.log("[Voice] ========== STOP RECORDING ==========")
    console.log("[Voice] Stop reason:", reason)
    console.log("[Voice] Recorder state:", mediaRecorderRef.current?.state)

    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current)
      recordTimeoutRef.current = null
      console.log("[Voice] Cleared record timeout")
    }

    isRecordingRef.current = false

    if (mediaRecorderRef.current?.state === "recording") {
      console.log("[Voice] Calling recorder.stop()")
      mediaRecorderRef.current.stop()
    } else {
      console.log("[Voice] Recorder not in recording state, skip stop()")
    }
  }, [])

  // ── Continuous session loop (uses ref for isActive check) ────────────────────────────────
  const runContinuousLoop = useCallback(async () => {
    const loopId = Math.random().toString(36).slice(2, 6)
    console.log("[Voice] ========== LOOP START [", loopId, "] ==========")

    // Guard against parallel execution
    if (loopRunningRef.current) {
      console.log("[Voice] Loop [", loopId, "]: already running, skipping")
      return
    }
    loopRunningRef.current = true
    console.log("[Voice] Loop [", loopId, "]: loopRunningRef set to true")

    // Use ref, not state - avoids stale closure
    if (!isActiveRef.current) {
      console.log("[Voice] Loop [", loopId, "]: isActiveRef is FALSE, returning")
      loopRunningRef.current = false
      return
    }

    console.log("[Voice] Loop [", loopId, "]: starting recording...")
    await startRecording()

    // Wait for recording to stop (either timeout or manual)
    console.log("[Voice] Loop [", loopId, "]: waiting for recording to stop...")
    await new Promise<void>((resolve) => {
      const checkStopped = () => {
        if (mediaRecorderRef.current?.state !== "recording") {
          console.log("[Voice] Loop [", loopId, "]: recording stopped detected via polling")
          resolve()
        } else {
          setTimeout(checkStopped, 100)
        }
      }

      // Also resolve when recorder fires 'stop' event
      // Use addEventListener instead of mutating onstop (prevents race conditions)
      const recorder = mediaRecorderRef.current
      const onRecorderStop = () => {
        console.log("[Voice] Loop [", loopId, "]: recorder stop event fired")
        resolve()
      }
      if (recorder) {
        recorder.addEventListener("stop", onRecorderStop, { once: true })
      }
      checkStopped()

      // Cleanup listener if promise resolves via checkStopped
      return () => {
        recorder?.removeEventListener("stop", onRecorderStop)
      }
    })

    console.log("[Voice] Loop [", loopId, "]: recording stopped, checking state...")
    console.log("[Voice] Loop [", loopId, "]: isActiveRef:", isActiveRef.current)

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }

    if (!isActiveRef.current) {
      console.log("[Voice] Loop [", loopId, "]: session deactivated, exiting loop")
      loopRunningRef.current = false
      return
    }

    // Process the recording
    console.log("[Voice] Loop [", loopId, "]: processing recording...")
    await processRecording()

    if (!isActiveRef.current) {
      console.log("[Voice] Loop [", loopId, "]: session deactivated after processing, exiting loop")
      loopRunningRef.current = false
      return
    }

    // Continue loop after delay if continuous mode
    if (continuousRef.current && isActiveRef.current) {
      console.log("[Voice] Loop [", loopId, "]: scheduling next cycle in 100ms...")
      console.log("[Voice] Loop [", loopId, "]: continuous:", continuousRef.current)
      loopTimeoutRef.current = setTimeout(() => {
        console.log("[Voice] Loop [", loopId, "]: timeout fired, checking if should continue...")
        loopRunningRef.current = false
        if (isActiveRef.current) {
          console.log("[Voice] Loop [", loopId, "]: starting next iteration")
          runContinuousLoop()
        } else {
          console.log("[Voice] Loop [", loopId, "]: session no longer active, not continuing")
        }
      }, 100) // Reduced from 500ms for faster response
    } else {
      console.log(
        "[Voice] Loop [",
        loopId,
        "]: NOT continuing - continuous:",
        continuousRef.current,
        "active:",
        isActiveRef.current
      )
      loopRunningRef.current = false
      setPhase("idle")
    }
  }, [startRecording, processRecording])

  // ── Session controls ──────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    console.log("[Voice] ========== SESSION START REQUESTED ==========")
    console.log("[Voice] isSupported:", isSupported)
    console.log("[Voice] Current isActiveRef:", isActiveRef.current)
    console.log("[Voice] Current loopRunningRef:", loopRunningRef.current)

    if (!isSupported) {
      console.error("[Voice] Session NOT started - voice not supported")
      handleError("Voice not supported")
      return
    }
    if (isActiveRef.current || loopRunningRef.current) {
      console.log("[Voice] Session already active or loop running, skipping startSession")
      return // Already running
    }

    // Set ref FIRST (for immediate use in loop)
    isActiveRef.current = true
    // Then set state (for UI)
    setIsActive(true)
    setError(null)
    setTranscript("")

    // TODO: Should call clearLiveTokens() here if using live transcript display
    console.log(
      "[Voice] ⚠️ NOTE: clearLiveTokens() should be called here if using live transcript context"
    )

    console.log("[Voice] Session started, isActiveRef:", isActiveRef.current)

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
    console.log("[Voice] ========== SESSION STOPPING ==========")
    console.log("[Voice] Stop called from:", new Error().stack?.split("\n")[2] || "unknown")
    console.log(
      "[Voice] Current state - isActive:",
      isActiveRef.current,
      "loopRunning:",
      loopRunningRef.current
    )

    // Set ref first
    isActiveRef.current = false
    loopRunningRef.current = false
    // Then state
    setIsActive(false)

    // Clear timeouts
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current)
      recordTimeoutRef.current = null
      console.log("[Voice] Cleared recordTimeout")
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
      console.log("[Voice] Cleared loopTimeout")
    }

    // Stop silence detector
    if (silenceDetectorRef.current) {
      silenceDetectorRef.current.stop()
      silenceDetectorRef.current = null
      console.log("[Voice] Stopped silence detector")
    }

    // Stop recorder
    if (mediaRecorderRef.current?.state === "recording") {
      console.log("[Voice] Stopping recorder (was recording)")
      mediaRecorderRef.current.stop()
    } else {
      console.log("[Voice] Recorder state:", mediaRecorderRef.current?.state || "null")
    }

    // Stop mic
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      console.log("[Voice] Stopping", tracks.length, "media tracks")
      tracks.forEach((t) => t.stop())
      streamRef.current = null
    }

    // Stop TTS
    stopSpeaking()
    console.log("[Voice] Stopped speaking")

    // Abort any pending stream request
    if (streamAbortRef.current) {
      streamAbortRef.current.abort()
      streamAbortRef.current = null
      console.log("[Voice] Aborted stream request")
    }

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
      audioContextRef.current = null
      console.log("[Voice] AudioContext closed")
    }

    setPhase("idle")
    setTranscript("")
    console.log("[Voice] ========== SESSION STOPPED ==========")
  }, [stopSpeaking])

  // ── Cleanup on unmount ──────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      console.log("[Voice] Cleanup: unmounting, stopping all resources")

      // Clear all timeouts
      if (recordTimeoutRef.current) clearTimeout(recordTimeoutRef.current)
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)

      // Abort all controllers
      streamAbortRef.current?.abort()
      ttsAbortRef.current?.abort()

      // Close AudioContext
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close()
      }

      // Stop media stream
      streamRef.current?.getTracks().forEach((t) => t.stop())

      // Cancel browser SpeechSynthesis
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

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
