#!/usr/bin/env node

/**
 * Coordinator System Validation
 * Verifies all prerequisites are met before using Coordinator
 */

const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

const checks = []
let passed = 0
let failed = 0

function check(name, test) {
  const result = test()
  checks.push({ name, passed: result })
  if (result) passed++
  else failed++
}

console.log("🔍 Coordinator System Validation\n")

// Check 1: coordinator-system.md exists
check("coordinator-system.md exists", () => {
  return fs.existsSync("coordinator-system.md")
})

// Check 2: Design tokens file exists
check("styles/tokens.css exists", () => {
  return fs.existsSync("styles/tokens.css")
})

// Check 3: TypeScript strict mode
check("TypeScript strict mode enabled", () => {
  const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"))
  return tsconfig.compilerOptions?.strict === true
})

// Check 4: Build commands work
try {
  execSync("bun run check:ts", { stdio: "pipe" })
  check("bun run check:ts works", () => true)
} catch {
  check("bun run check:ts works", () => false)
}

try {
  execSync("bun run check", { stdio: "pipe" })
  check("bun run check works", () => true)
} catch {
  check("bun run check works", () => false)
}

try {
  execSync("bun run build", { stdio: "pipe", timeout: 120000 })
  check("bun run build works", () => true)
} catch {
  check("bun run build works", () => false)
}

// Print results
console.log("\n📊 Results:\n")

checks.forEach(({ name, passed }) => {
  console.log(`  ${passed ? "✅" : "❌"} ${name}`)
})

console.log(`\n${passed} passed, ${failed} failed\n`)

if (failed > 0) {
  console.log("❌ Validation failed. Fix issues before using Coordinator.\n")
  process.exit(1)
} else {
  console.log("✅ All checks passed. Coordinator ready to use!\n")
  process.exit(0)
}
