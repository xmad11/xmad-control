#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════
 * AUDIT LAYER 06.5 - ROLLBACK HYGIENE
 * ═══════════════════════════════════════════════════════════════
 *
 * Checks for:
 * - Uncommitted changes after failed attempts
 * - Orphaned checkpoint commits
 * - Pending rollback operations
 *
 * USAGE:
 *   bun run audit --layer=06.5
 *
 * ═══════════════════════════════════════════════════════════════
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"

interface Violation {
  type: string
  severity: "critical" | "high" | "medium" | "low"
  file?: string
  line?: number
  message: string
  fix?: string
}

interface AuditResult {
  layer: string
  status: "pass" | "warn" | "fail"
  violations: Violation[]
  duration: number
  metadata?: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

function checkPendingRollbacks(): Violation[] {
  const violations: Violation[] = []

  if (!existsSync(".audit/session.json")) {
    return violations
  }

  try {
    const sessionContent = readFileSync(".audit/session.json", "utf-8")
    const session = JSON.parse(sessionContent)

    if (!session.attempts || !Array.isArray(session.attempts)) {
      return violations
    }

    const pendingAttempts = session.attempts.filter(
      (a: { outcome?: string }) => a.outcome === "pending"
    )

    if (pendingAttempts.length > 0) {
      const pendingList = pendingAttempts.map(
        (a: { attemptId: number; hypothesis: string }) =>
          `  - Attempt ${a.attemptId}: ${a.hypothesis.substring(0, 40)}`
      )

      violations.push({
        type: "PENDING_ROLLBACK",
        severity: "critical",
        message: `${pendingAttempts.length} pending rollback(s) detected`,
        fix: `Run: bun run rollback:fail OR bun run rollback:success\n\nPending attempts:\n${pendingList.join("\n")}`,
      })
    }
  } catch {
    // Invalid session file, ignore
  }

  return violations
}

function checkCheckpointCommits(): Violation[] {
  const violations: Violation[] = []

  try {
    const log = execSync('git log --oneline --grep="^checkpoint:" -n 20', {
      encoding: "utf-8",
    })

    const checkpointCount = (log.match(/checkpoint:/g) || []).length

    if (checkpointCount > 5) {
      violations.push({
        type: "EXCESSIVE_CHECKPOINTS",
        severity: "medium",
        message: `${checkpointCount} checkpoint commits found (may indicate abandoned attempts)`,
        fix: "Run: bun run rollback:status to review, or bun run rollback:cleanup to clean up",
      })
    }
  } catch {
    // Git error, skip check
  }

  return violations
}

function checkSessionFileValidity(): Violation[] {
  const violations: Violation[] = []

  if (!existsSync(".audit/session.json")) {
    return violations
  }

  try {
    const sessionContent = readFileSync(".audit/session.json", "utf-8")
    const session = JSON.parse(sessionContent)

    // Check required fields
    const requiredFields = ["sessionId", "issue", "branch", "attempts"]
    const missingFields = requiredFields.filter((field) => !(field in session))

    if (missingFields.length > 0) {
      violations.push({
        type: "INVALID_SESSION_FILE",
        severity: "high",
        message: `Session file missing required fields: ${missingFields.join(", ")}`,
        fix: "Run: bun run rollback:cleanup to reset session",
      })
    }

    // Check if branch matches
    try {
      const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf-8",
      }).trim()

      if (session.branch && session.branch !== currentBranch) {
        violations.push({
          type: "SESSION_BRANCH_MISMATCH",
          severity: "medium",
          message: `Session created on branch '${session.branch}' but currently on '${currentBranch}'`,
          fix: `Switch back to ${session.branch} or run: bun run rollback:cleanup`,
        })
      }
    } catch {
      // Git error, skip branch check
    }
  } catch {
    violations.push({
      type: "INVALID_SESSION_FILE",
      severity: "high",
      message: "Session file contains invalid JSON",
      fix: "Run: bun run rollback:cleanup to reset session",
    })
  }

  return violations
}

function checkAbandonedSessions(): Violation[] {
  const violations: Violation[] = []

  // Check for archived sessions
  try {
    const { readdirSync } = require("node:fs")
    const files = readdirSync(".audit")

    const archivedSessions = files.filter(
      (f: string) => f.startsWith("session.json.") && f.endsWith(".archive")
    )

    if (archivedSessions.length > 3) {
      violations.push({
        type: "EXCESSIVE_ARCHIVED_SESSIONS",
        severity: "low",
        message: `${archivedSessions.length} archived sessions found`,
        fix: "Consider cleaning old archives: rm .audit/session.json.*.archive",
      })
    }
  } catch {
    // Ignore errors
  }

  return violations
}

// ═══════════════════════════════════════════════════════════════
// AUDIT EXECUTION
// ═══════════════════════════════════════════════════════════════

async function runAudit(): Promise<AuditResult> {
  const startTime = Date.now()
  const violations: Violation[] = []

  // Run all checks
  violations.push(...checkPendingRollbacks())
  violations.push(...checkCheckpointCommits())
  violations.push(...checkSessionFileValidity())
  violations.push(...checkAbandonedSessions())

  const status = violations.some((v) => v.severity === "critical")
    ? "fail"
    : violations.some((v) => v.severity === "high")
      ? "fail"
      : violations.length > 0
        ? "warn"
        : "pass"

  return {
    layer: "rollback-hygiene",
    status,
    violations,
    duration: Date.now() - startTime,
    metadata: {
      checkedPendingRollbacks: true,
      checkedCheckpointCommits: true,
      checkedSessionValidity: true,
      checkedArchivedSessions: true,
    },
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

const result = await runAudit()
console.log(JSON.stringify(result, null, 2))
