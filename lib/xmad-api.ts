/**
 * XMAD API Client
 * Integration layer for XMAD Control Center
 *
 * Architecture:
 * Next.js Dashboard (port 3000) → API Gateway (port 9870) → XMAD core modules
 *
 * Security: All secrets loaded via SSOT (Keychain → Infisical → environment)
 */

const API_BASE_URL = process.env.XMAD_API_URL || "http://localhost:9870"

// Types
export interface SystemStats {
  cpu: number
  memory: { used: number; total: number; percentage: number }
  disk: { used: number; total: number; percentage: number }
  uptime: number
}

export interface OpenClawStatus {
  running: boolean
  pid: number | null
  uptime: number | null
  memoryUsage: number | null
}

export interface TailscaleStatus {
  connected: boolean
  ip: string | null
  hostname: string | null
  peers: number
}

export interface BackupInfo {
  name: string
  size: number
  createdAt: string
  type: "full" | "incremental"
}

export interface AutomationTask {
  id: string
  type: string
  status: "pending" | "running" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  result?: unknown
  error?: string
}

export interface MemoryFile {
  name: string
  path: string
  size: number
  modifiedAt: string
  content?: string
}

// API Client
class XMADApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`XMAD API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // System Stats
  async getSystemStats(): Promise<SystemStats> {
    return this.fetch<SystemStats>("/api/system/stats")
  }

  // SSH Control
  async startSSH(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/ssh/start", { method: "POST" })
  }

  async stopSSH(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/ssh/stop", { method: "POST" })
  }

  // VNC Control
  async startVNC(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/vnc/start", { method: "POST" })
  }

  async stopVNC(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/vnc/stop", { method: "POST" })
  }

  // OpenClaw Status
  async getOpenClawStatus(): Promise<OpenClawStatus> {
    return this.fetch<OpenClawStatus>("/api/openclaw/status")
  }

  // Tailscale Status
  async getTailscaleStatus(): Promise<TailscaleStatus> {
    return this.fetch<TailscaleStatus>("/api/system/tailscale")
  }

  // Backups
  async listBackups(): Promise<BackupInfo[]> {
    return this.fetch<BackupInfo[]>("/api/backups/list")
  }

  async createBackup(name: string): Promise<{ success: boolean; path: string }> {
    return this.fetch("/api/backups/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  async restoreBackup(name: string): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/backups/restore", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  // Automation
  async listAutomationTasks(): Promise<{ queue: AutomationTask[]; history: AutomationTask[] }> {
    return this.fetch("/api/automation/list")
  }

  async runAutomation(task: { type: string; payload?: unknown }): Promise<{ id: string }> {
    return this.fetch("/api/automation/run", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  // Memory Editor
  async listMemoryFiles(): Promise<MemoryFile[]> {
    return this.fetch<MemoryFile[]>("/api/memory/list")
  }

  async readMemoryFile(filename: string): Promise<MemoryFile> {
    // Security: Validate filename to prevent path traversal
    const safeName = this.sanitizeFilename(filename)
    return this.fetch<MemoryFile>(`/api/memory/read?file=${encodeURIComponent(safeName)}`)
  }

  async writeMemoryFile(filename: string, content: string): Promise<{ success: boolean }> {
    // Security: Validate filename to prevent path traversal
    const safeName = this.sanitizeFilename(filename)
    return this.fetch("/api/memory/write", {
      method: "POST",
      body: JSON.stringify({ filename: safeName, content }),
    })
  }

  // Security: Prevent path traversal attacks
  private sanitizeFilename(filename: string): string {
    // Remove any path components
    const basename = filename.split("/").pop()?.split("\\").pop() || ""

    // Only allow alphanumeric, dash, underscore, and dot
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, "")

    if (sanitized !== basename || sanitized.length === 0) {
      throw new Error("Invalid filename: path traversal detected")
    }

    return sanitized
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; uptime: number }> {
    return this.fetch("/health")
  }
}

// Export singleton instance
export const xmadApi = new XMADApiClient()

// Export class for testing
export { XMADApiClient }
