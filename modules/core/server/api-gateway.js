const http = require("node:http")
const https = require("node:https")
const { exec, execFile } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")
const os = require("node:os")
const crypto = require("node:crypto")

// ─── Config ──────────────────────────────────────────────────────────────────

const PORT = process.env.XMAD_GATEWAY_PORT || 9870
const OPENCLAW_URL = process.env.OPENCLAW_URL || "http://localhost:18789"
const LEGACY_URL = process.env.XMAD_LEGACY_URL || "http://localhost:8765"
const LOG_DIR = process.env.XMAD_LOG_DIR || `${os.homedir()}/xmad-control/storage/logs`
const BACKUP_DIR = process.env.XMAD_BACKUP_DIR || `${os.homedir()}/xmad-control/storage/backups`
const QUEUE_FILE =
  process.env.XMAD_QUEUE_FILE || `${os.homedir()}/xmad-control/storage/automation/queue.json`

// Auth token — loaded from environment (injected by load-secrets.sh from Keychain)
// If not set in prod, gateway is localhost-only and still protected by Tailscale middleware
const GATEWAY_TOKEN = process.env.XMAD_GATEWAY_TOKEN || ""
const REQUIRE_AUTH = GATEWAY_TOKEN.length > 0

// Allowed origins — only Tailscale + localhost
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://100.121.254.21:3000",
  "http://localhost:8765",
]

// ─── Logging ─────────────────────────────────────────────────────────────────

fs.mkdirSync(LOG_DIR, { recursive: true })
const logStream = fs.createWriteStream(path.join(LOG_DIR, "xmad-gateway.log"), { flags: "a" })

function log(level, msg) {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}`
  logStream.write(`${line}\n`)
  if (process.env.NODE_ENV !== "production") process.stdout.write(`${line}\n`)
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

const rateLimits = new Map() // ip → { count, resetAt }

function checkRateLimit(ip, limit = 60, windowMs = 60_000) {
  const now = Date.now()
  const data = rateLimits.get(ip)

  if (!data || now > data.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (data.count >= limit) return false
  data.count++
  return true
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimits) {
    if (now > data.resetAt) rateLimits.delete(ip)
  }
}, 300_000)

// ─── Input validation ─────────────────────────────────────────────────────────

function validateTaskText(text) {
  if (!text || typeof text !== "string")
    return { ok: false, reason: "Task must be a non-empty string" }
  if (text.length > 2000) return { ok: false, reason: "Task too long (max 2000 chars)" }
  // Block shell injection sequences
  const forbidden = [";", "&&", "||", "`", "$(", "<(", "|(", "\x00"]
  for (const f of forbidden) {
    if (text.includes(f)) return { ok: false, reason: `Forbidden sequence: ${f}` }
  }
  return { ok: true }
}

function validateBackupNote(note) {
  if (!note) return ""
  return String(note)
    .replace(/[^a-zA-Z0-9 _\-.,]/g, "")
    .slice(0, 100)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ""
    req.on("data", (chunk) => {
      data += chunk
      if (data.length > 50_000) {
        reject(new Error("Body too large"))
        req.destroy()
      }
    })
    req.on("end", () => resolve(data))
    req.on("error", reject)
  })
}

function parseBody(req) {
  return readBody(req).then((raw) => {
    if (!raw.trim()) return {}
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  })
}

function send(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  })
  res.end(body)
}

function sendError(res, status, message) {
  send(res, status, { ok: false, error: message })
}

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const timeout = opts.timeout || 30_000
    const _proc = execFile(
      cmd,
      args,
      { timeout, env: { ...process.env, PATH: "/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin" } },
      (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message))
        else resolve(stdout.trim())
      }
    )
  })
}

// Proxy a request to another local service
function proxyTo(targetUrl, req, res) {
  return new Promise((resolve) => {
    const url = new URL(targetUrl)
    const opts = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: req.method,
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    }

    const mod = url.protocol === "https:" ? https : http
    const proxy = mod.request(opts, (pRes) => {
      let body = ""
      pRes.on("data", (c) => {
        body += c
      })
      pRes.on("end", () => {
        try {
          const parsed = JSON.parse(body)
          send(res, pRes.statusCode || 200, parsed)
        } catch {
          res.writeHead(pRes.statusCode || 200, { "Content-Type": "text/plain" })
          res.end(body)
        }
        resolve()
      })
    })

    proxy.on("error", () => resolve(null)) // caller handles null
    proxy.setTimeout(8000, () => {
      proxy.destroy()
      resolve(null)
    })

    if (req.method !== "GET" && req.method !== "HEAD") {
      readBody(req)
        .then((b) => {
          proxy.write(b)
          proxy.end()
        })
        .catch(() => proxy.end())
    } else {
      proxy.end()
    }
  })
}

// ─── System stats ─────────────────────────────────────────────────────────────

async function getSystemStats() {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const loadAvg = os.loadavg()
  const uptimeSec = os.uptime()

  // CPU percent via top (macOS)
  let cpuPercent = 0
  try {
    const out = await runCmd("/usr/bin/top", ["-l", "2", "-n", "0", "-s", "1"], { timeout: 5000 })
    const match = out.match(/CPU usage:\s+([\d.]+)%\s+user,\s+([\d.]+)%\s+sys/)
    if (match) cpuPercent = Math.round(Number.parseFloat(match[1]) + Number.parseFloat(match[2]))
  } catch {
    /* use 0 */
  }

  // Disk usage
  let diskUsedGB = 0
  let diskTotalGB = 0
  try {
    const out = await runCmd("/bin/df", ["-k", "/"], { timeout: 5000 })
    const lines = out.split("\n")
    if (lines[1]) {
      const parts = lines[1].trim().split(/\s+/)
      diskTotalGB = Math.round((Number.parseInt(parts[1], 10) * 1024) / 1e9)
      diskUsedGB = Math.round((Number.parseInt(parts[2], 10) * 1024) / 1e9)
    }
  } catch {
    /* ignore */
  }

  return {
    cpu: cpuPercent,
    cpuPercent,
    memUsed: Math.round(usedMem / 1048576),
    memUsedMB: Math.round(usedMem / 1048576),
    memFree: Math.round(freeMem / 1048576),
    memFreeMB: Math.round(freeMem / 1048576),
    memTotal: Math.round(totalMem / 1048576),
    memTotalMB: Math.round(totalMem / 1048576),
    diskUsedGB,
    diskTotalGB,
    uptimeSec: Math.round(uptimeSec),
    loadAvg,
    timestamp: new Date().toISOString(),
    uptime: formatUptime(uptimeSec),
  }
}

function formatUptime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`
  return `${h}h ${m}m`
}

// ─── Tailscale ────────────────────────────────────────────────────────────────

async function getTailscaleStatus() {
  try {
    const out = await runCmd("/usr/local/bin/tailscale", ["status", "--json"], { timeout: 8000 })
    const data = JSON.parse(out)
    const self = data.Self || {}
    const peers = Object.values(data.Peer || {}).map((p) => ({
      hostname: p.HostName || p.DNSName?.split(".")[0] || "unknown",
      ip: (p.TailscaleIPs || [])[0] || "",
      online: p.Online ?? false,
      os: p.OS || "",
    }))

    return {
      online: true,
      self: {
        hostname: self.HostName || self.DNSName?.split(".")[0] || "mac-mini-1",
        ip: (self.TailscaleIPs || [])[0] || "100.121.254.21",
        online: true,
      },
      peers,
    }
  } catch {
    return {
      online: false,
      self: { hostname: "mac-mini-1", ip: "100.121.254.21", online: false },
      peers: [],
    }
  }
}

// ─── OpenClaw proxy ───────────────────────────────────────────────────────────

async function getOpenClawStatus() {
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.get(`${OPENCLAW_URL}/health`, { timeout: 5000 }, (r) => {
        let b = ""
        r.on("data", (c) => {
          b += c
        })
        r.on("end", () => resolve({ status: r.statusCode, body: b }))
      })
      req.on("error", reject)
      req.setTimeout(5000, () => {
        req.destroy()
        reject(new Error("timeout"))
      })
    })

    const data = JSON.parse(res.body)
    return { online: data.ok === true, status: data.status || "live", port: 18789 }
  } catch {
    return { online: false, status: "offline", port: 18789 }
  }
}

// ─── Automation queue ─────────────────────────────────────────────────────────

function readQueue() {
  try {
    fs.mkdirSync(path.dirname(QUEUE_FILE), { recursive: true })
    if (!fs.existsSync(QUEUE_FILE)) {
      const empty = { version: 1, queue: [], completed: [] }
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(empty, null, 2))
      return empty
    }
    return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"))
  } catch {
    return { version: 1, queue: [], completed: [] }
  }
}

// Atomic write: write to temp then rename to prevent corruption
function writeQueue(data) {
  const tmp = `${QUEUE_FILE}.tmp.${Date.now()}`
  fs.mkdirSync(path.dirname(QUEUE_FILE), { recursive: true })
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, QUEUE_FILE)
}

// ─── Backups ──────────────────────────────────────────────────────────────────

async function createBackup(note) {
  const date = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const dest = path.join(BACKUP_DIR, `openclaw-${date}`)
  const home = os.homedir()

  fs.mkdirSync(dest, { recursive: true })

  const sources = [`${home}/.openclaw/openclaw.json`, `${home}/.openclaw/auth-profiles.json`]

  const dirs = [`${home}/.openclaw/workspace`, `${home}/.openclaw/memory`]

  // Copy files
  for (const src of sources) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(dest, path.basename(src)))
    }
  }

  // Copy directories
  for (const src of dirs) {
    if (fs.existsSync(src)) {
      await runCmd("/bin/cp", ["-r", src, dest], { timeout: 30000 })
    }
  }

  // Write metadata
  const _stat = fs.statSync(dest)
  const meta = {
    id: `backup-${date}`,
    name: `OpenClaw ${date}`,
    created: new Date().toISOString(),
    note: note || "Manual backup",
    includes: ["openclaw.json", "auth-profiles.json", "workspace", "memory"],
  }
  fs.writeFileSync(path.join(dest, "meta.json"), JSON.stringify(meta, null, 2))

  // Get size
  let sizeMB = 0
  try {
    const out = await runCmd("/usr/bin/du", ["-sm", dest], { timeout: 10000 })
    sizeMB = Number.parseInt(out.split("\t")[0], 10) || 0
  } catch {
    /* ignore */
  }

  meta.sizeMB = sizeMB

  // Rotate: keep last 7
  try {
    const entries = fs
      .readdirSync(BACKUP_DIR)
      .filter((e) => e.startsWith("openclaw-"))
      .map((e) => ({ name: e, time: fs.statSync(path.join(BACKUP_DIR, e)).mtimeMs }))
      .sort((a, b) => b.time - a.time)

    for (const old of entries.slice(7)) {
      await runCmd("/bin/rm", ["-rf", path.join(BACKUP_DIR, old.name)], { timeout: 15000 })
    }
  } catch {
    /* ignore */
  }

  log("INFO", `Backup created: ${dest} (${sizeMB}MB)`)
  return meta
}

function listBackups() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const entries = fs
    .readdirSync(BACKUP_DIR)
    .filter((e) => e.startsWith("openclaw-"))
    .sort()
    .reverse()

  return entries.map((name) => {
    const metaPath = path.join(BACKUP_DIR, name, "meta.json")
    if (fs.existsSync(metaPath)) {
      try {
        return JSON.parse(fs.readFileSync(metaPath, "utf8"))
      } catch {
        /* fall through */
      }
    }
    const stat = fs.statSync(path.join(BACKUP_DIR, name))
    return {
      id: name,
      name,
      created: stat.mtime.toISOString(),
      sizeMB: 0,
      includes: [],
    }
  })
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

function readLogFile(source, lines = 200) {
  const logPaths = {
    openclaw: `${os.homedir()}/.openclaw/logs/gateway.log`,
    watchdog: `${os.homedir()}/xmad/storage/logs/watchdog.log`,
    xmad: `${os.homedir()}/xmad/storage/logs/xmad-gateway.log`,
    guardian: `${os.homedir()}/.guardian-orchestrator-2026/logs/guardian.log`,
  }

  const logPath = logPaths[source]
  if (!logPath || !fs.existsSync(logPath)) return []

  const content = fs.readFileSync(logPath, "utf8")
  return content.split("\n").filter(Boolean).slice(-lines)
}

// ─── VNC ──────────────────────────────────────────────────────────────────────

let vncProcess = null

async function startVNC() {
  if (vncProcess) return { ok: true, message: "Already running" }

  // Check if websockify is available
  const websockify = "/Library/Frameworks/Python.framework/Versions/3.10/bin/websockify"
  const novncWeb = "/Users/ahmadabdullah/Applications/novnc"

  if (!fs.existsSync(websockify)) {
    return { ok: false, error: "websockify not installed. Install: pip3 install websockify" }
  }

  if (!fs.existsSync(novncWeb)) {
    return { ok: false, error: `noVNC not installed at ${novncWeb}` }
  }

  vncProcess = require("node:child_process").spawn(
    websockify,
    ["--web", novncWeb, "6080", "localhost:5900"],
    { detached: false, stdio: "ignore" }
  )

  vncProcess.on("exit", () => {
    vncProcess = null
  })
  log("INFO", "VNC websockify started on port 6080")
  return { ok: true, port: 6080 }
}

async function stopVNC() {
  if (!vncProcess) return { ok: true, message: "Not running" }
  vncProcess.kill("SIGTERM")
  vncProcess = null
  log("INFO", "VNC websockify stopped")
  return { ok: true }
}

// ─── Notes (AppleScript) ──────────────────────────────────────────────────────

async function listAppleNotes() {
  try {
    const out = await runCmd(
      "/usr/bin/osascript",
      ["-e", 'tell application "Notes" to get {name, modification date} of every note'],
      { timeout: 10000 }
    )
    // Parse AppleScript output: name1, date1, name2, date2, ...
    const parts = out.split(", ")
    const notes = []
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i]) notes.push({ name: parts[i].trim(), modified: parts[i + 1]?.trim() })
    }
    return notes
  } catch {
    return []
  }
}

async function createAppleNote(name, body) {
  const safeName = name.replace(/"/g, "'")
  const safeBody = (body || name).replace(/"/g, "'")
  await runCmd(
    "/usr/bin/osascript",
    [
      "-e",
      `tell application "Notes" to make new note at folder "Notes" with properties {name:"${safeName}", body:"${safeBody}"}`,
    ],
    { timeout: 10000 }
  )
  return { ok: true }
}

// ─── CORS helper ──────────────────────────────────────────────────────────────

function setCORSHeaders(req, res) {
  const origin = req.headers.origin || ""
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Vary", "Origin")
  } else if (!origin) {
    // Direct curl / server-side call — no CORS header needed
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token")
}

// ─── Auth middleware ──────────────────────────────────────────────────────────

function checkAuth(req) {
  if (!REQUIRE_AUTH) return true
  const token = req.headers["x-auth-token"] || ""
  return crypto.timingSafeEqual(
    Buffer.from(token.padEnd(64)),
    Buffer.from(GATEWAY_TOKEN.padEnd(64))
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const method = req.method.toUpperCase()
  const pth = url.pathname

  // IP for rate limiting
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown"

  // CORS
  setCORSHeaders(req, res)

  // Preflight
  if (method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  log("INFO", `${method} ${pth} from ${ip}`)

  // Rate limit (skip health check)
  if (pth !== "/health" && !checkRateLimit(ip)) {
    sendError(res, 429, "Rate limit exceeded — try again in 60 seconds")
    return
  }

  // Auth (skip health)
  if (pth !== "/health" && !checkAuth(req)) {
    sendError(res, 401, "Unauthorized")
    return
  }

  // ── Routes ──────────────────────────────────────────────────────────────────

  // Health
  if (pth === "/health" && method === "GET") {
    send(res, 200, { ok: true, status: "live", port: PORT, ts: new Date().toISOString() })
    return
  }

  // System stats
  if (pth === "/api/system/stats" && method === "GET") {
    const stats = await getSystemStats()
    send(res, 200, stats)
    return
  }

  // Tailscale
  if (pth === "/api/system/tailscale" && method === "GET") {
    const status = await getTailscaleStatus()
    send(res, 200, status)
    return
  }

  // Services
  if (pth === "/api/services" && method === "GET") {
    const [ocStatus, tsStatus, stats] = await Promise.all([
      getOpenClawStatus(),
      getTailscaleStatus(),
      getSystemStats(),
    ])
    send(res, 200, {
      openclaw: { ...ocStatus, memory: stats.memUsedMB },
      tailscale: { online: tsStatus.online, ip: tsStatus.self.ip },
      ssh: { online: true }, // SSH is always on unless explicitly stopped
      stats,
    })
    return
  }

  // OpenClaw status
  if (pth === "/api/openclaw/status" && method === "GET") {
    const status = await getOpenClawStatus()
    send(res, 200, status)
    return
  }

  // OpenClaw start
  if (pth === "/api/openclaw/start" && method === "POST") {
    try {
      await runCmd(
        "/bin/launchctl",
        ["load", "-w", `${os.homedir()}/Library/LaunchAgents/com.openclaw.agent.plist`],
        { timeout: 10000 }
      )
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  // OpenClaw restart
  if (pth === "/api/openclaw/restart" && method === "POST") {
    try {
      const plist = `${os.homedir()}/Library/LaunchAgents/com.openclaw.agent.plist`
      const uid = process.getuid?.() || ""
      await runCmd("/bin/launchctl", ["bootout", `gui/${uid}/com.openclaw.agent`], {
        timeout: 10000,
      }).catch(() => {})
      await new Promise((r) => setTimeout(r, 2000))
      await runCmd("/bin/launchctl", ["load", "-w", plist], { timeout: 10000 })
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  // OpenClaw message proxy
  if (pth === "/api/openclaw/message" && method === "POST") {
    const body = await parseBody(req)
    if (!body.message || typeof body.message !== "string" || body.message.length > 4000) {
      sendError(res, 400, "Invalid message")
      return
    }
    try {
      const result = await fetch(`${OPENCLAW_URL}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body.message }),
      })
      const data = await result.json()
      send(res, 200, data)
    } catch {
      // Try legacy
      try {
        const result = await fetch(`${LEGACY_URL}/api/openclaw/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: body.message }),
        })
        const data = await result.json()
        send(res, 200, data)
      } catch (_e) {
        sendError(res, 503, "OpenClaw unavailable")
      }
    }
    return
  }

  // OpenClaw logs
  if (pth.startsWith("/api/logs/") && method === "GET") {
    const source = pth.replace("/api/logs/", "")
    const lines = Number.parseInt(url.searchParams.get("lines") || "200", 10)
    const data = readLogFile(source, Math.min(lines, 500))
    send(res, 200, { lines: data, source })
    return
  }

  // SSH
  if (pth === "/api/ssh/start" && method === "POST") {
    try {
      await runCmd(
        "/usr/bin/sudo",
        ["/bin/launchctl", "load", "-w", "/System/Library/LaunchDaemons/ssh.plist"],
        { timeout: 10000 }
      )
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  if (pth === "/api/ssh/stop" && method === "POST") {
    try {
      await runCmd(
        "/usr/bin/sudo",
        ["/bin/launchctl", "unload", "/System/Library/LaunchDaemons/ssh.plist"],
        { timeout: 10000 }
      )
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  if (pth === "/api/ssh/status" && method === "GET") {
    try {
      const out = await runCmd("/bin/launchctl", ["list", "com.openssh.sshd"], { timeout: 5000 })
      send(res, 200, { online: true, detail: out.split("\n")[0] })
    } catch {
      send(res, 200, { online: false })
    }
    return
  }

  // VNC
  if (pth === "/api/vnc/start" && method === "POST") {
    const result = await startVNC()
    send(res, result.ok ? 200 : 500, result)
    return
  }

  if (pth === "/api/vnc/stop" && method === "POST") {
    const result = await stopVNC()
    send(res, 200, result)
    return
  }

  // Backups
  if (pth === "/api/backups/list" && method === "GET") {
    const backups = listBackups()
    send(res, 200, { backups })
    return
  }

  if (pth === "/api/backups/create" && method === "POST") {
    const body = await parseBody(req)
    const note = validateBackupNote(body.note)
    try {
      const meta = await createBackup(note)
      send(res, 200, { ok: true, backup: meta })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  if (pth.startsWith("/api/backups/restore/") && method === "POST") {
    const id = decodeURIComponent(pth.replace("/api/backups/restore/", ""))
    const src = path.join(BACKUP_DIR, id)
    const home = os.homedir()
    if (!fs.existsSync(src)) {
      sendError(res, 404, "Backup not found")
      return
    }
    try {
      const oc = `${home}/.openclaw`
      if (fs.existsSync(`${src}/openclaw.json`))
        fs.copyFileSync(`${src}/openclaw.json`, `${oc}/openclaw.json`)
      if (fs.existsSync(`${src}/auth-profiles.json`))
        fs.copyFileSync(`${src}/auth-profiles.json`, `${oc}/auth-profiles.json`)
      if (fs.existsSync(`${src}/workspace`))
        await runCmd("/bin/cp", ["-r", `${src}/workspace`, oc], { timeout: 30000 })
      if (fs.existsSync(`${src}/memory`))
        await runCmd("/bin/cp", ["-r", `${src}/memory`, oc], { timeout: 30000 })
      log("INFO", `Restore complete from: ${src}`)
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  if (pth.startsWith("/api/backups/delete/") && method === "DELETE") {
    const id = decodeURIComponent(pth.replace("/api/backups/delete/", ""))
    const dir = path.join(BACKUP_DIR, id)
    if (!dir.startsWith(BACKUP_DIR)) {
      sendError(res, 400, "Invalid path")
      return
    }
    if (!fs.existsSync(dir)) {
      sendError(res, 404, "Backup not found")
      return
    }
    try {
      await runCmd("/bin/rm", ["-rf", dir], { timeout: 15000 })
      send(res, 200, { ok: true })
    } catch (e) {
      sendError(res, 500, e.message)
    }
    return
  }

  // File read
  if (pth === "/api/file/read" && method === "GET") {
    const ALLOWED = [
      `${os.homedir()}/.openclaw/workspace/SOUL.md`,
      `${os.homedir()}/.openclaw/workspace/MEMORY.md`,
      `${os.homedir()}/.openclaw/workspace/IDENTITY.md`,
      `${os.homedir()}/.openclaw/memory/nova-identity.md`,
    ]
    const reqPath = decodeURIComponent(url.searchParams.get("path") || "")
    const norm = path.normalize(reqPath)
    if (!ALLOWED.includes(norm)) {
      sendError(res, 403, "Path not in allowlist")
      return
    }
    if (!fs.existsSync(norm)) {
      sendError(res, 404, "File not found")
      return
    }
    const content = fs.readFileSync(norm, "utf8")
    const stat = fs.statSync(norm)
    send(res, 200, { content, size: stat.size, modified: stat.mtime.toISOString() })
    return
  }

  // File write
  if (pth === "/api/file/write" && method === "POST") {
    const ALLOWED = [
      `${os.homedir()}/.openclaw/workspace/SOUL.md`,
      `${os.homedir()}/.openclaw/workspace/MEMORY.md`,
      `${os.homedir()}/.openclaw/workspace/IDENTITY.md`,
      `${os.homedir()}/.openclaw/memory/nova-identity.md`,
    ]
    const body = await parseBody(req)
    const norm = path.normalize(body.path || "")
    const content = body.content
    if (!ALLOWED.includes(norm)) {
      sendError(res, 403, "Path not in allowlist")
      return
    }
    if (typeof content !== "string" || content.length > 200_000) {
      sendError(res, 400, "Invalid content")
      return
    }
    // Backup before write
    if (fs.existsSync(norm)) {
      fs.copyFileSync(norm, `${norm}.bak.${Date.now()}`)
    }
    fs.writeFileSync(norm, content, "utf8")
    send(res, 200, { ok: true })
    return
  }

  // Automation list
  if (pth === "/api/automation/list" && method === "GET") {
    const data = readQueue()
    const all = [...(data.queue || []), ...(data.completed || [])].sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    send(res, 200, { jobs: all })
    return
  }

  // Automation add
  if (pth === "/api/automation/add" && method === "POST") {
    const body = await parseBody(req)
    const v = validateTaskText(body.task)
    if (!v.ok) {
      sendError(res, 400, v.reason)
      return
    }
    const data = readQueue()
    const job = {
      id: `job-${Date.now()}`,
      task: body.task.trim(),
      status: "queued",
      priority: ["low", "normal", "high", "critical"].includes(body.priority)
        ? body.priority
        : "normal",
      created: new Date().toISOString(),
    }
    data.queue = data.queue || []
    data.queue.push(job)
    writeQueue(data)
    send(res, 200, { ok: true, id: job.id })
    return
  }

  // Automation delete
  if (pth.startsWith("/api/automation/delete/") && method === "DELETE") {
    const id = decodeURIComponent(pth.replace("/api/automation/delete/", ""))
    const data = readQueue()
    data.queue = (data.queue || []).filter((j) => j.id !== id)
    data.completed = (data.completed || []).filter((j) => j.id !== id)
    writeQueue(data)
    send(res, 200, { ok: true })
    return
  }

  // Automation run
  if (pth.startsWith("/api/automation/run/") && method === "POST") {
    const id = decodeURIComponent(pth.replace("/api/automation/run/", ""))
    const data = readQueue()
    const job = (data.queue || []).find((j) => j.id === id)
    if (!job) {
      sendError(res, 404, "Job not found")
      return
    }
    // Mark as running
    job.status = "running"
    job.started = new Date().toISOString()
    writeQueue(data)
    // For now, just return success - actual execution would be handled by a worker
    send(res, 200, { ok: true, job })
    return
  }

  // 404
  sendError(res, 404, "Not found")
})

server.listen(PORT, "127.0.0.1", () => {
  log("INFO", `XMAD Core Gateway running on http://127.0.0.1:${PORT}`)
  console.log(`XMAD Core Gateway running on http://127.0.0.1:${PORT}`)
})
