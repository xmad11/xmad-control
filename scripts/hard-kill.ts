// scripts/hard-kill.ts
import { execSync } from "node:child_process"

/**
 * Hard Kill Switch - Phase 2 Security
 * Immediately terminates all project-related processes.
 */

const killPorts = [3000, 3001]

console.error("🚨 CRITICAL: HARD KILL SWITCH ACTIVATED 🚨")

killPorts.forEach((port) => {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore" })
    console.log(`💀 Nuked process on port ${port}`)
  } catch {
    // Port already clean
  }
})

try {
  // Kill any running bun/next processes in this directory
  execSync("pkill -9 -f 'next-server|bun next'", { stdio: "ignore" })
  console.log("💀 Nuked Next.js/Bun servers")
} catch {
  // No processes found
}

console.log("🔒 System Safety: CLEAN")
process.exit(1)
