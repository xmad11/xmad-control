/* ═══════════════════════════════════════════════════════════════════════════════
   TTS API ROUTE
   Text-to-Speech using ElevenLabs API

   POST /api/tts
   Body: { text: string, voiceId?: string }

   Response: audio/mpeg stream
   ═══════════════════════════════════════════════════════════════════════════════ */

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Default voice ID (Rachel - a natural-sounding voice)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

interface TTSRequest {
  text: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

interface TTSErrorResponse {
  ok: false
  error: string
}

/**
 * Get ElevenLabs API key from Keychain via environment
 * The key is loaded by scripts/load-secrets.sh
 */
function getElevenLabsApiKey(): string | null {
  // Check environment first (loaded by load-secrets.sh)
  const envKey = process.env.ELEVENLABS_API_KEY
  if (envKey) return envKey

  return null
}

/**
 * POST /api/tts
 * Convert text to speech using ElevenLabs
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const apiKey = getElevenLabsApiKey()
    if (!apiKey) {
      return NextResponse.json<TTSErrorResponse>(
        { ok: false, error: "ElevenLabs API key not configured" },
        { status: 500 }
      )
    }

    const body = (await req.json()) as TTSRequest
    const { text, voiceId = DEFAULT_VOICE_ID, modelId, stability, similarityBoost } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json<TTSErrorResponse>(
        { ok: false, error: "Text is required" },
        { status: 400 }
      )
    }

    // Validate text length (ElevenLabs has limits)
    if (text.length > 5000) {
      return NextResponse.json<TTSErrorResponse>(
        { ok: false, error: "Text too long (max 5000 characters)" },
        { status: 400 }
      )
    }

    // Call ElevenLabs TTS API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId || "eleven_turbo_v2_5",
        voice_settings: {
          stability: stability ?? 0.5,
          similarity_boost: similarityBoost ?? 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[TTS] ElevenLabs API error:", errorText)
      return NextResponse.json<TTSErrorResponse>(
        { ok: false, error: `ElevenLabs API error: ${response.status}` },
        { status: 500 }
      )
    }

    // Stream audio back to client
    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err) {
    console.error("[TTS] Error:", err)
    return NextResponse.json<TTSErrorResponse>(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/tts
 * Health check and available voices
 */
export async function GET(): Promise<
  NextResponse<{ ok: boolean; available: boolean; defaultVoiceId: string }>
> {
  const apiKey = getElevenLabsApiKey()
  return NextResponse.json({
    ok: true,
    available: !!apiKey,
    defaultVoiceId: DEFAULT_VOICE_ID,
  })
}
