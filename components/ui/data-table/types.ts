/**
 * Data Table Types
 *
 * All types for the data table component.
 * No `any`, `undefined`, or `never` types.
 */

import type { ReactNode } from "react"

/**
 * Column definition
 */
export interface Column<T> {
  /** Unique key for the column */
  key: string
  /** Column header label */
  header: string | ReactNode
  /** Cell renderer function */
  cell: (item: T, index: number) => ReactNode
  /** Whether column is sortable */
  sortable?: boolean
  /** Column width */
  width?: string
  /** Whether column is sticky */
  sticky?: "left" | "right"
  /** CSS class name for cells */
  className?: string
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc" | null

/**
 * Sort state
 */
export interface SortState {
  /** Column key being sorted */
  key: string
  /** Sort direction */
  direction: SortDirection
}

/**
 * Filter state
 */
export interface FilterState {
  /** Column key to filter */
  key: string
  /** Filter value */
  value: string
}

/**
 * Selection state
 */
export interface SelectionState {
  /** Selected row IDs */
  selected: Set<string>
  /** Whether all rows are selected */
  allSelected: boolean
  /** Whether some rows are selected (indeterminate) */
  someSelected: boolean
}

/**
 * Pagination state
 */
export interface PaginationState {
  /** Current page (1-indexed) */
  page: number
  /** Items per page */
  pageSize: number
  /** Total items */
  total: number
}

/**
 * Bulk action
 */
export interface BulkAction {
  /** Action identifier */
  key: string
  /** Action label */
  label: string
  /** Action icon */
  icon?: React.ComponentType<{ className?: string }>
  /** Action handler */
  onClick: (selectedItems: unknown[]) => void
  /** Whether action is destructive */
  destructive?: boolean
  /** Disable action condition */
  disabled?: boolean | ((selectedCount: number) => boolean)
}

/**
 * Export format
 */
export type ExportFormat = "csv" | "json" | "xlsx"

/**
 * Export action
 */
export interface ExportAction {
  format: ExportFormat
  label: string
  filename: string
}

/**
 * Data table props
 */
export interface DataTableProps<T> {
  /** Unique identifier for each row */
  idKey: keyof T | ((item: T) => string)
  /** Column definitions */
  columns: Column<T>[]
  /** Data to display */
  data: T[]
  /** Current sort state */
  sort?: SortState
  /** Sort change handler */
  onSortChange?: (sort: SortState) => void
  /** Current filter state */
  filters?: FilterState[]
  /** Filter change handler */
  onFilterChange?: (filters: FilterState[]) => void
  /** Enable row selection */
  selectable?: boolean
  /** Current selection state */
  selection?: SelectionState
  /** Selection change handler */
  onSelectionChange?: (selection: SelectionState) => void
  /** Pagination state */
  pagination?: PaginationState
  /** Pagination change handler */
  onPaginationChange?: (pagination: PaginationState) => void
  /** Bulk actions */
  bulkActions?: BulkAction[]
  /** Export actions */
  exportActions?: ExportAction[]
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** CSS class name */
  className?: string
  /** Table container height */
  height?: string
  /** Enable virtual scrolling for large datasets */
  virtual?: boolean
}
