#!/usr/bin/env bun
/**
 * LAYER 09: BUILD VERIFICATION
 *
 * Validates that the project builds successfully for production.
 *
 * Checks:
 * - TypeScript compilation succeeds
 * - Production build completes
 * - No build warnings
 * - Bundle size is reasonable
 * - All env vars are properly typed
 */

import { execSync } from "node:child_process"
import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// BUILD RULES
// ═══════════════════════════════════════════════════════════════

const MAX_BUNDLE_SIZE = 1024 * 1024 * 5 // 5MB for main bundle
const _MAX_PAGE_SIZE = 1024 * 500 // 500KB per page

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function runCommand(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, {
      encoding: "utf-8",
      stdio: "pipe",
    })
    return { success: true, output }
  } catch (error: any) {
    return {
      success: false,
      output: error.stdout || error.stderr || error.message,
    }
  }
}

function getBuildSize(directory: string): number {
  let totalSize = 0

  function scanDir(dir: string) {
    try {
      const items = readdirSync(dir)
      items.forEach((item) => {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          scanDir(fullPath)
        } else {
          totalSize += stat.size
        }
      })
    } catch {
      // Ignore
    }
  }

  if (existsSync(directory)) {
    scanDir(directory)
  }

  return totalSize
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check 1: TypeScript compilation
console.error("Checking TypeScript compilation...")
const tsCheck = runCommand("bun run tsc --noEmit")

if (!tsCheck.success) {
  violations.push({
    type: "TYPESCRIPT_ERRORS",
    severity: "critical",
    message: "TypeScript compilation failed",
    fix: "Fix TypeScript errors shown above",
  })
}

// Check 2: Production build
// Run 'bun next build' directly instead of 'bun run build' to avoid
// triggering the full audit again (which would create a loop)
console.error("Running production build...")
const buildResult = runCommand("bun next build")

if (!buildResult.success) {
  violations.push({
    type: "BUILD_FAILED",
    severity: "critical",
    message: "Production build failed",
    fix: "Fix build errors - check output above",
  })
} else {
  // Check for build warnings
  if (buildResult.output.includes("warn") || buildResult.output.includes("warning")) {
    violations.push({
      type: "BUILD_WARNINGS",
      severity: "medium",
      message: "Build completed with warnings",
      fix: "Review and fix build warnings",
    })
  }

  // Check bundle size
  if (existsSync(".next")) {
    const buildSize = getBuildSize(".next/static")
    const sizeMB = (buildSize / 1024 / 1024).toFixed(2)

    if (buildSize > MAX_BUNDLE_SIZE * 2) {
      violations.push({
        type: "BUNDLE_TOO_LARGE",
        severity: "high",
        message: `Bundle size too large: ${sizeMB}MB`,
        fix: "Optimize bundle: code splitting, dynamic imports, image optimization",
      })
    } else if (buildSize > MAX_BUNDLE_SIZE) {
      violations.push({
        type: "BUNDLE_LARGE",
        severity: "medium",
        message: `Bundle size is large: ${sizeMB}MB`,
        fix: "Consider optimization: analyze bundle with ANALYZE=true bun run build",
      })
    }
  } else {
    violations.push({
      type: "BUILD_OUTPUT_MISSING",
      severity: "critical",
      message: ".next directory not found after build",
      fix: "Check if build actually completed successfully",
    })
  }
}

// Check 3: Environment variables
if (existsSync("types/env.d.ts")) {
  try {
    const envTypes = require("node:fs").readFileSync("types/env.d.ts", "utf-8")

    // Check if all env vars from .env.local are typed
    if (existsSync(".env.local")) {
      const envContent = require("node:fs").readFileSync(".env.local", "utf-8")
      const envVars = envContent
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"))
        .map((line) => line.split("=")[0].trim())

      envVars.forEach((varName) => {
        if (!envTypes.includes(varName)) {
          violations.push({
            type: "UNTYPED_ENV_VAR",
            severity: "medium",
            file: "types/env.d.ts",
            message: `Environment variable not typed: ${varName}`,
            fix: `Add to types/env.d.ts: ${varName}: string`,
          })
        }
      })
    }
  } catch {
    // Ignore
  }
} else {
  violations.push({
    type: "MISSING_ENV_TYPES",
    severity: "medium",
    file: "types/env.d.ts",
    message: "Environment variable types not defined",
    fix: "Create types/env.d.ts with env var types",
  })
}

// Check 4: Verify next.config exists and is valid
if (!existsSync("next.config.mjs") && !existsSync("next.config.js")) {
  violations.push({
    type: "MISSING_NEXT_CONFIG",
    severity: "high",
    message: "next.config.mjs not found",
    fix: "Create next.config.mjs with proper configuration",
  })
}

// Check 5: Biome validation
// Use the optimized lint:biome script that only scans app/components
console.error("Running Biome checks...")
const biomeCheck = runCommand("bun run lint:biome")

if (!biomeCheck.success) {
  violations.push({
    type: "BIOME_ERRORS",
    severity: "medium",
    message: "Biome validation failed",
    fix: "Run: bun run fix:all to auto-fix biome issues",
  })
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const buildSize = existsSync(".next") ? getBuildSize(".next/static") : 0
const buildSizeMB = (buildSize / 1024 / 1024).toFixed(2)

const result = {
  layer: "build-verify",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    typescriptPassed: tsCheck.success,
    buildPassed: buildResult.success,
    buildSizeMB: buildSizeMB,
    biomePassed: biomeCheck.success,
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
