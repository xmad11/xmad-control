#!/usr/bin/env bun
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"

const docs = [
  "documentation/OWNER_CHEATSHEET.md",
  "documentation/AGENT_INSTRUCTIONS.md",
  "documentation/DESIGN_SYSTEM.md",
  "documentation/MOBILE_FIRST.md",
  "documentation/COMPONENT_INVENTORY.md",
]

const hashes: Record<string, string> = {}

for (const doc of docs) {
  try {
    const content = readFileSync(doc, "utf-8")
    hashes[doc] = createHash("sha256").update(content).digest("hex")
    console.log(`Hashed: ${doc}`)
  } catch (_e) {
    console.error(`Failed to read: ${doc}`)
  }
}

const ackData = {
  timestamp: new Date().toISOString(),
  agent: "claude-code",
  docs: hashes,
}

writeFileSync(".guard/ACK_OK.json", JSON.stringify(ackData, null, 2))
console.log("\nAcknowledgment file created: .guard/ACK_OK.json")
