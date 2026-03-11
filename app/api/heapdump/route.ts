import fs from "node:fs"
import path from "node:path"
import v8 from "node:v8"

export async function GET(req: Request) {
  try {
    // Simple authorization check - only allow localhost
    const url = new URL(req.url)
    const host = req.headers.get("host") || ""

    // Check if request is from localhost
    const isLocalhost =
      host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]")

    if (!isLocalhost) {
      return new Response(`Access denied. Host: ${host}`, { status: 403 })
    }

    // Download existing heapdump
    if (url.searchParams.has("filename")) {
      const filename = url.searchParams.get("filename")
      if (!filename) {
        return new Response("Invalid filename", { status: 400 })
      }

      const filePath = path.join(process.cwd(), filename)
      const file = fs.readFileSync(filePath)

      return new Response(file, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }

    // Generate new heapdump
    const filename = v8.writeHeapSnapshot()

    return new Response(
      `<h1>Heapdump generated: ${filename}</h1><p><a href="/api/heapdump?filename=${filename}">Download</a></p>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    )
  } catch (error) {
    console.error("Heapdump error:", error)
    return new Response("An error occurred generating heapdump.", { status: 500 })
  }
}
