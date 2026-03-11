// scripts/phase1-lock.ts
import { execSync } from "node:child_process"
import os from "node:os"

// =====================
// CONFIG
// =====================
const ALLOWED_PORT = 3000
const BLOCKED_PORTS = [3000, 3001]

// =====================
// 1️⃣ Kill conflicting ports (macOS compatible)
// =====================
BLOCKED_PORTS.forEach((port) => {
  try {
    // Using lsof and kill for macOS compatibility
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore" })
    console.log(`✅ Killed any process on port ${port}`)
  } catch {
    console.log(`ℹ️ No process running on port ${port}`)
  }
})

// =====================
// 2️⃣ Enforce allowed port
// =====================
if (process.env.PORT && Number(process.env.PORT) !== ALLOWED_PORT) {
  console.error(`🚨 Only port ${ALLOWED_PORT} is allowed. Found: ${process.env.PORT}`)
  process.exit(1)
}
process.env.PORT = ALLOWED_PORT.toString()
console.log(`✅ Server forced to run on port ${ALLOWED_PORT}`)

// =====================
// 3️⃣ Show LAN IPs for mobile access
// =====================
console.log("🌐 Active network IPs (for mobile access):")
const interfaces = os.networkInterfaces()
for (const name of Object.keys(interfaces)) {
  const ifaceList = interfaces[name]
  if (!ifaceList) continue

  for (const iface of ifaceList) {
    if (iface.family === "IPv4" && !iface.internal) {
      console.log(`- ${name}: http://${iface.address}:${ALLOWED_PORT}`)
    }
  }
}

// =====================
// 4️⃣ Dev server runner
// =====================
try {
  console.log("🚀 Starting Next.js dev server...")
  // Using bun to run next directly
  execSync(`bun next dev --hostname 0.0.0.0 --port ${ALLOWED_PORT}`, {
    stdio: "inherit",
  })
} catch (_err) {
  // If the process was interrupted (Ctrl+C), exit gracefully
  process.exit(0)
}
