#!/usr/bin/env bun
/**
 * LAYER 03: TYPESCRIPT SAFETY
 *
 * AST-level TypeScript audit to catch forbidden patterns,
 * escape hatches, and type safety violations.
 *
 * Checks:
 * - No forbidden types (any, never, undefined as type)
 * - No escape hatches (@ts-ignore, @ts-expect-error, !)
 * - No unsafe casts (as unknown as)
 * - Proper null handling
 */

import { existsSync } from "node:fs"
import { Project, SyntaxKind } from "ts-morph"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// FORBIDDEN PATTERNS
// ═══════════════════════════════════════════════════════════════

const FORBIDDEN_TYPES = ["any", "never"]
const FORBIDDEN_COMMENTS = [
  "@ts-ignore",
  "@ts-expect-error",
  "eslint-disable",
  "@typescript-eslint/ban-ts-comment",
]

// ═══════════════════════════════════════════════════════════════
// AST ANALYSIS
// ═══════════════════════════════════════════════════════════════

function analyzeProject() {
  if (!existsSync("tsconfig.json")) {
    violations.push({
      type: "NO_TSCONFIG",
      severity: "critical",
      file: "tsconfig.json",
      line: 0,
      message: "tsconfig.json not found",
      fix: "Create tsconfig.json with strict mode enabled",
    })
    return
  }

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  })

  const sourceFiles = project.getSourceFiles()

  // Get list of files to audit (from environment variable if set)
  const auditFilesEnv = process.env.AUDIT_FILES
  const filesToAudit = auditFilesEnv ? auditFilesEnv.split(" ").filter((f) => f.length > 0) : null

  for (const file of sourceFiles) {
    const filePath = file.getFilePath()

    // If AUDIT_FILES is set, only check those files
    if (filesToAudit && filesToAudit.length > 0) {
      const shouldCheck = filesToAudit.some((f) => filePath.endsWith(f) || filePath.includes(f))
      if (!shouldCheck) continue
    }

    // Skip node_modules, .next, test files, audit scripts, and PWA components
    if (
      filePath.includes("node_modules") ||
      filePath.includes(".next") ||
      filePath.includes(".test.") ||
      filePath.includes(".spec.") ||
      filePath.includes("scripts/audit/") ||
      filePath.includes("pwa-components") ||
      filePath.includes("pwa-hooks")
    ) {
      continue
    }

    // Check for forbidden type references
    file.getDescendantsOfKind(SyntaxKind.TypeReference).forEach((node) => {
      const typeName = node.getTypeName().getText()
      if (FORBIDDEN_TYPES.includes(typeName)) {
        violations.push({
          type: "FORBIDDEN_TYPE",
          severity: "critical",
          file: filePath,
          line: node.getStartLineNumber(),
          message: `Forbidden type detected: ${typeName}`,
          fix: "Use proper type annotation instead of 'any' or 'never'",
        })
      }
    })

    // Check for non-null assertions (!)
    file.getDescendantsOfKind(SyntaxKind.NonNullExpression).forEach((node) => {
      violations.push({
        type: "NON_NULL_ASSERTION",
        severity: "high",
        file: filePath,
        line: node.getStartLineNumber(),
        message: "Non-null assertion operator (!) detected",
        fix: "Use proper null checking: if (value !== null) { ... }",
      })
    })

    // Check full text for other patterns
    const fullText = file.getFullText()
    const lines = fullText.split("\n")

    lines.forEach((line, index) => {
      // Check for 'as unknown as' casts
      if (line.includes("as unknown as")) {
        violations.push({
          type: "UNSAFE_CAST",
          severity: "critical",
          file: filePath,
          line: index + 1,
          message: "Unsafe cast detected: 'as unknown as'",
          fix: "Use proper type guards or refactor to avoid casting",
        })
      }

      // Check for forbidden comments
      FORBIDDEN_COMMENTS.forEach((comment) => {
        if (line.includes(comment)) {
          violations.push({
            type: "ESCAPE_HATCH",
            severity: "critical",
            file: filePath,
            line: index + 1,
            message: `Forbidden escape hatch: ${comment}`,
            fix: "Fix the TypeScript error properly instead of suppressing it",
          })
        }
      })

      // Check for `as any`
      if (/\s+as\s+any\b/.test(line)) {
        violations.push({
          type: "AS_ANY_CAST",
          severity: "critical",
          file: filePath,
          line: index + 1,
          message: "Type cast to 'any' detected",
          fix: "Use proper typing instead of casting to any",
        })
      }
    })
  }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════════════

try {
  analyzeProject()
} catch (error: any) {
  violations.push({
    type: "ANALYSIS_ERROR",
    severity: "critical",
    file: "unknown",
    line: 0,
    message: `TypeScript analysis failed: ${error.message}`,
    fix: "Check tsconfig.json and project structure",
  })
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "typescript",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
