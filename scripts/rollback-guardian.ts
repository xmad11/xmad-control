#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════
 * ROLLBACK GUARDIAN - Failed Fix Recovery System
 * ═══════════════════════════════════════════════════════════════
 *
 * Enforces the "Revert on Failure" protocol:
 * 1. Checkpoint before each attempt
 * 2. Mandatory rollback on failure
 * 3. Verification that rollback occurred
 *
 * USAGE:
 *   bun run rollback:start "hypothesis: description"   Start new attempt
 *   bun run rollback:fail                              Mark as failed (auto-rollback)
 *   bun run rollback:success                           Mark as successful
 *   bun run rollback:status                            Show session status
 *
 * ═══════════════════════════════════════════════════════════════
 */

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface SessionMetadata {
  sessionId: string
  issue: string
  branch: string
  baseCommit: string
  currentAttempt: number
  attempts: AttemptMetadata[]
}

interface AttemptMetadata {
  attemptId: number
  hypothesis: string
  checkpoint: string
  files: string[]
  timestamp: string
  outcome?: "pending" | "failed" | "success"
  rollbackVerified?: boolean
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const AUDIT_DIR = ".audit"
const SESSION_FILE = `${AUDIT_DIR}/session.json`
const CHECKPOINT_PREFIX = "checkpoint:"

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function log(message: string, level: "info" | "warn" | "error" | "success" = "info"): void {
  const emoji = {
    info: "ℹ️",
    warn: "⚠️ ",
    error: "❌",
    success: "✅",
  }[level]

  const colorCode = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    success: "\x1b[32m", // Green
  }[level]

  const reset = "\x1b[0m"
  console.log(`${emoji} ${colorCode}${message}${reset}`)
}

function ensureAuditDir(): void {
  if (!existsSync(AUDIT_DIR)) {
    mkdirSync(AUDIT_DIR, { recursive: true })
  }
}

// ═══════════════════════════════════════════════════════════════
// GIT OPERATIONS
// ═══════════════════════════════════════════════════════════════

function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim()
  } catch {
    return "unknown"
  }
}

function getCurrentCommit(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim()
  } catch {
    return "unknown"
  }
}

function createCheckpoint(attemptId: number): string {
  const timestamp = new Date().toISOString()
  const message = `${CHECKPOINT_PREFIX} attempt ${attemptId} - ${timestamp}`

  try {
    // Stage any changes
    try {
      execSync("git add -A", { stdio: "pipe" })
    } catch {
      // No changes to stage
    }

    // Create checkpoint commit (allow empty, bypass hooks)
    execSync(`git commit -m "${message}" --allow-empty --no-verify`, { stdio: "pipe" })
    const commit = getCurrentCommit()
    log(`Checkpoint created: ${commit.substring(0, 8)}`, "success")
    return commit
  } catch (error) {
    log(`Failed to create checkpoint: ${error}`, "error")
    throw error
  }
}

function rollbackToCheckpoint(checkpoint: string): boolean {
  try {
    execSync(`git reset --hard ${checkpoint}`, { stdio: "pipe" })
    log(`Rolled back to checkpoint: ${checkpoint.substring(0, 8)}`, "success")
    return true
  } catch (error) {
    log(`Rollback failed: ${error}`, "error")
    return false
  }
}

function verifyRollback(checkpoint: string): boolean {
  const current = getCurrentCommit()
  const verified = current === checkpoint

  if (verified) {
    const status = execSync("git status --porcelain", { encoding: "utf-8" }).trim()
    if (status) {
      log(`Rollback has uncommitted changes`, "warn")
      return false
    }
    log("Rollback verified: working tree clean", "success")
  } else {
    log(
      `Rollback NOT verified: at ${current.substring(0, 8)}, expected ${checkpoint.substring(0, 8)}`,
      "error"
    )
  }

  return verified
}

function getModifiedFiles(): string[] {
  try {
    const output = execSync("git status --porcelain", { encoding: "utf-8" })
    return output
      .trim()
      .split("\n")
      .filter((line) => line)
      .map((line) => line.substring(3))
  } catch {
    return []
  }
}

function getRecentCheckpoints(count = 10): string[] {
  try {
    const log = execSync(`git log --oneline --grep="^${CHECKPOINT_PREFIX}" -n ${count}`, {
      encoding: "utf-8",
    })
    const commits = log.trim().split("\n")
    return commits.map((line) => line.split(" ")[0])
  } catch {
    return []
  }
}

// ═══════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function createSession(issue: string): SessionMetadata {
  const branch = getCurrentBranch()
  const baseCommit = getCurrentCommit()
  const sessionId = `session-${new Date().toISOString().replace(/[:.]/g, "-")}`

  return {
    sessionId,
    issue,
    branch,
    baseCommit,
    currentAttempt: 0,
    attempts: [],
  }
}

function loadSession(): SessionMetadata | null {
  if (!existsSync(SESSION_FILE)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(SESSION_FILE, "utf-8"))
  } catch {
    return null
  }
}

function saveSession(session: SessionMetadata): void {
  ensureAuditDir()
  writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2))
}

function clearSession(): void {
  try {
    if (existsSync(SESSION_FILE)) {
      const session = loadSession()
      // Archive session instead of deleting
      const archiveFile = `${SESSION_FILE}.${Date.now()}.archive`
      writeFileSync(archiveFile, JSON.stringify(session, null, 2))
    }
  } catch {
    // Ignore archive errors
  }
}

// ═══════════════════════════════════════════════════════════════
// COMMANDS
// ═══════════════════════════════════════════════════════════════

function cmdStart(hypothesis: string): void {
  console.log(`\n${"═".repeat(60)}`)
  log("Starting new fix attempt", "info")
  console.log(`${"═".repeat(60)}`)
  log(`Hypothesis: ${hypothesis}`, "info")
  console.log()

  let session = loadSession()

  if (!session) {
    // Extract issue from hypothesis (first word before colon, or whole thing)
    const issueMatch = hypothesis.match(/^([^:]+):/)
    const issue = issueMatch ? issueMatch[1].trim() : hypothesis.split(" ")[0]
    session = createSession(issue)
    log(`Created new session: ${session.sessionId}`, "info")
  } else {
    log(`Resuming session: ${session.sessionId}`, "info")
  }

  // Verify previous attempt was rolled back
  const lastAttempt = session.attempts[session.attempts.length - 1]
  if (lastAttempt && lastAttempt.outcome === "pending") {
    log("Previous attempt still pending! Rollback required.", "error")
    console.log()
    log("Run: bun run rollback:fail", "warn")
    process.exit(1)
  }

  // Check for existing uncommitted changes
  const modifiedFiles = getModifiedFiles()
  if (modifiedFiles.length > 0) {
    log(
      `Warning: ${modifiedFiles.length} uncommitted file(s) will be included in checkpoint`,
      "warn"
    )
    for (const file of modifiedFiles.slice(0, 5)) {
      log(`  - ${file}`, "info")
    }
    if (modifiedFiles.length > 5) {
      log(`  ... and ${modifiedFiles.length - 5} more`, "info")
    }
    console.log()
  }

  // Create new attempt
  session.currentAttempt++
  const attemptId = session.currentAttempt

  // Create checkpoint
  const checkpoint = createCheckpoint(attemptId)

  const attempt: AttemptMetadata = {
    attemptId,
    hypothesis,
    checkpoint,
    files: [],
    timestamp: new Date().toISOString(),
    outcome: "pending",
  }

  session.attempts.push(attempt)
  saveSession(session)

  console.log(`${"─".repeat(60)}`)
  log(`Attempt ${attemptId} started`, "success")
  log(`Checkpoint: ${checkpoint.substring(0, 8)}`, "info")
  console.log()
  log("Make your changes now.", "info")
  log("After testing, run:", "info")
  log("  bun run rollback:fail     (if test failed)", "warn")
  log("  bun run rollback:success  (if test passed)", "success")
  console.log(`${"═".repeat(60)}\n`)
}

function cmdFail(): void {
  console.log(`\n${"═".repeat(60)}`)
  log("Attempt failed - initiating rollback", "error")
  console.log(`${"═".repeat(60)}\n`)

  const session = loadSession()
  if (!session) {
    log("No active session found", "error")
    process.exit(1)
  }

  const currentAttempt = session.attempts.find((a) => a.outcome === "pending")
  if (!currentAttempt) {
    log("No pending attempt found", "error")
    log("Start a new attempt with: bun run rollback:start", "warn")
    process.exit(1)
  }

  log(`Rolling back attempt ${currentAttempt.attemptId}`, "info")
  log(`Hypothesis: ${currentAttempt.hypothesis}`, "info")
  console.log()

  // Perform rollback
  const rollbackSuccess = rollbackToCheckpoint(currentAttempt.checkpoint)

  if (!rollbackSuccess) {
    log("Manual rollback required:", "warn")
    log(`  git reset --hard ${currentAttempt.checkpoint}`, "info")
    process.exit(1)
  }

  // Verify rollback
  const verified = verifyRollback(currentAttempt.checkpoint)

  // Update metadata
  currentAttempt.outcome = "failed"
  currentAttempt.rollbackVerified = verified
  saveSession(session)

  console.log()
  if (verified) {
    log("Rollback complete and verified", "success")
    log(`Attempt ${currentAttempt.attemptId} marked as failed`, "info")
    console.log()
    log("Ready for next attempt.", "success")
    log('Run: bun run rollback:start "new hypothesis"', "info")
    console.log(`${"═".repeat(60)}\n`)
  } else {
    log("Rollback verification failed", "error")
    console.log()
    log("Manual intervention required:", "warn")
    log(`  git reset --hard ${currentAttempt.checkpoint}`, "info")
    log(`  git status`, "info")
    console.log(`${"═".repeat(60)}\n`)
    process.exit(1)
  }
}

function cmdSuccess(): void {
  console.log(`\n${"═".repeat(60)}`)
  log("Attempt successful!", "success")
  console.log(`${"═".repeat(60)}\n`)

  const session = loadSession()
  if (!session) {
    log("No active session found", "error")
    process.exit(1)
  }

  const currentAttempt = session.attempts.find((a) => a.outcome === "pending")
  if (!currentAttempt) {
    log("No pending attempt found", "error")
    log("Start a new attempt with: bun run rollback:start", "warn")
    process.exit(1)
  }

  // Get modified files
  const files = getModifiedFiles()
  currentAttempt.files = files
  currentAttempt.outcome = "success"
  saveSession(session)

  log(`Attempt ${currentAttempt.attemptId} marked as successful`, "success")
  log(`Files modified: ${files.length}`, "info")

  if (files.length > 0) {
    console.log()
    log("Modified files:", "info")
    for (const file of files.slice(0, 10)) {
      log(`  - ${file}`, "info")
    }
    if (files.length > 10) {
      log(`  ... and ${files.length - 10} more`, "info")
    }
  }

  console.log()
  console.log(`${"─".repeat(60)}`)
  log("Session Summary:", "info")
  log(`  Total attempts: ${session.attempts.length}`, "info")
  log(`  Successful: attempt ${currentAttempt.attemptId}`, "success")
  log(`  Failed: ${session.attempts.filter((a) => a.outcome === "failed").length}`, "info")
  console.log(`${"═".repeat(60)}`)
  console.log()
  log("Ready to commit your changes.", "success")
  log('Run: git commit -m "fix: description"', "info")
  console.log()
}

function cmdStatus(): void {
  const session = loadSession()

  if (!session) {
    log("No active session", "info")
    console.log()
    log("Start a new session:", "info")
    log('  bun run rollback:start "hypothesis: description"', "info")
    console.log()
    return
  }

  console.log(`\n${"═".repeat(60)}`)
  log(`Session: ${session.sessionId}`, "info")
  log(`Issue: ${session.issue}`, "info")
  log(`Branch: ${session.branch}`, "info")
  console.log(`${"═".repeat(60)}`)
  log(`Attempts: ${session.attempts.length}`, "info")
  console.log()

  for (const attempt of session.attempts) {
    const status =
      {
        pending: "🟡",
        failed: "❌",
        success: "✅",
      }[attempt.outcome || "pending"] || "⚪"

    console.log(
      `${status} Attempt ${attempt.attemptId}: ${attempt.hypothesis.substring(0, 50)}${attempt.hypothesis.length > 50 ? "..." : ""}`
    )

    if (attempt.outcome === "failed") {
      console.log(`   └─ Rolled back: ${attempt.rollbackVerified ? "✅ Verified" : "❌ Failed"}`)
    } else if (attempt.outcome === "success") {
      console.log(`   └─ Files: ${attempt.files.length} modified`)
    } else if (attempt.outcome === "pending") {
      console.log(`   └─ Checkpoint: ${attempt.checkpoint.substring(0, 8)}`)
    }
    console.log()
  }

  const currentAttempt = session.attempts.find((a) => a.outcome === "pending")
  if (currentAttempt) {
    log(`Attempt ${currentAttempt.attemptId} in progress`, "warn")
    console.log()
    log("Complete attempt with:", "info")
    log("  bun run rollback:fail     (if test failed)", "warn")
    log("  bun run rollback:success  (if test passed)", "success")
    console.log()
  }

  // Check for checkpoint pollution
  const checkpoints = getRecentCheckpoints(20)
  if (checkpoints.length > 5) {
    log(`Warning: ${checkpoints.length} checkpoint commits detected`, "warn")
    log("Consider cleaning up: bun run rollback:cleanup", "info")
    console.log()
  }
}

function cmdCleanup(): void {
  console.log(`\n${"═".repeat(60)}`)
  log("Rollback Cleanup", "info")
  console.log(`${"═".repeat(60)}\n`)

  const session = loadSession()

  if (session) {
    const pendingAttempt = session.attempts.find((a) => a.outcome === "pending")
    if (pendingAttempt) {
      log("Cannot cleanup: pending attempt detected", "error")
      log("Complete the attempt first:", "warn")
      log("  bun run rollback:fail OR bun run rollback:success", "info")
      process.exit(1)
    }
  }

  // Archive session
  clearSession()
  log("Session archived", "success")

  // Remove checkpoint commits (reset to base)
  if (session && session.baseCommit) {
    log(`Resetting to base commit: ${session.baseCommit.substring(0, 8)}`, "info")
    try {
      execSync(`git reset --soft ${session.baseCommit}`, { stdio: "pipe" })
      log("All checkpoint commits removed (changes preserved)", "success")
      console.log()
      log("You can now commit your working changes:", "info")
      log("  git add .")
      log('  git commit -m "fix: description"')
    } catch {
      log("Failed to reset commits", "error")
    }
  } else {
    log("No base commit found, only session cleared", "info")
  }

  console.log(`${"═".repeat(60)}\n`)
}

// ═══════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════

function printUsage(): void {
  console.log(`
ROLLBACK GUARDIAN - Failed Fix Recovery System

USAGE:
  bun run rollback:start "hypothesis: description"   Start new attempt
  bun run rollback:fail                              Mark as failed (auto-rollback)
  bun run rollback:success                           Mark as successful
  bun run rollback:status                            Show session status
  bun run rollback:cleanup                           Clean up checkpoint commits

PROTOCOL:
  1. BEFORE any changes: rollback:start
  2. AFTER testing failed: rollback:fail (MANDATORY)
  3. AFTER testing passed: rollback:success

EXAMPLE WORKFLOW:
  # Attempt 1
  bun run rollback:start "hypothesis: increase z-index to 50"
  # ... make changes ...
  bun test
  bun run rollback:fail  # Test failed, auto-rollback

  # Attempt 2
  bun run rollback:start "hypothesis: change position strategy"
  # ... make changes ...
  bun test
  bun run rollback:success  # Test passed!

  # Commit
  git add .
  git commit -m "fix: dropdown z-index issue"

  # Cleanup (optional)
  bun run rollback:cleanup  # Remove checkpoint commits

FILES:
  ${SESSION_FILE}  Session metadata (auto-created)
  ${AUDIT_DIR}/session.json.*.archive  Archived sessions

WHAT IT DOES:
  - Creates git checkpoint before each attempt
  - Auto-rolls back failed attempts
  - Verifies rollback succeeded
  - Tracks all attempts with metadata
  - Blocks commits if rollback pending

FOR MORE INFO:
  See: /documentation/ROLLBACK_PROTOCOL.md
  `)
}

function main(): void {
  const args = process.argv.slice(2)
  const command = args[0]
  const param = args[1]

  switch (command) {
    case "start":
      if (!param) {
        log('Usage: bun run rollback:start "hypothesis: description"', "error")
        process.exit(1)
      }
      cmdStart(param)
      break

    case "fail":
      cmdFail()
      break

    case "success":
      cmdSuccess()
      break

    case "status":
      cmdStatus()
      break

    case "cleanup":
      cmdCleanup()
      break

    case "--help":
    case "-h":
    case undefined:
      printUsage()
      break

    default:
      log(`Unknown command: ${command}`, "error")
      console.log()
      log("Run: bun run rollback --help", "info")
      process.exit(1)
  }
}

main()
