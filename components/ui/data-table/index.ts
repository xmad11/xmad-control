/**
 * Data Table Component - Index
 *
 * Centralized exports for the data table component.
 * All components use design tokens exclusively - NO hardcoded values.
 * Proper TypeScript - NO `any` types.
 */

// Main component
export { DataTable } from "./DataTable"

// Hooks
export { default as useExport } from "./useExport"
export type { UseExportOptions, UseExportReturn } from "./useExport"

// Example
export { DataTableExample } from "./example"

// Types
export type {
  Column,
  SortDirection,
  SortState,
  FilterState,
  SelectionState,
  PaginationState,
  BulkAction,
  ExportFormat,
  ExportAction,
  DataTableProps,
} from "./types"
