#!/usr/bin/env bun
/**
 * LAYER 07: UI RESPONSIVE & MOBILE-FIRST VALIDATION
 *
 * Validates responsive design and mobile-first implementation.
 *
 * Checks:
 * - Responsive breakpoints defined correctly
 * - Touch targets >= 44px
 * - Mobile-first class order
 * - Container queries usage
 * - Fluid typography
 * - No fixed widths without responsive overrides
 */

import { existsSync, readFileSync } from "node:fs"
import { scanDirectory } from "./lib/scanner"
import type { Violation } from "./lib/types"

const violations: Violation[] = []

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE RULES
// ═══════════════════════════════════════════════════════════════

const REQUIRED_BREAKPOINTS = {
  mobile: 320, // Small mobile
  mobileLarge: 375, // Standard mobile
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
}

const MIN_TOUCH_TARGET = 44 // pixels

// Patterns to check
const RESPONSIVE_PATTERNS = {
  // Fixed width without responsive override
  fixedWidth: /\bw-\[\d+px\](?!\s+md:)/,

  // Fixed height without responsive override
  fixedHeight: /\bh-\[\d+px\](?!\s+md:)/,

  // Desktop-first (has md:/lg: but no base)
  desktopFirst: /(md|lg|xl):\w+(?![^"]*\s+\w+(?<!md:|lg:|xl:))/,

  // Small touch targets
  smallButton: /(size|w|h)-\[([1-3]?\d)px\]/,

  // Non-fluid typography (should use clamp)
  fixedTypography: /text-\[\d+px\](?!\s+md:)/,
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function extractTouchTargetSize(line: string): number | null {
  // Extract size from patterns like: w-[44px], h-[44px], size-[44px]
  const match = line.match(/(?:size|w|h)-\[(\d+)px\]/)
  if (match) {
    return Number.parseInt(match[1])
  }
  return null
}

// ═══════════════════════════════════════════════════════════════
// CHECKS
// ═══════════════════════════════════════════════════════════════

// Scan all component and page files
const filesToCheck = [
  ...scanDirectory("app", [".tsx", ".jsx"]),
  ...scanDirectory("components", [".tsx", ".jsx"]),
]

filesToCheck.forEach((file) => {
  try {
    const content = readFileSync(file, "utf-8")
    const lines = content.split("\n")

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Check for fixed width without responsive override
      if (RESPONSIVE_PATTERNS.fixedWidth.test(line)) {
        violations.push({
          type: "FIXED_WIDTH_NO_RESPONSIVE",
          severity: "high",
          file,
          line: lineNumber,
          message: "Fixed width without responsive override detected",
          fix: "Add responsive classes: w-[320px] md:w-[768px] lg:w-[1024px]",
        })
      }

      // Check for fixed height without responsive override
      if (RESPONSIVE_PATTERNS.fixedHeight.test(line)) {
        violations.push({
          type: "FIXED_HEIGHT_NO_RESPONSIVE",
          severity: "medium",
          file,
          line: lineNumber,
          message: "Fixed height without responsive override detected",
          fix: "Add responsive classes or use min-h/max-h",
        })
      }

      // Check for desktop-first pattern
      if (/(md|lg|xl):/.test(line)) {
        // Check if there's a base class for the same property
        const prefixMatch = line.match(/(md|lg|xl):(\w+)-/)
        if (prefixMatch) {
          const property = prefixMatch[2]
          const basePattern = new RegExp(`\\b${property}-[^\\s:]+(?!:)`)

          if (!basePattern.test(line)) {
            violations.push({
              type: "DESKTOP_FIRST_PATTERN",
              severity: "high",
              file,
              line: lineNumber,
              message: "Desktop-first pattern detected - mobile base class missing",
              fix: `Add mobile-first base class before ${prefixMatch[0]}`,
            })
          }
        }
      }

      // Check touch targets on interactive elements
      if (/<button|<a\s|role="button"/.test(line)) {
        const size = extractTouchTargetSize(line)

        if (size !== null && size < MIN_TOUCH_TARGET) {
          violations.push({
            type: "TOUCH_TARGET_TOO_SMALL",
            severity: "critical",
            file,
            line: lineNumber,
            message: `Touch target too small: ${size}px (minimum ${MIN_TOUCH_TARGET}px required)`,
            fix: `Increase to at least size-[${MIN_TOUCH_TARGET}px] or use size-[var(--touch-target-min)]`,
          })
        }

        // Check if button has no explicit size (might be too small)
        if (
          size === null &&
          !line.includes("p-") &&
          !line.includes("px-") &&
          !line.includes("py-")
        ) {
          violations.push({
            type: "INTERACTIVE_NO_SIZE",
            severity: "medium",
            file,
            line: lineNumber,
            message: "Interactive element has no explicit size or padding",
            fix: "Add padding or size to ensure touch target >= 44px",
          })
        }
      }

      // Check for non-fluid typography
      if (/text-\[\d+px\]/.test(line) && !line.includes("clamp")) {
        violations.push({
          type: "NON_FLUID_TYPOGRAPHY",
          severity: "medium",
          file,
          line: lineNumber,
          message: "Fixed typography detected - should use fluid sizing",
          fix: "Use clamp: text-[clamp(16px,4vw,24px)] or responsive classes",
        })
      }

      // Check for @container usage where appropriate
      if (/className="[^"]*grid/.test(line) && !/@container/.test(content)) {
        // Grid layouts should consider container queries
        violations.push({
          type: "MISSING_CONTAINER_QUERY",
          severity: "low",
          file,
          line: lineNumber,
          message: "Grid layout without container query - consider using @container for modularity",
          fix: "Wrap in container: <div className='@container'>",
        })
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

// Check tailwind.config.ts for proper breakpoints
if (existsSync("tailwind.config.ts")) {
  try {
    const configContent = readFileSync("tailwind.config.ts", "utf-8")

    // Check if custom breakpoints are defined
    if (!configContent.includes("screens:") && !configContent.includes("theme: {")) {
      violations.push({
        type: "NO_CUSTOM_BREAKPOINTS",
        severity: "low",
        file: "tailwind.config.ts",
        line: 0,
        message: "No custom breakpoints defined in Tailwind config",
        fix: "Consider defining breakpoints: theme: { screens: { ... } }",
      })
    }
  } catch (_error) {
    // Ignore
  }
}

// Check for viewport meta tag in layout
const layoutFiles = scanDirectory("app", [".tsx"]).filter((f) => f.includes("layout"))

layoutFiles.forEach((file) => {
  try {
    const content = readFileSync(file, "utf-8")

    if (!content.includes("viewport") && !content.includes('meta name="viewport"')) {
      violations.push({
        type: "MISSING_VIEWPORT_META",
        severity: "high",
        file,
        line: 0,
        message: "Viewport meta tag missing in layout",
        fix: 'Add to metadata: viewport: "width=device-width, initial-scale=1"',
      })
    }
  } catch {
    // Ignore
  }
})

// ═══════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════

const result = {
  layer: "ui-responsive",
  status:
    violations.length === 0
      ? "pass"
      : violations.some((v) => v.severity === "critical")
        ? "fail"
        : "warn",
  violations,
  metadata: {
    filesChecked: filesToCheck.length,
    minTouchTarget: MIN_TOUCH_TARGET,
    breakpointsRequired: Object.keys(REQUIRED_BREAKPOINTS).length,
  },
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.status === "fail" ? 1 : 0)
