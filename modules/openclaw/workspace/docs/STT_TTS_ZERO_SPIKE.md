# OpenClaw STT/TTS Integration - Zero Spike Architecture

**Created**: 2026-03-13
**Status**: Implemented and Documented

---

## Overview

OpenClaw now has **zero-spike** Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities using:
- **Groq Whisper** for STT (fastest, streams audio directly)
- **ElevenLabs** for TTS (streaming, never buffered in RAM)

**Memory cost**: ~0 spike — all data piped, never held in heap.

---

## Architecture

```
WhatsApp voice → OpenClaw → stream to Groq → text
text → Nova → stream to ElevenLabs → pipe mp3 → WhatsApp

Browser mic → Next.js API → stream to Groq → text
text → Next.js API → stream from ElevenLabs → browser plays
```

### Why This Won't Spike Memory

| Old Approach | New Approach |
|--------------|--------------|
| Read full audio file into Buffer | Pipe file chunks directly |
| Hold MP3 in Node heap | Pipe ElevenLabs stream straight to response |
| Local ffmpeg conversion | No conversion — webm sent as-is |
| ElevenLabs SDK (loads deps) | Raw `fetch` only |
| Browser buffers AudioContext | Blob URL → native `<audio>` element |

**Result**: Only JSON transcript (~50 bytes) held in RAM. Everything else streams.

---

## Installation

### 1. Core Package

```bash
cd ~/xmad/xmad-core/packages/stt-tts
npm install
```

### 2. Load Keys (SSOT from Keychain)

```bash
source ~/xmad/scripts/load-secrets.sh
```

This loads:
- `GROQ_API_KEY` (from `SSOT_AI_GROQ`)
- `ELEVENLABS_API_KEY` (from `SSOT_TTS_ELEVENLABS`)
- Optional: `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`

---

## Usage

### In Node.js (OpenClaw / XMAD)

```javascript
const { transcribe, speak, speakToFile } = require("@xmad/stt-tts");

// STT: Transcribe audio file (streams, no spike)
const text = await transcribe("/path/to/audio.ogg", "en");
console.log(text);

// TTS: Stream to file
const fs = require("fs");
await speak("Hello world", fs.createWriteStream("/tmp/reply.mp3"));

// TTS: Auto-temp file (for WhatsApp/OpenClaw)
const tmpPath = await speakToFile("Reply text here");
// Send tmpPath via WhatsApp, auto-deleted after 60s
```

### For OpenClaw WhatsApp Integration

When a voice message arrives:

```javascript
// 1. Transcribe incoming voice
const userText = await transcribe(voiceFilePath);

// 2. Process with Nova
const replyText = await nova.generate(userText);

// 3. Send voice reply
const voiceReplyPath = await speakToFile(replyText);
await whatsapp.sendAudio(voiceReplyPath);

// File auto-deleted after 60s
```

---

## Environment Variables

### Required (from Keychain)

```bash
GROQ_API_KEY=xxx              # Groq Whisper (SSOT_AI_GROQ)
ELEVENLABS_API_KEY=xxx        # ElevenLabs TTS (SSOT_TTS_ELEVENLABS)
```

### Optional (customizable)

```bash
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel (default)
ELEVENLABS_MODEL_ID=eleven_turbo_v2_5     # Fast model
GROQ_WHISPER_MODEL=whisper-large-v3-turbo # Fast & accurate
```

---

## Supported Audio Formats

**STT (Groq Whisper)**:
- OGG, OPUS, MP3, WAV, WEBM, FLAC, M4A, MP4

**TTS (ElevenLabs)**:
- Output: MP3 (44.1kHz, 128kbps) - optimized for voice

---

## API Reference

### `transcribe(audioFilePath, language = "en")`

Transcribes an audio file using Groq Whisper.

**Parameters**:
- `audioFilePath` (string): Path to audio file
- `language` (string): Language code (default: "en")

**Returns**: Promise<string> - Transcript text

**Example**:
```javascript
const text = await transcribe("/tmp/message.ogg", "en");
```

### `speak(text, writableStream, opts = {})`

Converts text to speech and streams to writable stream.

**Parameters**:
- `text` (string): Text to speak (max 5000 chars)
- `writableStream` (WritableStream): Destination stream
- `opts` (object):
  - `voiceId` (string): ElevenLabs voice ID
  - `modelId` (string): Model ID
  - `stability` (number): 0-1 (default: 0.4)
  - `similarity_boost` (number): 0-1 (default: 0.8)
  - `style` (number): 0-1 (default: 0.0)
  - `outputFormat` (string): MP3 format (default: "mp3_44100_128")

**Returns**: Promise<void>

**Example**:
```javascript
const fs = require("fs");
await speak("Hello", fs.createWriteStream("/tmp/hello.mp3"), {
  voiceId: "21m00Tcm4TlvDq8ikWAM"
});
```

### `speakToFile(text, opts = {})`

Convenience function: speaks to a temp file, returns path.

**Parameters**:
- `text` (string): Text to speak
- `opts` (object): Same as `speak()`

**Returns**: Promise<string> - Temp file path (auto-deleted after 60s)

**Example**:
```javascript
const path = await speakToFile("Reply text");
// Use path, then auto-deleted
```

### `checkKeys()`

Health check for API keys.

**Returns**: Promise<object>
```javascript
{
  groq: true,
  elevenlabs: true,
  groqReachable: true,
  voiceId: "21m00Tcm4TlvDq8ikWAM",
  model: "whisper-large-v3-turbo"
}
```

---

## Testing

### Test STT

```bash
# Load keys
source ~/xmad/scripts/load-secrets.sh

# Test transcribe
node -e "
const { transcribe } = require('./xmad/xmad-core/packages/stt-tts/index.js');
transcribe('/path/to/test.ogg').then(console.log).catch(console.error);
"
```

### Test TTS

```bash
# Load keys
source ~/xmad/scripts/load-secrets.sh

# Test speak
node -e "
const { speakToFile } = require('./xmad/xmad-core/packages/stt-tts/index.js');
speakToFile('Hello world').then(path => console.log('Saved:', path)).catch(console.error);
"
```

### Health Check

```bash
node -e "
const { checkKeys } = require('./xmad/xmad-core/packages/stt-tts/index.js');
checkKeys().then(console.log).catch(console.error);
"
```

---

## Files Created

| File | Purpose |
|------|---------|
| `~/xmad/xmad-core/packages/stt-tts/index.js` | Core STT/TTS module |
| `~/xmad/xmad-core/packages/stt-tts/package.json` | Package config |
| `~/xmad/xmad-core/packages/stt-tts/README.md` | Package documentation |
| `~/xmad/scripts/load-secrets.sh` | Key loading script (SSOT) |
| `~/.openclaw/workspace/docs/STT_TTS_ZERO_SPIKE.md` | This file |

---

## Key Loading (SSOT)

All keys loaded from macOS Keychain via `~/xmad/scripts/load-secrets.sh`:

```bash
# Groq (STT)
SSOT_AI_GROQ → GROQ_API_KEY

# ElevenLabs (TTS)
SSOT_TTS_ELEVENLABS → ELEVENLABS_API_KEY
```

**No hardcoded keys. No .env files.**

---

## Next.js Integration (TODO)

For browser-based voice chat, create these API routes:

### `/api/stt/route.ts`
- Receives audio from browser (webm/ogg)
- Streams to Groq
- Returns transcript

### `/api/tts/route.ts`
- Receives text
- Streams from ElevenLabs
- Returns audio stream

### `use-voice.ts` Hook
- Browser mic → `/api/stt`
- Text → `/api/tts` → `<audio>` element

See the original plan for full implementation details.

---

## Troubleshooting

### Key Not Found

```bash
# Check if keys exist in Keychain
security find-generic-password -s "SSOT_AI_GROQ" -w
security find-generic-password -s "SSOT_TTS_ELEVENLABS" -w
```

### Groq Timeout

- Check internet connection
- Verify Groq API key is valid
- Try a smaller audio file

### ElevenLabs Error

- Check API key balance
- Verify voice ID exists
- Text may be too long (max 5000 chars)

---

## Performance

| Metric | Value |
|--------|-------|
| STT Latency | ~1-2s (Groq Whisper) |
| TTS Latency | ~500ms (ElevenLabs streaming) |
| Memory Spike | ~0 (streaming) |
| Max Audio Size | 25MB (Groq limit) |
| Max Text Length | 5000 chars (ElevenLabs limit) |

---

## References

- Groq Whisper API: https://api.groq.com/openai/v1/audio/transcriptions
- ElevenLabs Streaming: https://elevenlabs.io/docs/text-to-speech/streaming
- SSOT Keys Guide: `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md`

---

**Maintained By**: Nova
**Last Updated**: 2026-03-13
