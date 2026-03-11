/* ═══════════════════════════════════════════════════════════════════════════════
   USER MANAGEMENT - User table with filters, sort, and actions
   Advanced user management with role assignments
   ═══════════════════════════════════════════════════════════════════════════════ */

"use client"

import {
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons"
import { memo, useCallback, useMemo, useState } from "react"

type UserRole = "user" | "owner" | "admin"
type UserStatus = "active" | "suspended" | "banned"
type SortField = "name" | "email" | "role" | "status" | "joinedDate"
type SortOrder = "asc" | "desc"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedDate: string
  lastActive: string
  avatar?: string
}

/**
 * User Management Component
 *
 * Features:
 * - Search by name or email
 * - Filter by role and status
 * - Sort by multiple fields
 * - Role assignment
 * - Account actions (suspend, ban, delete)
 * - Bulk actions
 */
export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")
  const [sortField, setSortField] = useState<SortField>("joinedDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  /**
   * Mock users - replace with API call
   */
  const users: User[] = [
    {
      id: "1",
      name: "Ahmed Abdullah",
      email: "ahmed@example.com",
      role: "user",
      status: "active",
      joinedDate: "2025-01-15",
      lastActive: "2025-12-30",
    },
    {
      id: "2",
      name: "Restaurant Owner 1",
      email: "owner@restaurant.com",
      role: "owner",
      status: "active",
      joinedDate: "2025-02-10",
      lastActive: "2025-12-29",
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@shadi.ae",
      role: "admin",
      status: "active",
      joinedDate: "2025-01-01",
      lastActive: "2025-12-30",
    },
    {
      id: "4",
      name: "Spammer User",
      email: "spam@spam.com",
      role: "user",
      status: "banned",
      joinedDate: "2025-03-20",
      lastActive: "2025-11-15",
    },
    {
      id: "5",
      name: "Suspended Account",
      email: "suspended@example.com",
      role: "user",
      status: "suspended",
      joinedDate: "2025-04-05",
      lastActive: "2025-12-01",
    },
    {
      id: "6",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      joinedDate: "2025-06-12",
      lastActive: "2025-12-28",
    },
  ]

  /**
   * Filter and sort users
   */
  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter)
    }

    result = result.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === "joinedDate" || sortField === "lastActive") {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortOrder])

  /**
   * Handle sort
   */
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        setSortField(field)
        setSortOrder("asc")
      }
    },
    [sortField]
  )

  /**
   * Handle select item
   */
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  /**
   * Handle select all
   */
  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === filteredUsers.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredUsers.map((u) => u.id)))
    }
  }, [filteredUsers, selectedItems.size])

  /**
   * Handle bulk action
   */
  const handleBulkAction = useCallback(
    (action: "suspend" | "ban" | "delete") => {
      console.log(`Bulk ${action}:`, Array.from(selectedItems))
      // TODO: Call API
      setSelectedItems(new Set())
    },
    [selectedItems]
  )

  /**
   * Handle user action
   */
  const handleUserAction = useCallback((userId: string, action: "suspend" | "ban" | "delete") => {
    console.log(`${action} user:`, userId)
    // TODO: Call API
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-[var(--spacing-lg)]">
        <h2 className="text-[var(--font-size-2xl)] font-bold text-[var(--fg)]">User Management</h2>
        <p className="text-[var(--font-size-sm)] text-[var(--fg-60)]">
          {filteredUsers.length} users total
        </p>
      </div>

      {/* Filters */}
      <div className="p-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--fg-10)] bg-[var(--card-bg)] mb-[var(--spacing-lg)]">
        {/* Search */}
        <div className="mb-[var(--spacing-md)]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-50)]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[var(--spacing-2xl)] pr-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-base)] text-[var(--fg)] placeholder:text-[var(--fg-40)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-md)]">
          {/* Role Filter */}
          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--fg-70)] mb-[var(--spacing-xs)]">
              Sort By
            </label>
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-")
                setSortField(field as SortField)
                setSortOrder(order as SortOrder)
              }}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--fg-20)] bg-[var(--bg)] text-[var(--font-size-sm)] text-[var(--fg)]"
            >
              <option value="joinedDate-desc">Newest First</option>
              <option value="joinedDate-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="role-asc">Role</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--spacing-md)] p-[var(--spacing-md)] mb-[var(--spacing-md)] rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
          <p className="text-[var(--font-size-sm)] text-[var(--fg)]">
            <span className="font-semibold">{selectedItems.size}</span> users selected
          </p>
          <div className="flex items-center gap-[var(--spacing-sm)]">
            <button
              type="button"
              onClick={() => handleBulkAction("suspend")}
              className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-warning)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              Suspend
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction("ban")}
              className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--color-error)] text-[var(--color-white)] text-[var(--font-size-sm)] font-medium hover:opacity-[var(--hover-opacity)] transition-opacity"
            >
              Ban
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction("delete")}
              className="px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--color-error)] text-[var(--color-error)] text-[var(--font-size-sm)] font-medium hover:bg-[var(--color-error)]/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* User Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-[var(--spacing-5xl)]">
          <UserIcon className="h-[var(--icon-size-3xl)] w-[var(--icon-size-3xl)] text-[var(--fg-20)] mx-auto mb-[var(--spacing-md)]" />
          <h2 className="text-[var(--font-size-xl)] font-semibold text-[var(--fg)] mb-[var(--spacing-sm)]">
            No users found
          </h2>
          <p className="text-[var(--font-size-base)] text-[var(--fg-60)]">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="border border-[var(--fg-10)] rounded-[var(--radius-lg)] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[auto_2fr_2fr_1fr_1fr_1fr_1fr] gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--fg-3)] border-b border-[var(--fg-10)]">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredUsers.length && filteredUsers.length > 0}
              onChange={handleSelectAll}
              className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded border-[var(--fg-30)]"
            />
            <SortableHeader
              field="name"
              label="User"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              field="email"
              label="Email"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              field="role"
              label="Role"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              field="status"
              label="Status"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              field="joinedDate"
              label="Joined"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={handleSort}
            />
            <span className="text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)]">
              Actions
            </span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[var(--fg-10)]">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                selected={selectedItems.has(user.id)}
                onSelect={handleSelectItem}
                onAction={handleUserAction}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Sortable Header
 */
interface SortableHeaderProps {
  field: SortField
  label: string
  currentField: SortField
  currentOrder: SortOrder
  onSort: (field: SortField) => void
}

function SortableHeader({ field, label, currentField, currentOrder, onSort }: SortableHeaderProps) {
  const isActive = currentField === field

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] font-semibold text-[var(--fg-70)] hover:text-[var(--fg)] transition-colors"
    >
      {label}
      {isActive && (
        <span>
          {currentOrder === "asc" ? (
            <ChevronUpIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          ) : (
            <ChevronDownIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
          )}
        </span>
      )}
    </button>
  )
}

/**
 * User Row
 */
interface UserRowProps {
  user: User
  selected: boolean
  onSelect: (id: string) => void
  onAction: (userId: string, action: "suspend" | "ban" | "delete") => void
}

function UserRow({ user, selected, onSelect, onAction }: UserRowProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_2fr_2fr_1fr_1fr_1fr_1fr] gap-[var(--spacing-md)] p-[var(--spacing-md)] hover:bg-[var(--fg-3)] transition-colors">
      {/* Checkbox */}
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(user.id)}
          className="w-[var(--icon-size-md)] h-[var(--icon-size-md)] rounded border-[var(--fg-30)]"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-[var(--spacing-sm)]">
        <div className="h-[40px] w-[40px] rounded-[var(--radius-full)] bg-[var(--fg-5)] flex items-center justify-center flex-shrink-0">
          <UserIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-50)]" />
        </div>
        <div className="min-w-0">
          <p className="text-[var(--font-size-base)] font-semibold text-[var(--fg)] truncate">
            {user.name}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center">
        <p className="text-[var(--font-size-sm)] text-[var(--fg-70)] truncate">{user.email}</p>
      </div>

      {/* Role */}
      <div className="flex items-center">
        <RoleBadge role={user.role} />
      </div>

      {/* Status */}
      <div className="flex items-center">
        <UserStatusBadge status={user.status} />
      </div>

      {/* Joined Date */}
      <div className="flex items-center text-[var(--font-size-sm)] text-[var(--fg-60)]">
        {new Date(user.joinedDate).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="p-[var(--spacing-xs)] rounded-[var(--radius-md)] hover:bg-[var(--fg-10)] transition-colors"
            aria-label="Actions"
          >
            <AdjustmentsHorizontalIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-[var(--fg-60)]" />
          </button>

          {showActions && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />

              {/* Dropdown */}
              <div className="absolute right-0 z-20 mt-[var(--spacing-xs)] w-[160px] bg-[var(--bg)] border border-[var(--fg-10)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)]">
                <button
                  type="button"
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-sm)] text-[var(--fg)] hover:bg-[var(--fg-3)] flex items-center gap-[var(--spacing-sm)]"
                >
                  <PencilIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                  Edit
                </button>
                {user.status === "active" && (
                  <button
                    type="button"
                    onClick={() => {
                      onAction(user.id, "suspend")
                      setShowActions(false)
                    }}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-sm)] text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10 flex items-center gap-[var(--spacing-sm)]"
                  >
                    <ShieldCheckIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                    Suspend
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onAction(user.id, "delete")
                    setShowActions(false)
                  }}
                  className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-sm)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 flex items-center gap-[var(--spacing-sm)]"
                >
                  <TrashIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Role Badge
 */
interface RoleBadgeProps {
  role: UserRole
}

function RoleBadge({ role }: RoleBadgeProps) {
  const config = {
    user: { label: "User", icon: UserIcon, color: "bg-[var(--fg-10)] text-[var(--fg-70)]" },
    owner: {
      label: "Owner",
      icon: BuildingStorefrontIcon,
      color: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    },
    admin: {
      label: "Admin",
      icon: ShieldCheckIcon,
      color: "bg-[var(--color-accent-rust)]/10 text-[var(--color-accent-rust)]",
    },
  }

  const { label, icon: Icon, color } = config[role]

  return (
    <span
      className={`inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium ${color}`}
    >
      <Icon className="h-[var(--icon-size-xs)] w-[var(--icon-size-xs)]" />
      {label}
    </span>
  )
}

/**
 * User Status Badge
 */
interface UserStatusBadgeProps {
  status: UserStatus
}

function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = {
    active: { label: "Active", color: "bg-[var(--color-success)]/10 text-[var(--color-success)]" },
    suspended: {
      label: "Suspended",
      color: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    },
    banned: { label: "Banned", color: "bg-[var(--color-error)]/10 text-[var(--color-error)]" },
  }

  const { label, color } = config[status]

  return (
    <span
      className={`inline-flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-full)] text-[var(--font-size-xs)] font-medium uppercase ${color}`}
    >
      {label}
    </span>
  )
}

export const UserManagement = memo(UserManagement)
