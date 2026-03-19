/* ═══════════════════════════════════════════════════════════════════════════════
   STT API ROUTE
   Speech-to-Text using Groq Whisper API

   POST /api/stt
   Body: FormData with audio file

   Response: { ok: boolean, text?: string, error?: string }
   ═══════════════════════════════════════════════════════════════════════════════ */

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface STTResponse {
  ok: boolean
  text?: string
  duration?: number
  language?: string
  error?: string
}

/**
 * Get Groq API key from Keychain via environment
 * The key is loaded by scripts/load-secrets.sh
 */
function getGroqApiKey(): string | null {
  // Check environment first (loaded by load-secrets.sh)
  const envKey = process.env.GROQ_API_KEY
  if (envKey) return envKey

  // Fallback to direct keychain read (macOS only)
  return null
}

/**
 * POST /api/stt
 * Transcribe audio using Groq Whisper
 */
export async function POST(req: Request): Promise<NextResponse<STTResponse>> {
  try {
    const apiKey = getGroqApiKey()
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Groq API key not configured" }, { status: 500 })
    }

    // Parse multipart form data
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File | null
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
      return NextResponse.json({ ok: false, error: "No audio file provided" }, { status: 400 })
    }

    // Validate file size (max 25MB for Whisper)
    const MAX_SIZE = 25 * 1024 * 1024
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, error: "Audio file too large (max 25MB)" },
        { status: 400 }
      )
    }

    // Prepare form data for Groq API
    const groqFormData = new FormData()
    groqFormData.append("file", audioFile)
    groqFormData.append("model", "whisper-large-v3-turbo")
    groqFormData.append("language", language)
    groqFormData.append("response_format", "json")

    // Call Groq Whisper API
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[STT] Groq API error:", errorText)
      return NextResponse.json(
        { ok: false, error: `Groq API error: ${response.status}` },
        { status: 500 }
      )
    }

    const result = (await response.json()) as {
      text: string
      duration?: number
      language?: string
    }

    return NextResponse.json({
      ok: true,
      text: result.text,
      duration: result.duration,
      language: result.language,
    })
  } catch (err) {
    console.error("[STT] Error:", err)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

/**
 * GET /api/stt
 * Health check for STT service
 */
export async function GET(): Promise<NextResponse<{ ok: boolean; available: boolean }>> {
  const apiKey = getGroqApiKey()
  return NextResponse.json({
    ok: true,
    available: !!apiKey,
  })
}
