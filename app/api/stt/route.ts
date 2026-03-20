import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getGroqKey(): string {
  return process.env.GROQ_API_KEY || process.env.SSOT_AI_GROQ || process.env.SSOT_GROQ_API_KEY || ""
}

export async function GET() {
  const key = getGroqKey()
  return NextResponse.json({ ok: true, available: !!key })
}

export async function POST(req: Request) {
  const apiKey = getGroqKey()
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Groq API key not configured. Add GROQ_API_KEY to Vercel env." },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File | null
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
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
      return NextResponse.json(
        { ok: false, error: `Groq API error: ${response.status}` },
        { status: 500 }
      )
    }

    const result = (await response.json()) as { text: string; duration?: number; language?: string }
    return NextResponse.json({
      ok: true,
      text: result.text,
      duration: result.duration,
      language: result.language,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
