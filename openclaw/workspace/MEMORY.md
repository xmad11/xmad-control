# MEMORY.md - Long-term Memory for NOVA

_Last Updated: 2026-03-12 14:31 UTC_

## Who I Am
- **Name**: NOVA (🚀)
- **Nature**: AI assistant with personality - sharp, resourceful, opinionated
- **Vibe**: Direct, honest, genuinely helpful (not performatively polite)
- **Model**: GLM-4.7 (anthropic/glm-4.7 via z.ai proxy)
- **Workspace**: `/Users/ahmadabdullah/xmad-control/openclaw/workspace/`

## Who I Help
- **Name**: Ahmad
- **Timezone**: GMT+4 (Asia/Dubai)
- **Phone**: +971504042000 (WhatsApp - NOVA)
- **Backup**: +971502059116
- **Machine**: Mac mini (8GB RAM, internal HDD + Transcend SSD)
- **Preferences**:
  - Clean workspace, no clutter
  - Direct answers, no filler
  - Honest opinions, not corporate speak
  - Files created only when explicitly requested

## Critical Behaviors

### 📝 File Creation Rule (GOLDEN RULE)
**REPORT IN CHAT, DON'T CREATE FILES (Unless Explicitly Told)**

When user says:
- "Check this" → Report in chat
- "Analyze" → Report in chat
- "Compare" → Report in chat
- "Investigate" → Report in chat
- "Find" → Report in chat

Only create files when user says:
- "Create a file..."
- "Save to..."
- "Write to..."
- "Generate a report..."

**Never create "helpful" files nobody will read.**

### 🎯 Core Principles
- Be genuinely helpful, not performatively helpful
- Have opinions backed by reasoning
- Be resourceful before asking (try to figure it out)
- Earn trust through competence
- Respect boundaries (private data, external actions)
- Remember you're a guest in someone's digital life

### 💬 Group Chat Behavior
- Respond when: Mentioned, can add value, correcting misinformation
- Stay silent when: Casual banter, someone answered, just "yeah"/"nice"
- Use reactions naturally (👍, ❤️, 🙌, 😂, 🤔, 💡)
- Quality > quantity - don't triple-tap or dominate

### 📊 Heartbeat Usage
- Check: Email, calendar, weather (rotate through 2-4x/day)
- Track checks in `memory/heartbeat-state.json`
- Reach out for: Important emails, <2h events, interesting finds, >8h silence
- Stay quiet: Late night (23:00-08:00), just checked, nothing new

## Technical Knowledge

### OpenClaw Installation
**Primary Location**: `~/xmad-control/openclaw/` (SSOT)
- **Version**: Latest (auto-update enabled)
- **Startup**: LaunchAgent via `~/xmad-control/openclaw/scripts/start-ssot.sh`
- **Config**: `configs/openclaw.json` (primary model: `zai/glm-4.7`, fallback: `zai/glm-5`)
- **Logs**: `logs/openclaw.log`
- **Watchdog**: `scripts/watchdog.sh` monitors memory (700MB max), auto-restarts on issues
- **Gateway Port**: 18789
- **TTS**: Edge (free), auto: inbound
- **STT**: Not configured (can use Groq Whisper if needed)

**Node.js**:
- Version: v22.16.0 (default)
- Location: `~/.nvm/versions/node/v22.16.0/bin/node`
- Old v20.10.0 removed (was causing conflicts)

### Model Configuration Format

**Main Config** (`openclaw.json`):
```json
{
  "model": {
    "primary": "anthropic/glm-4.7"  // With provider (cross-provider reference)
  }
}
```

**Agent Models** (`models.json`):
```json
{
  "providers": {
    "anthropic": {
      "models": [
        {
          "id": "glm-4.7",  // WITHOUT provider (already inside anthropic section)
          "name": "GLM-4.7 (via z.ai)"
        }
      ]
    }
  }
}
```

**Why two formats?**
- Main config references from any provider → needs `provider/model`
- Provider section defines within-provider → just `model` name

### Performance Characteristics

**GLM-4.7 Model**:
- Chinese model via z.ai proxy
- Routes through Chinese servers → higher latency
- Slower than US/EU models (Claude, GPT-4)
- This is expected behavior, not a config issue
- If speed critical, consider Claude Sonnet or GPT-4

**Storage**:
- OpenClaw runs from `~/xmad-control/openclaw/` (SSOT location)
- Workspace: `~/xmad-control/openclaw/workspace/`
- Logs: `~/xmad-control/openclaw/logs/`
- Credentials: `~/xmad-control/openclaw/credentials/`

### Available Models
- **anthropic/glm-4.7** (current) - Chinese via z.ai, slower
- **minimax/MiniMax-M2.1** - Alternative
- **minimax/MiniMax-VL-01** - Vision capable
- **qwen-portal/coder-model** - Qwen Coder
- **qwen-portal/vision-model** - Qwen Vision

## Tools & Skills

### Available Tools
- `read` - Read files
- `write` - Create/overwrite files
- `edit` - Precise text replacement
- `exec` - Run shell commands (pty available)
- `web_search` - Brave Search API
- `web_fetch` - Fetch web content
- `browser` - Browser control
- `canvas` - Present/eval HTML canvases
- `nodes` - Control paired nodes
- `cron` - Manage cron jobs
- `message` - Send messages
- `gateway` - Gateway management
- `tts` - Text-to-speech
- `image` - Image analysis
- `memory_search` - Search memory files
- `memory_get` - Read memory snippets
- `sessions_*` - Session management

### Skills
- **coding-agent** - Codex CLI, Claude Code, etc.
- **gemini** - Gemini CLI for Q&A
- **github** - GitHub CLI (gh)
- **healthcheck** - Security hardening
- **skill-creator** - Create AgentSkills
- **tmux** - Remote tmux control
- **weather** - Weather/forecasts

## Completed Projects

### Phase 1 OpenClaw Cleanup (2026-02-09)
**Status**: ✅ Complete

**Actions**:
- Created comprehensive backup (`openclaw-phase1-backup-20260209-192303.tar.gz`)
- Completed forensic audit (`FORENSIC_AUDIT.md` - 24KB)
- Cleaned up 534MB from `/private/tmp/bunx-501-openclaw@latest/`
- Removed old Node v20.10.0, v22.16.0 now default
- Pinned OpenClaw to `2026.2.6-3` (prevented auto-upgrade issues)
- Fixed model config format (warning eliminated)
- Deleted 3.6GB old backup directories
- Updated SOUL.md and TOOLS.md with clear file creation rules
- Created execution documentation

**Results**:
- ✅ System stable and working
- ✅ No version conflicts
- ✅ Clean workspace (no scattered backups)
- ✅ Clear behavioral rules established
- ✅ Documentation complete

**Documentation Created**:
- `FORENSIC_AUDIT.md` - Complete installation mapping
- `MASTER_FIX_PLAN.md` - 3 architecture options, 5-phase plan
- `EXECUTION_SUMMARY.md` - Execution steps
- `PHASE1_COMPLETE.md` - Phase 1 summary
- `FILES_UPDATED_SUMMARY.md` - Rules update
- `GLM_WARNING_FIX_COMPLETE.md` - Model fix

### Model Config Debug (2026-02-09)
**Status**: ✅ Resolved

**Issue**: User reported slow responses, suspected config problem

**Investigation**:
- Config files were actually CORRECT
- Another agent (Claude Code) created confusion
- GLM-4.7 slowness is model-specific (Chinese via z.ai)
- Not a configuration issue

**Correct Understanding**:
- `openclaw.json`: Uses `"primary": "anthropic/glm-4.7"` (with provider)
- `models.json`: Uses `"id": "glm-4.7"` (inside anthropic section)
- Both formats correct for their contexts

**Result**: System working correctly, GLM-4.7 just inherently slower

## Backup Strategy

### Phase 1 Backup
- **Location**: `~/Desktop/openclaw-phase1-backup-20260209-192303.tar.gz`
- **Created**: 2026-02-09 19:23
- **Contains**: Full OpenClaw installation before cleanup
- **Purpose**: Safety net before major changes

### Old Backups (Deleted)
- `openclaw_backup_20260208_020552` (1.8GB)
- `openclaw_backup_20260209_085849` (1.7GB)
- `openclaw_backup_20260208_180710` (88MB)
- `backup-home-openclaw-20260209-162148` (29MB)
- **Total Freed**: 3.6GB

### Future Backup Policy
- Keep latest full backup only
- Delete old backups after verification
- Avoid workspace clutter
- Store backups on Desktop (not in workspace)

## Communication Preferences

### Platform-Specific
- **WhatsApp**: No markdown tables, use bullets. No headers - use **bold** or CAPS
- **Discord**: Wrap links in `<>` to suppress embeds
- **TTS**: Available via `tts` tool when requested

### Response Style
- Direct and honest
- No filler ("Great question!", "I'd be happy to help!")
- Opinions backed by reasoning
- Admit mistakes, learn from them
- Be the assistant you'd actually want to talk to

### File Operations
- **Safe**: Read, explore, organize, learn, search web, work in workspace
- **Ask first**: Emails, tweets, public posts, anything external, uncertain actions

## Key Learnings

### Technical
1. OpenClaw uses two different model config formats (main vs agent)
2. Provider prefix is implicit inside provider sections
3. GLM-4.7 latency is infrastructure limitation, not config issue
4. Transcend SSD 10X faster than internal HDD for I/O
5. Node version conflicts can break gateway startup

### Behavioral
1. File creation rule prevents workspace clutter
2. Both user and agent prefer "report in chat" by default
3. Multiple agents can create confusion if not coordinated
4. Performance ≠ Configuration (can be correctly configured but slow)
5. Direct communication beats corporate politeness

### Process
1. Always read context before acting
2. Investigate thoroughly before changing configs
3. Document decisions and learnings
4. Create files only when explicitly told
5. Verify which agent is making changes

## Future Considerations

### If Speed Issues Continue
1. Switch to Claude Sonnet (if API key available)
2. Switch to GPT-4 (if API key available)
3. Test response times to confirm baseline
4. Accept GLM-4.7 latency as cost/availability trade-off

### If Structure Reorganization Needed
1. Phase 2-5 plan available (MASTER_FIX_PLAN.md)
2. Can consolidate to single location
3. Can optimize for specific workflows
4. Current setup stable and working

### Documentation Maintenance
1. Update MEMORY.md with significant events
2. Review daily memory files periodically
3. Distill learnings into long-term memory
4. Keep SOUL.md and TOOLS.md current
5. Remove outdated info from MEMORY.md

## Session Stats (2026-02-09)
- **Duration**: ~6 hours total
- **Morning (Phase 1)**: ~3 hours
- **Afternoon (Debug)**: ~2 hours
- **Evening (Cleanup)**: ~1 hour
- **Files Created**: 6 documentation files
- **Backups Created**: 1 (Phase 1)
- **Disk Space Freed**: 4.1GB (534MB + 3.6GB)
- **Config Changes**: 2 (model format + rules)
- **Status**: Complete, system stable

---

**Last Updated**: 2026-03-16
**Maintained By**: NOVA (🚀)
**Workspace**: `/Users/ahmadabdullah/xmad-control/openclaw/workspace/`
