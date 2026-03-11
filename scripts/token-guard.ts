import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(process.cwd(), "styles")
const TOKEN_FILES = [
  "tokens.css", // SSOT - all tokens
  "tokens.core.css", // Core tokens (LOCKED)
  "tokens.components.css", // Component tokens (LOCKED)
  "tokens.motion.css", // Motion tokens (LOCKED)
  "themes.css", // Theme switching (LOCKED)
  "utilities.visual.css", // Visual utilities (LOCKED)
  "globals.css", // Global styles (allowed)
  "utilities.css", // Utilities (allowed)
  "tokens/mask.css", // Mask utilities (allowed)
]

function scan(file: string): string[] {
  const content = fs.readFileSync(file, "utf8")
  const matches = content.match(/--[a-z0-9-]+:/g) || []
  return matches.map((m) => m.replace(":", ""))
}

const allowedTokens = new Set<string>()

for (const file of TOKEN_FILES) {
  const filePath = path.join(ROOT, file)
  if (fs.existsSync(filePath)) {
    scan(filePath).forEach((t) => allowedTokens.add(t))
  }
}

function walk(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file)
    if (fs.statSync(full).isDirectory()) {
      walk(full)
    } else if (file.endsWith(".css") && !TOKEN_FILES.includes(file)) {
      const tokens = scan(full)
      const illegal = tokens.filter((t) => !allowedTokens.has(t))
      if (illegal.length) {
        console.error(`❌ Illegal tokens in ${file}:`, illegal)
        process.exit(1)
      }
    }
  }
}

walk(ROOT)
console.log("✅ Token guard passed")
