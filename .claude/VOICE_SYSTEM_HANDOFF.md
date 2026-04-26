# Voice System Complete Handoff — SSOT for Next Session

## Current Status

**Commit:** `dbffc86` — Pushed to main, deploying to Vercel
**Memory:** 88% used — Cannot run local builds
**Debug Mode:** ACTIVE - Silence auto-stop DISABLED for investigation

---

## What Was Fixed (Commit dbffc86 - Debug Patch)

### STT API (`app/api/stt/route.ts`)
| Change | Description |
|--------|-------------|
| Blob size logging | Log blob size in bytes and KB before sending to Deepgram |
| File type logging | Log MIME type and extension |
| 20KB minimum guard | Reject blobs < 20KB with `tooShort: true` flag |
| Raw Deepgram response | Log full JSON response for debugging |
| Empty transcript warning | Log full response when transcript is empty |
| Performance timing | Log request time in milliseconds |

### Voice Hook (`hooks/useVoiceChat.ts`)
| Change | Description |
|--------|-------------|
| `DEBUG_DISABLE_SILENCE_STOP = true` | Temporarily disable silence auto-stop |
| RMS logging | Log audio levels every ~160ms in silence detector |
| Recording start log | Log MIME type, track settings, capabilities |
| Chunk logging | Log every 5 chunks with cumulative size |
| Recording stop log | Log duration, total chunks, final blob size |
| STT request log | Log blob info before sending, warn if < 10KB |
| STT response log | Log transcript length and text |
| Loop iteration IDs | Unique IDs for each loop iteration |
| Stop reason logging | Log all stop reasons and stack traces |

---

## Debug Mode Flags

```typescript
// In hooks/useVoiceChat.ts
const DEBUG_DISABLE_SILENCE_STOP = true  // Recording won't auto-stop on silence

// To re-enable silence auto-stop:
// Set DEBUG_DISABLE_SILENCE_STOP = false
```

---

## How to Collect Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Filter by `[Voice]` or `[STT]` or `[SilenceDetector]`
4. Start a voice session
5. Speak for 5-10 seconds
6. Stop session
7. Copy all console output

### Key Log Patterns to Look For

```
[Voice] ========== SESSION START REQUESTED ==========
[Voice] ========== RECORDING STARTED ==========
[SilenceDetector] Audio RMS: XX.XX | Threshold: 20 | Silent: false
[Voice] Chunk # 5 : XXXX bytes | Total so far: XXXXX bytes
[Voice] ========== RECORDER STOPPED ==========
[Voice] Recording duration: XXXX ms
[Voice] Final blob size: XXXXX bytes ( XX.XX KB)
[STT API] ========== DEEPGRAM REQUEST START ==========
[STT API] Blob size: XXXXX bytes ( XX.XX KB)
[STT API] ========== DEEPGRAM RAW RESPONSE ==========
[STT API] Full response: { ... }
[Voice] ========== STT RESULT ==========
[Voice] Transcript text: ...
```

---

## Known Issues to Investigate

### Possible Root Causes for Empty Transcripts

1. **Blob too small** — Check if blob size < 20KB (now logged)
2. **No audio captured** — Check RMS values in silence detector logs
3. **Deepgram error** — Check raw response for error fields
4. **MIME type issue** — Check if Deepgram received correct format
5. **Early stop** — Check recording duration (should be > 2s)
6. **Browser codec issue** — Check MIME type support in logs

### What to Report Back

1. Blob size when transcript is empty
2. RMS values during recording (was there actual audio?)
3. Recording duration
4. Deepgram raw response (what did it return?)
5. Any errors in red text

---

## After Debug Complete

1. Set `DEBUG_DISABLE_SILENCE_STOP = false`
2. Remove or reduce verbose logging
3. Remove the 20KB minimum guard if causing issues
4. Update this handoff with findings

---

## Files Modified in This Session

```
app/api/stt/route.ts         +56/-10 lines
hooks/useVoiceChat.ts        +225/-38 lines
```

---

## Success Criteria

Voice system must:
- [ ] Not auto-stop incorrectly
- [ ] Always produce transcript (no empty)
- [ ] Stream tokens live to UI
- [ ] Show transcript while speaking
- [ ] Allow interruption anytime
- [ ] Work in BOTH chat sheet + hold mode
- [ ] Feel fast and real-time

---

## Next Session Prompt

```
Read /Users/ahmadabdullah/xmad-control/.claude/VOICE_SYSTEM_HANDOFF.md

Check Vercel deployment logs and browser console for the debug output.

Goal: Analyze the logs to identify why STT returns empty transcripts.

Look for:
1. Blob size (should be > 20KB)
2. RMS audio levels (should be > 20 during speech)
3. Deepgram raw response (what's in it?)
4. Recording duration (should be > 2000ms)

DO NOT refactor anything until the root cause is identified.
```

---

*Generated: 2026-03-27 | Memory: 88% | Branch: main | Commit: dbffc86*
