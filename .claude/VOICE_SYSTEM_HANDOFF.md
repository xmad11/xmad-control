# Voice System Complete Handoff — SSOT for Next Session

## Current Status

**Commit:** `0364961` — Pushed to main, deployed to Vercel
**Memory:** 88% used — Cannot run local builds
**Last Test:** Waiting for Vercel deployment

---

## What Was Fixed (Commit 0364961)

| Fix | File | Change |
|-----|------|--------|
| Silence threshold | useVoiceChat.ts:76 | `avg < 10` → `avg < 20` |
| Min recording duration | useVoiceChat.ts | Added 2000ms guard |
| Markdown stripping | useVoiceChat.ts | Full stripping (headers, code, links, lists) |
| State management | SheetContext.tsx | Single source of truth |
| Memory cleanup | useVoiceChat.ts | Added cleanup useEffect |
| TTS interrupt | useVoiceChat.ts | AbortController for fetches |
| Safari regex | useVoiceChat.ts | No lookbehind, use abbreviation check |
| Deepgram params | api/stt/route.ts | + utterances, vad_events, endpointing |
| FFT size | useVoiceChat.ts:69 | 512 → 2048 |
| Loop delay | useVoiceChat.ts | 500ms → 100ms |

---

## What Still Needs Fixing

### P0 — Critical (STT still returning empty)

The debug logs show STT is still returning empty transcripts. Root causes:

1. **Blob size guard missing** — Need to reject blobs < 20KB
2. **Clear live tokens** — Not called on session start
3. **Deep debug needed** — Must see raw Deepgram response

### Required Debug Patch

```typescript
// app/api/stt/route.ts — Add these logs

console.log("[STT] Blob size:", blob.size);
console.log("[STT] File type:", fileType);

const json = await response.json();
console.log("[STT] Deepgram raw response:", JSON.stringify(json, null, 2));

const transcript = json?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
console.log("[STT] Final transcript:", transcript);

if (!transcript) {
  console.warn("[STT] EMPTY TRANSCRIPT — FULL RESPONSE:", json);
}
```

### P1 — High Priority

1. **clearLiveTokens()** not called on voice start
2. **liveTokens stored as array** — should be string for performance

### P2 — Codebase Health

1. Delete `components/ui/pwa-hooks/` (duplicate)
2. Delete `components/ui/pwa-components/` (duplicate)
3. Delete `hooks/use-mobile.tsx` (conflicts with useBreakpoint.ts)
4. Wrap debug logs in `if (DEV)`

---

## Files Modified

```
hooks/useVoiceChat.ts        +126/-38 lines
context/SheetContext.tsx     +5/-4 lines
app/api/stt/route.ts         +3/-0 lines
```

---

## Key Code Locations

| Function | File | Line |
|----------|------|------|
| createSilenceDetector | useVoiceChat.ts | 54 |
| stripMarkdown | useVoiceChat.ts | 196 |
| splitIntoSentences | useVoiceChat.ts | 229 |
| speakSentence | useVoiceChat.ts | 270 |
| processTTSQueue | useVoiceChat.ts | 330 |
| getStreamingAIResponse | useVoiceChat.ts | 360 |
| startRecording | useVoiceChat.ts | 800 |
| startSession | useVoiceChat.ts | 950 |
| stopSession | useVoiceChat.ts | 990 |

---

## Duplication Found (3300+ lines)

| Directory | Files | Lines |
|-----------|-------|-------|
| `components/ui/pwa-hooks/` | 4 | ~1200 |
| `components/ui/pwa-components/` | 2 | ~800 |
| `hooks/use-mobile.tsx` | 1 | ~100 |

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

Then apply the debug patch from PART 1-9 in that document.

Goal: Identify EXACTLY why STT returns empty transcripts.

DO NOT refactor anything. ONLY add logging + minimal fixes.
```

---

*Generated: 2026-03-27 | Memory: 88% | Branch: main*
