/**
 * CENTRALIZED EXCLUSION SYSTEM
 *
 * Prevents infinite loops and unwanted scans:
 * - Never scan audit scripts (self-audit prevention)
 * - Never scan build artifacts (.next, dist, build)
 * - Never scan dependencies (node_modules)
 * - Never scan cache folders (.turbo, .cache)
 *
 * CRITICAL: This prevents infinite loops when audit layers scan themselves
 */

// ============================================================================
// HARDCODED EXCLUSIONS (Audit system safety)
// These are ALWAYS excluded, regardless of .gitignore
// ============================================================================

export const AUDIT_EXCLUSIONS = {
  // Audit system itself (CRITICAL - prevents infinite loop)
  auditScripts: "scripts/audit/",
  auditSpecs: "scripts/audit/specs/",
  auditPlans: "scripts/audit/plans/",

  // Build outputs (heavy, not source code)
  build: ".next/",
  buildStatic: ".next/static/",
  out: "out/",
  dist: "dist/",
  buildFolder: "build/",

  // Dependencies (huge, not source code)
  nodeModules: "node_modules/",

  // Caches (temp files)
  turbo: ".turbo/",
  cache: ".cache/",
  nextCache: ".next/cache/",

  // IDE & OS (not source code)
  vscode: ".vscode/",
  idea: ".idea/",
  dsStore: ".DS_Store",

  // Audit outputs (not source code)
  auditOutput: ".audit/",
  extraction: ".extraction/",
  guard: ".guard/",
} as const

// Combined regex patterns for fast checking
export const EXCLUDE_PATTERNS = [
  /scripts\/audit/, // Audit system (CRITICAL - prevents infinite loop)
  /node_modules/, // Dependencies
  /\.next/, // Next.js build
  /\.turbo/, // Turbopack cache
  /\/\.git\//, // Git internals
  /\.audit\//, // Audit output (when scanning outside)
  /\.extraction\//, // Extraction copies
  /\.guard\//, // Guard locks
  /\.DS_Store/, // macOS files
  /\.vscode\//, // VSCode
  /\.idea\//, // JetBrains IDEs
  /coverage\//, // Test coverage
  /dist\//, // Build output
  /build\//, // Build output
] as const

// ============================================================================
// Check if path should be excluded
// ============================================================================

export function shouldExcludePath(filePath: string): boolean {
  // Normalize path for consistent matching
  const normalizedPath = filePath.replace(/\\/g, "/")

  // Fast check against regex patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return true
    }
  }

  return false
}

// ============================================================================
// Check if directory should be excluded (directory name only)
// ============================================================================

export function shouldExcludeDirectory(dirName: string): boolean {
  const excludeDirs = new Set([
    "node_modules",
    ".next",
    ".turbo",
    ".git",
    ".audit",
    ".extraction",
    ".guard",
    "coverage",
    "dist",
    "build",
    ".vscode",
    ".idea",
    "__pycache__",
  ])

  return excludeDirs.has(dirName) || dirName.startsWith(".")
}

// ============================================================================
// Get allowed file extensions for scanning
// ============================================================================

export const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"] as const

// ============================================================================
// Filter files using exclusion system
// ============================================================================

export function filterSourceFiles(files: string[]): string[] {
  return files.filter((file) => {
    // Must be a source extension
    const hasValidExt = SOURCE_EXTENSIONS.some((ext) => file.endsWith(ext))
    if (!hasValidExt) return false

    // Must not be excluded
    return !shouldExcludePath(file)
  })
}
