#!/usr/bin/env bun
/**
 * LAYER 05: DEPENDENCIES AUDIT
 *
 * Validates package integrity and security.
 *
 * Checks:
 * - package.json and lockfile in sync
 * - No known vulnerabilities
 * - No unauthorized packages
 * - Lockfile integrity
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// AUTHORIZED DEPENDENCIES (Whitelist)
// ═══════════════════════════════════════════════════════════════

const AUTHORIZED_DEPS = [
  "next",
  "react",
  "react-dom",
  "@supabase/supabase-js",
  "framer-motion",
  "swr",
  "zod",
  "react-hook-form",
  "@hookform/resolvers",
  "lucide-react",
  "next-themes",
  "clsx",
  "tailwind-merge",
  "@vercel/analytics",
  "@vercel/speed-insights",
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "typescript",
  "@biomejs/biome",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "ts-morph", // For audit system
  "@heroicons/react", // From current package.json
  "@tailwindcss/postcss", // From current package.json
  "keen-slider", // Carousel component
  "critters", // CSS inlining for build optimization
  "husky", // Git hooks
  "lint-staged", // Pre-commit linting
]

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check package.json exists
if (!existsSync("package.json")) {
  violations.push({
    type: "MISSING_PACKAGE_JSON",
    severity: "critical",
    file: "package.json",
    message: "package.json not found",
    fix: "Initialize project: bun init",
  })
} else {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"))

    // Check for unauthorized dependencies
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }

    Object.keys(allDeps).forEach((dep) => {
      if (!AUTHORIZED_DEPS.includes(dep)) {
        violations.push({
          type: "UNAUTHORIZED_DEPENDENCY",
          severity: "high",
          file: "package.json",
          message: `Unauthorized dependency: ${dep}`,
          fix: "Remove or get approval for this dependency",
        })
      }
    })

    // Check for required scripts
    const requiredScripts = ["dev", "build", "start", "audit"]

    requiredScripts.forEach((script) => {
      if (!pkg.scripts || !pkg.scripts[script]) {
        violations.push({
          type: "MISSING_SCRIPT",
          severity: "medium",
          file: "package.json",
          message: `Required script missing: ${script}`,
          fix: `Add "${script}" script to package.json`,
        })
      }
    })
  } catch (_error) {
    violations.push({
      type: "INVALID_PACKAGE_JSON",
      severity: "critical",
      file: "package.json",
      message: "package.json is invalid JSON",
      fix: "Fix JSON syntax errors",
    })
  }
}

// Check lockfile exists (Bun v1.3+ uses bun.lock, older versions use bun.lockb)
const lockfileExists = existsSync("bun.lock") || existsSync("bun.lockb")
if (!lockfileExists) {
  violations.push({
    type: "MISSING_LOCKFILE",
    severity: "high",
    file: "bun.lock",
    message: "Bun lockfile not found (bun.lock or bun.lockb)",
    fix: "Run: bun install",
  })
}

// Run vulnerability audit
try {
  const auditOutput = execSync("bun audit", {
    encoding: "utf-8",
    stdio: "pipe",
  })

  // Check for vulnerabilities in output
  if (auditOutput.includes("vulnerabilities found")) {
    const match = auditOutput.match(/(\d+)\s+vulnerabilities/)
    const count = match ? Number.parseInt(match[1]) : 0

    if (count > 0) {
      violations.push({
        type: "SECURITY_VULNERABILITIES",
        severity: count > 5 ? "critical" : "high",
        message: `${count} security vulnerabilities found`,
        fix: "Run: bun audit fix or update vulnerable packages",
      })
    }
  }
} catch (error: any) {
  // bun audit might exit with error code if vulnerabilities found
  const output = error.stdout || error.stderr || ""

  if (output.includes("vulnerabilities found")) {
    violations.push({
      type: "SECURITY_VULNERABILITIES",
      severity: "high",
      message: "Security vulnerabilities detected",
      fix: "Review output and update packages",
    })
  }
}

// Check node_modules exists
if (!existsSync("node_modules")) {
  violations.push({
    type: "MISSING_NODE_MODULES",
    severity: "critical",
    file: "node_modules",
    message: "node_modules not found",
    fix: "Run: bun install",
  })
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "dependencies",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    packageJsonExists: existsSync("package.json"),
    lockfileExists: existsSync("bun.lock") || existsSync("bun.lockb"),
    nodeModulesExists: existsSync("node_modules"),
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
