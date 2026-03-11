/**
 * useExport Hook - Export table data to CSV or JSON
 *
 * Export functionality for data tables.
 * Uses design tokens exclusively.
 */

"use client"

import { useCallback } from "react"
import type { Column, ExportFormat } from "./types"

export interface UseExportOptions<T> {
  /** Data to export */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Export filename */
  filename?: string
}

export interface UseExportReturn {
  /** Export data to specified format */
  export: (format: ExportFormat) => void
  /** Export to CSV */
  exportToCSV: () => void
  /** Export to JSON */
  exportToJSON: () => void
}

/**
 * Convert data to CSV string
 */
function convertToCSV<T>(data: T[], columns: Column<T>[]): string {
  // Extract headers
  const headers = columns.map((col) => {
    if (typeof col.header === "string") {
      return col.header
    }
    return col.key
  })

  // Extract values
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = col.cell(item, 0)
      // Handle different value types
      if (typeof value === "string") {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`
      }
      if (value === null || value === undefined) {
        return '""'
      }
      // Convert to string and escape
      return `"${String(value).replace(/"/g, '""')}"`
    })
  )

  // Combine headers and rows
  return [headers, ...rows].map((row) => row.join(",")).join("\n")
}

/**
 * Trigger file download
 */
function triggerDownload(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export Hook
 *
 * @example
 * const { exportToCSV, exportToJSON } = useExport({ data, columns, filename: "export" })
 */
export function useExport<T extends Record<string, unknown>>({
  data,
  columns,
  filename = "export",
}: UseExportOptions<T>): UseExportReturn {
  const exportToCSV = useCallback(() => {
    const csv = convertToCSV(data, columns)
    const timestamp = new Date().toISOString().split("T")[0]
    triggerDownload(csv, `${filename}_${timestamp}.csv`, "text/csv;charset=utf-8;")
  }, [data, columns, filename])

  const exportToJSON = useCallback(() => {
    // Extract relevant data for export
    const exportData = data.map((item) => {
      const obj: Record<string, unknown> = {}
      columns.forEach((col) => {
        const value = col.cell(item, 0)
        // Get header string as key
        const key = typeof col.header === "string" ? col.header : col.key
        obj[key] = value
      })
      return obj
    })

    const json = JSON.stringify(exportData, null, 2)
    const timestamp = new Date().toISOString().split("T")[0]
    triggerDownload(json, `${filename}_${timestamp}.json`, "application/json;charset=utf-8;")
  }, [data, columns, filename])

  const export = useCallback(
    (format: ExportFormat) => {
      if (format === "csv") {
        exportToCSV()
      } else if (format === "json") {
        exportToJSON()
      }
    },
    [exportToCSV, exportToJSON]
  )

  return {
    export,
    exportToCSV,
    exportToJSON,
  }
}
