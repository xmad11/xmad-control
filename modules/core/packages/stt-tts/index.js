const https = require("node:https")
const _http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")
const os = require("node:os")
const crypto = require("node:crypto")

// ─── Config ──────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ""

// ElevenLabs voice ID — "Rachel" is natural, low-latency
// Change to any voice ID from your ElevenLabs account
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_turbo_v2_5"

// Groq Whisper model — large-v3-turbo is fastest with high accuracy
const GROQ_WHISPER_MODEL = process.env.GROQ_WHISPER_MODEL || "whisper-large-v3-turbo"

// ─── Helpers ─────────────────────────────────────────────

function httpsRequest(opts, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      resolve(res) // caller reads the stream
    })
    req.on("error", reject)
    req.setTimeout(30000, () => {
      req.destroy()
      reject(new Error("Request timeout"))
    })
    if (body) req.write(body)
    req.end()
  })
}

// Build a multipart/form-data boundary — pure string/buffer ops, no disk I/O
function buildMultipart(fields, fileField, filePath, mimeType) {
  const boundary = `----GW${crypto.randomBytes(16).toString("hex")}`

  const parts = []

  // Text fields
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
        `${value}\r\n`
    )
  }

  // File field header
  const filename = path.basename(filePath)
  const fileHeader =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="${fileField}"; filename="${filename}"\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n`

  const footer = `\r\n--${boundary}--\r\n`

  const fileSize = fs.statSync(filePath).size
  const headerBuf = Buffer.from(parts.join("") + fileHeader, "utf8")
  const footerBuf = Buffer.from(footer, "utf8")
  const totalSize = headerBuf.length + fileSize + footerBuf.length

  return { boundary, headerBuf, footerBuf, totalSize }
}

// ─── STT: Groq Whisper ────────────────────────────────────
//
// Streams the audio file directly to Groq.
// The file is piped in chunks — never fully loaded into RAM.
// Returns the transcript string.

async function transcribe(audioFilePath, language = "en") {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not set")
  if (!fs.existsSync(audioFilePath)) throw new Error(`Audio file not found: ${audioFilePath}`)

  // Detect mime type from extension
  const ext = path.extname(audioFilePath).toLowerCase()
  const mimeTypes = {
    ".ogg": "audio/ogg",
    ".opus": "audio/opus",
    ".mp3": "audio/mpeg",
    ".mp4": "audio/mp4",
    ".m4a": "audio/mp4",
    ".wav": "audio/wav",
    ".webm": "audio/webm",
    ".flac": "audio/flac",
  }
  const mimeType = mimeTypes[ext] || "audio/ogg"

  const { boundary, headerBuf, footerBuf, totalSize } = buildMultipart(
    {
      model: GROQ_WHISPER_MODEL,
      response_format: "json",
      language,
    },
    "file",
    audioFilePath,
    mimeType
  )

  const opts = {
    hostname: "api.groq.com",
    path: "/openai/v1/audio/transcriptions",
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": totalSize,
    },
  }

  // Stream: write header → pipe file → write footer
  const res = await new Promise((resolve, reject) => {
    const req = https.request(opts, resolve)
    req.on("error", reject)
    req.setTimeout(30000, () => {
      req.destroy()
      reject(new Error("Groq timeout"))
    })

    req.write(headerBuf)
    const fileStream = fs.createReadStream(audioFilePath, { highWaterMark: 64 * 1024 })
    fileStream.on("data", (chunk) => req.write(chunk))
    fileStream.on("end", () => {
      req.write(footerBuf)
      req.end()
    })
    fileStream.on("error", reject)
  })

  // Read response — it's tiny JSON, fine to buffer
  const body = await new Promise((resolve, reject) => {
    let data = ""
    res.on("data", (c) => {
      data += c
    })
    res.on("end", () => resolve(data))
    res.on("error", reject)
  })

  if (res.statusCode !== 200) {
    throw new Error(`Groq STT error ${res.statusCode}: ${body}`)
  }

  const parsed = JSON.parse(body)
  return parsed.text?.trim() || ""
}

// ─── TTS: ElevenLabs Streaming ────────────────────────────
//
// Requests TTS audio as a stream.
// Pipes directly to the destination (file, HTTP response, etc.)
// Never holds the audio in RAM.
//
// Usage:
//   await speak("Hello world", writableStream);
//   await speak("Hello world", fs.createWriteStream("/tmp/reply.mp3"));

async function speak(text, writableStream, opts = {}) {
  if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY not set")
  if (!text || !text.trim()) throw new Error("No text provided")

  const voiceId = opts.voiceId || ELEVENLABS_VOICE_ID
  const modelId = opts.modelId || ELEVENLABS_MODEL_ID

  const body = JSON.stringify({
    text: text.slice(0, 5000), // ElevenLabs max
    model_id: modelId,
    voice_settings: {
      stability: opts.stability ?? 0.4,
      similarity_boost: opts.similarity_boost ?? 0.8,
      style: opts.style ?? 0.0,
      use_speaker_boost: true,
    },
    output_format: opts.outputFormat || "mp3_44100_128",
  })

  const reqOpts = {
    hostname: "api.elevenlabs.io",
    path: `/v1/text-to-speech/${voiceId}/stream`,
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
      "Content-Length": Buffer.byteLength(body),
    },
  }

  const res = await httpsRequest(reqOpts, body)

  if (res.statusCode !== 200) {
    // Read error body
    let errBody = ""
    for await (const chunk of res) errBody += chunk
    throw new Error(`ElevenLabs TTS error ${res.statusCode}: ${errBody.slice(0, 200)}`)
  }

  // Pipe audio stream directly to output — zero buffering
  return new Promise((resolve, reject) => {
    res.pipe(writableStream)
    writableStream.on("finish", resolve)
    writableStream.on("error", reject)
    res.on("error", reject)
  })
}

// Convenience: speak to a temp file, returns path
// Use this for WhatsApp — OpenClaw needs a file path to send
async function speakToFile(text, opts = {}) {
  const tmpPath = path.join(os.tmpdir(), `nova-tts-${Date.now()}.mp3`)
  const file = fs.createWriteStream(tmpPath)
  await speak(text, file, opts)

  // Schedule cleanup after 60s — file only needed long enough to send
  setTimeout(() => {
    fs.unlink(tmpPath, () => {})
  }, 60_000)

  return tmpPath
}

// ─── Health check ─────────────────────────────────────────

async function checkKeys() {
  const results = {
    groq: !!GROQ_API_KEY,
    elevenlabs: !!ELEVENLABS_API_KEY,
    voiceId: ELEVENLABS_VOICE_ID,
    model: GROQ_WHISPER_MODEL,
  }

  // Quick ping to Groq
  if (GROQ_API_KEY) {
    try {
      const res = await new Promise((resolve, reject) => {
        const req = https.request(
          {
            hostname: "api.groq.com",
            path: "/openai/v1/models",
            method: "GET",
            headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
            timeout: 5000,
          },
          resolve
        )
        req.on("error", reject)
        req.end()
      })
      results.groqReachable = res.statusCode === 200
    } catch {
      results.groqReachable = false
    }
  }

  return results
}

module.exports = { transcribe, speak, speakToFile, checkKeys }
