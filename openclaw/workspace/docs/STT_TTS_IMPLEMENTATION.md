# OpenClaw STT/TTS - Implementation Complete

**Date**: 2026-03-13
**Status**: ✅ **IMPLEMENTED & DOCUMENTED**

---

## 🎯 What Was Done

### 1. Core Package Created
**Location**: `~/xmad/xmad-core/packages/stt-tts/`

**Files**:
- `index.js` - Zero-spike STT/TTS implementation
- `package.json` - Package configuration
- `README.md` - Package documentation
- `test.js` - Health check script

**Features**:
- ✅ Groq Whisper STT (streaming, no memory spike)
- ✅ ElevenLabs TTS (streaming, never buffered)
- ✅ Zero memory spike architecture
- ✅ All audio piped, never held in RAM

### 2. Key Loading Script
**Location**: `~/xmad/scripts/load-secrets.sh`

**Purpose**: Loads SSOT keys from macOS Keychain

**Usage**:
```bash
source ~/xmad/scripts/load-secrets.sh
```

**Keys Loaded**:
- `GROQ_API_KEY` (from `SSOT_AI_GROQ`)
- `ELEVENLABS_API_KEY` (from `SSOT_TTS_ELEVENLABS`)
- Optional: OpenRouter, Gemini, DeepSeek, Supabase, Clerk, etc.

### 3. Documentation
**Location**: `~/.openclaw/workspace/docs/STT_TTS_ZERO_SPIKE.md`

**Contains**:
- Architecture overview
- API reference
- Usage examples
- Troubleshooting guide
- Performance metrics

---

## 🔑 Keychain Keys (SSOT)

The following keys exist in your Keychain:

| Key Name | Purpose | Status |
|----------|---------|--------|
| `SSOT_AI_GROQ` | Groq Whisper API | ✅ EXISTS |
| `SSOT_TTS_ELEVENLABS` | ElevenLabs TTS API | ✅ EXISTS |

---

## 🚀 How to Use

### Step 1: Load Keys

```bash
source ~/xmad/scripts/load-secrets.sh
```

**Note**: If prompted, unlock your Keychain:
```bash
security unlock-keychain ~/Library/Keychains/login.keychain-db
```

### Step 2: Test Keys

```bash
cd ~/xmad/xmad-core/packages/stt-tts
node test.js
```

Expected output:
```
🔑 Checking STT/TTS keys...

Results:
─────────────────────────────────────
Groq Key: ✅ SET
ElevenLabs Key: ✅ SET
Groq Reachable: ✅ YES
Voice ID: 21m00Tcm4TlvDq8ikWAM
Model: whisper-large-v3-turbo
─────────────────────────────────────

✅ All systems ready!
```

### Step 3: Use in Code

```javascript
const { transcribe, speak, speakToFile } = require("@xmad/stt-tts");

// STT: Transcribe audio
const text = await transcribe("/path/to/audio.ogg");

// TTS: Stream to file
await speak("Hello world", fs.createWriteStream("/tmp/reply.mp3"));

// TTS: Auto-temp file (for WhatsApp)
const tmpPath = await speakToFile("Reply text");
```

---

## 🎨 Architecture

### Zero-Spike Design

**OLD (bad)**:
```
Voice note → read entire file into RAM → send → wait →
receive entire mp3 into RAM → write file → send
```

**NEW (correct)**:
```
Voice note → pipe directly to API → pipe response directly out
RAM used: ~0 (stream passes through, never held)
```

### Memory Comparison

| Old Approach | New Approach |
|--------------|--------------|
| Read full audio into Buffer | Pipe file chunks directly |
| Hold MP3 in Node heap | Pipe stream straight to response |
| Local ffmpeg conversion | No conversion — webm as-is |
| ElevenLabs SDK (loads deps) | Raw `fetch` only |
| Browser buffers AudioContext | Blob URL → native `<audio>` |

**Result**: Only JSON transcript (~50 bytes) held in RAM.

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| STT Latency | ~1-2s (Groq Whisper) |
| TTS Latency | ~500ms (ElevenLabs streaming) |
| Memory Spike | ~0 (streaming) |
| Max Audio Size | 25MB (Groq limit) |
| Max Text Length | 5000 chars (ElevenLabs limit) |

---

## 🧪 Testing

### Test STT (Speech-to-Text)

```bash
# Load keys
source ~/xmad/scripts/load-secrets.sh

# Transcribe audio
node -e "
const { transcribe } = require('./xmad/xmad-core/packages/stt-tts/index.js');
transcribe('/path/to/test.ogg').then(console.log).catch(console.error);
"
```

### Test TTS (Text-to-Speech)

```bash
# Load keys
source ~/xmad/scripts/load-secrets.sh

# Generate speech
node -e "
const { speakToFile } = require('./xmad/xmad-core/packages/stt-tts/index.js');
speakToFile('Hello world').then(path => console.log('Saved:', path)).catch(console.error);
"
```

---

## 🔧 Integration with OpenClaw

### For WhatsApp Voice Messages

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

## 📁 Files Created

| File | Purpose |
|------|---------|
| `~/xmad/xmad-core/packages/stt-tts/index.js` | Core STT/TTS module |
| `~/xmad/xmad-core/packages/stt-tts/package.json` | Package config |
| `~/xmad/xmad-core/packages/stt-tts/README.md` | Package docs |
| `~/xmad/xmad-core/packages/stt-tts/test.js` | Health check |
| `~/xmad/scripts/load-secrets.sh` | Key loader (SSOT) |
| `~/.openclaw/workspace/docs/STT_TTS_ZERO_SPIKE.md` | Full docs |
| `~/.openclaw/workspace/docs/STT_TTS_IMPLEMENTATION.md` | This file |

---

## ⚠️ Troubleshooting

### Keychain Access Denied

If you get "security: SecKeychainItemCopy: The user name or passphrase you entered is not correct" (error 36):

```bash
# Unlock Keychain
security unlock-keychain ~/Library/Keychains/login.keychain-db

# Or run with explicit access
security find-generic-password -s "SSOT_AI_GROQ" -w
```

### Keys Not Found

```bash
# Check if keys exist
security dump-keychain | grep -E "SSOT_AI_GROQ|SSOT_TTS_ELEVENLABS"

# If missing, you need to add them:
# Get keys from Infisical dashboard and add to Keychain
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

## 🎯 Next Steps

### For OpenClaw WhatsApp Integration

1. Update WhatsApp handler to use `transcribe()` for incoming voice
2. Use `speakToFile()` for voice replies
3. Set up auto-cleanup of temp files (already done)

### For Next.js Web Interface

1. Create `/api/stt/route.ts` - Browser → Groq
2. Create `/api/tts/route.ts` - ElevenLabs → Browser
3. Add `use-voice.ts` hook
4. Add `voice-button.tsx` component
5. Update chat page with voice controls

---

## 📚 References

- **SSOT Keys Guide**: `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md`
- **OpenClaw SSOT**: `~/Desktop/important-docs/OPENCLAW_SSOt_REFERENCE.md`
- **Groq API**: https://api.groq.com/openai/v1/audio/transcriptions
- **ElevenLabs API**: https://elevenlabs.io/docs/text-to-speech/streaming

---

## ✅ Summary

**Status**: ✅ **COMPLETE**

The zero-spike STT/TTS system is now:
- ✅ Implemented in `~/xmad/xmad-core/packages/stt-tts/`
- ✅ Keys loaded via SSOT from Keychain
- ✅ Fully documented
- ✅ Ready for OpenClaw integration

**Next**: Add to OpenClaw's WhatsApp handler for voice message support.

---

**Maintained By**: Nova
**Last Updated**: 2026-03-13
