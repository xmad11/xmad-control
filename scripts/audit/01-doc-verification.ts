#!/usr/bin/env bun
/**
 * LAYER 01: DOCUMENTATION VERIFICATION
 *
 * Hash-based verification that all critical documentation exists
 * and has been read by agents before they can proceed.
 *
 * Checks:
 * - Required documentation files exist
 * - SHA-256 hash matches acknowledged version
 * - .guard/ACK_OK.json is valid and current
 */

import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// REQUIRED DOCUMENTATION
// ═══════════════════════════════════════════════════════════════

const REQUIRED_DOCS = [
  {
    path: "documentation/OWNER_CHEATSHEET.md",
    description: "Owner usage guide",
  },
  {
    path: "documentation/AGENT_INSTRUCTIONS.md",
    description: "Agent workflow guide",
  },
  {
    path: "documentation/DESIGN_SYSTEM_CANONICAL.md",
    description: "Design system and tokens",
  },
  {
    path: "documentation/MOBILE_FIRST.md",
    description: "Mobile-first principles",
  },
  {
    path: "documentation/COMPONENT_INVENTORY.md",
    description: "Component catalog and usage",
  },
]

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function calculateHash(filePath: string): string {
  try {
    const content = readFileSync(filePath, "utf-8")
    return createHash("sha256").update(content).digest("hex")
  } catch {
    return ""
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check all required docs exist
REQUIRED_DOCS.forEach((doc) => {
  if (!existsSync(doc.path)) {
    violations.push({
      type: "MISSING_DOCUMENTATION",
      severity: "critical",
      file: doc.path,
      message: `Required documentation missing: ${doc.description}`,
      fix: `Create ${doc.path} with proper content`,
    })
  }
})

// Check acknowledgment file
const ACK_FILE = ".guard/ACK_OK.json"

if (!existsSync(ACK_FILE)) {
  violations.push({
    type: "NO_ACKNOWLEDGMENT",
    severity: "critical",
    file: ACK_FILE,
    message: "Documentation has not been acknowledged. Agents must read docs before proceeding.",
    fix: "Run: bun run scripts/ack-docs.ts",
  })
} else {
  // Verify acknowledgment is valid
  try {
    const ackData = JSON.parse(readFileSync(ACK_FILE, "utf-8"))

    // Check timestamp (must be within last 30 days)
    const ackDate = new Date(ackData.timestamp)
    const now = new Date()
    const daysSince = (now.getTime() - ackDate.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSince > 30) {
      violations.push({
        type: "STALE_ACKNOWLEDGMENT",
        severity: "high",
        file: ACK_FILE,
        message: `Documentation acknowledgment is ${Math.floor(daysSince)} days old. Re-read required.`,
        fix: "Run: bun run scripts/ack-docs.ts",
      })
    }

    // Verify each doc hash matches
    REQUIRED_DOCS.forEach((doc) => {
      if (!existsSync(doc.path)) return // Already reported as missing

      const currentHash = calculateHash(doc.path)
      const ackedHash = ackData.docs?.[doc.path]

      if (!ackedHash) {
        violations.push({
          type: "UNACKNOWLEDGED_DOC",
          severity: "high",
          file: doc.path,
          message: `Documentation not acknowledged: ${doc.description}`,
          fix: "Run: bun run scripts/ack-docs.ts",
        })
      } else if (currentHash !== ackedHash) {
        violations.push({
          type: "DOC_MODIFIED",
          severity: "high",
          file: doc.path,
          message: `Documentation has been modified since acknowledgment: ${doc.description}`,
          fix: "Re-read documentation and run: bun run scripts/ack-docs.ts",
        })
      }
    })
  } catch (_error) {
    violations.push({
      type: "INVALID_ACKNOWLEDGMENT",
      severity: "critical",
      file: ACK_FILE,
      message: "Acknowledgment file is invalid or corrupted",
      fix: "Run: bun run scripts/ack-docs.ts",
    })
  }
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "doc-verification",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    totalDocs: REQUIRED_DOCS.length,
    ackFileExists: existsSync(ACK_FILE),
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
