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

    console.log("[STT API] Deepgram request:", {
      name: audioFile?.name,
      size: audioFile?.size,
      type: audioFile?.type,
      language,
    })

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ ok: false, error: "No audio file provided" }, { status: 400 })
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
    sttUrl.searchParams.set("model", "nova-3") // Fastest model
    sttUrl.searchParams.set("language", language)
    sttUrl.searchParams.set("punctuate", "true")
    sttUrl.searchParams.set("smart_format", "true")

    const response = await fetch(sttUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": audioFile.type || "audio/webm",
      },
      body: audioFile,
      signal: AbortSignal.timeout(15000), // 15s timeout for edge runtime
    })

    console.log("[STT API] Deepgram response:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[STT API] Deepgram error:", errorText)
      return NextResponse.json(
        { ok: false, error: `Deepgram error: ${response.status}` },
        { status: 500 }
      )
    }

    const result = await response.json()
    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ||
      result?.results?.utterances?.map((u: any) => u.transcript).join(" ") ||
      ""

    console.log("[STT API] Deepgram transcript:", transcript?.slice(0, 100))

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
