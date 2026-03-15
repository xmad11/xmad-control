# @xmad/stt-tts

**Zero-spike STT/TTS using Groq Whisper + ElevenLabs streaming**

## Features

- ✅ **STT**: Groq Whisper (fastest, streams audio directly)
- ✅ **TTS**: ElevenLabs streaming (never buffered in RAM)
- ✅ **Memory**: ~0 spike — all data piped, never held
- ✅ **Formats**: OGG, OPUS, MP3, WAV, WEBM, FLAC, M4A

## Installation

```bash
# Keys from Keychain (SSOT)
export GROQ_API_KEY=$(security find-generic-password -s "SSOT_AI_GROQ" -w)
export ELEVENLABS_API_KEY=$(security find-generic-password -s "SSOT_TTS_ELEVENLABS" -w)
```

## Usage

```javascript
const { transcribe, speak, speakToFile } = require("@xmad/stt-tts");

// STT: Transcribe audio file (streams, no spike)
const text = await transcribe("/path/to/audio.ogg");
console.log(text);

// TTS: Stream to file
await speak("Hello world", fs.createWriteStream("/tmp/reply.mp3"));

// TTS: Auto-temp file (for WhatsApp/OpenClaw)
const tmpPath = await speakToFile("Reply text");
// Send tmpPath, auto-deleted after 60s
```

## Environment Variables

```bash
GROQ_API_KEY=xxx              # Groq Whisper (from Keychain)
ELEVENLABS_API_KEY=xxx        # ElevenLabs TTS (from Keychain)
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel (default)
ELEVENLABS_MODEL_ID=eleven_turbo_v2_5     # Fast model
GROQ_WHISPER_MODEL=whisper-large-v3-turbo # Fast & accurate
```

## Memory Architecture

| Old Approach | New Approach |
|--------------|--------------|
| Read full audio into Buffer | Pipe file chunks directly |
| Hold MP3 in Node heap | Pipe stream straight to response |
| Local ffmpeg conversion | No conversion — webm as-is |
| ElevenLabs SDK (loads deps) | Raw `https` only |

**Result**: Only JSON transcript (~50 bytes) held in RAM. Everything else streams.

## Health Check

```javascript
const { checkKeys } = require("@xmad/stt-tts");
const status = await checkKeys();
console.log(status);
// { groq: true, elevenlabs: true, groqReachable: true, ... }
```

## License

MIT
