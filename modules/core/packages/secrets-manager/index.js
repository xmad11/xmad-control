/**
 * Environment & Secrets Manager
 * Resolves secrets from Keychain, Infisical, or local vault
 */

const { exec } = require("node:child_process")

class SecretsManager {
  constructor() {
    this.sources = ["keychain", "infisical", "local"]
  }

  async getSecret(key) {
    // Try Keychain first (macOS)
    try {
      const keychainResult = await this.getFromKeychain(key)
      if (keychainResult) return keychainResult
    } catch (error) {
      console.debug(`Keychain lookup failed for ${key}: ${error.message}`)
    }

    // Try Infisical second
    try {
      const infisicalResult = await this.getFromInfisical(key)
      if (infisicalResult) return infisicalResult
    } catch (error) {
      console.debug(`Infisical lookup failed for ${key}: ${error.message}`)
    }

    // Try local vault fallback
    try {
      const localResult = await this.getFromLocal(key)
      if (localResult) return localResult
    } catch (error) {
      console.debug(`Local vault lookup failed for ${key}: ${error.message}`)
    }

    throw new Error(`Secret not found: ${key}`)
  }

  async getFromKeychain(key) {
    return new Promise((resolve, reject) => {
      exec(`security find-generic-password -s "${key}" -w 2>/dev/null`, (error, stdout) => {
        if (error) reject(error)
        else resolve(stdout.trim())
      })
    })
  }

  async getFromInfisical(key) {
    return new Promise((resolve, reject) => {
      exec(`infisical get --env=dev --key="${key}" 2>/dev/null`, (error, stdout) => {
        if (error) reject(error)
        else resolve(stdout.trim())
      })
    })
  }

  async getFromLocal(key) {
    const fs = require("node:fs").promises
    const path = require("node:path")
    const vaultPath = path.join(process.env.HOME, ".xmad", "vault.json")

    try {
      const vault = JSON.parse(await fs.readFile(vaultPath, "utf8"))
      return vault[key] || null
    } catch {
      return null
    }
  }

  async setSecret(key, value, source = "local") {
    if (source === "keychain") {
      return new Promise((resolve, reject) => {
        exec(
          `security add-generic-password -s "${key}" -a "${value}" -w "${value}" -U`,
          (error) => {
            if (error) reject(error)
            else resolve(true)
          }
        )
      })
    }

    if (source === "local") {
      const fs = require("node:fs").promises
      const path = require("node:path")
      const vaultPath = path.join(process.env.HOME, ".xmad", "vault.json")

      await fs.mkdir(path.dirname(vaultPath), { recursive: true })

      let vault = {}
      try {
        vault = JSON.parse(await fs.readFile(vaultPath, "utf8"))
      } catch {}

      vault[key] = value
      await fs.writeFile(vaultPath, JSON.stringify(vault, null, 2))
      return true
    }

    throw new Error(`Invalid source: ${source}`)
  }
}

module.exports = SecretsManager
