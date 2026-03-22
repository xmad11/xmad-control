import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getGroqKey(): string {
  return process.env.GROQ_API_KEY || process.env.SSOT_AI_GROQ || process.env.SSOT_GROQ_API_KEY || ""
}

export async function GET() {
  const key = getGroqKey()
  return NextResponse.json({ ok: true, available: !!key, keyPresent: !!key })
}

export async function POST(req: Request) {
  console.log("[STT API] ========== REQUEST STARTED ==========")

  const apiKey = getGroqKey()
  console.log("[STT API] API Key present:", !!apiKey)

  if (!apiKey) {
    console.log("[STT API] ERROR: No API key configured")
    return NextResponse.json(
      { ok: false, error: "Groq API key not configured. Add GROQ_API_KEY to Vercel env." },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File | null
    const language = (formData.get("language") as string) || "en"

    console.log("[STT API] Audio file received:", {
      name: audioFile?.name,
      size: audioFile?.size,
      type: audioFile?.type,
      language,
    })

    if (!audioFile) {
      console.log("[STT API] ERROR: No audio file in request")
      return NextResponse.json({ ok: false, error: "No audio file provided" }, { status: 400 })
    }

    if (audioFile.size === 0) {
      console.log("[STT API] ERROR: Audio file is empty")
      return NextResponse.json({ ok: false, error: "Audio file is empty" }, { status: 400 })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      console.log("[STT API] ERROR: Audio file too large:", audioFile.size)
      return NextResponse.json(
        { ok: false, error: "Audio file too large (max 25MB)" },
        { status: 400 }
      )
    }

    console.log("[STT API] Sending to Groq Whisper...")

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

    console.log("[STT API] Groq response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[STT API] Groq error:", errorText)
      return NextResponse.json(
        { ok: false, error: `Groq API error: ${response.status} - ${errorText}` },
        { status: 500 }
      )
    }

    const result = (await response.json()) as { text: string; duration?: number; language?: string }
    console.log("[STT API] Success! Transcript:", result.text?.slice(0, 100))

    return NextResponse.json({
      ok: true,
      text: result.text,
      duration: result.duration,
      language: result.language,
    })
  } catch (err) {
    console.error("[STT API] EXCEPTION:", err)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
