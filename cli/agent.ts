#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AGENT CLI
 * Command-line interface for running agent tasks
 *
 * Usage:
 *   bun cli/agent.ts "your task description"
 *   bun cli/agent.ts --type=scrape "extract data from https://example.com"
 *   bun cli/agent.ts --type=message "send email to john@example.com"
 *
 * Auto-extracts URLs from goal text for scrape/automation tasks.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { runSkalesTask } from "../server/skales-bridge"
import { type AgentTaskInput, type AgentTaskType, createAgentTask } from "../types/agent-task"

// ═══════════════════════════════════════════════════════════════════════════════
// URL EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract first URL from text
 */
function extractUrl(text: string): string | undefined {
  const match = text.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/)
  return match?.[0]
}

/**
 * Extract all URLs from text
 */
function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/g)
  return matches || []
}

/**
 * Auto-populate input based on task type and goal text
 */
function buildTaskInput(type: AgentTaskType, goal: string): AgentTaskInput | undefined {
  const url = extractUrl(goal)
  const _urls = extractUrls(goal)

  switch (type) {
    case "scrape":
    case "automation":
      return url ? { url } : undefined

    case "message": {
      // Try to extract email-like recipient
      const emailMatch = goal.match(/[\w.-]+@[\w.-]+\.\w+/)
      const phoneMatch = goal.match(/\+?\d{10,15}/)
      return {
        recipient: emailMatch?.[0] || phoneMatch?.[0],
        content: goal,
      }
    }
    default:
      return undefined
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI PARSING
// ═══════════════════════════════════════════════════════════════════════════════

// Parse CLI arguments
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`
Agent CLI - Execute tasks via Skales bridge (Playwright-powered)

Usage:
  bun cli/agent.ts "your task description"
  bun cli/agent.ts --type=<type> "task goal"

Task Types:
  scrape      Extract data from URLs (auto-detects URLs in goal)
  message     Send messages (email, WhatsApp, etc.)
  automation  Browser automation workflows (click, type, scroll)
  research    Research and summarize information

Options:
  --type=<type>     Task type (default: auto-detect from goal)
  --priority=<p>    Priority: low, medium, high (default: medium)
  --timeout=<ms>    Timeout in milliseconds (default: 30000)
  --url=<url>       Explicit URL (overrides auto-detection)
  --selector=<s>    CSS selector for scrape target

Examples:
  # Auto-detect type and URL
  bun cli/agent.ts "scrape https://talabat.com for restaurant data"

  # Explicit scrape with URL in goal
  bun cli/agent.ts --type=scrape "Extract pricing from https://example.com"

  # Message task
  bun cli/agent.ts --type=message "Send update to john@example.com"

  # Automation
  bun cli/agent.ts --type=automation "Click login button on https://site.com"
`)
  process.exit(0)
}

// Parse options
let taskType: AgentTaskType | undefined
let priority: "low" | "medium" | "high" = "medium"
let timeoutMs = 30000
let explicitUrl: string | undefined
let selector: string | undefined
let goal = ""

for (const arg of args) {
  if (arg.startsWith("--type=")) {
    const type = arg.split("=")[1]
    if (["scrape", "message", "automation", "research"].includes(type)) {
      taskType = type as AgentTaskType
    } else {
      console.error(`Invalid type: ${type}. Using auto-detection.`)
    }
  } else if (arg.startsWith("--priority=")) {
    const p = arg.split("=")[1]
    if (["low", "medium", "high"].includes(p)) {
      priority = p as "low" | "medium" | "high"
    }
  } else if (arg.startsWith("--timeout=")) {
    const t = Number.parseInt(arg.split("=")[1], 10)
    if (!Number.isNaN(t)) {
      timeoutMs = t
    }
  } else if (arg.startsWith("--url=")) {
    explicitUrl = arg.split("=")[1]
  } else if (arg.startsWith("--selector=")) {
    selector = arg.split("=")[1]
  } else if (!arg.startsWith("--")) {
    goal = arg
  }
}

if (!goal) {
  console.error("Error: No task goal provided")
  console.error('Usage: bun cli/agent.ts "your task description"')
  process.exit(1)
}

// Auto-detect task type if not specified
if (!taskType) {
  const lowerGoal = goal.toLowerCase()
  if (
    lowerGoal.includes("scrape") ||
    lowerGoal.includes("extract") ||
    lowerGoal.includes("data from")
  ) {
    taskType = "scrape"
  } else if (
    lowerGoal.includes("send") ||
    lowerGoal.includes("message") ||
    lowerGoal.includes("email")
  ) {
    taskType = "message"
  } else if (
    lowerGoal.includes("click") ||
    lowerGoal.includes("automate") ||
    lowerGoal.includes("fill")
  ) {
    taskType = "automation"
  } else {
    taskType = "research"
  }
}

// Build input with auto-extraction
let input: AgentTaskInput | undefined
if (explicitUrl) {
  input = { url: explicitUrl, selector }
} else {
  input = buildTaskInput(taskType, goal)
  if (selector && input) {
    input.selector = selector
  }
}

// Create task
const task = createAgentTask(taskType, goal, {
  input,
  constraints: { timeoutMs },
  meta: {
    source: "cli",
    priority,
  },
})

// Display task info
console.log("\n╔══════════════════════════════════════════════════════════════╗")
console.log("║  AGENT CLI - Executing Task                                  ║")
console.log("╚══════════════════════════════════════════════════════════════╝")
console.log(`\n📋 Task ID:    ${task.id}`)
console.log(`📌 Type:       ${task.type}`)
console.log(`🎯 Goal:       ${task.goal}`)
if (input?.url) {
  console.log(`🔗 URL:        ${input.url}`)
}
if (input?.selector) {
  console.log(`🎯 Selector:   ${input.selector}`)
}
console.log(`⚡ Priority:   ${task.meta?.priority}`)
console.log(`⏱️  Timeout:    ${timeoutMs}ms`)
console.log("\n⏳ Executing...\n")

// Execute task
const startTime = Date.now()

try {
  const result = await runSkalesTask(task, {
    timeoutMs,
    onError: (err) => console.error("⚠️  Runner:", err),
  })

  const duration = Date.now() - startTime

  console.log("\n╔══════════════════════════════════════════════════════════════╗")
  console.log("║  RESULT                                                      ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log(`\n✅ Success:    ${result.success}`)
  console.log(`⏱️  Duration:   ${duration}ms`)
  if (result.retries && result.retries > 0) {
    console.log(`🔄 Retries:    ${result.retries}`)
  }

  if (result.error) {
    console.log(`❌ Error:      ${result.error}`)
  }

  if (result.data) {
    console.log("\n📦 Data:")

    // Pretty print based on data type
    const data = result.data as Record<string, unknown>
    if (data.title) console.log(`   Title: ${data.title}`)
    if (data.url) console.log(`   URL: ${data.url}`)
    if (data.content) {
      const preview =
        typeof data.content === "string"
          ? data.content.slice(0, 500) + (data.content.length > 500 ? "..." : "")
          : data.content
      console.log(
        `   Content (${typeof data.content === "string" ? data.content.length : "?"} chars):\n`
      )
      console.log(
        `   ${typeof preview === "string" ? preview.split("\n").join("\n   ") : JSON.stringify(preview, null, 2)}`
      )
    }
    if (data.links && Array.isArray(data.links)) {
      console.log(`   Links: ${data.links.length} found`)
      data.links.slice(0, 5).forEach((link: { text?: string; href?: string }) => {
        console.log(`     - ${link.text?.slice(0, 40) || "(no text)"}: ${link.href?.slice(0, 60)}`)
      })
    }
    if (!data.title && !data.url && !data.content && !data.links) {
      console.log(JSON.stringify(data, null, 2))
    }
  }

  process.exit(result.success ? 0 : 1)
} catch (err) {
  const duration = Date.now() - startTime

  console.log("\n╔══════════════════════════════════════════════════════════════╗")
  console.log("║  ERROR                                                       ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log(`\n❌ ${(err as Error).message}`)
  console.log(`⏱️  Duration: ${duration}ms`)

  process.exit(1)
}
