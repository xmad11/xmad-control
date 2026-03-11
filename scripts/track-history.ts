#!/usr/bin/env bun
/**
 * AUDIT HISTORY TRACKER
 *
 * Tracks audit results over time for trend analysis
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"

interface HistoryEntry {
  date: string
  commit: string
  branch: string
  passed: number
  warned: number
  failed: number
  totalViolations: number
  criticalViolations: number
}

function trackHistory() {
  const historyFile = ".audit/history.json"

  // Load existing history
  let history: HistoryEntry[] = []
  if (existsSync(historyFile)) {
    history = JSON.parse(readFileSync(historyFile, "utf-8"))
  }

  // Load current report
  if (!existsSync(".audit/audit-report.json")) {
    console.error("❌ No audit report found")
    process.exit(1)
  }

  const report = JSON.parse(readFileSync(".audit/audit-report.json", "utf-8"))

  // Add to history
  const entry: HistoryEntry = {
    date: new Date().toISOString(),
    commit: report.commit,
    branch: report.branch,
    passed: report.summary.passed,
    warned: report.summary.warned,
    failed: report.summary.failed,
    totalViolations: report.summary.totalViolations,
    criticalViolations: report.summary.criticalViolations,
  }

  history.push(entry)

  // Keep last 100 entries
  if (history.length > 100) {
    history = history.slice(-100)
  }

  // Save history
  writeFileSync(historyFile, JSON.stringify(history, null, 2))

  console.log("✅ History updated")

  // Show trend
  if (history.length > 1) {
    const previous = history[history.length - 2]
    const current = entry

    const violationDiff = current.totalViolations - previous.totalViolations
    const criticalDiff = current.criticalViolations - previous.criticalViolations

    console.log("\n📊 Trend:")
    console.log(
      `   Total violations: ${current.totalViolations} (${violationDiff >= 0 ? "+" : ""}${violationDiff})`
    )
    console.log(
      `   Critical: ${current.criticalViolations} (${criticalDiff >= 0 ? "+" : ""}${criticalDiff})`
    )

    if (violationDiff < 0) {
      console.log("   🎉 Improving!")
    } else if (violationDiff > 0) {
      console.log("   ⚠️  Getting worse!")
    } else {
      console.log("   ➡️  No change")
    }
  }
}

trackHistory()
