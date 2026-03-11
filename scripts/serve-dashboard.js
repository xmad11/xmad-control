#!/usr/bin/env node

/**
 * Simple HTTP server for Coordinator Dashboard
 * Serves the HTML dashboard and provides API endpoint for cloning
 */

const http = require("http")
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const PORT = 3579
const HTML_PATH = path.join(__dirname, "../dashboard/index.html")

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
}

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // API endpoint for cloning
  if (req.url === "/api/clone" && req.method === "POST") {
    let body = ""

    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      try {
        const { folderPath, projectName } = JSON.parse(body)

        if (!folderPath || !projectName) {
          res.writeHead(400, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Missing folderPath or projectName" }))
          return
        }

        console.log(`\n📋 Clone request:`)
        console.log(`   Folder: ${folderPath}`)
        console.log(`   Project: ${projectName}\n`)

        // Run the clone script
        try {
          const output = execSync(
            `node ${path.join(__dirname, "clone-coordinator.js")} "${folderPath}" "${projectName}"`,
            { encoding: "utf8", cwd: path.join(__dirname, "..") }
          )

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(
            JSON.stringify({
              success: true,
              message: `✅ Coordinator cloned successfully to ${path.join(folderPath, projectName)}`,
            })
          )
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(
            JSON.stringify({
              error: err.message || "Clone failed",
            })
          )
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Invalid JSON" }))
      }
    })
    return
  }

  // Serve the dashboard HTML
  if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(HTML_PATH, (err, content) => {
      if (err) {
        res.writeHead(404)
        res.end("File not found")
        return
      }
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(content)
    })
    return
  }

  // 404 for other routes
  res.writeHead(404)
  res.end("Not found")
})

server.listen(PORT, () => {
  console.log(`\n🚀 Coordinator Dashboard Server running at:`)
  console.log(`   http://localhost:${PORT}\n`)
  console.log(`💡 Press Ctrl+C to stop the server\n`)
})
