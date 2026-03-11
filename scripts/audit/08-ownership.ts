#!/usr/bin/env bun
/**
 * LAYER 08: OWNERSHIP & CODEOWNERS VALIDATION
 *
 * Validates file ownership and permission boundaries.
 *
 * Checks:
 * - CODEOWNERS file exists
 * - Files have designated owners
 * - No modifications to owned files without permission
 * - Shared components are read-only
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// OWNERSHIP RULES
// ═══════════════════════════════════════════════════════════════

const PROTECTED_PATHS = [
  "styles/tokens.css",
  "styles/globals.css",
  "scripts/audit/",
  ".github/",
  "documentation/",
]

const SHARED_COMPONENTS_PATH = "components/shared/"

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function runGitCommand(command: string): string {
  try {
    return execSync(command, {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim()
  } catch {
    return ""
  }
}

function parseCodeowners(content: string): Map<string, string> {
  const owners = new Map<string, string>()

  const lines = content.split("\n")
  lines.forEach((line) => {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || !line.trim()) return

    // Parse: <pattern> <owner>
    const parts = line.trim().split(/\s+/)
    if (parts.length >= 2) {
      const pattern = parts[0]
      const owner = parts.slice(1).join(" ")
      owners.set(pattern, owner)
    }
  })

  return owners
}

function getFileOwner(filePath: string, codeowners: Map<string, string>): string | null {
  // Check for exact match first
  if (codeowners.has(filePath)) {
    return codeowners.get(filePath)!
  }

  // Check for pattern matches
  for (const [pattern, owner] of codeowners.entries()) {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"))
      if (regex.test(filePath)) {
        return owner
      }
    } else if (filePath.startsWith(pattern)) {
      return owner
    }
  }

  return null
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check if CODEOWNERS exists
const codeownersPath = ".github/CODEOWNERS"

if (!existsSync(codeownersPath)) {
  violations.push({
    type: "MISSING_CODEOWNERS",
    severity: "high",
    file: codeownersPath,
    message: "CODEOWNERS file not found",
    fix: "Create .github/CODEOWNERS to define file ownership",
  })
} else {
  try {
    const codeownersContent = readFileSync(codeownersPath, "utf-8")
    const codeowners = parseCodeowners(codeownersContent)

    // Check if protected paths have owners
    PROTECTED_PATHS.forEach((path) => {
      const owner = getFileOwner(path, codeowners)
      if (!owner) {
        violations.push({
          type: "UNOWNED_PROTECTED_PATH",
          severity: "high",
          file: path,
          message: `Protected path has no owner: ${path}`,
          fix: `Add to CODEOWNERS: ${path} @owner`,
        })
      }
    })

    // Check if shared components have owners
    if (existsSync(SHARED_COMPONENTS_PATH)) {
      const owner = getFileOwner(SHARED_COMPONENTS_PATH, codeowners)
      if (!owner) {
        violations.push({
          type: "UNOWNED_SHARED_COMPONENTS",
          severity: "high",
          file: SHARED_COMPONENTS_PATH,
          message: "Shared components have no owner",
          fix: `Add to CODEOWNERS: ${SHARED_COMPONENTS_PATH}* @owner`,
        })
      }
    }

    // Check for modified files in Git
    const modifiedFiles = runGitCommand("git diff --name-only HEAD")

    if (modifiedFiles) {
      modifiedFiles.split("\n").forEach((file) => {
        // Check if file is in protected path
        const isProtected = PROTECTED_PATHS.some((path) => file.startsWith(path))

        if (isProtected) {
          const owner = getFileOwner(file, codeowners)
          violations.push({
            type: "PROTECTED_FILE_MODIFIED",
            severity: "critical",
            file,
            message: `Protected file modified: ${file}${owner ? ` (owner: ${owner})` : ""}`,
            fix: owner
              ? `Get approval from ${owner} before modifying`
              : "Revert changes or get approval",
          })
        }

        // Check if modifying shared components
        if (file.startsWith(SHARED_COMPONENTS_PATH)) {
          const owner = getFileOwner(file, codeowners)
          violations.push({
            type: "SHARED_COMPONENT_MODIFIED",
            severity: "high",
            file,
            message: `Shared component modified: ${file}${owner ? ` (owner: ${owner})` : ""}`,
            fix: owner
              ? `Shared components are read-only. Get approval from ${owner}`
              : "Revert changes or create new component",
          })
        }
      })
    }
  } catch (_error) {
    violations.push({
      type: "INVALID_CODEOWNERS",
      severity: "high",
      file: codeownersPath,
      message: "CODEOWNERS file is invalid or unreadable",
      fix: "Fix CODEOWNERS syntax",
    })
  }
}

// Check for .guard folder ownership
if (!existsSync(".guard")) {
  violations.push({
    type: "MISSING_GUARD_FOLDER",
    severity: "medium",
    file: ".guard",
    message: "Guard folder missing (for session locks)",
    fix: "Create: mkdir .guard",
  })
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "ownership",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    codeownersExists: existsSync(codeownersPath),
    protectedPathsCount: PROTECTED_PATHS.length,
    guardFolderExists: existsSync(".guard"),
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
