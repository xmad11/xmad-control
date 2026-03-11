#!/usr/bin/env bun
/**
 * LAYER 06: GIT HEALTH & HYGIENE
 *
 * Validates Git repository state and branch protection.
 *
 * Checks:
 * - Clean working directory
 * - Correct branch naming
 * - No protected branch violations
 * - No large files
 * - Proper .gitignore
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync, statSync } from "node:fs"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// GIT RULES
// ═══════════════════════════════════════════════════════════════

// For template repositories, main/master are not protected
// Set GIT_PROTECTED_BRANCHES env var to override: GIT_PROTECTED_BRANCHES=main,master
const PROTECTED_BRANCHES =
  process.env.GIT_PROTECTED_BRANCHES?.split(",") ||
  (process.env.CI === "true" ? ["production"] : [])
const ALLOWED_BRANCH_PATTERNS = [/^feature\/.+/, /^bugfix\/.+/, /^hotfix\/.+/, /^agent\/.+/]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Files that should be gitignored
const SHOULD_BE_IGNORED = [
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "build",
  ".env.local",
  ".DS_Store",
  "*.log",
]

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

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check if Git repository
try {
  execSync("git rev-parse --git-dir", { stdio: "ignore" })
} catch {
  violations.push({
    type: "NOT_GIT_REPO",
    severity: "critical",
    message: "Not a Git repository",
    fix: "Initialize: git init",
  })

  // Exit early if not a Git repo
  const result = {
    layer: "git-health",
    status: "fail",
    violations,
  }
  console.log(JSON.stringify(result, null, 2))
  process.exit(1)
}

// Check current branch
const currentBranch = runGitCommand("git rev-parse --abbrev-ref HEAD")

if (PROTECTED_BRANCHES.includes(currentBranch)) {
  violations.push({
    type: "ON_PROTECTED_BRANCH",
    severity: "critical",
    message: `Currently on protected branch: ${currentBranch}`,
    fix: "Create feature branch: git checkout -b feature/your-task",
  })
}

// Check branch naming convention (skip for main/master/develop in template repos)
const TEMPLATE_BRANCHES = ["main", "master", "develop"]
const isValidBranch =
  ALLOWED_BRANCH_PATTERNS.some((pattern) => pattern.test(currentBranch)) ||
  TEMPLATE_BRANCHES.includes(currentBranch)

if (!isValidBranch && !PROTECTED_BRANCHES.includes(currentBranch)) {
  violations.push({
    type: "INVALID_BRANCH_NAME",
    severity: "high",
    message: `Branch name doesn't follow convention: ${currentBranch}`,
    fix: "Use: feature/*, bugfix/*, hotfix/*, or agent/* format",
  })
}

// Check for uncommitted changes (excluding .audit files which are auto-generated)
const status = runGitCommand("git status --porcelain")

if (status) {
  const nonAuditChanges = status.split("\n").filter((line) => !line.includes(".audit/"))
  if (nonAuditChanges.length > 0) {
    violations.push({
      type: "UNCOMMITTED_CHANGES",
      severity: "medium",
      message: `${nonAuditChanges.length} uncommitted changes detected`,
      fix: "Commit or stash changes before running audit",
    })
  }
}

// Check .gitignore
if (!existsSync(".gitignore")) {
  violations.push({
    type: "MISSING_GITIGNORE",
    severity: "high",
    file: ".gitignore",
    message: ".gitignore not found",
    fix: "Create .gitignore with proper exclusions",
  })
} else {
  const gitignoreContent = readFileSync(".gitignore", "utf-8")

  SHOULD_BE_IGNORED.forEach((pattern) => {
    if (!gitignoreContent.includes(pattern)) {
      violations.push({
        type: "INCOMPLETE_GITIGNORE",
        severity: "medium",
        file: ".gitignore",
        message: `Missing from .gitignore: ${pattern}`,
        fix: `Add "${pattern}" to .gitignore`,
      })
    }
  })
}

// Check for large files in git
const trackedFiles = runGitCommand("git ls-files")

if (trackedFiles) {
  trackedFiles.split("\n").forEach((file) => {
    if (existsSync(file)) {
      const stats = statSync(file)
      if (stats.size > MAX_FILE_SIZE) {
        violations.push({
          type: "LARGE_FILE_TRACKED",
          severity: "high",
          file,
          message: `Large file in Git: ${(stats.size / 1024 / 1024).toFixed(2)}MB`,
          fix: "Remove from Git and add to .gitignore",
        })
      }
    }
  })
}
// Check if node_modules or .next is tracked
;["node_modules", ".next", ".turbo"].forEach((folder) => {
  const isTracked = runGitCommand(`git ls-files ${folder}`)
  if (isTracked) {
    violations.push({
      type: "BUILD_FOLDER_TRACKED",
      severity: "critical",
      file: folder,
      message: `Build folder tracked in Git: ${folder}`,
      fix: `Remove: git rm -r --cached ${folder} && add to .gitignore`,
    })
  }
})

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "git-health",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    currentBranch,
    uncommittedChanges: status
      ? status.split("\n").filter((line) => !line.includes(".audit/")).length
      : 0,
    gitignoreExists: existsSync(".gitignore"),
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
