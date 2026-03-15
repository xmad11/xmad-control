#!/usr/bin/env node

/**
 * XMAD Smoke HTTP Test
 * Validates endpoints against Vercel preview or production deployment
 * Run AFTER deployment to verify runtime health
 *
 * Usage:
 *   bun run smoke                    # Uses production URL
 *   VERCEL_URL=xxx bun run smoke     # Custom URL
 *   PREVIEW=true bun run smoke       # Attempts to detect preview URL
 */

const PRODUCTION_URL = "https://xmad-control.vercel.app"
const TIMEOUT_MS = 10000

// Color helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
}

function log(color, ...args) {
  console.log(colors[color] || "", ...args, colors.reset)
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
  }
  return PRODUCTION_URL
}

async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

async function testEndpoint(name, url, options = {}) {
  const expectedStatus = options.expectedStatus || 200
  const checkHeaders = options.checkHeaders || {}
  const checkBody = options.checkBody

  process.stdout.write(`  ${name.padEnd(30)} `)

  try {
    const response = await fetchWithTimeout(url)

    // Status check
    if (response.status !== expectedStatus) {
      log("red", `❌ Expected ${expectedStatus}, got ${response.status}`)
      return false
    }

    // Header checks
    for (const [header, expected] of Object.entries(checkHeaders)) {
      const actual = response.headers.get(header)
      if (actual !== expected) {
        log("yellow", `⚠️  Header ${header}: expected "${expected}", got "${actual}"`)
      }
    }

    // Body check (if provided)
    if (checkBody) {
      const body = await response.text()
      if (!body.includes(checkBody)) {
        log("yellow", `⚠️  Body missing expected content: "${checkBody.substring(0, 50)}..."`)
      }
    }

    log("green", "✅ OK")
    return true
  } catch (error) {
    if (error.name === "AbortError") {
      log("red", `❌ Timeout after ${TIMEOUT_MS}ms`)
    } else {
      log("red", `❌ ${error.message}`)
    }
    return false
  }
}

async function runTests() {
  const baseUrl = getBaseUrl()
  const results = []

  console.log("")
  log("cyan", "══════════════════════════════════════════════════════")
  log("cyan", "   XMAD SMOKE HTTP TEST")
  log("cyan", "══════════════════════════════════════════════════════")
  console.log("")
  log("dim", `Target: ${baseUrl}`)
  console.log("")

  // Test endpoints
  const endpoints = [
    { name: "Homepage", path: "/" },
    { name: "Robots.txt", path: "/robots.txt" },
    { name: "Sitemap.xml", path: "/sitemap.xml" },
    { name: "Favicon", path: "/favicon.ico", expectedStatus: 200 },
    { name: "Logo", path: "/logo.svg" },
    { name: "Manifest", path: "/manifest.json" },
  ]

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint.path}`
    const passed = await testEndpoint(endpoint.name, url, {
      expectedStatus: endpoint.expectedStatus,
    })
    results.push({ name: endpoint.name, passed })
  }

  // Summary
  console.log("")
  log("cyan", "══════════════════════════════════════════════════════")
  const passed = results.filter((r) => r.passed).length
  const total = results.length

  if (passed === total) {
    log("green", `✅ ALL ${total} TESTS PASSED`)
  } else {
    log("red", `❌ ${total - passed}/${total} TESTS FAILED`)
  }
  log("cyan", "══════════════════════════════════════════════════════")
  console.log("")

  // Exit with appropriate code
  process.exit(passed === total ? 0 : 1)
}

// Run tests
runTests().catch((error) => {
  log("red", `Fatal error: ${error.message}`)
  process.exit(1)
})
