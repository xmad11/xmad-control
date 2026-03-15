/**
 * Automation Queue Module
 * Task scheduling and execution queue
 */

const fs = require("node:fs").promises
const path = require("node:path")

class AutomationQueue {
  constructor() {
    this.queuePath = path.join(process.env.HOME, "xmad", "storage", "automation-queue.json")
  }

  async load() {
    try {
      const data = await fs.readFile(this.queuePath, "utf8")
      return JSON.parse(data)
    } catch {
      return { queue: [], history: [] }
    }
  }

  async save(data) {
    await fs.mkdir(path.dirname(this.queuePath), { recursive: true })
    const tempPath = `${this.queuePath}.tmp`
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2))
    await fs.rename(tempPath, this.queuePath)
  }

  async add(task) {
    const data = await this.load()
    const queuedTask = {
      id: Date.now().toString(),
      ...task,
      status: "queued",
      createdAt: new Date().toISOString(),
    }
    data.queue.push(queuedTask)
    await this.save(data)
    return queuedTask
  }

  async next() {
    const data = await this.load()
    return data.queue[0] || null
  }

  async complete(taskId, result) {
    const data = await this.load()
    const taskIndex = data.queue.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) throw new Error("Task not found")

    const [task] = data.queue.splice(taskIndex, 1)
    task.status = "completed"
    task.completedAt = new Date().toISOString()
    task.result = result

    data.history.unshift(task)
    await this.save(data)
    return task
  }

  async fail(taskId, error) {
    const data = await this.load()
    const taskIndex = data.queue.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) throw new Error("Task not found")

    const [task] = data.queue.splice(taskIndex, 1)
    task.status = "failed"
    task.failedAt = new Date().toISOString()
    task.error = error

    data.history.unshift(task)
    await this.save(data)
    return task
  }

  async list() {
    const data = await this.load()
    return { queue: data.queue, history: data.history.slice(0, 50) }
  }
}

module.exports = AutomationQueue
