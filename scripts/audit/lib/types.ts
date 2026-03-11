/**
 * Shared types for audit system
 *
 * All audit layers use these consistent interfaces
 */

export interface Violation {
  type: string
  severity: "critical" | "high" | "medium" | "low"
  file?: string
  line?: number
  message: string
  fix?: string
}

export interface AuditResult {
  layer: string
  status: "pass" | "warn" | "fail"
  violations: Violation[]
  duration?: number
  metadata?: Record<string, unknown>
}

export interface AuditReport {
  timestamp: string
  branch: string
  commit: string
  projectName: string
  layers: AuditResult[]
  summary: {
    total: number
    passed: number
    warned: number
    failed: number
    totalViolations: number
    criticalViolations: number
  }
}

export type Severity = "critical" | "high" | "medium" | "low"
export type AuditStatus = "pass" | "warn" | "fail"
