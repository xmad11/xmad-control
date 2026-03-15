#!/usr/bin/env node

/**
 * Clone Coordinator System to a new project
 * Usage: bun run coordinator:clone <targetPath> <projectName>
 * Example: bun run coordinator:clone /Users/ahmadabdullah/Desktop my-new-project
 */

const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

// Get arguments from command line
const args = process.argv.slice(2)

if (args.length < 2) {
  console.error("❌ Usage: bun run coordinator:clone <targetPath> <projectName>")
  console.error("   Example: bun run coordinator:clone /Users/ahmadabdullah/Desktop my-new-project")
  process.exit(1)
}

const targetPath = path.resolve(args[0])
const projectName = args[1].replace(/[^a-zA-Z0-9-_]/g, "") // Sanitize project name
const newProjectPath = path.join(targetPath, projectName)

// Source directory (current project)
const sourceDir = __dirname

console.log(`\n🚀 Cloning Coordinator System to: ${newProjectPath}\n`)

// Files and folders to copy
const itemsToCopy = [
  { src: "coordinator-system.md", dest: "coordinator-system.md" },
  { src: "docs/COORDINATOR_USER_MANUAL.md", dest: "docs/COORDINATOR_USER_MANUAL.md" },
  { src: "docs/COORDINATOR_CHEAT_SHEET.md", dest: "docs/COORDINATOR_CHEAT_SHEET.md" },
  { src: "scripts/start-coordinator.sh", dest: "scripts/start-coordinator.sh" },
  { src: "scripts/validate-coordinator.js", dest: "scripts/validate-coordinator.js" },
  { src: "scripts/update-dashboard.js", dest: "scripts/update-dashboard.js" },
  { src: "scripts/clone-coordinator.js", dest: "scripts/clone-coordinator.js" },
  { src: "prompts/prompts.json", dest: "prompts/prompts.json" },
  { src: "dashboard/index.html", dest: "dashboard/index.html" },
]

try {
  // Create target directory
  if (!fs.existsSync(newProjectPath)) {
    fs.mkdirSync(newProjectPath, { recursive: true })
    console.log(`✅ Created directory: ${newProjectPath}`)
  }

  // Copy files and folders
  let copiedCount = 0
  for (const item of itemsToCopy) {
    const srcPath = path.join(sourceDir, "..", item.src)
    const destPath = path.join(newProjectPath, item.dest)

    // Create destination directory if needed
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // Copy file
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`✅ Copied: ${item.src}`)
      copiedCount++
    } else {
      console.warn(`⚠️  Not found: ${item.src}`)
    }
  }

  // Create minimal package.json with coordinator scripts
  const packageJsonPath = path.join(newProjectPath, "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      private: true,
      scripts: {
        coordinator: "bash scripts/start-coordinator.sh",
        "coordinator:validate": "node scripts/validate-coordinator.js",
        "coordinator:dashboard": "bun run scripts/update-dashboard.js && open dashboard/index.html",
        "dashboard:update": "bun run scripts/update-dashboard.js",
        "dashboard:open": "open dashboard/index.html",
        "coordinator:clone": "node scripts/clone-coordinator.js",
      },
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("✅ Created: package.json")
  }

  // Make scripts executable
  const bashScripts = [
    path.join(newProjectPath, "scripts/start-coordinator.sh"),
    path.join(newProjectPath, "scripts/clone-coordinator.js"),
  ]

  for (const script of bashScripts) {
    if (fs.existsSync(script)) {
      try {
        fs.chmodSync(script, 0o755)
        console.log(`✅ Made executable: ${path.relative(newProjectPath, script)}`)
      } catch (err) {
        console.warn(`⚠️  Could not chmod ${script}: ${err.message}`)
      }
    }
  }

  // Add alias to .zshrc
  const zshrcPath = path.join(process.env.HOME, ".zshrc")
  const aliasLine = `\n# Coordinator Alias for ${projectName}\nalias claude2-${projectName}="cd ${newProjectPath} && bun run coordinator"\n`

  try {
    let zshrcContent = ""
    if (fs.existsSync(zshrcPath)) {
      zshrcContent = fs.readFileSync(zshrcPath, "utf8")
    }

    // Check if alias already exists
    if (!zshrcContent.includes(`claude2-${projectName}`)) {
      fs.appendFileSync(zshrcPath, aliasLine)
      console.log(`✅ Added alias to .zshrc: claude2-${projectName}`)
    } else {
      console.log(`ℹ️  Alias already exists: claude2-${projectName}`)
    }
  } catch (err) {
    console.warn(`⚠️  Could not update .zshrc: ${err.message}`)
  }

  console.log(`\n${"=".repeat(60)}`)
  console.log("🎉 Coordinator System cloned successfully!")
  console.log(`${"=".repeat(60)}\n`)
  console.log(`📍 Location: ${newProjectPath}`)
  console.log(`📊 Files copied: ${copiedCount}`)
  console.log("\n🚀 To start the Coordinator in your new project:\n")
  console.log("   Option 1 - Use alias (reload shell first):\n")
  console.log(`   claude2-${projectName}\n`)
  console.log("   Option 2 - Navigate and run:\n")
  console.log(`   cd ${newProjectPath}`)
  console.log("   bun run coordinator\n")
  console.log(`${"=".repeat(60)}\n`)
} catch (err) {
  console.error(`\n❌ Error cloning Coordinator: ${err.message}\n`)
  process.exit(1)
}
