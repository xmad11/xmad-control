#!/usr/bin/env bun
/**
 * AUDIT COMPARISON TOOL
 *
 * Compare two audit reports to see what changed
 */

import { existsSync, readFileSync } from "node:fs"

const [, , baselineFile, currentFile] = process.argv

if (!baselineFile || !currentFile) {
  console.log("Usage: bun run scripts/compare-audits.ts <baseline.json> <current.json>")
  process.exit(1)
}

if (!existsSync(baselineFile) || !existsSync(currentFile)) {
  console.error("❌ File not found")
  process.exit(1)
}

const baseline = JSON.parse(readFileSync(baselineFile, "utf-8"))
const current = JSON.parse(readFileSync(currentFile, "utf-8"))

console.log("═══════════════════════════════════════════════════════════")
console.log("📊 AUDIT COMPARISON")
console.log("═══════════════════════════════════════════════════════════")
console.log(`Baseline: ${new Date(baseline.timestamp).toLocaleString()}`)
console.log(`Current:  ${new Date(current.timestamp).toLocaleString()}`)
console.log("═══════════════════════════════════════════════════════════\n")

// Compare summaries
console.log("SUMMARY CHANGES:\n")

const metrics = [
  { key: "passed", label: "Passed" },
  { key: "warned", label: "Warnings" },
  { key: "failed", label: "Failed" },
  { key: "totalViolations", label: "Total Violations" },
  { key: "criticalViolations", label: "Critical" },
]

metrics.forEach(({ key, label }) => {
  const baseValue = baseline.summary[key]
  const currValue = current.summary[key]
  const diff = currValue - baseValue
  const arrow = diff > 0 ? "📈" : diff < 0 ? "📉" : "➡️"
  const sign = diff > 0 ? "+" : ""

  console.log(`${arrow} ${label}: ${baseValue} → ${currValue} (${sign}${diff})`)
})

console.log("\n═══════════════════════════════════════════════════════════")

// Overall verdict
const improved = current.summary.totalViolations < baseline.summary.totalViolations
const worsened = current.summary.totalViolations > baseline.summary.totalViolations

if (improved) {
  console.log("✅ IMPROVED - Fewer violations than baseline")
} else if (worsened) {
  console.log("❌ REGRESSED - More violations than baseline")
} else {
  console.log("➡️  NO CHANGE - Same number of violations")
}

console.log("═══════════════════════════════════════════════════════════\n")
