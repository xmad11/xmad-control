# Coordinator Handoff Integration Guide

**Version:** 1.0.0
**Date:** 2026-01-21
**System:** GLM-4.7 Context Window Handoff

---

## Overview

This document describes how to integrate the handoff system with the existing coordinator system for seamless agent continuity when context window thresholds are reached.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     COORDINATOR SYSTEM                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ coordinator │  │   status.md  │  │  progress.md        │   │
│  │    .md     │  │              │  │                     │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘   │
│         │                │                     │                │
│         └────────────────┴─────────────────────┘                │
│                           │                                     │
│                   ┌───────▼────────┐                           │
│                   │  Handoff System │                           │
│                   │  Integration    │                           │
│                   └───────┬────────┘                           │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼──────┐  ┌────────▼────────┐
│  Agent-1       │  │  Agent-2     │  │   New Agent     │
│  (reaching     │──▶│  (working)  │  │   (spawned)     │
│   limit)       │  │              │  │                 │
└────────────────┘  └──────────────┘  └─────────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Handoff State  │
                    │   Storage      │
                    └────────────────┘
```

---

## Integration Points

### 1. Coordinator Document Updates

When a handoff occurs, update `/coordinator/coordinator.md`:

```markdown
## HANDOFF TRACKING

### Recent Handoffs
| Handoff ID | From | To | Timestamp | Reason | Status |
|------------|------|----|-----------|---------|--------|
| handoff-xxx | agent-1 | agent-2 | 2026-01-21T10:30:00Z | context_window_limit | verified |

### Active Agent
- **Current Agent:** agent-2
- **Session Start:** 2026-01-21T10:30:15Z
- **Handoff Count:** 1
```

### 2. Status File Updates

Update `/coordinator/status.md` with handoff information:

```markdown
## SESSION HANDOFFS

### Current Session
- **Session ID:** sess-2026-01-21-agent-2
- **Previous Agent:** agent-1
- **Handoff Time:** 2026-01-21 10:30:00 UTC
- **Handoff Reason:** Context window at 52% (104,000 / 200,000 tokens)

### Handoff State
- **Handoff ID:** handoff-xxx
- **State File:** .coordinator/handoffs/handoff-agent-1-2026-01-21T10-30-00Z.json
- **Task Continuity:** Preserved
- **File Tracking:** Preserved
```

### 3. Progress File Updates

Update `/coordinator/progress.md` with continuity note:

```markdown
## PROGRESS CONTINUITY

### Handoff Event: 2026-01-21 10:30:00 UTC
**Status:** ✅ Seamless continuity achieved
**Context:** Transferred from agent-1 to agent-2
**State:** Full state preservation verified

**Work in Progress at Handoff:**
- Task: M01 - PWA Hooks & Infrastructure
- Status: In Progress (60% complete)
- Files: 3 modified in staging
- Next Steps: Complete remaining 2 hooks, submit for review

**Continued by agent-2 without interruption.**
```

---

## Handoff Workflow

### Step 1: Context Monitoring

The context monitor tracks token usage throughout the session:

```typescript
import { initContextMonitor } from './scripts/context-monitor';

// Initialize at session start
const monitor = initContextMonitor();

// Track operations
monitor.trackFileRead('/path/to/file.tsx', fileContent);
monitor.trackUserMessage(userMessage);
monitor.trackAssistantMessage(assistantResponse);
```

### Step 2: Handoff Trigger

When threshold is reached (50% of 200K = 100K tokens):

```typescript
import { checkHandoverNeeded } from './scripts/context-monitor';

// Check periodically
if (checkHandoverNeeded()) {
  // Trigger handoff process
  await executeHandoff();
}
```

### Step 3: State Generation

Generate comprehensive handoff state:

```typescript
import { createHandoffAutomator } from './scripts/handoff-automation';

const automator = createHandoffAutomator('agent-1', 'page-components');

automator.setTaskContext({
  taskId: 'M01',
  taskDescription: 'PWA Hooks & Infrastructure Migration',
  taskStatus: 'in_progress',
  currentStep: 'Migrating useOfflineActions hook',
  completedSteps: ['usePWA.ts structure', 'useOfflineActions.ts skeleton'],
  remainingSteps: [
    'Complete useOfflineActions implementation',
    'Migrate useOfflineFavorites.ts',
    'Migrate useCachedRestaurants.ts',
    'Submit for review'
  ],
  stagingLocation: '/coordinator/staging/agent-1/pwa-hooks/',
});

// Execute handoff
await automator.executeHandoff();
```

### Step 4: Coordinator Update

Update coordinator files:

```typescript
// Update coordinator.md with handoff tracking
await updateCoordinatorDocument({
  handoffId: state.handoffId,
  fromAgent: 'agent-1',
  toAgent: 'agent-2',
  timestamp: new Date().toISOString(),
  reason: 'context_window_limit',
  status: 'verified',
});

// Update status.md
await updateStatusFile({
  currentAgent: 'agent-2',
  handoffCount: 1,
  lastHandoff: state.createdAt,
});

// Update progress.md with continuity note
await updateProgressFile({
  handoffEvent: {
    timestamp: new Date().toISOString(),
    fromAgent: 'agent-1',
    toAgent: 'agent-2',
    continuity: 'preserved',
    taskState: state.task,
  },
});
```

### Step 5: New Agent Spawn

Spawn new agent with handoff context:

```bash
# Spawn script receives handoff state
./scripts/spawn-agent.sh \
  --agent-id="agent-2" \
  --role="page-components" \
  --handoff-id="handoff-xxx" \
  --handoff-file=".coordinator/handoffs/handoff-agent-1-xxx.json"
```

### Step 6: Verification

Verify seamless continuity:

```typescript
import { verifyHandoffContinuity } from './scripts/verify-handoff';

const verification = await verifyHandoffContinuity({
  handoffId: 'handoff-xxx',
  previousAgent: 'agent-1',
  newAgent: 'agent-2',
});

if (verification.continuityPreserved) {
  console.log('✅ Handoff successful - work continues seamlessly');
} else {
  console.error('❌ Handoff verification failed - manual review needed');
}
```

---

## Handoff State Structure

The handoff state contains all information needed for continuation:

```typescript
{
  "handoffId": "handoff-xxx",
  "createdAt": "2026-01-21T10:30:00Z",
  "source": {
    "agentId": "agent-1",
    "agentRole": "page-components",
    "sessionId": "sess-2026-01-21-agent-1",
    "messageCount": 42,
    "tokenUsage": {
      "total": 104000,
      "input": 85000,
      "output": 19000,
      "percentage": 0.52
    }
  },
  "task": {
    "taskId": "M01",
    "taskDescription": "PWA Hooks & Infrastructure",
    "taskStatus": "in_progress",
    "currentStep": "Migrating useOfflineActions",
    "completedSteps": ["usePWA structure", "useOfflineActions skeleton"],
    "remainingSteps": ["Complete useOfflineActions", ...],
    "stagingLocation": "/coordinator/staging/agent-1/pwa-hooks/"
  },
  "conversation": {
    "messageCount": 42,
    "recentMessages": [...], // Last 10 messages
    "decisions": [...],
    "issues": [...]
  },
  "memory": {
    "variables": {...},
    "activeFiles": [...],
    "activeWork": [...],
    "notes": [...],
    "pendingActions": [...]
  },
  "files": {
    "readFiles": [...],
    "modifiedFiles": [...],
    "createdFiles": [...],
    "pendingReview": [...]
  },
  "progress": {
    "currentPhase": "M01 - PWA Migration",
    "overallProgress": 0.6,
    "checkpoints": [...],
    "metrics": {...}
  }
}
```

---

## Integration Commands

### For Coordinator

```bash
# Initialize handoff system
bun run coordinator:handoff:init

# Check handoff status
bun run coordinator:handoff:status

# View handoff history
bun run coordinator:handoff:history

# Manual trigger (emergency)
bun run coordinator:handoff:trigger --reason="manual_request"
```

### For Agents

```typescript
// Agent initialization with handoff support
import { initHandoffAgent } from './coordinator/scripts/handoff-integration';

const agent = await initHandoffAgent({
  agentId: 'agent-1',
  agentRole: 'page-components',
  enableAutoHandoff: true,
  handoffThreshold: 0.5,
});

// Set current task
agent.setTask({
  taskId: 'M01',
  taskDescription: 'PWA Hooks Migration',
  taskStatus: 'in_progress',
  // ...
});

// Work normally - handoff is automatic
// ...

// Check if handoff is needed
if (await agent.shouldHandoff()) {
  const result = await agent.executeHandoff();
  console.log(`Handoff ${result.success ? 'succeeded' : 'failed'}`);
}
```

---

## Monitoring & Debugging

### View Current Context Usage

```bash
# Print context report
bun run coordinator:context:report

# Output:
# 📊 Context Usage Report
# ────────────────────────────────────────────────────
# Progress: [████████████░░░░░░░░░░░░░░░░░░] 52.0%
# Tokens Used: 104.0K / 200.0K
# Remaining: 96.0K
# Status: HANDOVER
# ...
```

### View Handoff History

```bash
# List all handoffs
bun run coordinator:handoff:history

# View specific handoff
cat .coordinator/handoffs/handoff-agent-1-2026-01-21T10-30-00Z.json
```

### Debug Failed Handoffs

```bash
# Verify handoff state
bun run coordinator:handoff:verify --handoff-id="handoff-xxx"

# Test handoff without actually triggering
bun run coordinator:handoff:dry-run
```

---

## Best Practices

### 1. Set Up Early

Initialize handoff monitoring at the start of each session:

```typescript
// First thing in agent code
const monitor = initContextMonitor({
  handoverThreshold: 0.5,  // 50% = 100K tokens
  verbose: true,
});
```

### 2. Track All Operations

Don't forget to track file operations:

```typescript
// When reading files
monitor.trackFileRead(filepath, content);

// When modifying files
monitor.trackFileModified(filepath, newContent);

// When creating files
monitor.trackFileCreated(filepath, content);
```

### 3. Keep Task Context Updated

Update task context as progress is made:

```typescript
automator.setTaskContext({
  taskId: 'M01',
  taskDescription: 'PWA Hooks Migration',
  taskStatus: 'in_progress',
  currentStep: 'Completing useOfflineActions',
  completedSteps: [...previous, 'useOfflineActions structure'],
  remainingSteps: [...remaining],
});
```

### 4. Record Important Decisions

Preserve critical decisions for continuity:

```typescript
monitor.recordDecision({
  description: 'Use useCallback for PWA event handlers',
  rationale: 'Prevents unnecessary re-renders in offline mode',
  relatedStep: 'useOfflineActions implementation',
});
```

---

## Emergency Procedures

### Manual Handoff Trigger

If automatic triggering fails or manual intervention is needed:

```typescript
import { getGlobalAutomator } from './scripts/handoff-automation';

const automator = getGlobalAutomator();
if (automator) {
  await automator.manualHandoff('manual_request');
}
```

### Rollback Failed Handoff

If a handoff fails and corrupts state:

```bash
# Restore previous agent state
bun run coordinator:handoff:rollback --handoff-id="handoff-xxx"

# This will:
# 1. Restore coordinator files
# 2. Reload previous handoff state
# 3. Reinitialize previous agent
# 4. Preserve work completed
```

---

## Troubleshooting

### Handoff Not Triggering

- Check monitor initialization
- Verify threshold configuration
- Ensure token tracking is active
- Check console for warnings

### Handoff Verification Failing

- Verify handoff state file integrity
- Check coordinator file permissions
- Ensure task context is complete
- Review file tracking records

### New Agent Not Starting

- Check spawn script permissions
- Verify handoff file path
- Review agent initialization logs
- Check for conflicting processes

---

## Files Modified

### Coordinator Files
- `/coordinator/coordinator.md` - Add handoff tracking section
- `/coordinator/status.md` - Add session handoffs section
- `/coordinator/progress.md` - Add continuity notes

### New Files
- `/coordinator/scripts/token-counter.ts` - Token counting utilities
- `/coordinator/scripts/handoff-protocol.ts` - State serialization format
- `/coordinator/scripts/context-monitor.ts` - Context monitoring
- `/coordinator/scripts/handoff-automation.ts` - Handoff orchestration
- `/coordinator/handoffs/` - Handoff state storage directory

---

**Status:** ✅ Integration Guide Complete
**Next Steps:** Implement verification suite, create spawn scripts
