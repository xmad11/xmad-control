#!/usr/bin/env bun
/**
 * ═══════════════════════════════════════════════════════════════
 * ENTERPRISE 360° PROJECT AUDIT SYSTEM
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the master orchestrator that runs all audit layers.
 *
 * USAGE:
 *   bun run audit              # Run full audit
 *   bun run audit --layer=03   # Run specific layer
 *   bun run audit --fix        # Auto-fix violations
 *   bun run audit --report     # Generate detailed report
 *
 * EXIT CODES:
 *   0 = All checks passed
 *   1 = Critical failures detected
 *   2 = Configuration error
 */

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs"

// ═══════════════════════════════════════════════════════════════
// LOG ROTATION
// ═══════════════════════════════════════════════════════════════

function rotateLogIfNeeded() {
  const LOG_FILE = ".audit/audit.log"
  if (!existsSync(LOG_FILE)) return

  try {
    const stats = statSync(LOG_FILE)
    const MAX_SIZE = 1_000_000 // 1MB

    if (stats.size > MAX_SIZE) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const archiveName = `${LOG_FILE}.${timestamp}.old`
      renameSync(LOG_FILE, archiveName)
      console.log(`\n📜 Rotated log file: ${archiveName}\n`)
    }
  } catch (_error) {
    // Ignore rotation errors
  }
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface AuditResult {
  layer: string
  status: "pass" | "warn" | "fail"
  violations: Violation[]
  duration: number
  metadata?: Record<string, unknown>
}

interface Violation {
  type: string
  severity: "critical" | "high" | "medium" | "low"
  file?: string
  line?: number
  message: string
  fix?: string
}

interface AuditReport {
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

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const AUDIT_LAYERS = [
  {
    id: "00",
    name: "pre-flight",
    script: "00-pre-flight.ts",
    description: "Environment & dependencies check",
  },
  {
    id: "01",
    name: "doc-verification",
    script: "01-doc-verification.ts",
    description: "Documentation hash validation",
  },
  {
    id: "02",
    name: "architecture",
    script: "02-architecture.ts",
    description: "Layer boundaries & folder structure",
  },
  {
    id: "03",
    name: "typescript",
    script: "03-typescript.ts",
    description: "Type safety & forbidden patterns",
  },
  {
    id: "04",
    name: "design-tokens",
    script: "04-design-tokens.ts",
    description: "Token compliance & hardcoded values",
  },
  {
    id: "05",
    name: "dependencies",
    script: "05-dependencies.ts",
    description: "Package audit & lockfile validation",
  },
  {
    id: "06",
    name: "git-health",
    script: "06-git-health.ts",
    description: "Git hygiene & branch protection",
  },
  {
    id: "06.5",
    name: "rollback-hygiene",
    script: "06.5-rollback.ts",
    description: "Rollback & checkpoint hygiene",
  },
  {
    id: "07",
    name: "ui-responsive",
    script: "07-ui-responsive.ts",
    description: "Responsive design & breakpoints",
  },
  {
    id: "07.5",
    name: "ui-normalization",
    script: "07.5-ui-normalization.ts",
    description: "UI normalization & design integrity",
  },
  {
    id: "08",
    name: "ownership",
    script: "08-ownership.ts",
    description: "CODEOWNERS & file permissions",
  },
  {
    id: "09",
    name: "build-verify",
    script: "09-build-verify.ts",
    description: "Build validation & bundle analysis",
  },
]

const OUTPUT_DIR = ".audit"
const REPORT_FILE = `${OUTPUT_DIR}/audit-report.json`
const LOG_FILE = `${OUTPUT_DIR}/audit.log`

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function log(message: string, level: "info" | "warn" | "error" = "info") {
  const timestamp = new Date().toISOString()
  const emoji = {
    info: "ℹ️ ",
    warn: "⚠️ ",
    error: "❌",
  }[level]

  const colorCode = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  }[level]

  const reset = "\x1b[0m"

  console.log(`${emoji} ${colorCode}${message}${reset}`)

  // Append to log file
  if (existsSync(OUTPUT_DIR)) {
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`
    try {
      const currentLog = existsSync(LOG_FILE) ? readFileSync(LOG_FILE, "utf-8") : ""
      writeFileSync(LOG_FILE, currentLog + logEntry)
    } catch (_error) {
      // Ignore log write errors
    }
  }
}

function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
    log(`Created audit output directory: ${OUTPUT_DIR}`)
  }
}

function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim()
  } catch {
    return "unknown"
  }
}

function getCurrentCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim()
  } catch {
    return "unknown"
  }
}

function getProjectName(): string {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"))
    return pkg.name || "unknown"
  } catch {
    return "unknown"
  }
}

// ═══════════════════════════════════════════════════════════════
// AUDIT EXECUTION
// ═══════════════════════════════════════════════════════════════

async function runLayer(
  layer: (typeof AUDIT_LAYERS)[0],
  options: { fix?: boolean }
): Promise<AuditResult> {
  const startTime = Date.now()
  const scriptPath = `./scripts/audit/${layer.script}`

  if (!existsSync(scriptPath)) {
    return {
      layer: layer.name,
      status: "fail",
      violations: [
        {
          type: "MISSING_SCRIPT",
          severity: "critical",
          message: `Audit script not found: ${scriptPath}`,
        },
      ],
      duration: Date.now() - startTime,
    }
  }

  try {
    const fixFlag = options.fix ? "--fix" : ""
    const command = `bun run ${scriptPath} ${fixFlag}`

    log(`Running layer ${layer.id}: ${layer.name}...`)

    const output = execSync(command, {
      encoding: "utf-8",
      stdio: "pipe",
    })

    // Parse JSON output from script
    const result = JSON.parse(output.trim())

    // Add duration
    result.duration = Date.now() - startTime

    return result
  } catch (error: unknown) {
    // Check if error output is JSON
    try {
      const stdout = (error as { stdout?: string }).stdout || ""
      const stderr = (error as { stderr?: string }).stderr || ""
      const errorOutput = stdout || stderr
      const result = JSON.parse(errorOutput)
      result.duration = Date.now() - startTime
      return result
    } catch {
      const message = error instanceof Error ? error.message : String(error)
      return {
        layer: layer.name,
        status: "fail",
        violations: [
          {
            type: "EXECUTION_ERROR",
            severity: "critical",
            message: `Layer execution failed: ${message}`,
          },
        ],
        duration: Date.now() - startTime,
      }
    }
  }
}

async function runFullAudit(options: {
  fix?: boolean
  stopOnFailure?: boolean
}): Promise<AuditReport> {
  ensureOutputDir()
  rotateLogIfNeeded()

  console.log(`\n${"═".repeat(70)}`)
  console.log("🔍 ENTERPRISE 360° PROJECT AUDIT")
  console.log("═".repeat(70))
  log(`Project: ${getProjectName()}`)
  log(`Branch: ${getCurrentBranch()}`)
  log(`Commit: ${getCurrentCommit()}`)
  log(`Started: ${new Date().toISOString()}`)
  console.log(`${"═".repeat(70)}\n`)

  const results: AuditResult[] = []

  for (const layer of AUDIT_LAYERS) {
    const result = await runLayer(layer, options)
    results.push(result)

    // Log result
    const statusEmoji = {
      pass: "✅",
      warn: "⚠️ ",
      fail: "❌",
    }[result.status]

    const duration = (result.duration / 1000).toFixed(2)
    log(
      `${statusEmoji} Layer ${layer.id} (${layer.name}): ${result.status.toUpperCase()} - ${result.violations.length} violations (${duration}s)`
    )

    // Stop on critical failure if requested
    if (options.stopOnFailure && result.status === "fail") {
      const criticalViolations = result.violations.filter((v) => v.severity === "critical")
      if (criticalViolations.length > 0) {
        log(`\nCritical failures detected in layer ${layer.name}. Stopping audit.`, "error")
        break
      }
    }
  }

  // Calculate summary
  const allViolations = results.flatMap((r) => r.violations)
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    warned: results.filter((r) => r.status === "warn").length,
    failed: results.filter((r) => r.status === "fail").length,
    totalViolations: allViolations.length,
    criticalViolations: allViolations.filter((v) => v.severity === "critical").length,
  }

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    branch: getCurrentBranch(),
    commit: getCurrentCommit(),
    projectName: getProjectName(),
    layers: results,
    summary,
  }

  // Save report
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))
  log(`\nDetailed report saved: ${REPORT_FILE}`)

  // Display summary
  console.log(`\n${"═".repeat(70)}`)
  console.log("📊 AUDIT SUMMARY")
  console.log("═".repeat(70))
  console.log(`Total Layers:       ${summary.total}`)
  console.log(`✅ Passed:          ${summary.passed}`)
  console.log(`⚠️  Warnings:        ${summary.warned}`)
  console.log(`❌ Failed:          ${summary.failed}`)
  console.log("─".repeat(70))
  console.log(`Total Violations:   ${summary.totalViolations}`)
  console.log(`🔴 Critical:        ${summary.criticalViolations}`)
  console.log("═".repeat(70))

  if (summary.failed > 0) {
    console.log("\n❌ AUDIT FAILED - Fix violations before proceeding\n")
  } else if (summary.warned > 0) {
    console.log("\n⚠️  AUDIT PASSED WITH WARNINGS - Review violations\n")
  } else {
    console.log("\n✅ AUDIT PASSED - All checks successful!\n")
  }

  return report
}

// ═══════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════

function printUsage() {
  console.log(`
USAGE:
  bun run audit [options]

OPTIONS:
  --full              Run all audit layers (default)
  --layer=<id>        Run specific layer (e.g., --layer=03)
  --fix               Auto-fix violations where possible
  --stop-on-failure   Stop audit on first critical failure
  --list              List all available audit layers
  --help              Show this help message

EXAMPLES:
  bun run audit                    # Run full audit
  bun run audit --layer=03         # Run TypeScript audit only
  bun run audit --fix              # Run audit and auto-fix violations
  bun run audit --stop-on-failure  # Stop on first critical error

LAYERS:
${AUDIT_LAYERS.map((l) => `  ${l.id} - ${l.name.padEnd(20)} ${l.description}`).join("\n")}
  `)
}

function listLayers() {
  console.log("\n📋 AVAILABLE AUDIT LAYERS:\n")
  AUDIT_LAYERS.forEach((layer) => {
    console.log(`  ${layer.id} - ${layer.name}`)
    console.log(`      ${layer.description}`)
    console.log()
  })
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2)

  // Parse options
  const options = {
    full: args.includes("--full"),
    fix: args.includes("--fix"),
    stopOnFailure: args.includes("--stop-on-failure"),
    list: args.includes("--list"),
    help: args.includes("--help"),
    // Support multiple --layer arguments
    layers: args.filter((a) => a.startsWith("--layer=")).map((a) => a.split("=")[1]),
  }

  // Show help
  if (options.help) {
    printUsage()
    process.exit(0)
  }

  // List layers
  if (options.list) {
    listLayers()
    process.exit(0)
  }

  // Default to full audit
  if (options.layers.length === 0) {
    options.full = true
  }

  try {
    if (options.full) {
      const report = await runFullAudit({
        fix: options.fix,
        stopOnFailure: options.stopOnFailure,
      })

      // Exit with error if any layer failed
      if (report.summary.failed > 0) {
        process.exit(1)
      }
    } else if (options.layers.length > 0) {
      // Run multiple specific layers
      let hasFailure = false

      for (const layerId of options.layers) {
        const layer = AUDIT_LAYERS.find((l) => l.id === layerId)
        if (!layer) {
          log(`Layer ${layerId} not found. Use --list to see available layers.`, "error")
          process.exit(2)
        }

        const result = await runLayer(layer, { fix: options.fix })
        console.log(JSON.stringify(result, null, 2))

        if (result.status === "fail") {
          hasFailure = true
        }
      }

      if (hasFailure) {
        process.exit(1)
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    log(`Fatal error: ${message}`, "error")
    console.error(error)
    process.exit(2)
  }
}

main()
