/**
 * Memory Editor Module
 * Read/write OpenClaw memory files
 */

const fs = require("node:fs").promises
const path = require("node:path")

class MemoryEditor {
  constructor() {
    this.memoryPath = path.join(process.env.HOME, "xmad", "openclaw", "workspace")
  }

  async list() {
    const files = await fs.readdir(this.memoryPath).catch(() => [])
    return files.filter((f) => f.endsWith(".md") || f.startsWith("MEMORY"))
  }

  async read(filename) {
    const filePath = path.join(this.memoryPath, filename)
    const content = await fs.readFile(filePath, "utf8")
    return { filename, content, size: content.length }
  }

  async write(filename, content) {
    const filePath = path.join(this.memoryPath, filename)
    await fs.writeFile(filePath, content, "utf8")
    return { success: true, filename, size: content.length }
  }

  async append(filename, content) {
    const filePath = path.join(this.memoryPath, filename)
    await fs.appendFile(filePath, `\n${content}`, "utf8")
    return { success: true, filename, appended: content.length }
  }

  async search(query) {
    const files = await this.list()
    const results = []
    for (const file of files) {
      const content = await fs.readFile(path.join(this.memoryPath, file), "utf8")
      if (content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          file,
          matches: content.split("\n").filter((l) => l.toLowerCase().includes(query.toLowerCase())),
        })
      }
    }
    return results
  }
}

module.exports = MemoryEditor
