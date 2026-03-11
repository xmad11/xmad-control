// scripts/env-guard.ts
import fs from "node:fs"
import path from "node:path"

/**
 * Environment Guard - Phase 2 Security
 * Prevents unauthorized environment configuration and detects leaks.
 */

const REQUIRED_ENV = [".env.local", ".env.local.example"]
const _FORBIDDEN_STRINGS = ["password", "secret_key", "aws_secret"] // Example leak detection

console.log("🛡️ Running Environment Guard...")

REQUIRED_ENV.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (!fs.existsSync(filePath)) {
    console.error(`🚨 MISSING CRITICAL FILE: ${file}`)
    process.exit(1)
  }
})

// Check for loose sensitive files in root
const rootFiles = fs.readdirSync(process.cwd())
const sensitiveExtensions = [".pem", ".key", ".pfx"]
rootFiles.forEach((file) => {
  if (sensitiveExtensions.some((ext) => file.endsWith(ext))) {
    console.error(`🚨 FORBIDDEN SENSITIVE FILE IN ROOT: ${file}`)
    process.exit(1)
  }
})

console.log("✅ Environment Guard: PASS")
