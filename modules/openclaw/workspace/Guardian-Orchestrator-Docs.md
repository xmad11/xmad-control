# 🛡️ Claude Safe Orchestrator - Complete Documentation

**Guardian-Supervised Multi-Agent Coding System**

Your GLM 4.7 (in Claude Code CLI) acts as **Guardian/Auditor/Protector** while worker agents (API-based) execute tasks under constant supervision.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [API Reference](#api-reference)
7. [Guardian System](#guardian-system)
8. [Worker Agents](#worker-agents)
9. [Safety Features](#safety-features)
10. [Troubleshooting](#troubleshooting)
11. [Examples](#examples)

---

## Overview

### What Is It?

A **multi-agent orchestration system** for Claude Code CLI that adds:
- 🛡️ **Guardian Layer** - Your GLM 4.7 protects you from bad code
- 🤖 **Worker Agents** - Free AI models do the work under supervision
- ✅ **Safety Gates** - Automatic blocking of dangerous operations
- 🔄 **Rollback Protection** - Auto-revert on critical failures

### Key Benefits

| Feature | Benefit |
|---------|---------|
| **Guardian Supervision** | Your GLM 4.7 watches everything |
| **Free Workers** | DeepSeek V3 + Groq at no cost |
| **Safe Execution** | Dangerous ops blocked automatically |
| **Quality Control** | Code review on every change |
| **Git Protection** | Auto-rollback if things break |

### Cost Summary

| Component | Model | Cost | Purpose |
|-----------|-------|------|---------|
| Guardian | GLM 4.7 (CLI) | Existing subscription | Protection & supervision |
| Worker 1 | GLM 4.7 (API) | Paid per use | General coding tasks |
| Worker 2 | DeepSeek V3 | **100% FREE** | Complex refactoring |
| Worker 3 | Groq Llama 3.3 | **100% FREE** | Fast iterations |

**Total additional cost: $0** (using free workers)

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (You)                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ GLM 4.7 (Claude Code CLI) = GUARDIAN/PROTECTOR            │
│  - Your personal AI bodyguard                                    │
│  - Monitors all agent activities                                │
│  - Veto dangerous actions                                        │
│  - Ensures quality and safety                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   Orchestrator   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Worker Agent │    │ Worker Agent │    │ Worker Agent │
│ GLM 4.7 API  │    │ DeepSeek V3  │    │    Groq      │
│ (Paid)       │    │ (FREE)       │    │ (FREE)       │
│              │    │              │    │              │
│ General      │    │ Complex      │    │ Fast         │
│ coding       │    │ refactoring  │    │ tasks        │
│ Debugging    │    │ Architecture  │    │ Simple       │
│ Features     │    │ Design       │    │ changes      │
└──────────────┘    └──────────────┘    └──────────────┘
     ▲                    ▲                    ▲
     │                    │                    │
     └────────────────────┼────────────────────┘
                          │
                🛡️ GUARDIAN WATCHES ALL
```

### Data Flow

```
1. USER REQUEST
   "Add authentication to API"
        ↓
2. TASK ANALYSIS (Local)
   Complexity: HIGH
   Risk: MEDIUM
   Mode: orchestrated
        ↓
3. PLAN GENERATION (Local)
   Steps: Create middleware, endpoints, session handling
        ↓
4. 🛡️ GUARDIAN AUDIT
   ✅ Plan approved
   ⚠️  Warning: Use bcrypt for passwords
        ↓
5. WORKER EXECUTION
   Agent: DeepSeek V3
   Files: 3 created, 2 modified
        ↓
6. 🛡️ GUARDIAN MONITORING
   ✅ Files within allowed paths
   ✅ No dangerous commands
        ↓
7. CODE REVIEW (DeepSeek)
   Status: PASS
   Issues: 2 MINOR found
        ↓
8. 🛡️ GUARDIAN FINAL CHECK
   ✅ Quality acceptable
   ✅ Safe to apply
        ↓
9. COMPLETE
   Changes applied successfully
```

---

## Installation

### Step 1: Verify Files

```bash
ls -la ~/.claude-orchestrator/
```

Expected output:
```
drwxr-xr-x  11 ahmadabdullah  staff   352 Jan 28 03:13 .
drwxr-xr-x   5 ahmadabdullah  staff   160 Jan 28 02:00 ..
-rw-r--r--   1 ahmadabdullah  staff  4500 Jan 28 03:13 .env
-rwxr-xr-x   1 ahmadabdullah  staff  3200 Jan 28 03:11 claude-safe
drwxr-xr-x   2 ahmadabdullah  staff   128 Jan 28 03:00 config
-rw-r--r--   1 ahmadabdullah  staff  8500 Jan 28 03:13 README.md
drwxr-xr-x   4 ahmadabdullah  staff   256 Jan 28 03:11 scripts
```

### Step 2: Make Scripts Executable

```bash
chmod +x ~/.claude-orchestrator/claude-safe
chmod +x ~/.claude-orchestrator/scripts/*.sh
```

### Step 3: Install to PATH (Optional)

```bash
# Create symlink
ln -sf ~/.claude-orchestrator/claude-safe /usr/local/bin/claude-safe

# Verify
which claude-safe
# Output: /usr/local/bin/claude-safe
```

### Step 4: Test Installation

```bash
# Test Guardian
source ~/.claude-orchestrator/.env

PLAN='{"task_summary":"test","risk_assessment":"LOW","estimated_files":3}'
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_plan "$PLAN" . | jq .

# Expected output:
# {
#   "status": "APPROVED",
#   "warnings": [],
#   "blocked": false,
#   "guardian": "GLM-4.7-Guardian",
#   "timestamp": "2026-01-28T..."
# }
```

### Step 5: Verify Dependencies

```bash
# Required tools
which jq curl git
# All should return paths

# Test jq
echo '{"test": "value"}' | jq .

# Test API keys
source ~/.claude-orchestrator/.env
echo "ZAI: ${ZAI_API_KEY:0:10}..."
echo "DeepSeek: ${DEEPSEEK_API_KEY:0:10}..."
echo "Groq: ${GROQ_API_KEY:0:10}..."
```

---

## Configuration

### Environment Variables

Edit `~/.claude-orchestrator/.env`:

```bash
# ============================================================================
# GUARDIAN LAYER (Claude Code CLI - GLM 4.7)
# ============================================================================
export ZAI_API_KEY="your-key-here"
export ZAI_BASE_URL="https://api.z.ai/api/anthropic"

# ============================================================================
# WORKER AGENTS
# ============================================================================

# Worker 1: GLM 4.7 API
export WORKER_GLM_ENABLED="true"

# Worker 2: DeepSeek V3 (FREE)
export DEEPSEEK_API_KEY="sk-your-key-here"
export DEEPSEEK_BASE_URL="https://api.deepseek.com/v1"

# Worker 3: Groq (FREE)
export GROQ_API_KEY="gsk-your-key-here"

# ============================================================================
# GUARDIAN SETTINGS
# ============================================================================

# Enable/disable Guardian
export GUARDIAN_ENABLED="true"

# Strictness: lenient|moderate|strict|paranoid
export GUARDIAN_STRICTNESS="moderate"

# What to monitor
export GUARDIAN_MONITOR_PLANS="true"
export GUARDIAN_MONITOR_EXECUTION="true"
export GUARDIAN_MONITOR_REVIEWS="true"

# Safety responses
export GUARDIAN_BLOCK_DANGEROUS="true"
export GUARDIAN_WARN_ON_RISKY="true"
export GUARDIAN_REQUIRE_APPROVAL="true"

# ============================================================================
# ORCHESTRATOR SETTINGS
# ============================================================================

# When to orchestrate: low|medium|high|always|never
export AUTO_ORCHESTRATE_THRESHOLD="medium"

# Auto-review and rollback
export AUTO_REVIEW_ENABLED="true"
export AUTO_ROLLBACK_ON_CRITICAL="true"

# Timeouts (seconds)
export PLANNING_TIMEOUT=30
export EXECUTION_TIMEOUT=600
export REVIEW_TIMEOUT=15

# ============================================================================
# SECURITY SETTINGS
# ============================================================================

# Allowed paths (colon-separated)
export ALLOWED_PATHS="./:./src:./tests:./docs:./lib"

# Dangerous operations requiring approval
export DANGEROUS_OPERATIONS="delete:remove:drop:destroy:truncate:rm -rf:format:wipe"

# Git integration
export USE_GIT="true"
export AUTO_COMMIT="false"
export COMMIT_BEFORE_CHANGES="true"
```

### Getting API Keys

#### DeepSeek V3 (FREE)

1. Go to: https://platform.deepseek.com/
2. Sign up (100% free, no credit card needed)
3. Get API key from settings
4. Add to `.env`

#### Groq (FREE)

1. Go to: https://console.groq.com/
2. Sign up (100% free, generous limits)
3. Get API key from dashboard
4. Add to `.env`

#### Z.AI (GLM 4.7)

1. Go to: https://open.bigmodel.cn/
2. Sign up and get API key
3. Add to `.env`

---

## Usage

### Basic Usage

```bash
# Load environment
source ~/.claude-orchestrator/.env

# Use orchestrator
claude-safe "add user authentication to the app"
```

### Execution Modes

#### Mode 1: Direct Execution

```bash
# Simple task - Guardian supervises directly
claude-safe "fix typo in README"

# Output:
# 📊 Step 1: Analyzing task...
# {"complexity": "LOW", "risk": "LOW", "mode": "direct"}
#
# 📝 Task is simple - delegating to Claude Code CLI (Guardian mode)
# ✅ Guardian approves direct execution
```

#### Mode 2: Orchestrated Execution

```bash
# Complex task - Full pipeline
claude-safe "refactor authentication system"

# Output:
# 📊 Step 1: Analyzing task...
# {"complexity": "HIGH", "risk": "MEDIUM", "mode": "orchestrated"}
#
# 📋 Step 2: Generating execution plan...
# {"task_summary": "...", "steps": [...]}
#
# 🛡️ GUARDIAN AUDIT: Reviewing plan...
# {"status": "APPROVED", "warnings": []}
#
# 🔧 Step 3: Executing with worker agent...
# {"agent": "deepseek", "status": "SUCCESS"}
#
# 🛡️ GUARDIAN AUDIT: Reviewing execution...
# {"status": "APPROVED"}
#
# 🔍 Step 4: Running code review...
# {"status": "PASS", "issues": []}
#
# ✅ ORCHESTRATION COMPLETE
```

#### Mode 3: Manual Approval

```bash
# Dangerous task
claude-safe "delete all node_modules"

# Output:
# 📊 Step 1: Analyzing task...
# {"complexity": "MEDIUM", "risk": "CRITICAL", "mode": "manual_approval"}
#
# ⚠️  CRITICAL RISK DETECTED!
# Type 'I UNDERSTAND THE RISK' to proceed:
```

### Individual Components

#### Task Analysis

```bash
source ~/.claude-orchestrator/.env

bash ~/.claude-orchestrator/scripts/analyze-task.sh "your task" /path/to/project

# Output (JSON):
# {
#   "complexity_level": "HIGH",
#   "risk_level": "MEDIUM",
#   "execution_mode": "orchestrated",
#   "needs_plan": true,
#   "needs_review": true
# }
```

#### Plan Generation

```bash
ANALYSIS='{"complexity_level":"HIGH","estimated_files":5,"needs_plan":true}'
bash ~/.claude-orchestrator/scripts/generate-plan.sh "task" "$ANALYSIS" /path/to/project

# Output (JSON):
# {
#   "task_summary": "task",
#   "estimated_files": 5,
#   "estimated_time_minutes": 20,
#   "key_steps": [...],
#   "rollback_strategy": "git reset --hard HEAD"
# }
```

#### Guardian Audit

```bash
# Audit plan
PLAN='{"task_summary":"test","risk_assessment":"LOW","estimated_files":3}'
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_plan "$PLAN" .

# Audit execution
EXEC='{"files_modified":["./src/app.js"],"commands_run":["npm test"]}'
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_execution "$EXEC" .

# Audit review
REVIEW='{"status":"PASS","issues":[]}'
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_review "$REVIEW" .
```

#### Code Review

```bash
# Review git changes
bash ~/.claude-orchestrator/scripts/review-changes.sh /dev/null /path/to/project

# Output (JSON):
# {
#   "status": "PASS",
#   "confidence": 0.95,
#   "summary": "No issues found",
#   "issues": [],
#   "reviewer": "deepseek"
# }
```

#### Worker Agent

```bash
PLAN='{"task_summary":"add feature","estimated_files":3}'
bash ~/.claude-orchestrator/scripts/worker-agent.sh "add feature" "$PLAN" auto /path/to/project

# Output (JSON):
# {
#   "status": "SUCCESS",
#   "agent": "deepseek",
#   "files_modified": ["src/feature.js"],
#   "summary": "Feature added successfully"
# }
```

---

## API Reference

### analyze-task.sh

Analyzes task complexity and risk.

```bash
analyze-task.sh <task> [context_path]
```

**Output:**
```json
{
  "complexity_level": "MEDIUM",
  "risk_level": "LOW",
  "complexity_score": 3,
  "risk_score": 0,
  "estimated_files": 4,
  "needs_plan": true,
  "needs_review": true,
  "execution_mode": "orchestrated",
  "timestamp": "2026-01-28T00:00:00Z"
}
```

**Complexity Levels:** `LOW`, `MEDIUM`, `HIGH`, `VERY_HIGH`
**Risk Levels:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
**Execution Modes:** `direct`, `orchestrated`, `manual_approval`

### generate-plan.sh

Creates execution plans.

```bash
generate-plan.sh <task> <analysis_json> [context_path]
```

**Output:**
```json
{
  "task_summary": "refactor authentication",
  "risk_assessment": "MEDIUM",
  "estimated_files": 6,
  "estimated_time_minutes": 30,
  "key_steps": [
    {"order": 1, "action": "analyze", "target": "codebase"},
    {"order": 2, "action": "modify", "target": "auth files"},
    {"order": 3, "action": "test", "target": "test suite"}
  ],
  "rollback_strategy": "git reset --hard HEAD",
  "timestamp": "2026-01-28T00:00:00Z"
}
```

### guardian-audit.sh

Guardian supervision and safety checks.

```bash
guardian-audit.sh <action> <data_json> [context_path]
```

**Actions:**
- `audit_plan` - Audit execution plan
- `audit_execution` - Audit execution results
- `audit_review` - Audit code review results

**Output:**
```json
{
  "status": "APPROVED",
  "warnings": [],
  "blocked": false,
  "guardian": "GLM-4.7-Guardian",
  "timestamp": "2026-01-28T00:00:00Z"
}
```

**Statuses:** `APPROVED`, `BLOCKED`, `REQUIRES_MANUAL_APPROVAL`, `ROLLBACK_RECOMMENDED`

### worker-agent.sh

Execute tasks with worker agents.

```bash
worker-agent.sh <task> <plan_json> [agent] [context_path]
```

**Agents:** `auto`, `glm-api`, `deepseek`, `groq`

**Output:**
```json
{
  "status": "SUCCESS",
  "agent": "deepseek",
  "files_modified": ["src/auth.js"],
  "commands_run": ["npm test"],
  "summary": "Authentication refactored successfully"
}
```

### review-changes.sh

Code review with AI.

```bash
review-changes.sh <plan_file> [context_path]
```

**Output:**
```json
{
  "status": "PASS",
  "confidence": 0.92,
  "summary": "Clean implementation, no issues found",
  "issues": [],
  "reviewer": "deepseek",
  "was_truncated": false
}
```

**Issue Structure:**
```json
{
  "severity": "CRITICAL",
  "category": "security",
  "description": "SQL injection vulnerability",
  "location": "src/user.js:45",
  "suggestion": "Use parameterized queries"
}
```

**Severity:** `CRITICAL`, `MAJOR`, `MINOR`, `INFO`
**Category:** `syntax`, `logic`, `security`, `testing`, `style`, `performance`

---

## Guardian System

### What the Guardian Does

#### Pre-Execution Checks

- ✅ Risk level assessment
- ✅ Dangerous keyword detection
- ✅ Git repository safety
- ✅ File count sanity check
- ✅ Allowed paths verification

#### During Execution

- ✅ File operation monitoring
- ✅ Command execution tracking
- ✅ Dangerous operation blocking
- ✅ Real-time anomaly detection

#### Post-Execution

- ✅ Code review quality check
- ✅ Critical issue detection
- ✅ Auto-rollback if needed
- ✅ Change summary verification

### Guardian Actions

| Guardian Action | Trigger | Response |
|----------------|---------|----------|
| **APPROVE** | All checks pass | Allow execution |
| **WARN** | Minor concerns | Show warning, continue |
| **BLOCK** | Dangerous detected | Stop immediately |
| **REQUIRE_APPROVAL** | Critical risk | Ask user to confirm |
| **ROLLBACK_RECOMMENDED** | Critical issues found | Auto-revert changes |

### Guardian Strictness Levels

```bash
# In .env
export GUARDIAN_STRICTNESS="moderate"
```

| Level | Behavior |
|-------|----------|
| **lenient** | Only blocks clearly dangerous operations |
| **moderate** | Blocks dangerous + warns on risky (default) |
| **strict** | Requires approval for most changes |
| **paranoid** | Requires approval for everything |

### Guardian Example Scenarios

#### Scenario 1: Safe Task

```bash
claude-safe "add logging function"

# Guardian: ✅ APPROVED
# - Risk: LOW
# - No dangerous keywords
# - Within allowed paths
```

#### Scenario 2: Risky Task

```bash
claude-safe "delete all test files"

# Guardian: ⚠️ REQUIRES_MANUAL_APPROVAL
# - Risk: HIGH
# - Contains "delete all"
# - Type 'APPROVE' to continue
```

#### Scenario 3: Dangerous Task

```bash
claude-safe "drop database table"

# Guardian: ❌ BLOCKED
# - Risk: CRITICAL
# - Contains "drop database"
# - Operation blocked for safety
```

#### Scenario 4: Critical Review

```bash
# After worker makes changes
# Code review finds: SQL injection vulnerability

# Guardian: 🔄 ROLLBACK_RECOMMENDED
# - Review: FAIL
# - Critical issues: 1
# - Auto-rolling back via git...
```

---

## Worker Agents

### Agent Comparison

| Agent | Model | Cost | Speed | Context | Best For |
|-------|-------|------|-------|---------|----------|
| **GLM API** | GLM 4.7 | Paid | Fast | 128K | General coding |
| **DeepSeek** | DeepSeek V3 | FREE | Medium | 64K | Complex refactoring |
| **Groq** | Llama 3.3 70B | FREE | Fastest | 8K | Quick tasks |

### Agent Selection Logic

The system automatically selects the best agent based on:

```javascript
if (task_type === "complex") {
    return DeepSeek V3;  // Best for refactoring, architecture
} else if (task_type === "review") {
    return DeepSeek V3;  // Best for code analysis
} else if (task_type === "debug") {
    return GLM API;       // Best for debugging
} else {
    return GLM API;       // Default for general tasks
}
```

### Using Specific Agents

```bash
# Force specific agent
PLAN='{"task_summary":"test","estimated_files":1}'

# Use DeepSeek
bash ~/.claude-orchestrator/scripts/worker-agent.sh "task" "$PLAN" deepseek .

# Use Groq
bash ~/.claude-orchestrator/scripts/worker-agent.sh "task" "$PLAN" groq .

# Use GLM API
bash ~/.claude-orchestrator/scripts/worker-agent.sh "task" "$PLAN" glm-api .
```

---

## Safety Features

### 1. Dangerous Operation Blocking

```bash
# Blocked automatically:
- "delete all files"
- "drop database"
- "rm -rf"
- "format disk"
- "truncate table"
```

### 2. Path Restrictions

```bash
# In .env
export ALLOWED_PATHS="./:./src:./tests:./docs"

# Operations outside these paths are BLOCKED
```

### 3. Git Protection

```bash
# Settings
export USE_GIT="true"
export COMMIT_BEFORE_CHANGES="true"
export AUTO_ROLLBACK_ON_CRITICAL="true"

# Behavior:
1. Creates commit before changes
2. If critical issues found → auto-rollback
3. Your code is always safe
```

### 4. Command Monitoring

```bash
# Guardian tracks all commands:
- npm install ✅
- npm test ✅
- git add . ✅
- rm -rf node_modules ❌ BLOCKED
```

### 5. Quality Gates

```
Plan → Guardian Check → Execute → Review → Guardian Check → Apply
  ↓        ↓              ↓         ↓            ↓           ↓
 FAIL    BLOCK         ERROR     FAIL       ROLLBACK    STOP
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "command not found: jq"

```bash
# Solution: Install jq
brew install jq  # macOS
# OR
sudo apt install jq  # Linux
```

#### Issue 2: API Key Errors

```bash
# Check keys are loaded
source ~/.claude-orchestrator/.env
echo "$DEEPSEEK_API_KEY"  # Should show key

# If empty, check .env file syntax
cat ~/.claude-orchestrator/.env
```

#### Issue 3: Permission Denied

```bash
# Make scripts executable
chmod +x ~/.claude-orchestrator/claude-safe
chmod +x ~/.claude-orchestrator/scripts/*.sh
```

#### Issue 4: Guardian Blocks Everything

```bash
# Adjust strictness
# In .env:
export GUARDIAN_STRICTNESS="lenient"  # Instead of strict/paranoid
```

#### Issue 5: Worker Agent Fails

```bash
# Check API connectivity
curl -s https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" | jq .

# Check fallback agents
bash ~/.claude-orchestrator/scripts/review-changes.sh /dev/null . | jq .
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL="DEBUG"

# Run with verbose output
bash -x ~/.claude-orchestrator/scripts/analyze-task.sh "task" .
```

### Testing Components

```bash
# Test each component individually

# 1. Test Guardian
source ~/.claude-orchestrator/.env
PLAN='{"task_summary":"test","risk_assessment":"LOW","estimated_files":3}'
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_plan "$PLAN" .

# 2. Test Task Analysis
bash ~/.claude-orchestrator/scripts/analyze-task.sh "refactor code" .

# 3. Test Code Review (make some git changes first)
git add .
bash ~/.claude-orchestrator/scripts/review-changes.sh /dev/null .
```

---

## Examples

### Example 1: Add New Feature

```bash
cd ~/projects/myapp
source ~/.claude-orchestrator/.env

claude-safe "add user registration with email verification"

# Output:
# 📊 Analyzing: Complexity HIGH, Risk MEDIUM
# 📋 Plan created: 5 steps, 15 minutes estimated
# 🛡️ Guardian: ✅ Approved
# 🤖 Worker: DeepSeek V3 assigned
# 🔍 Review: PASS (1 MINOR issue)
# ✅ Complete
```

### Example 2: Fix Bug

```bash
claude-safe "fix authentication bug in login"

# Output:
# 📊 Analyzing: Complexity LOW, Risk LOW
# 📝 Direct execution approved
# ✅ Guardian: Working with Claude Code CLI directly
```

### Example 3: Refactor Code

```bash
claude-safe "refactor user service to use async/await"

# Output:
# 📊 Analyzing: Complexity HIGH, Risk MEDIUM
# 📋 Plan: 8 steps, 25 minutes, 6 files
# 🛡️ Guardian: ⚠️ Warning: Ensure tests cover refactored code
# 🤖 Worker: DeepSeek V3 executing...
# 🔍 Review: Found 2 issues
# 🛡️ Guardian: Issues acceptable, applying changes
# ✅ Complete
```

### Example 4: Dangerous Operation Blocked

```bash
claude-safe "delete all migrations"

# Output:
# 📊 Analyzing: Complexity MEDIUM, Risk CRITICAL
# ⚠️ CRITICAL RISK DETECTED!
# 🛡️ Guardian: BLOCKED
# Reasons:
# - Task contains "delete all"
# - High risk of data loss
# - Type 'I UNDERSTAND THE RISK' to proceed: [blocked]
```

### Example 5: Multi-File Project

```bash
cd ~/projects/large-app
claude-safe "add rate limiting to API endpoints"

# Output:
# 📊 Analyzing: Complexity VERY_HIGH, Risk MEDIUM
# 📋 Plan: 12 steps, 45 minutes, 15 files
# 🛡️ Guardian: Approved (within allowed paths)
# 🤖 Worker: DeepSeek V3 executing complex refactoring...
# 🔍 Review: PASS
# ✅ Complete - 15 files modified, all tests passing
```

---

## Best Practices

### 1. Always Use Guardian

```bash
# Good
claude-safe "add feature"

# Risky (no protection)
claude "add feature"  # Direct to Claude Code, no Guardian
```

### 2. Commit Before Big Changes

```bash
# Git integration protects you
git commit -am "Safe point before changes"
claude-safe "refactor everything"
# If breaks: git reset --hard HEAD
```

### 3. Start with Lenient Mode

```bash
# While learning
export GUARDIAN_STRICTNESS="lenient"

# Then increase as you get comfortable
export GUARDIAN_STRICTNESS="moderate"
export GUARDIAN_STRICTNESS="strict"
```

### 4. Review Warnings

```bash
# Don't ignore Guardian warnings
# ⚠️ Warning: Ensure proper password hashing
# → Add bcrypt hashing before proceeding
```

### 5. Use Appropriate Agents

```bash
# Simple task → Groq (fastest)
# Complex task → DeepSeek (smartest)
# Debugging → GLM API (your main model)
```

---

## Quick Reference

### File Structure

```
~/.claude-orchestrator/
├── .env                      # Configuration
├── claude-safe               # Main orchestrator
├── README.md                 # Basic docs
├── install.sh                # Installation script
├── scripts/
│   ├── analyze-task.sh       # Task analysis
│   ├── generate-plan.sh      # Plan generation
│   ├── guardian-audit.sh     # Guardian layer
│   ├── worker-agent.sh       # Worker agents
│   └── review-changes.sh     # Code review
└── config/
    └── policy.md             # Policy guidelines
```

### Key Commands

```bash
# Load environment
source ~/.claude-orchestrator/.env

# Main usage
claude-safe "your task here"

# Individual components
bash ~/.claude-orchestrator/scripts/analyze-task.sh "task" .
bash ~/.claude-orchestrator/scripts/guardian-audit.sh audit_plan "$PLAN" .
bash ~/.claude-orchestrator/scripts/review-changes.sh /dev/null .
```

### Environment Variables

```bash
# Guardian
export GUARDIAN_ENABLED="true"
export GUARDIAN_STRICTNESS="moderate"

# Workers
export DEEPSEEK_API_KEY="sk-..."
export GROQ_API_KEY="gsk-..."

# Safety
export ALLOWED_PATHS="./:./src:./tests"
export AUTO_ROLLBACK_ON_CRITICAL="true"
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error/Blocked |
| 2 | Rollback recommended |

---

## FAQ

**Q: Is this free?**
A: Yes! DeepSeek V3 and Groq are 100% free. Only GLM API uses your existing subscription.

**Q: Can the Guardian make mistakes?**
A: The Guardian is conservative. It may warn on safe code, but rarely blocks legitimate work.

**Q: What if I don't have git?**
A: Guardian will warn but still work. Set `USE_GIT="false"` in .env

**Q: Can I disable the Guardian?**
A: Yes, set `GUARDIAN_ENABLED="false"`, but not recommended!

**Q: Which worker should I use?**
A: Use "auto" - the system selects the best agent for your task.

**Q: How do I see what workers are doing?**
A: Set `LOG_LEVEL="DEBUG"` to see detailed logs.

---

## Support

For issues or questions:
1. Check this documentation
2. Run tests in "Troubleshooting" section
3. Check `~/.claude-orchestrator/logs/` (if enabled)
4. Review Guardian warnings carefully

---

## Version

**Version:** 1.0.0
**Last Updated:** 2026-01-28
**Architecture:** Guardian-Supervised Multi-Agent System

---

## License

This is a personal orchestration system for Claude Code CLI. Use at your own risk. Always review changes before applying to production code.

---

**🛡️ Your GLM 4.7 Guardian watches over all workers, ensuring you stay safe!**
