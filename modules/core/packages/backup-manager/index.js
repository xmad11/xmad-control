/**
 * Backup Manager Module
 * Automatic backup of OpenClaw workspace and memory
 */

const fs = require("node:fs").promises
const path = require("node:path")
const { exec } = require("node:child_process")
const { promisify } = require("node:util")

const execAsync = promisify(exec)

class BackupManager {
  constructor() {
    this.backupRoot = path.join(process.env.HOME, "xmad", "storage", "backups")
  }

  async createBackup(name = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupName = name || `backup-${timestamp}`
    const backupPath = path.join(this.backupRoot, backupName)
    const openclawPath = path.join(process.env.HOME, "xmad", "openclaw")

    await fs.mkdir(backupPath, { recursive: true })

    // Create tarball of workspace and memory
    const tarball = path.join(backupPath, `openclaw-backup-${timestamp}.tar.gz`)
    await execAsync(`tar -czf "${tarball}" -C "${openclawPath}" workspace memory openclaw.json`)

    return {
      success: true,
      backupPath,
      tarball,
      size: (await fs.stat(tarball)).size,
      timestamp: new Date().toISOString(),
    }
  }

  async listBackups() {
    try {
      const backups = await fs.readdir(this.backupRoot)
      const details = await Promise.all(
        backups.map(async (name) => {
          const backupPath = path.join(this.backupRoot, name)
          const stat = await fs.stat(backupPath)
          const files = await fs.readdir(backupPath).catch(() => [])
          return { name, created: stat.birthtime, size: stat.size, files }
        })
      )
      return details.sort((a, b) => b.created - a.created)
    } catch (_error) {
      return []
    }
  }

  async restoreBackup(backupName) {
    const backupPath = path.join(this.backupRoot, backupName)
    const tarball = (await fs.readdir(backupPath)).find((f) => f.endsWith(".tar.gz"))

    if (!tarball) throw new Error("No backup tarball found")

    const openclawPath = path.join(process.env.HOME, "xmad", "openclaw")
    await execAsync(`tar -xzf "${path.join(backupPath, tarball)}" -C "${openclawPath}"`)

    return { success: true, restored: tarball }
  }

  async cleanupOldBackups(keepCount = 7) {
    const backups = await this.listBackups()
    if (backups.length <= keepCount) return { deleted: 0 }

    const toDelete = backups.slice(keepCount)
    await Promise.all(
      toDelete.map((b) => fs.rm(path.join(this.backupRoot, b.name), { recursive: true }))
    )

    return { deleted: toDelete.length, backups: toDelete.map((b) => b.name) }
  }
}

module.exports = BackupManager
