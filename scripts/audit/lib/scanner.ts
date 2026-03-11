/**
 * Shared file scanner with CENTRALIZED exclusions
 *
 * SAFETY FEATURES:
 * - Never scans scripts/audit/ (prevents infinite loops)
 * - Never scans .next, node_modules (prevents slowdowns)
 * - Consistent exclusion patterns across all layers
 */

import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { SOURCE_EXTENSIONS, shouldExcludeDirectory } from "./exclusions"

/**
 * Scan directory for files with specified extensions
 * Uses centralized exclusion system for safety
 */
export function scanDirectory(dir: string, customExtensions?: string[]): string[] {
  const results: string[] = []
  const extensions = customExtensions || [...SOURCE_EXTENSIONS]

  function scan(currentDir: string) {
    try {
      const items = readdirSync(currentDir)

      for (const item of items) {
        // Skip excluded directories FIRST (before stat call - faster!)
        if (shouldExcludeDirectory(item)) {
          continue
        }

        const fullPath = join(currentDir, item)

        // Check if it's a directory
        if (statSync(fullPath).isDirectory()) {
          scan(fullPath)
        } else if (extensions.some((ext) => item.endsWith(ext))) {
          // Double-check full path exclusion (safety net)
          const filePathNormalized = fullPath.replace(/\\/g, "/")

          // CRITICAL: Skip audit scripts (prevents infinite loop)
          if (filePathNormalized.includes("scripts/audit")) continue
          if (filePathNormalized.includes("node_modules")) continue
          if (filePathNormalized.includes(".next")) continue

          results.push(fullPath)
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  scan(dir)
  return results
}

/**
 * Scan only source files (TypeScript/JavaScript)
 * Automatically filters out non-source files
 */
export function scanSourceFiles(dir: string): string[] {
  return scanDirectory(dir, SOURCE_EXTENSIONS)
}

/**
 * Scan for TypeScript files only
 */
export function scanTypeScriptFiles(dir: string): string[] {
  return scanDirectory(dir, [".ts", ".tsx"])
}

/**
 * Scan for JSX/TSX files only (components)
 */
export function scanComponentFiles(dir: string): string[] {
  return scanDirectory(dir, [".tsx", ".jsx"])
}

/**
 * Read file content safely
 */
export function readFileContent(filePath: string): string {
  return Bun.file(filePath).text()
}
