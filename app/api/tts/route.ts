import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

function getElevenLabsKey(): string {
  return (
    process.env.ELEVENLABS_API_KEY ||
    process.env.SSOT_TTS_ELEVENLABS ||
    process.env.SSOT_ELEVENLABS_API_KEY ||
    ""
  )
}

export async function GET() {
  const key = getElevenLabsKey()
  return NextResponse.json({ ok: true, available: !!key, defaultVoiceId: DEFAULT_VOICE_ID })
}

export async function POST(req: Request) {
  const apiKey = getElevenLabsKey()
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to Vercel env.",
      },
      { status: 500 }
    )
  }

  try {
    const body = (await req.json()) as {
      text: string
      voiceId?: string
      modelId?: string
      stability?: number
      similarityBoost?: number
    }
    const { text, voiceId = DEFAULT_VOICE_ID, modelId, stability, similarityBoost } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ ok: false, error: "Text is required" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Text too long (max 5000 characters)" },
        { status: 400 }
      )
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text,
        model_id: modelId || "eleven_turbo_v2_5",
        voice_settings: { stability: stability ?? 0.5, similarity_boost: similarityBoost ?? 0.75 },
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `ElevenLabs API error: ${response.status}` },
        { status: 500 }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    return new Response(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
