# Voice Microservices - Copied from Desktop

**Source:** `/Users/ahmadabdullah/Desktop/ignore/voice-microservices/`
**Copied:** 2026-02-10
**Destination:** `/Users/ahmadabdullah/xmad-control/openclaw/workspace/`

## Services Copied

### 1. STT - SenseVoice (Speech-to-Text)
**Directory:** `stt-sensevoice/`

**Features:**
- Multi-language support (zh, en, yue, ja, ko, auto)
- FastAPI REST API
- 16KHz audio input (WAV, MP3)
- Rich transcription with post-processing
- Real-time and batch processing

**API Endpoint:**
- `POST /api/v1/asr`
- Input: Audio files (WAV/MP3, 16KHz)
- Output: Transcription with raw_text, clean_text, and rich transcription

**Port:** 50000
**Language:** Python (PyTorch, FunASR)

**Usage:**
```python
# Start server
cd stt-sensevoice
python api.py

# Test
curl -X POST "http://localhost:50000/api/v1/asr" \
  -F "files=@audio.wav" \
  -F "lang=auto"
```

### 2. TTS - Chatterbox Turbo (Text-to-Speech)
**Directory:** `tts-chatterbox/`

**Features:**
- High-quality TTS by Resemble AI
- Voice cloning from reference audio
- Paralinguistic tags ([laugh], [chuckle], [cough])
- Multilingual support
- FastAPI REST API

**API Endpoints:**
- `POST /v1/tts` - Generate speech with optional voice cloning
- `POST /v1/tts/simple` - Quick TTS with default voice
- `POST /v1/voice/clone` - Clone voice from reference audio

**Port:** 8000
**Language:** Python (PyTorch)
**Device:** CUDA/CPU auto-detection

**Usage:**
```python
# Start server
cd tts-chatterbox
python server.py

# Test
curl -X POST "http://localhost:8000/v1/tts/simple" \
  -F "text=Hello, world!"
```

### 3. TTS - Kokoro
**Directory:** `tts-kokoro/`

**Features:**
- Lightweight TTS model
- Fast inference
- Multiple voice options
- Japanese/English support

**Language:** Python
**Note:** Check README.md for usage instructions

### 4. TTS - Qwen3
**Directory:** `tts-qwen3/`

**Features:**
- Advanced TTS model
- Natural voice synthesis
- Multiple language support

**Language:** Python
**Note:** Check README.md for usage instructions

### 5. @xmad/voice (React Voice Package)
**Directory:** `voice/`

**Features:**
- Speech Recognition (Web Speech API)
- Text-to-Speech (Web Speech API)
- React hooks (useVoiceRecognition, useTextToSpeech)
- UI Components (VoiceButton, VoiceIndicator, VoiceModal)
- Speech-to-Command parser
- Full TypeScript support

**Usage:**
```typescript
import { Voice } from '@xmad/voice';

const voice = new Voice();
await voice.speak('Hello, world!');

voice.startListening({
  onResult: (result) => {
    console.log('You said:', result.transcript);
  }
});
```

**Note:** This is a browser-based package, not a standalone service

## Integration Plan

### For WhatsApp Voice Messages

**Current Setup:**
- NOVA uses the built-in `tts` tool (ElevenLabs)
- Generates audio files
- Sends to WhatsApp automatically

**Voice Services Available:**
- **STT:** SenseVoice (if NOVA needs to transcribe audio)
- **TTS:** Chatterbox/Kokoro/Qwen3 (alternatives to ElevenLabs)

**Recommended:**
- Keep using ElevenLabs TTS for WhatsApp (working well)
- Use SenseVoice STT if you need to transcribe audio messages
- Use @xmad/voice package for React app voice features

### Starting the Services

**STT Service (SenseVoice):**
```bash
cd /Users/ahmadabdullah/xmad-control/openclaw/workspace/stt-sensevoice
python api.py
# Runs on http://0.0.0.0:50000
```

**TTS Service (Chatterbox):**
```bash
cd /Users/ahmadabdullah/xmad-control/openclaw/workspace/tts-chatterbox
python server.py
# Runs on http://0.0.0.0:8000
```

**Monitor All Services:**
```bash
cd /Users/ahmadabdullah/Desktop/ignore/voice-microservices
./monitor.sh
```

**Start All Services:**
```bash
cd /Users/ahmadabdullah/Desktop/ignore/voice-microservices
./start-all.sh
```

## Requirements

### STT (SenseVoice)
- Python 3.8+
- PyTorch
- FastAPI
- Uvicorn
- FunASR
- Torchaudio

### TTS (Chatterbox)
- Python 3.8+
- PyTorch
- FastAPI
- Uvicorn
- CUDA (optional, for GPU acceleration)

### @xmad/voice
- React 18+
- TypeScript 5+
- Browser with Web Speech API support

## Model Information

### SenseVoice Small
- Model: `iic/SenseVoiceSmall`
- Languages: zh, en, yue, ja, ko
- Auto-detection supported
- Sample rate: 16KHz

### Chatterbox Turbo
- Model: Resemble AI Chatterbox
- Voice cloning: Yes
- Paralinguistic tags: [laugh], [chuckle], [cough]
- Sample rate: Model-dependent

## API Examples

### STT - Transcribe Audio
```bash
curl -X POST "http://localhost:50000/api/v1/asr" \
  -F "files=@audio.wav" \
  -F "lang=en"
```

**Response:**
```json
{
  "result": [
    {
      "key": "audio.wav",
      "raw_text": "Hello world",
      "clean_text": "Hello world",
      "text": "Hello world"
    }
  ]
}
```

### TTS - Generate Speech
```bash
curl -X POST "http://localhost:8000/v1/tts/simple" \
  -F "text=Hello, world!" \
  --output output.wav
```

**Response:** WAV audio file

## Notes

- All services run independently
- Services can be started/stopped individually
- Monitor script provides status checking
- GPU acceleration available if CUDA is installed
- SenseVoice requires 16KHz audio input

## Next Steps

1. **Install dependencies** for each service
2. **Download models** (first run)
3. **Start services** using provided scripts
4. **Test endpoints** using curl or Postman
5. **Integrate** with applications as needed

---

**Last Updated:** 2026-02-10
**Copied By:** NOVA (🚀)
