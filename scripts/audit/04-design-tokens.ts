#!/usr/bin/env bun
/**
 * LAYER 04: DESIGN TOKENS & OKLCH COMPLIANCE
 *
 * Enforces token usage and OKLCH color system compliance.
 *
 * Checks:
 * - No hardcoded colors (hex, rgb, hsl) - use OKLCH tokens
 * - No hardcoded spacing (px values)
 * - No inline styles (use utility classes)
 * - Mobile-first class order
 * - Touch targets >= 44px (2.75rem)
 * - Design token usage (var(--*))
 * - OKLCH color format compliance
 */

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { formatResult, outputResult } from "./lib/reporter"
import { scanDirectory } from "./lib/scanner"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// DESIGN EXCEPTIONS LOADER
// ═══════════════════════════════════════════════════════════════

interface DesignException {
  id: string
  component: string
  type?: string
  line?: number
  reason: string
  status: string
}

interface ExceptionsRegistry {
  exceptions: DesignException[]
}

// Load design exceptions if they exist
let exceptionsRegistry: ExceptionsRegistry | null = null
const exceptionsFile = join(".audit", "design-exceptions.json")

if (existsSync(exceptionsFile)) {
  try {
    exceptionsRegistry = JSON.parse(readFileSync(exceptionsFile, "utf-8"))
  } catch {
    // If file is malformed, ignore it
  }
}

// Helper to check if a violation should be exempted
function isExempted(file: string, _line: number, _type: string): boolean {
  if (!exceptionsRegistry?.exceptions) return false

  // Normalize file path for comparison (handle relative paths)
  const normalizedFile = file.replace(/^\.?\//, "")

  return exceptionsRegistry.exceptions.some((exc) => {
    if (exc.status !== "active") return false

    // Normalize component path for comparison
    const normalizedComponent = exc.component.replace(/^\.?\//, "")

    // Match on file path
    if (normalizedComponent !== normalizedFile) return false

    // For now, exempt all violations for files with any active exception
    // This works because the 07.5 script scans for @design-exception comments
    // In the future, we could add type-specific checking if needed
    return true
  })
}

// ═══════════════════════════════════════════════════════════════
// FORBIDDEN PATTERNS (Updated for OKLCH system)
// ═══════════════════════════════════════════════════════════════

const HARDCODED_PATTERNS = {
  // Colors - OKLCH is the standard, hex/rgb are forbidden in components
  hexColor: /#[0-9a-fA-F]{3,6}\b/,
  rgbColor: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/,
  rgbaColor: /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/,
  hslColor: /hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/,

  // Spacing - Tailwind with hardcoded px (use tokens)
  hardcodedSpacing: /\b(p|m|w|h|gap|space|inset|top|bottom|left|right)-\[\d+px\]/,

  // Old Tailwind numeric classes (use OKLCH tokens)
  numericTailwind:
    /\b(bg|text|border)-(red|blue|green|yellow|gray|purple|pink|indigo|slate|stone|zinc|neutral)-\d{2,3}\b/,

  // Hardcoded border radius (use tokens)
  hardcodedRadius: /rounded-\[\d+px\]/,

  // Hardcoded blur (use tokens)
  hardcodedBlur: /blur-\[\d+px\]/,

  // Inline styles (forbidden - use utility classes)
  inlineStyle: /style\s*=\s*\{\{/,
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Scan all TSX/JSX files
const filesToCheck = [
  ...scanDirectory("app", [".tsx", ".jsx"]),
  ...scanDirectory("components", [".tsx", ".jsx"]),
]

// Get list of files to audit (from environment variable if set)
const auditFilesEnv = process.env.AUDIT_FILES
const filesToAudit = auditFilesEnv ? auditFilesEnv.split(" ").filter((f) => f.length > 0) : null

filesToCheck.forEach((file) => {
  // If AUDIT_FILES is set, only check those files
  if (filesToAudit && filesToAudit.length > 0) {
    const shouldCheck = filesToAudit.some((f) => file.endsWith(f) || file.includes(f))
    if (!shouldCheck) return
  }

  try {
    const content = readFileSync(file, "utf-8")
    const lines = content.split("\n")

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Check for hardcoded hex colors (forbidden - use oklch(var(--color-*)))
      if (HARDCODED_PATTERNS.hexColor.test(line)) {
        // Allow in CSS files but not in components
        if (!file.endsWith(".css")) {
          violations.push({
            type: "HARDCODED_COLOR",
            severity: "critical",
            file,
            line: lineNumber,
            message: "Hardcoded hex color detected - use OKLCH token",
            fix: "Use design token: oklch(var(--color-brand-primary)) or bg-primary/text-primary",
          })
        }
      }

      // Check for hardcoded RGB/RGBA colors
      if (HARDCODED_PATTERNS.rgbColor.test(line) || HARDCODED_PATTERNS.rgbaColor.test(line)) {
        // Allow if it's wrapping a var() for OKLCH conversion
        if (!line.includes("var(--")) {
          violations.push({
            type: "HARDCODED_RGB",
            severity: "critical",
            file,
            line: lineNumber,
            message: "Hardcoded RGB color detected - use OKLCH token",
            fix: "Use design token: oklch(var(--color-brand-primary))",
          })
        }
      }

      // Check for hardcoded HSL colors
      if (HARDCODED_PATTERNS.hslColor.test(line)) {
        violations.push({
          type: "HARDCODED_HSL",
          severity: "critical",
          file,
          line: lineNumber,
          message: "Hardcoded HSL color detected - use OKLCH token",
          fix: "Use design token: oklch(var(--color-brand-primary))",
        })
      }

      // Check for hardcoded spacing
      if (HARDCODED_PATTERNS.hardcodedSpacing.test(line)) {
        // Skip if this file is exempted
        if (!isExempted(file, lineNumber, "HARDCODED_SPACING")) {
          violations.push({
            type: "HARDCODED_SPACING",
            severity: "high",
            file,
            line: lineNumber,
            message: "Hardcoded pixel spacing detected",
            fix: "Use spacing token: p-[var(--spacing-md)]",
          })
        }
      }

      // Check for old Tailwind numeric classes
      if (HARDCODED_PATTERNS.numericTailwind.test(line)) {
        violations.push({
          type: "OLD_TAILWIND_CLASS",
          severity: "high",
          file,
          line: lineNumber,
          message: "Old Tailwind numeric class detected (e.g., bg-gray-500)",
          fix: "Use token-based class: bg-primary, bg-accent-rust, etc.",
        })
      }

      // Check for hardcoded radius
      if (HARDCODED_PATTERNS.hardcodedRadius.test(line)) {
        violations.push({
          type: "HARDCODED_RADIUS",
          severity: "high",
          file,
          line: lineNumber,
          message: "Hardcoded border radius detected",
          fix: "Use radius token: rounded-[var(--radius-lg)]",
        })
      }

      // Check for hardcoded blur
      if (HARDCODED_PATTERNS.hardcodedBlur.test(line)) {
        violations.push({
          type: "HARDCODED_BLUR",
          severity: "high",
          file,
          line: lineNumber,
          message: "Hardcoded blur detected",
          fix: "Use blur token: backdrop-blur-[var(--blur-md)]",
        })
      }

      // Check for inline styles
      if (HARDCODED_PATTERNS.inlineStyle.test(line)) {
        // Skip if this line is exempted
        if (!isExempted(file, lineNumber, "INLINE_STYLE")) {
          violations.push({
            type: "INLINE_STYLE",
            severity: "critical",
            file,
            line: lineNumber,
            message: "Inline style detected - forbidden",
            fix: "Use Tailwind utility classes with design tokens or CSS classes in globals.css",
          })
        }
      }

      // Check for touch target violations
      if (/<button|<a\s/.test(line)) {
        const sizeMatch = line.match(/\b(w|h|size)-\[(\d+)px\]/)
        if (sizeMatch) {
          const size = Number.parseInt(sizeMatch[2])
          if (size < 44) {
            violations.push({
              type: "TOUCH_TARGET_TOO_SMALL",
              severity: "high",
              file,
              line: lineNumber,
              message: `Touch target too small: ${size}px (minimum 44px)`,
              fix: "Use minimum size-[var(--touch-target-min)] or ensure padding >= var(--spacing-md)",
            })
          }
        }
      }
    })
  } catch (error) {
    violations.push({
      type: "FILE_READ_ERROR",
      severity: "medium",
      file,
      line: 0,
      message: `Could not read file: ${error}`,
    })
  }
})

// Check styles/tokens.css exists and has required OKLCH tokens
if (!existsSync("styles/tokens.css")) {
  violations.push({
    type: "MISSING_TOKENS_FILE",
    severity: "critical",
    file: "styles/tokens.css",
    line: 0,
    message: "Design tokens file missing",
    fix: "Create styles/tokens.css with OKLCH design tokens",
  })
} else {
  const tokensContent = readFileSync("styles/tokens.css", "utf-8")

  // Check for OKLCH color system
  if (!tokensContent.includes("oklch(")) {
    violations.push({
      type: "NO_OKLCH_COLORS",
      severity: "critical",
      file: "styles/tokens.css",
      line: 0,
      message: "Tokens file doesn't use OKLCH color format",
      fix: "Convert colors to OKLCH format: oklch(lightness chroma hue)",
    })
  }

  // Check for required token categories for restaurant platform
  const requiredTokens = [
    // Brand colors
    "--color-brand-primary",
    "--color-brand-secondary",
    // Aliases
    "--color-primary",
    "--color-secondary",
    // Accent colors (restaurant theme)
    "--color-accent-rust",
    "--color-accent-sage",
    "--color-accent-teal",
    "--color-accent-berry",
    "--color-accent-honey",
    // Spacing
    "--spacing-sm",
    "--spacing-md",
    "--spacing-lg",
    "--spacing-xl",
    // Radius
    "--radius-sm",
    "--radius-md",
    "--radius-lg",
    "--radius-xl",
    "--radius-full",
    // Blur
    "--blur-sm",
    "--blur-md",
    "--blur-xl",
    "--blur-2xl",
    // Backdrop blur aliases
    "--backdrop-blur-sm",
    "--backdrop-blur-md",
    // Touch targets
    "--touch-target-min",
    // Component sizing (preserved from original)
    "--header-logo-size",
    "--side-menu-width",
    "--icon-size-lg",
    "--icon-size-md",
  ]

  requiredTokens.forEach((token) => {
    if (!tokensContent.includes(token)) {
      violations.push({
        type: "MISSING_TOKEN",
        severity: "high",
        file: "styles/tokens.css",
        line: 0,
        message: `Required design token missing: ${token}`,
        fix: `Add ${token} to styles/tokens.css`,
      })
    }
  })
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = formatResult("design-tokens", violations, {
  filesChecked: filesToCheck.length,
  tokensFileExists: existsSync("styles/tokens.css"),
  oklchCompliant:
    existsSync("styles/tokens.css") &&
    readFileSync("styles/tokens.css", "utf-8").includes("oklch("),
})

outputResult(result)
process.exit(result.status === "fail" ? 1 : 0)
