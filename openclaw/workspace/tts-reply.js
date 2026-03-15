#!/usr/bin/env node
/**
 * TTS Reply Generator for Nova
 * Usage: node tts-reply.js "Your text to speak"
 * Output: Path to MP3 file in workspace
 */

const fs = require("node:fs")
const path = require("node:path")

// Get text from command line
const text = process.argv[2]
if (!text) {
  console.error('Usage: node tts-reply.js "text to speak"')
  process.exit(1)
}

// Config
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM" // Rachel
const OUTPUT_DIR = "/Users/ahmadabdullah/xmad-control/openclaw/workspace"

if (!ELEVENLABS_API_KEY) {
  console.error("ELEVENLABS_API_KEY not set")
  process.exit(1)
}

// Generate output path
const outputPath = path.join(OUTPUT_DIR, `nova-reply-${Date.now()}.mp3`)

async function generateTTS() {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} - ${error}`)
    }

    // Stream to file
    const writer = fs.createWriteStream(outputPath)
    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      writer.write(Buffer.from(value))
    }

    writer.end()

    // Auto-delete after 60 seconds
    setTimeout(() => {
      fs.unlink(outputPath, () => console.log(`[TTS] Auto-deleted: ${outputPath}`))
    }, 60000)

    // Output the path for Nova to use
    console.log(outputPath)
  } catch (error) {
    console.error("TTS Error:", error.message)
    process.exit(1)
  }
}

generateTTS()
