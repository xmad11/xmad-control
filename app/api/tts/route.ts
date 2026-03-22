import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

// Deepgram voice options (Aura models)
const DEEPGRAM_VOICES = {
  "aura-asteria-en": "aura-asteria-en", // Female, natural
  "aura-luna-en": "aura-luna-en", // Female, warm
  "aura-stella-en": "aura-stella-en", // Female, bright
  "aura-athena-en": "aura-athena-en", // Female, calm
  "aura-hera-en": "aura-hera-en", // Female, authoritative
  "aura-orion-en": "aura-orion-en", // Male, natural
  "aura-arcas-en": "aura-arcas-en", // Male, deep
  "aura-perseus-en": "aura-perseus-en", // Male, warm
  "aura-helios-en": "aura-helios-en", // Male, bright
  "aura-zeus-en": "aura-zeus-en", // Male, authoritative
} as const

const DEFAULT_DEEPGRAM_VOICE = "aura-asteria-en"
const DEFAULT_ELEVENLABS_VOICE = "21m00Tcm4TlvDq8ikWAM"

function getDeepgramKey(): string {
  return (
    process.env.SSOT_VOICE_DEEPGRAM || process.env.DEEPGRAM_API_KEY || process.env.DG_API_KEY || ""
  )
}

function getElevenLabsKey(): string {
  return (
    process.env.ELEVENLABS_API_KEY ||
    process.env.SSOT_TTS_ELEVENLABS ||
    process.env.SSOT_ELEVENLABS_API_KEY ||
    ""
  )
}

export async function GET() {
  const deepgramKey = getDeepgramKey()
  const elevenLabsKey = getElevenLabsKey()
  return NextResponse.json({
    ok: true,
    available: !!(deepgramKey || elevenLabsKey),
    primaryProvider: deepgramKey ? "deepgram" : elevenLabsKey ? "elevenlabs" : "none",
    defaultVoice: deepgramKey ? DEFAULT_DEEPGRAM_VOICE : DEFAULT_ELEVENLABS_VOICE,
    voices: {
      deepgram: Object.keys(DEEPGRAM_VOICES),
      elevenlabs: ["21m00Tcm4TlvDq8ikWAM", "AZnzlk1XWNv7e4KIX5tO", "EXAVITQu4vrWxnsgxmL1"],
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      text: string
      voiceId?: string
      provider?: "deepgram" | "elevenlabs"
    }
    const { text, voiceId, provider } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ ok: false, error: "Text is required" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Text too long (max 5000 characters)" },
        { status: 400 }
      )
    }

    // Try Deepgram first (has $200 free credit), fallback to ElevenLabs
    const deepgramKey = getDeepgramKey()
    const elevenLabsKey = getElevenLabsKey()

    // If provider explicitly specified, use that
    if (provider === "elevenlabs" && elevenLabsKey) {
      return await callElevenLabs(text, voiceId || DEFAULT_ELEVENLABS_VOICE, elevenLabsKey)
    }

    if (provider === "deepgram" && deepgramKey) {
      return await callDeepgram(text, voiceId || DEFAULT_DEEPGRAM_VOICE, deepgramKey)
    }

    // Auto: Try Deepgram first, then ElevenLabs (with fallback)
    if (deepgramKey) {
      try {
        return await callDeepgram(text, voiceId || DEFAULT_DEEPGRAM_VOICE, deepgramKey)
      } catch (e) {
        console.error("[TTS] Deepgram failed, trying ElevenLabs fallback:", e)
        // Fall through to ElevenLabs
      }
    }

    if (elevenLabsKey) {
      return await callElevenLabs(text, voiceId || DEFAULT_ELEVENLABS_VOICE, elevenLabsKey)
    }

    return NextResponse.json(
      {
        ok: false,
        error: "No TTS API key configured. Add SSOT_VOICE_DEEPGRAM or ELEVENLABS_API_KEY.",
      },
      { status: 500 }
    )
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

async function callDeepgram(text: string, voice: string, apiKey: string): Promise<Response> {
  const model = voice in DEEPGRAM_VOICES ? voice : DEFAULT_DEEPGRAM_VOICE
  const response = await fetch(`https://api.deepgram.com/v1/speak?model=${model}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    console.error(`Deepgram TTS error ${response.status}:`, errorText)
    return new Response(
      JSON.stringify({ ok: false, error: `Deepgram API error: ${response.status}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  const audioBuffer = await response.arrayBuffer()
  return new Response(audioBuffer, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" },
  })
}

async function callElevenLabs(text: string, voiceId: string, apiKey: string): Promise<Response> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    return new Response(
      JSON.stringify({ ok: false, error: `ElevenLabs API error: ${response.status}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  const audioBuffer = await response.arrayBuffer()
  return new Response(audioBuffer, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" },
  })
}
