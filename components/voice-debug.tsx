"use client"
import { useSheetContext } from "@/context/SheetContext"
import { useEffect, useRef, useState } from "react"

export function VoiceDebug() {
  const { voiceState } = useSheetContext()
  const [logs, setLogs] = useState<string[]>([])
  const [show, setShow] = useState(false)
  const patchedRef = useRef(false)

  useEffect(() => {
    if (patchedRef.current) return
    patchedRef.current = true

    const origLog = console.log.bind(console)
    const origErr = console.error.bind(console)
    const origWarn = console.warn.bind(console)

    const addLog = (prefix: string, args: unknown[]) => {
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
      if (msg.includes("[Voice") || prefix === "ERR") {
        setLogs((prev) => [
          ...prev.slice(-30),
          `${prefix}${new Date().toLocaleTimeString()}: ${msg}`,
        ])
      }
    }

    console.log = (...args) => {
      origLog(...args)
      addLog("", args)
    }
    console.error = (...args) => {
      origErr(...args)
      addLog("ERR ", args)
    }
    console.warn = (...args) => {
      origWarn(...args)
      addLog("WRN ", args)
    }

    return () => {
      console.log = origLog
      console.error = origErr
      console.warn = origWarn
    }
  }, [])

  const phase = voiceState?.phase ?? "idle"
  const active = voiceState?.isActive ?? false

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        style={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 9999,
          background: "rgba(0,0,0,0.8)",
          color: "#0f0",
          border: "1px solid #0f0",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 10,
          fontFamily: "monospace",
          touchAction: "manipulation",
        }}
      >
        DBG
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: 10,
        padding: 8,
        maxHeight: "50vh",
        overflow: "auto",
        borderBottom: "1px solid #0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          position: "sticky",
          top: 0,
          background: "rgba(0,0,0,0.95)",
        }}
      >
        <span style={{ color: "#ff0" }}>
          phase:{phase} active:{String(active)}
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
              padding: "2px 6px",
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
              padding: "2px 6px",
            }}
          >
            HIDE
          </button>
        </div>
      </div>
      {logs.length === 0 && <div style={{ color: "#666" }}>Tap mic to see voice logs</div>}
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            color: log.startsWith("ERR") ? "#f44" : log.startsWith("WRN") ? "#fa0" : "#0f0",
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
