/**
 * Data Table Example - User Management
 *
 * Example implementation showing how to use the DataTable.
 * Uses design tokens exclusively.
 */

"use client"

import { CheckIcon, PencilIcon, TrashIcon, UserIcon } from "@/components/icons"
import { memo, useMemo, useState } from "react"
import { DataTable } from "./DataTable"
import type { BulkAction, Column, PaginationState, SelectionState, SortState } from "./types"
import { useExport } from "./useExport"

// ============================================================================
// EXAMPLE DATA TYPES
// ============================================================================()

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  status: "Active" | "Inactive" | "Pending"
  createdAt: Date
  [key: string]: unknown
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Al Rashid",
    email: "ahmed@example.com",
    role: "Admin",
    status: "Active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Editor",
    status: "Active",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Mohammed Ali",
    email: "mohammed@example.com",
    role: "Viewer",
    status: "Pending",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Fatima Hassan",
    email: "fatima@example.com",
    role: "Editor",
    status: "Inactive",
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "5",
    name: "John Smith",
    email: "john@example.com",
    role: "Viewer",
    status: "Active",
    createdAt: new Date("2024-04-12"),
  },
]

// ============================================================================
// EXAMPLE COMPONENT
// ============================================================================()

export function DataTableExample() {
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" })
  const [selection, setSelection] = useState<SelectionState>({
    selected: new Set(),
    allSelected: false,
    someSelected: false,
  })
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: mockUsers.length,
  })

  // Sort and filter data
  const sortedData = useMemo(() => {
    if (!sort.direction) return mockUsers

    return [...mockUsers].sort((a, b) => {
      const aVal = a[sort.key as keyof User]
      const bVal = b[sort.key as keyof User]

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return sort.direction === "asc"
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime()
      }

      return 0
    })
  }, [sort])

  // Column definitions
  const userColumns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="flex h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] items-center justify-center rounded-full bg-[var(--fg-10)]">
            <UserIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-[var(--fg-70)]" />
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      cell: (user) => <span className="text-[var(--fg-70)]">{user.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      cell: (user) => {
        const roleColors = {
          Admin: "bg-[oklch(from_var(--color-error)_l_c_h_/0.1)] text-[var(--color-error)]",
          Editor: "bg-[oklch(from_var(--color-primary)_l_c_h_/0.1)] text-[var(--color-primary)]",
          Viewer: "bg-[oklch(from_var(--fg)_l_c_h_/0.1)] text-[var(--fg)]",
        }
        return (
          <span
            className={`px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--font-size-xs)] font-medium ${roleColors[user.role]}`}
          >
            {user.role}
          </span>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (user) => {
        const statusColors = {
          Active: "bg-[oklch(from_var(--color-success)_l_c_h_/0.1)] text-[var(--color-success)]",
          Inactive: "bg-[oklch(from_var(--fg)_l_c_h_/0.1)] text-[var(--fg-70)]",
          Pending: "bg-[oklch(from_var(--color-warning)_l_c_h_/0.1)] text-[var(--color-warning)]",
        }
        return (
          <span
            className={`px-[var(--spacing-xs)] py-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--font-size-xs)] font-medium ${statusColors[user.status]}`}
          >
            {user.status}
          </span>
        )
      },
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cell: (user) => (
        <span className="text-[var(--fg-70)]">{user.createdAt.toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (_user) => (
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <button
            type="button"
            className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--fg-70)] hover:bg-[var(--bg-80)] transition-colors"
            title="Edit"
          >
            <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          </button>
          <button
            type="button"
            className="p-[var(--spacing-xs)] rounded-[var(--radius-sm)] text-[var(--color-error)] hover:bg-[oklch(from_var(--color-error)_l_c_h_/0.1)] transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          </button>
        </div>
      ),
    },
  ]

  // Export functionality
  const { exportToCSV, exportToJSON } = useExport({
    data: mockUsers,
    columns: userColumns,
    filename: "users",
  })

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      key: "activate",
      label: "Activate",
      icon: CheckIcon,
      onClick: (selected) => console.log("Activate:", selected),
    },
    {
      key: "delete",
      label: "Delete",
      icon: TrashIcon,
      destructive: true,
      onClick: (selected) => console.log("Delete:", selected),
      disabled: (count) => count === 0,
    },
  ]

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">
            User Management
          </h2>
          <p className="text-[var(--font-size-sm)] text-[var(--fg-70)]">
            Manage user accounts and permissions
          </p>
        </div>

        <div className="flex items-center gap-[var(--spacing-sm)]">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border-[var(--border-width-thin)] border-[var(--fg-20)] text-[var(--fg)] text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:bg-[var(--bg-80)]"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportToJSON}
            className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-[var(--font-size-sm)] font-medium transition-all duration-[var(--duration-fast)] hover:opacity-90"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        idKey="id"
        columns={userColumns}
        data={sortedData}
        sort={sort}
        onSortChange={setSort}
        selectable={true}
        selection={selection}
        onSelectionChange={setSelection}
        pagination={pagination}
        onPaginationChange={setPagination}
        bulkActions={bulkActions}
      />
    </div>
  )
}

export default memo(DataTableExample)
