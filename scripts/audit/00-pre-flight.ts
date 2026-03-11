#!/usr/bin/env bun
/**
 * LAYER 00: PRE-FLIGHT CHECKS
 *
 * Validates the environment before running other audits:
 * - Bun version
 * - Required tools installed
 * - Project structure intact
 * - Configuration files present
 */

import { execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { formatResult, outputResult } from "./lib/reporter"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check Bun version
try {
  const bunVersion = execSync("bun --version", { encoding: "utf-8" }).trim()
  const major = Number.parseInt(bunVersion.split(".")[0])
  if (major < 1) {
    violations.push({
      type: "OUTDATED_BUN",
      severity: "high",
      message: `Bun version ${bunVersion} is outdated. Requires >= 1.0.0`,
      fix: "Run: curl -fsSL https://bun.sh/install | bash",
    })
  }
} catch {
  violations.push({
    type: "BUN_NOT_FOUND",
    severity: "critical",
    message: "Bun runtime not found",
    fix: "Install Bun: https://bun.sh",
  })
}

// Check required files
const REQUIRED_FILES = [
  "package.json",
  "tsconfig.json",
  "biome.json",
  ".gitignore",
  "styles/tokens.css",
  "styles/globals.css",
  "context/ThemeContext.tsx",
]

REQUIRED_FILES.forEach((file) => {
  if (!existsSync(file)) {
    violations.push({
      type: "MISSING_FILE",
      severity: "critical",
      message: `Required file missing: ${file}`,
      fix: `Create ${file} with proper configuration`,
    })
  }
})

// Check required folders
const REQUIRED_FOLDERS = ["app", "components", "context", "styles", "scripts", "components/icons"]

REQUIRED_FOLDERS.forEach((folder) => {
  if (!existsSync(folder)) {
    violations.push({
      type: "MISSING_FOLDER",
      severity: "high",
      message: `Required folder missing: ${folder}`,
      fix: `Create folder: mkdir -p ${folder}`,
    })
  }
})

// Check Git repository
try {
  execSync("git rev-parse --git-dir", { stdio: "ignore" })
} catch {
  violations.push({
    type: "NOT_GIT_REPO",
    severity: "critical",
    message: "Not a Git repository",
    fix: "Initialize Git: git init",
  })
}

// Check for OKLCH color system in tokens.css
if (existsSync("styles/tokens.css")) {
  const tokensContent = require("node:fs").readFileSync("styles/tokens.css", "utf-8")
  if (!tokensContent.includes("oklch(")) {
    violations.push({
      type: "NO_OKLCH_SYSTEM",
      severity: "critical",
      message: "tokens.css doesn't use OKLCH color system (required for restaurant platform)",
      fix: "Update tokens.css to use OKLCH color format: oklch(lightness chroma hue)",
    })
  }
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = formatResult("pre-flight", violations)
outputResult(result)
process.exit(result.status === "fail" ? 1 : 0)
