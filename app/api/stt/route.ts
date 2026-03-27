import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

// Deepgram STT - Ultra-fast streaming-capable speech-to-text
function getDeepgramKey(): string {
  return (
    process.env.SSOT_VOICE_DEEPGRAM || process.env.DEEPGRAM_API_KEY || process.env.DG_API_KEY || ""
  )
}

// Fallback to Groq if Deepgram not configured
function getGroqKey(): string {
  return process.env.GROQ_API_KEY || process.env.SSOT_AI_GROQ || ""
}

export async function GET() {
  const deepgramKey = getDeepgramKey()
  const groqKey = getGroqKey()
  return NextResponse.json({
    ok: true,
    available: !!(deepgramKey || groqKey),
    primaryProvider: deepgramKey ? "deepgram" : groqKey ? "groq" : "none",
  })
}

export async function POST(req: NextRequest) {
  console.log("[STT API] ========== REQUEST STARTED ==========")

  const deepgramKey = getDeepgramKey()
  const groqKey = getGroqKey()

  // Prefer Deepgram for ultra-fast STT
  if (deepgramKey) {
    return await handleDeepgram(req, deepgramKey)
  }

  // Fallback to Groq
  if (groqKey) {
    return await handleGroq(req, groqKey)
  }

  return NextResponse.json(
    { ok: false, error: "No STT API key configured. Add DEEPGRAM_API_KEY or GROQ_API_KEY." },
    { status: 500 }
  )
}

async function handleDeepgram(req: NextRequest, apiKey: string): Promise<Response> {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File | null
    const language = (formData.get("language") as string) || "en-US"

    const requestStartTime = Date.now()
    console.log("[STT API] ========== DEEPGRAM REQUEST START ==========")
    console.log(
      "[STT API] Blob size:",
      audioFile?.size,
      "bytes (",
      (audioFile?.size || 0) / 1024,
      "KB)"
    )
    console.log("[STT API] File type:", audioFile?.type)
    console.log("[STT API] File name:", audioFile?.name)
    console.log("[STT API] Language:", language)

    if (!audioFile || audioFile.size === 0) {
      console.error("[STT API] ERROR: No audio file provided")
      return NextResponse.json({ ok: false, error: "No audio file provided" }, { status: 400 })
    }

    // MINIMUM SIZE GUARD - Reject blobs < 20KB (likely too short to transcribe)
    if (audioFile.size < 20 * 1024) {
      console.warn(
        "[STT API] WARNING: Blob too small (",
        audioFile.size,
        "bytes < 20KB) - likely silence or too short"
      )
      return NextResponse.json(
        {
          ok: false,
          error: `Audio too short (${audioFile.size} bytes). Please speak longer.`,
          tooShort: true,
        },
        { status: 400 }
      )
    }

    // File size validation (Deepgram limit is ~25MB)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Audio file too large (max 25MB)" },
        { status: 400 }
      )
    }

    // Deepgram STT endpoint with ultra-low latency settings
    const sttUrl = new URL("https://api.deepgram.com/v1/listen")
    sttUrl.searchParams.set("model", "nova-2") // Latest stable model
    sttUrl.searchParams.set("language", language)
    sttUrl.searchParams.set("punctuate", "true")
    sttUrl.searchParams.set("smart_format", "true")
    sttUrl.searchParams.set("utterances", "true") // Better speech segmentation
    sttUrl.searchParams.set("vad_events", "true") // Voice activity detection events
    sttUrl.searchParams.set("endpointing", "300") // 300ms endpoint for faster detection

    // Strip codecs from MIME type (Deepgram doesn't like "audio/webm;codecs=opus")
    const cleanMimeType = (audioFile.type || "audio/webm").split(";")[0]
    console.log("[STT API] Cleaned MIME type:", cleanMimeType, "(original:", audioFile.type, ")")

    // CRITICAL: Convert File to ArrayBuffer - Deepgram REST expects raw bytes, not File object
    const audioBuffer = await audioFile.arrayBuffer()
    console.log("[STT API] Converted to ArrayBuffer:", audioBuffer.byteLength, "bytes")

    const response = await fetch(sttUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": cleanMimeType,
      },
      body: audioBuffer,
      signal: AbortSignal.timeout(15000), // 15s timeout for edge runtime
    })

    const deepgramResponseTime = Date.now()
    console.log(
      "[STT API] Deepgram HTTP status:",
      response.status,
      "| Time:",
      deepgramResponseTime - requestStartTime,
      "ms"
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[STT API] ========== DEEPGRAM ERROR ==========")
      console.error("[STT API] HTTP Status:", response.status)
      console.error("[STT API] Error body:", errorText)
      console.error("[STT API] Request URL was:", sttUrl.toString())
      console.error("[STT API] Content-Type sent:", audioFile.type || "audio/webm")
      console.error("[STT API] File size:", audioFile.size, "bytes")

      // Try to parse the error for more details
      let errorDetails = errorText
      try {
        const parsed = JSON.parse(errorText)
        errorDetails = JSON.stringify(parsed, null, 2)
        console.error("[STT API] Parsed error:", errorDetails)
      } catch {}

      return NextResponse.json(
        {
          ok: false,
          error: `Deepgram error: ${response.status}`,
          details: errorText.slice(0, 500), // Include actual error for debugging
        },
        { status: 500 }
      )
    }

    const result = await response.json()
    const parseTime = Date.now()
    console.log("[STT API] ========== DEEPGRAM RAW RESPONSE ==========")
    console.log("[STT API] Full response:", JSON.stringify(result, null, 2))
    console.log("[STT API] Parse time:", parseTime - deepgramResponseTime, "ms")

    // Extract transcript from multiple possible paths
    const channelTranscript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript
    const utteranceTranscript = result?.results?.utterances?.map((u: any) => u.transcript).join(" ")
    const transcript = channelTranscript || utteranceTranscript || ""

    console.log("[STT API] Channel transcript:", channelTranscript?.slice(0, 100) || "(empty)")
    console.log("[STT API] Utterance transcript:", utteranceTranscript?.slice(0, 100) || "(empty)")
    console.log("[STT API] Final transcript:", transcript?.slice(0, 100) || "(empty)")

    if (!transcript || transcript.trim() === "") {
      console.warn("[STT API] ========== EMPTY TRANSCRIPT WARNING ==========")
      console.warn("[STT API] Blob size was:", audioFile.size, "bytes")
      console.warn("[STT API] File type was:", audioFile.type)
      console.warn(
        "[STT API] Full Deepgram response for debugging:",
        JSON.stringify(result, null, 2)
      )
      console.warn("[STT API] Check: channels exist?", !!result?.results?.channels)
      console.warn(
        "[STT API] Check: alternatives exist?",
        !!result?.results?.channels?.[0]?.alternatives
      )
      console.warn("[STT API] Check: utterances exist?", !!result?.results?.utterances)
    }

    console.log("[STT API] Total request time:", Date.now() - requestStartTime, "ms")

    // Return tokens for live transcript support
    const tokens = transcript.split(" ").filter(Boolean)

    return NextResponse.json({
      ok: true,
      text: transcript,
      tokens, // For live transcript callback
    })
  } catch (err) {
    console.error("[STT API] Deepgram exception:", err)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

async function handleGroq(req: NextRequest, apiKey: string): Promise<Response> {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File | null
    const language = (formData.get("language") as string) || "en"

    console.log("[STT API] Groq request:", {
      name: audioFile?.name,
      size: audioFile?.size,
    })

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ ok: false, error: "No audio file provided" }, { status: 400 })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Audio file too large (max 25MB)" },
        { status: 400 }
      )
    }

    const groqFormData = new FormData()
    groqFormData.append("file", audioFile)
    groqFormData.append("model", "whisper-large-v3-turbo")
    groqFormData.append("language", language)
    groqFormData.append("response_format", "json")

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: groqFormData,
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      await response.text() // Consume error body
      return NextResponse.json(
        { ok: false, error: `Groq API error: ${response.status}` },
        { status: 500 }
      )
    }

    const result = (await response.json()) as { text: string }
    const tokens = result.text?.split(" ").filter(Boolean) || []

    return NextResponse.json({
      ok: true,
      text: result.text,
      tokens,
    })
  } catch (err) {
    console.error("[STT API] Groq exception:", err)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
