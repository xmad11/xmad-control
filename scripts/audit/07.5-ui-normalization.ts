#!/usr/bin/env bun
/**
 * LAYER 07.5: UI NORMALIZATION & DESIGN INTEGRITY
 *
 * Comprehensive UI audit layer combining design token validation,
 * mobile-first enforcement, exception handling, and component analysis.
 *
 * Updated for OKLCH color system and restaurant platform components.
 *
 * MODES:
 * - inspect (default): Read-only scan, generate reports
 * - isolate: Create normalized copies in .extraction/
 * - assist-fix: Generate patch files for manual review
 *
 * USAGE:
 *   bun run scripts/audit/07.5-ui-normalization.ts              # inspect mode
 *   bun run scripts/audit/07.5-ui-normalization.ts --mode=isolate
 *   bun run scripts/audit/07.5-ui-normalization.ts --mode=assist-fix
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, join } from "node:path"
import { scanDirectory } from "./lib/scanner"
import type { Violation } from "./lib/types"

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type Mode = "inspect" | "isolate" | "assist-fix"

interface Warning {
  type: string
  component: string
  line?: number
  message: string
}

interface Recommendation {
  priority: "p0" | "p1" | "p2" | "p3"
  category: "performance" | "maintainability" | "accessibility" | "consistency"
  description: string
  estimatedEffort?: string
}

interface DesignException {
  id: string
  component: string
  line?: number
  reason: string
  annotation: string
  expiry?: string
  owner?: string
  status: "active" | "expired" | "pending-review"
}

interface ComponentInfo {
  name: string
  path: string
  linesOfCode: number
  propsCount: number
  usesTokens: boolean
  inlineStyles: boolean
  responsiveStrategy: "mobile-first" | "desktop-first" | "none" | "mixed"
  heavy: boolean
  memoized: boolean
  tokenCoverage: number
  exceptions: string[]
  violations: Violation[]
  warnings: Warning[]
}

interface AuditResult {
  layer: string
  status: "pass" | "warn" | "fail"
  violations: Violation[]
  warnings: Warning[]
  recommendations: Recommendation[]
  duration: number
  metadata?: {
    mode: Mode
    reports: string[]
  }
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const MODE = (process.argv.find((arg) => arg.startsWith("--mode="))?.split("=")[1] ||
  "inspect") as Mode

const COMPONENTS_DIR = "components"
const AUDIT_DIR = ".audit"
const EXTRACTION_DIR = ".extraction/normalized"
const PATCHES_DIR = ".audit/patches"

// Updated violation patterns for OKLCH system
const VIOLATION_PATTERNS = {
  // Hardcoded hex colors (forbidden in components)
  hexColor: /#[0-9a-fA-F]{3,8}\b(?!.*\/\*\s*@design-exception)/,

  // Magic numbers for spacing
  magicSpacing:
    /(?:p|m|px|py|gap)-\[(?:1[5-9]\d|2\d\d|3\d\d|4\d\d|5\d\d|6\d\d|7\d\d|8\d\d|9\d\d)px\]/,
  magicRadius: /rounded-\[(?:1[5-9]\d|2\d\d|3\d\d)px\]/,
  magicZIndex: /z-\[(?:[1-9]\d\d+)\]/,

  // Inline styles
  inlineStyle: /style=\{\{[^}]*\}\}/,

  // Desktop-first patterns
  desktopFirst: /(md|lg|xl):\w+.*?(?![^}]*\w+(?<!md:|lg:|xl:))/,

  // Type leakage
  typeAny: /:\s*any\b(?!\s*\/\/.*@design-exception)/,
  typeNever: /:\s*never\b/,
  typeUndefined: /:\s*undefined\b/,

  // Touch target violations
  smallTouchTarget: /(size|w|h)-\[([1-3]?\d)px\](?!.*md:)/,
}

const EXCEPTION_REASON_MAP: Record<string, string> = {
  DYNAMIC_VALUE: "Runtime computed values cannot use tokens",
  DYNAMIC_TRANSFORM:
    "Width & transform calculated at runtime based on tab count and active index - cannot be expressed with static Tailwind classes",
  CSS_CUSTOM_PROPERTY:
    "Dynamic accent color based on card type - sets CSS variable for child components",
  VENDOR_CONSTRAINT: "Third-party library does not support CSS variables",
  SYSTEM_HOOK: "System-level media query or hook",
  COLOR_PICKER: "Color picker UI data array",
  CHART_LIBRARY: "Chart/data visualization library",
  THEME_PREVIEW: "Theme preview/demo component",
}

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

const violations: Violation[] = []
const warnings: Warning[] = []
const recommendations: Recommendation[] = []
const exceptions: DesignException[] = []
const components: ComponentInfo[] = []
const startTime = Date.now()

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function countLinesOfFile(filePath: string): number {
  try {
    const content = readFileSync(filePath, "utf-8")
    return content.split("\n").length
  } catch {
    return 0
  }
}

function extractPropsCount(content: string): number {
  // Match interface definitions or component props
  const interfaceMatch = content.match(/interface\s+\w*Props\s*\{([^}]+)\}/s)
  if (interfaceMatch) {
    const props = interfaceMatch[1].split(",").filter((p) => p.trim())
    return props.length
  }

  // Match function parameters for components
  const funcMatch = content.match(/function\s+\w+\s*\(([^)]*)\)/)
  if (funcMatch) {
    return funcMatch[1].split(",").filter((p) => p.trim()).length
  }

  return 0
}

function checkMemoization(content: string): boolean {
  return /\b(memo|useMemo|useCallback)\b/.test(content)
}

function extractLineNumber(content: string, matchIndex: number): number {
  return content.substring(0, matchIndex).split("\n").length
}

function generateExceptionId(): string {
  return `exc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

// ═══════════════════════════════════════════════════════════════
// SCAN FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function scanComponent(filePath: string): ComponentInfo {
  const content = readFileSync(filePath, "utf-8")
  const fileName = basename(filePath)
  const relPath = filePath.replace(`${process.cwd()}/`, "")

  const info: ComponentInfo = {
    name: fileName.replace(/\.(tsx?|jsx?)$/, ""),
    path: relPath,
    linesOfCode: countLinesOfFile(filePath),
    propsCount: extractPropsCount(content),
    usesTokens: /var\(--/.test(content),
    inlineStyles: VIOLATION_PATTERNS.inlineStyle.test(content),
    responsiveStrategy: detectResponsiveStrategy(content),
    heavy: countLinesOfFile(filePath) > 300,
    memoized: checkMemoization(content),
    tokenCoverage: calculateTokenCoverage(content),
    exceptions: [],
    violations: [],
    warnings: [],
  }

  // Check for design exceptions (both block comment formats)
  const exceptionMatches = content.matchAll(/\/\*\*[\s\S]*?@design-exception[\s\S]*?\*\//g)
  const singleLineExceptionMatches = content.matchAll(
    /\{\/\*[\s\S]*?@design-exception[\s\S]*?\*\/\}/g
  )

  // Process block comment exceptions
  for (const match of exceptionMatches) {
    processExceptionAnnotation(match[0], relPath)
  }

  // Process single-line JSX comment exceptions
  for (const match of singleLineExceptionMatches) {
    processExceptionAnnotation(match[0], relPath)
  }

  // Also check for function-level exceptions with /** @design-exception */
  const functionExceptionMatches = content.matchAll(
    /(?:^|\n)\s*\/\*\*[\s\S]*?@design-exception[\s\S]*?\*\/\s*\n\s*(?:interface|function|type)/gm
  )
  for (const match of functionExceptionMatches) {
    processExceptionAnnotation(match[0], relPath)
  }

  // Scan for violations (excluding lines with valid exceptions)
  const componentViolations: Violation[] = []
  const componentWarnings: Warning[] = []

  const lines = content.split("\n")
  const exceptionLines = new Set<number>()

  // Mark lines with exception block comments
  for (const match of content.matchAll(/\/\*\*[\s\S]*?@design-exception[\s\S]*?\*\//g)) {
    const startLine = extractLineNumber(content, match.index || 0)
    const blockLines = match[0].split("\n").length
    for (let i = startLine; i < startLine + blockLines; i++) {
      exceptionLines.add(i)
    }
  }

  // Mark lines with single-line JSX comment exceptions
  for (const match of content.matchAll(/\{\/\*[\s\S]*?@design-exception[\s\S]*?\*\/\}/g)) {
    const startLine = extractLineNumber(content, match.index || 0)
    exceptionLines.add(startLine)
  }

  lines.forEach((line, index) => {
    const lineNum = index + 1
    if (exceptionLines.has(lineNum)) return

    // Check for nearby DYNAMIC_VALUE exception annotations (within 3 lines)
    const hasDynamicValueExceptionNearby = checkForNearbyException(lines, index, "DYNAMIC_VALUE")

    // Check hex colors (unless in color picker data array or CSS file)
    if (VIOLATION_PATTERNS.hexColor.test(line) && !isColorPickerContext(content, index)) {
      componentViolations.push({
        type: "HARDCODED_COLOR",
        severity: "critical",
        component: relPath,
        line: lineNum,
        message: "Hardcoded hex color detected - use OKLCH token",
        fix: "Use design token: oklch(var(--color-brand-primary)) or bg-primary/text-primary",
      })
    }

    // Check magic spacing
    if (VIOLATION_PATTERNS.magicSpacing.test(line)) {
      componentViolations.push({
        type: "MAGIC_NUMBER",
        severity: "high",
        component: relPath,
        line: lineNum,
        message: "Magic number for spacing detected",
        fix: "Use spacing token: p-[var(--spacing-md)]",
      })
    }

    // Check inline styles (allow if has DYNAMIC_VALUE exception nearby)
    if (
      VIOLATION_PATTERNS.inlineStyle.test(line) &&
      !isDynamicStyle(line) &&
      !hasDynamicValueExceptionNearby
    ) {
      componentViolations.push({
        type: "INLINE_STYLE",
        severity: "critical",
        component: relPath,
        line: lineNum,
        message: "Inline style detected",
        fix: "Use Tailwind utility classes with design tokens or CSS classes in globals.css",
      })
    }

    // Check desktop-first (but only if truly desktop-first)
    if (VIOLATION_PATTERNS.desktopFirst.test(line) && isDesktopFirstPattern(content, index)) {
      componentViolations.push({
        type: "DESKTOP_FIRST",
        severity: "critical",
        component: relPath,
        line: lineNum,
        message: "Desktop-first pattern detected",
        fix: "Use mobile-first approach: base styles + responsive overrides",
      })
    }

    // Check type leakage
    if (VIOLATION_PATTERNS.typeAny.test(line)) {
      componentViolations.push({
        type: "TYPE_LEAK",
        severity: "high",
        component: relPath,
        line: lineNum,
        message: "Type 'any' leakage detected",
        fix: "Use proper TypeScript types",
      })
    }

    // Check touch targets
    const touchMatch = line.match(VIOLATION_PATTERNS.smallTouchTarget)
    if (touchMatch) {
      const size = Number.parseInt(touchMatch[2])
      if (size < 44) {
        componentWarnings.push({
          type: "TOUCH_TARGET",
          component: relPath,
          line: lineNum,
          message: `Touch target ${size}px is below 44px minimum`,
        })
      }
    }
  })

  info.violations = componentViolations
  info.warnings = componentWarnings

  return info
}

function processExceptionAnnotation(annotation: string, component: string) {
  const reasonMatch = annotation.match(/Reason:\s*([^\n*]+)/)
  const ownerMatch = annotation.match(/Owner:\s*([^\n*]+)/)
  const expiryMatch = annotation.match(/Review-by:\s*([^\n*]+)/)

  const reason = reasonMatch ? reasonMatch[1].trim() : "UNKNOWN"
  const validReasons = Object.keys(EXCEPTION_REASON_MAP)
  const finalReason = validReasons.includes(reason) ? reason : "UNKNOWN"

  exceptions.push({
    id: generateExceptionId(),
    component,
    reason: EXCEPTION_REASON_MAP[finalReason] || reason,
    annotation: annotation
      .split("\n")
      .map((l) => l.trim())
      .join(" "),
    expiry: expiryMatch ? expiryMatch[1].trim() : undefined,
    owner: ownerMatch ? ownerMatch[1].trim() : undefined,
    status: "active",
  })
}

function isColorPickerContext(content: string, lineIndex: number): boolean {
  const lines = content.split("\n")
  // Check if we're in a color picker data array
  for (let i = 0; i <= lineIndex; i++) {
    if (lines[i].includes("ACCENT_COLORS") || lines[i].includes("colorPalette")) {
      return true
    }
  }
  return false
}

function isDynamicStyle(line: string): boolean {
  // Allow inline styles with dynamic values
  return /\{\s*.*?(?:\$\{.*?\}|props\.|state\.|\.value\b)/.test(line)
}

function detectResponsiveStrategy(
  content: string
): "mobile-first" | "desktop-first" | "none" | "mixed" {
  const hasMobileBase = !/^[\s\S]*?(md|lg|xl):/.test(content.substring(0, 500))
  const hasResponsive = /(md|lg|xl):/.test(content)

  if (!hasResponsive) return "none"
  if (hasMobileBase) return "mobile-first"

  // Check if desktop patterns dominate
  const desktopCount = (content.match(/(md|lg|xl):\S+/g) || []).length
  const mobileCount = (content.match(/\b(base|sm:)?\S+(?!\s+(md|lg|xl):)/g) || []).length

  return desktopCount > mobileCount * 2 ? "desktop-first" : "mixed"
}

function checkForNearbyException(
  lines: string[],
  lineIndex: number,
  exceptionType: string
): boolean {
  // Check 3 lines before and after for exception annotations
  const contextRange = 3
  for (
    let i = Math.max(0, lineIndex - contextRange);
    i <= Math.min(lines.length - 1, lineIndex + contextRange);
    i++
  ) {
    if (lines[i].includes("@design-exception") && lines[i].includes(exceptionType)) {
      return true
    }
  }
  return false
}

function isDesktopFirstPattern(content: string, lineIndex: number): boolean {
  // Updated for hybrid responsive approach:
  // - Hybrid: base classes + responsive overrides (ALLOWED)
  // - Desktop-first: ONLY responsive classes with no base (FORBIDDEN)
  const lines = content.split("\n")
  const currentLine = lines[lineIndex]

  // Check if this line has responsive classes
  if (!/(md|lg|xl):/.test(currentLine)) {
    return false // Not responsive, so not desktop-first
  }

  // Extract class names from current line
  const classMatch = currentLine.match(/className="([^"]+)"/)
  if (!classMatch) {
    return false
  }

  const classes = classMatch[1].split(" ").filter((c) => c.trim())

  // Count base classes (no breakpoint prefix) vs responsive classes
  const hasBaseClasses = classes.some(
    (cls) =>
      !/(md|lg|xl|sm):/.test(cls) && // Not a responsive class
      !cls.startsWith("[") && // Not an arbitrary value
      cls.length > 0 // Not empty
  )

  // Desktop-first violation: ONLY responsive classes with NO base classes at all
  // This is OK for the hybrid approach:
  // "grid grid-cols-1 md:grid-cols-2" - has base class "grid-cols-1"
  // "w-full sm:w-auto" - has base class "w-full"
  //
  // This would be desktop-first (but rare in practice):
  // "md:grid-cols-2 lg:grid-cols-4" - no base class at all
  if (!hasBaseClasses && classes.some((cls) => /(md|lg|xl):/.test(cls))) {
    // Check if it's a legitimate layout case (grid/flex) - these are OK with responsive-only
    const isGridLayout = classes.some((cls) => /(?:md|lg|xl):grid-cols-/.test(cls))
    const isFlexLayout = classes.some((cls) => /(?:md|lg|xl):flex-/.test(cls))

    // Allow responsive-only grid/flex as it's a common pattern for hybrid approach
    if (isGridLayout || isFlexLayout) {
      return false
    }

    // Flag as desktop-first only if truly no base classes
    return true
  }

  return false
}

function calculateTokenCoverage(content: string): number {
  const totalStyleProps = (content.match(/className=\{[^}]*\}|className="[^"]*"/g) || []).length
  const tokenUsage = (content.match(/var\(--[a-z-]+\)/g) || []).length

  if (totalStyleProps === 0) return 0
  return Math.min(tokenUsage / (totalStyleProps * 2), 1)
}

function detectDuplicates(components: ComponentInfo[]): void {
  // Simple similarity detection based on name patterns
  const nameMap = new Map<string, ComponentInfo[]>()

  for (const comp of components) {
    const baseName = comp.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (!nameMap.has(baseName)) {
      nameMap.set(baseName, [])
    }
    nameMap.get(baseName)?.push(comp)
  }

  for (const [_baseName, comps] of nameMap) {
    if (comps.length > 1) {
      recommendations.push({
        priority: "p1",
        category: "maintainability",
        description: `Duplicate component names detected: ${comps.map((c) => c.name).join(", ")}`,
        estimatedEffort: "1-2 hours",
      })
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// REPORT GENERATION
// ═══════════════════════════════════════════════════════════════

function generateReports() {
  // Ensure audit directory exists
  if (!existsSync(AUDIT_DIR)) {
    mkdirSync(AUDIT_DIR, { recursive: true })
  }

  const duration = Date.now() - startTime
  const criticalViolations = violations.filter((v) => v.severity === "critical").length
  const mobileFirstScore =
    components.reduce((sum, c) => {
      return sum + (c.responsiveStrategy === "mobile-first" ? 1 : 0)
    }, 0) / Math.max(components.length, 1)

  // 1. UI Normalization Report
  const normalizationReport = {
    meta: {
      timestamp: new Date().toISOString(),
      project: "starter-template-v1",
      mode: MODE,
      mobileFirstScore: Math.round(mobileFirstScore * 100) / 100,
      duration,
    },
    summary: {
      componentsScanned: components.length,
      violations: violations.length,
      warnings: warnings.length,
      exceptions: exceptions.length,
      duplications: recommendations.filter((r) => r.category === "maintainability").length,
      tokenCoverage:
        Math.round(
          (components.reduce((sum, c) => sum + c.tokenCoverage, 0) /
            Math.max(components.length, 1)) *
            100
        ) / 100,
    },
    violations,
    warnings,
    recommendations,
  }

  writeFileSync(
    join(AUDIT_DIR, "ui-normalization-report.json"),
    `${JSON.stringify(normalizationReport, null, 2)}\n`
  )

  // 2. Component Inventory
  const inventoryReport = {
    generatedAt: new Date().toISOString(),
    components,
  }

  writeFileSync(
    join(AUDIT_DIR, "component-inventory.json"),
    `${JSON.stringify(inventoryReport, null, 2)}\n`
  )

  // 3. Exception Registry
  const exceptionReport = {
    generatedAt: new Date().toISOString(),
    exceptions,
  }

  writeFileSync(
    join(AUDIT_DIR, "design-exceptions.json"),
    `${JSON.stringify(exceptionReport, null, 2)}\n`
  )

  // 4. Token Coverage Report
  const tokenReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTokens: 60, // Approximate from tokens.css with OKLCH system
      usedTokens: new Set(
        components.flatMap((c) => {
          const matches: string[] = []
          const content = readFileSync(c.path, "utf-8")
          const varMatches = content.matchAll(/var\(--([a-z-]+)\)/g)
          for (const match of varMatches) {
            matches.push(match[1])
          }
          return matches
        })
      ).size,
    },
    tokenUsage: {},
    componentCoverage: components.map((c) => ({
      component: c.path,
      coverage: c.tokenCoverage,
      unusedTokens: [],
    })),
  }

  writeFileSync(
    join(AUDIT_DIR, "token-coverage-report.json"),
    `${JSON.stringify(tokenReport, null, 2)}\n`
  )

  // 5. Migration Manifest (for isolate/assist-fix modes)
  if (MODE !== "inspect") {
    const manifestReport = {
      generatedAt: new Date().toISOString(),
      mode: MODE,
      sourceComponents: components.map((c) => c.path),
      extractedPath: EXTRACTION_DIR,
      changes: violations.map((v) => ({
        component: v.component,
        changeType: v.type,
        description: v.message,
      })),
    }

    writeFileSync(
      join(AUDIT_DIR, "migration-manifest.json"),
      JSON.stringify(manifestReport, null, 2)
    )
  }

  return {
    status: criticalViolations > 0 ? "fail" : violations.length > 0 ? "warn" : "pass",
    reports: [
      "ui-normalization-report.json",
      "component-inventory.json",
      "design-exceptions.json",
      "token-coverage-report.json",
      MODE !== "inspect" ? "migration-manifest.json" : null,
    ].filter(Boolean) as string[],
  }
}

// ═══════════════════════════════════════════════════════════════
// MODE HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleInspectMode(): AuditResult {
  const reportData = generateReports()

  return {
    layer: "ui-normalization",
    status: reportData.status,
    violations,
    warnings,
    recommendations,
    duration: Date.now() - startTime,
    metadata: {
      mode: "inspect",
      reports: reportData.reports,
    },
  }
}

function handleIsolateMode(): AuditResult {
  // Create extraction directory
  if (!existsSync(EXTRACTION_DIR)) {
    mkdirSync(EXTRACTION_DIR, { recursive: true })
  }

  const { copyFileSync } = require("node:fs")

  // Copy components to extraction directory
  for (const component of components) {
    const sourcePath = component.path
    const destPath = join(EXTRACTION_DIR, component.path)

    // Create directory structure
    mkdirSync(dirname(destPath), { recursive: true })

    // Copy file (would apply normalization here in full implementation)
    copyFileSync(sourcePath, destPath)
  }

  const reportData = generateReports()

  return {
    layer: "ui-normalization",
    status: reportData.status,
    violations,
    warnings,
    recommendations,
    duration: Date.now() - startTime,
    metadata: {
      mode: "isolate",
      reports: reportData.reports,
    },
  }
}

function handleAssistFixMode(): AuditResult {
  // Create patches directory
  if (!existsSync(PATCHES_DIR)) {
    mkdirSync(PATCHES_DIR, { recursive: true })
  }

  // Generate patch files for each component with violations
  const violationsByComponent = new Map<string, Violation[]>()
  for (const v of violations) {
    if (!violationsByComponent.has(v.component)) {
      violationsByComponent.set(v.component, [])
    }
    violationsByComponent.get(v.component)?.push(v)
  }

  for (const [componentPath, compViolations] of violationsByComponent) {
    const patchContent = {
      component: componentPath,
      violations: compViolations,
      suggestedFixes: compViolations.map((v) => ({
        type: v.type,
        line: v.line,
        fix: v.fix,
      })),
      instructions: `Review and apply fixes manually to: ${componentPath}`,
    }

    const patchFileName = `${componentPath.replace(/[\/\\]/g, "-")}.json`
    writeFileSync(join(PATCHES_DIR, patchFileName), `${JSON.stringify(patchContent, null, 2)}\n`)
  }

  const reportData = generateReports()

  return {
    layer: "ui-normalization",
    status: reportData.status,
    violations,
    warnings,
    recommendations,
    duration: Date.now() - startTime,
    metadata: {
      mode: "assist-fix",
      reports: reportData.reports,
    },
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

function main() {
  console.error("🔍 LAYER 07.5: UI Normalization & Design Integrity")
  console.error(`📋 Mode: ${MODE}`)
  console.error(`⏱️  Started: ${new Date().toISOString()}`)

  // Scan all component files
  let componentFiles = scanDirectory(COMPONENTS_DIR, [".tsx", ".jsx"])

  // Filter by AUDIT_FILES environment variable if set
  const auditFilesEnv = process.env.AUDIT_FILES
  if (auditFilesEnv) {
    const filesToAudit = auditFilesEnv.split(" ").filter((f) => f.length > 0)
    componentFiles = componentFiles.filter((file) =>
      filesToAudit.some((f) => file.endsWith(f) || file.includes(f))
    )
  }

  console.error(`📁 Found ${componentFiles.length} component files`)

  // Analyze each component
  for (const filePath of componentFiles) {
    try {
      const componentInfo = scanComponent(filePath)
      components.push(componentInfo)
      // Collect violations and warnings
      violations.push(...componentInfo.violations)
      warnings.push(...componentInfo.warnings)
    } catch (error) {
      warnings.push({
        type: "SCAN_ERROR",
        component: filePath,
        message: `Failed to scan component: ${error}`,
      })
    }
  }

  // Detect duplicates
  detectDuplicates(components)

  // Handle based on mode
  let result: AuditResult

  switch (MODE) {
    case "inspect":
      result = handleInspectMode()
      break
    case "isolate":
      result = handleIsolateMode()
      console.error(`📦 Components copied to: ${EXTRACTION_DIR}`)
      break
    case "assist-fix":
      result = handleAssistFixMode()
      console.error(`🔧 Patches generated in: ${PATCHES_DIR}`)
      break
  }

  console.error(
    `✅ Layer 07.5 (${MODE}): ${result.status.toUpperCase()} - ${violations.length} violations (${result.duration}ms)`
  )

  // Output result
  console.log(JSON.stringify(result, null, 2))

  // Exit with error code if critical violations found
  process.exit(result.status === "fail" ? 1 : 0)
}

// Run main function
main()
