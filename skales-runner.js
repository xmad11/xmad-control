#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SKALES RUNNER - Real Execution Layer
 * Execution adapter for xmad-control bridge with Playwright integration
 *
 * Responsibilities:
 * - Parse incoming task from stdin (JSON)
 * - Route to appropriate handler based on task.type
 * - Execute with Playwright/Integrations/Tools
 * - Retry on failure (agent loop)
 * - Return result as JSON to stdout
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { chromium } from "playwright"

// Buffer stdin data
let inputBuffer = ""

process.stdin.on("data", (chunk) => {
  inputBuffer += chunk.toString()
})

process.stdin.on("end", async () => {
  try {
    const task = JSON.parse(inputBuffer)

    // Validate task structure
    if (!task.id || !task.type || !task.goal) {
      respond({ success: false, error: "Invalid task: missing id, type, or goal" })
      return
    }

    // Execute with agent loop (retry logic)
    const result = await agentLoop(task)
    respond(result)
  } catch (e) {
    respond({ success: false, error: `Parse error: ${e.message}` })
  }
})

/**
 * Send JSON response to stdout and exit
 */
function respond(data) {
  process.stdout.write(JSON.stringify(data, null, 2))
  process.exit(data.success === false ? 1 : 0)
}

/**
 * Log to stderr (doesn't interfere with stdout JSON)
 */
function log(...args) {
  console.error("[Skales]", ...args)
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT LOOP (ReAct-style retry)
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_RETRIES = 3

async function agentLoop(task) {
  const maxRetries = task.constraints?.maxRetries ?? MAX_RETRIES
  let attempts = 0
  let lastError = null

  while (attempts < maxRetries) {
    attempts++
    log(`Attempt ${attempts}/${maxRetries}`)

    try {
      let result

      switch (task.type) {
        case "scrape":
          result = await runScrape(task)
          break
        case "message":
          result = await runMessage(task)
          break
        case "automation":
          result = await runAutomation(task)
          break
        case "research":
          result = await runResearch(task)
          break
        default:
          return { success: false, error: `Unknown task type: ${task.type}` }
      }

      // Success - return result with retry count
      return { ...result, retries: attempts - 1 }
    } catch (e) {
      lastError = e
      log(`Attempt ${attempts} failed: ${e.message}`)

      // Don't retry on validation errors
      if (e.message.includes("Missing") || e.message.includes("Invalid")) {
        return { success: false, error: e.message, retries: attempts }
      }

      // Wait before retry (exponential backoff)
      if (attempts < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempts - 1), 5000)
        log(`Waiting ${delayMs}ms before retry...`)
        await sleep(delayMs)
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    error: lastError?.message || "All retries exhausted",
    retries: attempts,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK HANDLERS (Playwright-powered)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scrape content from a URL using Playwright
 * Real browser automation for JavaScript-rendered pages
 */
async function runScrape(task) {
  const { goal, input } = task

  if (!input?.url) {
    throw new Error("Missing input.url for scrape task")
  }

  const url = input.url
  const selector = input.selector || "body"
  const timeout = task.constraints?.timeoutMs || 15000

  log(`Scraping: ${url}`)
  log(`Goal: ${goal}`)

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()

    // Set reasonable timeout
    page.setDefaultTimeout(timeout)

    // Navigate to URL
    log(`Navigating to ${url}...`)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout })

    // Wait for content to load
    await page.waitForSelector(selector, { timeout: 5000 }).catch(() => {
      log(`Selector "${selector}" not found, using body`)
    })

    // Extract data
    const title = await page.title()
    const url_final = page.url()

    const content = await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      return el.innerText.slice(0, 5000)
    }, selector)

    // Extract links if requested
    const links = input.extractLinks
      ? await page.evaluate(() => {
          return Array.from(document.querySelectorAll("a[href]"))
            .slice(0, 50)
            .map((a) => ({
              text: a.innerText.trim().slice(0, 100),
              href: a.href,
            }))
        })
      : null

    log(`Scrape complete: ${content?.length || 0} chars`)

    return {
      success: true,
      data: {
        url: url_final,
        title,
        content,
        links,
        timestamp: new Date().toISOString(),
      },
    }
  } finally {
    await browser.close()
  }
}

/**
 * Send a message (email, WhatsApp, etc.)
 * TODO: Integrate with Gmail API, WhatsApp Business API, etc.
 */
async function runMessage(task) {
  const { goal, input } = task
  const recipient = input?.recipient
  const content = input?.content || goal

  log(`Sending message to: ${recipient || "no recipient"}`)
  log(`Goal: ${goal}`)

  if (!recipient) {
    throw new Error("Missing input.recipient for message task")
  }

  // Simulate sending delay
  await sleep(300)

  return {
    success: true,
    data: {
      recipient,
      content,
      sentAt: new Date().toISOString(),
      messageId: `msg_${Date.now()}`,
    },
  }
}

/**
 * Run browser automation with Playwright
 * Supports click, type, scroll, wait actions
 */
async function runAutomation(task) {
  const { goal, input } = task
  const url = input?.url
  const actions = input?.actions || []
  const selector = input?.selector
  const action = input?.action

  log(`Automation: ${action || actions.length + " actions"}`)
  log(`Goal: ${goal}`)

  if (!url) {
    throw new Error("Missing input.url for automation task")
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()
    const timeout = task.constraints?.timeoutMs || 30000
    page.setDefaultTimeout(timeout)

    // Navigate
    log(`Navigating to ${url}...`)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout })

    // Execute single action or action sequence
    if (action && selector) {
      await executeAction(page, action, selector, input?.value)
    } else if (actions.length > 0) {
      for (const a of actions) {
        await executeAction(page, a.action, a.selector, a.value)
      }
    }

    // Get final state
    const title = await page.title()
    const url_final = page.url()

    return {
      success: true,
      data: {
        action: action || "multi",
        result: `Automation completed: ${goal}`,
        finalUrl: url_final,
        title,
        timestamp: new Date().toISOString(),
      },
    }
  } finally {
    await browser.close()
  }
}

/**
 * Execute a single browser action
 */
async function executeAction(page, action, selector, value) {
  log(`Action: ${action} on ${selector}`)

  switch (action) {
    case "click":
      await page.click(selector)
      break
    case "type":
      await page.fill(selector, value || "")
      break
    case "scroll":
      await page.locator(selector).scrollIntoViewIfNeeded()
      break
    case "wait":
      await page.waitForSelector(selector)
      break
    case "screenshot":
      await page.screenshot({ path: value || "screenshot.png" })
      break
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

/**
 * Perform research task
 * TODO: Integrate with web search APIs, LLM summarization, etc.
 */
async function runResearch(task) {
  const { goal } = task

  log(`Researching: ${goal}`)

  // Special case: health check ping
  if (goal === "ping") {
    return { success: true, data: { pong: true } }
  }

  // Simulate research delay
  await sleep(500)

  return {
    success: true,
    data: {
      query: goal,
      summary: `Research results for: ${goal}`,
      sources: ["https://example.com/source1", "https://example.com/source2"],
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Utility: Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

process.on("uncaughtException", (err) => {
  respond({ success: false, error: `Uncaught exception: ${err.message}` })
})

process.on("unhandledRejection", (reason) => {
  respond({ success: false, error: `Unhandled rejection: ${reason}` })
})
