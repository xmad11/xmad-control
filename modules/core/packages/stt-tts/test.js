#!/usr/bin/env node
// Test script for STT/TTS package
// Run: node test.js

const { checkKeys } = require("./index.js")

console.log("🔑 Checking STT/TTS keys...\n")

checkKeys()
  .then((results) => {
    console.log("Results:")
    console.log("─────────────────────────────────────")
    console.log(`Groq Key: ${results.groq ? "✅ SET" : "❌ NOT SET"}`)
    console.log(`ElevenLabs Key: ${results.elevenlabs ? "✅ SET" : "❌ NOT SET"}`)
    console.log(`Groq Reachable: ${results.groqReachable ? "✅ YES" : "❌ NO"}`)
    console.log(`Voice ID: ${results.voiceId}`)
    console.log(`Model: ${results.model}`)
    console.log("─────────────────────────────────────")

    if (results.groq && results.elevenlabs && results.groqReachable) {
      console.log("\n✅ All systems ready!")
      process.exit(0)
    } else {
      console.log("\n⚠️  Some issues detected. Check keys.")
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("\n❌ Error:", err.message)
    process.exit(1)
  })
