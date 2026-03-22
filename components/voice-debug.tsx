"use client"
import { useSheetContext } from "@/context/SheetContext"
import { useState } from "react"

export function VoiceDebug() {
  const { voiceState } = useSheetContext()
  const [logs, setLogs] = useState<string[]>([])
  const [show, setShow] = useState(false)

  // Intercept console.log
  if (typeof window !== "undefined") {
    const orig = console.log.bind(console)
    console.log = (...args: unknown[]) => {
      orig(...args)
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
      if (msg.includes("[Voice]")) {
        setLogs((prev) => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${msg}`])
      }
    }
    const origErr = console.error.bind(console)
    console.error = (...args: unknown[]) => {
      origErr(...args)
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
      setLogs((prev) => [...prev.slice(-20), `ERR ${new Date().toLocaleTimeString()}: ${msg}`])
    }
    const origWarn = console.warn.bind(console)
    console.warn = (...args: unknown[]) => {
      origWarn(...args)
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
      if (msg.includes("[Voice]")) {
        setLogs((prev) => [...prev.slice(-20), `WARN ${new Date().toLocaleTimeString()}: ${msg}`])
      }
    }
  }

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        style={{
          position: "fixed",
          bottom: 120,
          right: 8,
          zIndex: 9999,
          background: "rgba(0,0,0,0.8)",
          color: "#0f0",
          border: "1px solid #0f0",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 10,
          fontFamily: "monospace",
        }}
      >
        DEBUG
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: 10,
        padding: 8,
        maxHeight: "40vh",
        overflow: "auto",
        borderTop: "1px solid #0f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#ff0" }}>
          phase:{voiceState.phase} active:{String(voiceState.isActive)}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setLogs([])}
            style={{
              color: "#f00",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 10,
            }}
          >
            CLR
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            style={{
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 10,
            }}
          >
            HIDE
          </button>
        </div>
      </div>
      {logs.length === 0 && (
        <div style={{ color: "#666" }}>No voice logs yet. Tap mic to start.</div>
      )}
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            color: log.startsWith("ERR") ? "#f44" : log.startsWith("WARN") ? "#fa0" : "#0f0",
            marginBottom: 2,
            wordBreak: "break-all",
          }}
        >
          {log}
        </div>
      ))}
    </div>
  )
}
