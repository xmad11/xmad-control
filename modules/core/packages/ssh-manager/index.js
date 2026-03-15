/**
 * SSH Manager Module
 * Control macOS SSH server
 */

const { exec } = require("node:child_process")

class SSHManager {
  async status() {
    return new Promise((resolve, reject) => {
      exec("sudo systemsetup -getremotelogin", (error, stdout) => {
        if (error) reject(error)
        else
          resolve({
            enabled: stdout.includes("On") || stdout.includes("Enabled"),
            status: stdout.trim(),
          })
      })
    })
  }

  async start() {
    return new Promise((resolve, reject) => {
      exec("sudo systemsetup -setremotelogin on", (error) => {
        if (error) reject(error)
        else resolve({ status: "SSH enabled" })
      })
    })
  }

  async stop() {
    return new Promise((resolve, reject) => {
      exec("sudo systemsetup -setremotelogin off", (error) => {
        if (error) reject(error)
        else resolve({ status: "SSH disabled" })
      })
    })
  }
}

module.exports = SSHManager
