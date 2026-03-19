#!/usr/bin/env bun
/**
 * Generate Service Worker version based on build timestamp
 * Run this before build to ensure cache invalidation on every deploy
 *
 * Usage: bun run scripts/generate-sw-version.ts
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const SW_PATH = join(process.cwd(), "app/sw.js")
const PACKAGE_PATH = join(process.cwd(), "package.json")

// Read package.json for base version
const pkg = JSON.parse(readFileSync(PACKAGE_PATH, "utf-8"))
const baseVersion = pkg.version || "1.0.0"

// Generate timestamp-based cache version (YYYYMMDDHHMM format)
const now = new Date()
const timestamp = now
  .toISOString()
  .replace(/[-:T.Z]/g, "")
  .slice(0, 12)

// Combined version: semver-timestamp
const CACHE_VERSION = `${baseVersion}-${timestamp}`

console.log(`[SW Version] Generating version: ${CACHE_VERSION}`)

// Read current SW file
let swContent = readFileSync(SW_PATH, "utf-8")

// Replace the CACHE_VERSION constant
swContent = swContent.replace(
  /const CACHE_VERSION = ["'][^"']+["']/,
  `const CACHE_VERSION = "${CACHE_VERSION}"`
)

// Write back
writeFileSync(SW_PATH, swContent)

console.log(`[SW Version] ✅ Updated app/sw.js with version: ${CACHE_VERSION}`)
