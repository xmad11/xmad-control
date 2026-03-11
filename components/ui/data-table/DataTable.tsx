/**
 * Data Table Component - Core with Sort, Filter, Pagination
 *
 * Comprehensive data table with all features.
 * Uses design tokens exclusively.
 */

"use client"

import {
  ArrowsUpDownIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"
import type {
  BulkAction,
  Column,
  FilterState,
  PaginationState,
  SelectionState,
  SortDirection,
  SortState,
} from "./types"

// ============================================================================
// TABLE HEADER CELL
// ============================================================================()

interface HeaderCellProps<T> {
  column: Column<T>
  sort?: SortState
  onSort?: (key: string) => void
}

function HeaderCell<T>({ column, sort, onSort }: HeaderCellProps<T>) {
  const isSorted = sort?.key === column.key
  const direction = sort?.direction ?? null

  const handleSort = () => {
    if (!column.sortable || !onSort) return
    onSort(column.key)
  }

  const getSortIcon = () => {
    if (!isSorted) {
      return (
        <ArrowsUpDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-30)]" />
      )
    }
    if (direction === "asc") {
      return (
        <ChevronUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-primary)]" />
      )
    }
    return (
      <ChevronDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--color-primary)]" />
    )
  }

  return (
    <th
      className={`px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)] border-b border-[var(--fg-10)] bg-[var(--bg-70)] ${column.className ?? ""} ${
        column.sticky === "left" ? "sticky left-0 z-10" : ""
      } ${column.sticky === "right" ? "sticky right-0 z-10" : ""} ${
        column.sortable ? "cursor-pointer hover:bg-[var(--bg-80)]" : ""
      }`}
      style={{ width: column.width }}
      // @design-exception DYNAMIC_VALUE: Column width is a runtime prop that cannot be expressed with static Tailwind classes
      onClick={handleSort}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleSort()
        }
      }}
      tabIndex={column.sortable ? 0 : undefined}
    >
      <div className="flex items-center gap-[var(--spacing-xs)]">
        <span>{column.header}</span>
        {column.sortable && getSortIcon()}
      </div>
    </th>
  )
}

// ============================================================================
// CHECKBOX CELL
// ============================================================================()

interface CheckboxCellProps {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
}

function CheckboxCell({ checked, indeterminate, onChange }: CheckboxCellProps) {
  return (
    <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--fg-10)]">
      <input
        type="checkbox"
        checked={checked}
        ref={(input) => {
          if (input && indeterminate) {
            input.indeterminate = true
          }
        }}
        onChange={onChange}
        className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] rounded border-[var(--fg-30)] text-[var(--color-primary)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
      />
    </td>
  )
}

// ============================================================================
// DATA TABLE CELL
// ============================================================================()

interface DataTableCellProps<_T> {
  children: ReactNode
  className?: string
  sticky?: "left" | "right"
}

function DataTableCell<T>({ children, className, sticky }: DataTableCellProps<T>) {
  return (
    <td
      className={`px-[var(--spacing-md)] py-[var(--spacing-md)] text-[var(--font-size-sm)] text-[var(--fg)] border-b border-[var(--fg-10)] ${className ?? ""} ${
        sticky === "left" ? "sticky left-0 bg-[var(--bg)]" : ""
      } ${sticky === "right" ? "sticky right-0 bg-[var(--bg)]" : ""}`}
    >
      {children}
    </td>
  )
}

// ============================================================================
// PAGINATION CONTROLS
// ============================================================================()

interface PaginationControlsProps {
  pagination: PaginationState
  onChange: (page: number) => void
}

function PaginationControls({ pagination, onChange }: PaginationControlsProps) {
  const { page, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)
  const canGoBack = page > 1
  const canGoForward = page < totalPages

  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] border-t border-[var(--fg-10)]">
      <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
        Showing {startItem} to {endItem} of {total} results
      </p>

      <div className="flex items-center gap-[var(--spacing-sm)]">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={!canGoBack}
          className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
        </button>

        <span className="text-[var(--font-size-sm)] text-[var(--fg)]">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={!canGoForward}
          className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)]" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// BULK ACTIONS BAR
// ============================================================================()

interface BulkActionsBarProps {
  selectedCount: number
  actions: BulkAction[]
  onClearSelection: () => void
}

function BulkActionsBar({ selectedCount, actions, onClearSelection }: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--fg-10)] bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)]">
      <div className="flex items-center gap-[var(--spacing-md)]">
        <span className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>

        <div className="flex items-center gap-[var(--spacing-sm)]">
          {actions.map((action) => {
            const isDisabled =
              typeof action.disabled === "function"
                ? action.disabled(selectedCount)
                : action.disabled

            return (
              <button
                key={action.key}
                type="button"
                onClick={() => action.onClick([])}
                disabled={isDisabled}
                className={`flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] ${
                  action.destructive
                    ? "bg-[var(--color-error)] text-white hover:opacity-90"
                    : "bg-[var(--color-primary)] text-white hover:opacity-90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {action.icon && (
                  <action.icon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                )}
                {action.label}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="text-[var(--font-size-sm)] text-[var(--fg-70)] hover:text-[var(--fg)] transition-colors"
      >
        Clear selection
      </button>
    </div>
  )
}

// ============================================================================
// MAIN DATA TABLE COMPONENT
// ============================================================================()

import type { ReactNode } from "react"

export interface DataTableProps<T> {
  idKey: keyof T | ((item: T) => string)
  columns: Column<T>[]
  data: T[]
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  selectable?: boolean
  selection?: SelectionState
  onSelectionChange?: (selection: SelectionState) => void
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  bulkActions?: BulkAction[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  height?: string
}

export function DataTable<T extends Record<string, unknown>>({
  idKey,
  columns,
  data,
  sort,
  onSortChange,
  selectable = false,
  selection,
  onSelectionChange,
  pagination,
  onPaginationChange,
  bulkActions,
  isLoading = false,
  emptyMessage = "No data available",
  className = "",
  height,
}: DataTableProps<T>) {
  // Get row ID
  const getRowId = useCallback(
    (item: T): string => {
      if (typeof idKey === "function") {
        return idKey(item)
      }
      return String(item[idKey] ?? "")
    },
    [idKey]
  )

  // Handle sort
  const handleSort = useCallback(
    (key: string) => {
      if (!onSortChange) return

      const currentDirection = sort?.key === key ? sort.direction : null
      let newDirection: SortDirection = "asc"

      if (currentDirection === "asc") {
        newDirection = "desc"
      } else if (currentDirection === "desc") {
        newDirection = null
      }

      onSortChange({ key, direction: newDirection })
    },
    [sort, onSortChange]
  )

  // Handle row selection
  const handleRowSelect = useCallback(
    (itemId: string) => {
      if (!onSelectionChange || !selection) return

      const newSelected = new Set(selection.selected)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }

      const allSelected = data.length > 0 && newSelected.size === data.length
      const someSelected = !allSelected && newSelected.size > 0

      onSelectionChange({
        selected: newSelected,
        allSelected,
        someSelected,
      })
    },
    [data, selection, onSelectionChange]
  )

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange || !selection) return

    const allIds = data.map(getRowId)
    const newSelected = selection.allSelected ? new Set<string>() : new Set(allIds)

    onSelectionChange({
      selected: newSelected,
      allSelected: !selection.allSelected,
      someSelected: false,
    })
  }, [data, getRowId, selection, onSelectionChange])

  // Handle pagination change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!onPaginationChange || !pagination) return
      onPaginationChange({ ...pagination, page: newPage })
    },
    [pagination, onPaginationChange]
  )

  // Get paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return data

    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return data.slice(start, end)
  }, [data, pagination])

  // Show bulk actions bar
  const showBulkActions = bulkActions && selection && selection.selected.size > 0

  return (
    <div
      className={`flex flex-col bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-lg)] overflow-hidden ${className}`}
    >
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActionsBar
          selectedCount={selection.selected.size}
          actions={bulkActions}
          onClearSelection={() => handleSelectAll()}
        />
      )}

      {/* Table Container */}
      <div
        className="overflow-auto"
        style={{ height }}
        // @design-exception DYNAMIC_VALUE: Table height is a runtime prop that cannot be expressed with static Tailwind classes
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Select All Checkbox */}
              {selectable && (
                <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--fg-10)] bg-[var(--bg-70)]">
                  <input
                    type="checkbox"
                    checked={selection?.allSelected ?? false}
                    ref={(input) => {
                      if (input && selection?.someSelected) {
                        input.indeterminate = true
                      }
                    }}
                    onChange={handleSelectAll}
                    className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] rounded border-[var(--fg-30)] text-[var(--color-primary)] focus:outline-[var(--focus-ring-width)] focus:outline-[var(--color-primary)] focus:outline-offset-[var(--focus-ring-offset)]"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map((column) => (
                <HeaderCell
                  key={column.key}
                  column={column}
                  sort={sort}
                  onSort={onSortChange ? handleSort : undefined}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-[var(--spacing-md)] py-[var(--spacing-2xl)] text-center"
                >
                  <div className="flex items-center justify-center gap-[var(--spacing-sm)] text-[var(--fg-70)]">
                    <div className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] animate-spin rounded-full border-[var(--border-width-thin)] border-[var(--fg-20)] border-t-[var(--color-primary)]" />
                    <span className="text-[var(--font-size-sm)]">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-[var(--spacing-md)] py-[var(--spacing-2xl)] text-center"
                >
                  <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const itemId = getRowId(item)
                const isSelected = selection?.selected.has(itemId) ?? false

                return (
                  <tr
                    key={itemId}
                    className={`hover:bg-[var(--bg-80)] transition-colors ${isSelected ? "bg-[oklch(from_var(--color-primary)_l_c_h_/0.05)]" : ""}`}
                  >
                    {/* Row Checkbox */}
                    {selectable && (
                      <CheckboxCell checked={isSelected} onChange={() => handleRowSelect(itemId)} />
                    )}

                    {/* Data Cells */}
                    {columns.map((column) => (
                      <DataTableCell
                        key={column.key}
                        className={column.className}
                        sticky={column.sticky}
                      >
                        {column.cell(item, index)}
                      </DataTableCell>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && onPaginationChange && (
        <PaginationControls pagination={pagination} onChange={handlePageChange} />
      )}
    </div>
  )
}

export default memo(DataTable) as <T extends Record<string, unknown>>(
  props: DataTableProps<T>
) => ReactNode
