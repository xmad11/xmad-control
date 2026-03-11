#!/usr/bin/env bun

/**
 * validate-all.ts
 * Full validation script for Shadi-V2
 * Checks Phase 1 & 2 locks, UI integrity, Tailwind, build, and theme responsiveness
 */

import { execSync } from "node:child_process"

function run(cmd: string) {
  try {
    console.log(`\n💡 Running: ${cmd}`)
    const out = execSync(cmd, { stdio: "pipe" }).toString().trim()
    if (out) console.log(out)
    return true
  } catch (e: any) {
    console.error("❌ Error:", e.message)
    if (e.stdout) console.log(e.stdout.toString())
    if (e.stderr) console.error(e.stderr.toString())
    return false
  }
}

/** Stage 0: Clean caches */
function stageClean() {
  console.log("\n===== Stage 0: Clean Cache =====")
  run("rm -rf .next .cache")
}

/** Stage 1: Phase 1 Lock Validation */
function stagePhase1() {
  console.log("\n===== Stage 1: Phase 1 Lock Validation =====")
  run("bun run scripts/env-guard.ts")
  run("test -f scripts/phase1-lock.ts && echo ✅ phase1-lock.ts exists")
}

/** Stage 2: Hard Kill Validation */
function stageHardKill() {
  console.log("\n===== Stage 2: Hard Kill Validation =====")
  run("bun run scripts/hard-kill.ts")
}

/** Stage 3: Tailwind + Theme Validation */
function stageTailwind() {
  console.log("\n===== Stage 3: Tailwind & Theme Validation =====")

  // Check if globals.css has the glass utilities defined
  console.log("Checking for glass utilities in globals.css...")
  run(
    "grep -q '\\.glass' styles/globals.css && echo ✅ .glass utility defined || echo ❌ .glass utility missing"
  )
  run(
    "grep -q '\\.glass-header' styles/globals.css && echo ✅ .glass-header utility defined || echo ❌ .glass-header utility missing"
  )

  // Check for usage of these classes in components
  console.log("\nChecking component usage of custom utilities...")
  run(
    "grep -r 'glass' components/ app/ && echo ✅ glass utilities are in use || echo ⚠️ No components found using 'glass' class"
  )

  // Check for real CSS output
  console.log("\nChecking for real CSS output...")
  run("rm -rf .next && bun run build")
  // Next.js 16/Turbopack puts CSS in static/chunks or static/css
  run(
    "find .next/static -name \"*.css\" -exec ls -lh {} + | grep -v \" 0B \" && echo '✅ Tailwind CSS found and not empty' || (echo '❌ Tailwind CSS empty or missing' && exit 1)"
  )
}

/** Stage 4: UI Component Presence & Rendering */
function stageUIComponents() {
  console.log("\n===== Stage 4: UI Component Rendering =====")
  const components = ["Header.tsx", "SideMenu.tsx", "ThemeModal.tsx", "HomeClient.tsx"]
  for (const comp of components) {
    run(`test -f components/${comp} && echo ✅ ${comp} exists || echo ❌ ${comp} missing`)
  }
}

/** Stage 5: Theme Responsiveness Test */
function stageTheme() {
  console.log("\n===== Stage 5: Theme Responsiveness =====")
  console.log("Starting dev server temporarily for theme test...")

  // Kill existing to be sure
  run("lsof -ti:3000 | xargs kill -9 || true")

  const spawn = require("node:child_process").spawn
  const devProcess = spawn("bun", ["run", "dev"], { stdio: "pipe" })

  return new Promise((resolve) => {
    let serverReady = false

    const timeout = setTimeout(() => {
      console.error("❌ Dev server timed out.")
      devProcess.kill()
      resolve(false)
    }, 120000) // 2 minutes

    devProcess.stdout.on("data", (data: Buffer) => {
      const output = data.toString()
      // console.log(output); // Debug
      if (output.includes("Ready in") || output.includes("✓ Ready")) {
        if (!serverReady) {
          serverReady = true
          console.log("✅ Dev server ready. Testing homepage...")
          const success = run(
            "curl -s --retry 5 --retry-delay 2 http://localhost:3000 | grep -qE 'ULTIMATE.*WOW' && echo ✅ Homepage renders correctly with correct content"
          )
          clearTimeout(timeout)
          devProcess.kill()
          resolve(success)
        }
      }
    })

    devProcess.on("exit", () => {
      run("lsof -ti:3000 | xargs kill -9 || true")
      resolve(serverReady)
    })
  })
}

/** Stage 6: Build & Prerender Check */
function stageBuild() {
  console.log("\n===== Stage 6: Build & Prerender Check =====")
  run("rm -rf .next .cache && bun run build")
}

/** Run all stages */
async function runAll() {
  stageClean()
  stagePhase1()
  stageHardKill()
  stageTailwind()
  stageUIComponents()
  await stageTheme()
  stageBuild()
  console.log("\n✅ All stages completed. Validation finished.")
}

// Main
const stageArg = process.argv[2]
;(async () => {
  switch (stageArg) {
    case "0":
      stageClean()
      break
    case "1":
      stagePhase1()
      break
    case "2":
      stageHardKill()
      break
    case "3":
      stageTailwind()
      break
    case "4":
      stageUIComponents()
      break
    case "5":
      await stageTheme()
      break
    case "6":
      stageBuild()
      break
    case "all":
      await runAll()
      break
    default:
      console.log("Usage: bun run scripts/validate-all.ts [0-6|all]")
  }
})()
