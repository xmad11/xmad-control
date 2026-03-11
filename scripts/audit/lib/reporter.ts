/**
 * Shared reporting utilities for audit system
 */

import type { AuditResult, AuditStatus, Violation } from "./types"

/**
 * Determine audit status based on violations
 */
export function getStatus(violations: Violation[]): AuditStatus {
  if (violations.length === 0) return "pass"
  if (violations.some((v) => v.severity === "critical")) return "fail"
  return "warn"
}

/**
 * Format audit result with consistent structure
 */
export function formatResult(
  layer: string,
  violations: Violation[],
  metadata?: Record<string, unknown>
): AuditResult {
  return {
    layer,
    status: getStatus(violations),
    violations,
    metadata,
  }
}

/**
 * Output audit result as JSON
 */
export function outputResult(result: AuditResult): void {
  console.log(JSON.stringify(result, null, 2))
}

/**
 * Calculate summary from multiple audit results
 */
export function calculateSummary(results: AuditResult[]): {
  total: number
  passed: number
  warned: number
  failed: number
  totalViolations: number
  criticalViolations: number
} {
  const allViolations = results.flatMap((r) => r.violations)

  return {
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    warned: results.filter((r) => r.status === "warn").length,
    failed: results.filter((r) => r.status === "fail").length,
    totalViolations: allViolations.length,
    criticalViolations: allViolations.filter((v) => v.severity === "critical").length,
  }
}
