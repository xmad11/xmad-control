#!/usr/bin/env bun
/**
 * LAYER 02: ARCHITECTURE BOUNDARIES
 *
 * Enforces layer responsibilities and folder structure.
 * Prevents architectural drift by checking file locations.
 *
 * Checks:
 * - Files are in correct folders
 * - No layer boundary violations
 * - Component quotas not exceeded
 * - No duplicate files
 */

import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { extname, join, relative } from "node:path"
import { formatResult, outputResult } from "./lib/reporter"
import { scanDirectory } from "./lib/scanner"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// ARCHITECTURE RULES
// ═══════════════════════════════════════════════════════════════

const LAYER_RULES = {
  app: {
    allowed: [
      "page.tsx",
      "layout.tsx",
      "loading.tsx",
      "error.tsx",
      "not-found.tsx",
      "route.ts",
      "template.tsx",
    ],
    description: "Next.js App Router pages and layouts only",
  },
  components: {
    allowed: ["*.tsx", "*.ts"],
    forbidden: ["*.css", "*.scss"],
    description: "React components only (no styles)",
  },
  "components/ui": {
    allowed: ["*.tsx"],
    description: "Reusable UI primitives only",
  },
  "components/shared": {
    allowed: ["*.tsx"],
    description: "Shared components (SSOT)",
  },
  lib: {
    allowed: ["*.ts"],
    forbidden: ["*.tsx", "*.jsx"],
    description: "Business logic only (no React)",
  },
  types: {
    allowed: ["*.ts", "*.d.ts"],
    description: "Type definitions only",
  },
  styles: {
    allowed: ["globals.css", "tokens.css"],
    forbidden: ["*.module.css"],
    description: "Global styles and design tokens only",
  },
}

// Component quotas
const QUOTAS = {
  components: 50,
  "components/ui": 30,
  "components/shared": 40,
  app: 20, // Max pages
  lib: 30,
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function matchesPattern(filename: string, pattern: string): boolean {
  if (pattern === filename) return true
  if (pattern.startsWith("*.")) {
    const ext = pattern.slice(1)
    return filename.endsWith(ext)
  }
  return false
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Check layer rules
Object.entries(LAYER_RULES).forEach(([folder, rules]) => {
  if (!existsSync(folder)) {
    violations.push({
      type: "MISSING_LAYER",
      severity: "high",
      file: folder,
      message: `Required layer folder missing: ${folder}`,
      fix: `Create folder: mkdir -p ${folder}`,
    })
    return
  }

  const files = scanDirectory(folder)

  files.forEach((file) => {
    const relativePath = relative(folder, file)
    const filename = relativePath.split("/").pop()!

    // Check if file is allowed
    const isAllowed = rules.allowed.some((pattern) => matchesPattern(filename, pattern))

    if (!isAllowed) {
      violations.push({
        type: "LAYER_VIOLATION",
        severity: "high",
        file,
        message: `File not allowed in ${folder}: ${filename}. ${rules.description}`,
        fix: "Move to appropriate folder or remove",
      })
    }

    // Check if file is forbidden
    if (rules.forbidden) {
      const isForbidden = rules.forbidden.some((pattern) => matchesPattern(filename, pattern))

      if (isForbidden) {
        violations.push({
          type: "FORBIDDEN_FILE",
          severity: "critical",
          file,
          message: `Forbidden file type in ${folder}: ${filename}`,
          fix: "Remove or move to correct location",
        })
      }
    }
  })
})

// Check component quotas
Object.entries(QUOTAS).forEach(([folder, maxCount]) => {
  if (!existsSync(folder)) return

  const files = scanDirectory(folder, /\.(tsx|ts)$/)
  const count = files.length

  if (count > maxCount) {
    violations.push({
      type: "QUOTA_EXCEEDED",
      severity: "high",
      file: folder,
      message: `Component quota exceeded in ${folder}: ${count}/${maxCount} files`,
      fix: `Consolidate or remove ${count - maxCount} files`,
    })
  }
})

// Check for duplicate files (same content hash)
const fileHashes = new Map<string, string[]>()

function scanForDuplicates(dir: string) {
  const files = scanDirectory(dir, /\.(tsx?|jsx?)$/)

  files.forEach((file) => {
    try {
      const content = readFileSync(file, "utf-8")
      const hash = createHash("md5").update(content).digest("hex")

      if (fileHashes.has(hash)) {
        fileHashes.get(hash)?.push(file)
      } else {
        fileHashes.set(hash, [file])
      }
    } catch {
      // Ignore unreadable files
    }
  })
}
;["app", "components", "lib"].forEach((dir) => {
  if (existsSync(dir)) {
    scanForDuplicates(dir)
  }
})

fileHashes.forEach((files, _hash) => {
  if (files.length > 1) {
    violations.push({
      type: "DUPLICATE_FILES",
      severity: "high",
      message: `Duplicate files detected: ${files.join(", ")}`,
      fix: "Keep one file and remove duplicates",
    })
  }
})

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = formatResult("architecture", violations, {
  layersChecked: Object.keys(LAYER_RULES).length,
  quotasChecked: Object.keys(QUOTAS).length,
  duplicatesFound: Array.from(fileHashes.values()).filter((f) => f.length > 1).length,
})

outputResult(result)
process.exit(result.status === "fail" ? 1 : 0)
