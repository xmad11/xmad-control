# Guardian Orchestrator 2026

> **SSOT-Compliant Multi-Agent AI Coding Orchestrator**
> Version: 2.2.0 | Updated: 2026-02-27

---

## Overview

Guardian Orchestrator 2026 is a bash-native, multi-agent AI coding system that orchestrates multiple LLM providers to complete coding tasks with automatic quality review and safety audits.

### Key Features

- **Multi-Agent Architecture**: 5 specialized agents for different task types
- **SSOT Compliant**: All API keys from macOS Keychain (no hardcoded secrets)
- **5-Stage Pipeline**: Analyze → Plan → Audit → Execute → Review
- **Automatic Fallback**: Graceful degradation across providers
- **Quality Scoring**: Every task gets a quality score (1-10)

---

## Quick Start

```bash
# Navigate to orchestrator
cd ~/.guardian-orchestrator-2026

# Check agent status
./claude-safe --status

# Run a task
./claude-safe "Add error handling to the API client" ./my-project

# View available models
./claude-safe --models

# Get help
./claude-safe --help
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GUARDIAN ORCHESTRATOR                    │
│                      (claude-safe)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ ANALYZE  │───▶│  PLAN    │───▶│ AUDIT    │
    │(classify)│    │(strategy)│    │(safety)  │
    └──────────┘    └──────────┘    └──────────┘
                                          │
                                          ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  OUTPUT  │◀───│  REVIEW  │◀───│  WORKER  │
    │ (result) │    │ (quality)│    │ (execute)│
    └──────────┘    └──────────┘    └──────────┘
```

---

## Agents

| Agent | Model | Provider | Role | Best For |
|-------|-------|----------|------|----------|
| **Guardian** | GLM-5 | z.ai | Safety audit | Plan review, security checks, quality control |
| **Coder** | Kimi K2 | Groq | Primary coding | Code generation, bug fixes, refactoring |
| **Reasoning** | Llama 3.3 70B | Groq | Complex logic | Architecture, algorithms, security |
| **Fast** | Llama 3.1 8B | Groq | Quick tasks | Simple edits, CRUD, questions |
| **Planner** | Gemini 2.5 Flash | Google | Analysis | Planning, large codebase analysis |
| **Workhorse** | Llama 3.3 70B | Groq | High volume | Repetitive tasks, formatting |

### Agent Selection

The system automatically selects agents based on:

1. **Task Complexity**
   - LOW → Fast Agent (Llama 3.1 8B)
   - MEDIUM → Coder Agent (Kimi K2)
   - HIGH → Reasoning Agent (Llama 3.3 70B)

2. **Task Type**
   - `CODE_GEN` → Coder
   - `ARCHITECTURE` → Reasoning
   - `ANALYSIS` → Planner
   - `CRUD` → Fast

---

## Pipeline Stages

### Stage 1: ANALYZE
- Classifies task complexity (LOW/MEDIUM/HIGH)
- Identifies task type (CODE_GEN, ARCHITECTURE, etc.)
- Selects optimal agent for the task
- Estimates token requirements

### Stage 2: PLAN
- Gemini 2.5 Flash generates detailed execution plan
- Includes risk assessment and rollback strategy
- Lists specific files to modify
- Creates validation checklist

### Stage 3: GUARDIAN AUDIT
- DeepSeek reviews plan for safety
- Checks for dangerous operations
- Can BLOCK, WARN, or APPROVE
- Risk score (1-10)

### Stage 4: WORKER EXECUTION
- Selected agent executes the plan
- Gathers file context automatically
- Falls back through agent chain on failure
- Produces complete code changes

### Stage 5: REVIEW
- Guardian reviews output quality
- Scores 1-10 based on completeness
- Checks for issues and improvements
- Final approval or rejection

---

## Configuration

### Environment Variables (.env)

```bash
# API Base URLs
GLM_BASE_URL="https://api.z.ai/api/paas/v4"
GROQ_BASE_URL="https://api.groq.com/openai/v1"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
DEEPSEEK_BASE_URL="https://api.deepseek.com/v1"

# Model Selection
GROQ_CODER_MODEL="moonshotai/kimi-k2-instruct"
GROQ_REASONING_MODEL="llama-3.3-70b-versatile"
GROQ_FAST_MODEL="llama-3.1-8b-instant"
GROQ_WORKHORSE_MODEL="llama-3.3-70b-versatile"
GEMINI_PLANNER_MODEL="gemini-2.5-flash"
GUARDIAN_MODEL="deepseek-chat"
```

### SSOT Keychain Entries

| Keychain Service | Purpose |
|------------------|---------|
| `SSOT_AI_GROQ` | Groq API key |
| `SSOT_AI_GEMINI_PRIMARY` | Gemini API key |
| `SSOT_AI_DEEPSEEK` | DeepSeek API key |
| `z.ai` / `claude-code` | GLM API key |

---

## File Structure

```
~/.guardian-orchestrator-2026/
├── claude-safe              # Main entry point
├── coordinator.json         # Agent configuration
├── .env                     # Environment variables
├── scripts/
│   ├── api-call.sh          # Universal API caller
│   ├── analyze-task.sh      # Task classifier
│   ├── generate-plan.sh     # Plan generator
│   ├── guardian-audit.sh    # Safety auditor
│   ├── worker-agent.sh      # Task executor
│   └── review-changes.sh    # Quality reviewer
├── logs/
│   ├── orchestrator-*.log   # Daily logs
│   └── sessions.log         # Session history
└── docs/
    └── SSOT_API_KEYS_GUIDE.md
```

---

## CLI Commands

```bash
# Run task in current directory
./claude-safe "your task description"

# Run task in specific project
./claude-safe "your task" /path/to/project

# Check all agents status
./claude-safe --status

# List configured models
./claude-safe --models

# Show help
./claude-safe --help
```

---

## Fallback Chain

When an agent fails, the system automatically tries the next in chain:

```
CODE_GEN:     Kimi K2 → Llama 3.3 70B → DeepSeek
ARCHITECTURE: Llama 3.3 70B → Kimi K2 → DeepSeek
ANALYSIS:     Gemini 2.5 Flash → Llama 3.1 8B → Llama 3.3 70B
GENERAL:      Llama 3.1 8B → Llama 3.3 70B → Kimi K2
CRUD:         Llama 3.1 8B → Llama 3.3 70B
```

---

## Rate Limits

| Provider | Daily Limit | Notes |
|----------|-------------|-------|
| Groq | ~1000 requests/day | Free tier |
| Gemini | ~250 requests/day | Free tier |
| DeepSeek | Pay per use | Fallback |

---

## Troubleshooting

### Agent Offline

```bash
# Check keychain
security find-generic-password -s "SSOT_AI_GROQ" -w

# Test directly
source .env && source scripts/api-call.sh
api_call "groq:llama-3.3-70b-versatile" "Say OK" "" "10"
```

### GLM Guardian Not Working

The GLM key may be invalid or rate-limited. The system automatically falls back to DeepSeek for Guardian audits.

### 429 Rate Limit

Wait and retry. Groq free tier has daily limits.

---

## SSOT Compliance

This orchestrator follows SSOT (Single Source of Truth) principles:

1. **No hardcoded secrets** - All keys from macOS Keychain
2. **No .env files with keys** - Only URLs and model names
3. **Runtime key retrieval** - Keys fetched at execution time
4. **Audit trail** - All sessions logged

---

## Related Documentation

| Document | Location |
|----------|----------|
| SSOT API Keys Guide | `~/Desktop/important-docs/SSOT_API_KEYS_GUIDE.md` |
| Guardian CLI Guide | `~/Desktop/important-docs/GUARDIAN_ORCHESTRATOR_GUIDE.md` |
| Key Registry | `~/KEY_REGISTRY.md` |
| Agent Policy | `~/AGENT_SECRET_POLICY.md` |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2026-02-26 | SSOT compliance, updated models, DeepSeek Guardian |
| 2.0.0 | 2026-02-25 | Initial 2026 release |

---

**Generated:** 2026-02-26
**Maintainer:** Guardian Orchestrator Team
