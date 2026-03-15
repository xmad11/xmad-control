/**
 * System Monitor Module
 * Real-time system metrics
 */

const { exec } = require("node:child_process")

class SystemMonitor {
  async getCpuUsage() {
    return new Promise((resolve, reject) => {
      exec("ps -A -o %cpu | awk '{s+=$1} END {print s}'", (error, stdout) => {
        if (error) reject(error)
        else resolve({ usage: Number.parseFloat(stdout.trim() || 0) })
      })
    })
  }

  async getMemoryUsage() {
    return new Promise((resolve, reject) => {
      exec("vm_stat", (error, stdout) => {
        if (error) reject(error)
        else {
          const freePages = Number.parseInt(stdout.match(/Pages free:\s+(\d+)/)?.[1] || "0")
          const freeGB = (freePages * 4096) / 1024 ** 3
          const totalGB = 8
          resolve({
            free: `${freeGB.toFixed(2)}GB`,
            used: `${(totalGB - freeGB).toFixed(2)}GB`,
            total: `${totalGB}GB`,
            percentage: (((totalGB - freeGB) / totalGB) * 100).toFixed(1),
          })
        }
      })
    })
  }

  async getDiskUsage() {
    return new Promise((resolve, reject) => {
      exec("df -h /", (error, stdout) => {
        if (error) reject(error)
        else {
          const [, used, avail, percentage] = stdout.split("\n")[1].split(/\s+/)
          resolve({ used, avail, percentage })
        }
      })
    })
  }

  async getAllStats() {
    const [cpu, memory, disk] = await Promise.all([
      this.getCpuUsage(),
      this.getMemoryUsage(),
      this.getDiskUsage(),
    ])

    return { cpu, memory, disk, timestamp: new Date().toISOString() }
  }
}

module.exports = SystemMonitor
